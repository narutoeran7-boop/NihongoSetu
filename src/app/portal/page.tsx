"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Flame,
  Award,
  BookOpen,
  Sparkles,
  Layers,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Bot,
  Headphones,
} from "lucide-react";
import { getStudentProfile, StudentProfile, DEFAULT_PROFILE } from "@/lib/storage/studentState";
import { KANJI_DATA } from "@/data/kanji";
import { CORE_VOCABULARY } from "@/data/vocab";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function StudentDashboardPage() {
  const { t } = useLanguage();
  const [profile, setProfile] = useState<StudentProfile>(DEFAULT_PROFILE);

  useEffect(() => {
    setProfile(getStudentProfile());
  }, []);

  const totalKanjiAvailable = Object.values(KANJI_DATA).flat().length;
  const learnedKanjiCount = profile?.learnedKanji?.length || 0;
  const learnedVocabCount = profile?.learnedVocab?.length || 0;
  const recentMock = profile?.mockScores?.[0];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#101C35] via-[#1A2E56] to-[#101C35] border border-[#E8E0D5]/20 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 rounded-full bg-[#C83C50]/15 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#C83C50]/20 border border-[#C83C50]/30 text-xs text-[#FFFFFF]">
              <span className="font-japanese">おかえりなさい</span>
              <span>· {t("dash_welcome_back")}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#FFFFFF]">
              {profile?.name || "Japanese Learner"}
            </h1>
            <p className="text-sm text-[#E8E0D5]/80 max-w-xl leading-relaxed">
              {t("target_jlpt")}: <span className="font-bold text-[#FFFFFF]">{profile?.targetLevel || "N5"}</span> · {t("dash_ready_today")}
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <div className="p-4 rounded-2xl bg-[#101C35]/80 border border-[#E8E0D5]/20 flex items-center space-x-3 shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Flame className="w-7 h-7 fill-amber-400" />
              </div>
              <div>
                <div className="text-2xl font-black text-[#FFFFFF]">
                  {profile?.streak || 1} <span className="text-xs font-normal text-[#E8E0D5]/70">{t("days_unit")}</span>
                </div>
                <div className="text-[11px] text-amber-400 font-semibold uppercase tracking-wider">
                  {t("active_streak")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Core Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-5 rounded-2xl bg-[#101C35] border border-[#E8E0D5]/15 space-y-3 hover:border-[#C83C50]/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#E8E0D5]/70 uppercase tracking-wider">
              {t("dash_kanji_mastered")}
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#C83C50]/20 text-[#C83C50] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-[#FFFFFF]">{learnedKanjiCount}</span>
            <span className="text-xs text-[#E8E0D5]/60">/ {totalKanjiAvailable} {t("dash_available")}</span>
          </div>
          <div className="w-full bg-[#E8E0D5]/10 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#C83C50] h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.round((learnedKanjiCount / (totalKanjiAvailable || 1)) * 100))}%` }}
            />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-2xl bg-[#101C35] border border-[#E8E0D5]/15 space-y-3 hover:border-[#C83C50]/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#E8E0D5]/70 uppercase tracking-wider">
              {t("dash_vocab_terms")}
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-[#FFFFFF]">{learnedVocabCount}</span>
            <span className="text-xs text-[#E8E0D5]/60">/ {CORE_VOCABULARY.length} {t("dash_terms")}</span>
          </div>
          <div className="w-full bg-[#E8E0D5]/10 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-blue-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.round((learnedVocabCount / CORE_VOCABULARY.length) * 100))}%` }}
            />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-2xl bg-[#101C35] border border-[#E8E0D5]/15 space-y-3 hover:border-[#C83C50]/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#E8E0D5]/70 uppercase tracking-wider">
              {t("dash_grammar_decks")}
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-[#FFFFFF]">N5–N1</span>
            <span className="text-xs text-[#E8E0D5]/60">{t("dash_all_levels_active")}</span>
          </div>
          <div className="text-xs text-emerald-400 flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{t("dash_patterns_updated")}</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-2xl bg-[#101C35] border border-[#E8E0D5]/15 space-y-3 hover:border-[#C83C50]/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#E8E0D5]/70 uppercase tracking-wider">
              {t("dash_mock_best")}
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-[#FFFFFF]">
              {recentMock ? `${recentMock.percentage}%` : "Ready"}
            </span>
            <span className="text-xs text-[#E8E0D5]/60">
              {recentMock ? (recentMock.passed ? t("dash_passed") : t("dash_in_progress")) : "20 Qs per Test"}
            </span>
          </div>
          <div className="text-xs text-[#E8E0D5]/60 flex items-center space-x-1">
            <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
            <span>{t("dash_passing_target")}</span>
          </div>
        </div>
      </div>

      {/* Quick Jump Action Modules */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-[#FFFFFF] flex items-center space-x-2">
          <span>{t("dash_continue_learning")}</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-[#E8E0D5]/10 text-[#E8E0D5]/70 font-normal">
            {t("dash_direct_jump")}
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/portal/kana"
            className="group p-5 rounded-2xl bg-[#101C35] border border-[#E8E0D5]/15 hover:border-[#C83C50] transition-all space-y-3 shadow-lg"
          >
            <div className="w-10 h-10 rounded-xl bg-[#C83C50]/20 text-[#C83C50] flex items-center justify-center font-japanese text-lg font-bold group-hover:scale-105 transition-transform">
              あ
            </div>
            <div>
              <h3 className="text-base font-bold text-[#FFFFFF] group-hover:text-[#C83C50] transition-colors">
                {t("feature_script_title")}
              </h3>
              <p className="text-xs text-[#E8E0D5]/70 mt-1 leading-relaxed">
                {t("feature_script_desc")}
              </p>
            </div>
            <div className="flex items-center text-xs font-semibold text-[#C83C50] space-x-1 pt-1">
              <span>{t("dash_open_feature")}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/portal/vocab"
            className="group p-5 rounded-2xl bg-[#101C35] border border-[#E8E0D5]/15 hover:border-[#C83C50] transition-all space-y-3 shadow-lg"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-japanese text-lg font-bold group-hover:scale-105 transition-transform">
              語
            </div>
            <div>
              <h3 className="text-base font-bold text-[#FFFFFF] group-hover:text-[#C83C50] transition-colors">
                {t("feature_vocab_title")}
              </h3>
              <p className="text-xs text-[#E8E0D5]/70 mt-1 leading-relaxed">
                {t("feature_vocab_desc")}
              </p>
            </div>
            <div className="flex items-center text-xs font-semibold text-[#C83C50] space-x-1 pt-1">
              <span>{t("dash_open_feature")}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/portal/jlpt"
            className="group p-5 rounded-2xl bg-[#101C35] border border-[#E8E0D5]/15 hover:border-[#C83C50] transition-all space-y-3 shadow-lg"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-japanese text-lg font-bold group-hover:scale-105 transition-transform">
              試
            </div>
            <div>
              <h3 className="text-base font-bold text-[#FFFFFF] group-hover:text-[#C83C50] transition-colors">
                {t("feature_jlpt_title")}
              </h3>
              <p className="text-xs text-[#E8E0D5]/70 mt-1 leading-relaxed">
                {t("feature_jlpt_desc")}
              </p>
            </div>
            <div className="flex items-center text-xs font-semibold text-[#C83C50] space-x-1 pt-1">
              <span>{t("dash_open_feature")}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>

      {/* Secondary Tools: AI Sensei & Audio Listening */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/portal/sensei"
          className="p-5 rounded-2xl bg-[#101C35] border border-[#E8E0D5]/15 hover:border-[#C83C50]/50 transition-all flex items-center justify-between"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-[#C83C50]/20 text-[#C83C50] flex items-center justify-center">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#FFFFFF]">{t("feature_sensei_title")}</h3>
              <p className="text-xs text-[#E8E0D5]/70 mt-0.5">
                {t("feature_sensei_desc")}
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-[#E8E0D5]/60 shrink-0" />
        </Link>

        <Link
          href="/portal/listening"
          className="p-5 rounded-2xl bg-[#101C35] border border-[#E8E0D5]/15 hover:border-[#C83C50]/50 transition-all flex items-center justify-between"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#FFFFFF]">{t("feature_listening_title")}</h3>
              <p className="text-xs text-[#E8E0D5]/70 mt-0.5">
                {t("feature_listening_desc")}
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-[#E8E0D5]/60 shrink-0" />
        </Link>
      </div>
    </div>
  );
}
