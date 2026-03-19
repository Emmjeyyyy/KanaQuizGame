"use client";

import { useState, useEffect } from "react";

type Kana = {
  char: string;
  romaji: string;
};

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

type JishoWordResult = {
  word: string;
  reading: string;
  meanings: string[];
  isCommon?: boolean;
  jlpt?: string[];
  tags?: string[];
};

type JishoJapaneseEntry = {
  word?: string;
  reading?: string;
};

type JishoSense = {
  english_definitions?: string[];
};

type JishoDataEntry = {
  japanese?: JishoJapaneseEntry[];
  senses?: JishoSense[];
  is_common?: boolean;
  jlpt?: string[];
  tags?: string[];
};

type JishoApiResponse = {
  data?: JishoDataEntry[];
  error?: string;
};

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
  const [activeTab, setActiveTab] = useState<"kana" | "kanji">("kana");
  const [showHiragana, setShowHiragana] = useState(true);
  const [showKatakana, setShowKatakana] = useState(true);

  const [kanjiSearchQuery, setKanjiSearchQuery] = useState("");
  const [kanjiResults, setKanjiResults] = useState<KanjiData[]>([]);
  const [jishoWordResults, setJishoWordResults] = useState<JishoWordResult[]>([]);
  const [kanjiLoading, setKanjiLoading] = useState(false);
  const [kanjiError, setKanjiError] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

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

  const kanaToDisplay = hiraganaAllWithType.map((h, index) => {
    const katakanaEntry = katakanaAllWithType[index] || {};
    return {
      hiragana: h.char,
      katakana: katakanaEntry.char,
      romaji: h.romaji,
      type: h.type,
    };
  }).filter(() => (showHiragana || showKatakana));

  const [scrolling, setScrolling] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolling(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("kanji-recent-searches");
      if (stored) {
        try {
          setRecentSearches(JSON.parse(stored));
        } catch {
          console.error("Failed to load recent searches");
        }
      }
    }
  }, []);

  const saveRecentSearch = (kanji: string) => {
    if (typeof window === "undefined") return;
    const updated = [kanji, ...recentSearches.filter(s => s !== kanji)].slice(0, 10);
    setRecentSearches(updated);
    localStorage.setItem("kanji-recent-searches", JSON.stringify(updated));
  };

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
    } catch {
      return null;
    }
  };

  const englishToKanjiMap: Record<string, string[]> = {
    water: ["水"], fire: ["火"], person: ["人"], big: ["大"], small: ["小"],
    middle: ["中"], sun: ["日"], moon: ["月"], tree: ["木"], mountain: ["山"],
    river: ["川"], field: ["田"], car: ["車"], electricity: ["電"], word: ["語"],
    school: ["校"], student: ["生"], house: ["家"], eat: ["食"], drink: ["飲"],
    see: ["見"], hear: ["聞"], go: ["行"], come: ["来"], exit: ["出"],
    enter: ["入"], meeting: ["会"], company: ["社"], shop: ["店"], station: ["駅"],
    road: ["道"], country: ["国"], city: ["市"], new: ["新"], old: ["古"],
    high: ["高"], low: ["低"], long: ["長"], short: ["短"], many: ["多"],
    few: ["少"], good: ["好"], bad: ["悪"], heart: ["心"], hand: ["手"],
    foot: ["足"], eye: ["目"], ear: ["耳"], mouth: ["口"], name: ["名"],
    character: ["字"], book: ["書"], read: ["読"], buy: ["買"], sell: ["売"],
    make: ["作"], use: ["使"], stand: ["立"], sit: ["座"], rest: ["休"],
    work: ["働"], sleep: ["寝"], return: ["帰"], open: ["開"], close: ["閉"],
    start: ["始"], end: ["終"], continue: ["続"], red: ["赤"], blue: ["青"],
    white: ["白"], black: ["黒"], green: ["緑"], yellow: ["黄"], gold: ["金"],
    silver: ["銀"],
  };

  const searchJishoWords = async (query: string): Promise<{ words: JishoWordResult[]; kanji: string[] }> => {
    try {
      const response = await fetch(`/api/jisho?keyword=${encodeURIComponent(query)}`);
      if (!response.ok) {
        const lowerQuery = query.toLowerCase().trim();
        if (englishToKanjiMap[lowerQuery]) {
          return { words: [], kanji: englishToKanjiMap[lowerQuery] };
        }
        return { words: [], kanji: [] };
      }

      const data = await response.json() as JishoApiResponse;
      if (data.error) {
        const lowerQuery = query.toLowerCase().trim();
        if (englishToKanjiMap[lowerQuery]) {
          return { words: [], kanji: englishToKanjiMap[lowerQuery] };
        }
        return { words: [], kanji: [] };
      }

      const words: JishoWordResult[] = [];
      const kanjiSet = new Set<string>();

      if (data.data && Array.isArray(data.data) && data.data.length > 0) {
        data.data.forEach((entry: JishoDataEntry) => {
          if (entry.japanese && Array.isArray(entry.japanese) && entry.japanese.length > 0) {
            entry.japanese.forEach((j: JishoJapaneseEntry) => {
              const word = j.word || "";
              const reading = j.reading || "";
              if (word || reading) {
                const meanings = entry.senses && Array.isArray(entry.senses)
                  ? entry.senses.flatMap((sense: JishoSense) => sense.english_definitions || [])
                  : [];
                if (meanings.length > 0) {
                  words.push({
                    word, reading, meanings: meanings.slice(0, 10),
                    isCommon: entry.is_common || false,
                    jlpt: entry.jlpt || [], tags: entry.tags || [],
                  });
                }
                const text = word || reading;
                text.split("").forEach((char: string) => {
                  const code = char.charCodeAt(0);
                  if ((code >= 0x4E00 && code <= 0x9FFF) || (code >= 0x3400 && code <= 0x4DBF)) {
                    kanjiSet.add(char);
                  }
                });
              }
            });
          }
        });
      }

      if (words.length > 0 || kanjiSet.size > 0) {
        return { words, kanji: Array.from(kanjiSet) };
      }

      const lowerQuery = query.toLowerCase().trim();
      if (englishToKanjiMap[lowerQuery]) {
        return { words: [], kanji: englishToKanjiMap[lowerQuery] };
      }
      return { words: [], kanji: [] };
    } catch {
      const lowerQuery = query.toLowerCase().trim();
      if (englishToKanjiMap[lowerQuery]) {
        return { words: [], kanji: englishToKanjiMap[lowerQuery] };
      }
      return { words: [], kanji: [] };
    }
  };

  const searchKanji = async () => {
    const query = kanjiSearchQuery.trim();
    if (!query) {
      setKanjiResults([]);
      setJishoWordResults([]);
      setKanjiError(null);
      return;
    }

    setKanjiLoading(true);
    setKanjiError(null);

    try {
      const directKanjiChars = query.split("").filter(char => {
        const code = char.charCodeAt(0);
        return (code >= 0x4E00 && code <= 0x9FFF) || (code >= 0x3400 && code <= 0x4DBF);
      });

      let kanjiToFetch: string[] = [];
      let wordResults: JishoWordResult[] = [];

      if (directKanjiChars.length > 0) {
        kanjiToFetch = directKanjiChars;
        const jishoData = await searchJishoWords(query);
        wordResults = jishoData.words;
        jishoData.kanji.forEach(k => {
          if (!kanjiToFetch.includes(k)) kanjiToFetch.push(k);
        });
      } else {
        const jishoData = await searchJishoWords(query);
        if (jishoData.words.length === 0 && jishoData.kanji.length === 0) {
          const alternativeData = await searchJishoWords(`#${query}`);
          if (alternativeData.words.length > 0 || alternativeData.kanji.length > 0) {
            wordResults = alternativeData.words;
            kanjiToFetch = alternativeData.kanji;
          } else {
            const lowerQuery = query.toLowerCase().trim();
            if (englishToKanjiMap[lowerQuery]) {
              kanjiToFetch = englishToKanjiMap[lowerQuery];
            } else {
              setKanjiError(`No results found for "${query}". Try a different search term.`);
              setKanjiLoading(false);
              return;
            }
          }
        } else {
          wordResults = jishoData.words;
          kanjiToFetch = jishoData.kanji;
        }
      }

      setJishoWordResults(wordResults);

      if (kanjiToFetch.length > 0) {
        const results = await Promise.all(kanjiToFetch.map(char => fetchKanjiData(char)));
        const validResults = results.filter((r): r is KanjiData => r !== null);
        setKanjiResults(validResults);
        validResults.forEach(result => saveRecentSearch(result.kanji));
        wordResults.slice(0, 5).forEach(result => {
          if (result.word) saveRecentSearch(result.word);
        });
      } else if (wordResults.length === 0) {
        setKanjiError("No results found. Please try a different search term.");
      }
    } catch {
      setKanjiError("An error occurred while searching. Please try again.");
    } finally {
      setKanjiLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !kanjiLoading) {
      searchKanji();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-primary via-background-secondary to-background-primary">
      <div className="p-6 md:p-8 pt-20 flex flex-col items-center">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
            Study Center
          </h1>
          <p className="text-text-secondary text-lg">Master Japanese characters and kanji</p>
        </div>

        <div className="mb-8 flex gap-4">
          <button
            onClick={() => setActiveTab("kana")}
            className={`px-8 py-3 rounded-xl font-medium transition-all transform hover:scale-105 border ${
              activeTab === "kana"
                ? "bg-info border-info shadow-lg shadow-info/50 text-white"
                : "bg-background-secondary border-neutral-surface text-text-secondary hover:bg-neutral-surface"
            }`}
          >
            📚 Kana Study
          </button>
          <button
            onClick={() => setActiveTab("kanji")}
            className={`px-8 py-3 rounded-xl font-medium transition-all transform hover:scale-105 border ${
              activeTab === "kanji"
                ? "bg-purple-600 border-purple-500 shadow-lg shadow-purple-500/50 text-white"
                : "bg-background-secondary border-neutral-surface text-text-secondary hover:bg-neutral-surface"
            }`}
          >
            ✍️ Kanji Search
          </button>
        </div>

        {activeTab === "kana" && (
          <>
            <div
              className={`mb-8 flex gap-4 transition-opacity duration-300 sticky top-20 z-40 ${scrolling ? "opacity-70" : "opacity-100"}`}
            >
              <button
                onClick={() => { if (showKatakana) setShowHiragana(!showHiragana); }}
                className={`px-6 py-3 rounded-xl font-medium transition-all transform hover:scale-105 border ${
                  showHiragana
                    ? "bg-info border-info shadow-lg shadow-info/50"
                    : "bg-background-secondary border-neutral-surface hover:bg-neutral-surface"
                }`}
              >
                Hiragana
              </button>
              <button
                onClick={() => { if (showHiragana) setShowKatakana(!showKatakana); }}
                className={`px-6 py-3 rounded-xl font-medium transition-all transform hover:scale-105 border ${
                  showKatakana
                    ? "bg-success border-success shadow-lg shadow-success/50"
                    : "bg-background-secondary border-neutral-surface hover:bg-neutral-surface"
                }`}
              >
                Katakana
              </button>
            </div>

            <div className="mb-6 max-w-4xl mx-auto space-y-6 w-full">
              <div>
                <h2 className="text-xl font-semibold mb-2 text-text-primary">Main Kana</h2>
                <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(5, minmax(0, 1fr))' }}>
                  {kanaToDisplay.filter(k => k.type === 'main').map((k, index) => (
                    <div
                      key={index}
                      className="p-5 px-10 flex flex-col items-center justify-center bg-background-secondary rounded-lg hover:bg-neutral-surface cursor-pointer transition-all transform hover:scale-105 shadow-lg hover:shadow-xl border border-neutral-surface hover:border-highlight-cta"
                    >
                      <div className="text-3xl mb-1 flex gap-2 font-bold">
                        {showHiragana && <span className="text-info">{k.hiragana}</span>}
                        {showKatakana && <span className="text-success">{k.katakana}</span>}
                      </div>
                      <span className="text-lg text-text-secondary font-medium">{k.romaji}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2 text-text-primary">Dakuten / Handakuten</h2>
                <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(5, minmax(0, 1fr))' }}>
                  {kanaToDisplay.filter(k => k.type === 'dakuten').map((k, index) => (
                    <div
                      key={index}
                      className="p-5 px-10 flex flex-col items-center justify-center bg-background-secondary rounded-lg hover:bg-neutral-surface cursor-pointer transition-all transform hover:scale-105 shadow-lg hover:shadow-xl border border-neutral-surface hover:border-success"
                    >
                      <div className="text-3xl mb-1 flex gap-2 font-bold">
                        {showHiragana && <span className="text-info">{k.hiragana}</span>}
                        {showKatakana && <span className="text-success">{k.katakana}</span>}
                      </div>
                      <span className="text-lg text-text-secondary font-medium">{k.romaji}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2 text-text-primary">Combo Kana</h2>
                <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
                  {kanaToDisplay.filter(k => k.type === 'combo').map((k, index) => (
                    <div
                      key={index}
                      className="p-5 px-6 flex flex-col items-center justify-center bg-background-secondary rounded-lg hover:bg-neutral-surface cursor-pointer transition-all transform hover:scale-105 shadow-lg hover:shadow-xl border border-neutral-surface hover:border-purple-500"
                    >
                      <div className="text-3xl mb-1 flex gap-2 font-bold">
                        {showHiragana && <span className="text-info">{k.hiragana}</span>}
                        {showKatakana && <span className="text-success">{k.katakana}</span>}
                      </div>
                      <span className="text-lg text-text-secondary font-medium">{k.romaji}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "kanji" && (
          <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in">
            <div className="glass-effect rounded-2xl p-6 shadow-xl border border-neutral-surface">
              <div className="flex gap-4 mb-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={kanjiSearchQuery}
                    onChange={(e) => setKanjiSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Search kanji by character (水) or English word (water)..."
                    className="w-full px-6 py-4 text-xl bg-background-secondary border-2 border-neutral-surface rounded-xl focus:border-purple-500 focus:outline-none text-text-primary placeholder-text-muted"
                    disabled={kanjiLoading}
                  />
                  {kanjiSearchQuery && (
                    <button
                      onClick={() => {
                        setKanjiSearchQuery("");
                        setKanjiResults([]);
                        setJishoWordResults([]);
                        setKanjiError(null);
                      }}
                      className="absolute right-20 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                      disabled={kanjiLoading}
                    >
                      ✕
                    </button>
                  )}
                </div>
                <button
                  onClick={searchKanji}
                  disabled={kanjiLoading || !kanjiSearchQuery.trim()}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 disabled:hover:scale-100 flex items-center gap-2 border border-neutral-surface"
                >
                  {kanjiLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                      <span>Searching...</span>
                    </>
                  ) : (
                    <>
                      <span>🔍</span>
                      <span>Search</span>
                    </>
                  )}
                </button>
              </div>

              {recentSearches.length > 0 && !kanjiSearchQuery && (
                <div className="mt-4">
                  <p className="text-sm text-text-muted mb-2">Recent searches:</p>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.slice(0, 8).map((kanji, index) => (
                      <button
                        key={index}
                        onClick={() => setKanjiSearchQuery(kanji)}
                        className="px-4 py-2 bg-neutral-surface hover:bg-accent-interactive rounded-lg text-lg transition-all transform hover:scale-105 border border-neutral-surface"
                      >
                        {kanji}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {!kanjiSearchQuery && recentSearches.length === 0 && (
                <div className="mt-4 space-y-3">
                  <div>
                    <p className="text-sm text-text-muted mb-2">Try searching by kanji:</p>
                    <div className="flex flex-wrap gap-2">
                      {["水", "火", "人", "大", "小", "中", "日", "月"].map((kanji) => (
                        <button
                          key={kanji}
                          onClick={() => setKanjiSearchQuery(kanji)}
                          className="px-4 py-2 bg-neutral-surface hover:bg-accent-interactive rounded-lg text-lg transition-all transform hover:scale-105 border border-neutral-surface"
                        >
                          {kanji}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-text-muted mb-2">Or search by English word:</p>
                    <div className="flex flex-wrap gap-2">
                      {["water", "fire", "person", "big", "small", "middle", "sun", "moon"].map((word) => (
                        <button
                          key={word}
                          onClick={() => setKanjiSearchQuery(word)}
                          className="px-4 py-2 bg-neutral-surface hover:bg-accent-interactive rounded-lg text-sm transition-all transform hover:scale-105 capitalize border border-neutral-surface"
                        >
                          {word}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {kanjiLoading && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-500"></div>
                <p className="mt-4 text-text-muted">Searching kanji...</p>
              </div>
            )}

            {kanjiError && !kanjiLoading && (
              <div className="bg-error/20 border-2 border-error rounded-xl p-6 text-center">
                <p className="text-red-300 text-lg">{kanjiError}</p>
              </div>
            )}

            {jishoWordResults.length > 0 && !kanjiLoading && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-cyan-300 flex items-center gap-2">
                  <span>📚</span> Words & Phrases ({jishoWordResults.length})
                </h2>
                <div className="space-y-4">
                  {jishoWordResults.map((wordResult, index) => (
                    <div
                      key={index}
                      className="glass-effect rounded-xl p-6 shadow-xl border border-neutral-surface animate-scale-in"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-4">
                          <div className="text-4xl font-bold text-cyan-300">
                            {wordResult.word || wordResult.reading}
                          </div>
                          {wordResult.reading && wordResult.word !== wordResult.reading && (
                            <div className="text-xl text-text-muted">
                              {wordResult.reading}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {wordResult.isCommon && (
                            <span className="px-2 py-1 bg-success/20 border border-success rounded text-xs text-success">
                              Common
                            </span>
                          )}
                          {wordResult.jlpt && wordResult.jlpt.length > 0 && (
                            <span className="px-2 py-1 bg-info/20 border border-info rounded text-xs text-info">
                              {wordResult.jlpt.join(", ")}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {wordResult.meanings.map((meaning, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-cyan-900/50 border border-cyan-700 rounded-lg text-cyan-200 text-sm"
                          >
                            {meaning}
                          </span>
                        ))}
                      </div>
                      {wordResult.tags && wordResult.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {wordResult.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-neutral-surface/50 rounded text-xs text-text-muted"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {kanjiResults.length > 0 && !kanjiLoading && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-4 text-purple-300 flex items-center gap-2">
                  <span>✍️</span> Kanji Characters ({kanjiResults.length})
                </h2>
                {kanjiResults.map((kanji, index) => (
                  <div
                    key={`${kanji.kanji}-${index}`}
                    className="glass-effect rounded-2xl p-8 shadow-xl border border-neutral-surface animate-scale-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-6">
                        <div className="text-8xl font-bold text-purple-300">
                          {kanji.kanji}
                        </div>
                        <div className="space-y-2">
                          {kanji.stroke_count && (
                            <div className="flex items-center gap-2 text-text-secondary">
                              <span className="text-lg">✍️</span>
                              <span>{kanji.stroke_count} strokes</span>
                            </div>
                          )}
                          {kanji.jlpt && (
                            <div className="flex items-center gap-2 text-text-secondary">
                              <span className="text-lg">📚</span>
                              <span>JLPT N{kanji.jlpt}</span>
                            </div>
                          )}
                          {kanji.grade && (
                            <div className="flex items-center gap-2 text-text-secondary">
                              <span className="text-lg">🎓</span>
                              <span>Grade {kanji.grade}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {kanji.meanings.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-xl font-bold mb-3 text-info flex items-center gap-2">
                          <span>📖</span> Meanings
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {kanji.meanings.map((meaning, idx) => (
                            <span
                              key={idx}
                              className="px-4 py-2 bg-info/20 border border-info rounded-lg text-info"
                            >
                              {meaning}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid md:grid-cols-3 gap-6">
                      {kanji.kun_readings.length > 0 && (
                        <div>
                          <h3 className="text-lg font-bold mb-2 text-success flex items-center gap-2">
                            <span>📝</span> Kun Readings
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {kanji.kun_readings.map((reading, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-success/20 border border-success rounded-lg text-success"
                              >
                                {reading}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {kanji.on_readings.length > 0 && (
                        <div>
                          <h3 className="text-lg font-bold mb-2 text-warning flex items-center gap-2">
                            <span>📝</span> On Readings
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {kanji.on_readings.map((reading, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-warning/20 border border-warning rounded-lg text-warning"
                              >
                                {reading}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {kanji.name_readings.length > 0 && (
                        <div>
                          <h3 className="text-lg font-bold mb-2 text-pink-300 flex items-center gap-2">
                            <span>📝</span> Name Readings
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {kanji.name_readings.map((reading, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-pink-900/50 border border-pink-700 rounded-lg text-pink-200"
                              >
                                {reading}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {kanjiResults.length === 0 && jishoWordResults.length === 0 && !kanjiLoading && !kanjiError && kanjiSearchQuery && (
              <div className="text-center py-12 text-text-muted">
                <p className="text-xl">No results found. Try searching for a different kanji or word.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
