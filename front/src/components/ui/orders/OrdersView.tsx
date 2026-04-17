"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import { Order } from "@/types/order";
import { Product } from "@/types/product";
import { getUserOrders } from "@/services/order.service";

import { OrdersHeader } from "@/components/orders/OrdersHeader";
import { OrdersLoading } from "@/components/orders/OrdersLoading";
import { OrdersError } from "@/components/orders/OrdersError";
import { OrdersEmpty } from "@/components/orders/OrdersEmpty";
import { OrderCard } from "@/components/orders/OrderCard";

import { groupOrderProducts } from "@/utils/pricing.utils";

export default function OrdersView() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reorderedId, setReorderedId] = useState<number | null>(null);

  const { addToCart } = useCart();
  const { user, token } = useUser();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");

        if (!user || !token) {
          setError("Debes iniciar sesión para ver tus compras.");
          return;
        }

        const data = await getUserOrders(token);
        setOrders(data);
      } catch (err: any) {
        setError(err?.message || "Ocurrió un error al cargar tus compras.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, token]);

  const handleBuyAgain = (orderId: number, items: Order["items"]) => {
    items.forEach((item) => {
      for (let i = 0; i < item.quantity; i++) {
        const productForCart: Product = {
          ...item.product,
          stock: item.product.stock ?? 1,
          category: item.product.category ?? { id: 0, name: "Sin categoría" },
        };

        addToCart(productForCart);
      }
    });

    setReorderedId(orderId);

    setTimeout(() => {
      setReorderedId(null);
    }, 2500);
  };

  if (loading) {
    return <OrdersLoading />;
  }

  if (error) {
    return <OrdersError message={error} />;
  }

  if (orders.length === 0) {
    return <OrdersEmpty />;
  }

  return (
    <>
      <OrdersHeader />

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {orders.map((order, index) => {
            const groupedProducts = groupOrderProducts(order.items);

            return (
              <OrderCard
                key={order.id}
                order={order}
                index={index}
                reorderedId={reorderedId}
                onBuyAgain={handleBuyAgain}
                groupedProducts={groupedProducts}
              />
            );
          })}
        </div>
      </section>
    </>
  );
}