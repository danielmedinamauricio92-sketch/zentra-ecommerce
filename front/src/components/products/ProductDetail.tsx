"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { Product } from "@/types/product";

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const { cart, addToCart, decreaseQuantity } = useCart();

  const cartItem = cart.find((item) => item.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const availableToAdd = product.stock - quantity;
  const reachedCartLimit = !isOutOfStock && availableToAdd === 0;
  const canDecrease = quantity > 0;

  return (
    <section className="py-10 md:py-14">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="relative flex min-h-105 items-center justify-center bg-slate-50 p-8 md:p-12">
            <div className="absolute left-6 top-6 z-10 flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white shadow">
                Producto destacado
              </span>
              <span className="inline-flex items-center rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white shadow">
                Zentra
              </span>
            </div>

            <img
              src={product.image}
              alt={product.name}
              className="h-auto w-full max-w-md object-contain drop-shadow-xl"
            />
          </div>

          <div className="flex flex-col justify-between p-8 md:p-10">
            <div>
              <p className="mb-3 text-sm font-semibold text-blue-600">
                Zentra · Tecnología premium
              </p>

              <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
                {product.name}
              </h1>

              <p className="mb-2 text-3xl font-bold text-slate-900">
                ${product.price.toLocaleString("es-AR")}
              </p>

              {isOutOfStock ? (
                <p className="mb-2 text-sm font-semibold text-red-600">
                  Sin stock
                </p>
              ) : isLowStock ? (
                <p className="mb-2 text-sm font-semibold text-orange-500">
                  Últimas unidades · Stock disponible: {product.stock}
                </p>
              ) : (
                <p className="mb-2 text-sm font-medium text-green-600">
                  En stock · Disponible: {product.stock} unidades
                </p>
              )}

              {!isOutOfStock && (
                <p className="mb-6 text-sm text-slate-600">
                  {reachedCartLimit
                    ? "Ya alcanzaste el stock disponible para este producto"
                    : `Podés agregar ${availableToAdd} más al carrito`}
                </p>
              )}

              <p className="mb-8 max-w-xl text-base leading-relaxed text-slate-600">
                {product.description ||
                  "Descubrí un producto pensado para ofrecer rendimiento, diseño y una experiencia moderna en tu día a día."}
              </p>

              <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-900">
                    🚚 Envío gratis
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    En compras seleccionadas
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-900">
                    🛡️ Garantía
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    Cobertura por 1 año
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-900">
                    🔒 Pago seguro
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    Checkout protegido
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 border-t border-slate-200 pt-6">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => decreaseQuantity(product.id)}
                  disabled={!canDecrease}
                  className={`h-11 w-11 rounded-full text-xl font-bold transition ${
                    canDecrease
                      ? "bg-slate-200 text-slate-900 hover:bg-slate-300"
                      : "cursor-not-allowed bg-slate-200 text-slate-400"
                  }`}
                >
                  -
                </button>

                <span className="min-w-10 text-center text-lg font-semibold text-slate-900">
                  {quantity}
                </span>

                <button
                  onClick={() => addToCart(product)}
                  disabled={isOutOfStock || reachedCartLimit}
                  className={`inline-flex items-center justify-center rounded-full px-6 py-3 font-semibold text-white transition ${
                    isOutOfStock || reachedCartLimit
                      ? "cursor-not-allowed bg-slate-300"
                      : "bg-blue-600 hover:bg-blue-500"
                  }`}
                >
                  {isOutOfStock
                    ? "Sin stock"
                    : reachedCartLimit
                    ? "Stock máximo alcanzado"
                    : "Agregar al carrito"}
                </button>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/cart"
                  className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-800"
                >
                  Ir al carrito
                </Link>

                <Link
                  href="/products"
                  className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3 font-semibold text-slate-900 transition hover:bg-slate-50"
                >
                  Ver más productos
                </Link>

                <Link
                  href="/offers"
                  className="inline-flex items-center justify-center rounded-full border border-red-300 px-6 py-3 font-semibold text-red-700 transition hover:bg-red-50"
                >
                  Ver ofertas
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}