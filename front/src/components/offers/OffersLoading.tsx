export function OffersLoading() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900" />

      <p className="mt-4 text-sm font-medium text-slate-600">
        Cargando ofertas...
      </p>
    </div>
  );
}