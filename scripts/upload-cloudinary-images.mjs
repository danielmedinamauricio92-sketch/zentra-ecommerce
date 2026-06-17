import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();
const imagesDir = path.join(rootDir, "front", "public", "images");
const preloadFile = path.join(rootDir, "back", "src", "helpers", "preLoadProducts.ts");
const outputFile = path.join(rootDir, "cloudinary-image-map.json");

const {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_FOLDER = "zentra/products",
} = process.env;

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  console.error(
    "Missing CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY or CLOUDINARY_API_SECRET."
  );
  process.exit(1);
}

const extensionToMime = new Map([
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".png", "image/png"],
  [".webp", "image/webp"],
]);

function signParams(params) {
  const payload = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  return crypto
    .createHash("sha1")
    .update(`${payload}${CLOUDINARY_API_SECRET}`)
    .digest("hex");
}

function getReferencedImages(source) {
  const matches = source.matchAll(/image:\s*"\/images\/([^"]+)"/g);
  return [...new Set([...matches].map((match) => match[1]))].sort();
}

async function uploadImage(fileName) {
  const filePath = path.join(imagesDir, fileName);
  const extension = path.extname(fileName).toLowerCase();
  const mimeType = extensionToMime.get(extension);

  if (!mimeType) {
    throw new Error(`Unsupported image type: ${fileName}`);
  }

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const publicId = path.basename(fileName, extension);
  const paramsToSign = {
    folder: CLOUDINARY_FOLDER,
    overwrite: "true",
    public_id: publicId,
    timestamp,
  };

  const formData = new FormData();
  formData.append("api_key", CLOUDINARY_API_KEY);
  formData.append("folder", CLOUDINARY_FOLDER);
  formData.append("overwrite", "true");
  formData.append("public_id", publicId);
  formData.append("timestamp", timestamp);
  formData.append("signature", signParams(paramsToSign));

  const bytes = await fs.readFile(filePath);
  formData.append("file", new Blob([bytes], { type: mimeType }), fileName);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      `Cloudinary upload failed for ${fileName}: ${data.error?.message || response.statusText}`
    );
  }

  return data.secure_url;
}

const source = await fs.readFile(preloadFile, "utf8");
const referencedImages = getReferencedImages(source);
const imageMap = {};
let nextSource = source;

console.log(`Uploading ${referencedImages.length} product images to Cloudinary...`);

for (const fileName of referencedImages) {
  const localPath = `/images/${fileName}`;
  const secureUrl = await uploadImage(fileName);

  imageMap[localPath] = secureUrl;
  nextSource = nextSource.replaceAll(`image: "${localPath}"`, `image: "${secureUrl}"`);
  console.log(`${localPath} -> ${secureUrl}`);
}

await fs.writeFile(preloadFile, nextSource);
await fs.writeFile(outputFile, `${JSON.stringify(imageMap, null, 2)}\n`);

console.log(`Updated ${preloadFile}`);
console.log(`Wrote ${outputFile}`);
