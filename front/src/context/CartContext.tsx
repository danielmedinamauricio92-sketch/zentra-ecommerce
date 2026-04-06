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

interface ToastState {
  show: boolean;
  message: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  increaseQuantity: (id: number) => void;
  decreaseQuantity: (id: number) => void;
  toast: ToastState;
  setToast: (toast: ToastState) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, isHydrated: isUserHydrated } = useUser();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: "",
  });
  const [isHydrated, setIsHydrated] = useState(false);

  const showToast = (message: string) => {
    setToast({ show: true, message });
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
        const parsedCart: CartItem[] = JSON.parse(storedCart);
        setCart(parsedCart);
      } else {
        setCart([]);
      }
    } catch (error) {
      console.error("Error al leer el carrito desde localStorage:", error);
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
  }, [cart, isHydrated, user, isUserHydrated]);

  const addToCart = (product: Product) => {
    if (!user) {
      showToast("Tenés que iniciar sesión para agregar productos");
      return;
    }

    if (product.stock === 0) {
      showToast("Este producto no tiene stock");
      return;
    }

    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem && existingItem.quantity >= product.stock) {
      showToast("No podés agregar más unidades de las disponibles");
      return;
    }

    setCart((prev) => {
      const itemExists = prev.find((item) => item.id === product.id);

      if (itemExists) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      const newItem: CartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        stock: product.stock,
        quantity: 1,
      };

      return [...prev, newItem];
    });

    showToast("Producto agregado al carrito 🛒");
  };

  const removeFromCart = (id: number) => {
    if (!user) {
      showToast("Tenés que iniciar sesión");
      return;
    }

    setCart((prev) => prev.filter((item) => item.id !== id));
    showToast("Producto eliminado ❌");
  };

  const clearCart = () => {
    if (!user) {
      showToast("Tenés que iniciar sesión");
      return;
    }

    setCart([]);
    showToast("Carrito vaciado 🧹");
  };

  const increaseQuantity = (id: number) => {
    if (!user) {
      showToast("Tenés que iniciar sesión");
      return;
    }

    const item = cart.find((product) => product.id === id);

    if (!item) return;

    if (item.quantity >= item.stock) {
      showToast("No hay más stock disponible");
      return;
    }

    setCart((prev) =>
      prev.map((product) =>
        product.id === id
          ? { ...product, quantity: product.quantity + 1 }
          : product
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
        toast,
        setToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}