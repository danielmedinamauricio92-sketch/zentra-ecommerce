"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createOrder } from "@/services/order.service";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import CheckoutCartSummary from "@/components/checkout/CheckoutCartSummary";
import CheckoutStatus from "@/components/checkout/CheckoutStatus";
import { calculateSummary } from "@/utils/pricing.utils";
import { isProfileComplete } from "@/utils/profile.utils";

type CheckoutSubmitData = {
  name: string;
  email: string;
  address: string;
  shippingMethod: string;
  recipientName: string;
};

export default function CheckoutView() {
  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    removeFromCart,
  } = useCart();
  const { user, isHydrated } = useUser();
  const router = useRouter();

  const [orderCompleted, setOrderCompleted] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shippingMethod, setShippingMethod] = useState("standard");

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

  const shippingCost = shippingCosts[shippingMethod] || 0;

  const { subtotal, total } = calculateSummary(
    cart,
    (item) => item.price,
    (item) => item.quantity,
    shippingCost
  );

  useEffect(() => {
    if (isHydrated && !user) {
      router.push("/login");
    }
  }, [isHydrated, user, router]);

  useEffect(() => {
    if (isSubmitting || orderCompleted) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [isSubmitting, orderCompleted]);

  const handleSubmit = async ({
    name,
    email,
    address,
    shippingMethod,
    recipientName,
  }: CheckoutSubmitData) => {
    if (isSubmitting) return;

    setError("");

    if (!user) {
      setError("Debés iniciar sesión para finalizar la compra.");
      return;
    }

    if (!isProfileComplete(user)) {
      router.push("/complete-profile");
      return;
    }

    if (cart.length === 0) {
      setError("Agregá productos al carrito antes de finalizar la compra.");
      return;
    }

    try {
      setIsSubmitting(true);

      await createOrder({
        cart,
        shippingMethod,
        customerName: name,
        customerEmail: email,
        shippingAddress: address,
        recipientName,
      });

      await new Promise((resolve) => setTimeout(resolve, 1500));

      clearCart();
      setOrderCompleted(true);

      setTimeout(() => {
        router.push("/orders");
      }, 1800);
    } catch (err: unknown) {
      console.error("Error al procesar la compra:", err);
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo procesar la compra. Intentá nuevamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isHydrated) {
    return <CheckoutStatus type="loading" />;
  }

  if (!user) {
    return <CheckoutStatus type="redirecting" />;
  }

  if (!isProfileComplete(user)) {
    return (
      <section className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-6">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">
            Completa tu perfil
          </h1>
          <p className="mt-3 text-slate-600">
            Antes de finalizar la compra necesitamos tu direccion y telefono.
          </p>
          <Link
            href="/complete-profile"
            className="mt-6 inline-flex rounded-full bg-slate-900 px-6 py-3 font-semibold text-white"
          >
            Completar datos
          </Link>
        </div>
      </section>
    );
  }

  if (isSubmitting) {
    return <CheckoutStatus type="submitting" />;
  }

  if (orderCompleted) {
    return <CheckoutStatus type="success" />;
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
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6 xl:min-h-180">
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
                Seguir comprando
              </Link>
            </div>

            <CheckoutCartSummary
              cart={cart}
              increaseQuantity={increaseQuantity}
              decreaseQuantity={decreaseQuantity}
              removeFromCart={removeFromCart}
            />
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

            <CheckoutForm
              defaultValues={{
                name: user.name || "",
                email: user.email || "",
                address: user.address || "",
                recipientName: "",
              }}
              shippingMethod={shippingMethod}
              shippingLabel={shippingLabels[shippingMethod]}
              shippingCost={shippingCost}
              subtotal={subtotal}
              total={total}
              onShippingMethodChange={setShippingMethod}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />

            {error && (
              <p className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                {error}
              </p>
            )}
          </section>
        </div>
      )}
    </section>
  );
}
