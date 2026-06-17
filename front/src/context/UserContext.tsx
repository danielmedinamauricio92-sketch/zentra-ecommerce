"use client";

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { User } from "@/types/user";
import { Order } from "@/types/order";
import { getUserOrders } from "@/services/order.service";
import { getCurrentUser, logoutUser } from "@/services/auth.service";

interface ToastState {
  show: boolean;
  message: string;
}

interface UserContextType {
  user: User | null;
  isHydrated: boolean;
  toast: ToastState;
  setToast: (toast: ToastState) => void;
  login: (user: User) => void;
  updateUser: (user: User) => void;
  logout: () => void;
  orders: Order[];
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
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

  const login = (user: User) => {
    setUser(user);
    showToast("Sesión iniciada correctamente");
  };

  const updateUser = (user: User) => {
    setUser(user);
  };

  const logout = useCallback(() => {
    logoutUser().catch(() => undefined);
    setUser(null);
    setOrders([]);
    showToast("Sesión cerrada correctamente");
  }, []);

  useEffect(() => {
    getCurrentUser()
      .then(({ user }) => {
        setUser(user);
      })
      .catch(() => {
        setUser(null);
        setOrders([]);
      })
      .finally(() => {
        setIsHydrated(true);
      });
  }, []);

  useEffect(() => {
    if (!isHydrated || !user) return;

    getUserOrders()
      .then((orders) => {
        setOrders(orders);
      })
      .catch((error) => {
        console.error("Error al validar la sesión con el backend:", error);
        logout();
      });
  }, [isHydrated, user, logout]);

  return (
    <UserContext.Provider
      value={{
        user,
        isHydrated,
        toast,
        setToast,
        login,
        updateUser,
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
