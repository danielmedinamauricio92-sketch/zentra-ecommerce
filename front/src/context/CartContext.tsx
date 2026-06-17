"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useUser } from "@/context/UserContext";
import { Product } from "@/types/product";
import { CartItem } from "@/types/cart-item";
import {
  addCartItem,
  clearCartItems,
  getCart,
  removeCartItem,
  updateCartItem,
} from "@/services/cart.service";

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => Promise<void>;
  removeFromCart: (id: number) => Promise<void>;
  clearCart: () => Promise<void>;
  increaseQuantity: (id: number) => Promise<void>;
  decreaseQuantity: (id: number) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, isHydrated: isUserHydrated, setToast } = useUser();
  const [cart, setCart] = useState<CartItem[]>([]);

  const showToast = (message: string) => {
    setToast({
      show: true,
      message,
    });
  };

  const runCartAction = async (
    action: () => Promise<CartItem[]>,
    successMessage?: string
  ) => {
    try {
      const nextCart = await action();
      setCart(nextCart);

      if (successMessage) {
        showToast(successMessage);
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo actualizar el carrito";
      showToast(message);
    }
  };

  useEffect(() => {
    if (!isUserHydrated) return;

    if (!user) {
      Promise.resolve().then(() => setCart([]));
      return;
    }

    getCart()
      .then(setCart)
      .catch((error) => {
        console.error("Error al recuperar el carrito:", error);
        setCart([]);
      });
  }, [user, isUserHydrated]);

  const addToCart = async (product: Product) => {
    if (!user) {
      showToast("Tenés que iniciar sesión para agregar productos");
      return;
    }

    if (product.stock === 0) {
      showToast("Este producto no tiene stock");
      return;
    }

    await runCartAction(
      () => addCartItem(product.id),
      "Producto agregado al carrito"
    );
  };

  const removeFromCart = async (id: number) => {
    if (!user) {
      showToast("Tenés que iniciar sesión");
      return;
    }

    await runCartAction(
      () => removeCartItem(id),
      "Producto eliminado del carrito"
    );
  };

  const clearCart = async () => {
    if (!user) {
      showToast("Tenés que iniciar sesión");
      return;
    }

    await runCartAction(() => clearCartItems(), "Carrito vaciado");
  };

  const increaseQuantity = async (id: number) => {
    if (!user) {
      showToast("Tenés que iniciar sesión");
      return;
    }

    const item = cart.find((item) => item.id === id);
    if (!item) return;

    await runCartAction(() => updateCartItem(id, item.quantity + 1));
  };

  const decreaseQuantity = async (id: number) => {
    if (!user) {
      showToast("Tenés que iniciar sesión");
      return;
    }

    const item = cart.find((item) => item.id === id);
    if (!item) return;

    await runCartAction(() => updateCartItem(id, item.quantity - 1));
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        increaseQuantity,
        decreaseQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart debe usarse dentro de CartProvider");
  }

  return context;
}
