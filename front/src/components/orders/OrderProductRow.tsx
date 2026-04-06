import { OrderProduct } from "@/types/order";

interface OrderProductRowProps {
  product: OrderProduct;
}

export function OrderProductRow({ product }: OrderProductRowProps) {
  const subtotal = Number(product.price ?? 0);

  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white">
        <img
          src={product.image}
          alt={product.name}
          className="h-14 w-14 object-contain"
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-base font-semibold text-slate-900">
          {product.name}
        </p>

        <p className="mt-1 text-sm text-slate-500">
          Precio unitario: ${product.price.toLocaleString("es-AR")}
        </p>

        <p className="mt-1 text-sm text-slate-500">
          Cantidad: 1
        </p>
      </div>

      <div className="text-right">
        <p className="text-sm text-slate-500">Subtotal</p>

        <p className="mt-1 text-base font-bold text-slate-900">
          ${subtotal.toLocaleString("es-AR")}
        </p>
      </div>
    </div>
  );
}