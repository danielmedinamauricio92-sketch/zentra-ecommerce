import { GroupedOrderProduct } from "@/utils/pricing.utils";

interface OrderProductRowProps {
  product: GroupedOrderProduct;
}

export function OrderProductRow({ product }: OrderProductRowProps) {
  const unitPrice = Number(product.price ?? 0);
  const subtotal = Number(product.subtotal ?? 0);

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
          Precio unitario: ${unitPrice.toLocaleString("es-AR")}
        </p>

        <p className="mt-1 text-sm text-slate-500">
          Cantidad: {product.quantity ?? 0}
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