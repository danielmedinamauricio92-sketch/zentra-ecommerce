"use client";

import { CartItem } from "@/types/cart-item";

type Props = {
  cart: CartItem[];
  increaseQuantity: (id: number) => void;
  decreaseQuantity: (id: number) => void;
  removeFromCart: (id: number) => void;
};

export default function CheckoutCartSummary({
  cart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
}: Props) {
  return (
    <div
      className={`flex min-h-155 flex-col ${
        cart.length === 1 ? "justify-center" : "justify-start"
      } xl:min-h-[calc(100%-4.5rem)]`}
    >
      <div
        className={
          cart.length === 1
            ? "mx-auto w-full max-w-xl"
            : "space-y-4"
        }
      >
        {cart.map((item) => {
          const reachedMaxStock = item.quantity >= item.stock;

          return (
            <article
              key={item.id}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white p-3 sm:h-24 sm:w-24">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-14 w-14 object-contain sm:h-16 sm:w-16"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-semibold text-slate-900">
                    {item.name}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    ${item.price.toLocaleString("es-AR")} c/u
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => decreaseQuantity(item.id)}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-900 transition hover:bg-slate-100"
                      >
                        -
                      </button>

                      <span className="min-w-8 text-center text-sm font-semibold text-slate-900">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() => increaseQuantity(item.id)}
                        disabled={reachedMaxStock}
                        className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition ${
                          reachedMaxStock
                            ? "cursor-not-allowed border border-slate-200 bg-slate-200 text-slate-400"
                            : "bg-slate-900 text-white hover:bg-slate-800"
                        }`}
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="text-sm font-medium text-red-600 transition hover:text-red-700 hover:underline"
                    >
                      Eliminar
                    </button>
                  </div>

                  {reachedMaxStock && (
                    <p className="mt-3 text-sm font-medium text-orange-600">
                      Máximo disponible en stock
                    </p>
                  )}
                </div>

                <div className="sm:text-right">
                  <p className="text-sm text-slate-500">
                    Total del producto
                  </p>
                  <p className="mt-1 text-lg font-bold text-slate-900">
                    $
                    {(item.price * item.quantity).toLocaleString("es-AR")}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}