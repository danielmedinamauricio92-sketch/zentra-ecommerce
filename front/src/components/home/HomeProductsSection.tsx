import Link from "next/link";
import { Product } from "@/types/product";
import { ProductCard } from "@/components/products/ProductCard";

interface HomeProductsSectionProps {
  products: Product[];
}

export function HomeProductsSection({
  products,
}: HomeProductsSectionProps) {
  const featuredProductNames = [
    "VANS KNU NEGRO/BLANCO",
    "PUMA SUEDE XL",
    "Nike V2K Beige/Negro",
    "Dunk Pro Panda",
    "campus pro negro",
    "forum blanco/negro",
    "samba blanco/negro",
    "NB 530 Beige/Negro",
    "DC NEGRO",
    "BORCEGOS CUERO VACUNO (caña alta)",
    "Botin papi Boca",
  ];
  const featuredByName = featuredProductNames
    .map((name) =>
      products.find(
        (product) => product.isActive !== false && product.name === name
      )
    )
    .filter((product): product is Product => Boolean(product));
  const fallbackProducts = products.filter(
    (product) =>
      product.isActive !== false &&
      !product.isOffer &&
      !featuredByName.some((featured) => featured.id === product.id)
  );
  const featuredProducts = [...featuredByName, ...fallbackProducts].slice(0, 11);

  return (
    <section className="pb-12 pt-6 md:pb-16 md:pt-8">
      <div className="mb-8">
        <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
          Destacados de Zentra
        </span>

        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
          Productos destacados
        </h1>

        <p className="mt-3 max-w-2xl text-base text-slate-600 md:text-lg">
          Explorá una selección Outfit con zapatillas, botines y accesorios
          urbanos, stock real por talle y modelos destacados.
        </p>
      </div>

      {featuredProducts.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-slate-600">
            No hay productos destacados disponibles en este momento.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      <div className="mt-10 flex justify-center">
        <Link
          href="/products"
          className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-800"
        >
          Ver todo el catálogo
        </Link>
      </div>
    </section>
  );
}
