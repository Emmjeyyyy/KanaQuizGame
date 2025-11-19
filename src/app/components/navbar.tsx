"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getStats, type QuizStats } from "../utils/storage";

export default function Navbar() {
  const [stats, setStats] = useState<QuizStats | null>(null);
  
  useEffect(() => {
    setStats(getStats());
  }, []);
  
  return (
    <nav className="bg-gray-800/90 backdrop-blur-sm text-white p-4 flex justify-around items-center shadow-lg sticky top-0 z-50 border-b border-gray-700">
      <Link href="/" className="hover:text-blue-400 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-gray-700/50">
        🏠 Home
      </Link>
      <Link href="/study" className="hover:text-blue-400 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-gray-700/50">
        📚 Study
      </Link>
      <Link href="/game" className="hover:text-green-400 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-gray-700/50">
        🎮 Kana Quiz
      </Link>
      <Link href="/kanji-quiz" className="hover:text-purple-400 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-gray-700/50">
        ✍️ Kanji Quiz
      </Link>
      <Link href="/stats" className="hover:text-orange-400 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-gray-700/50">
        📊 Stats
        {stats && stats.currentStreak > 0 && (
          <span className="ml-2 text-xs bg-orange-600 px-2 py-1 rounded-full">🔥 {stats.currentStreak}</span>
        )}
      </Link>
    </nav>
  );
}
