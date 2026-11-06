import { describe, expect, it } from "vitest";
import type { OrderItem, OrderProduct } from "@/types/order";
import {
  calculateSummary,
  getOrderProductsTotal,
  groupOrderProducts,
} from "../pricing.utils";

const product = (overrides: Partial<OrderProduct> = {}): OrderProduct => ({
  id: 1,
  name: "Vans Knu",
  price: 34000,
  image: "https://example.com/vans.jpg",
  ...overrides,
});

const item = (overrides: Partial<OrderItem> = {}): OrderItem => ({
  id: 1,
  quantity: 1,
  product: product(),
  ...overrides,
});

describe("groupOrderProducts", () => {
  it("devuelve un array vacío sin items", () => {
    expect(groupOrderProducts([])).toEqual([]);
  });

  it("agrupa un solo producto con su cantidad y subtotal", () => {
    const grouped = groupOrderProducts([item({ quantity: 2 })]);
    expect(grouped).toHaveLength(1);
    expect(grouped[0].quantity).toBe(2);
    expect(grouped[0].subtotal).toBe(68000);
    expect(grouped[0].name).toBe("Vans Knu");
  });

  it("suma cantidades y recalcula el subtotal para el mismo producto", () => {
    const grouped = groupOrderProducts([
      item({ id: 1, quantity: 1 }),
      item({ id: 2, quantity: 3 }),
    ]);
    expect(grouped).toHaveLength(1);
    expect(grouped[0].quantity).toBe(4);
    expect(grouped[0].subtotal).toBe(136000);
  });

  it("mantiene separados productos distintos", () => {
    const grouped = groupOrderProducts([
      item({ product: product({ id: 1, price: 10000 }) }),
      item({
        id: 2,
        product: product({ id: 2, name: "Nike Air", price: 20000 }),
      }),
    ]);
    expect(grouped).toHaveLength(2);
    expect(grouped.map((g) => g.subtotal)).toEqual([10000, 20000]);
  });

  it("trata un precio indefinido como 0", () => {
    const grouped = groupOrderProducts([
      item({
        product: product({ price: undefined as unknown as number }),
      }),
    ]);
    expect(grouped[0].subtotal).toBe(0);
  });
});

describe("getOrderProductsTotal", () => {
  it("devuelve 0 sin items", () => {
    expect(getOrderProductsTotal([])).toBe(0);
  });

  it("suma precio por cantidad en varios items", () => {
    expect(
      getOrderProductsTotal([
        item({ quantity: 2, product: product({ price: 10000 }) }),
        item({
          id: 2,
          quantity: 1,
          product: product({ id: 2, price: 5000 }),
        }),
      ])
    ).toBe(25000);
  });

  it("trata un precio indefinido como 0", () => {
    expect(
      getOrderProductsTotal([
        item({
          product: product({ price: undefined as unknown as number }),
        }),
      ])
    ).toBe(0);
  });
});

describe("calculateSummary", () => {
  it("suma subtotal y envío", () => {
    const summary = calculateSummary(
      [
        { price: 10000, qty: 2 },
        { price: 5000, qty: 1 },
      ],
      (i) => i.price,
      (i) => i.qty,
      1500
    );
    expect(summary.subtotal).toBe(25000);
    expect(summary.total).toBe(26500);
  });

  it("devuelve solo el envío sin items", () => {
    const summary = calculateSummary<{ price: number; qty: number }>(
      [],
      (i) => i.price,
      (i) => i.qty,
      1500
    );
    expect(summary.subtotal).toBe(0);
    expect(summary.total).toBe(1500);
  });

  it("con envío 0 el total es el subtotal", () => {
    const summary = calculateSummary(
      [{ price: 10000, qty: 1 }],
      (i) => i.price,
      (i) => i.qty,
      0
    );
    expect(summary.subtotal).toBe(10000);
    expect(summary.total).toBe(10000);
  });
});
