import { Order } from "@/types/order";
import { CartItem } from "@/types/cart-item";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

type CreateOrderData = {
  cart: CartItem[];
  shippingMethod: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  recipientName: string;
};

export async function getUserOrders(): Promise<Order[]> {
  const res = await fetch(`${API_URL}/users/orders`, {
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
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
  cart,
  shippingMethod,
  customerName,
  customerEmail,
  shippingAddress,
  recipientName,
}: CreateOrderData) {
  const res = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      products: cart.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      })),
      shippingMethod,
      customerName,
      customerEmail,
      shippingAddress,
      recipientName,
    }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message || "Error al crear la orden");
  }

  return data;
}
