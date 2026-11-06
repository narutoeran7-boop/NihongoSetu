"use client";

import React, { useState, useMemo } from "react";
import {
  getKanjiForLevel,
  KANJI_TARGET_COUNTS,
  getModularKanjiByChar,
} from "@/data/kanji";
import { getStudentProfile, toggleLearnedKanji } from "@/lib/storage/studentState";
import KanjiStrokePlayer from "@/components/kanji/KanjiStrokePlayer";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import {
  Sparkles,
  Search,
  Volume2,
  CheckCircle2,
  Info,
  PenTool,
  BookOpen,
} from "lucide-react";

const LEVELS = ["N5", "N4", "N3", "N2", "N1"];

export default function KanjiVaultPage() {
  const { language, t } = useLanguage();
  const [activeLevel, setActiveLevel] = useState("N5");
  const [searchQuery, setSearchQuery] = useState("");
  const [learnedKanji, setLearnedKanji] = useState<string[]>(() => getStudentProfile().learnedKanji || []);
  const [activeViewTab, setActiveViewTab] = useState<"details" | "strokes">("details");

  const kanjiList = useMemo(() => {
    return getKanjiForLevel(activeLevel);
  }, [activeLevel]);

  const [selectedKanjiChar, setSelectedKanjiChar] = useState<string | null>(null);

  const selectedKanji = useMemo(() => {
    if (selectedKanjiChar) {
      const found = kanjiList.find((k) => k.character === selectedKanjiChar);
      if (found) return found;
    }
    return kanjiList[0] || null;
  }, [kanjiList, selectedKanjiChar]);

  const richEntry = useMemo(() => {
    if (!selectedKanji) return null;
    return getModularKanjiByChar(selectedKanji.character) || null;
  }, [selectedKanji]);

  const filteredKanji = useMemo(() => {
    if (!searchQuery.trim()) return kanjiList;
    const q = searchQuery.toLowerCase();
    return kanjiList.filter((item) => {
      const rich = getModularKanjiByChar(item.character);
      const matchesTamil = rich?.meaningTa ? rich.meaningTa.toLowerCase().includes(q) : false;
      return (
        item.character.includes(q) ||
        item.onyomi.toLowerCase().includes(q) ||
        item.kunyomi.toLowerCase().includes(q) ||
        item.meanings.toLowerCase().includes(q) ||
        item.examples.toLowerCase().includes(q) ||
        matchesTamil
      );
    });
  }, [kanjiList, searchQuery]);

  const handleToggleLearned = (char: string) => {
    toggleLearnedKanji(char);
    setLearnedKanji((prev) =>
      prev.includes(char) ? prev.filter((k) => k !== char) : [...prev, char]
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

  const targetCount = (KANJI_TARGET_COUNTS as Record<string, number>)[activeLevel] || 103;
  const currentLearnedInDeck = kanjiList.filter((k) => learnedKanji.includes(k.character)).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#C83C50]/20 text-[#C83C50] text-xs font-semibold mb-2 border border-[#C83C50]/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t("nav_kanji")}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#FFFFFF]">
            {language === "ta"
              ? "JLPT காஞ்சி ஆய்வகமும் எழுதும் முறையும்"
              : language === "ja"
              ? "JLPT漢字エクスプローラー・筆順アニメーション"
              : "JLPT Kanji Explorer & Stroke Animator"}
          </h1>
          <p className="text-xs text-[#E8E0D5]/70 mt-1">
            {language === "ta"
              ? "ஆன்'யோமி, குன்'யோமி வாசிப்புகள், கோட்டு அசைவூட்டம், வேர்கள் மற்றும் விரிவான தமிழ்ப் பொருள்."
              : language === "ja"
              ? "音読み・訓読み、画数、部首、SVG筆順アニメーションで漢字を視覚的に習得。"
              : "Authentic On'yomi, Kun'yomi readings, stroke-order animations, radicals, and comprehensive vocabulary."}
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
                setSelectedKanjiChar(null);
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

      {/* Level Target Progress, Disclaimer & Search */}
      <div className="bg-[#101C35] border border-[#E8E0D5]/20 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
        <div className="space-y-2 flex-1 max-w-xl">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#FFFFFF]">
              JLPT {activeLevel} Mastery Progress:
            </span>
            <span className="text-[#E8E0D5]/70">
              {currentLearnedInDeck} / {kanjiList.length} in Deck (Curricular Reference Target: {targetCount})
            </span>
          </div>
          <div className="w-full bg-[#E8E0D5]/10 h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#C83C50] h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, Math.round((currentLearnedInDeck / (kanjiList.length || 1)) * 100))}%`,
              }}
            />
          </div>
          <p className="text-[11px] text-[#E8E0D5]/50 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 shrink-0 text-[#C83C50]" />
            <span>
              Curricular Reference Target (Estimate): Post-2010 JLPT does not publish fixed lists. Canonical N5 dataset verified against MEXT Elementary Kyōiku Grade 1–2 standards.
            </span>
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#E8E0D5]/50" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              language === "ta"
                ? "காஞ்சி, வாசிப்பு அல்லது தமிழ்ப் பொருளைத் தேடு..."
                : language === "ja"
                ? "漢字、読み、または意味を検索..."
                : "Search kanji, reading, or English meaning..."
            }
            className="w-full bg-[#101C35] border border-[#E8E0D5]/25 rounded-xl pl-10 pr-4 py-2 text-xs text-[#FFFFFF] placeholder-[#E8E0D5]/40 focus:outline-none focus:border-[#C83C50]"
          />
        </div>
      </div>

      {/* Main Two-Column View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Kanji Grid Selector (7 cols) */}
        <div className="lg:col-span-7 bg-[#101C35] border border-[#E8E0D5]/20 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between text-xs text-[#E8E0D5]/70 pb-2 border-b border-[#E8E0D5]/10">
            <span>Showing {filteredKanji.length} Kanji Characters</span>
            <span className="text-[#C83C50] font-medium">Click character to view details & stroke order</span>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3 max-h-[600px] overflow-y-auto pr-1">
            {filteredKanji.map((item, idx) => {
              const isSelected = selectedKanji?.character === item.character;
              const isLearned = learnedKanji.includes(item.character);
              const rich = getModularKanjiByChar(item.character);

              return (
                <button
                  key={`${item.character}-${idx}`}
                  onClick={() => {
                    setSelectedKanjiChar(item.character);
                    speakJapanese(item.character);
                  }}
                  className={`p-3 rounded-2xl flex flex-col items-center justify-center transition-all relative ${
                    isSelected
                      ? "bg-[#C83C50] text-[#FFFFFF] shadow-lg shadow-[#C83C50]/30 scale-105 border border-[#FFFFFF]/40"
                      : isLearned
                      ? "bg-[#101C35] text-[#FFFFFF] border-2 border-emerald-500/50"
                      : "bg-[#E8E0D5]/5 hover:bg-[#E8E0D5]/15 text-[#E8E0D5] border border-[#E8E0D5]/10"
                  }`}
                >
                  {isLearned && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400" />
                  )}
                  <span className="text-3xl font-bold font-japanese mb-1">
                    {item.character}
                  </span>
                  <span className="text-[10px] truncate max-w-full opacity-70">
                    {language === "ta" && rich?.meaningTa ? rich.meaningTa.split("/")[0] : item.meanings.split(";")[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Kanji Deep-Dive Card (5 cols) */}
        <div className="lg:col-span-5 bg-[#101C35] border border-[#E8E0D5]/20 rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl sticky top-24">
          {selectedKanji ? (
            <>
              {/* Kanji Hero Showcase */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 rounded-2xl bg-[#0B1323] border border-[#E8E0D5]/20 flex items-center justify-center font-japanese text-5xl font-extrabold text-[#FFFFFF] shadow-inner">
                    {selectedKanji.character}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-black text-[#FFFFFF]">
                        {selectedKanji.meanings}
                      </span>
                    </div>
                    <div className="text-xs text-[#E8E0D5]/60 mt-1 flex items-center gap-2">
                      <span>JLPT: <strong className="text-[#C83C50]">{activeLevel}</strong></span>
                      {richEntry?.strokeCount && (
                        <span>· 画数: <strong className="text-[#FFFFFF]">{richEntry.strokeCount}画</strong></span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => speakJapanese(selectedKanji.character)}
                    className="p-2.5 rounded-xl bg-[#C83C50]/20 hover:bg-[#C83C50]/30 text-[#C83C50] transition-colors"
                    title="Pronounce Character"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => handleToggleLearned(selectedKanji.character)}
                    className={`p-2.5 rounded-xl border transition-colors ${
                      learnedKanji.includes(selectedKanji.character)
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                        : "bg-[#E8E0D5]/10 text-[#E8E0D5]/40 border-[#E8E0D5]/20 hover:text-emerald-400"
                    }`}
                    title={learnedKanji.includes(selectedKanji.character) ? "Mastered" : "Mark as Mastered"}
                  >
                    <CheckCircle2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Tamil Meaning Badge — Only when Tamil is the selected language */}
              {language === "ta" && richEntry?.meaningTa && (
                <div className="p-3 rounded-xl bg-[#C83C50]/10 border border-[#C83C50]/25 flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#E8E0D5]/80">தமிழ்ப் பொருள்:</span>
                  <span className="font-bold text-[#FFFFFF] text-sm">{richEntry.meaningTa}</span>
                </div>
              )}

              {/* Badges: Radicals & Metadata */}
              <div className="flex flex-wrap gap-2 text-[11px]">
                {richEntry?.radical && (
                  <span className="px-2.5 py-1 rounded-lg bg-[#E8E0D5]/10 text-[#E8E0D5] border border-[#E8E0D5]/15 font-medium">
                    部首 (Radical): <strong className="text-[#FFFFFF]">{richEntry.radical.character}</strong> ({richEntry.radical.nameJa} · {richEntry.radical.nameEn})
                  </span>
                )}
                {richEntry?.grade && (
                  <span className="px-2.5 py-1 rounded-lg bg-[#E8E0D5]/10 text-[#E8E0D5] border border-[#E8E0D5]/15 font-medium">
                    学年: <strong className="text-[#FFFFFF]">小学{richEntry.grade}年</strong>
                  </span>
                )}
              </div>

              {/* View Switcher: Details vs Stroke Order Animator */}
              <div className="flex items-center bg-[#0B1323] p-1 rounded-xl border border-[#E8E0D5]/15">
                <button
                  onClick={() => setActiveViewTab("details")}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    activeViewTab === "details"
                      ? "bg-[#C83C50] text-[#FFFFFF] shadow-sm"
                      : "text-[#E8E0D5]/70 hover:text-[#FFFFFF]"
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Readings & Compounds</span>
                </button>
                <button
                  onClick={() => setActiveViewTab("strokes")}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    activeViewTab === "strokes"
                      ? "bg-[#C83C50] text-[#FFFFFF] shadow-sm"
                      : "text-[#E8E0D5]/70 hover:text-[#FFFFFF]"
                  }`}
                >
                  <PenTool className="w-3.5 h-3.5" />
                  <span>Stroke Animator (書き順)</span>
                </button>
              </div>

              {activeViewTab === "strokes" ? (
                /* Stroke Order Player & Practice Canvas */
                <div className="pt-1">
                  <KanjiStrokePlayer
                    character={selectedKanji.character}
                    strokeCount={richEntry?.strokeCount || 4}
                    radical={richEntry?.radical.character}
                    radicalName={richEntry ? `${richEntry.radical.nameJa} (${richEntry.radical.nameEn})` : undefined}
                    onAudioPlay={() => speakJapanese(selectedKanji.character)}
                  />
                </div>
              ) : (
                /* Readings & Compounds View */
                <div className="space-y-3">
                  {/* Kun'yomi */}
                  <div className="p-3.5 rounded-xl bg-[#0B1323] border border-[#E8E0D5]/10 space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#C83C50]">
                      <span>訓読み · Kun&apos;yomi (Japanese Native)</span>
                      {selectedKanji.kunyomi && selectedKanji.kunyomi !== "—" && (
                        <button
                          onClick={() => speakJapanese(selectedKanji.kunyomi)}
                          className="hover:underline flex items-center gap-1 text-[#E8E0D5]/60 hover:text-[#C83C50]"
                        >
                          <Volume2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    <div className="text-sm font-semibold font-japanese text-[#FFFFFF]">
                      {selectedKanji.kunyomi || "—"}
                    </div>
                  </div>

                  {/* On'yomi */}
                  <div className="p-3.5 rounded-xl bg-[#0B1323] border border-[#E8E0D5]/10 space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-blue-400">
                      <span>音読み · On&apos;yomi (Sino-Japanese)</span>
                      {selectedKanji.onyomi && selectedKanji.onyomi !== "—" && (
                        <button
                          onClick={() => speakJapanese(selectedKanji.onyomi)}
                          className="hover:underline flex items-center gap-1 text-[#E8E0D5]/60 hover:text-blue-400"
                        >
                          <Volume2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    <div className="text-sm font-semibold font-japanese text-[#FFFFFF]">
                      {selectedKanji.onyomi || "—"}
                    </div>
                  </div>

                  {/* Compounds & Real Word Examples */}
                  <div className="p-4 rounded-xl bg-[#0B1323] border border-[#E8E0D5]/10 space-y-2">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#E8E0D5]/70 flex items-center justify-between">
                      <span>Compounds & Word Examples · 熟語</span>
                      <button
                        onClick={() => speakJapanese(selectedKanji.examples)}
                        className="text-xs text-[#C83C50] hover:underline flex items-center gap-1"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>Listen</span>
                      </button>
                    </div>

                    {richEntry && richEntry.compounds.length > 0 ? (
                      <div className="space-y-2 pt-1">
                        {richEntry.compounds.map((comp, cIdx) => (
                          <div
                            key={cIdx}
                            className="p-2.5 rounded-lg bg-[#101C35]/60 border border-[#E8E0D5]/10 flex items-center justify-between text-xs"
                          >
                            <div>
                              <span className="font-bold font-japanese text-[#FFFFFF] text-sm mr-2">
                                {comp.word}
                              </span>
                              <span className="text-[#E8E0D5]/70 text-xs mr-2">
                                ({comp.reading})
                              </span>
                              <span className="text-[#E8E0D5]/90">
                                {comp.meaningEn}
                              </span>
                            </div>
                            {language === "ta" && comp.meaningTa && (
                              <span className="text-[10px] text-[#C83C50] font-medium ml-2 shrink-0">
                                {comp.meaningTa}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm font-medium font-japanese text-[#FFFFFF] leading-relaxed">
                        {selectedKanji.examples}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Status indicator */}
              <div className="pt-2 flex items-center justify-between text-xs text-[#E8E0D5]/60 border-t border-[#E8E0D5]/10">
                <span>
                  Status:{" "}
                  <strong className={learnedKanji.includes(selectedKanji.character) ? "text-emerald-400" : "text-[#E8E0D5]"}>
                    {learnedKanji.includes(selectedKanji.character) ? "Mastered" : "In Progress"}
                  </strong>
                </span>
                <button
                  onClick={() => handleToggleLearned(selectedKanji.character)}
                  className="text-xs font-semibold text-[#C83C50] hover:underline"
                >
                  {learnedKanji.includes(selectedKanji.character) ? "Remove Mastered" : "Mark Mastered"}
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-16 text-xs text-[#E8E0D5]/50">
              Select a Kanji character from the grid to inspect details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
