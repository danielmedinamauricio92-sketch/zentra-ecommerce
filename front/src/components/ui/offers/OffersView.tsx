"use client";

import { useEffect, useState } from "react";
import { getProducts } from "@/services/product.service";
import { Product } from "@/types/product";
import { OffersSection } from "@/components/offers/OffersSection";
import { OffersLoading } from "@/components/offers/OffersLoading";

export default function OffersView() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setError("");
        const data = await getProducts();
        setProducts(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("No se pudieron cargar las ofertas.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="pt-10 pb-14 md:pt-12 md:pb-16">
      <div className="mb-10">
        <span className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700">
          Ofertas especiales
        </span>

        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
          Ofertas destacadas
        </h1>

        <p className="mt-3 max-w-2xl text-base text-slate-600 md:text-lg">
          Descubrí una selección especial de productos premium con precios
          destacados por tiempo limitado.
        </p>
      </div>

      {loading ? (
        <OffersLoading />
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm font-medium text-red-700">
          {error}
        </div>
      ) : (
        <OffersSection products={products} />
      )}
    </section>
  );
}