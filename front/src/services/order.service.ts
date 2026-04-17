import { Order } from "@/types/order";
import { CartItem } from "@/types/cart-item";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type CreateOrderData = {
  token: string;
  userId: number;
  cart: CartItem[];
  subtotal: number;
  shippingMethod: string;
  shippingCost: number;
  discount: number;
  total: number;
};

export async function getUserOrders(token: string): Promise<Order[]> {
  const res = await fetch(`${API_URL}/users/orders`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  });

  if (!res.ok) {
    throw new Error("No se pudieron cargar las compras");
  }

  const data = await res.json();

  if (!Array.isArray(data)) {
    return [];
  }

  return data.reverse();
}

export async function createOrder({
  token,
  userId,
  cart,
  subtotal,
  shippingMethod,
  shippingCost,
  discount,
  total,
}: CreateOrderData) {
  const res = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({
      userId,
      products: cart.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      })),
      subtotal,
      shippingMethod,
      shippingCost,
      discount,
      total,
    }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message || "Error al crear la orden");
  }

  return data;
}