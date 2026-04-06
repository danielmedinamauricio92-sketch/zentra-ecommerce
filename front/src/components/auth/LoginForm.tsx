"use client";

import { useEffect, useRef, useState } from "react";
import { useUser } from "@/context/UserContext";
import { useRouter, useSearchParams } from "next/navigation";
import { loginUser } from "@/services/auth.service";
import { LoginCredentials } from "@/types/auth";

export default function LoginForm() {
  const { login, setToast } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTimeout = useRef<NodeJS.Timeout | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (redirectTimeout.current) {
        clearTimeout(redirectTimeout.current);
      }
    };
  }, []);

  const showErrorToast = (message: string) => {
    setToast({
      show: true,
      message,
    });
  };

  const validateForm = () => {
    if (!email.trim() || !password.trim()) {
      const message = "Todos los campos son obligatorios";
      setError(message);
      showErrorToast(message);
      return false;
    }

    if (!email.includes("@")) {
      const message = "Email inválido";
      setError(message);
      showErrorToast(message);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");

    const isValid = validateForm();
    if (!isValid) return;

    const credentials: LoginCredentials = {
      email: email.trim(),
      password: password.trim(),
    };

    try {
      setIsLoading(true);

      const data = await loginUser(credentials);

      login(data.user, data.token);

      const redirectTo = searchParams.get("redirect") || "/";

      redirectTimeout.current = setTimeout(() => {
        router.push(redirectTo);
      }, 1000);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Error al iniciar sesión";

      setError(message);
      showErrorToast(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
          placeholder="Ingresá tu email"
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
          placeholder="Ingresá tu contraseña"
          autoComplete="current-password"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={isLoading}
        className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-blue-600 px-6 py-3.5 font-bold text-white shadow-lg transition hover:bg-blue-700 hover:shadow-blue-500/30 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isLoading ? "Ingresando..." : "Ingresar"}
      </button>
    </form>
  );
}