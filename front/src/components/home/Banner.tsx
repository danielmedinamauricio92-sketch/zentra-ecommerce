"use client";

import Link from "next/link";

export function ZentraBanner() {
  return (
    <section className="w-full px-4 md:px-6 mt-4 md:mt-6">
      <div className="relative overflow-hidden rounded-3xl min-h-105 md:min-h-110 flex items-center">
        <img
          src="/images/banner-zentra.png"
          alt="Banner principal de Zentra"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-linear-to-r from-[#050816]/88 via-[#0b1028]/58 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-t from-black/35 via-transparent to-transparent" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-14">
          <div className="max-w-xl">
            <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 backdrop-blur-sm px-4 py-2 text-sm font-semibold text-white shadow-lg">
              Nueva colección 2026
            </span>

            <h1 className="mt-5 text-white text-4xl md:text-5xl font-extrabold leading-tight tracking-tight drop-shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
              Tecnología premium
              <span className="block text-white/92">para tu día a día</span>
            </h1>

            <p className="mt-4 text-base md:text-lg text-white/78 leading-relaxed max-w-lg">
              Descubrí dispositivos elegidos por diseño, rendimiento y comodidad
              para una experiencia moderna y confiable.
            </p>

            <div className="mt-7 flex flex-col sm:flex-row gap-4">
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-full bg-blue-600 px-7 py-3.5 text-white font-semibold text-base shadow-xl hover:bg-blue-500 transition-all duration-300 hover:scale-[1.02]"
              >
                Ver productos
              </Link>

          
              <Link
                href="/offers"
                className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/20 backdrop-blur-sm px-7 py-3.5 text-white font-semibold text-base shadow-lg hover:bg-white/30 transition-all duration-300"
              >
                Ver ofertas
              </Link>
            </div>

            <div className="mt-7 flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-6 text-white/85">
              <div className="flex items-center gap-2 text-sm md:text-base">
                <span>🚚</span>
                <span>Envío gratis</span>
              </div>

              <div className="flex items-center gap-2 text-sm md:text-base">
                <span>🛡️</span>
                <span>Garantía de 1 año</span>
              </div>

              <div className="flex items-center gap-2 text-sm md:text-base">
                <span>🔒</span>
                <span>Pago seguro</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}