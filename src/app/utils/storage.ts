// Utility functions for localStorage and progress tracking

export interface QuizStats {
  totalQuizzes: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  currentStreak: number;
  bestStreak: number;
  lastQuizDate: string;
  kanjiStats: Record<string, KanjiStat>;
  quizHistory: QuizSession[];
}

export interface KanjiStat {
  kanji: string;
  correct: number;
  incorrect: number;
  lastSeen: string;
  mastery: number; // 0-100
}

export interface QuizSession {
  date: string;
  mode: string;
  score: number;
  totalQuestions: number;
  accuracy: number;
  duration: number; // in seconds
}

const STORAGE_KEY = "japanese-learning-stats";

export function getStats(): QuizStats {
  if (typeof window === "undefined") {
    return getDefaultStats();
  }
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return getDefaultStats();
  }
  
  try {
    return JSON.parse(stored);
  } catch {
    return getDefaultStats();
  }
}

function getDefaultStats(): QuizStats {
  return {
    totalQuizzes: 0,
    totalQuestions: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    currentStreak: 0,
    bestStreak: 0,
    lastQuizDate: "",
    kanjiStats: {},
    quizHistory: [],
  };
}

export function saveStats(stats: QuizStats): void {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event("statsUpdated"));
  } catch (error) {
    console.error("Failed to save stats:", error);
  }
}

export function updateKanjiStat(kanji: string, isCorrect: boolean): void {
  const stats = getStats();
  
  if (!stats.kanjiStats[kanji]) {
    stats.kanjiStats[kanji] = {
      kanji,
      correct: 0,
      incorrect: 0,
      lastSeen: new Date().toISOString(),
      mastery: 0,
    };
  }
  
  const kanjiStat = stats.kanjiStats[kanji];
  if (isCorrect) {
    kanjiStat.correct++;
  } else {
    kanjiStat.incorrect++;
  }
  
  kanjiStat.lastSeen = new Date().toISOString();
  kanjiStat.mastery = Math.min(
    100,
    Math.round(
      (kanjiStat.correct / (kanjiStat.correct + kanjiStat.incorrect)) * 100
    )
  );
  
  saveStats(stats);
}

export function updateStreak(isCorrect: boolean): void {
  const stats = getStats();
  
  if (isCorrect) {
    stats.currentStreak++;
    if (stats.currentStreak > stats.bestStreak) {
      stats.bestStreak = stats.currentStreak;
    }
  } else {
    stats.currentStreak = 0;
  }
  
  saveStats(stats);
}

export function saveQuizSession(session: QuizSession): void {
  const stats = getStats();
  stats.quizHistory.push(session);
  stats.totalQuizzes++;
  stats.totalQuestions += session.totalQuestions;
  stats.correctAnswers += session.score;
  stats.incorrectAnswers += session.totalQuestions - session.score;
  stats.lastQuizDate = new Date().toISOString();
  
  // Keep only last 50 sessions
  if (stats.quizHistory.length > 50) {
    stats.quizHistory = stats.quizHistory.slice(-50);
  }
  
  saveStats(stats);
}

export function getWeakKanji(limit: number = 10): string[] {
  const stats = getStats();
  const kanjiList = Object.values(stats.kanjiStats);
  
  return kanjiList
    .sort((a, b) => {
      const aTotal = a.correct + a.incorrect;
      const bTotal = b.correct + b.incorrect;
      if (aTotal === 0 && bTotal === 0) return 0;
      if (aTotal === 0) return 1;
      if (bTotal === 0) return -1;
      
      const aAccuracy = a.correct / aTotal;
      const bAccuracy = b.correct / bTotal;
      return aAccuracy - bAccuracy;
    })
    .slice(0, limit)
    .map(k => k.kanji);
}

