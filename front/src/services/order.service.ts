import { Order } from "@/types/order";

export async function getUserOrders(token: string): Promise<Order[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_API_URL no esta definida");
  }

  const response = await fetch(`${apiUrl}/users/orders`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  });

  if (!response.ok) {
    throw new Error("No se pudieron cargar tus compras.");
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    return [];
  }

  return [...data].reverse();
}

export async function createOrder(
  token: string,
  products: number[]
): Promise<unknown> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_API_URL no esta definida");
  }

  const response = await fetch(`${apiUrl}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({
      products,
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Error al crear la orden");
  }

  return data;
}