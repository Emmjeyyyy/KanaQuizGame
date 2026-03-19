"use client";

import { useEffect, useState } from "react";
import { TransitionLink } from "./components/TransitionLink";
import { getStats, type QuizStats } from "./utils/storage";

export default function Home() {
  const [stats, setStats] = useState<QuizStats | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setStats(getStats());
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background-primary via-background-secondary to-background-primary flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-highlight-cta border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-primary via-background-secondary to-background-primary">
      <div className="flex flex-col items-center justify-center min-h-screen p-6 md:p-8">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 text-gradient">
            Japanese Learning App
          </h1>
          <p className="text-lg md:text-2xl text-text-secondary mb-6">
            Master Japanese characters and vocabulary
          </p>

          {stats && stats.totalQuizzes > 0 && (
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="glass-effect px-4 py-2 rounded-xl border border-neutral-surface">
                <span className="text-text-muted">Quizzes: </span>
                <span className="font-bold text-info">{stats.totalQuizzes}</span>
              </div>
              <div className="glass-effect px-4 py-2 rounded-xl border border-neutral-surface">
                <span className="text-text-muted">Questions: </span>
                <span className="font-bold text-success">{stats.totalQuestions}</span>
              </div>
              {stats.currentStreak > 0 && (
                <div className="glass-effect px-4 py-2 rounded-xl border border-neutral-surface">
                  <span className="text-text-muted">🔥 Streak: </span>
                  <span className="font-bold text-warning">{stats.currentStreak}</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full animate-scale-in">
          <TransitionLink href="/study" className="group">
            <div className="p-8 bg-gradient-to-br from-info to-blue-700 rounded-2xl hover:from-info hover:to-blue-600 transition-all duration-200 transform hover:scale-105 shadow-xl hover:shadow-2xl h-full border border-neutral-surface hover:border-highlight-cta">
              <div className="text-6xl mb-4">📚</div>
              <h2 className="text-2xl font-bold mb-2 text-text-primary">Study Kana</h2>
              <p className="text-text-secondary">Learn Hiragana and Katakana characters with interactive flashcards</p>
            </div>
          </TransitionLink>

          <TransitionLink href="/game" className="group">
            <div className="p-8 bg-gradient-to-br from-success to-green-700 rounded-2xl hover:from-success hover:to-green-600 transition-all duration-200 transform hover:scale-105 shadow-xl hover:shadow-2xl h-full border border-neutral-surface hover:border-highlight-cta">
              <div className="text-6xl mb-4">🎮</div>
              <h2 className="text-2xl font-bold mb-2 text-text-primary">Kana Quiz</h2>
              <p className="text-text-secondary">Test your kana knowledge with timed quizzes</p>
            </div>
          </TransitionLink>

          <TransitionLink href="/kanji-quiz" className="group">
            <div className="p-8 bg-gradient-to-br from-purple-600 to-pink-700 rounded-2xl hover:from-purple-500 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 shadow-xl hover:shadow-2xl h-full border border-neutral-surface hover:border-highlight-cta">
              <div className="text-6xl mb-4">✍️</div>
              <h2 className="text-2xl font-bold mb-2 text-text-primary">Kanji Quiz</h2>
              <p className="text-text-secondary">Practice kanji meanings and readings with multiple modes</p>
            </div>
          </TransitionLink>

          <TransitionLink href="/stats" className="group">
            <div className="p-8 bg-gradient-to-br from-warning to-orange-600 rounded-2xl hover:from-warning hover:to-orange-500 transition-all duration-200 transform hover:scale-105 shadow-xl hover:shadow-2xl h-full border border-neutral-surface hover:border-highlight-cta">
              <div className="text-6xl mb-4">📊</div>
              <h2 className="text-2xl font-bold mb-2 text-text-primary">Statistics</h2>
              <p className="text-text-secondary">Track your progress and view detailed analytics</p>
            </div>
          </TransitionLink>
        </div>

        {/* Quick Stats Cards */}
        {stats && stats.totalQuizzes > 0 && (
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl w-full animate-fade-in">
            <div className="glass-effect rounded-xl p-4 text-center border border-neutral-surface">
              <div className="text-2xl font-bold text-info">{stats.totalQuizzes}</div>
              <div className="text-sm text-text-muted">Total Quizzes</div>
            </div>
            <div className="glass-effect rounded-xl p-4 text-center border border-neutral-surface">
              <div className="text-2xl font-bold text-success">
                {stats.totalQuestions > 0 ? Math.round((stats.correctAnswers / stats.totalQuestions) * 100) : 0}%
              </div>
              <div className="text-sm text-text-muted">Accuracy</div>
            </div>
            <div className="glass-effect rounded-xl p-4 text-center border border-neutral-surface">
              <div className="text-2xl font-bold text-warning">{stats.bestStreak}</div>
              <div className="text-sm text-text-muted">Best Streak</div>
            </div>
            <div className="glass-effect rounded-xl p-4 text-center border border-neutral-surface">
              <div className="text-2xl font-bold text-purple-400">{Object.keys(stats.kanjiStats).length}</div>
              <div className="text-sm text-text-muted">Kanji Studied</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
