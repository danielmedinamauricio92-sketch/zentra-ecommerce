"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import { Order } from "@/types/order";
import { Product } from "@/types/product";
import { Category } from "@/types/category";
import { getUserOrders } from "@/services/order.service";

import { OrdersHeader } from "@/components/orders/OrdersHeader";
import { OrdersLoading } from "@/components/orders/OrdersLoading";
import { OrdersError } from "@/components/orders/OrdersError";
import { OrdersEmpty } from "@/components/orders/OrdersEmpty";
import { OrderCard } from "@/components/orders/OrderCard";

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
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Ocurrió un error al cargar tus compras.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, token]);

  const handleBuyAgain = (orderId: number, products: Order["products"]) => {
    products.forEach((product) => {
      const productForCart: Product = {
        ...product,
        stock: product.stock ?? 1,
        category:
          product.category ??
          ({
            id: 0,
            name: "Sin categoría",
          } as Category),
      };

      addToCart(productForCart);
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
          {orders.map((order, index) => (
            <OrderCard
              key={order.id}
              order={order}
              index={index}
              reorderedId={reorderedId}
              onBuyAgain={handleBuyAgain}
            />
          ))}
        </div>
      </section>
    </>
  );
}