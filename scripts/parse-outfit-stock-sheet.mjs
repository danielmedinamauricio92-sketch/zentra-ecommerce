import fs from "node:fs/promises";

const inputFile = process.argv[2] || "outfit-stock-sheet.csv";
const outputFile = process.argv[3] || "outfit-stock-products.json";
const sizes = [34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45];

function parseCsv(source) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    const next = source[index + 1];

    if (quoted) {
      if (char === '"' && next === '"') {
        cell += '"';
        index += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        cell += char;
      }

      continue;
    }

    if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      row.push(cell);
      cell = "";
    } else if (char === "\n") {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else if (char !== "\r") {
      cell += char;
    }
  }

  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }

  return rows;
}

function toNumber(value) {
  const number = Number(String(value || "").replace(/[^0-9.-]/g, ""));
  return Number.isFinite(number) ? number : 0;
}

function normalizeText(value) {
  return String(value || "")
    .replace(/Â°/g, "°")
    .replace(/Â¡/g, "¡")
    .replace(/Â¿/g, "¿")
    .replace(/Â/g, "")
    .replace(/ï£¿/g, "")
    .trim()
    .replace(/\s+/g, " ");
}

function inferBrand(name) {
  const normalized = name.toUpperCase();

  if (normalized.startsWith("NB") || normalized.startsWith("NEW ")) return "NEW BALANCE";
  if (normalized.startsWith("CAMP") || normalized.startsWith("FORUM") || normalized.startsWith("SAMBA") || normalized.startsWith("ADI") || normalized.startsWith("SUPER") || normalized.startsWith("BAD ")) return "ADIDAS";
  if (normalized.startsWith("PEGASUS") || normalized.startsWith("DUNK") || normalized.startsWith("AIR ") || normalized.startsWith("RETRO") || normalized.startsWith("JORDAN") || normalized.startsWith("TRAVIS") || normalized.startsWith("ZOOMX") || normalized.startsWith("SB ")) return "NIKE";
  if (normalized.startsWith("BOTIN")) return "BOTINES DE FUTBOL";
  if (normalized.startsWith("BORCEGOS")) return "CATERPILLAR";

  return normalized.split(" ")[0];
}

function productSlug(value) {
  return normalizeText(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const rows = parseCsv(await fs.readFile(inputFile, "utf8"));
const products = [];
const nameCounts = new Map();

for (const row of rows.slice(2)) {
  const name = normalizeText(row[3]);
  const price = toNumber(row[20]);
  const listedTotal = toNumber(row[18]);
  const sizeStock = Object.fromEntries(
    sizes
      .map((size, index) => [String(size), toNumber(row[5 + index])])
      .filter(([, stock]) => stock > 0)
  );
  const computedTotal = Object.values(sizeStock).reduce((sum, stock) => sum + stock, 0);
  const stock = listedTotal || computedTotal;

  if (!name || (!price && !stock)) {
    continue;
  }

  const occurrence = (nameCounts.get(name) || 0) + 1;
  nameCounts.set(name, occurrence);
  const duplicateCount = rows
    .slice(2)
    .map((sourceRow) => normalizeText(sourceRow[3]))
    .filter((sourceName) => sourceName === name).length;
  const uniqueName = duplicateCount > 1 ? `${name} - Variante ${occurrence}` : name;

  products.push({
    slug: productSlug(uniqueName),
    name: uniqueName,
    brand: inferBrand(name),
    price,
    stock,
    sizeStock,
    fitNote: normalizeText(row[1]),
    isOffer: normalizeText(row[21]).toUpperCase().includes("OFERTA"),
  });
}

const payload = {
  generatedAt: new Date().toISOString(),
  summary: {
    products: products.length,
    offers: products.filter((product) => product.isOffer).length,
    totalStock: products.reduce((sum, product) => sum + product.stock, 0),
  },
  products,
};

await fs.writeFile(outputFile, `${JSON.stringify(payload, null, 2)}\n`);
console.log(payload.summary);
console.log(`Wrote ${outputFile}`);
