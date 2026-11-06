"use client";

import React, { useState, useMemo } from "react";
import { getGrammarForLevel, GrammarItem } from "@/data/grammar";
import {
  BookMarked,
  Search,
  Volume2,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  Info,
} from "lucide-react";

const LEVELS = ["N5", "N4", "N3", "N2", "N1"];

const LEVEL_DESCRIPTIONS: Record<string, string> = {
  N5: "Foundational Japanese sentence structures, copulas (です), core particles (は, を, に, で, へ, と), polite verbs, and requests.",
  N4: "Expressing obligations, permissions, simultaneous actions (〜ながら), reasons, and past experiences.",
  N3: "Intermediate bridge: decisions (ことにする), habits, expectations (はずだ), causations, and contrasting aspects.",
  N2: "Upper-intermediate nuances: inevitable outcomes (かねない), limits, perspectives, and formal discourse.",
  N1: "Advanced literary expressions: emotional restraints, unique conditions, literary purposes, and abstract relationships.",
};

export default function GrammarDecksPage() {
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
        (item.meaningTa && item.meaningTa.toLowerCase().includes(q)) ||
        (item.formation && item.formation.toLowerCase().includes(q))
    );
  }, [items, searchQuery]);

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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#C83C50]/20 text-[#C83C50] text-xs font-semibold mb-2 border border-[#C83C50]/30">
            <BookMarked className="w-3.5 h-3.5" />
            <span>JLPT Grammar Decks · 文法マスター</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#FFFFFF]">
            Structured Grammar Mastery & Patterns
          </h1>
          <p className="text-xs text-[#E8E0D5]/70 mt-1">
            Browse authentic grammar rules from JLPT N5 to N1 with grammatical formations, Tamil explanations, and audio examples.
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
              {filteredItems.length} Patterns in Deck
            </span>
          </div>
          <p className="text-xs text-[#E8E0D5]/70">
            {LEVEL_DESCRIPTIONS[activeLevel]}
          </p>
          <p className="text-[11px] text-[#E8E0D5]/50 flex items-center gap-1.5 pt-0.5">
            <Info className="w-3.5 h-3.5 shrink-0 text-[#C83C50]" />
            <span>
              Curricular Reference Target (Estimate): Curricula organized based on standard Japanese language education benchmarks.
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
            placeholder="Search pattern, English, or தமிழ்..."
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
                    title={isMastered ? "Marked as Mastered" : "Mark as Mastered"}
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
                    <p className="text-xs text-[#E8E0D5]/90 mt-1 leading-relaxed">
                      {item.meaning}
                    </p>
                    {item.meaningTa && (
                      <p className="text-xs text-[#C83C50] font-medium mt-0.5">
                        தமிழ்: {item.meaningTa}
                      </p>
                    )}
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
                    title="Listen to Example Sentence"
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
                        Grammatical Formation & Connection · 接続
                      </div>
                      <div className="text-xs font-mono font-bold text-[#FFFFFF]">
                        {item.formation}
                      </div>
                    </div>
                  )}

                  {/* Example Sentence Box */}
                  <div className="p-4 rounded-xl bg-[#0B1323] border border-[#E8E0D5]/10 space-y-2">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#C83C50] flex items-center justify-between">
                      <span>Example Sentence · 例文</span>
                      <button
                        onClick={() => speakJapanese(item.exampleJp)}
                        className="text-xs text-[#C83C50] hover:underline flex items-center space-x-1"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Play Audio</span>
                      </button>
                    </div>
                    <div className="text-base font-medium font-japanese text-[#FFFFFF]">
                      {item.exampleJp}
                    </div>
                    <div className="text-xs text-[#E8E0D5]/70 italic">
                      &quot;{item.exampleEn}&quot;
                    </div>
                    {item.exampleTa && (
                      <div className="text-xs text-[#C83C50]/90 font-medium">
                        தமிழ்: {item.exampleTa}
                      </div>
                    )}
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
