"use client";

import { useEffect, useState } from "react";
import { usePageTransition } from "./components/PageTransition";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const { isTransitioning } = usePageTransition();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background-primary via-background-secondary to-background-primary flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-highlight-cta border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className={`transition-opacity duration-150 ease-in-out ${isTransitioning ? "opacity-0" : "opacity-100"}`}>
      {children}
    </div>
  );
}
