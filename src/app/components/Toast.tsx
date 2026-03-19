"use client";

import { useEffect } from "react";

interface ToastProps {
  message: string;
  type: "success" | "error" | "info";
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export default function Toast({
  message,
  type,
  isVisible,
  onClose,
  duration = 3000,
}: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const bgColor =
    type === "success"
      ? "bg-success"
      : type === "error"
      ? "bg-error"
      : "bg-info";

  return (
    <div className="fixed top-20 right-4 z-50 animate-slide-in-right">
      <div
        className={`${bgColor} text-text-primary px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 min-w-[300px] max-w-md border border-neutral-surface`}
      >
        <span className="text-xl font-bold">
          {type === "success" ? "✓" : type === "error" ? "✗" : "ℹ"}
        </span>
        <span className="flex-1">{message}</span>
        <button
          onClick={onClose}
          className="text-text-primary hover:text-text-secondary transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
