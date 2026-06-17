"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProfileForm from "@/components/profile/ProfileForm";
import { useUser } from "@/context/UserContext";
import { isProfileComplete } from "@/utils/profile.utils";

export default function CompleteProfileView() {
  const router = useRouter();
  const { user, isHydrated, updateUser } = useUser();

  useEffect(() => {
    if (isHydrated && user && isProfileComplete(user)) {
      router.replace("/dashboard");
    }
  }, [isHydrated, router, user]);

  if (!isHydrated) {
    return (
      <section className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-6">
        <p className="text-sm font-medium text-slate-600">Cargando perfil...</p>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-6">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">
            Inicia sesion para continuar
          </h1>
          <Link
            href="/login"
            className="mt-6 inline-flex rounded-full bg-slate-900 px-6 py-3 font-semibold text-white"
          >
            Ir al login
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="flex items-center justify-center py-14 md:py-20">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">
        <div className="mb-6">
          <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
            Perfil Zentra
          </span>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900">
            Completa tus datos
          </h1>

          <p className="mt-2 text-slate-600">
            Necesitamos direccion y telefono para preparar tus compras.
          </p>
        </div>

        <ProfileForm
          user={user}
          submitLabel="Guardar y continuar"
          onSaved={(updatedUser) => {
            updateUser(updatedUser);
            router.push("/dashboard");
          }}
        />
      </div>
    </section>
  );
}
