"use client";

import { createContext, useContext, useState, ReactNode, useRef } from "react";

interface PageTransitionContextType {
  isTransitioning: boolean;
  startTransition: (callback: () => void) => void;
}

const PageTransitionContext = createContext<PageTransitionContextType | undefined>(undefined);

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const callbackRef = useRef<(() => void) | null>(null);

  const startTransition = (callback: () => void) => {
    callbackRef.current = callback;
    setIsTransitioning(true);
    
    // Wait for fade-out animation to complete
    setTimeout(() => {
      // Use ref to get the latest callback
      if (callbackRef.current) {
        callbackRef.current();
      }
      callbackRef.current = null;
      
      // Wait for page to render, then fade in
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 150);
  };

  return (
    <PageTransitionContext.Provider value={{ isTransitioning, startTransition }}>
      {children}
    </PageTransitionContext.Provider>
  );
}

export function usePageTransition() {
  const context = useContext(PageTransitionContext);
  if (context === undefined) {
    throw new Error("usePageTransition must be used within a PageTransitionProvider");
  }
  return context;
}
