"use client";

import { useState, useEffect, useRef } from "react";
import Navbar from "../components/navbar";
import Toast from "../components/Toast";
import Confetti from "../components/Confetti";
import {
  getStats,
  saveStats,
  updateKanjiStat,
  updateStreak,
  saveQuizSession,
  getWeakKanji,
  type QuizStats,
} from "../utils/storage";

type KanjiData = {
  kanji: string;
  meanings: string[];
  kun_readings: string[];
  on_readings: string[];
  name_readings: string[];
  jlpt?: number;
  grade?: number;
  stroke_count?: number;
};

type QuizMode = "typing" | "multiple-choice" | null;
type QuestionType = "meaning" | "reading";
type Difficulty = "easy" | "medium" | "hard" | "all";
type TimerMode = "none" | "per-question" | "total";

export default function KanjiQuizPage() {
  const [mode, setMode] = useState<QuizMode>(null);
  const [questionType, setQuestionType] = useState<QuestionType>("meaning");
  const [difficulty, setDifficulty] = useState<Difficulty>("all");
  const [timerMode, setTimerMode] = useState<TimerMode>("none");
  const [kanjiList, setKanjiList] = useState<string[]>([]);
  const [currentKanji, setCurrentKanji] = useState<KanjiData | null>(null);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [multipleChoiceOptions, setMultipleChoiceOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [stats, setStats] = useState<QuizStats>(getStats());
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [questionStartTime, setQuestionStartTime] = useState<number>(0);
  const [sessionStartTime, setSessionStartTime] = useState<number>(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState<KanjiData[]>([]);
  const [reviewMode, setReviewMode] = useState(false);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Common kanji characters organized by difficulty
  const kanjiByDifficulty = {
    easy: [
      "一", "二", "三", "四", "五", "六", "七", "八", "九", "十",
      "人", "大", "小", "中", "本", "日", "月", "火", "水", "木",
      "金", "土", "年", "時", "分", "今", "前", "後", "上", "下",
    ],
    medium: [
      "山", "川", "田", "車", "電", "話", "語", "学", "校", "生",
      "先", "私", "家", "食", "飲", "見", "聞", "行", "来", "出",
      "入", "会", "社", "店", "駅", "道", "国", "都", "市", "町",
    ],
    hard: [
      "新", "古", "高", "低", "長", "短", "多", "少", "好", "悪",
      "安", "心", "手", "足", "目", "耳", "口", "名", "字", "書",
      "読", "買", "売", "作", "使", "立", "座", "休", "働", "起",
      "寝", "帰", "返", "開", "閉", "始", "終", "続",
    ],
  };

  const allKanji = [
    ...kanjiByDifficulty.easy,
    ...kanjiByDifficulty.medium,
    ...kanjiByDifficulty.hard,
  ];

  // Filter kanji based on search query
  const filteredKanji = searchQuery
    ? allKanji.filter((k) => k.includes(searchQuery))
    : allKanji;

  // Get kanji list based on difficulty
  const getKanjiList = (): string[] => {
    if (difficulty === "all") return filteredKanji;
    if (difficulty === "easy") return kanjiByDifficulty.easy.filter(k => filteredKanji.includes(k));
    if (difficulty === "medium") return kanjiByDifficulty.medium.filter(k => filteredKanji.includes(k));
    return kanjiByDifficulty.hard.filter(k => filteredKanji.includes(k));
  };

  // Fetch kanji data from kanjiapi.dev
  const fetchKanjiData = async (kanji: string): Promise<KanjiData | null> => {
    try {
      const response = await fetch(`https://kanjiapi.dev/v1/kanji/${encodeURIComponent(kanji)}`);
      if (!response.ok) return null;
      const data = await response.json();
      return {
        kanji: data.kanji || kanji,
        meanings: data.meanings || [],
        kun_readings: data.kun_readings || [],
        on_readings: data.on_readings || [],
        name_readings: data.name_readings || [],
        jlpt: data.jlpt,
        grade: data.grade,
        stroke_count: data.stroke_count,
      };
    } catch (error) {
      console.error("Error fetching kanji:", error);
      return null;
    }
  };

  // Get random kanji
  const getRandomKanji = async (useWeakKanji = false) => {
    const list = useWeakKanji && reviewMode
      ? getWeakKanji(20)
      : getKanjiList();
    
    if (list.length === 0) {
      setToast({ message: "No kanji found matching your criteria", type: "error" });
      return;
    }

    setLoading(true);
    const randomKanji = list[Math.floor(Math.random() * list.length)];
    const data = await fetchKanjiData(randomKanji);
    
    if (data) {
      setCurrentKanji(data);
      setInput("");
      setSelectedOption(null);
      setFeedback(null);
      setShowAnswer(false);
      setQuestionStartTime(Date.now());
      
      if (timerMode === "per-question") {
        setTimeLeft(30); // 30 seconds per question
      }
      
      if (mode === "multiple-choice") {
        await generateMultipleChoiceOptions(data);
      }
    }
    setLoading(false);
  };

  // Generate multiple choice options
  const generateMultipleChoiceOptions = async (kanjiData: KanjiData) => {
    if (questionType === "meaning") {
      const correctMeaning = kanjiData.meanings[0] || "unknown";
      const correctOptions = [correctMeaning];
      const wrongKanji = getKanjiList().filter(k => k !== kanjiData.kanji);
      const shuffled = wrongKanji.sort(() => 0.5 - Math.random()).slice(0, 5);
      
      try {
        const results = await Promise.all(shuffled.map(k => fetchKanjiData(k)));
        const wrongMeanings: string[] = [];
        results.forEach(data => {
          if (data && data.meanings.length > 0) {
            const meaning = data.meanings[0];
            if (meaning && meaning.toLowerCase() !== correctMeaning.toLowerCase()) {
              wrongMeanings.push(meaning);
            }
          }
        });
        
        const options = [...correctOptions, ...wrongMeanings]
          .filter((v, i, a) => a.findIndex(x => x.toLowerCase() === v.toLowerCase()) === i)
          .slice(0, 4);
        
        while (options.length < 4) {
          options.push(`option ${options.length + 1}`);
        }
        
        setMultipleChoiceOptions(options.sort(() => Math.random() - 0.5));
      } catch (error) {
        setMultipleChoiceOptions([correctMeaning, "option 1", "option 2", "option 3"]);
      }
    } else {
      const allReadings = [
        ...kanjiData.kun_readings,
        ...kanjiData.on_readings,
        ...kanjiData.name_readings
      ].filter(r => r && r.length > 0);
      
      if (allReadings.length > 0) {
        const correctReading = allReadings[0];
        const correctOptions = [correctReading];
        const wrongKanji = getKanjiList().filter(k => k !== kanjiData.kanji);
        const shuffled = wrongKanji.sort(() => 0.5 - Math.random()).slice(0, 5);
        
        try {
          const results = await Promise.all(shuffled.map(k => fetchKanjiData(k)));
          const wrongReadings: string[] = [];
          results.forEach(data => {
            if (data) {
              const readings = [
                ...data.kun_readings,
                ...data.on_readings,
                ...data.name_readings
              ].filter(r => r && r.length > 0 && r.toLowerCase() !== correctReading.toLowerCase());
              if (readings.length > 0) {
                wrongReadings.push(readings[0]);
              }
            }
          });
          
          const options = [...correctOptions, ...wrongReadings]
            .filter((v, i, a) => a.findIndex(x => x.toLowerCase() === v.toLowerCase()) === i)
            .slice(0, 4);
          
          while (options.length < 4) {
            options.push(`reading${options.length + 1}`);
          }
          
          setMultipleChoiceOptions(options.sort(() => Math.random() - 0.5));
        } catch (error) {
          setMultipleChoiceOptions([correctReading, "reading1", "reading2", "reading3"]);
        }
      } else {
        setMultipleChoiceOptions(["reading1", "reading2", "reading3", "reading4"]);
      }
    }
  };

  // Timer effect
  useEffect(() => {
    if (timerMode === "per-question" && timeLeft > 0 && !showAnswer) {
      timerIntervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Time's up - mark as incorrect
            if (currentKanji) {
              handleAnswer(false);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerMode === "total" && !gameOver && mode) {
      timerIntervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [timerMode, timeLeft, showAnswer, currentKanji, gameOver, mode]);

  // Initialize kanji list
  useEffect(() => {
    setKanjiList(getKanjiList());
  }, [difficulty, searchQuery]);

  // Load first question when mode is selected
  useEffect(() => {
    if (mode && kanjiList.length > 0 && !reviewMode) {
      getRandomKanji();
      setScore(0);
      setTotalQuestions(0);
      setGameOver(false);
      setSessionStartTime(Date.now());
      setIncorrectAnswers([]);
      if (timerMode === "total") {
        setTimeLeft(0);
      }
    }
  }, [mode, questionType, difficulty]);

  // Handle answer submission
  const handleAnswer = (isCorrect: boolean) => {
    if (!currentKanji) return;

    const questionTime = Date.now() - questionStartTime;
    
    setFeedback(isCorrect ? "correct" : "incorrect");
    setShowAnswer(true);
    
    if (isCorrect) {
      setScore((s) => s + 1);
      updateKanjiStat(currentKanji.kanji, true);
      updateStreak(true);
      
      // Show confetti for streaks
      if (stats.currentStreak > 0 && (stats.currentStreak + 1) % 5 === 0) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
      
      setToast({ message: "Correct! 🎉", type: "success" });
    } else {
      updateKanjiStat(currentKanji.kanji, false);
      updateStreak(false);
      setIncorrectAnswers((prev) => [...prev, currentKanji]);
      setToast({ message: "Incorrect. Keep practicing! 💪", type: "error" });
    }
    
    setTotalQuestions((t) => t + 1);
    const updatedStats = getStats();
    setStats(updatedStats);

    setTimeout(() => {
      if (reviewMode && reviewIndex < incorrectAnswers.length - 1) {
        setReviewIndex((prev) => prev + 1);
        setCurrentKanji(incorrectAnswers[reviewIndex + 1]);
        setInput("");
        setSelectedOption(null);
        setFeedback(null);
        setShowAnswer(false);
      } else {
        getRandomKanji();
      }
    }, 2000);
  };

  // Check answer for typing mode
  const checkTypingAnswer = () => {
    if (!currentKanji || !input.trim() || showAnswer) return;

    let isCorrect = false;
    const userAnswer = input.toLowerCase().trim();

    if (questionType === "meaning") {
      isCorrect = currentKanji.meanings.some(
        (meaning) => meaning.toLowerCase() === userAnswer
      );
    } else {
      const allReadings = [
        ...currentKanji.kun_readings,
        ...currentKanji.on_readings,
        ...currentKanji.name_readings
      ];
      isCorrect = allReadings.some(
        (reading) => reading.toLowerCase() === userAnswer
      );
    }

    handleAnswer(isCorrect);
  };

  // Check answer for multiple choice mode
  const checkMultipleChoiceAnswer = (option: string) => {
    if (!currentKanji || selectedOption || showAnswer) return;

    setSelectedOption(option);
    let isCorrect = false;

    if (questionType === "meaning") {
      isCorrect = currentKanji.meanings.some(
        (meaning) => meaning.toLowerCase() === option.toLowerCase()
      );
    } else {
      const allReadings = [
        ...currentKanji.kun_readings,
        ...currentKanji.on_readings,
        ...currentKanji.name_readings
      ];
      isCorrect = allReadings.some(
        (reading) => reading.toLowerCase() === option.toLowerCase()
      );
    }

    handleAnswer(isCorrect);
  };

  const resetQuiz = () => {
    setScore(0);
    setTotalQuestions(0);
    setGameOver(false);
    setIncorrectAnswers([]);
    setReviewMode(false);
    setReviewIndex(0);
    setSessionStartTime(Date.now());
    if (timerMode === "total") {
      setTimeLeft(0);
    }
    getRandomKanji();
  };

  const endQuiz = () => {
    const duration = Math.floor((Date.now() - sessionStartTime) / 1000);
    const accuracy = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0;
    
    saveQuizSession({
      date: new Date().toISOString(),
      mode: `${mode}-${questionType}`,
      score,
      totalQuestions,
      accuracy,
      duration,
    });
    
    setGameOver(true);
    setStats(getStats());
    
    if (accuracy >= 80) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  const startReview = () => {
    if (incorrectAnswers.length === 0) {
      setToast({ message: "No incorrect answers to review", type: "info" });
      return;
    }
    setReviewMode(true);
    setReviewIndex(0);
    setCurrentKanji(incorrectAnswers[0]);
    setScore(0);
    setTotalQuestions(0);
    setInput("");
    setSelectedOption(null);
    setFeedback(null);
    setShowAnswer(false);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Mode selection screen
  if (!mode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
        <Navbar />
        <Confetti trigger={showConfetti} />
        <div className="flex flex-col items-center justify-center min-h-screen p-8">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Kanji Quiz
            </h1>
            <p className="text-xl text-gray-300 mb-2">Test your kanji knowledge!</p>
            <div className="flex justify-center gap-4 mt-4 text-sm text-gray-400">
              <div>📊 {stats.totalQuizzes} Quizzes</div>
              <div>🔥 {stats.currentStreak} Day Streak</div>
              <div>⭐ {stats.bestStreak} Best Streak</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-2xl w-full animate-scale-in">
            <button
              onClick={() => setMode("typing")}
              className="group relative p-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl hover:from-blue-500 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl border-2 border-transparent hover:border-blue-400"
            >
              <div className="text-5xl mb-4">⌨️</div>
              <h2 className="text-2xl font-bold mb-2">Typing Quiz</h2>
              <p className="text-gray-200">Type the meaning or reading</p>
            </button>

            <button
              onClick={() => setMode("multiple-choice")}
              className="group relative p-8 bg-gradient-to-br from-green-600 to-green-800 rounded-2xl hover:from-green-500 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl border-2 border-transparent hover:border-green-400"
            >
              <div className="text-5xl mb-4">✓</div>
              <h2 className="text-2xl font-bold mb-2">Multiple Choice</h2>
              <p className="text-gray-200">Choose from options</p>
            </button>
          </div>

          {incorrectAnswers.length > 0 && (
            <button
              onClick={startReview}
              className="mt-8 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl hover:from-orange-500 hover:to-red-500 transition-all transform hover:scale-105 shadow-lg"
            >
              📚 Review {incorrectAnswers.length} Incorrect Answers
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      <Navbar />
      <Toast
        message={toast?.message || ""}
        type={toast?.type || "info"}
        isVisible={!!toast}
        onClose={() => setToast(null)}
      />
      <Confetti trigger={showConfetti} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all"
            >
              ⚙️ Settings
            </button>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Kanji Quiz - {mode === "typing" ? "Typing" : "Multiple Choice"}
            </h1>
            <button
              onClick={() => {
                if (totalQuestions > 0) {
                  endQuiz();
                } else {
                  setMode(null);
                }
              }}
              className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all"
            >
              {totalQuestions > 0 ? "End Quiz" : "Back"}
            </button>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className="bg-gray-800/90 backdrop-blur-sm rounded-xl p-6 mb-6 animate-scale-in border border-gray-700">
              <h3 className="text-xl font-bold mb-4">Quiz Settings</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block mb-2 text-sm">Question Type</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setQuestionType("meaning")}
                      className={`px-4 py-2 rounded-lg transition-all ${
                        questionType === "meaning"
                          ? "bg-purple-600 text-white"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      }`}
                    >
                      Meaning
                    </button>
                    <button
                      onClick={() => setQuestionType("reading")}
                      className={`px-4 py-2 rounded-lg transition-all ${
                        questionType === "reading"
                          ? "bg-purple-600 text-white"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      }`}
                    >
                      Reading
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block mb-2 text-sm">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                    className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white"
                  >
                    <option value="all">All</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-sm">Timer</label>
                  <select
                    value={timerMode}
                    onChange={(e) => setTimerMode(e.target.value as TimerMode)}
                    className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white"
                  >
                    <option value="none">None</option>
                    <option value="per-question">Per Question (30s)</option>
                    <option value="total">Total Time</option>
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <label className="block mb-2 text-sm">Search Kanji</label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search kanji..."
                  className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white"
                />
              </div>
            </div>
          )}

          <div className="flex justify-center flex-wrap gap-4 text-lg mb-4">
            <div className="bg-gray-800/80 backdrop-blur-sm px-6 py-3 rounded-xl border border-gray-700">
              Score: <span className="font-bold text-green-400">{score}</span>
            </div>
            <div className="bg-gray-800/80 backdrop-blur-sm px-6 py-3 rounded-xl border border-gray-700">
              Questions: <span className="font-bold text-blue-400">{totalQuestions}</span>
            </div>
            {totalQuestions > 0 && (
              <div className="bg-gray-800/80 backdrop-blur-sm px-6 py-3 rounded-xl border border-gray-700">
                Accuracy: <span className="font-bold text-purple-400">
                  {Math.round((score / totalQuestions) * 100)}%
                </span>
              </div>
            )}
            {stats.currentStreak > 0 && (
              <div className="bg-gray-800/80 backdrop-blur-sm px-6 py-3 rounded-xl border border-gray-700">
                🔥 Streak: <span className="font-bold text-orange-400">{stats.currentStreak}</span>
              </div>
            )}
            {timerMode === "per-question" && timeLeft > 0 && (
              <div className={`bg-gray-800/80 backdrop-blur-sm px-6 py-3 rounded-xl border ${
                timeLeft < 10 ? "border-red-500 animate-pulse" : "border-gray-700"
              }`}>
                ⏱️ <span className="font-bold">{timeLeft}s</span>
              </div>
            )}
            {timerMode === "total" && (
              <div className="bg-gray-800/80 backdrop-blur-sm px-6 py-3 rounded-xl border border-gray-700">
                ⏱️ <span className="font-bold">{formatTime(timeLeft)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Quiz Content */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
            <p className="mt-4 text-xl">Loading kanji...</p>
          </div>
        ) : gameOver ? (
          <div className="max-w-2xl mx-auto text-center animate-scale-in">
            <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-gray-700">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                Quiz Complete! 🎉
              </h2>
              <div className="grid grid-cols-2 gap-4 my-6">
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-400">{score}</div>
                  <div className="text-gray-400">Correct</div>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-400">{totalQuestions}</div>
                  <div className="text-gray-400">Total</div>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-purple-400">
                    {Math.round((score / totalQuestions) * 100)}%
                  </div>
                  <div className="text-gray-400">Accuracy</div>
                </div>
                {timerMode === "total" && (
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-orange-400">{formatTime(timeLeft)}</div>
                    <div className="text-gray-400">Time</div>
                  </div>
                )}
              </div>
              <div className="flex justify-center gap-4 mt-6">
                <button
                  onClick={resetQuiz}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:from-purple-500 hover:to-pink-500 transition-all font-bold"
                >
                  Try Again
                </button>
                {incorrectAnswers.length > 0 && (
                  <button
                    onClick={startReview}
                    className="px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg hover:from-orange-500 hover:to-red-500 transition-all font-bold"
                  >
                    Review Mistakes ({incorrectAnswers.length})
                  </button>
                )}
                <button
                  onClick={() => setMode(null)}
                  className="px-6 py-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-all font-bold"
                >
                  Main Menu
                </button>
              </div>
            </div>
          </div>
        ) : currentKanji ? (
          <div className="max-w-2xl mx-auto animate-fade-in">
            {/* Question */}
            <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 mb-6 shadow-2xl border border-gray-700">
              {reviewMode && (
                <div className="mb-4 text-center">
                  <span className="px-4 py-2 bg-orange-600 rounded-lg text-sm font-bold">
                    Review Mode: {reviewIndex + 1} / {incorrectAnswers.length}
                  </span>
                </div>
              )}
              
              <div className="text-center mb-6">
                <div className="text-9xl font-bold mb-4 text-purple-300 animate-scale-in">
                  {currentKanji.kanji}
                </div>
                <div className="flex justify-center gap-4 text-sm text-gray-400">
                  {currentKanji.stroke_count && (
                    <span>✍️ {currentKanji.stroke_count} strokes</span>
                  )}
                  {currentKanji.jlpt && (
                    <span>📚 JLPT N{currentKanji.jlpt}</span>
                  )}
                  {stats.kanjiStats[currentKanji.kanji] && (
                    <span>
                      ⭐ {stats.kanjiStats[currentKanji.kanji].mastery}% mastery
                    </span>
                  )}
                </div>
              </div>

              <div className="text-center mb-6">
                <p className="text-xl text-gray-300">
                  {questionType === "meaning"
                    ? "What is the meaning?"
                    : "What is the reading?"}
                </p>
              </div>

              {/* Typing Mode */}
              {mode === "typing" && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    checkTypingAnswer();
                  }}
                  className="space-y-4"
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={showAnswer}
                    className="w-full px-6 py-4 text-xl bg-gray-700 border-2 border-gray-600 rounded-lg focus:border-purple-500 focus:outline-none text-white disabled:opacity-50 transition-all"
                    placeholder={questionType === "meaning" ? "Enter meaning..." : "Enter reading..."}
                    autoFocus
                  />
                  <button
                    type="submit"
                    disabled={showAnswer || !input.trim()}
                    className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:from-purple-500 hover:to-pink-500 transition-all font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                  >
                    Submit
                  </button>
                </form>
              )}

              {/* Multiple Choice Mode */}
              {mode === "multiple-choice" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {multipleChoiceOptions.map((option, index) => {
                    const isSelected = selectedOption === option;
                    const isCorrect = currentKanji && (
                      questionType === "meaning"
                        ? currentKanji.meanings.some(m => m.toLowerCase() === option.toLowerCase())
                        : [...currentKanji.kun_readings, ...currentKanji.on_readings, ...currentKanji.name_readings]
                            .some(r => r.toLowerCase() === option.toLowerCase())
                    );
                    
                    let buttonClass = "px-6 py-4 rounded-lg font-medium text-lg transition-all transform ";
                    
                    if (isSelected) {
                      buttonClass += isCorrect
                        ? "bg-green-600 text-white scale-105 shadow-lg"
                        : "bg-red-600 text-white scale-105 shadow-lg";
                    } else if (selectedOption && isCorrect) {
                      buttonClass += "bg-green-600 text-white";
                    } else {
                      buttonClass += "bg-gray-700 text-white hover:bg-gray-600 hover:scale-105";
                    }

                    return (
                      <button
                        key={index}
                        onClick={() => checkMultipleChoiceAnswer(option)}
                        disabled={!!selectedOption || showAnswer}
                        className={buttonClass}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Feedback */}
              {feedback && (
                <div
                  className={`mt-6 p-4 rounded-lg text-center animate-scale-in ${
                    feedback === "correct"
                      ? "bg-green-900/50 border-2 border-green-500"
                      : "bg-red-900/50 border-2 border-red-500"
                  }`}
                >
                  <p className="text-xl font-bold">
                    {feedback === "correct" ? "✓ Correct!" : "✗ Incorrect"}
                  </p>
                  {showAnswer && (
                    <div className="mt-4 text-gray-300 space-y-2">
                      <p className="font-semibold">Meanings: {currentKanji.meanings.join(", ")}</p>
                      {currentKanji.kun_readings.length > 0 && (
                        <p>Kun readings: {currentKanji.kun_readings.join(", ")}</p>
                      )}
                      {currentKanji.on_readings.length > 0 && (
                        <p>On readings: {currentKanji.on_readings.join(", ")}</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setMode(null)}
                className="px-6 py-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-all"
              >
                Change Mode
              </button>
              <button
                onClick={resetQuiz}
                className="px-6 py-3 bg-purple-600 rounded-lg hover:bg-purple-500 transition-all"
              >
                Reset Quiz
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl">Loading kanji data...</p>
          </div>
        )}
      </div>
    </div>
  );
}
