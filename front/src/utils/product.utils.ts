import { Product } from "@/types/product";

export const categoryOrder = [
  "Smartphones",
  "Laptops",
  "Tablets",
  "Headphones",
  "Cameras",
  "Printers",
  "Monitors",
  "Storage",
  "Accessories",
];

export function getCategoryId(categoryName: string) {
  return categoryName.toLowerCase().replace(/\s+/g, "-");
}

export function groupProductsByCategory(products: Product[]) {
  return products.reduce<Record<string, Product[]>>((acc, product) => {
    const categoryName = product.category?.name || "Sin categoría";

    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }

    acc[categoryName].push(product);
    return acc;
  }, {});
}

export function sortCategories(categories: string[]) {
  return [...categories].sort((a, b) => {
    const indexA = categoryOrder.indexOf(a);
    const indexB = categoryOrder.indexOf(b);

    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;

    return indexA - indexB;
  });
}