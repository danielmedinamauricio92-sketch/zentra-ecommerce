"use client";

import { useState } from "react";
import { validateCheckoutForm } from "@/utils/checkoutValidation";

type CheckoutFormValues = {
  name: string;
  email: string;
  address: string;
  recipientName: string;
};

type Props = {
  defaultValues: {
    name: string;
    email: string;
    address: string;
    recipientName: string;
  };
  shippingMethod: string;
  shippingLabel: string;
  shippingCost: number;
  subtotal: number;
  total: number;
  onShippingMethodChange: (value: string) => void;
  onSubmit: (data: {
    name: string;
    email: string;
    address: string;
    shippingMethod: string;
    recipientName: string;
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
  onShippingMethodChange,
  onSubmit,
  isSubmitting,
}: Props) {
  const [addressMode, setAddressMode] = useState<"profile" | "other">(
    defaultValues.address ? "profile" : "other"
  );
  const [recipientMode, setRecipientMode] = useState<"self" | "other">("self");
  const [form, setForm] = useState<CheckoutFormValues>({
    name: defaultValues.name,
    email: defaultValues.email,
    address: defaultValues.address,
    recipientName: defaultValues.recipientName,
  });
  const [errors, setErrors] = useState<CheckoutFormErrors>({});

  const inputClassName =
    "w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900";

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

    const shippingAddress =
      addressMode === "profile" ? defaultValues.address : form.address;
    const recipientName =
      recipientMode === "self" ? form.name : form.recipientName;

    const formErrors = validateCheckoutForm({
      name: form.name,
      email: form.email,
      address: shippingAddress,
    }) as CheckoutFormErrors;

    if (recipientMode === "other" && !form.recipientName.trim()) {
      formErrors.recipientName = "Ingresa el nombre de quien recibe.";
    }

    setErrors(formErrors);

    if (Object.keys(formErrors).length > 0) return;

    onSubmit({
      name: form.name,
      email: form.email,
      address: shippingAddress,
      shippingMethod,
      recipientName,
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
          className={inputClassName}
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
          className={inputClassName}
        />
        {errors.email && (
          <p className="mt-2 text-sm font-medium text-red-600">
            {errors.email}
          </p>
        )}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Entrega
        </h3>

        <div className="mt-4 grid gap-3">
          <label className="flex cursor-pointer gap-3 rounded-xl border border-slate-200 bg-white p-4">
            <input
              type="radio"
              checked={addressMode === "profile"}
              onChange={() => setAddressMode("profile")}
              className="mt-1"
            />
            <span>
              <span className="block font-semibold text-slate-900">
                Enviar a mi domicilio
              </span>
              <span className="mt-1 block text-sm text-slate-600">
                {defaultValues.address || "No tenes una direccion guardada"}
              </span>
            </span>
          </label>

          <label className="flex cursor-pointer gap-3 rounded-xl border border-slate-200 bg-white p-4">
            <input
              type="radio"
              checked={addressMode === "other"}
              onChange={() => setAddressMode("other")}
              className="mt-1"
            />
            <span className="font-semibold text-slate-900">
              Enviar a otra direccion
            </span>
          </label>
        </div>

        {addressMode === "other" && (
          <div className="mt-4">
            <label
              htmlFor="checkout-address"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Nueva direccion
            </label>
            <input
              id="checkout-address"
              value={form.address}
              onChange={(e) => handleChange("address", e.target.value)}
              placeholder="Calle, numero, piso o referencia"
              className={inputClassName}
            />
          </div>
        )}

        {errors.address && (
          <p className="mt-2 text-sm font-medium text-red-600">
            {errors.address}
          </p>
        )}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Quien recibe
        </h3>

        <div className="mt-4 grid gap-3">
          <label className="flex cursor-pointer gap-3 rounded-xl border border-slate-200 bg-white p-4">
            <input
              type="radio"
              checked={recipientMode === "self"}
              onChange={() => setRecipientMode("self")}
              className="mt-1"
            />
            <span>
              <span className="block font-semibold text-slate-900">
                Recibo yo
              </span>
              <span className="mt-1 block text-sm text-slate-600">
                {form.name}
              </span>
            </span>
          </label>

          <label className="flex cursor-pointer gap-3 rounded-xl border border-slate-200 bg-white p-4">
            <input
              type="radio"
              checked={recipientMode === "other"}
              onChange={() => setRecipientMode("other")}
              className="mt-1"
            />
            <span className="font-semibold text-slate-900">
              Lo recibe otra persona
            </span>
          </label>
        </div>

        {recipientMode === "other" && (
          <div className="mt-4">
            <label
              htmlFor="checkout-recipient"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Nombre de quien recibe
            </label>
            <input
              id="checkout-recipient"
              value={form.recipientName}
              onChange={(e) => handleChange("recipientName", e.target.value)}
              placeholder="Nombre y apellido"
              className={inputClassName}
            />
          </div>
        )}

        {errors.recipientName && (
          <p className="mt-2 text-sm font-medium text-red-600">
            {errors.recipientName}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="checkout-shipping"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Metodo de envio
        </label>
        <select
          id="checkout-shipping"
          value={shippingMethod}
          onChange={(e) => onShippingMethodChange(e.target.value)}
          className={inputClassName}
        >
          <option value="standard">Estandar - Gratis</option>
          <option value="express">Express - $10</option>
          <option value="premium">Premium - $20</option>
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
            <span>Envio ({shippingLabel})</span>
            <span>${shippingCost.toLocaleString("es-AR")}</span>
          </div>

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
