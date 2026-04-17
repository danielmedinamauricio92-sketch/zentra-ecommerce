"use client";

import { useEffect, useRef, useState } from "react";
import { useUser } from "@/context/UserContext";
import { useRouter, useSearchParams } from "next/navigation";
import { loginUser } from "@/services/auth.service";
import { LoginCredentials } from "@/types/auth";
import { validateLoginForm } from "@/utils/loginValidation";
import { LoginFormErrors } from "@/types/forms";

export default function LoginForm() {
  const { login, setToast } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTimeout = useRef<NodeJS.Timeout | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

  const handleSubmit = async (
    e: React.SyntheticEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const formErrors = validateLoginForm({ email, password });
    setErrors(formErrors);

    if (Object.keys(formErrors).length > 0) {
      showToastMessage("Revisá los campos marcados.");
      return;
    }

    const credentials: LoginCredentials = {
      email: email.trim(),
      password: password.trim(),
    };

    try {
      setIsLoading(true);

      const data = await loginUser(credentials);

      login(data.user, data.token);
      showToastMessage("Inicio de sesión correcto.");

      const redirectTo = searchParams.get("redirect") || "/";

      redirectTimeout.current = setTimeout(() => {
        router.push(redirectTo);
      }, 900);
    } catch (err: unknown) {
      const rawMessage =
        err instanceof Error ? err.message.toLowerCase() : "";

      let message = "No se pudo iniciar sesión. Intentá nuevamente.";

      if (
        rawMessage.includes("user not found") ||
        rawMessage.includes("usuario no existe") ||
        rawMessage.includes("user does not exist") ||
        rawMessage.includes("no existe una cuenta") ||
        rawMessage.includes("email not found")
      ) {
        message = "No existe una cuenta con ese email.";
      } else if (
        rawMessage.includes("invalid credentials") ||
        rawMessage.includes("credenciales inválidas") ||
        rawMessage.includes("credenciales invalidas") ||
        rawMessage.includes("incorrect password") ||
        rawMessage.includes("wrong password") ||
        rawMessage.includes("unauthorized") ||
        rawMessage.includes("unauthorised") ||
        rawMessage.includes("invalid login") ||
        rawMessage.includes("bad credentials")
      ) {
        message = "Alguno de los campos es incorrecto.";
      }

      setErrors({ general: message });
      showToastMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);

    if (errors.email || errors.general) {
      setErrors((prev) => ({
        ...prev,
        email: undefined,
        general: undefined,
      }));
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);

    if (errors.password || errors.general) {
      setErrors((prev) => ({
        ...prev,
        password: undefined,
        general: undefined,
      }));
    }
  };

  const inputClassName = (hasError?: string) =>
    `w-full rounded-2xl border bg-white px-4 py-3.5 text-slate-900 outline-none transition ${
      hasError
        ? "border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-100"
        : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
    } ${isLoading ? "cursor-not-allowed opacity-70" : ""}`;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-semibold text-slate-800"
        >
          Email
        </label>

        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => handleEmailChange(e.target.value)}
          disabled={isLoading}
          autoComplete="email"
          placeholder="tuemail@ejemplo.com"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
          className={inputClassName(errors.email)}
        />

        {errors.email && (
          <p id="email-error" className="mt-2 text-sm font-medium text-red-600">
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-semibold text-slate-800"
        >
          Contraseña
        </label>

        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => handlePasswordChange(e.target.value)}
            disabled={isLoading}
            autoComplete="current-password"
            placeholder="Ingresá tu contraseña"
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? "password-error" : undefined}
            className={`${inputClassName(errors.password)} pr-20`}
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            disabled={isLoading}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-600 transition hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {showPassword ? "Ocultar" : "Ver"}
          </button>
        </div>

        {errors.password && (
          <p
            id="password-error"
            className="mt-2 text-sm font-medium text-red-600"
          >
            {errors.password}
          </p>
        )}
      </div>

      {errors.general && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm font-medium text-red-700">{errors.general}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="mt-1 inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isLoading ? "Ingresando..." : "Ingresar"}
      </button>
    </form>
  );
}