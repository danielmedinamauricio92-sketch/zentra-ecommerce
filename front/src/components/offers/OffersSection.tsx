import { Product } from "@/types/product";
import { ProductCard } from "@/components/products/ProductCard";

interface OffersSectionProps {
  products: Product[];
}

export function OffersSection({ products }: OffersSectionProps) {
  const offers = products.filter((product) => product.isOffer);

  if (offers.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">
          No hay ofertas disponibles
        </h2>

        <p className="mt-2 text-slate-600">
          Volvé más tarde para ver nuevas promociones.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {offers.map((product) => (
        <div
          key={product.id}
          className="relative overflow-hidden rounded-2xl border border-red-200 bg-white shadow-sm transition hover:shadow-xl"
        >
          <span className="absolute left-3 top-3 z-10 rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white shadow">
            OFERTA
          </span>

          <span className="absolute right-3 top-3 z-10 rounded bg-black px-2 py-1 text-xs font-semibold text-white">
            -20%
          </span>

          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}