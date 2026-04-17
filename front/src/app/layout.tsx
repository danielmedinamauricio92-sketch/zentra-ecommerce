import type { Metadata } from "next";
import { CartProvider } from "@/context/CartContext";
import { UserProvider } from "@/context/UserContext";
import LayoutContent from "@/components/layout/LayoutContent";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zentra",
  description: "Tienda online de tecnología premium",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <UserProvider>
          <CartProvider>
            <LayoutContent>{children}</LayoutContent>
          </CartProvider>
        </UserProvider>
      </body>
    </html>
  );
}