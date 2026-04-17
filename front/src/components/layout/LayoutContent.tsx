"use client";

import { ReactNode } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Toast from "@/components/ui/Toast";
import { useUser } from "@/context/UserContext";

interface LayoutContentProps {
  children: ReactNode;
}

export default function LayoutContent({ children }: LayoutContentProps) {
  const { toast, setToast } = useUser();

  const handleCloseToast = () => {
    setToast({ show: false, message: "" });
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-50 pt-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          {children}
        </div>
      </main>

      <Footer />

      <Toast
        message={toast.message}
        show={toast.show}
        onClose={handleCloseToast}
      />
    </>
  );
}