"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { User } from "@/types/user";

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

  const showToast = (message: string) => {
    setToast({
      show: true,
      message,
    });
  };

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      if (storedUser && storedToken) {
        const parsedUser: User = JSON.parse(storedUser);
        setUser(parsedUser);
        setToken(storedToken);
      }
    } catch (error) {
      console.error("Error al recuperar la sesión:", error);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    } finally {
      setIsHydrated(true);
    }
  }, []);

  const login = (userData: User, userToken: string) => {
    setUser(userData);
    setToken(userToken);

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", userToken);

    showToast("Sesión iniciada correctamente ✅");
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("cart");

    showToast("Sesión cerrada correctamente 👋");
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
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
}