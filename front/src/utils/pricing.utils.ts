import { OrderItem, OrderProduct } from "@/types/order";

export type GroupedOrderProduct = OrderProduct & {
  quantity: number;
  subtotal: number;
};

export const groupOrderProducts = (
  items: OrderItem[]
): GroupedOrderProduct[] => {
  const grouped = new Map<number, GroupedOrderProduct>();

  for (const item of items) {
    const product = item.product;
    const existing = grouped.get(product.id);

    if (existing) {
      existing.quantity += item.quantity;
      existing.subtotal =
        Number(existing.price ?? 0) * existing.quantity;
    } else {
      grouped.set(product.id, {
        ...product,
        quantity: item.quantity,
        subtotal: Number(product.price ?? 0) * item.quantity,
      });
    }
  }

  return Array.from(grouped.values());
};

export const getOrderProductsTotal = (items: OrderItem[]): number => {
  return items.reduce(
    (acc, item) =>
      acc + Number(item.product.price ?? 0) * item.quantity,
    0
  );
};


export function calculateSummary<T>(
  items: T[],
  getPrice: (item: T) => number,
  getQuantity: (item: T) => number,
  shippingCost: number
) {
  const subtotal = items.reduce(
    (acc, item) => acc + getPrice(item) * getQuantity(item),
    0
  );

  const total = subtotal + shippingCost;

  return { subtotal, total };
}