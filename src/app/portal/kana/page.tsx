"use client";

import React, { useState, useCallback } from "react";
import {
  BASIC_KANA,
  DAKUON_KANA,
  YOON_KANA,
  SMALL_KANA,
  GOJUON_ROWS,
  KanaItem,
  KanaCategory,
} from "@/data/kana";
import KanaStrokePlayer from "@/components/kana/KanaStrokePlayer";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { PenTool } from "lucide-react";

export default function JapaneseScriptPage() {
  const { t } = useLanguage();
  const [scriptType, setScriptType] = useState<"hira" | "kata">("hira");
  const [category, setCategory] = useState<KanaCategory>("basic");
  const [selectedKana, setSelectedKana] = useState<KanaItem>(BASIC_KANA[0]);

  // Audio Pronunciation using native browser speech synthesis with ja-JP
  const speakKana = useCallback((text: string) => {
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
  }, []);

  // Category switch with synchronized selection
  const handleCategorySwitch = (cat: KanaCategory) => {
    setCategory(cat);
    if (cat === "basic") {
      setSelectedKana(BASIC_KANA[0]);
      speakKana(scriptType === "hira" ? BASIC_KANA[0].hira : BASIC_KANA[0].kata);
    } else if (cat === "dakuon") {
      setSelectedKana(DAKUON_KANA[0]);
      speakKana(scriptType === "hira" ? DAKUON_KANA[0].hira : DAKUON_KANA[0].kata);
    } else if (cat === "yoon") {
      setSelectedKana(YOON_KANA[0]);
      speakKana(scriptType === "hira" ? YOON_KANA[0].hira : YOON_KANA[0].kata);
    } else if (cat === "small") {
      setSelectedKana(SMALL_KANA[0]);
      speakKana(scriptType === "hira" ? SMALL_KANA[0].hira : SMALL_KANA[0].kata);
    }
  };

  const activeChar = scriptType === "hira" ? selectedKana.hira : selectedKana.kata;
  const strokeCount = scriptType === "hira" ? selectedKana.strokes.hira : selectedKana.strokes.kata;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header with Japanese Script */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#C83C50]/20 text-[#C83C50] text-xs font-semibold mb-2 border border-[#C83C50]/30">
            <PenTool className="w-3.5 h-3.5" />
            <span>{t("script_badge")}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#FFFFFF]">
            {t("script_page_title")}
          </h1>
          <p className="text-xs text-[#E8E0D5]/70 mt-1 max-w-2xl leading-relaxed">
            {t("script_page_subtitle")}
          </p>
        </div>

        {/* Script Switcher (Hiragana / Katakana) */}
        <div className="flex items-center bg-[#101C35] p-1.5 rounded-2xl border border-[#E8E0D5]/20 shrink-0">
          <button
            onClick={() => {
              setScriptType("hira");
              speakKana(selectedKana.hira);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              scriptType === "hira"
                ? "bg-[#C83C50] text-[#FFFFFF] shadow-lg shadow-[#C83C50]/30"
                : "text-[#E8E0D5]/70 hover:text-[#FFFFFF]"
            }`}
          >
            {t("script_hiragana")}
          </button>
          <button
            onClick={() => {
              setScriptType("kata");
              speakKana(selectedKana.kata);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              scriptType === "kata"
                ? "bg-[#C83C50] text-[#FFFFFF] shadow-lg shadow-[#C83C50]/30"
                : "text-[#E8E0D5]/70 hover:text-[#FFFFFF]"
            }`}
          >
            {t("script_katakana")}
          </button>
        </div>
      </div>

      {/* Main Studio Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Stroke Animator & Canvas (5 cols) */}
        <div className="lg:col-span-5 lg:sticky lg:top-24">
          <KanaStrokePlayer
            char={activeChar}
            romaji={selectedKana.romaji}
            scriptType={scriptType}
            strokeCount={strokeCount}
            onAudioPlay={() => speakKana(activeChar)}
          />
        </div>

        {/* Right Column: Character Selection Tables (7 cols) */}
        <div className="lg:col-span-7 bg-[#101C35] border border-[#E8E0D5]/20 rounded-3xl p-6 sm:p-7 space-y-6 shadow-2xl">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E8E0D5]/15 pb-4">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => handleCategorySwitch("basic")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  category === "basic"
                    ? "bg-[#C83C50] text-[#FFFFFF] shadow"
                    : "text-[#E8E0D5]/70 hover:bg-[#E8E0D5]/10"
                }`}
              >
                {t("script_cat_basic")}
              </button>
              <button
                onClick={() => handleCategorySwitch("dakuon")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  category === "dakuon"
                    ? "bg-[#C83C50] text-[#FFFFFF] shadow"
                    : "text-[#E8E0D5]/70 hover:bg-[#E8E0D5]/10"
                }`}
              >
                {t("script_cat_dakuon")}
              </button>
              <button
                onClick={() => handleCategorySwitch("yoon")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  category === "yoon"
                    ? "bg-[#C83C50] text-[#FFFFFF] shadow"
                    : "text-[#E8E0D5]/70 hover:bg-[#E8E0D5]/10"
                }`}
              >
                {t("script_cat_yoon")}
              </button>
              <button
                onClick={() => handleCategorySwitch("small")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  category === "small"
                    ? "bg-[#C83C50] text-[#FFFFFF] shadow"
                    : "text-[#E8E0D5]/70 hover:bg-[#E8E0D5]/10"
                }`}
              >
                {t("script_cat_small")}
              </button>
            </div>

            <span className="text-xs text-[#E8E0D5]/50 hidden sm:inline">
              {t("script_select_prompt")}
            </span>
          </div>

          {/* 1. BASIC KANA (Canonical 5-column Gojuon Table) */}
          {category === "basic" && (
            <div className="space-y-4">
              <div className="grid grid-cols-5 gap-2 text-center text-[11px] font-bold text-[#E8E0D5]/60 pb-1 border-b border-[#E8E0D5]/10">
                <span>{t("col_a")}</span>
                <span>{t("col_i")}</span>
                <span>{t("col_u")}</span>
                <span>{t("col_e")}</span>
                <span>{t("col_o")}</span>
              </div>

              <div className="space-y-2">
                {GOJUON_ROWS.map((row) => (
                  <div key={row.key} className="grid grid-cols-5 gap-2">
                    {row.chars.map((charString, colIdx) => {
                      if (!charString) {
                        return (
                          <div
                            key={`empty-${row.key}-${colIdx}`}
                            className="p-3 rounded-2xl bg-[#0B1323]/30 border border-[#E8E0D5]/5 opacity-30"
                          />
                        );
                      }

                      const item = BASIC_KANA.find((k) => k.hira === charString);
                      if (!item) return null;

                      const char = scriptType === "hira" ? item.hira : item.kata;
                      const isSelected = selectedKana.id === item.id;

                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setSelectedKana(item);
                            speakKana(char);
                          }}
                          className={`p-3 rounded-2xl flex flex-col items-center justify-center transition-all ${
                            isSelected
                              ? "bg-[#C83C50] text-[#FFFFFF] shadow-lg shadow-[#C83C50]/30 scale-105 border border-[#FFFFFF]/40"
                              : "bg-[#0B1323] hover:bg-[#E8E0D5]/15 text-[#E8E0D5] border border-[#E8E0D5]/15"
                          }`}
                        >
                          <span className="text-2xl font-bold font-japanese leading-none mb-1">
                            {char}
                          </span>
                          <span className="text-[10px] font-mono opacity-70 leading-none">
                            {item.romaji}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. DAKUON / HANDAKUON (25 characters) */}
          {category === "dakuon" && (
            <div className="grid grid-cols-5 gap-2.5">
              {DAKUON_KANA.map((item) => {
                const char = scriptType === "hira" ? item.hira : item.kata;
                const isSelected = selectedKana.id === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedKana(item);
                      speakKana(char);
                    }}
                    className={`p-3.5 rounded-2xl flex flex-col items-center justify-center transition-all ${
                      isSelected
                        ? "bg-[#C83C50] text-[#FFFFFF] shadow-lg shadow-[#C83C50]/30 scale-105 border border-[#FFFFFF]/40"
                        : "bg-[#0B1323] hover:bg-[#E8E0D5]/15 text-[#E8E0D5] border border-[#E8E0D5]/15"
                    }`}
                  >
                    <span className="text-2xl font-bold font-japanese leading-none mb-1">
                      {char}
                    </span>
                    <span className="text-[10px] font-mono opacity-70 leading-none">
                      {item.romaji}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* 3. YOON / CONTRACTED SOUNDS (36 combinations) */}
          {category === "yoon" && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {YOON_KANA.map((item) => {
                const char = scriptType === "hira" ? item.hira : item.kata;
                const isSelected = selectedKana.id === item.id;
                const itemStrokes = scriptType === "hira" ? item.strokes.hira : item.strokes.kata;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedKana(item);
                      speakKana(char);
                    }}
                    className={`p-3 rounded-2xl flex flex-col items-center justify-center transition-all ${
                      isSelected
                        ? "bg-[#C83C50] text-[#FFFFFF] shadow-lg shadow-[#C83C50]/30 scale-105 border border-[#FFFFFF]/40"
                        : "bg-[#0B1323] hover:bg-[#E8E0D5]/15 text-[#E8E0D5] border border-[#E8E0D5]/15"
                    }`}
                  >
                    <span className="text-2xl font-bold font-japanese leading-none mb-1 tracking-wider">
                      {char}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-[#E8E0D5] leading-none mb-1">
                      {item.romaji}
                    </span>
                    <span className="text-[9px] font-mono opacity-60 leading-none">
                      {itemStrokes} {t("script_strokes_unit")}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* 4. SMALL KANA (9 characters) */}
          {category === "small" && (
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {SMALL_KANA.map((item) => {
                const char = scriptType === "hira" ? item.hira : item.kata;
                const isSelected = selectedKana.id === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedKana(item);
                      speakKana(char);
                    }}
                    className={`p-3.5 rounded-2xl flex flex-col items-center justify-center transition-all ${
                      isSelected
                        ? "bg-[#C83C50] text-[#FFFFFF] shadow-lg shadow-[#C83C50]/30 scale-105 border border-[#FFFFFF]/40"
                        : "bg-[#0B1323] hover:bg-[#E8E0D5]/15 text-[#E8E0D5] border border-[#E8E0D5]/15"
                    }`}
                  >
                    <span className="text-2xl font-bold font-japanese leading-none mb-1">
                      {char}
                    </span>
                    <span className="text-[10px] font-mono opacity-70 leading-none">
                      {item.romaji}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
