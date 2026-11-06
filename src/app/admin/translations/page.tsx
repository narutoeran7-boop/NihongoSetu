"use client";

import React, { useState } from "react";
import { T, TranslationMap } from "@/data/translations";
import { LANGUAGES } from "@/components/public/Navbar";
import { logAdminAction } from "@/lib/storage/adminState";
import { Globe, Save, CheckCircle2, RefreshCw } from "lucide-react";

export default function AdminTranslationsCMSPage() {
  const [selectedLang, setSelectedLang] = useState("ta");
  const [translations, setTranslations] = useState<Record<string, TranslationMap>>(T);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const activeMap = translations[selectedLang] || translations.en;

  const handleUpdateKey = (key: string, value: string) => {
    setTranslations((prev) => ({
      ...prev,
      [selectedLang]: {
        ...prev[selectedLang],
        [key]: value,
      },
    }));
  };

  const handleSave = () => {
    logAdminAction(
      "TRANSLATION_UPDATED",
      `Saved localized UI translations for language code: ${selectedLang}.`,
      "info"
    );
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const keysToEdit = [
    { key: "home", label: "Home Navigation" },
    { key: "kana", label: "Japanese Script" },
    { key: "grammar", label: "Grammar Decks" },
    { key: "vocab", label: "Vocabulary Vault" },
    { key: "kanji", label: "Kanji Vault" },
    { key: "listen", label: "Listening Studio" },
    { key: "mock", label: "Mock Examination" },
    { key: "videos", label: "Video Lessons" },
    { key: "levels", label: "JLPT Levels" },
    { key: "sensei", label: "AI Sensei" },
    { key: "tag", label: "Platform Slogan / Tagline" },
    { key: "streak", label: "Day Streak Label" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#C83C50]/20 text-[#C83C50] text-xs font-semibold mb-2 border border-[#C83C50]/30">
            <Globe className="w-3.5 h-3.5" />
            <span>Internationalization & Localization CMS</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#FFFFFF]">
            12-Language Translation Manager
          </h1>
          <p className="text-xs text-[#E8E0D5]/70 mt-1">
            Customize and verify UI terminology across all 12 supported learner languages.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 rounded-xl bg-[#C83C50] hover:bg-[#B03244] text-[#FFFFFF] text-xs font-bold shadow-lg shadow-[#C83C50]/20 flex items-center space-x-2 transition-all shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>Save Translation Edits</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-300 flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Translations saved successfully into active language registry!</span>
        </div>
      )}

      {/* Language Selector Grid */}
      <div className="bg-[#101C35] border border-[#E8E0D5]/20 rounded-3xl p-6 shadow-xl space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#E8E0D5]/70">
          Target Language Selection
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => setSelectedLang(l.code)}
              className={`p-3 rounded-2xl border text-xs font-bold transition-all ${
                selectedLang === l.code
                  ? "bg-[#C83C50] text-[#FFFFFF] shadow-md shadow-[#C83C50]/20 border-transparent"
                  : "bg-[#0B1323] text-[#E8E0D5]/80 border-[#E8E0D5]/15 hover:border-[#E8E0D5]/30"
              }`}
            >
              <div>{l.name}</div>
              <div className="text-[10px] opacity-60 font-mono mt-0.5 uppercase">
                {l.code}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Translations Editor Form */}
      <div className="bg-[#101C35] border border-[#E8E0D5]/20 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-[#E8E0D5]/15">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#C83C50] text-[#FFFFFF] uppercase">
              {selectedLang}
            </span>
            <span className="text-sm font-bold text-[#FFFFFF]">
              Editing {LANGUAGES.find((l) => l.code === selectedLang)?.name} Dictionary
            </span>
          </div>
          <span className="text-xs text-[#E8E0D5]/50">{keysToEdit.length} Core Strings</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {keysToEdit.map(({ key, label }) => {
            const currentVal = (activeMap as Record<string, string | undefined>)[key] || "";
            const enVal = (translations.en as Record<string, string | undefined>)[key] || "";

            return (
              <div
                key={key}
                className="p-4 rounded-2xl bg-[#0B1323] border border-[#E8E0D5]/10 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#FFFFFF]">{label}</label>
                  <span className="text-[10px] font-mono text-[#E8E0D5]/40">{key}</span>
                </div>
                <div className="text-[11px] text-[#E8E0D5]/50 italic">
                  English default: &quot;{enVal}&quot;
                </div>
                <input
                  type="text"
                  value={currentVal}
                  onChange={(e) => handleUpdateKey(key, e.target.value)}
                  className="w-full bg-[#101C35] border border-[#E8E0D5]/20 rounded-xl px-3 py-2 text-xs text-[#FFFFFF] focus:outline-none focus:border-[#C83C50]"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
