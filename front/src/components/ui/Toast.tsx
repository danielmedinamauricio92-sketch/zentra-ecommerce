"use client";

import { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  show: boolean;
  onClose: () => void;
}

export default function Toast({ message, show, onClose }: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!show) return;

    setVisible(true);

    const timer = setTimeout(() => {
      setVisible(false);

      const closeTimer = setTimeout(() => {
        onClose();
      }, 300);

      return () => clearTimeout(closeTimer);
    }, 2500);

    return () => clearTimeout(timer);
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div
      className={`fixed right-6 top-24 z-[999] transition-all duration-300 ${
        visible
          ? "translate-y-0 opacity-100"
          : "-translate-y-4 opacity-0"
      }`}
    >
      <div className="rounded-lg border border-white/10 bg-black/80 px-6 py-3 text-white shadow-lg backdrop-blur-md">
        {message}
      </div>
    </div>
  );
}