import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-slate-950 text-slate-300">
      <div className="border-b border-slate-800">
        <div className="mx-auto grid max-w-6xl gap-4 px-6 py-5 text-sm sm:grid-cols-3">
          <div className="flex items-center gap-3">
            <span className="text-lg">🚚</span>
            <span>Envíos seleccionados sin cargo</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-lg">🔒</span>
            <span>Pagos seguros y protegidos</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-lg">🛡️</span>
            <span>Garantía oficial en productos destacados</span>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">🛒</span>
            <span className="text-2xl font-bold tracking-tight text-white">
              Zentra
            </span>
          </div>

          <p className="mt-4 max-w-sm text-sm leading-7 text-slate-400">
            Tecnología, diseño y rendimiento en una tienda pensada para una
            experiencia de compra clara, rápida y confiable.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-white">
            Navegación
          </h3>

          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <Link href="/" className="hover:text-white">
                Inicio
              </Link>
            </li>
            <li>
              <Link href="/products" className="hover:text-white">
                Productos
              </Link>
            </li>
            <li>
              <Link href="/cart" className="hover:text-white">
                Carrito
              </Link>
            </li>
            <li>
              <Link href="/orders" className="hover:text-white">
                Mis compras
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-white">
            Cuenta
          </h3>

          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <Link href="/login" className="hover:text-white">
                Iniciar sesión
              </Link>
            </li>
            <li>
              <Link href="/register" className="hover:text-white">
                Crear cuenta
              </Link>
            </li>
            <li>
              <Link href="/checkout" className="hover:text-white">
                Finalizar compra
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-white">
            Contacto
          </h3>

          <div className="mt-4 space-y-3 text-sm">
            <p>hola@zentra.com</p>
            <p className="text-slate-400">
              Atención online de lunes a sábado
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <span className="rounded-full border px-3 py-1.5 text-xs text-slate-400">
              Instagram
            </span>
            <span className="rounded-full border px-3 py-1.5 text-xs text-slate-400">
              Facebook
            </span>
            <span className="rounded-full border px-3 py-1.5 text-xs text-slate-400">
              X
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-6 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
          <p>© 2026 Zentra. Todos los derechos reservados.</p>

          <div className="flex gap-5">
            <span>Términos</span>
            <span>Privacidad</span>
            <span>Ayuda</span>
          </div>
        </div>
      </div>
    </footer>
  );
}