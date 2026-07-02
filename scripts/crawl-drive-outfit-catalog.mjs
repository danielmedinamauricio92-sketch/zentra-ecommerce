import fs from "node:fs/promises";

const rootFolderId = process.argv[2] || "17vlYfXKor1cXUrJ5pCM5j2VMqqiHajvk";
const outputFile = process.argv[3] || "outfit-drive-catalog.json";

const driveFolderUrl = (folderId) =>
  `https://drive.google.com/drive/mobile/folders/${folderId}`;
const driveDownloadUrl = (fileId) =>
  `https://drive.google.com/uc?export=download&id=${fileId}`;

const htmlDecode = (value) =>
  value
    .replaceAll("&amp;", "&")
    .replaceAll("&#39;", "'")
    .replaceAll("&quot;", '"')
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");

async function readFolder(folderId) {
  const response = await fetch(driveFolderUrl(folderId));

  if (!response.ok) {
    throw new Error(`Drive folder ${folderId} failed: ${response.status}`);
  }

  const html = await response.text();
  const driveItems = getDriveItems(html);

  if (driveItems.length > 0) {
    return {
      folders: driveItems
        .filter((item) => item.mimeType === "application/vnd.google-apps.folder")
        .map(({ id, name }) => ({ id, name })),
      images: driveItems
        .filter((item) => item.mimeType.startsWith("image/"))
        .map(({ id, name }) => ({
          id,
          name,
          downloadUrl: driveDownloadUrl(id),
        })),
    };
  }

  const folderRows = [
    ...html.matchAll(
      /<tr data-selectable data-id="([^"]+)"[\s\S]*?data-tooltip="([^"]+) Shared folder"/g
    ),
  ].map((match) => ({
    id: match[1],
    name: htmlDecode(match[2].trim()),
  }));
  const imageRows = [
    ...html.matchAll(
      /<tr data-selectable data-id="([^"]+)"[\s\S]*?data-tooltip="([^"]+) Image"/g
    ),
  ].map((match) => ({
    id: match[1],
    name: htmlDecode(match[2].trim()),
    downloadUrl: driveDownloadUrl(match[1]),
  }));

  return {
    folders: dedupeById(folderRows),
    images: dedupeById(imageRows),
  };
}

function getDriveItems(html) {
  const match = html.match(/window\['_DRIVE_ivd'\] = '([\s\S]*?)';/);

  if (!match) {
    return [];
  }

  const jsonSource = match[1]
    .replace(/\\x([0-9A-Fa-f]{2})/g, (_, hex) =>
      String.fromCharCode(Number.parseInt(hex, 16))
    )
    .replace(/\\'/g, "'")
    .replace(/\\\\/g, "\\");

  const data = JSON.parse(jsonSource);
  const rows = data?.[0] || [];

  return rows
    .filter((row) => Array.isArray(row) && row.length >= 4)
    .map((row) => ({
      id: row[0],
      name: htmlDecode(String(row[2] || "").trim()),
      mimeType: String(row[3] || ""),
    }))
    .filter((item) => item.id && item.name && item.mimeType);
}

function dedupeById(items) {
  return [...new Map(items.map((item) => [item.id, item])).values()];
}

async function crawlColorFolder(brand, model, colorFolder) {
  const { images } = await readFolder(colorFolder.id);

  return {
    brand,
    model,
    color: colorFolder.name,
    folderId: colorFolder.id,
    images,
  };
}

async function main() {
  const root = await readFolder(rootFolderId);
  const catalog = [];

  for (const brandFolder of root.folders) {
    if (brandFolder.name.toLowerCase().includes("cuadro de medidas")) {
      continue;
    }

    const brandFolderContent = await readFolder(brandFolder.id);

    if (brandFolderContent.images.length > 0) {
      catalog.push({
        brand: brandFolder.name,
        model: brandFolder.name,
        color: "Unico",
        folderId: brandFolder.id,
        images: brandFolderContent.images,
      });
    }

    for (const modelFolder of brandFolderContent.folders) {
      const modelFolderContent = await readFolder(modelFolder.id);

      if (modelFolderContent.images.length > 0) {
        catalog.push({
          brand: brandFolder.name,
          model: modelFolder.name,
          color: "Unico",
          folderId: modelFolder.id,
          images: modelFolderContent.images,
        });
        continue;
      }

      for (const colorFolder of modelFolderContent.folders) {
        catalog.push(
          await crawlColorFolder(brandFolder.name, modelFolder.name, colorFolder)
        );
      }
    }
  }

  const withImages = catalog.filter((item) => item.images.length > 0);
  const summary = withImages.reduce(
    (acc, item) => {
      acc.brands.add(item.brand);
      acc.models.add(`${item.brand} ${item.model}`);
      acc.images += item.images.length;
      return acc;
    },
    { brands: new Set(), models: new Set(), images: 0 }
  );
  const payload = {
    rootFolderId,
    generatedAt: new Date().toISOString(),
    summary: {
      brands: summary.brands.size,
      models: summary.models.size,
      products: withImages.length,
      images: summary.images,
    },
    products: withImages,
  };

  await fs.writeFile(outputFile, `${JSON.stringify(payload, null, 2)}\n`);
  console.log(payload.summary);
  console.log(`Wrote ${outputFile}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
