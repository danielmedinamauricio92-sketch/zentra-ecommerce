import { describe, expect, it } from "vitest";
import type { Product } from "@/types/product";
import {
  getCategoryId,
  groupProductsByCategory,
  sortCategories,
} from "../product.utils";

const product = (overrides: Partial<Product> = {}): Product => ({
  id: 1,
  name: "Vans Knu",
  price: 34000,
  stock: 10,
  image: "https://example.com/vans.jpg",
  category: { id: 1, name: "Vans" },
  ...overrides,
});

describe("getCategoryId", () => {
  it("pasa a minúsculas y reemplaza espacios por guiones", () => {
    expect(getCategoryId("New Balance")).toBe("new-balance");
    expect(getCategoryId("Louis Vuitton")).toBe("louis-vuitton");
    expect(getCategoryId("Vans")).toBe("vans");
  });
});

describe("groupProductsByCategory", () => {
  it("agrupa productos por el nombre de su categoría", () => {
    const grouped = groupProductsByCategory([
      product({ id: 1, category: { id: 1, name: "Vans" } }),
      product({ id: 2, category: { id: 2, name: "Nike" } }),
      product({ id: 3, category: { id: 1, name: "Vans" } }),
    ]);
    expect(Object.keys(grouped).sort()).toEqual(["Nike", "Vans"]);
    expect(grouped["Vans"]).toHaveLength(2);
    expect(grouped["Nike"]).toHaveLength(1);
  });

  it("agrupa sin categoría bajo 'Sin categoría'", () => {
    const grouped = groupProductsByCategory([
      product({
        category: undefined as unknown as Product["category"],
      }),
    ]);
    expect(grouped["Sin categoría"]).toHaveLength(1);
  });

  it("devuelve un objeto vacío sin productos", () => {
    expect(groupProductsByCategory([])).toEqual({});
  });
});

describe("sortCategories", () => {
  it("ordena según categoryOrder", () => {
    expect(sortCategories(["Adidas", "Vans", "Nike"])).toEqual([
      "Vans",
      "Nike",
      "Adidas",
    ]);
  });

  it("deja las categorías desconocidas al final, en orden alfabético", () => {
    expect(sortCategories(["Zeta", "Vans", "Alpha"])).toEqual([
      "Vans",
      "Alpha",
      "Zeta",
    ]);
  });

  it("ordena alfabéticamente cuando ninguna es conocida", () => {
    expect(sortCategories(["Zeta", "Alpha"])).toEqual(["Alpha", "Zeta"]);
  });

  it("no muta el array original", () => {
    const input = ["Nike", "Vans"];
    const sorted = sortCategories(input);
    expect(sorted).toEqual(["Vans", "Nike"]);
    expect(input).toEqual(["Nike", "Vans"]);
  });
});
