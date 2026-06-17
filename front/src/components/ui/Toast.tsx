"use client";

import { useEffect } from "react";

interface ToastProps {
  message: string;
  show: boolean;
  onClose: () => void;
}

export default function Toast({ message, show, onClose }: ToastProps) {
  useEffect(() => {
    if (!show) return;

    const timer = setTimeout(() => {
      onClose();
    }, 2500);

    return () => clearTimeout(timer);
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed right-6 top-24 z-999 translate-y-0 opacity-100 transition-all duration-300">
      <div className="rounded-lg border border-white/10 bg-black/80 px-6 py-3 text-white shadow-lg backdrop-blur-md">
        {message}
      </div>
    </div>
  );
}
