"use client";

import React, { useState, useEffect, useCallback, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  getClientQuestionsForLevel,
  JLPTLevel,
  ClientExamQuestion,
  ExamReviewItem,
} from "@/data/questions";
import { saveMockExamResult } from "@/lib/storage/studentState";
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Award,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  Volume2,
} from "lucide-react";

export default function TimedMockExamPage({
  params,
}: {
  params: Promise<{ level: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const rawLevel = resolvedParams.level.toUpperCase();
  const level: JLPTLevel = ["N5", "N4", "N3", "N2", "N1"].includes(rawLevel)
    ? (rawLevel as JLPTLevel)
    : "N5";

  // Client-safe questions deck (Contains NO correct answers or explanations)
  const [questions] = useState<ClientExamQuestion[]>(() =>
    getClientQuestionsForLevel(level).slice(0, 20)
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
  const [isGrading, setIsGrading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [gradingError, setGradingError] = useState<string | null>(null);

  // Server-verified grading results & post-exam solution review
  const [examResult, setExamResult] = useState<{
    score: number;
    total: number;
    percentage: number;
    passed: boolean;
    signature?: string;
  } | null>(null);
  const [reviewItems, setReviewItems] = useState<ExamReviewItem[]>([]);

  const handleSubmit = useCallback(async () => {
    if (isSubmitted || isGrading || questions.length === 0) return;
    setIsGrading(true);
    setGradingError(null);

    try {
      const questionIds = questions.map((q) => q.id);
      const res = await fetch("/api/exams/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          level,
          answers: selectedAnswers,
          questionIds,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.verifiedScore) {
          saveMockExamResult(
            level,
            data.verifiedScore.score,
            data.verifiedScore.total,
            data.verifiedScore.signature
          );
          setExamResult(data.verifiedScore);
          setReviewItems(data.review || []);
          setIsSubmitted(true);
          setIsGrading(false);
          if (typeof window !== "undefined") {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
          return;
        }
      }

      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Server grading failed (HTTP ${res.status})`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Network error reaching evaluation server";
      setGradingError(msg);
      setIsGrading(false);
    }
  }, [isSubmitted, isGrading, questions, selectedAnswers, level]);

  // Countdown timer
  useEffect(() => {
    if (isSubmitted || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSubmitted, timeLeft, handleSubmit]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const playAudioPrompt = (text: string) => {
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

  const handleSelectOption = (optionIndex: number) => {
    if (isSubmitted || isGrading) return;
    const q = questions[currentIndex];
    if (!q) return;

    setSelectedAnswers((prev) => ({
      ...prev,
      [q.id]: optionIndex,
    }));
  };

  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(selectedAnswers).length;

  if (questions.length === 0) {
    return (
      <div className="text-center py-24 space-y-4">
        <div className="w-8 h-8 border-2 border-[#C83C50] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-[#E8E0D5]/70">Preparing JLPT {level} Question Deck...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner with Exam Info & Clock */}
      <div className="bg-[#101C35] border border-[#E8E0D5]/20 rounded-2xl p-4 sm:p-6 flex items-center justify-between shadow-xl sticky top-24 z-30 backdrop-blur-md">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-black px-2 py-0.5 rounded bg-[#C83C50] text-[#FFFFFF]">
              JLPT {level}
            </span>
            <span className="text-xs text-[#E8E0D5]/80 font-medium">
              Timed Diagnostic Examination
            </span>
          </div>
          <p className="text-[11px] text-[#E8E0D5]/60 mt-0.5">
            Answered: {answeredCount} / {questions.length} questions
          </p>
        </div>

        {/* Live Timer */}
        <div
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl border text-sm font-bold ${
            timeLeft < 300
              ? "bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse"
              : "bg-[#0B1323] text-[#FFFFFF] border-[#E8E0D5]/20"
          }`}
        >
          <Clock className="w-4 h-4 text-[#C83C50]" />
          <span>{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* Grading Error Alert */}
      {gradingError && (
        <div className="p-4 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center justify-between">
          <span>{gradingError}</span>
          <button
            onClick={handleSubmit}
            className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg"
          >
            Retry Submission
          </button>
        </div>
      )}

      {!isSubmitted ? (
        <>
          {/* Question Stepper Indicator */}
          <div className="bg-[#101C35] border border-[#E8E0D5]/15 rounded-2xl p-4 overflow-x-auto shadow-md">
            <div className="flex items-center space-x-1.5 min-w-max">
              {questions.map((q, idx) => {
                const isCurrent = idx === currentIndex;
                const isAnswered = selectedAnswers[q.id] !== undefined;

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${
                      isCurrent
                        ? "bg-[#C83C50] text-[#FFFFFF] shadow-md shadow-[#C83C50]/30 scale-105"
                        : isAnswered
                        ? "bg-[#E8E0D5]/20 text-[#FFFFFF] border border-[#E8E0D5]/40"
                        : "bg-[#0B1323] text-[#E8E0D5]/50 border border-[#E8E0D5]/10 hover:border-[#E8E0D5]/30"
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Question Card */}
          <div className="bg-[#101C35] border border-[#E8E0D5]/20 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E8E0D5]/10 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#E8E0D5]/60">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#E8E0D5]/10 text-[#E8E0D5] font-semibold">
                {currentQuestion.category}
              </span>
            </div>

            {/* Reading Passage Box (if applicable) */}
            {currentQuestion.passage && (
              <div className="p-4 sm:p-5 rounded-2xl bg-[#0B1323] border border-[#E8E0D5]/20 space-y-2">
                <div className="text-[11px] font-bold text-[#C83C50] uppercase tracking-wider flex items-center justify-between">
                  <span>読解問題本文 · Reading Passage</span>
                </div>
                <p className="text-sm font-japanese text-[#FFFFFF] leading-relaxed whitespace-pre-line">
                  {currentQuestion.passage}
                </p>
              </div>
            )}

            {/* Listening Audio Dialogue Player (if applicable) */}
            {currentQuestion.audioPrompt && (
              <div className="p-4 sm:p-5 rounded-2xl bg-[#0B1323] border border-[#E8E0D5]/20 space-y-3">
                <div className="text-[11px] font-bold text-blue-400 uppercase tracking-wider flex items-center justify-between">
                  <span>聴解音声問題 · Listening Audio Dialogue</span>
                  <span className="text-[10px] text-[#E8E0D5]/60">Speech Synthesizer</span>
                </div>
                <button
                  type="button"
                  onClick={() => playAudioPrompt(currentQuestion.audioPrompt!)}
                  className="w-full py-3 px-4 rounded-xl bg-[#C83C50]/20 hover:bg-[#C83C50]/30 text-[#C83C50] border border-[#C83C50]/30 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>音声を聞く · Play Japanese Audio Dialogue</span>
                </button>
              </div>
            )}

            {/* Prompt */}
            <div className="text-xl sm:text-2xl font-bold font-japanese leading-relaxed text-[#FFFFFF]">
              {currentQuestion.question}
            </div>

            {/* Options List */}
            <div className="space-y-3 pt-2">
              {currentQuestion.options.map((option, optIdx) => {
                const isSelected = selectedAnswers[currentQuestion.id] === optIdx;

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center space-x-3.5 group ${
                      isSelected
                        ? "bg-[#C83C50]/15 border-[#C83C50] text-[#FFFFFF] shadow-lg shadow-[#C83C50]/10"
                        : "bg-[#0B1323] border-[#E8E0D5]/15 text-[#E8E0D5] hover:border-[#E8E0D5]/40"
                    }`}
                  >
                    <span
                      className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? "bg-[#C83C50] text-[#FFFFFF]"
                          : "bg-[#101C35] text-[#E8E0D5]/60 group-hover:text-[#FFFFFF]"
                      }`}
                    >
                      {optIdx + 1}
                    </span>
                    <span className="text-base font-japanese">{option}</span>
                  </button>
                );
              })}
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center justify-between pt-6 border-t border-[#E8E0D5]/10">
              <button
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="px-4 py-2.5 rounded-xl border border-[#E8E0D5]/20 text-[#E8E0D5] hover:bg-[#E8E0D5]/10 disabled:opacity-40 disabled:hover:bg-transparent text-xs font-semibold flex items-center space-x-1.5 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              {currentIndex < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                  className="px-5 py-2.5 rounded-xl bg-[#C83C50] hover:bg-[#C83C50]/90 text-[#FFFFFF] text-xs font-bold flex items-center space-x-1.5 transition-all shadow-md"
                >
                  <span>Next Question</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isGrading}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-[#FFFFFF] text-xs font-bold flex items-center space-x-1.5 transition-all shadow-lg shadow-emerald-600/30"
                >
                  {isGrading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Grading on Server...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Submit Final Exam</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </>
      ) : (
        /* Results & Review Mode (Unlocked only after server-side grading) */
        <div className="space-y-8">
          {/* Score Header Card */}
          <div className="bg-[#101C35] border border-[#E8E0D5]/20 rounded-3xl p-8 text-center space-y-4 shadow-2xl">
            <div
              className={`w-20 h-20 rounded-3xl mx-auto flex items-center justify-center shadow-xl ${
                examResult?.passed
                  ? "bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500/40"
                  : "bg-rose-500/20 text-rose-400 border-2 border-rose-500/40"
              }`}
            >
              <Award className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <span
                className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                  examResult?.passed
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-rose-500/20 text-rose-400"
                }`}
              >
                {examResult?.passed ? "EXAMINATION PASSED" : "REVISE & RETAKE"}
              </span>
              <h1 className="text-4xl font-black text-[#FFFFFF]">
                {examResult?.score} / {examResult?.total} Correct ({examResult?.percentage}%)
              </h1>
              <p className="text-xs text-[#E8E0D5]/70 max-w-md mx-auto">
                {examResult?.passed
                  ? `Congratulations! You scored above the 70% threshold required for JLPT ${level} certification mastery.`
                  : `You scored ${examResult?.percentage}%. A minimum of 70% is required to pass. Review the detailed solutions and grammar notes below.`}
              </p>
              {examResult?.signature && (
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400 font-mono mt-2">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Server Verified Score: {examResult.signature.slice(0, 16)}...</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-4 pt-2">
              <button
                onClick={() => {
                  setSelectedAnswers({});
                  setIsSubmitted(false);
                  setCurrentIndex(0);
                  setTimeLeft(25 * 60);
                  setExamResult(null);
                  setReviewItems([]);
                }}
                className="px-5 py-2.5 rounded-xl bg-[#C83C50] hover:bg-[#C83C50]/90 text-[#FFFFFF] text-xs font-bold flex items-center space-x-2 transition-all shadow-lg"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retake JLPT {level} Exam</span>
              </button>

              <Link
                href="/portal/jlpt"
                className="px-5 py-2.5 rounded-xl bg-[#E8E0D5]/10 hover:bg-[#E8E0D5]/20 text-[#E8E0D5] text-xs font-semibold transition-colors"
              >
                Return to Exam Hub
              </Link>
            </div>
          </div>

          {/* Detailed Question Review */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#FFFFFF]">
              Question-by-Question Solution Review
            </h2>

            <div className="space-y-4">
              {reviewItems.map((item, idx) => {
                const isCorrect = item.isCorrect;

                return (
                  <div
                    key={item.id}
                    className={`rounded-2xl border p-5 space-y-3 ${
                      isCorrect
                        ? "bg-[#101C35] border-emerald-500/30"
                        : "bg-[#101C35] border-rose-500/30"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-[#E8E0D5]/60">
                          Q{idx + 1}.
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded bg-[#E8E0D5]/10 text-[#E8E0D5]/80">
                          {item.category}
                        </span>
                      </div>

                      <div className="flex items-center space-x-1.5 text-xs font-bold">
                        {isCorrect ? (
                          <span className="text-emerald-400 flex items-center space-x-1">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Correct</span>
                          </span>
                        ) : (
                          <span className="text-rose-400 flex items-center space-x-1">
                            <XCircle className="w-4 h-4" />
                            <span>Incorrect</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-base font-bold font-japanese text-[#FFFFFF]">
                      {item.question}
                    </div>

                    {/* Options summary */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {item.options.map((opt, oIdx) => {
                        let optStyle = "bg-[#0B1323] text-[#E8E0D5]/70 border-[#E8E0D5]/10";
                        if (oIdx === item.correctIndex) {
                          optStyle = "bg-emerald-500/20 text-emerald-300 font-bold border-emerald-500/40";
                        } else if (oIdx === item.userSelected && !isCorrect) {
                          optStyle = "bg-rose-500/20 text-rose-300 line-through border-rose-500/40";
                        }

                        return (
                          <div
                            key={oIdx}
                            className={`p-2.5 rounded-xl border flex items-center space-x-2 font-japanese ${optStyle}`}
                          >
                            <span className="font-sans font-bold">{oIdx + 1}.</span>
                            <span>{opt}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation released from server */}
                    <div className="p-3 rounded-xl bg-[#0B1323] border border-[#E8E0D5]/10 text-xs text-[#E8E0D5]/80 leading-relaxed space-y-1">
                      <div>
                        <strong className="text-[#C83C50]">Grammar & Meaning Note: </strong>
                        {item.explanation}
                      </div>
                      {item.explanationTa && (
                        <div className="text-[#C83C50]">
                          <strong className="text-[#C83C50]">தமிழ் விளக்கம்: </strong>
                          {item.explanationTa}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
