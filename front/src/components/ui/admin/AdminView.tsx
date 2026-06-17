"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useUser } from "@/context/UserContext";
import { getProducts, updateProduct } from "@/services/product.service";
import { Product } from "@/types/product";

type ProductDraft = {
  name: string;
  description: string;
  price: string;
  stock: string;
  image: string;
  isOffer: boolean;
};

const toDraft = (product: Product): ProductDraft => ({
  name: product.name,
  description: product.description || "",
  price: String(product.price),
  stock: String(product.stock),
  image: product.image,
  isOffer: Boolean(product.isOffer),
});

export default function AdminView() {
  const { user, isHydrated } = useUser();
  const [products, setProducts] = useState<Product[]>([]);
  const [drafts, setDrafts] = useState<Record<number, ProductDraft>>({});
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todas");
  const [mode, setMode] = useState<"all" | "catalog" | "offers" | "lowStock">("all");
  const [isLoading, setIsLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!isHydrated || user?.role !== "admin") return;

    getProducts()
      .then((data) => {
        setProducts(data);
        setDrafts(
          Object.fromEntries(data.map((product) => [product.id, toDraft(product)]))
        );
      })
      .catch((error) => setMessage(error.message))
      .finally(() => setIsLoading(false));
  }, [isHydrated, user]);

  const categories = useMemo(
    () => [
      "Todas",
      ...Array.from(
        new Set(products.map((product) => product.category?.name || "Sin categoria"))
      ).sort(),
    ],
    [products]
  );

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return products.filter((product) => {
      const matchesQuery =
        !normalizedQuery ||
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.category?.name.toLowerCase().includes(normalizedQuery);
      const matchesCategory =
        category === "Todas" || product.category?.name === category;
      const matchesMode =
        mode === "all" ||
        (mode === "catalog" && !product.isOffer) ||
        (mode === "offers" && product.isOffer) ||
        (mode === "lowStock" && product.stock <= 5);

      return matchesQuery && matchesCategory && matchesMode;
    });
  }, [category, mode, products, query]);

  const totals = useMemo(
    () => ({
      products: products.length,
      catalog: products.filter((product) => !product.isOffer).length,
      offers: products.filter((product) => product.isOffer).length,
      lowStock: products.filter((product) => product.stock <= 5).length,
    }),
    [products]
  );

  const updateDraft = (
    productId: number,
    field: keyof ProductDraft,
    value: string | boolean
  ) => {
    setDrafts((current) => ({
      ...current,
      [productId]: {
        ...current[productId],
        [field]: value,
      },
    }));
  };

  const saveProduct = async (product: Product) => {
    const draft = drafts[product.id];
    if (!draft) return;

    setSavingId(product.id);
    setMessage("");

    try {
      const updatedProduct = await updateProduct(product.id, {
        name: draft.name,
        description: draft.description,
        price: Number(draft.price),
        stock: Number(draft.stock),
        image: draft.image,
        isOffer: draft.isOffer,
      });

      setProducts((current) =>
        current.map((item) => (item.id === updatedProduct.id ? updatedProduct : item))
      );
      setDrafts((current) => ({
        ...current,
        [updatedProduct.id]: toDraft(updatedProduct),
      }));
      setMessage(`${updatedProduct.name} actualizado`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo guardar");
    } finally {
      setSavingId(null);
    }
  };

  if (!isHydrated) {
    return <AdminShell title="Admin">Cargando...</AdminShell>;
  }

  if (!user) {
    return (
      <AdminShell title="Admin">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">Inicia sesion</h1>
          <p className="mt-2 text-slate-600">Necesitas una cuenta admin.</p>
          <Link
            href="/login"
            className="mt-5 inline-flex rounded-full bg-slate-900 px-5 py-3 font-semibold text-white"
          >
            Ir a login
          </Link>
        </div>
      </AdminShell>
    );
  }

  if (user.role !== "admin") {
    return (
      <AdminShell title="Admin">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">Acceso restringido</h1>
          <p className="mt-2 text-slate-600">Tu usuario no tiene permisos admin.</p>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell title="Panel admin">
      <div className="mb-6 grid gap-3 md:grid-cols-4">
        <Metric label="Productos" value={totals.products} />
        <Metric label="Catalogo" value={totals.catalog} />
        <Metric label="Ofertas" value={totals.offers} />
        <Metric label="Stock bajo" value={totals.lowStock} />
      </div>

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-[1fr_220px_220px]">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar producto o categoria"
            className="h-11 rounded-xl border border-slate-300 px-4 text-sm outline-none transition focus:border-blue-500"
          />

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="h-11 rounded-xl border border-slate-300 px-4 text-sm outline-none transition focus:border-blue-500"
          >
            {categories.map((categoryName) => (
              <option key={categoryName} value={categoryName}>
                {categoryName}
              </option>
            ))}
          </select>

          <select
            value={mode}
            onChange={(event) => setMode(event.target.value as typeof mode)}
            className="h-11 rounded-xl border border-slate-300 px-4 text-sm outline-none transition focus:border-blue-500"
          >
            <option value="all">Todos</option>
            <option value="catalog">Catalogo</option>
            <option value="offers">Ofertas</option>
            <option value="lowStock">Stock bajo</option>
          </select>
        </div>
      </div>

      {message && (
        <div className="mb-5 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-800">
          {message}
        </div>
      )}

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm">
          Cargando productos...
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProducts.map((product) => {
            const draft = drafts[product.id] || toDraft(product);

            return (
              <article
                key={product.id}
                className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:grid-cols-[120px_1fr_140px_120px_120px]"
              >
                <div className="relative h-28 overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
                  <Image
                    src={draft.image}
                    alt={draft.name}
                    fill
                    sizes="120px"
                    className="object-contain p-2"
                  />
                </div>

                <div className="grid gap-3">
                  <input
                    value={draft.name}
                    onChange={(event) =>
                      updateDraft(product.id, "name", event.target.value)
                    }
                    className="h-10 rounded-xl border border-slate-300 px-3 text-sm font-semibold outline-none transition focus:border-blue-500"
                  />
                  <textarea
                    value={draft.description}
                    onChange={(event) =>
                      updateDraft(product.id, "description", event.target.value)
                    }
                    rows={2}
                    className="resize-none rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500"
                  />
                  <input
                    value={draft.image}
                    onChange={(event) =>
                      updateDraft(product.id, "image", event.target.value)
                    }
                    className="h-10 rounded-xl border border-slate-300 px-3 text-xs outline-none transition focus:border-blue-500"
                  />
                </div>

                <Field label="Precio">
                  <input
                    type="number"
                    min="0"
                    value={draft.price}
                    onChange={(event) =>
                      updateDraft(product.id, "price", event.target.value)
                    }
                    className="h-10 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none transition focus:border-blue-500"
                  />
                </Field>

                <Field label="Stock">
                  <input
                    type="number"
                    min="0"
                    value={draft.stock}
                    onChange={(event) =>
                      updateDraft(product.id, "stock", event.target.value)
                    }
                    className="h-10 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none transition focus:border-blue-500"
                  />
                </Field>

                <div className="flex flex-col justify-between gap-3">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={draft.isOffer}
                      onChange={(event) =>
                        updateDraft(product.id, "isOffer", event.target.checked)
                      }
                      className="h-4 w-4"
                    />
                    Oferta
                  </label>

                  <span className="text-xs font-semibold uppercase text-slate-400">
                    {product.category?.name}
                  </span>

                  <button
                    onClick={() => saveProduct(product)}
                    disabled={savingId === product.id}
                    className="h-10 rounded-full bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                  >
                    {savingId === product.id ? "Guardando" : "Guardar"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </AdminShell>
  );
}

function AdminShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 pb-14 pt-24 md:px-6">
      <div className="mb-8">
        <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
          Zentra Admin
        </span>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
          {title}
        </h1>
      </div>
      {children}
    </main>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-extrabold text-slate-900">{value}</p>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-400">
        {label}
      </span>
      {children}
    </label>
  );
}
