"use client";

import React, { useState } from "react";
import { getStudentProfile, saveStudentProfile, StudentProfile } from "@/lib/storage/studentState";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { SupportedLanguage } from "@/lib/i18n/translations";
import {
  Settings,
  Download,
  Upload,
  Globe,
  Database,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";

export default function StudentSettingsPage() {
  const { language, setLanguage, t, languages } = useLanguage();
  const [profile, setProfile] = useState<StudentProfile>(() => getStudentProfile());
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleLanguageChange = (code: string) => {
    setLanguage(code as SupportedLanguage);
    if (profile) {
      const updated = { ...profile, nativeLanguage: code };
      setProfile(updated);
      saveStudentProfile(updated);
    }
    setStatusMessage({ type: "success", text: t("settings_updated_msg") });
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleExportBackup = () => {
    if (!profile) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(profile, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `nihongosetu_backup_${new Date().toISOString().split("T")[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setStatusMessage({ type: "success", text: t("settings_backup_success") });
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.email && parsed.learnedKanji !== undefined) {
          saveStudentProfile(parsed);
          setProfile(parsed);
          if (parsed.nativeLanguage) {
            setLanguage(parsed.nativeLanguage);
          }
          setStatusMessage({ type: "success", text: t("settings_restore_success") });
        } else {
          setStatusMessage({ type: "error", text: t("settings_restore_error") });
        }
      } catch {
        setStatusMessage({ type: "error", text: "Failed to parse JSON file." });
      }
      setTimeout(() => setStatusMessage(null), 3000);
    };
    reader.readAsText(file);
  };

  const handleResetProgress = () => {
    if (confirm(t("settings_reset_confirm"))) {
      const resetProfile: StudentProfile = {
        name: profile?.name || "Japanese Learner",
        email: profile?.email || "student@nihongosetu.org",
        role: "student",
        targetLevel: "N5",
        nativeLanguage: language,
        streak: 1,
        lastActive: new Date().toISOString(),
        learnedKanji: [],
        learnedVocab: [],
        mockScores: [],
      };
      saveStudentProfile(resetProfile);
      setProfile(resetProfile);
      setStatusMessage({ type: "success", text: "Study progress has been reset." });
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#C83C50]/20 text-[#C83C50] text-xs font-semibold mb-2 border border-[#C83C50]/30">
          <Settings className="w-3.5 h-3.5" />
          <span>{t("settings_title")}</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#FFFFFF]">
          {t("nav_settings")}
        </h1>
        <p className="text-xs text-[#E8E0D5]/70 mt-1">
          {t("settings_subtitle")}
        </p>
      </div>

      {statusMessage && (
        <div
          className={`p-4 rounded-2xl border flex items-center space-x-3 text-xs font-medium animate-fadeIn ${
            statusMessage.type === "success"
              ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
              : "bg-rose-500/15 border-rose-500/30 text-rose-300"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          ) : (
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Language Preference Section */}
      <div className="bg-[#101C35] border border-[#E8E0D5]/20 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex items-center space-x-3 pb-4 border-b border-[#E8E0D5]/15">
          <div className="w-10 h-10 rounded-xl bg-[#C83C50]/20 text-[#C83C50] flex items-center justify-center">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#FFFFFF]">
              {t("settings_lang_heading")}
            </h2>
            <p className="text-xs text-[#E8E0D5]/70">
              {t("settings_lang_desc")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {languages.map((l) => (
            <button
              key={l.code}
              onClick={() => handleLanguageChange(l.code)}
              className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                language === l.code
                  ? "bg-[#C83C50]/20 border-[#C83C50] text-[#FFFFFF] shadow-lg shadow-[#C83C50]/15"
                  : "bg-[#0B1323]/60 border-[#E8E0D5]/15 text-[#E8E0D5]/80 hover:bg-[#E8E0D5]/10 hover:border-[#E8E0D5]/30"
              }`}
            >
              <div>
                <div className="font-bold text-sm">{l.nativeName || l.name}</div>
                <div className="text-[11px] text-[#E8E0D5]/60 mt-0.5">{l.name}</div>
              </div>
              {language === l.code && (
                <div className="w-2.5 h-2.5 rounded-full bg-[#C83C50] shadow" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Backup and Restore Section */}
      <div className="bg-[#101C35] border border-[#E8E0D5]/20 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex items-center space-x-3 pb-4 border-b border-[#E8E0D5]/15">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#FFFFFF]">
              {t("settings_backup_heading")}
            </h2>
            <p className="text-xs text-[#E8E0D5]/70">
              {t("settings_backup_desc")}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            onClick={handleExportBackup}
            className="flex-1 py-3 px-4 rounded-xl bg-[#E8E0D5]/10 hover:bg-[#E8E0D5]/20 text-[#FFFFFF] text-xs font-semibold flex items-center justify-center space-x-2 border border-[#E8E0D5]/20 transition-colors"
          >
            <Download className="w-4 h-4 text-[#C83C50]" />
            <span>{t("settings_export_btn")}</span>
          </button>

          <label className="flex-1 py-3 px-4 rounded-xl bg-[#E8E0D5]/10 hover:bg-[#E8E0D5]/20 text-[#FFFFFF] text-xs font-semibold flex items-center justify-center space-x-2 border border-[#E8E0D5]/20 cursor-pointer transition-colors">
            <Upload className="w-4 h-4 text-blue-400" />
            <span>{t("settings_import_btn")}</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportBackup}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Danger Zone Section */}
      <div className="bg-[#101C35] border border-rose-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex items-center space-x-3 pb-4 border-b border-rose-500/20">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-rose-200">
              {t("settings_danger_heading")}
            </h2>
            <p className="text-xs text-[#E8E0D5]/70">
              {t("settings_danger_desc")}
            </p>
          </div>
        </div>

        <div>
          <button
            onClick={handleResetProgress}
            className="w-full sm:w-auto py-3 px-5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs font-bold flex items-center justify-center space-x-2 border border-rose-500/40 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t("settings_reset_btn")}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
