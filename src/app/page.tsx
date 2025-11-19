"use client";

import { useEffect, useState } from "react";
import Navbar from "./components/navbar";
import Link from "next/link";
import { getStats, type QuizStats } from "./utils/storage";

export default function Home() {
  const [stats, setStats] = useState<QuizStats | null>(null);

  useEffect(() => {
    setStats(getStats());
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-900 text-white">
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-7xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Japanese Learning App
          </h1>
          <p className="text-2xl text-gray-300 mb-4">Master Japanese characters and vocabulary</p>
          
          {stats && stats.totalQuizzes > 0 && (
            <div className="flex justify-center gap-6 mt-6 text-sm">
              <div className="bg-gray-800/80 backdrop-blur-sm px-4 py-2 rounded-lg">
                <span className="text-gray-400">Quizzes: </span>
                <span className="font-bold text-blue-400">{stats.totalQuizzes}</span>
              </div>
              <div className="bg-gray-800/80 backdrop-blur-sm px-4 py-2 rounded-lg">
                <span className="text-gray-400">Questions: </span>
                <span className="font-bold text-green-400">{stats.totalQuestions}</span>
              </div>
              {stats.currentStreak > 0 && (
                <div className="bg-gray-800/80 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <span className="text-gray-400">🔥 Streak: </span>
                  <span className="font-bold text-orange-400">{stats.currentStreak}</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full animate-scale-in">
          <Link href="/study" className="group">
            <div className="p-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl hover:from-blue-500 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl h-full border-2 border-transparent hover:border-blue-400">
              <div className="text-6xl mb-4">📚</div>
              <h2 className="text-2xl font-bold mb-2">Study Kana</h2>
              <p className="text-gray-200">Learn Hiragana and Katakana characters with interactive flashcards</p>
            </div>
          </Link>

          <Link href="/game" className="group">
            <div className="p-8 bg-gradient-to-br from-green-600 to-green-800 rounded-2xl hover:from-green-500 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl h-full border-2 border-transparent hover:border-green-400">
              <div className="text-6xl mb-4">🎮</div>
              <h2 className="text-2xl font-bold mb-2">Kana Quiz</h2>
              <p className="text-gray-200">Test your kana knowledge with timed quizzes</p>
            </div>
          </Link>

          <Link href="/kanji-quiz" className="group">
            <div className="p-8 bg-gradient-to-br from-purple-600 to-pink-800 rounded-2xl hover:from-purple-500 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl h-full border-2 border-transparent hover:border-purple-400">
              <div className="text-6xl mb-4">✍️</div>
              <h2 className="text-2xl font-bold mb-2">Kanji Quiz</h2>
              <p className="text-gray-200">Practice kanji meanings and readings with multiple modes</p>
            </div>
          </Link>

          <Link href="/stats" className="group">
            <div className="p-8 bg-gradient-to-br from-orange-600 to-red-600 rounded-2xl hover:from-orange-500 hover:to-red-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl h-full border-2 border-transparent hover:border-orange-400">
              <div className="text-6xl mb-4">📊</div>
              <h2 className="text-2xl font-bold mb-2">Statistics</h2>
              <p className="text-gray-200">Track your progress and view detailed analytics</p>
            </div>
          </Link>
        </div>

        {/* Quick Stats Cards */}
        {stats && stats.totalQuizzes > 0 && (
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl w-full animate-fade-in">
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-700">
              <div className="text-2xl font-bold text-blue-400">{stats.totalQuizzes}</div>
              <div className="text-sm text-gray-400">Total Quizzes</div>
            </div>
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-700">
              <div className="text-2xl font-bold text-green-400">
                {stats.totalQuestions > 0 ? Math.round((stats.correctAnswers / stats.totalQuestions) * 100) : 0}%
              </div>
              <div className="text-sm text-gray-400">Accuracy</div>
            </div>
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-700">
              <div className="text-2xl font-bold text-orange-400">{stats.bestStreak}</div>
              <div className="text-sm text-gray-400">Best Streak</div>
            </div>
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-700">
              <div className="text-2xl font-bold text-purple-400">{Object.keys(stats.kanjiStats).length}</div>
              <div className="text-sm text-gray-400">Kanji Studied</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
