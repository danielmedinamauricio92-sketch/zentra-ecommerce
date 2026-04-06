import Link from "next/link";

export function OrdersEmpty() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center justify-center px-6 py-16 text-center">
      <div className="rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          No tenés compras todavía
        </h1>

        <p className="mt-3 text-slate-600">
          Cuando realices una compra, vas a verla acá.
        </p>

        <Link
          href="/products"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-800"
        >
          Explorar productos
        </Link>
      </div>
    </div>
  );
}