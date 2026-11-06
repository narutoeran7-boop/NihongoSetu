"use client";

import React, { useState, useMemo } from "react";
import {
  CORE_VOCABULARY,
  MultilingualVocabWord,
  VOCAB_TARGET_COUNTS,
  getModularVocabForLevel,
  getModularVocabByWord,
  vocabularyEntryToMultilingualWord,
} from "@/data/vocab";
import { getStudentProfile, toggleLearnedVocab } from "@/lib/storage/studentState";
import {
  Layers,
  Search,
  Volume2,
  CheckCircle2,
  Globe,
  Eye,
  EyeOff,
  Sparkles,
  Info,
} from "lucide-react";
import { LANGUAGES } from "@/components/public/Navbar";

const LEVELS = ["N5", "N4", "N3", "N2", "N1"];

const CATEGORIES = [
  "All",
  "Basics",
  "People",
  "Places",
  "Food & drink",
  "Animals",
  "Things",
  "Verbs",
  "Adjectives",
  "Expressions",
];

export default function VocabularyVaultPage() {
  const [activeLevel, setActiveLevel] = useState("N5");
  const [selectedLang, setSelectedLang] = useState(() => getStudentProfile().nativeLanguage || "en");
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showRomaji, setShowRomaji] = useState(true);
  const [learnedTerms, setLearnedTerms] = useState<string[]>(() => getStudentProfile().learnedVocab || []);

  const activeVocabList: MultilingualVocabWord[] = useMemo(() => {
    if (activeLevel === "N5") {
      const modularN5 = getModularVocabForLevel("N5");
      if (modularN5 && modularN5.length > 0) {
        return modularN5.map(vocabularyEntryToMultilingualWord);
      }
      return CORE_VOCABULARY;
    }
    const modularLevel = getModularVocabForLevel(activeLevel as "N4" | "N3" | "N2" | "N1");
    if (modularLevel && modularLevel.length > 0) {
      return modularLevel.map(vocabularyEntryToMultilingualWord);
    }
    return [];
  }, [activeLevel]);

  const handleToggleLearned = (term: string) => {
    toggleLearnedVocab(term);
    setLearnedTerms((prev) =>
      prev.includes(term) ? prev.filter((t) => t !== term) : [...prev, term]
    );
  };

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

  const filteredVocab = useMemo(() => {
    return activeVocabList.filter((item) => {
      const matchesCategory =
        activeCategory === "All" || item.category === activeCategory;
      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const nativeMeaning = (item.meaning[selectedLang] || item.meaning.en || "").toLowerCase();
      const enMeaning = (item.meaning.en || "").toLowerCase();
      const taMeaning = (item.meaning.ta || "").toLowerCase();

      return (
        item.kanji.toLowerCase().includes(q) ||
        item.reading.toLowerCase().includes(q) ||
        item.romaji.toLowerCase().includes(q) ||
        nativeMeaning.includes(q) ||
        enMeaning.includes(q) ||
        taMeaning.includes(q)
      );
    });
  }, [activeVocabList, activeCategory, searchQuery, selectedLang]);

  const targetCount = (VOCAB_TARGET_COUNTS as Record<string, number>)[activeLevel] || 800;
  const currentLearnedInDeck = activeVocabList.filter(
    (item) => learnedTerms.includes(item.kanji) || learnedTerms.includes(item.reading)
  ).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#C83C50]/20 text-[#C83C50] text-xs font-semibold mb-2 border border-[#C83C50]/30">
            <Layers className="w-3.5 h-3.5" />
            <span>12-Language Vocabulary Vault · 単語帳</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#FFFFFF]">
            JLPT Vocabulary Vault & Translations
          </h1>
          <p className="text-xs text-[#E8E0D5]/70 mt-1">
            Browse core Japanese vocabulary with verified definitions translated into Tamil and 12 world languages.
          </p>
        </div>

        {/* Level Switcher */}
        <div className="flex items-center bg-[#101C35] p-1 rounded-xl border border-[#E8E0D5]/20 shrink-0">
          {LEVELS.map((lvl) => (
            <button
              key={lvl}
              onClick={() => {
                setActiveLevel(lvl);
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

      {/* Progress, Disclaimer & Controls */}
      <div className="bg-[#101C35] border border-[#E8E0D5]/20 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
        <div className="space-y-2 flex-1 max-w-xl">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#FFFFFF]">
              JLPT {activeLevel} Vocabulary Progress:
            </span>
            <span className="text-[#E8E0D5]/70">
              {currentLearnedInDeck} / {activeVocabList.length} in Deck (Curricular Reference Target: {targetCount})
            </span>
          </div>
          <div className="w-full bg-[#E8E0D5]/10 h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#C83C50] h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, Math.round((currentLearnedInDeck / (activeVocabList.length || 1)) * 100))}%`,
              }}
            />
          </div>
          <p className="text-[11px] text-[#E8E0D5]/50 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 shrink-0 text-[#C83C50]" />
            <span>
              Curricular Reference Target (Estimate): Post-2010 JLPT does not publish fixed lists. Canonical N5 dataset verified against JMdict & Minna no Nihongo standards.
            </span>
          </p>
        </div>

        {/* Translation Language Selector */}
        <div className="flex items-center space-x-2 bg-[#0B1323] p-2.5 rounded-xl border border-[#E8E0D5]/20 shrink-0">
          <Globe className="w-4 h-4 text-[#C83C50]" />
          <span className="text-xs text-[#E8E0D5]/70 font-medium">Definition Lang:</span>
          <select
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value)}
            className="bg-[#101C35] border border-[#E8E0D5]/25 rounded-lg px-2.5 py-1 text-xs text-[#FFFFFF] focus:outline-none focus:border-[#C83C50]"
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code} className="bg-[#101C35] text-[#FFFFFF]">
                {l.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Control Bar: Search & Romaji Toggle */}
      <div className="bg-[#101C35] border border-[#E8E0D5]/20 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#E8E0D5]/50" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search word, kana, English, or தமிழ்..."
            className="w-full bg-[#101C35] border border-[#E8E0D5]/25 rounded-xl pl-10 pr-4 py-2 text-xs text-[#FFFFFF] placeholder-[#E8E0D5]/40 focus:outline-none focus:border-[#C83C50]"
          />
        </div>

        {/* Romaji toggle & Stats */}
        <div className="flex items-center space-x-4 w-full md:w-auto justify-between md:justify-end">
          <button
            onClick={() => setShowRomaji(!showRomaji)}
            className="px-3 py-1.5 rounded-xl text-xs bg-[#E8E0D5]/10 hover:bg-[#E8E0D5]/20 text-[#E8E0D5] flex items-center space-x-1.5 transition-colors"
          >
            {showRomaji ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{showRomaji ? "Hide Romaji" : "Show Romaji"}</span>
          </button>

          <div className="text-xs text-[#E8E0D5]/70">
            Mastered: <span className="font-bold text-[#FFFFFF]">{currentLearnedInDeck}</span> / {activeVocabList.length}
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeCategory === cat
                ? "bg-[#C83C50] text-[#FFFFFF] shadow-md shadow-[#C83C50]/20"
                : "bg-[#101C35] border border-[#E8E0D5]/15 text-[#E8E0D5]/70 hover:text-[#FFFFFF] hover:border-[#E8E0D5]/30"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Staged Level Notice */}
      {activeVocabList.length === 0 && (
        <div className="p-12 text-center bg-[#101C35] border border-[#E8E0D5]/15 rounded-3xl space-y-3">
          <Sparkles className="w-8 h-8 text-[#C83C50] mx-auto" />
          <h3 className="text-lg font-bold text-[#FFFFFF]">JLPT {activeLevel} Curriculum Staged</h3>
          <p className="text-xs text-[#E8E0D5]/70 max-w-md mx-auto">
            JLPT {activeLevel} curriculum is staged in the modular content architecture. Switch to N5 to explore the complete canonical dataset.
          </p>
          <button
            onClick={() => setActiveLevel("N5")}
            className="mt-3 px-4 py-2 rounded-xl bg-[#C83C50] text-[#FFFFFF] text-xs font-bold shadow-md hover:bg-[#A8283B] transition-colors"
          >
            Return to N5 Vocabulary Deck
          </button>
        </div>
      )}

      {/* Vocabulary Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVocab.map((item, idx) => {
          const isLearned = learnedTerms.includes(item.kanji) || learnedTerms.includes(item.reading);
          const localizedMeaning = item.meaning[selectedLang] || item.meaning.en;
          const rich = getModularVocabByWord(item.kanji);

          return (
            <div
              key={`${item.kanji}-${idx}`}
              className={`rounded-2xl border p-5 transition-all space-y-4 shadow-lg ${
                isLearned
                  ? "bg-[#101C35] border-emerald-500/40"
                  : "bg-[#101C35] border-[#E8E0D5]/15 hover:border-[#E8E0D5]/30"
              }`}
            >
              {/* Top Row: Word, Reading, Actions */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-black font-japanese text-[#FFFFFF]">
                      {item.kanji}
                    </span>
                    <span className="text-sm font-japanese text-[#E8E0D5]/70">
                      {item.reading}
                    </span>
                  </div>
                  {showRomaji && (
                    <div className="text-xs font-mono text-[#E8E0D5]/50 mt-0.5">
                      {item.romaji}
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => speakJapanese(item.reading)}
                    className="p-2 rounded-xl bg-[#E8E0D5]/10 hover:bg-[#E8E0D5]/20 text-[#C83C50] transition-colors"
                    title="Pronounce Word"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleToggleLearned(item.kanji)}
                    className={`p-2 rounded-xl border transition-colors ${
                      isLearned
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                        : "bg-[#E8E0D5]/5 text-[#E8E0D5]/30 border-[#E8E0D5]/10 hover:text-emerald-400"
                    }`}
                    title={isLearned ? "Mastered" : "Mark as Mastered"}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Translation Badge & Tamil Gloss */}
              <div className="pt-1 space-y-1">
                <div className="text-sm font-bold text-[#FFFFFF]">
                  {localizedMeaning}
                </div>
                {selectedLang !== "en" && item.meaning.en && (
                  <div className="text-xs text-[#E8E0D5]/60">
                    English: {item.meaning.en}
                  </div>
                )}
                {item.meaning.ta && (
                  <div className="text-xs text-[#C83C50] font-medium">
                    தமிழ்: {item.meaning.ta}
                  </div>
                )}
              </div>

              {/* Example Sentence Box */}
              <div className="p-3 rounded-xl bg-[#0B1323] border border-[#E8E0D5]/10 space-y-1">
                <div className="flex items-center justify-between text-xs font-japanese text-[#FFFFFF]">
                  <span>{item.exampleJa}</span>
                  <button
                    onClick={() => speakJapanese(item.exampleJa)}
                    className="text-[#C83C50] hover:opacity-80 p-0.5"
                    title="Listen to Sentence"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="text-[11px] text-[#E8E0D5]/60 italic">
                  &quot;{item.exampleEn}&quot;
                </div>
                {rich?.examples[0]?.ta && (
                  <div className="text-[10px] text-[#E8E0D5]/50">
                    {rich.examples[0].ta}
                  </div>
                )}
              </div>

              {/* Category pill & Part of Speech */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E8E0D5]/10 text-[#E8E0D5]/70 border border-[#E8E0D5]/15">
                    {item.category}
                  </span>
                  {rich?.partOfSpeech && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#C83C50]/15 text-[#C83C50] border border-[#C83C50]/20 font-medium">
                      {rich.partOfSpeech.replace("_", " ")}
                    </span>
                  )}
                </div>
                {isLearned && (
                  <span className="text-[10px] font-bold text-emerald-400 flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Mastered</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
