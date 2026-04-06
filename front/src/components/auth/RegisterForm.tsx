"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/services/auth.service";
import { useUser } from "@/context/UserContext";
import { RegisterData } from "@/types/auth";

export default function RegisterForm() {
  const router = useRouter();
  const { setToast } = useUser();
  const redirectTimeout = useRef<NodeJS.Timeout | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  const validateForm = () => {
    if (
      !name.trim() ||
      !email.trim() ||
      !password.trim() ||
      !address.trim() ||
      !phone.trim()
    ) {
      const message = "Todos los campos son obligatorios";
      setError(message);
      showToastMessage(message);
      return false;
    }

    if (!email.includes("@")) {
      const message = "Email inválido";
      setError(message);
      showToastMessage(message);
      return false;
    }

    if (password.trim().length < 4) {
      const message = "La contraseña debe tener al menos 4 caracteres";
      setError(message);
      showToastMessage(message);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");

    const isValid = validateForm();
    if (!isValid) return;

    const registerData: RegisterData = {
      name: name.trim(),
      email: email.trim(),
      password: password.trim(),
      address: address.trim(),
      phone: phone.trim(),
    };

    try {
      setIsLoading(true);

      await registerUser(registerData);

      showToastMessage("Registro exitoso 🚀");

      redirectTimeout.current = setTimeout(() => {
        router.push("/login");
      }, 1200);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Error al registrarse";

      setError(message);
      showToastMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label
          htmlFor="name"
          className="mb-2 block text-sm font-semibold text-slate-900"
        >
          Nombre
        </label>
        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          placeholder="Tu nombre"
          autoComplete="name"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-semibold text-slate-900"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          placeholder="Tu email"
          autoComplete="email"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-semibold text-slate-900"
        >
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          placeholder="********"
          autoComplete="new-password"
        />
      </div>

      <div>
        <label
          htmlFor="address"
          className="mb-2 block text-sm font-semibold text-slate-900"
        >
          Dirección
        </label>
        <input
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          placeholder="Tu dirección"
          autoComplete="street-address"
        />
      </div>

      <div>
        <label
          htmlFor="phone"
          className="mb-2 block text-sm font-semibold text-slate-900"
        >
          Teléfono
        </label>
        <input
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          placeholder="Tu teléfono"
          autoComplete="tel"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={isLoading}
        className="mt-2 w-full rounded-full bg-blue-600 px-6 py-3.5 font-bold text-white shadow-lg transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isLoading ? "Registrando..." : "Registrarse"}
      </button>
    </form>
  );
}