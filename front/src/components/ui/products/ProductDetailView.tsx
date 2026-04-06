import Link from "next/link";
import { notFound } from "next/navigation";
import ProductDetail from "@/components/products/ProductDetail";
import { getProducts } from "@/services/product.service";

interface ProductDetailViewProps {
  id: string;
}

export default async function ProductDetailView({
  id,
}: ProductDetailViewProps) {
  const productId = Number(id);

  if (Number.isNaN(productId)) {
    notFound();
  }

  const products = await getProducts();
  const product = products.find((item) => item.id === productId);

  if (!product) {
    return (
      <section className="py-10 md:py-14">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="mb-3 text-2xl font-bold text-slate-900">
            Producto no encontrado
          </h1>

          <p className="mb-6 text-slate-600">
            El producto que buscás no existe o ya no está disponible.
          </p>

          <Link
            href="/products"
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-800"
          >
            Volver a productos
          </Link>
        </div>
      </section>
    );
  }

  return <ProductDetail product={product} />;
}