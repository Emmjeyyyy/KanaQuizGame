"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/navbar";

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

export default function StudyPage() {
  const [showHiragana, setShowHiragana] = useState(true);
  const [showKatakana, setShowKatakana] = useState(true);
  const hiraganaAllWithType = [
  ...hiraganaBase.map(k => ({ ...k, type: "main" })),
  ...hiraganaDakuten.map(k => ({ ...k, type: "dakuten" })),
  ...hiraganaCombos.map(k => ({ ...k, type: "combo" })),
];

  const katakanaAllWithType = [
    ...katakanaBase.map(k => ({ ...k, type: "main" })),
    ...katakanaDakuten.map(k => ({ ...k, type: "dakuten" })),
    ...katakanaCombos.map(k => ({ ...k, type: "combo" })),
  ];
  // Merge kana based on toggles
  const kanaToDisplay = hiraganaAllWithType.map((h, index) => {
  const k = katakanaAllWithType[index] || {};
  return {
    hiragana: h.char,
    katakana: k.char,
    romaji: h.romaji,
    type: h.type,
  };
}).filter(k => (showHiragana || showKatakana));


  const [scrolling, setScrolling] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolling(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-900 text-white p-8 pt-20 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-6">Study Kana</h1>

         <div
          className={`mb-6 flex gap-4 transition-opacity duration-300
            sticky top-5 z-50
            ${scrolling ? "opacity-70" : "opacity-100"}`}
        >
          <button
            onClick={() => {
              if (showKatakana) setShowHiragana(!showHiragana);
              // Only toggle if Katakana is on
            }}
            className={`px-4 py-2 rounded-lg ${
              showHiragana ? "bg-blue-600" : "bg-gray-700"
            } hover:bg-blue-700`}
          >
            Hiragana
          </button>

          <button
            onClick={() => {
              if (showHiragana) setShowKatakana(!showKatakana);
              // Only toggle if Hiragana is on
            }}
            className={`px-4 py-2 rounded-lg ${
              showKatakana ? "bg-green-600" : "bg-gray-700"
            } hover:bg-green-700`}
          >
            Katakana
          </button>
        </div>

        <div className="mb-6 max-w-xl mx-auto space-y-6">
  {/* Main Kana */}
  <div>
    <h2 className="text-xl font-semibold mb-2">Main Kana</h2>
    <div
      className="grid gap-4"
      style={{ gridTemplateColumns: 'repeat(5, minmax(0, 1fr))' }}
    >
      {kanaToDisplay
        .filter(k => k.type === 'main')
        .map((k, index) => (
          <div
            key={index}
            className="p-5 px-10 flex flex-col items-center justify-center bg-gray-800 rounded-lg hover:bg-gray-700 cursor-pointer"
          >
            <div className="text-3xl mb-1 flex gap-2">
              {showHiragana && <span>{k.hiragana}</span>}
              {showKatakana && <span>{k.katakana}</span>}
            </div>
            <span className="text-lg">{k.romaji}</span>
          </div>
        ))}
    </div>
  </div>

  {/* Dakuten / Handakuten */}
  <div>
    <h2 className="text-xl font-semibold mb-2">Dakuten / Handakuten</h2>
    <div
      className="grid gap-4"
      style={{ gridTemplateColumns: 'repeat(5, minmax(0, 1fr))' }}
    >
      {kanaToDisplay
        .filter(k => k.type === 'dakuten')
        .map((k, index) => (
          <div
            key={index}
            className="p-5 px-10 flex flex-col items-center justify-center bg-gray-800 rounded-lg hover:bg-gray-700 cursor-pointer"
          >
            <div className="text-3xl mb-1 flex gap-2">
              {showHiragana && <span>{k.hiragana}</span>}
              {showKatakana && <span>{k.katakana}</span>}
            </div>
            <span className="text-lg">{k.romaji}</span>
          </div>
        ))}
    </div>
  </div>

  {/* Combo Kana */}
  <div>
    <h2 className="text-xl font-semibold mb-2">Combo Kana</h2>
    <div
      className="grid gap-4"
      style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}
    >
      {kanaToDisplay
        .filter(k => k.type === 'combo')
        .map((k, index) => (
          <div
            key={index}
            className="p-5 px-6 flex flex-col items-center justify-center bg-gray-800 rounded-lg hover:bg-gray-700 cursor-pointer"
          >
            <div className="text-3xl mb-1 flex gap-2">
              {showHiragana && <span>{k.hiragana}</span>}
              {showKatakana && <span>{k.katakana}</span>}
            </div>
            <span className="text-lg">{k.romaji}</span>
          </div>
        ))}
    </div>
  </div>
</div>



      </div>
    </div>
  );
}