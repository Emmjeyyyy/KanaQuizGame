"use client";

import { useState, useEffect } from "react";
import { getStats, type QuizStats } from "../utils/storage";

export default function StatsPage() {
  const [stats, setStats] = useState<QuizStats>({
    totalQuizzes: 0,
    totalQuestions: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    bestStreak: 0,
    currentStreak: 0,
    lastQuizDate: "",
    kanjiStats: {},
    quizHistory: [],
  });
  const [selectedTab, setSelectedTab] = useState<"overview" | "kanji" | "history">("overview");
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);

  const loadStats = () => {
    const currentStats = getStats();
    setStats(currentStats);
    setLastUpdate(new Date());
  };

  useEffect(() => {
    setMounted(true);
    loadStats();

    const handleStorageChange = () => {
      loadStats();
    };

    window.addEventListener("statsUpdated", handleStorageChange);

    // Poll for updates every 5 seconds (reduced from 2s for better performance)
    const interval = setInterval(() => {
      loadStats();
    }, 5000);

    return () => {
      window.removeEventListener("statsUpdated", handleStorageChange);
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
    <div className="min-h-screen bg-gradient-to-br from-background-primary via-background-secondary to-background-primary">
      <div className="container mx-auto px-4 py-8 pt-20">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gradient">
            Statistics Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={loadStats}
              className="px-4 py-2 bg-background-secondary rounded-lg hover:bg-neutral-surface transition-all text-sm border border-neutral-surface"
              title="Refresh stats"
            >
              🔄 Refresh
            </button>
            {mounted && lastUpdate && (
              <div className="text-xs text-text-muted">
                Last updated: {lastUpdate.toLocaleTimeString()}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setSelectedTab("overview")}
            className={`px-6 py-3 rounded-xl transition-all border ${
              selectedTab === "overview"
                ? "bg-info border-info text-white"
                : "bg-background-secondary border-neutral-surface text-text-secondary hover:bg-neutral-surface"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setSelectedTab("kanji")}
            className={`px-6 py-3 rounded-xl transition-all border ${
              selectedTab === "kanji"
                ? "bg-info border-info text-white"
                : "bg-background-secondary border-neutral-surface text-text-secondary hover:bg-neutral-surface"
            }`}
          >
            Kanji Progress
          </button>
          <button
            onClick={() => setSelectedTab("history")}
            className={`px-6 py-3 rounded-xl transition-all border ${
              selectedTab === "history"
                ? "bg-info border-info text-white"
                : "bg-background-secondary border-neutral-surface text-text-secondary hover:bg-neutral-surface"
            }`}
          >
            Quiz History
          </button>
        </div>

        {selectedTab === "overview" && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-info to-blue-800 rounded-2xl p-6 shadow-xl border border-neutral-surface">
                <div className="text-3xl font-bold mb-2 text-text-primary">{stats.totalQuizzes}</div>
                <div className="text-text-secondary">Total Quizzes</div>
              </div>
              <div className="bg-gradient-to-br from-success to-green-800 rounded-2xl p-6 shadow-xl border border-neutral-surface">
                <div className="text-3xl font-bold mb-2 text-text-primary">{stats.totalQuestions}</div>
                <div className="text-text-secondary">Questions Answered</div>
              </div>
              <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-6 shadow-xl border border-neutral-surface">
                <div className="text-3xl font-bold mb-2 text-text-primary">{accuracy}%</div>
                <div className="text-text-secondary">Overall Accuracy</div>
              </div>
              <div className="bg-gradient-to-br from-warning to-orange-600 rounded-2xl p-6 shadow-xl border border-neutral-surface">
                <div className="text-3xl font-bold mb-2 text-text-primary">{stats.bestStreak}</div>
                <div className="text-text-secondary">Best Streak</div>
              </div>
            </div>

            {stats.currentStreak > 0 && (
              <div className="bg-gradient-to-r from-warning to-orange-600 rounded-2xl p-8 text-center shadow-xl border border-neutral-surface">
                <div className="text-5xl mb-4">🔥</div>
                <div className="text-4xl font-bold mb-2 text-text-primary">{stats.currentStreak}</div>
                <div className="text-xl text-text-secondary">Day Streak!</div>
              </div>
            )}

            <div className="glass-effect rounded-2xl p-6 shadow-xl border border-neutral-surface">
              <h2 className="text-2xl font-bold mb-4 text-text-primary">Performance Breakdown</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-text-secondary">Correct Answers</span>
                    <span className="font-bold text-success">{stats.correctAnswers}</span>
                  </div>
                  <div className="w-full bg-neutral-surface rounded-full h-4">
                    <div
                      className="bg-success h-4 rounded-full transition-all"
                      style={{
                        width: `${stats.totalQuestions > 0 ? (stats.correctAnswers / stats.totalQuestions) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-text-secondary">Incorrect Answers</span>
                    <span className="font-bold text-error">{stats.incorrectAnswers}</span>
                  </div>
                  <div className="w-full bg-neutral-surface rounded-full h-4">
                    <div
                      className="bg-error h-4 rounded-full transition-all"
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

        {selectedTab === "kanji" && (
          <div className="space-y-6 animate-fade-in">
            <div className="glass-effect rounded-2xl p-6 shadow-xl border border-neutral-surface">
              <h2 className="text-2xl font-bold mb-4 text-text-primary">Most Studied Kanji</h2>
              <div className="space-y-3">
                {topKanji.length > 0 ? (
                  topKanji.map((kanji) => (
                    <div
                      key={kanji.kanji}
                      className="flex items-center justify-between p-4 bg-neutral-surface/30 rounded-lg border border-neutral-surface"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-3xl font-bold text-text-primary">{kanji.kanji}</span>
                        <div>
                          <div className="text-sm text-text-muted">
                            {kanji.correct} correct, {kanji.incorrect} incorrect
                          </div>
                          <div className="w-32 bg-neutral-surface rounded-full h-2 mt-1">
                            <div
                              className="bg-info h-2 rounded-full"
                              style={{ width: `${kanji.mastery}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="text-xl font-bold text-text-primary">{kanji.mastery}%</div>
                    </div>
                  ))
                ) : (
                  <p className="text-text-muted text-center py-8">No kanji studied yet</p>
                )}
              </div>
            </div>

            <div className="glass-effect rounded-2xl p-6 shadow-xl border border-neutral-surface">
              <h2 className="text-2xl font-bold mb-4 text-text-primary">Kanji to Review</h2>
              <div className="space-y-3">
                {weakKanji.length > 0 ? (
                  weakKanji.map((kanji) => {
                    const total = kanji.correct + kanji.incorrect;
                    const accuracy = Math.round((kanji.correct / total) * 100);
                    return (
                      <div
                        key={kanji.kanji}
                        className="flex items-center justify-between p-4 bg-neutral-surface/30 rounded-lg border border-neutral-surface"
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-3xl font-bold text-text-primary">{kanji.kanji}</span>
                          <div>
                            <div className="text-sm text-text-muted">
                              {accuracy}% accuracy ({kanji.correct}/{total})
                            </div>
                            <div className="w-32 bg-neutral-surface rounded-full h-2 mt-1">
                              <div
                                className="bg-error h-2 rounded-full"
                                style={{ width: `${accuracy}%` }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="text-xl font-bold text-error">{accuracy}%</div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-text-muted text-center py-8">No weak kanji to review</p>
                )}
              </div>
            </div>
          </div>
        )}

        {selectedTab === "history" && (
          <div className="space-y-6 animate-fade-in">
            <div className="glass-effect rounded-2xl p-6 shadow-xl border border-neutral-surface">
              <h2 className="text-2xl font-bold mb-4 text-text-primary">Recent Quiz Sessions</h2>
              <div className="space-y-3">
                {recentSessions.length > 0 ? (
                  recentSessions.map((session, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-neutral-surface/30 rounded-lg border border-neutral-surface"
                    >
                      <div>
                        <div className="font-bold text-text-primary">{session.mode}</div>
                        <div className="text-sm text-text-muted">
                          {new Date(session.date).toLocaleDateString()} at{" "}
                          {new Date(session.date).toLocaleTimeString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-success">
                          {session.score} / {session.totalQuestions}
                        </div>
                        <div className="text-sm text-text-muted">
                          {Math.round(session.accuracy)}% • {Math.floor(session.duration / 60)}m{" "}
                          {session.duration % 60}s
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-text-muted text-center py-8">No quiz history yet</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
