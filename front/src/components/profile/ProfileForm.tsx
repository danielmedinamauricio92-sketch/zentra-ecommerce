"use client";

import { useState } from "react";
import { User } from "@/types/user";
import { updateUserProfile } from "@/services/auth.service";

type ProfileFormValues = {
  name: string;
  address: string;
  phone: string;
};

type Props = {
  user: User;
  submitLabel?: string;
  onSaved: (user: User) => void;
};

export default function ProfileForm({
  user,
  submitLabel = "Guardar cambios",
  onSaved,
}: Props) {
  const [form, setForm] = useState<ProfileFormValues>({
    name: user.name || "",
    address: user.address || "",
    phone: user.phone || "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field: keyof ProfileFormValues, value: string) => {
    const nextValue =
      field === "phone" ? value.replace(/\D/g, "").slice(0, 15) : value;

    setForm((prev) => ({
      ...prev,
      [field]: nextValue,
    }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    const name = form.name.trim();
    const address = form.address.trim();
    const phone = form.phone.trim();

    if (!name || !address || !phone) {
      setError("Completa nombre, direccion y telefono.");
      return;
    }

    try {
      setIsSaving(true);
      const { user: updatedUser } = await updateUserProfile({
        name,
        address,
        phone,
      });
      onSaved(updatedUser);
      setSuccess("Datos actualizados correctamente.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudieron guardar los datos."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const inputClassName =
    "w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Nombre
        </label>
        <input
          value={form.name}
          onChange={(event) => handleChange("name", event.target.value)}
          className={inputClassName}
          placeholder="Tu nombre"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Direccion
        </label>
        <input
          value={form.address}
          onChange={(event) => handleChange("address", event.target.value)}
          className={inputClassName}
          placeholder="Calle 123"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Telefono
        </label>
        <input
          value={form.phone}
          onChange={(event) => handleChange("phone", event.target.value)}
          className={inputClassName}
          placeholder="Solo numeros"
        />
      </div>

      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {error}
        </p>
      )}

      {success && (
        <p className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          {success}
        </p>
      )}

      <button
        type="submit"
        disabled={isSaving}
        className="inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {isSaving ? "Guardando..." : submitLabel}
      </button>
    </form>
  );
}
