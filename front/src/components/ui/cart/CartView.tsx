"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import { calculateSummary } from "@/utils/pricing.utils";

export default function CartView() {
  const { user } = useUser();
  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
  } = useCart();

  const { subtotal, total } = calculateSummary(
    cart,
    (item) => item.price,
    (item) => item.quantity,
    0
  );
  // Aquí podrías agregar lógica para aplicar descuentos si es necesario

  if (!user) {
    return (
      <section className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-6">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <h1 className="mb-3 text-2xl font-bold text-slate-900">
            Iniciá sesión para ver tu carrito
          </h1>

          <p className="mb-6 text-slate-600">
            Accedé con tu cuenta para continuar tu compra de forma segura.
          </p>

          <div className="flex flex-col gap-3">
            <Link
              href="/login?redirect=/cart"
              className="rounded-full bg-slate-900 py-3 font-semibold text-white transition hover:bg-slate-800"
            >
              Iniciar sesión
            </Link>

            <Link
              href="/register?redirect=/cart"
              className="rounded-full border border-slate-300 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Crear cuenta
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (cart.length === 0) {
    return (
      <section className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <h1 className="mb-3 text-2xl font-bold text-slate-900">
            Tu carrito está vacío
          </h1>

          <p className="mb-6 text-slate-600">
            Agregá productos para comenzar tu compra.
          </p>

          <Link
            href="/products"
            className="rounded-full bg-slate-900 px-6 py-3 text-white transition hover:bg-slate-800"
          >
            Explorar productos
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10">
      <div className="mx-auto max-w-6xl px-6">
        <h1 className="mb-8 text-3xl font-bold text-slate-900">
          Carrito de compras
        </h1>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-4 md:col-span-2">
            {cart.map((item) => {
              const reachedMaxStock = item.quantity >= item.stock;

              return (
                <div
                  key={item.id}
                  className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-20 w-20 object-contain"
                  />

                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">{item.name}</p>

                    <p className="text-sm text-slate-500">
                      ${item.price.toLocaleString("es-AR")} c/u
                    </p>

                    {item.stock === 0 ? (
                      <p className="mt-1 text-sm font-semibold text-red-600">
                        Sin stock
                      </p>
                    ) : item.stock <= 5 ? (
                      <p className="mt-1 text-sm font-semibold text-orange-500">
                        Últimas unidades · Stock: {item.stock}
                      </p>
                    ) : (
                      <p className="mt-1 text-sm text-green-600">
                        Stock disponible: {item.stock}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      className="h-8 w-8 rounded bg-slate-200 transition hover:bg-slate-300"
                    >
                      -
                    </button>

                    <span className="w-6 text-center">{item.quantity}</span>

                    <button
                      onClick={() => increaseQuantity(item.id)}
                      disabled={reachedMaxStock}
                      className={`h-8 w-8 rounded transition ${
                        reachedMaxStock
                          ? "cursor-not-allowed bg-slate-300 text-white"
                          : "bg-slate-900 text-white hover:bg-slate-800"
                      }`}
                    >
                      +
                    </button>
                  </div>

                  <div className="w-28 text-right">
                    <p className="font-semibold text-slate-900">
                      ${(item.price * item.quantity).toLocaleString("es-AR")}
                    </p>

                    {reachedMaxStock && item.stock > 0 && (
                      <p className="mt-1 text-xs font-medium text-orange-500">
                        Máximo disponible
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-sm text-red-500 hover:underline"
                  >
                    Eliminar
                  </button>
                </div>
              );
            })}

            <div className="flex items-center justify-between">
              <button
                onClick={clearCart}
                className="text-sm text-slate-500 hover:underline"
              >
                Vaciar carrito
              </button>

              <Link
                href="/products"
                className="text-sm font-medium text-blue-600 hover:underline"
              >
                Seguir comprando →
              </Link>
            </div>
          </div>

          <div className="h-fit rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">
              Resumen
            </h2>

            <div className="mb-2 flex justify-between text-sm">
              <span>Subtotal</span>
              <span>${subtotal.toLocaleString("es-AR")}</span>
            </div>

            <div className="mb-4 flex justify-between text-sm">
              <span>Envío</span>
              <span>Gratis</span>
            </div>
            {/* Aquí podrías mostrar el descuento si es aplicable */}
            
          
            <div className="flex justify-between border-t pt-4 text-lg font-bold">
              <span>Total</span>
              <span>${total.toLocaleString("es-AR")}</span>
            </div>

            <Link
              href="/checkout"
              className="mt-6 block rounded-full bg-slate-900 py-3 text-center text-white transition hover:bg-slate-800"
            >
              Finalizar compra
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}