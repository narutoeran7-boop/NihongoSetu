"use client";

import React, { useState, useMemo } from "react";
import { getGrammarForLevel, GrammarItem } from "@/data/grammar";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import {
  BookMarked,
  Search,
  Volume2,
  CheckCircle2,
  ChevronDown,
  Info,
} from "lucide-react";

const LEVELS = ["N5", "N4", "N3", "N2", "N1"];

const LEVEL_DESCRIPTIONS: Record<string, Record<string, string>> = {
  N5: {
    en: "Foundational Japanese sentence structures, copulas (です), core particles (は, を, に, で, へ, と), polite verbs, and requests.",
    ta: "அடிப்படை ஜப்பானிய வாக்கிய அமைப்புகள், துணை வினைச்சொற்கள் (です), முக்கிய வேற்றுமை உருபுகள் (は, を, に, で, へ, と) மற்றும் எளிய கோரிக்கைகள்.",
    ja: "日本語の基礎的な文型、助詞（は、を、に、で、へ、と）、丁寧形動詞、依頼表現の学習。",
  },
  N4: {
    en: "Expressing obligations, permissions, simultaneous actions (〜ながら), reasons, and past experiences.",
    ta: "கடமைகள், அனுமதிகள், ஒரே நேரத்தில் நிகழும் செயல்கள் (〜ながら), காரணங்கள் மற்றும் கடந்த கால அனுபவங்களை வெளிப்படுத்துதல்.",
    ja: "義務、許可、同時進行（〜ながら）、理由、過去の経験の表現。",
  },
  N3: {
    en: "Intermediate bridge: decisions (ことにする), habits, expectations (はずだ), causations, and contrasting aspects.",
    ta: "இடைநிலை பாலம்: முடிவுகள் (ことにする), பழக்கவழக்கங்கள், எதிர்பார்ப்புகள் (はずだ) மற்றும் ஒப்பீடுகள்.",
    ja: "中級への架け橋：意思決定（ことにする）、習慣、当然の予測（はずだ）、対比表現。",
  },
  N2: {
    en: "Upper-intermediate nuances: inevitable outcomes (かねない), limits, perspectives, and formal discourse.",
    ta: "மேல்-இடைநிலை நுணுக்கங்கள்: தவிர்க்க முடியாத விளைவுகள் (かねない), வரம்புகள் மற்றும் முறையான உரையாடல்கள்.",
    ja: "上級直前のニュアンス：可能性（かねない）、限定、視点、公的文書表現。",
  },
  N1: {
    en: "Advanced literary expressions: emotional restraints, unique conditions, literary purposes, and abstract relationships.",
    ta: "முன்னேறிய இலக்கிய வெளிப்பாடுகள்: உணர்ச்சி கட்டுப்பாடுகள், தனித்துவமான நிபந்தனைகள் மற்றும் நுட்பமான உறவுகள்.",
    ja: "高度な文章表現：感情の抑制、極限状態、慣用句、抽象的論理関係。",
  },
};

export default function GrammarDecksPage() {
  const { language, t } = useLanguage();
  const [activeLevel, setActiveLevel] = useState("N5");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [masteredPatterns, setMasteredPatterns] = useState<string[]>([]);

  const items = useMemo(() => {
    return getGrammarForLevel(activeLevel);
  }, [activeLevel]);

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase();
    return items.filter(
      (item) =>
        item.pattern.toLowerCase().includes(q) ||
        item.reading.toLowerCase().includes(q) ||
        item.meaning.toLowerCase().includes(q) ||
        (language === "ta" && item.meaningTa && item.meaningTa.toLowerCase().includes(q)) ||
        (item.formation && item.formation.toLowerCase().includes(q))
    );
  }, [items, searchQuery, language]);

  const speakJapanese = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ja-JP";
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    } catch {
      // ignore
    }
  };

  const toggleMastered = (pattern: string) => {
    setMasteredPatterns((prev) =>
      prev.includes(pattern) ? prev.filter((p) => p !== pattern) : [...prev, pattern]
    );
  };

  const searchPlaceholder =
    language === "ta"
      ? "இலக்கண அமைப்பைத் தேடுக..."
      : language === "ja"
      ? "文法パターン、接続、意味を検索..."
      : "Search grammar patterns, meaning, romaji...";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#C83C50]/20 text-[#C83C50] text-xs font-semibold mb-2 border border-[#C83C50]/30">
            <BookMarked className="w-3.5 h-3.5" />
            <span>{t("nav_grammar")}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#FFFFFF]">
            {language === "ta"
              ? "JLPT இலக்கண அமைப்புகள் & பயிற்சி"
              : language === "ja"
              ? "体系的文法マスター・文型一覧"
              : "Structured Grammar Mastery & Patterns"}
          </h1>
          <p className="text-xs text-[#E8E0D5]/70 mt-1 max-w-2xl leading-relaxed">
            {language === "ta"
              ? "JLPT N5 முதல் N1 வரையிலான இலக்கண விதிகள், வாக்கிய அமைப்புகள் மற்றும் ஆடியோ மாதிரி வாக்கியங்கள்."
              : language === "ja"
              ? "JLPT N5〜N1の文法規則、接続、例文を学習します。"
              : "Browse authentic grammar rules from JLPT N5 to N1 with grammatical formations and audio example sentences."}
          </p>
        </div>

        {/* Level Selector Tabs */}
        <div className="flex items-center bg-[#101C35] p-1 rounded-xl border border-[#E8E0D5]/20 shrink-0">
          {LEVELS.map((lvl) => (
            <button
              key={lvl}
              onClick={() => {
                setActiveLevel(lvl);
                setExpandedIndex(0);
                setSearchQuery("");
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeLevel === lvl
                  ? "bg-[#C83C50] text-[#FFFFFF] shadow-md shadow-[#C83C50]/30"
                  : "text-[#E8E0D5]/70 hover:text-[#FFFFFF]"
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Level Description & Search Banner */}
      <div className="bg-[#101C35] border border-[#E8E0D5]/20 rounded-2xl p-4 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
        <div className="space-y-1.5 flex-1 max-w-xl">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-extrabold px-2.5 py-0.5 rounded bg-[#C83C50] text-[#FFFFFF]">
              JLPT {activeLevel}
            </span>
            <span className="text-xs text-[#E8E0D5]/80 font-medium">
              {filteredItems.length} {language === "ta" ? "அமைப்புகள்" : language === "ja" ? "項目" : "Patterns in Deck"}
            </span>
          </div>
          <p className="text-xs text-[#E8E0D5]/70">
            {LEVEL_DESCRIPTIONS[activeLevel]?.[language] || LEVEL_DESCRIPTIONS[activeLevel]?.en}
          </p>
          <p className="text-[11px] text-[#E8E0D5]/50 flex items-center gap-1.5 pt-0.5">
            <Info className="w-3.5 h-3.5 shrink-0 text-[#C83C50]" />
            <span>
              {language === "ta"
                ? "பாடத்திட்ட குறிப்பு இலக்கு: நிலையான ஜப்பானிய மொழி கல்வி அளவுகோல்களின் அடிப்படையில் ஒழுங்கமைக்கப்பட்டது."
                : language === "ja"
                ? "標準的な日本語教育基準に基づきカリキュラムを構成しています。"
                : "Curricular Reference Target: Curricula organized based on standard Japanese language education benchmarks."}
            </span>
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#E8E0D5]/50" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full bg-[#101C35] border border-[#E8E0D5]/25 rounded-xl pl-10 pr-4 py-2 text-xs text-[#FFFFFF] placeholder-[#E8E0D5]/40 focus:outline-none focus:border-[#C83C50]"
          />
        </div>
      </div>

      {/* Grammar Cards List */}
      <div className="space-y-4">
        {filteredItems.map((item, idx) => {
          const isExpanded = expandedIndex === idx;
          const isMastered = masteredPatterns.includes(item.pattern);

          return (
            <div
              key={`${item.pattern}-${idx}`}
              className={`rounded-2xl border transition-all ${
                isMastered
                  ? "bg-[#101C35]/90 border-emerald-500/40"
                  : "bg-[#101C35] border-[#E8E0D5]/15 hover:border-[#E8E0D5]/30"
              }`}
            >
              {/* Card Summary Header */}
              <div
                onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                className="p-5 cursor-pointer flex items-center justify-between gap-4 select-none"
              >
                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMastered(item.pattern);
                    }}
                    className={`p-2 rounded-xl border transition-colors ${
                      isMastered
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                        : "bg-[#E8E0D5]/5 text-[#E8E0D5]/40 border-[#E8E0D5]/10 hover:text-emerald-400"
                    }`}
                    title={isMastered ? "Mastered" : "Mark as Mastered"}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>

                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-black font-japanese text-[#FFFFFF]">
                        {item.pattern}
                      </span>
                      <span className="text-xs font-mono text-[#E8E0D5]/60">
                        [{item.reading}]
                      </span>
                    </div>
                    {/* Localized Meaning */}
                    <p className="text-xs text-[#E8E0D5]/90 mt-1 leading-relaxed">
                      {language === "ta" && item.meaningTa ? item.meaningTa : item.meaning}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      speakJapanese(item.exampleJp);
                    }}
                    className="p-2 rounded-xl bg-[#E8E0D5]/10 hover:bg-[#E8E0D5]/20 text-[#E8E0D5] transition-colors"
                    title={language === "ta" ? "மாதிரி வாக்கியத்தைக் கேட்கவும்" : language === "ja" ? "例文を聞く" : "Listen to Example Sentence"}
                  >
                    <Volume2 className="w-4 h-4 text-[#C83C50]" />
                  </button>
                  <ChevronDown
                    className={`w-4 h-4 text-[#E8E0D5]/50 transition-transform ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </div>

              {/* Collapsible Details: Formation & Example Sentences */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-1 border-t border-[#E8E0D5]/10 space-y-3">
                  {/* Grammatical Formation */}
                  {item.formation && (
                    <div className="p-3 rounded-xl bg-[#0B1323] border border-[#E8E0D5]/10 space-y-1 mt-3">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                        {language === "ta" ? "இலக்கண அமைப்பு (Formation · 接続)" : language === "ja" ? "接続方法 (Formation)" : "Grammatical Formation & Connection · 接続"}
                      </div>
                      <div className="text-xs font-mono font-bold text-[#FFFFFF]">
                        {item.formation}
                      </div>
                    </div>
                  )}

                  {/* Example Sentence Box */}
                  <div className="p-4 rounded-xl bg-[#0B1323] border border-[#E8E0D5]/10 space-y-2">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#C83C50] flex items-center justify-between">
                      <span>{language === "ta" ? "மாதிரி வாக்கியம் · 例文" : language === "ja" ? "例文 (Example Sentence)" : "Example Sentence · 例文"}</span>
                      <button
                        onClick={() => speakJapanese(item.exampleJp)}
                        className="text-xs text-[#C83C50] hover:underline flex items-center space-x-1"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>{language === "ta" ? "ஆடியோவை இயக்கு" : language === "ja" ? "音声を再生" : "Play Audio"}</span>
                      </button>
                    </div>
                    <div className="text-base font-medium font-japanese text-[#FFFFFF]">
                      {item.exampleJp}
                    </div>
                    <div className="text-xs text-[#E8E0D5]/70 italic">
                      &quot;{language === "ta" && item.exampleTa ? item.exampleTa : item.exampleEn}&quot;
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
