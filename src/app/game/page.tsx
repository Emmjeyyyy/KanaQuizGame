"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import { saveQuizSession, updateAnswerCount, updateStreak } from "../utils/storage";

type Kana = {
  char: string;
  romaji: string;
};

// ✅ Hiragana
const hiraganaBase: Kana[] = [
  { char: "あ", romaji: "a" }, { char: "い", romaji: "i" }, { char: "う", romaji: "u" }, { char: "え", romaji: "e" }, { char: "お", romaji: "o" },
  { char: "か", romaji: "ka" }, { char: "き", romaji: "ki" }, { char: "く", romaji: "ku" }, { char: "け", romaji: "ke" }, { char: "こ", romaji: "ko" },
  { char: "さ", romaji: "sa" }, { char: "し", romaji: "shi" }, { char: "す", romaji: "su" }, { char: "せ", romaji: "se" }, { char: "そ", romaji: "so" },
  { char: "た", romaji: "ta" }, { char: "ち", romaji: "chi" }, { char: "つ", romaji: "tsu" }, { char: "て", romaji: "te" }, { char: "と", romaji: "to" },
  { char: "な", romaji: "na" }, { char: "に", romaji: "ni" }, { char: "ぬ", romaji: "nu" }, { char: "ね", romaji: "ne" }, { char: "の", romaji: "no" },
  { char: "は", romaji: "ha" }, { char: "ひ", romaji: "hi" }, { char: "ふ", romaji: "fu" }, { char: "へ", romaji: "he" }, { char: "ほ", romaji: "ho" },
  { char: "ま", romaji: "ma" }, { char: "み", romaji: "mi" }, { char: "む", romaji: "mu" }, { char: "め", romaji: "me" }, { char: "も", romaji: "mo" },
  { char: "や", romaji: "ya" }, { char: "ゆ", romaji: "yu" }, { char: "よ", romaji: "yo" },
  { char: "ら", romaji: "ra" }, { char: "り", romaji: "ri" }, { char: "る", romaji: "ru" }, { char: "れ", romaji: "re" }, { char: "ろ", romaji: "ro" },
  { char: "わ", romaji: "wa" }, { char: "を", romaji: "wo" }, { char: "ん", romaji: "n" },
];

const hiraganaDakuten: Kana[] = [
  { char: "が", romaji: "ga" }, { char: "ぎ", romaji: "gi" }, { char: "ぐ", romaji: "gu" }, { char: "げ", romaji: "ge" }, { char: "ご", romaji: "go" },
  { char: "ざ", romaji: "za" }, { char: "じ", romaji: "ji" }, { char: "ず", romaji: "zu" }, { char: "ぜ", romaji: "ze" }, { char: "ぞ", romaji: "zo" },
  { char: "だ", romaji: "da" }, { char: "ぢ", romaji: "ji" }, { char: "づ", romaji: "zu" }, { char: "で", romaji: "de" }, { char: "ど", romaji: "do" },
  { char: "ば", romaji: "ba" }, { char: "び", romaji: "bi" }, { char: "ぶ", romaji: "bu" }, { char: "べ", romaji: "be" }, { char: "ぼ", romaji: "bo" },
  { char: "ぱ", romaji: "pa" }, { char: "ぴ", romaji: "pi" }, { char: "ぷ", romaji: "pu" }, { char: "ぺ", romaji: "pe" }, { char: "ぽ", romaji: "po" },
];

// ✅ Katakana
const katakanaBase: Kana[] = [
  { char: "ア", romaji: "a" }, { char: "イ", romaji: "i" }, { char: "ウ", romaji: "u" }, { char: "エ", romaji: "e" }, { char: "オ", romaji: "o" },
  { char: "カ", romaji: "ka" }, { char: "キ", romaji: "ki" }, { char: "ク", romaji: "ku" }, { char: "ケ", romaji: "ke" }, { char: "コ", romaji: "ko" },
  { char: "サ", romaji: "sa" }, { char: "シ", romaji: "shi" }, { char: "ス", romaji: "su" }, { char: "セ", romaji: "se" }, { char: "ソ", romaji: "so" },
  { char: "タ", romaji: "ta" }, { char: "チ", romaji: "chi" }, { char: "ツ", romaji: "tsu" }, { char: "テ", romaji: "te" }, { char: "ト", romaji: "to" },
  { char: "ナ", romaji: "na" }, { char: "ニ", romaji: "ni" }, { char: "ヌ", romaji: "nu" }, { char: "ネ", romaji: "ne" }, { char: "ノ", romaji: "no" },
  { char: "ハ", romaji: "ha" }, { char: "ヒ", romaji: "hi" }, { char: "フ", romaji: "fu" }, { char: "ヘ", romaji: "he" }, { char: "ホ", romaji: "ho" },
  { char: "マ", romaji: "ma" }, { char: "ミ", romaji: "mi" }, { char: "ム", romaji: "mu" }, { char: "メ", romaji: "me" }, { char: "モ", romaji: "mo" },
  { char: "ヤ", romaji: "ya" }, { char: "ユ", romaji: "yu" }, { char: "ヨ", romaji: "yo" },
  { char: "ラ", romaji: "ra" }, { char: "リ", romaji: "ri" }, { char: "ル", romaji: "ru" }, { char: "レ", romaji: "re" }, { char: "ロ", romaji: "ro" },
  { char: "ワ", romaji: "wa" }, { char: "ヲ", romaji: "wo" }, { char: "ン", romaji: "n" },
];

const katakanaDakuten: Kana[] = [
  { char: "ガ", romaji: "ga" }, { char: "ギ", romaji: "gi" }, { char: "グ", romaji: "gu" }, { char: "ゲ", romaji: "ge" }, { char: "ゴ", romaji: "go" },
  { char: "ザ", romaji: "za" }, { char: "ジ", romaji: "ji" }, { char: "ズ", romaji: "zu" }, { char: "ゼ", romaji: "ze" }, { char: "ゾ", romaji: "zo" },
  { char: "ダ", romaji: "da" }, { char: "ヂ", romaji: "ji" }, { char: "ヅ", romaji: "zu" }, { char: "デ", romaji: "de" }, { char: "ド", romaji: "do" },
  { char: "バ", romaji: "ba" }, { char: "ビ", romaji: "bi" }, { char: "ブ", romaji: "bu" }, { char: "ベ", romaji: "be" }, { char: "ボ", romaji: "bo" },
  { char: "パ", romaji: "pa" }, { char: "ピ", romaji: "pi" }, { char: "プ", romaji: "pu" }, { char: "ペ", romaji: "pe" }, { char: "ポ", romaji: "po" },
];

// ✅ Hiragana combos
const hiraganaCombos: Kana[] = [
  { char: "きゃ", romaji: "kya" }, { char: "きゅ", romaji: "kyu" }, { char: "きょ", romaji: "kyo" },
  { char: "ぎゃ", romaji: "gya" }, { char: "ぎゅ", romaji: "gyu" }, { char: "ぎょ", romaji: "gyo" },
  { char: "しゃ", romaji: "sha" }, { char: "しゅ", romaji: "shu" }, { char: "しょ", romaji: "sho" },
  { char: "じゃ", romaji: "ja" },  { char: "じゅ", romaji: "ju" },  { char: "じょ", romaji: "jo" },
  { char: "ちゃ", romaji: "cha" }, { char: "ちゅ", romaji: "chu" }, { char: "ちょ", romaji: "cho" },
  { char: "にゃ", romaji: "nya" }, { char: "にゅ", romaji: "nyu" }, { char: "にょ", romaji: "nyo" },
  { char: "ひゃ", romaji: "hya" }, { char: "ひゅ", romaji: "hyu" }, { char: "ひょ", romaji: "hyo" },
  { char: "びゃ", romaji: "bya" }, { char: "びゅ", romaji: "byu" }, { char: "びょ", romaji: "byo" },
  { char: "ぴゃ", romaji: "pya" }, { char: "ぴゅ", romaji: "pyu" }, { char: "ぴょ", romaji: "pyo" },
  { char: "みゃ", romaji: "mya" }, { char: "みゅ", romaji: "myu" }, { char: "みょ", romaji: "myo" },
  { char: "りゃ", romaji: "rya" }, { char: "りゅ", romaji: "ryu" }, { char: "りょ", romaji: "ryo" },
];

// ✅ Katakana combos
const katakanaCombos: Kana[] = [
  { char: "キャ", romaji: "kya" }, { char: "キュ", romaji: "kyu" }, { char: "キョ", romaji: "kyo" },
  { char: "ギャ", romaji: "gya" }, { char: "ギュ", romaji: "gyu" }, { char: "ギョ", romaji: "gyo" },
  { char: "シャ", romaji: "sha" }, { char: "シュ", romaji: "shu" }, { char: "ショ", romaji: "sho" },
  { char: "ジャ", romaji: "ja" },  { char: "ジュ", romaji: "ju" },  { char: "ジョ", romaji: "jo" },
  { char: "チャ", romaji: "cha" }, { char: "チュ", romaji: "chu" }, { char: "チョ", romaji: "cho" },
  { char: "ニャ", romaji: "nya" }, { char: "ニュ", romaji: "nyu" }, { char: "ニョ", romaji: "nyo" },
  { char: "ヒャ", romaji: "hya" }, { char: "ヒュ", romaji: "hyu" }, { char: "ヒョ", romaji: "hyo" },
  { char: "ビャ", romaji: "bya" }, { char: "ビュ", romaji: "byu" }, { char: "ビョ", romaji: "byo" },
  { char: "ピャ", romaji: "pya" }, { char: "ピュ", romaji: "pyu" }, { char: "ピョ", romaji: "pyo" },
  { char: "ミャ", romaji: "mya" }, { char: "ミュ", romaji: "myu" }, { char: "ミョ", romaji: "myo" },
  { char: "リャ", romaji: "rya" }, { char: "リュ", romaji: "ryu" }, { char: "リョ", romaji: "ryo" },
];

const hiragana = [...hiraganaBase, ...hiraganaDakuten, ...hiraganaCombos];
const katakana = [...katakanaBase, ...katakanaDakuten, ...katakanaCombos];

export default function Game() {
  const [mode, setMode] = useState<"hiragana" | "katakana" | "all" | null>(null);
  const [kanaSet, setKanaSet] = useState<Kana[]>([]);
  const [current, setCurrent] = useState<Kana | null>(null);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [lives, setLives] = useState(5);
  const [gameOver, setGameOver] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  const getRandomKana = (list: Kana[]) => list[Math.floor(Math.random() * list.length)];

  useEffect(() => {
    if (mode) {
      const chosenSet =
        mode === "hiragana"
          ? hiragana
          : mode === "katakana"
          ? katakana
          : [...hiragana, ...katakana];
      setKanaSet(chosenSet);
      setCurrent(getRandomKana(chosenSet));
      setScore(0);
      setTotalQuestions(0);
      setLives(5);
      setGameOver(false);
      setInput("");
      setStartTime(Date.now());
      setElapsedTime(0);
    }
  }, [mode]);

  useEffect(() => {
    if (mode && !gameOver) {
      const interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [mode, gameOver, startTime]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!current || gameOver) return;

    const isCorrect = input.toLowerCase().trim() === current.romaji;
    const newTotalQuestions = totalQuestions + 1;
    setTotalQuestions(newTotalQuestions);

    if (isCorrect) {
      const newScore = score + 1;
      setScore(newScore);
      updateAnswerCount(true);
      updateStreak(true);
      
      // Continue game
      setCurrent(getRandomKana(kanaSet));
      setInput("");
    } else {
      updateAnswerCount(false);
      updateStreak(false);
      
      const newLives = lives - 1;
      setLives(newLives);
      
      if (newLives <= 0) {
        // Game over - save session
        const duration = Math.floor((Date.now() - startTime) / 1000);
        const accuracy = newTotalQuestions > 0 ? (score / newTotalQuestions) * 100 : 0;
        
        saveQuizSession({
          date: new Date().toISOString(),
          mode: `kana-${mode}`,
          score,
          totalQuestions: newTotalQuestions,
          accuracy,
          duration,
        });
        
        setGameOver(true);
      } else {
        // Continue game
        setCurrent(getRandomKana(kanaSet));
        setInput("");
      }
    }
  };

  const resetGame = () => {
    // Save current session before resetting if there were questions answered
    if (totalQuestions > 0) {
      const duration = Math.floor((Date.now() - startTime) / 1000);
      const accuracy = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0;
      
      saveQuizSession({
        date: new Date().toISOString(),
        mode: `kana-${mode}`,
        score,
        totalQuestions,
        accuracy,
        duration,
      });
    }
    
    setScore(0);
    setTotalQuestions(0);
    setLives(5);
    setGameOver(false);
    setCurrent(getRandomKana(kanaSet));
    setInput("");
    setStartTime(Date.now());
    setElapsedTime(0);
  };

  if (!mode) {
    return (
      <div className="flex flex-col min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-green-900 to-gray-900 text-white">
        <Navbar />
        <div className="flex flex-col items-center justify-center flex-1 p-8">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">Kana Quiz Game</h1>
          <p className="mb-8 text-xl text-gray-300">Choose a mode:</p>
          <div className="flex flex-wrap justify-center gap-6">
            <button
              onClick={() => setMode("hiragana")}
              className="px-8 py-4 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl hover:from-blue-500 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-2xl font-medium text-lg"
            >
              Hiragana
            </button>
            <button
              onClick={() => setMode("katakana")}
              className="px-8 py-4 bg-gradient-to-br from-green-600 to-green-800 rounded-xl hover:from-green-500 hover:to-green-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-2xl font-medium text-lg"
            >
              Katakana
            </button>
            <button
              onClick={() => setMode("all")}
              className="px-8 py-4 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl hover:from-purple-500 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-2xl font-medium text-lg"
            >
              All Kana
            </button>
           </div>
        </div>
      </div>
    );
  }

  return (
  <div className="min-h-screen overflow-hidden flex flex-col bg-gradient-to-br from-gray-900 via-green-900 to-gray-900 text-white">
    <Navbar />
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
        Kana Quiz Game ({mode})
      </h1>

      {gameOver ? (
        <div className="text-center bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
          <p className="text-3xl mb-2 font-bold">Game Over!</p>
          <p className="text-xl mb-6 text-gray-300">Your score: <span className="text-green-400 font-bold">{score}</span></p>
          <div className="flex justify-center gap-4">
            <button
              onClick={resetGame}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-500 hover:to-blue-600 transition-all transform hover:scale-105 font-medium shadow-lg"
            >
              Restart
            </button>
            <button
              onClick={() => setMode(null)}
              className="px-8 py-3 bg-gray-700 rounded-xl hover:bg-gray-600 transition-all transform hover:scale-105 font-medium shadow-lg"
            >
              Main Menu
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 mb-6 shadow-2xl border border-gray-700">
            <div className="text-9xl font-bold mb-6 text-center text-green-300">{current?.char}</div>
            <form onSubmit={handleSubmit} className="mb-4 flex flex-col gap-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="px-6 py-4 text-xl bg-gray-700 border-2 border-gray-600 rounded-xl focus:border-green-500 focus:outline-none text-white text-center"
                placeholder="Type romaji..."
                autoFocus
              />
              <button
                type="submit"
                className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 rounded-xl hover:from-green-500 hover:to-green-600 transition-all transform hover:scale-105 font-bold text-lg shadow-lg"
              >
                Submit
              </button>
            </form>
          </div>
          <div className="flex gap-6 mt-4 flex-wrap justify-center">
            <div className="bg-gray-800/80 backdrop-blur-sm px-6 py-3 rounded-xl border border-gray-700">
              <span className="text-gray-300">Score: </span>
              <span className="text-green-400 font-bold text-xl">{score}</span>
            </div>
            <div className="bg-gray-800/80 backdrop-blur-sm px-6 py-3 rounded-xl border border-gray-700">
              <span className="text-gray-300">Lives: </span>
              <span className="text-red-400 font-bold text-xl">{lives}</span>
            </div>
            <div className="bg-gray-800/80 backdrop-blur-sm px-6 py-3 rounded-xl border border-gray-700">
              <span className="text-gray-300">⏱️ Time: </span>
              <span className="text-blue-400 font-bold text-xl">
                {Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, "0")}
              </span>
            </div>
            {score > 0 && (
              <div className="bg-gray-800/80 backdrop-blur-sm px-6 py-3 rounded-xl border border-gray-700">
                <span className="text-gray-300">Rate: </span>
                <span className="text-purple-400 font-bold text-xl">
                  {Math.round((score / (elapsedTime / 60 + 1)) * 10) / 10}/min
                </span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  </div>
);

}
