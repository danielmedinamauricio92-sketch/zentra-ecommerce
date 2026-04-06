import Link from "next/link";
import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterView() {
  return (
    <section className="flex items-center justify-center py-14 md:py-20">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">
        <div className="mb-6">
          <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
            Crear cuenta
          </span>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900">
            Registro
          </h1>

          <p className="mt-2 text-slate-600">
            Completá tus datos para empezar a comprar.
          </p>
        </div>

        <RegisterForm />

        <p className="mt-6 text-center text-sm text-slate-600">
          ¿Ya tenés cuenta?{" "}
          <Link
            href="/login"
            className="font-semibold text-blue-600 hover:underline"
          >
            Iniciá sesión
          </Link>
        </p>
      </div>
    </section>
  );
}