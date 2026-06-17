import { CartItem } from "@/types/cart-item";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type ApiCartItem = {
  product: {
    id: number;
    name: string;
    price: number;
    image: string;
    stock: number;
  };
  quantity: number;
};

function mapCartItems(items: ApiCartItem[]): CartItem[] {
  return items.map((item) => ({
    id: item.product.id,
    name: item.product.name,
    price: item.product.price,
    image: item.product.image,
    stock: item.product.stock,
    quantity: item.quantity,
  }));
}

async function parseCartResponse(res: Response): Promise<CartItem[]> {
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message || "No se pudo actualizar el carrito");
  }

  if (!Array.isArray(data)) return [];

  return mapCartItems(data);
}

export async function getCart(): Promise<CartItem[]> {
  const res = await fetch(`${API_URL}/cart`, {
    credentials: "include",
  });

  return parseCartResponse(res);
}

export async function addCartItem(productId: number): Promise<CartItem[]> {
  const res = await fetch(`${API_URL}/cart/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ productId }),
  });

  return parseCartResponse(res);
}

export async function updateCartItem(
  productId: number,
  quantity: number
): Promise<CartItem[]> {
  const res = await fetch(`${API_URL}/cart/items/${productId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ quantity }),
  });

  return parseCartResponse(res);
}

export async function removeCartItem(productId: number): Promise<CartItem[]> {
  const res = await fetch(`${API_URL}/cart/items/${productId}`, {
    method: "DELETE",
    credentials: "include",
  });

  return parseCartResponse(res);
}

export async function clearCartItems(): Promise<CartItem[]> {
  const res = await fetch(`${API_URL}/cart`, {
    method: "DELETE",
    credentials: "include",
  });

  return parseCartResponse(res);
}
