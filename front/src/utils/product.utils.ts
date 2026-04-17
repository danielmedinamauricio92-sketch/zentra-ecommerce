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
  return categoryName.toLowerCase().replaceAll(" ", "-");
}

export function groupProductsByCategory(products: Product[]) {
  return products.reduce((acc: Record<string, Product[]>, product) => {
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
    const aIndex = categoryOrder.indexOf(a);
    const bIndex = categoryOrder.indexOf(b);

    if (aIndex === -1 && bIndex === -1) {
      return a.localeCompare(b);
    }

    if (aIndex === -1) {
      return 1;
    }

    if (bIndex === -1) {
      return -1;
    }

    return aIndex - bIndex;
  });
}