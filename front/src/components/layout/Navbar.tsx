"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

export default function Navbar() {
  const { user, logout } = useUser();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <nav className="fixed z-50 w-full border-b border-white/10 bg-black/80 text-white backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="text-xl font-bold tracking-tight md:text-2xl">
          Zentra
        </Link>

        <div className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Link href="/" className="transition hover:text-blue-400">
            Home
          </Link>

          <Link href="/products" className="transition hover:text-blue-400">
            Productos
          </Link>

          {user && (
            <>
              <Link href="/dashboard" className="transition hover:text-blue-400">
                Dashboard
              </Link>

              <Link href="/orders" className="transition hover:text-blue-400">
                Mis compras
              </Link>

              {user.role === "admin" && (
                <Link href="/admin" className="transition hover:text-blue-400">
                  Admin
                </Link>
              )}
            </>
          )}
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          {!user ? (
            <>
              <Link
                href="/login"
                className="hidden text-sm transition hover:text-blue-400 md:inline"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold transition hover:bg-blue-500"
              >
                Crear cuenta
              </Link>
            </>
          ) : (
            <>
              <span className="hidden text-sm text-white/70 md:inline">
                {user.name}
              </span>

              <button
                onClick={handleLogout}
                className="text-sm text-red-400 transition hover:text-red-300"
              >
                Salir
              </button>
            </>
          )}

          <Link
            href="/cart"
            className="relative rounded-full bg-white/10 px-3 py-2 text-sm font-semibold transition hover:bg-white/20"
          >
            Carrito
          </Link>

          <Link
            href="/checkout"
            className="rounded-full bg-green-600 px-4 py-2 text-sm font-semibold transition hover:bg-green-500"
          >
            Checkout
          </Link>
        </div>
      </div>
    </nav>
  );
}
