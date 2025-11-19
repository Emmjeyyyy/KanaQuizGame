"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import { getStats, type QuizStats, type KanjiStat } from "../utils/storage";

export default function StatsPage() {
  const [stats, setStats] = useState<QuizStats>(getStats());
  const [selectedTab, setSelectedTab] = useState<"overview" | "kanji" | "history">("overview");
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);

  // Load stats from localStorage
  const loadStats = () => {
    const currentStats = getStats();
    setStats(currentStats);
    setLastUpdate(new Date());
  };

  useEffect(() => {
    // Set mounted flag to prevent hydration mismatch
    setMounted(true);
    
    // Load stats on mount
    loadStats();

    // Listen for storage changes (for cross-tab updates)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "japanese-learning-stats") {
        loadStats();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Also listen for custom events (for same-tab updates)
    const handleCustomStorageChange = () => {
      loadStats();
    };

    window.addEventListener("statsUpdated", handleCustomStorageChange);

    // Poll for updates every 2 seconds (in case localStorage is updated elsewhere)
    const interval = setInterval(() => {
      loadStats();
    }, 2000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("statsUpdated", handleCustomStorageChange);
      clearInterval(interval);
    };
  }, []);

  const accuracy = stats.totalQuestions > 0
    ? Math.round((stats.correctAnswers / stats.totalQuestions) * 100)
    : 0;

  const topKanji = Object.values(stats.kanjiStats)
    .sort((a, b) => (b.correct + b.incorrect) - (a.correct + a.incorrect))
    .slice(0, 10);

  const weakKanji = Object.values(stats.kanjiStats)
    .filter(k => k.correct + k.incorrect > 0)
    .sort((a, b) => {
      const aAccuracy = a.correct / (a.correct + a.incorrect);
      const bAccuracy = b.correct / (b.correct + b.incorrect);
      return aAccuracy - bAccuracy;
    })
    .slice(0, 10);

  const recentSessions = stats.quizHistory.slice(-10).reverse();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-900 text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Statistics Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={loadStats}
              className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all text-sm"
              title="Refresh stats"
            >
              🔄 Refresh
            </button>
            {mounted && lastUpdate && (
              <div className="text-xs text-gray-400">
                Last updated: {lastUpdate.toLocaleTimeString()}
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setSelectedTab("overview")}
            className={`px-6 py-3 rounded-xl transition-all ${
              selectedTab === "overview"
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setSelectedTab("kanji")}
            className={`px-6 py-3 rounded-xl transition-all ${
              selectedTab === "kanji"
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            Kanji Progress
          </button>
          <button
            onClick={() => setSelectedTab("history")}
            className={`px-6 py-3 rounded-xl transition-all ${
              selectedTab === "history"
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            Quiz History
          </button>
        </div>

        {/* Overview Tab */}
        {selectedTab === "overview" && (
          <div className="space-y-6 animate-fade-in">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 shadow-xl">
                <div className="text-3xl font-bold mb-2">{stats.totalQuizzes}</div>
                <div className="text-gray-200">Total Quizzes</div>
              </div>
              <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-2xl p-6 shadow-xl">
                <div className="text-3xl font-bold mb-2">{stats.totalQuestions}</div>
                <div className="text-gray-200">Questions Answered</div>
              </div>
              <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-6 shadow-xl">
                <div className="text-3xl font-bold mb-2">{accuracy}%</div>
                <div className="text-gray-200">Overall Accuracy</div>
              </div>
              <div className="bg-gradient-to-br from-orange-600 to-red-600 rounded-2xl p-6 shadow-xl">
                <div className="text-3xl font-bold mb-2">{stats.bestStreak}</div>
                <div className="text-gray-200">Best Streak</div>
              </div>
            </div>

            {/* Current Streak */}
            {stats.currentStreak > 0 && (
              <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-8 text-center shadow-xl">
                <div className="text-5xl mb-4">🔥</div>
                <div className="text-4xl font-bold mb-2">{stats.currentStreak}</div>
                <div className="text-xl text-gray-200">Day Streak!</div>
              </div>
            )}

            {/* Progress Bars */}
            <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-700">
              <h2 className="text-2xl font-bold mb-4">Performance Breakdown</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Correct Answers</span>
                    <span className="font-bold text-green-400">{stats.correctAnswers}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-4">
                    <div
                      className="bg-green-600 h-4 rounded-full transition-all"
                      style={{
                        width: `${stats.totalQuestions > 0 ? (stats.correctAnswers / stats.totalQuestions) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Incorrect Answers</span>
                    <span className="font-bold text-red-400">{stats.incorrectAnswers}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-4">
                    <div
                      className="bg-red-600 h-4 rounded-full transition-all"
                      style={{
                        width: `${stats.totalQuestions > 0 ? (stats.incorrectAnswers / stats.totalQuestions) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Kanji Progress Tab */}
        {selectedTab === "kanji" && (
          <div className="space-y-6 animate-fade-in">
            {/* Top Studied Kanji */}
            <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-700">
              <h2 className="text-2xl font-bold mb-4">Most Studied Kanji</h2>
              <div className="space-y-3">
                {topKanji.length > 0 ? (
                  topKanji.map((kanji, index) => (
                    <div
                      key={kanji.kanji}
                      className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-3xl font-bold">{kanji.kanji}</span>
                        <div>
                          <div className="text-sm text-gray-400">
                            {kanji.correct} correct, {kanji.incorrect} incorrect
                          </div>
                          <div className="w-32 bg-gray-600 rounded-full h-2 mt-1">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${kanji.mastery}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="text-xl font-bold">{kanji.mastery}%</div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-center py-8">No kanji studied yet</p>
                )}
              </div>
            </div>

            {/* Weak Kanji */}
            <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-700">
              <h2 className="text-2xl font-bold mb-4">Kanji to Review</h2>
              <div className="space-y-3">
                {weakKanji.length > 0 ? (
                  weakKanji.map((kanji) => {
                    const total = kanji.correct + kanji.incorrect;
                    const accuracy = Math.round((kanji.correct / total) * 100);
                    return (
                      <div
                        key={kanji.kanji}
                        className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-3xl font-bold">{kanji.kanji}</span>
                          <div>
                            <div className="text-sm text-gray-400">
                              {accuracy}% accuracy ({kanji.correct}/{total})
                            </div>
                            <div className="w-32 bg-gray-600 rounded-full h-2 mt-1">
                              <div
                                className="bg-red-600 h-2 rounded-full"
                                style={{ width: `${accuracy}%` }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="text-xl font-bold text-red-400">{accuracy}%</div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-400 text-center py-8">No weak kanji to review</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* History Tab */}
        {selectedTab === "history" && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-700">
              <h2 className="text-2xl font-bold mb-4">Recent Quiz Sessions</h2>
              <div className="space-y-3">
                {recentSessions.length > 0 ? (
                  recentSessions.map((session, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg"
                    >
                      <div>
                        <div className="font-bold">{session.mode}</div>
                        <div className="text-sm text-gray-400">
                          {new Date(session.date).toLocaleDateString()} at{" "}
                          {new Date(session.date).toLocaleTimeString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-400">
                          {session.score} / {session.totalQuestions}
                        </div>
                        <div className="text-sm text-gray-400">
                          {Math.round(session.accuracy)}% • {Math.floor(session.duration / 60)}m{" "}
                          {session.duration % 60}s
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-center py-8">No quiz history yet</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

