import { Product } from "@/types/product";

const API_URL =
  typeof window === "undefined"
    ? process.env.BACKEND_URL ||
      "https://zentra-backend-production-8613.up.railway.app"
    : process.env.NEXT_PUBLIC_API_URL || "/api";

export async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${API_URL}/products`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Error al obtener productos");
  }

  return res.json();
}
