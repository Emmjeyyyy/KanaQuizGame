"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import { addAbortSignal } from "stream";

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
  const [lives, setLives] = useState(5);
  const [gameOver, setGameOver] = useState(false);

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
      setLives(5);
      setGameOver(false);
      setInput("");
    }
  }, [mode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!current) return;

    if (input.toLowerCase().trim() === current.romaji) {
      setScore((s) => s + 1);
    } else {
      setLives((l) => {
        const newLives = l - 1;
        if (newLives <= 0) {
          setGameOver(true);
          return 0;
        }
        return newLives;
      });
    }

    setCurrent(getRandomKana(kanaSet));
    setInput("");
  };

  const resetGame = () => {
    setScore(0);
    setLives(5);
    setGameOver(false);
    setCurrent(getRandomKana(kanaSet));
    setInput("");
  };

  if (!mode) {
    return (
      <div className="flex flex-col h-screen overflow-hidden bg-gray-900 text-white">
        <Navbar />
        <div className="flex flex-col items-center justify-center flex-1 p-8">
          <h1 className="text-3xl font-bold mb-6">Kana Quiz Game</h1>
          <p className="mb-4">Choose a mode:</p>
          <div className="flex gap-4">
            <button
              onClick={() => setMode("hiragana")}
              className="px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Hiragana
            </button>
            <button
              onClick={() => setMode("katakana")}
              className="px-6 py-2 bg-green-600 rounded-lg hover:bg-green-700"
            >
              Katakana
            </button>
            <button
              onClick={() => setMode("all")}
              className="px-6 py-2 bg-purple-600 rounded-lg hover:bg-purple-700"
            >
              All Kana
            </button>
           </div>
        </div>
      </div>
    );
  }

  return (
  <div className="h-screen overflow-hidden flex flex-col bg-gray-900 text-white">
    <Navbar />
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-6">Kana Quiz Game ({mode})</h1>

      {gameOver ? (
        <div className="text-center">
          <p className="text-2xl mb-4">Game Over! Your score: {score}</p>
          <div className="flex justify-center gap-4">
            <button
              onClick={resetGame}
              className="px-6 py-2 bg-blue-500 rounded-lg hover:bg-blue-600"
            >
              Restart
            </button>
            <button
              onClick={() => setMode(null)}
              className="px-6 py-2 bg-gray-500 rounded-lg hover:bg-gray-600"
            >
              Main Menu
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="text-8xl font-bold mb-6">{current?.char}</div>
          <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="px-4 py-2 text-white rounded-lg"
              autoFocus
            />
            <button
              type="submit"
              className="px-6 py-2 bg-green-500 rounded-lg hover:bg-green-600"
            >
              Submit
            </button>
          </form>
          <div className="flex gap-6 mt-4">
            <p>Score: {score}</p>
            <p>Lives: {lives}</p>
          </div>
        </>
      )}
    </div>
  </div>
);

}
