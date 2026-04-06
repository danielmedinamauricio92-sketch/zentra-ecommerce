"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createOrder } from "@/services/order.service";

type PersistedUser = {
  id: number;
  name?: string;
  email?: string;
  address?: string;
};

export default function CheckoutView() {
  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    removeFromCart,
  } = useCart();
  const { user, token } = useUser();
  const router = useRouter();

  const [persistedUser, setPersistedUser] = useState<PersistedUser | null>(null);
  const [persistedToken, setPersistedToken] = useState<string>("");
  const [authChecked, setAuthChecked] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const shippingCosts: Record<string, number> = {
    standard: 0,
    express: 10,
    premium: 20,
  };

  const shippingLabels: Record<string, string> = {
    standard: "Estándar",
    express: "Express",
    premium: "Premium",
  };

  const activeUser = user ?? persistedUser;
  const activeToken = token || persistedToken;

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingCost = shippingCosts[shippingMethod] || 0;
  const total = subtotal + shippingCost;

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      if (storedUser) {
        setPersistedUser(JSON.parse(storedUser));
      }

      if (storedToken) {
        setPersistedToken(storedToken);
      }
    } catch (error) {
      console.error("Error al recuperar la sesión:", error);
    } finally {
      setAuthChecked(true);
    }
  }, []);

  useEffect(() => {
    if (authChecked && !activeUser) {
      router.push("/login");
    }
  }, [authChecked, activeUser, router]);

  useEffect(() => {
    if (activeUser) {
      setName(activeUser.name || "");
      setEmail(activeUser.email || "");
      setAddress(activeUser.address || "");
    }
  }, [activeUser]);

  useEffect(() => {
    if (isSubmitting || orderCompleted) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [isSubmitting, orderCompleted]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!activeUser) {
      setError("Debés iniciar sesión para finalizar la compra.");
      return;
    }

    if (!activeToken) {
      setError("No se encontró el token del usuario.");
      return;
    }

    if (!name || !email || !address || cart.length === 0) {
      setError("Completá todos los campos y agregá productos al carrito.");
      return;
    }

    try {
      setIsSubmitting(true);

      const productIds = cart.flatMap((item) =>
        Array(item.quantity).fill(item.id)
      );

      await createOrder(activeToken, productIds);

      await new Promise((resolve) => setTimeout(resolve, 1500));

      const existingExtras = JSON.parse(
        localStorage.getItem("orderExtras") || "[]"
      );

      const orderExtras = {
        createdAt: Date.now(),
        userId: activeUser.id,
        name,
        email,
        address,
        shippingMethod,
        subtotal,
        shippingCost,
        total,
        items: cart,
      };

      localStorage.setItem(
        "orderExtras",
        JSON.stringify([...existingExtras, orderExtras])
      );

      clearCart();
      setOrderCompleted(true);

      setTimeout(() => {
        router.push("/orders");
      }, 1800);
    } catch (err: unknown) {
      console.error("Error al procesar la compra:", err);

      if (err instanceof Error) {
        if (err.message.includes("Failed to fetch")) {
          setError("No se pudo conectar con el servidor. Intentá nuevamente.");
        } else if (
          err.message.includes("401") ||
          err.message.toLowerCase().includes("token")
        ) {
          setError("Tu sesión venció. Volvé a iniciar sesión.");
        } else {
          setError(err.message);
        }
      } else {
        setError("Error al procesar la compra. Intentá nuevamente.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!authChecked) {
    return (
      <section className="py-14 md:py-20">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-lg text-slate-700">Cargando checkout...</p>
        </div>
      </section>
    );
  }

  if (!activeUser) {
    return (
      <section className="py-14 md:py-20">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-lg text-slate-700">Redirigiendo al login...</p>
        </div>
      </section>
    );
  }

  if (isSubmitting) {
    return (
      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm md:p-10">
          <div className="mx-auto mb-5 h-16 w-16 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />

          <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
            Procesando tu compra...
          </h1>

          <p className="mb-6 text-base text-slate-600 md:text-lg">
            Estamos confirmando tu pedido. No cierres esta ventana.
          </p>
        </div>
      </section>
    );
  }

  if (orderCompleted) {
    return (
      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm md:p-10">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
            ✅
          </div>

          <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
            ¡Compra realizada con éxito!
          </h1>

          <p className="mb-6 text-base text-slate-600 md:text-lg">
            Redirigiendo a tus compras...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-14 md:py-20">
      <div className="mb-8">
        <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
          Checkout Zentra
        </span>

        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
          Finalizá tu compra
        </h1>
      </div>

      {cart.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h2 className="mb-3 text-2xl font-bold text-slate-900">
            Tu carrito está vacío
          </h2>

          <Link
            href="/products"
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-800"
          >
            Ir al catálogo
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_0.95fr] xl:items-stretch">
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6 xl:min-h-[720px]">
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Tu pedido</h2>
                <p className="mt-2 text-slate-600">
                  Revisá los productos antes de finalizar la compra.
                </p>
              </div>

              <Link
                href="/products"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                ← Seguir comprando
              </Link>
            </div>

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
                          <p className="text-sm text-slate-500">Subtotal</p>
                          <p className="mt-1 text-lg font-bold text-slate-900">
                            $
                            {(item.price * item.quantity).toLocaleString(
                              "es-AR"
                            )}
                          </p>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8 xl:sticky xl:top-24">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                Finalizar compra
              </h2>
              <p className="mt-2 text-slate-600">
                Completá tus datos y elegí el envío.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="checkout-name"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Nombre
                </label>
                <input
                  id="checkout-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900"
                />
              </div>

              <div>
                <label
                  htmlFor="checkout-email"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Email
                </label>
                <input
                  id="checkout-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Tu email"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900"
                />
              </div>

              <div>
                <label
                  htmlFor="checkout-address"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Dirección
                </label>
                <input
                  id="checkout-address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Tu dirección"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900"
                />
              </div>

              <div>
                <label
                  htmlFor="checkout-shipping"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Método de envío
                </label>
                <select
                  id="checkout-shipping"
                  value={shippingMethod}
                  onChange={(e) => setShippingMethod(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900"
                >
                  <option value="standard">Estándar — Gratis</option>
                  <option value="express">Express — $10</option>
                  <option value="premium">Premium — $20</option>
                </select>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Resumen
                </h3>

                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span>${subtotal.toLocaleString("es-AR")}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span>Envío ({shippingLabels[shippingMethod]})</span>
                    <span>${shippingCost.toLocaleString("es-AR")}</span>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-base font-bold text-slate-900">
                    <span>Total</span>
                    <span>${total.toLocaleString("es-AR")}</span>
                  </div>
                </div>
              </div>

              {error && (
                <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {isSubmitting ? "Procesando..." : "Finalizar compra"}
              </button>
            </form>
          </section>
        </div>
      )}
    </section>
  );
}