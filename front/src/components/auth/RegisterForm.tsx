"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/services/auth.service";
import { useUser } from "@/context/UserContext";
import { RegisterData } from "@/types/auth";
import {
  RegisterFormErrors,
  RegisterFormValues,
} from "@/types/forms";
import {
  validateRegisterForm,
  isRegisterFormComplete,
} from "@/utils/registerValidation";

export default function RegisterForm() {
  const router = useRouter();
  const { setToast } = useUser();
  const redirectTimeout = useRef<NodeJS.Timeout | null>(null);

  const [form, setForm] = useState<RegisterFormValues>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    phone: "",
  });

  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isFormComplete = isRegisterFormComplete(form);

  useEffect(() => {
    return () => {
      if (redirectTimeout.current) {
        clearTimeout(redirectTimeout.current);
      }
    };
  }, []);

  const showToastMessage = (message: string) => {
    setToast({
      show: true,
      message,
    });
  };

  const handleChange = (field: keyof RegisterFormValues, value: string) => {
    let nextValue = value;

    if (field === "phone") {
      nextValue = value.replace(/\D/g, "").slice(0, 15);
    }

    setForm((prev) => ({
      ...prev,
      [field]: nextValue,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: undefined,
      general: undefined,
    }));
  };

  const handleRegisterClick = () => {
    if (isLoading) return;

    if (!isFormComplete) {
      showToastMessage("Completá todos los campos obligatorios.");
    }
  };

  const handleSubmit = async (
    e: React.SyntheticEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!isFormComplete) {
      showToastMessage("Completá todos los campos obligatorios.");
      return;
    }

    const formErrors = validateRegisterForm(form);
    setErrors(formErrors);

    if (Object.keys(formErrors).length > 0) {
      showToastMessage("Revisá los campos marcados en rojo.");
      return;
    }

    const registerData: RegisterData = {
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password.trim(),
      address: form.address.trim(),
      phone: form.phone.trim(),
    };

    try {
      setIsLoading(true);

      await registerUser(registerData);

      showToastMessage("Registro exitoso. Redirigiendo...");

      redirectTimeout.current = setTimeout(() => {
        router.push("/login");
      }, 1200);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "No se pudo completar el registro.";

      setErrors({ general: message });
      showToastMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  const inputClassName = (hasError?: string) =>
    `w-full rounded-xl border bg-white px-4 py-3 text-slate-900 outline-none transition ${
      hasError
        ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
        : "border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
    } ${isLoading ? "cursor-not-allowed opacity-70" : ""}`;

  const submitButtonClassName = `mt-2 w-full rounded-full px-6 py-3.5 font-bold text-white shadow-lg transition
    ${
      !isFormComplete && !isLoading
        ? "bg-blue-300 cursor-not-allowed"
        : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
    }
    ${isLoading ? "opacity-70 cursor-not-allowed" : ""}
  `;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-900">
          Nombre *
        </label>
        <input
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
          disabled={isLoading}
          placeholder="Tu nombre"
          className={inputClassName(errors.name)}
        />
        {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
      </div>

    
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-900">
          Email *
        </label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
          disabled={isLoading}
          placeholder="nombre@email.com"
          className={inputClassName(errors.email)}
        />
        {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-900">
          Contraseña *
        </label>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
            disabled={isLoading}
            placeholder="Mínimo 8 caracteres"
            className={`${inputClassName(errors.password)} pr-20`}
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-600 hover:text-slate-900"
          >
            {showPassword ? "Ocultar" : "Ver"}
          </button>
        </div>

        {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password}</p>}
      </div>

     
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-900">
          Confirmar contraseña *
        </label>

        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            value={form.confirmPassword}
            onChange={(e) =>
              handleChange("confirmPassword", e.target.value)
            }
            disabled={isLoading}
            placeholder="Repetí tu contraseña"
            className={`${inputClassName(errors.confirmPassword)} pr-20`}
          />

          <button
            type="button"
            onClick={() =>
              setShowConfirmPassword((prev) => !prev)
            }
            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-600 hover:text-slate-900"
          >
            {showConfirmPassword ? "Ocultar" : "Ver"}
          </button>
        </div>

        {errors.confirmPassword && (
          <p className="mt-2 text-sm text-red-600">
            {errors.confirmPassword}
          </p>
        )}
      </div>

   
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-900">
          Dirección *
        </label>
        <input
          value={form.address}
          onChange={(e) => handleChange("address", e.target.value)}
          disabled={isLoading}
          placeholder="Calle 123"
          className={inputClassName(errors.address)}
        />
        {errors.address && <p className="mt-2 text-sm text-red-600">{errors.address}</p>}
      </div>

     
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-900">
          Teléfono *
        </label>
        <input
          value={form.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          disabled={isLoading}
          placeholder="Solo números"
          className={inputClassName(errors.phone)}
        />
        {errors.phone && <p className="mt-2 text-sm text-red-600">{errors.phone}</p>}
      </div>

      {errors.general && (
        <p className="text-sm text-red-600">{errors.general}</p>
      )}

      
      <button
        type="submit"
        onClick={handleRegisterClick}
        disabled={isLoading}
        className={submitButtonClassName}
      >
        {isLoading ? "Registrando..." : "Registrarse"}
      </button>
    </form>
  );
}