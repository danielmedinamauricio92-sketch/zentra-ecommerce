import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();
const imagesDir = path.join(rootDir, "front", "public", "images");
const preloadFile = path.join(rootDir, "back", "src", "helpers", "preLoadProducts.ts");
const outputFile = path.join(rootDir, "cloudinary-image-map.json");
const uploadTimeoutMs = Number(process.env.CLOUDINARY_UPLOAD_TIMEOUT_MS || 120000);
const uploadConcurrency = Number(process.env.CLOUDINARY_UPLOAD_CONCURRENCY || 4);

const {
  CLOUDINARY_URL,
  CLOUDINARY_FOLDER = "zentra/products",
} = process.env;

let { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
  process.env;

if (CLOUDINARY_URL && (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET)) {
  const cloudinaryUrl = new URL(CLOUDINARY_URL);
  CLOUDINARY_API_KEY = decodeURIComponent(cloudinaryUrl.username);
  CLOUDINARY_API_SECRET = decodeURIComponent(cloudinaryUrl.password);
  CLOUDINARY_CLOUD_NAME = cloudinaryUrl.hostname;
}

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  console.error(
    "Missing CLOUDINARY_URL or CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET."
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

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), uploadTimeoutMs);
  let response;

  try {
    response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
        signal: controller.signal,
      }
    );
  } finally {
    clearTimeout(timeout);
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      `Cloudinary upload failed for ${fileName}: ${data.error?.message || response.statusText}`
    );
  }

  return data.secure_url;
}

async function readExistingMap() {
  try {
    return JSON.parse(await fs.readFile(outputFile, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") {
      return {};
    }

    throw error;
  }
}

async function runWithConcurrency(items, worker) {
  const queue = [...items];
  const workers = Array.from(
    { length: Math.min(uploadConcurrency, queue.length) },
    async () => {
      while (queue.length > 0) {
        const item = queue.shift();
        await worker(item);
      }
    }
  );

  await Promise.all(workers);
}

const source = await fs.readFile(preloadFile, "utf8");
const referencedImages = getReferencedImages(source);
const imageMap = await readExistingMap();
let nextSource = source;
const pendingImages = referencedImages.filter((fileName) => !imageMap[`/images/${fileName}`]);

console.log(
  `Uploading ${pendingImages.length} pending product images to Cloudinary (${referencedImages.length} total, concurrency ${uploadConcurrency})...`
);

await runWithConcurrency(pendingImages, async (fileName) => {
  const localPath = `/images/${fileName}`;
  console.log(`Uploading ${localPath}...`);
  const secureUrl = await uploadImage(fileName);

  imageMap[localPath] = secureUrl;
  await fs.writeFile(outputFile, `${JSON.stringify(imageMap, null, 2)}\n`);
  console.log(`${localPath} -> ${secureUrl}`);
});

for (const [localPath, secureUrl] of Object.entries(imageMap)) {
  nextSource = nextSource.replaceAll(`image: "${localPath}"`, `image: "${secureUrl}"`);
}

await fs.writeFile(preloadFile, nextSource);
await fs.writeFile(outputFile, `${JSON.stringify(imageMap, null, 2)}\n`);

console.log(`Updated ${preloadFile}`);
console.log(`Wrote ${outputFile}`);
