import Link from "next/link";
import { Order } from "@/types/order";
import { OrderProductRow } from "./OrderProductRow";

interface OrderCardProps {
  order: Order;
  index: number;
  reorderedId: number | null;
  onBuyAgain: (orderId: number, products: Order["products"]) => void;
}

export function OrderCard({
  order,
  index,
  reorderedId,
  onBuyAgain,
}: OrderCardProps) {
  const total = order.products.reduce(
    (acc, product) => acc + Number(product.price ?? 0),
    0
  );

  const totalUnits = order.products.length;

  const isRecent = index === 0;
  const wasReordered = reorderedId === order.id;

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="border-b border-slate-200 px-6 py-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl font-bold text-slate-900">
                Pedido #{order.id}
              </h2>

              {isRecent && (
                <span className="inline-flex items-center rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                  Pedido reciente
                </span>
              )}
            </div>

            <p className="mt-2 text-sm text-slate-500">
              Realizado el{" "}
              <span className="font-medium text-slate-700">
                {new Date(order.date).toLocaleDateString("es-AR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </span>
            </p>
          </div>

          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Total
              </p>
              <p className="mt-1 text-lg font-bold text-slate-900">
                ${total.toLocaleString("es-AR")}
              </p>
            </div>

            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              {order.status}
            </span>
          </div>
        </div>
      </div>

      <div className="px-6 py-5">
        <div className="space-y-4">
          {order.products.map((product) => (
            <OrderProductRow key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            {totalUnits} {totalUnits === 1 ? "unidad" : "unidades"} en esta compra
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            {wasReordered && (
              <Link
                href="/cart"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Ver carrito
              </Link>
            )}

            <button
              type="button"
              onClick={() => onBuyAgain(order.id, order.products)}
              className={`inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition ${
                wasReordered
                  ? "bg-emerald-600 text-white hover:bg-emerald-700"
                  : "bg-slate-900 text-white hover:bg-slate-800"
              }`}
            >
              {wasReordered ? "Agregado al carrito ✓" : "Repetir compra"}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}