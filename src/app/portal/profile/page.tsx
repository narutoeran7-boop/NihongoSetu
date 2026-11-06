"use client";

import React, { useState, useEffect } from "react";
import { getStudentProfile, saveStudentProfile, StudentProfile } from "@/lib/storage/studentState";
import {
  User,
  Flame,
  Award,
  Sparkles,
  Layers,
  Calendar,
  Save,
  CheckCircle2,
  Clock,
  RotateCcw,
} from "lucide-react";
import { KANJI_DATA } from "@/data/kanji";
import { CORE_VOCABULARY } from "@/data/vocab";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const JLPT_LEVELS = ["N5", "N4", "N3", "N2", "N1"];

export default function StudentProfilePage() {
  const { t } = useLanguage();
  const [profile, setProfile] = useState<StudentProfile>(() => getStudentProfile());
  const [name, setName] = useState(() => getStudentProfile().name || "Japanese Learner");
  const [targetLevel, setTargetLevel] = useState(() => getStudentProfile().targetLevel || "N5");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    const updated: StudentProfile = {
      ...profile,
      name: name.trim() || profile.name,
      targetLevel,
    };

    saveStudentProfile(updated);
    setProfile(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const learnedKanjiCount = profile?.learnedKanji?.length || 0;
  const learnedVocabCount = profile?.learnedVocab?.length || 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#C83C50]/20 text-[#C83C50] text-xs font-semibold mb-2 border border-[#C83C50]/30">
          <User className="w-3.5 h-3.5" />
          <span>{t("profile_badge")}</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#FFFFFF]">
          {t("profile_title")}
        </h1>
        <p className="text-xs text-[#E8E0D5]/70 mt-1">
          {t("profile_subtitle")}
        </p>
      </div>

      {/* Main Profile Info Card */}
      <div className="bg-[#101C35] border border-[#E8E0D5]/20 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-[#E8E0D5]/15">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-[#C83C50] text-[#FFFFFF] font-black text-2xl flex items-center justify-center shadow-lg shadow-[#C83C50]/30">
              {profile?.name ? profile.name.charAt(0).toUpperCase() : "S"}
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#FFFFFF]">{profile?.name}</h2>
              <p className="text-xs text-[#E8E0D5]/70">{profile?.email}</p>
              <div className="flex items-center space-x-2 mt-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">
                  Active Student
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E8E0D5]/10 text-[#E8E0D5]/70 border border-[#E8E0D5]/15">
                  Target: JLPT {profile?.targetLevel}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <div className="px-4 py-3 rounded-2xl bg-[#0B1323] border border-[#E8E0D5]/15 flex items-center space-x-3">
              <Flame className="w-6 h-6 fill-amber-400 text-amber-400" />
              <div>
                <div className="text-lg font-black text-[#FFFFFF]">{profile?.streak || 1} Days</div>
                <div className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Streak</div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Profile Form */}
        <form onSubmit={handleSaveProfile} className="space-y-4 pt-2">
          {savedSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-300 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Profile settings updated successfully!</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#E8E0D5] mb-1.5">
                {t("profile_display_name")}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#0B1323] border border-[#E8E0D5]/25 rounded-xl px-3.5 py-2.5 text-xs text-[#FFFFFF] focus:outline-none focus:border-[#C83C50]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#E8E0D5] mb-1.5">
                {t("profile_target_level")}
              </label>
              <select
                value={targetLevel}
                onChange={(e) => setTargetLevel(e.target.value)}
                className="w-full bg-[#0B1323] border border-[#E8E0D5]/25 rounded-xl px-3.5 py-2.5 text-xs text-[#FFFFFF] focus:outline-none focus:border-[#C83C50]"
              >
                {JLPT_LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl} className="bg-[#101C35] text-[#FFFFFF]">
                    JLPT {lvl}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#C83C50] hover:bg-[#B03244] text-[#FFFFFF] text-xs font-bold flex items-center space-x-2 transition-all shadow-md shadow-[#C83C50]/20"
            >
              <Save className="w-4 h-4" />
              <span>{t("profile_save_btn")}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Cumulative Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#101C35] border border-[#E8E0D5]/15 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#E8E0D5]/70">
            <span>Kanji Mastered</span>
            <Sparkles className="w-4 h-4 text-[#C83C50]" />
          </div>
          <div className="text-2xl font-black text-[#FFFFFF]">
            {learnedKanjiCount} <span className="text-xs font-normal text-[#E8E0D5]/50">/ {Object.values(KANJI_DATA).flat().length} Available</span>
          </div>
          <div className="text-[11px] text-[#E8E0D5]/60">
            Recorded in local memory bank
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#101C35] border border-[#E8E0D5]/15 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#E8E0D5]/70">
            <span>Vocab Mastered</span>
            <Layers className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-[#FFFFFF]">
            {learnedVocabCount} <span className="text-xs font-normal text-[#E8E0D5]/50">/ {CORE_VOCABULARY.length} Terms</span>
          </div>
          <div className="text-[11px] text-[#E8E0D5]/60">
            Multilingual definition access
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#101C35] border border-[#E8E0D5]/15 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#E8E0D5]/70">
            <span>Exams Completed</span>
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-[#FFFFFF]">
            {profile?.mockScores?.length || 0}
          </div>
          <div className="text-[11px] text-[#E8E0D5]/60">
            Diagnostic simulations
          </div>
        </div>
      </div>

      {/* Mock Exam Historical Records */}
      <div className="bg-[#101C35] border border-[#E8E0D5]/20 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
        <h3 className="text-base font-bold text-[#FFFFFF] flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-[#C83C50]" />
          <span>Full Mock Examination Transcript</span>
        </h3>

        {profile?.mockScores && profile.mockScores.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[#E8E0D5]/60 border-b border-[#E8E0D5]/10">
                <tr>
                  <th className="py-3 px-3">Level</th>
                  <th className="py-3 px-3">Date & Time</th>
                  <th className="py-3 px-3">Raw Score</th>
                  <th className="py-3 px-3">Percentage</th>
                  <th className="py-3 px-3 text-right">Certification Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E0D5]/10">
                {profile.mockScores.map((m, idx) => (
                  <tr key={idx} className="hover:bg-[#E8E0D5]/5 transition-colors">
                    <td className="py-3 px-3 font-bold text-[#FFFFFF]">JLPT {m.level}</td>
                    <td className="py-3 px-3 text-[#E8E0D5]/70">
                      {new Date(m.date).toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-[#FFFFFF]">
                      {m.score} / {m.total}
                    </td>
                    <td className="py-3 px-3 font-bold text-[#FFFFFF]">{m.percentage}%</td>
                    <td className="py-3 px-3 text-right">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          m.passed
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                        }`}
                      >
                        {m.passed ? "PASSED (≥70%)" : "FAILED (<70%)"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-xs text-[#E8E0D5]/50">
            No mock tests completed yet. Visit the JLPT Prep Hub to launch your first exam.
          </div>
        )}
      </div>
    </div>
  );
}
