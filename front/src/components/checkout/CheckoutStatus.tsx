"use client";

type Props = {
  type: "loading" | "redirecting" | "submitting" | "success";
};

const content = {
  loading: {
    title: "",
    message: "Cargando checkout...",
  },
  redirecting: {
    title: "",
    message: "Redirigiendo al login...",
  },
  submitting: {
    title: "Procesando tu pedido...",
    message: "Estamos confirmando el stock y registrando la compra.",
  },
  success: {
    title: "Pedido registrado con éxito",
    message: "Redirigiendo a tus compras...",
  },
};

export default function CheckoutStatus({ type }: Props) {
  if (type === "loading" || type === "redirecting") {
    return (
      <section className="py-14 md:py-20">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-lg text-slate-700">{content[type].message}</p>
        </div>
      </section>
    );
  }

  if (type === "submitting") {
    return (
      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm md:p-10">
          <div className="mx-auto mb-5 h-16 w-16 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />

          <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
            {content[type].title}
          </h1>

          <p className="mb-6 text-base text-slate-600 md:text-lg">
            {content[type].message}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-14 md:py-20">
      <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm md:p-10">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700">
          OK
        </div>

        <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
          {content[type].title}
        </h1>

        <p className="mb-6 text-base text-slate-600 md:text-lg">
          {content[type].message}
        </p>
      </div>
    </section>
  );
}
