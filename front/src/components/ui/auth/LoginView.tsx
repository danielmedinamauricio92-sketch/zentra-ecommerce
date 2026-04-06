import Link from "next/link";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginView() {
  return (
    <section className="flex items-center justify-center py-14 md:py-20">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">
        <div className="mb-6">
          <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
            Acceso Zentra
          </span>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900">
            Iniciar sesión
          </h1>

          <p className="mt-2 text-slate-600">
            Ingresá con tu cuenta para continuar con tu compra.
          </p>
        </div>

        <LoginForm />

        <p className="mt-6 text-center text-sm text-slate-600">
          ¿No tenés cuenta?{" "}
          <Link
            href="/register"
            className="font-semibold text-blue-600 hover:underline"
          >
            Registrate
          </Link>
        </p>
      </div>
    </section>
  );
}