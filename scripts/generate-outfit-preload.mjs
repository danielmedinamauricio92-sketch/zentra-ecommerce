import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();
const stockFile = path.join(rootDir, "outfit-stock-products.json");
const driveFile = path.join(rootDir, "outfit-drive-catalog.json");
const productsOutputFile = path.join(rootDir, "back", "src", "helpers", "preLoadProducts.ts");
const categoriesOutputFile = path.join(rootDir, "back", "src", "helpers", "preLoadCategories.ts");
const imageMapFile = path.join(rootDir, "outfit-cloudinary-image-map.json");
const CLOUDINARY_FOLDER = process.env.CLOUDINARY_FOLDER || "zentra/outfit";

let { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
  process.env;

if (process.env.CLOUDINARY_URL) {
  const cloudinaryUrl = new URL(process.env.CLOUDINARY_URL);
  CLOUDINARY_API_KEY ||= decodeURIComponent(cloudinaryUrl.username);
  CLOUDINARY_API_SECRET ||= decodeURIComponent(cloudinaryUrl.password);
  CLOUDINARY_CLOUD_NAME ||= cloudinaryUrl.hostname;
}

const hasCloudinaryCredentials =
  Boolean(CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET);

const categories = [
  "Vans",
  "Puma",
  "Asics",
  "Nike",
  "Adidas",
  "New Balance",
  "Botines",
  "Ojotas",
  "DC",
  "Caterpillar",
  "Louis Vuitton",
  "Otros",
];

function normalize(value) {
  return String(value || "")
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Z0-9]+/g, " ")
    .trim();
}

function slug(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function categoryFor(product) {
  const brand = normalize(product.brand);
  const name = normalize(product.name);

  if (brand.includes("VANS")) return "Vans";
  if (brand.includes("PUMA")) return "Puma";
  if (brand.includes("ASICS")) return "Asics";
  if (brand.includes("NIKE") || name.includes("PEGASUS") || name.includes("DUNK") || name.includes("AIR") || name.includes("RETRO") || name.includes("JORDAN")) return "Nike";
  if (brand.includes("ADIDAS") || name.includes("CAMPUS") || name.includes("FORUM") || name.includes("SAMBA") || name.includes("ADI") || name.includes("SUPERSTAR") || name.includes("SUPERNOVA")) return "Adidas";
  if (brand.includes("NEW BALANCE") || name.includes("NB")) return "New Balance";
  if (brand.includes("BOTINES") || name.includes("BOTIN")) return "Botines";
  if (brand.includes("OJOTAS")) return "Ojotas";
  if (brand.includes("DC")) return "DC";
  if (brand.includes("CATERPILLAR") || name.includes("BORCEGOS")) return "Caterpillar";
  if (brand.includes("LOUIS") || name.includes("LV")) return "Louis Vuitton";

  return "Otros";
}

function tokenScore(product, driveProduct) {
  const a = new Set(normalize(product.name).split(/\s+/).filter(Boolean));
  const b = new Set(
    normalize(`${driveProduct.brand} ${driveProduct.model} ${driveProduct.color}`)
      .split(/\s+/)
      .filter(Boolean)
  );
  let hits = 0;

  for (const token of a) {
    if (b.has(token)) hits += 1;
  }

  return hits / Math.max(1, a.size);
}

function findImage(product, driveProducts) {
  const category = categoryFor(product);
  const directBrand = driveProducts.filter(
    (driveProduct) => categoryFor({ brand: driveProduct.brand, name: driveProduct.model }) === category
  );
  const candidates = directBrand.length > 0 ? directBrand : driveProducts;
  const [best] = candidates
    .map((driveProduct) => ({
      driveProduct,
      score: tokenScore(product, driveProduct),
    }))
    .sort((a, b) => b.score - a.score);

  if (best?.driveProduct?.images?.[0]) {
    return {
      image: best.driveProduct.images[0],
      source: `${best.driveProduct.brand} ${best.driveProduct.model} ${best.driveProduct.color}`,
      score: best.score,
    };
  }

  return null;
}

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

async function uploadImage(product, imageSource, imageMap) {
  const publicId = slug(product.name);
  const basePublicId = publicId.replace(/-variante-\d+$/g, "");

  if (imageMap[publicId]) {
    return imageMap[publicId].secureUrl;
  }

  if (imageMap[basePublicId]) {
    imageMap[publicId] = imageMap[basePublicId];
    return imageMap[publicId].secureUrl;
  }

  if (!hasCloudinaryCredentials) {
    throw new Error(`Missing Cloudinary credentials to upload ${product.name}.`);
  }

  const sourceResponse = await fetchWithRetry(imageSource.image.downloadUrl);

  if (!sourceResponse.ok) {
    throw new Error(`Drive image download failed for ${product.name}`);
  }

  const bytes = await sourceResponse.arrayBuffer();
  const timestamp = Math.floor(Date.now() / 1000).toString();
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
  formData.append("file", new Blob([bytes]), imageSource.image.name);

  const uploadResponse = await fetchWithRetry(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );
  const data = await uploadResponse.json();

  if (!uploadResponse.ok) {
    throw new Error(data.error?.message || `Cloudinary upload failed for ${product.name}`);
  }

  imageMap[publicId] = {
    secureUrl: data.secure_url,
    driveImageId: imageSource.image.id,
    matchedSource: imageSource.source,
    matchScore: imageSource.score,
  };
  await fs.writeFile(imageMapFile, `${JSON.stringify(imageMap, null, 2)}\n`);

  return data.secure_url;
}

async function fetchWithRetry(url, options = {}, retries = 4) {
  let lastError;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 120000);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeout);
      return response;
    } catch (error) {
      clearTimeout(timeout);
      lastError = error;

      if (attempt < retries) {
        await new Promise((resolve) =>
          setTimeout(resolve, 1500 * (attempt + 1))
        );
      }
    }
  }

  throw lastError;
}

function jsString(value) {
  return JSON.stringify(value);
}

function buildDescription(product) {
  const sizes = Object.entries(product.sizeStock)
    .map(([size, stock]) => `${size}: ${stock}`)
    .join(", ");
  const notes = [
    `${product.name} seleccionado por Outfit Club para un look urbano y comodo.`,
    product.fitNote ? `Calce: ${product.fitNote}.` : "",
    sizes ? `Stock por talle: ${sizes}.` : "",
  ].filter(Boolean);

  return notes.join(" ");
}

function buildCategoriesFile() {
  return `import { AppDataSource } from "../config/dataSource";
import { Category } from "../entities/Category";
import { CategoryRepository } from "../repositories/category.respository";

interface ICategory {
  name: string;
}

export const categoriesToPreLoad: ICategory[] = ${JSON.stringify(
    categories.map((name) => ({ name })),
    null,
    2
  )};

export const preLoadCategories = async () => {
  const existingCategories = await CategoryRepository.find();
  const categoriesByName = new Map(
    existingCategories.map((category) => [category.name.toLowerCase(), category])
  );

  for (const categoryToPreLoad of categoriesToPreLoad) {
    if (!categoriesByName.has(categoryToPreLoad.name.toLowerCase())) {
      await AppDataSource.createQueryBuilder()
        .insert()
        .into(Category)
        .values(categoryToPreLoad)
        .execute();
    }
  }

  console.log("Categories preloaded");
};
`;
}

function buildProductsFile(products) {
  const productRows = products
    .map(
      (product) =>
        `  { name: ${jsString(product.name)}, price: ${product.price}, image: ${jsString(
          product.image
        )}, categoryName: ${jsString(product.categoryName)}, stock: ${
          product.stock
        }, description: ${jsString(product.description)}, isOffer: ${product.isOffer}, isActive: true }`
    )
    .join(",\n");

  return `import { AppDataSource } from "../config/dataSource";
import { Product } from "../entities/Product";
import { CategoryRepository } from "../repositories/category.respository";
import { ProductRepository } from "../repositories/product.repository";

interface IProduct {
  name: string;
  price: number;
  description: string;
  image: string;
  categoryName: string;
  stock: number;
  isOffer?: boolean;
  isActive?: boolean;
}

const productsToPreLoad: IProduct[] = [
${productRows}
];

export const preLoadProducts = async () => {
  const products = await ProductRepository.find();
  const categories = await CategoryRepository.find();
  const categoriesByName = new Map(
    categories.map((category) => [category.name.toLowerCase(), category])
  );
  const existingProductsByName = new Map(
    products.map((product) => [product.name, product])
  );
  const missingProducts: Partial<Product>[] = [];
  let updatedProducts = 0;

  for (const productToPreLoad of productsToPreLoad) {
    const category = categoriesByName.get(productToPreLoad.categoryName.toLowerCase());

    if (!category) {
      console.warn(\`Category not found for product \${productToPreLoad.name}\`);
      continue;
    }

    const nextProduct = {
      name: productToPreLoad.name,
      price: productToPreLoad.price,
      description: productToPreLoad.description,
      image: productToPreLoad.image,
      categoryId: category.id,
      stock: productToPreLoad.stock,
      isOffer: Boolean(productToPreLoad.isOffer),
      isActive: productToPreLoad.isActive ?? true,
    };
    const existingProduct = existingProductsByName.get(productToPreLoad.name);

    if (!existingProduct) {
      missingProducts.push(nextProduct);
      continue;
    }

    let changed = false;
    const fieldsToSync: (keyof typeof nextProduct)[] = [
      "price",
      "description",
      "image",
      "categoryId",
      "stock",
      "isOffer",
      "isActive",
    ];

    for (const field of fieldsToSync) {
      if (existingProduct[field] !== nextProduct[field]) {
        existingProduct[field] = nextProduct[field] as never;
        changed = true;
      }
    }

    if (changed) {
      await ProductRepository.save(existingProduct);
      updatedProducts += 1;
    }
  }

  if (missingProducts.length > 0) {
    await AppDataSource.createQueryBuilder()
      .insert()
      .into(Product)
      .values(missingProducts)
      .execute();
  }

  const activeProductNames = new Set(
    productsToPreLoad.map((product) => product.name)
  );
  const staleProducts = products.filter(
    (product) => !activeProductNames.has(product.name) && product.isActive !== false
  );

  for (const staleProduct of staleProducts) {
    staleProduct.isActive = false;
    await ProductRepository.save(staleProduct);
  }

  console.log(
    \`\${missingProducts.length} products preloaded, \${updatedProducts} products updated, \${staleProducts.length} products disabled\`
  );
};
`;
}

const stockProducts = JSON.parse(await fs.readFile(stockFile, "utf8")).products;
const driveProducts = JSON.parse(await fs.readFile(driveFile, "utf8")).products;
let imageMap = {};

try {
  imageMap = JSON.parse(await fs.readFile(imageMapFile, "utf8"));
} catch {
  imageMap = {};
}

const outputProducts = [];

for (const product of stockProducts) {
  const imageSource = findImage(product, driveProducts);

  if (!imageSource) {
    console.warn(`No image found for ${product.name}`);
    continue;
  }

  const image = await uploadImage(product, imageSource, imageMap);

  outputProducts.push({
    ...product,
    image,
    categoryName: categoryFor(product),
    description: buildDescription(product),
  });

  console.log(`${outputProducts.length}/${stockProducts.length} ${product.name}`);
}

await fs.writeFile(categoriesOutputFile, buildCategoriesFile());
await fs.writeFile(productsOutputFile, buildProductsFile(outputProducts));

console.log(`Wrote ${categoriesOutputFile}`);
console.log(`Wrote ${productsOutputFile}`);
