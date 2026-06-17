import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";

interface ProductCardProps {
  product: Pick<Product, "id" | "name" | "price" | "stock" | "image">;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl"
    >
      <div className="mb-5 flex h-56 w-full items-center justify-center rounded-2xl border border-slate-100 bg-linear-to-b from-slate-50 via-white to-slate-50 p-5">
        <Image
          src={product.image}
          alt={product.name}
          width={320}
          height={240}
          sizes="(min-width: 1280px) 30vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col">
        <div className="mb-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Zentra
          </p>
        </div>

        <div className="mb-3">
          <h2 className="min-h-14 line-clamp-2 text-lg font-semibold leading-snug text-slate-900 transition-colors duration-300 group-hover:text-blue-600 md:text-xl">
            {product.name}
          </h2>
        </div>

        <div className="mb-5 flex flex-col gap-1">
          <p className="text-2xl font-extrabold tracking-tight text-slate-900">
            ${product.price.toLocaleString("es-AR")}
          </p>

          {product.stock === 0 ? (
            <span className="text-sm font-semibold text-red-600">
              Sin stock
            </span>
          ) : product.stock <= 5 ? (
            <span className="text-sm font-semibold text-orange-500">
              Últimas unidades
            </span>
          ) : (
            <span className="text-sm font-medium text-green-600">
              En stock
            </span>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
          <span className="text-sm font-semibold text-slate-600 transition-colors duration-300 group-hover:text-slate-900">
            Ver detalle
          </span>

          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition-all duration-300 group-hover:translate-x-1 group-hover:bg-blue-600 group-hover:text-white">
            →
          </span>
        </div>
      </div>
    </Link>
  );
}
