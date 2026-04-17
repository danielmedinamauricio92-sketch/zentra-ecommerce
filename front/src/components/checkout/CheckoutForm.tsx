"use client";

import { useEffect, useState } from "react";
import { validateCheckoutForm } from "@/utils/checkoutValidation";

type CheckoutFormValues = {
  name: string;
  email: string;
  address: string;
};

type Props = {
  defaultValues: {
    name: string;
    email: string;
    address: string;
  };
  shippingMethod: string;
  shippingLabel: string;
  shippingCost: number;
  subtotal: number;
  total: number;
  discount: number;
  onShippingMethodChange: (value: string) => void;
  onSubmit: (data: {
    name: string;
    email: string;
    address: string;
    shippingMethod: string;
  }) => void;
  isSubmitting: boolean;
};

type CheckoutFormErrors = Partial<CheckoutFormValues>;

export default function CheckoutForm({
  defaultValues,
  shippingMethod,
  shippingLabel,
  shippingCost,
  subtotal,
  total,
  discount,
  onShippingMethodChange,
  onSubmit,
  isSubmitting,
}: Props) {
  const [form, setForm] = useState<CheckoutFormValues>({
    name: defaultValues.name,
    email: defaultValues.email,
    address: defaultValues.address,
  });

  const [errors, setErrors] = useState<CheckoutFormErrors>({});

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      name: defaultValues.name,
      email: defaultValues.email,
      address: defaultValues.address,
    }));
  }, [defaultValues]);

  const handleChange = (field: keyof CheckoutFormValues, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: undefined,
    }));
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formErrors = validateCheckoutForm({
      name: form.name,
      email: form.email,
      address: form.address,
    }) as CheckoutFormErrors;

    setErrors(formErrors);

    if (Object.keys(formErrors).length > 0) return;

    onSubmit({
      name: form.name,
      email: form.email,
      address: form.address,
      shippingMethod,
    });
  };

  return (
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
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Tu nombre"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900"
        />
        {errors.name && (
          <p className="mt-2 text-sm font-medium text-red-600">
            {errors.name}
          </p>
        )}
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
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
          placeholder="Tu email"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900"
        />
        {errors.email && (
          <p className="mt-2 text-sm font-medium text-red-600">
            {errors.email}
          </p>
        )}
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
          value={form.address}
          onChange={(e) => handleChange("address", e.target.value)}
          placeholder="Tu dirección"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900"
        />
        {errors.address && (
          <p className="mt-2 text-sm font-medium text-red-600">
            {errors.address}
          </p>
        )}
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
          onChange={(e) => onShippingMethodChange(e.target.value)}
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
            <span>Envío ({shippingLabel})</span>
            <span>${shippingCost.toLocaleString("es-AR")}</span>
          </div>

        {discount > 0 && (
      <div className="flex items-center justify-between">
      <span>Descuento</span>
      <span>-${discount.toLocaleString("es-AR")}</span>
      </div>
        )}

          
          <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-base font-bold text-slate-900">
            <span>Total</span>
            <span>${total.toLocaleString("es-AR")}</span>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {isSubmitting ? "Procesando..." : "Finalizar compra"}
      </button>
    </form>
  );
}