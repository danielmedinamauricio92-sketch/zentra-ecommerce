"use client";

import Link from "next/link";
import { ProductCard } from "@/components/products/ProductCard";
import CategoriesNav from "@/components/products/CategoriesNav";
import { Product } from "@/types/product";
import {
  getCategoryId,
  groupProductsByCategory,
  sortCategories,
} from "@/utils/product.utils";

type Props = {
  products: Product[];
};

export default function ProductsCatalog({ products }: Props) {
  const groupedProducts = groupProductsByCategory(products);
  const sortedCategories = sortCategories(Object.keys(groupedProducts));

  return (
    <section className="pb-14 pt-10 md:pb-16 md:pt-12">
      <div className="mb-12 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
              Catálogo Zentra
            </span>

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
              Todos los productos
            </h1>

            <p className="mt-3 max-w-2xl text-base text-slate-600 md:text-lg">
              Explorá nuestra selección de tecnología premium con diseño
              moderno, rendimiento confiable y una experiencia pensada para el
              día a día.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/offers"
              className="inline-flex items-center justify-center rounded-full border border-red-300 bg-white px-6 py-3 font-semibold text-red-700 transition hover:bg-red-50"
            >
              Ver ofertas
            </Link>
          </div>
        </div>

        <div
          id="categories-nav"
          className="mt-8 border-t border-slate-100 pt-6"
        >
          <p className="mb-4 text-sm font-medium text-slate-500">
            Explorar por categoría
          </p>

          <CategoriesNav categories={sortedCategories} />
        </div>
      </div>

      <div className="space-y-20">
        {sortedCategories.map((categoryName, index) => {
          const nextCategory = sortedCategories[index + 1];
          const categoryProducts = groupedProducts[categoryName];

          return (
            <section
              key={categoryName}
              id={getCategoryId(categoryName)}
              className="scroll-mt-32 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"
            >
              <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">
                    {categoryName}
                  </h2>
                  <div className="mt-2 h-1 w-16 rounded-full bg-blue-600" />
                </div>

                <span className="text-sm font-medium text-slate-500">
                  {categoryProducts.length} productos
                </span>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3">
                {categoryProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm font-medium text-slate-600">
                    Seguí explorando el catálogo
                  </p>

                  <div className="flex flex-wrap gap-3">
                    <a
                      href="#categories-nav"
                      className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                    >
                      Volver a categorías
                    </a>

                    {nextCategory ? (
                      <a
                        href={`#${getCategoryId(nextCategory)}`}
                        className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                      >
                        Siguiente: {nextCategory}
                      </a>
                    ) : (
                      <a
                        href="#categories-nav"
                        className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                      >
                        Ir al inicio del catálogo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </section>
  );
}