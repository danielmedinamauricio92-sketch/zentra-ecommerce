import Link from "next/link";
import { getProducts } from "@/services/product.service";
import ProductsCatalog from "@/components/products/ProductsCatalog";

export default async function ProductsView() {
  const products = await getProducts();
  const visibleProducts = products.filter((product) => !product.isOffer);

  if (visibleProducts.length === 0) {
    return (
      <section className="pb-14 pt-10 md:pb-16 md:pt-12">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            No hay productos disponibles
          </h1>

          <p className="mt-3 text-slate-600">
            En este momento no hay productos para mostrar en el catálogo.
          </p>

          <Link
            href="/offers"
            className="mt-6 inline-flex items-center justify-center rounded-full border border-red-300 bg-white px-6 py-3 font-semibold text-red-700 transition hover:bg-red-50"
          >
            Ver ofertas
          </Link>
        </div>
      </section>
    );
  }

  return <ProductsCatalog products={visibleProducts} />;
}