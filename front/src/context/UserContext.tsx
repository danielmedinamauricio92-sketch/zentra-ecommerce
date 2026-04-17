"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { User } from "@/types/user";
import { Order } from "@/types/order";
import { getUserOrders } from "@/services/order.service";

interface ToastState {
  show: boolean;
  message: string;
}

interface UserContextType {
  user: User | null;
  token: string | null;
  isHydrated: boolean;
  toast: ToastState;
  setToast: (toast: ToastState) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  orders: Order[];
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: "",
  });
  const [orders, setOrders] = useState<Order[]>([]);

  const showToast = (message: string) => {
    setToast({
      show: true,
      message,
    });
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    try {
      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      }
    } catch (error) {
      console.error("Error al recuperar la sesión:", error);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setOrders([]);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (isHydrated && user && token) {
      getUserOrders(token)
        .then((orders) => {
          setOrders(orders);
        })
        .catch((error) => {
          console.error("Error al validar la sesión con el backend:", error);
          logout();
        });
    }
  }, [isHydrated, user, token]);

  const login = (user: User, token: string) => {
    setUser(user);
    setToken(token);

    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);

    showToast("Sesión iniciada correctamente");
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setOrders([]);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("cart");

    showToast("Sesión cerrada correctamente");
  };

  return (
    <UserContext.Provider
      value={{
        user,
        token,
        isHydrated,
        toast,
        setToast,
        login,
        logout,
        orders,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser debe usarse dentro de UserProvider");
  }

  return context;
}