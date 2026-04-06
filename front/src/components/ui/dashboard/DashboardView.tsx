"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

export default function DashboardView() {
  const router = useRouter();
  const { user, logout } = useUser();

  if (!user) {
    return (
      <section className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <h1 className="mb-3 text-2xl font-bold text-slate-900">
            Tenés que iniciar sesión
          </h1>

          <p className="mb-6 text-slate-600">
            Accedé con tu cuenta para ver tu dashboard.
          </p>

          <Link
            href="/login?redirect=/dashboard"
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-800"
          >
            Iniciar sesión
          </Link>
        </div>
      </section>
    );
  }

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <section className="py-10 md:py-14">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-8">
          <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
            Panel de usuario
          </span>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
            Hola, {user.name}
          </h1>

          <p className="mt-3 max-w-2xl text-base text-slate-600 md:text-lg">
            Desde acá podés consultar tus datos, revisar tus compras y acceder
            rápido a las secciones principales de Zentra.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
            <h2 className="mb-5 text-xl font-semibold text-slate-900">
              Mis datos
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-500">ID</p>
                <p className="mt-1 text-base font-semibold text-slate-900">
                  {user.id}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-500">Nombre</p>
                <p className="mt-1 text-base font-semibold text-slate-900">
                  {user.name}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-500">Email</p>
                <p className="mt-1 break-all text-base font-semibold text-slate-900">
                  {user.email}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-500">Dirección</p>
                <p className="mt-1 text-base font-semibold text-slate-900">
                  {user.address}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:col-span-2">
                <p className="text-sm font-medium text-slate-500">Teléfono</p>
                <p className="mt-1 text-base font-semibold text-slate-900">
                  {user.phone}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-500">Rol</p>
                <p className="mt-1 text-base font-semibold text-slate-900">
                  {user.role}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-semibold text-slate-900">
              Acciones rápidas
            </h2>

            <div className="flex flex-col gap-3">
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-800"
              >
                Ver productos
              </Link>

              <Link
                href="/orders"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-3 font-semibold text-slate-900 transition hover:bg-slate-50"
              >
                Ver mis compras
              </Link>

              <Link
                href="/cart"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-3 font-semibold text-slate-900 transition hover:bg-slate-50"
              >
                Ir al carrito
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center justify-center rounded-full border border-red-200 px-5 py-3 font-semibold text-red-600 transition hover:bg-red-50"
              >
                Cerrar sesión
              </button>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}