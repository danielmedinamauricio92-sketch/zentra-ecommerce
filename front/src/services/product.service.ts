import { Product } from "@/types/product";

export async function getProducts(): Promise<Product[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_API_URL no esta definida");
  }

  const res = await fetch(`${apiUrl}/products`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("No se pudieron obtener los productos");
  }

  return res.json();
}