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

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  increaseQuantity: (id: number) => void;
  decreaseQuantity: (id: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, isHydrated: isUserHydrated, setToast } = useUser();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  const showToast = (message: string) => {
    setToast({
      show: true,
      message,
    });
  };

  useEffect(() => {
    if (!isUserHydrated) return;

    if (!user) {
      setCart([]);
      localStorage.removeItem("cart");
      setIsHydrated(true);
      return;
    }

    try {
      const storedCart = localStorage.getItem("cart");

      if (storedCart) {
        setCart(JSON.parse(storedCart));
      } else {
        setCart([]);
      }
    } catch (error) {
      console.error("Error al recuperar el carrito:", error);
      setCart([]);
    } finally {
      setIsHydrated(true);
    }
  }, [user, isUserHydrated]);

  useEffect(() => {
    if (!isUserHydrated || !isHydrated) return;

    if (!user) {
      localStorage.removeItem("cart");
      return;
    }

    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart, user, isHydrated, isUserHydrated]);

  const addToCart = (product: Product) => {
    if (!user) {
      showToast("Tenés que iniciar sesión para agregar productos");
      return;
    }

    if (product.stock === 0) {
      showToast("Este producto no tiene stock");
      return;
    }

    const itemInCart = cart.find((item) => item.id === product.id);

    if (itemInCart && itemInCart.quantity >= product.stock) {
      showToast("No podés agregar más unidades de las disponibles");
      return;
    }

    setCart((prev) => {
      const exists = prev.find((item) => item.id === product.id);

      if (exists) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          stock: product.stock,
          quantity: 1,
        },
      ];
    });

    showToast("Producto agregado al carrito");
  };

  const removeFromCart = (id: number) => {
    if (!user) {
      showToast("Tenés que iniciar sesión");
      return;
    }

    setCart((prev) => prev.filter((item) => item.id !== id));
    showToast("Producto eliminado del carrito");
  };

  const clearCart = () => {
    if (!user) {
      showToast("Tenés que iniciar sesión");
      return;
    }

    setCart([]);
    showToast("Carrito vaciado");
  };

  const increaseQuantity = (id: number) => {
    if (!user) {
      showToast("Tenés que iniciar sesión");
      return;
    }

    const item = cart.find((item) => item.id === id);

    if (!item) return;

    if (item.quantity >= item.stock) {
      showToast("No hay más stock disponible");
      return;
    }

    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (id: number) => {
    if (!user) {
      showToast("Tenés que iniciar sesión");
      return;
    }

    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
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