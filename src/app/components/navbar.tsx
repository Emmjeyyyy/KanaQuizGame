"use client";

import { useEffect, useState } from "react";
import { getStats, type QuizStats } from "../utils/storage";
import { TransitionLink } from "./TransitionLink";

export default function Navbar() {
  const [stats, setStats] = useState<QuizStats | null>(null);

  useEffect(() => {
    setStats(getStats());

    const handleStorageChange = () => {
      setStats(getStats());
    };

    window.addEventListener("statsUpdated", handleStorageChange);
    return () => window.removeEventListener("statsUpdated", handleStorageChange);
  }, []);

  const navItems = [
    { href: "/", icon: "🏠", label: "Home", color: "hover:text-highlight-cta" },
    { href: "/study", icon: "📚", label: "Study", color: "hover:text-info" },
    { href: "/game", icon: "🎮", label: "Kana Quiz", color: "hover:text-success" },
    { href: "/kanji-quiz", icon: "✍️", label: "Kanji Quiz", color: "hover:text-purple-400" },
    { href: "/stats", icon: "📊", label: "Stats", color: "hover:text-warning" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect text-text-primary p-4 flex justify-around items-center shadow-lg border-b border-neutral-surface">
      {navItems.map((item) => (
        <TransitionLink
          key={item.href}
          href={item.href}
          className={`${item.color} transition-colors duration-150 font-medium px-3 py-2 rounded-lg hover:bg-neutral-surface/50 flex items-center gap-1`}
          prefetch={true}
        >
          <span>{item.icon}</span>
          <span className="hidden sm:inline">{item.label}</span>
          {item.href === "/stats" && stats && stats.currentStreak > 0 && (
            <span className="text-xs bg-warning text-background-primary px-2 py-1 rounded-full font-bold">
              {stats.currentStreak}
            </span>
          )}
        </TransitionLink>
      ))}
    </nav>
  );
}
