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
import { PenTool, Volume2 } from "lucide-react";

export default function KanaStudioPage() {
  const [scriptType, setScriptType] = useState<"hira" | "kata">("hira");
  const [category, setCategory] = useState<KanaCategory>("basic");
  const [selectedKana, setSelectedKana] = useState<KanaItem>(BASIC_KANA[0]);

  // Audio Pronunciation using native browser speech synthesis
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

  const activeChar = scriptType === "hira" ? selectedKana.hira : selectedKana.kata;
  const strokeCount = scriptType === "hira" ? selectedKana.strokes.hira : selectedKana.strokes.kata;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header with Japanese Script */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#C83C50]/20 text-[#C83C50] text-xs font-semibold mb-2 border border-[#C83C50]/30">
            <PenTool className="w-3.5 h-3.5" />
            <span>かな練習 · Kana Studio</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#FFFFFF]">
            日本語のかなと正しい書き順
          </h1>
          <p className="text-xs text-[#E8E0D5]/70 mt-1">
            ひらがな・カタカナの発音、ローマ字、正しい書き順と画数を学び、キャンバスで練習しましょう。
          </p>
        </div>

        {/* Script Switcher (ひらがな / カタカナ) */}
        <div className="flex items-center bg-[#101C35] p-1.5 rounded-2xl border border-[#E8E0D5]/20 shrink-0">
          <button
            onClick={() => setScriptType("hira")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              scriptType === "hira"
                ? "bg-[#C83C50] text-[#FFFFFF] shadow-lg shadow-[#C83C50]/30"
                : "text-[#E8E0D5]/70 hover:text-[#FFFFFF]"
            }`}
          >
            ひらがな (Hiragana)
          </button>
          <button
            onClick={() => setScriptType("kata")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              scriptType === "kata"
                ? "bg-[#C83C50] text-[#FFFFFF] shadow-lg shadow-[#C83C50]/30"
                : "text-[#E8E0D5]/70 hover:text-[#FFFFFF]"
            }`}
          >
            カタカナ (Katakana)
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
          {/* Category Tabs in Authentic Japanese */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E8E0D5]/15 pb-4">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => setCategory("basic")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  category === "basic"
                    ? "bg-[#C83C50] text-[#FFFFFF] shadow"
                    : "text-[#E8E0D5]/70 hover:bg-[#E8E0D5]/10"
                }`}
              >
                基本 (46)
              </button>
              <button
                onClick={() => setCategory("dakuon")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  category === "dakuon"
                    ? "bg-[#C83C50] text-[#FFFFFF] shadow"
                    : "text-[#E8E0D5]/70 hover:bg-[#E8E0D5]/10"
                }`}
              >
                濁音・半濁音 (25)
              </button>
              <button
                onClick={() => setCategory("yoon")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  category === "yoon"
                    ? "bg-[#C83C50] text-[#FFFFFF] shadow"
                    : "text-[#E8E0D5]/70 hover:bg-[#E8E0D5]/10"
                }`}
              >
                拗音 (33)
              </button>
              <button
                onClick={() => setCategory("small")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  category === "small"
                    ? "bg-[#C83C50] text-[#FFFFFF] shadow"
                    : "text-[#E8E0D5]/70 hover:bg-[#E8E0D5]/10"
                }`}
              >
                小さいかな (9)
              </button>
            </div>

            <span className="text-xs text-[#E8E0D5]/50 hidden sm:inline">
              文字を選んで練習しましょう
            </span>
          </div>

          {/* 1. BASIC KANA (Canonical 5-column Gojuon Table) */}
          {category === "basic" && (
            <div className="space-y-4">
              <div className="grid grid-cols-5 gap-2 text-center text-[11px] font-bold text-[#E8E0D5]/60 pb-1 border-b border-[#E8E0D5]/10">
                <span>あ段 (a)</span>
                <span>い段 (i)</span>
                <span>う段 (u)</span>
                <span>え段 (e)</span>
                <span>お段 (o)</span>
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

          {/* 3. YOON / CONTRACTED SOUNDS (33 characters) */}
          {category === "yoon" && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {YOON_KANA.map((item) => {
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
                    <span className="text-2xl font-bold font-japanese leading-none mb-1 tracking-wider">
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
