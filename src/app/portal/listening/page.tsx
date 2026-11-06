"use client";

import React, { useState, useEffect } from "react";
import { LISTEN_ITEMS, LISTEN_TEXT, ListenItem } from "@/data/translations";
import { getStudentProfile } from "@/lib/storage/studentState";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import {
  Headphones,
  Play,
  Turtle,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Volume2,
} from "lucide-react";

export default function ListeningStudioPage() {
  const { language: lang, t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showTranscript, setShowTranscript] = useState(false);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);

  const currentItem: ListenItem = LISTEN_ITEMS[currentIndex] || LISTEN_ITEMS[0];
  const uiText = LISTEN_TEXT[lang] || LISTEN_TEXT.en;

  const playAudio = (rate: number = 1.0) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentItem.jp);
      utterance.lang = "ja-JP";
      utterance.rate = rate;
      window.speechSynthesis.speak(utterance);
    } catch {
      // ignore
    }
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null) return;
    const correct = selectedOption === currentItem.answer;
    setIsCorrect(correct);
    setIsAnswerChecked(true);
    if (correct) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsAnswerChecked(false);
    setShowTranscript(false);
    if (currentIndex < LISTEN_ITEMS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Finished all drill items; loop or restart
      setCurrentIndex(0);
    }
  };

  // Extract choices in current language
  const localizedChoices = currentItem.choices[lang] || currentItem.choices.en;
  const localizedMeaning = currentItem.meaning[lang] || currentItem.meaning.en;

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#C83C50]/20 text-[#C83C50] text-xs font-semibold border border-[#C83C50]/30">
          <Headphones className="w-3.5 h-3.5" />
          <span>{uiText[0] || "Japanese Listening Practice"}</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#FFFFFF]">
          Spoken Japanese Listening Studio
        </h1>
        <p className="text-xs text-[#E8E0D5]/70 max-w-md mx-auto">
          {uiText[1] || "Listen to a sentence, change the speed, then choose its meaning."}
        </p>
      </div>

      {/* Progress pill */}
      <div className="flex items-center justify-between text-xs text-[#E8E0D5]/70 px-2">
        <span>Sentence {currentIndex + 1} of {LISTEN_ITEMS.length}</span>
        <span>Current Score: <strong className="text-[#FFFFFF]">{score}</strong></span>
      </div>

      {/* Audio Player Card */}
      <div className="bg-[#101C35] border border-[#E8E0D5]/20 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        {/* Playback Controls */}
        <div className="flex flex-wrap items-center justify-center gap-4 py-4">
          <button
            onClick={() => playAudio(1.0)}
            className="px-6 py-3.5 rounded-2xl bg-[#C83C50] hover:bg-[#B03244] text-[#FFFFFF] font-bold text-sm shadow-xl shadow-[#C83C50]/30 transition-all flex items-center space-x-2.5 active:scale-95"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>{uiText[2] || "▶ Play (1.0x)"}</span>
          </button>

          <button
            onClick={() => playAudio(0.7)}
            className="px-6 py-3.5 rounded-2xl bg-[#E8E0D5]/10 hover:bg-[#E8E0D5]/20 text-[#E8E0D5] font-semibold text-sm border border-[#E8E0D5]/20 transition-all flex items-center space-x-2.5 active:scale-95"
          >
            <Turtle className="w-5 h-5 text-amber-400" />
            <span>{uiText[3] || "🐢 Slow (0.7x)"}</span>
          </button>
        </div>

        {/* Hidden / Revealed Transcript */}
        <div className="text-center space-y-3 pt-2">
          <button
            onClick={() => setShowTranscript(!showTranscript)}
            className="inline-flex items-center space-x-1.5 text-xs text-[#E8E0D5]/60 hover:text-[#FFFFFF] transition-colors"
          >
            {showTranscript ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{showTranscript ? (uiText[5] || "Hide transcript") : (uiText[4] || "Show transcript")}</span>
          </button>

          {showTranscript && (
            <div className="p-4 rounded-2xl bg-[#0B1323] border border-[#E8E0D5]/15 space-y-1 animate-fadeIn">
              <div className="text-2xl font-bold font-japanese text-[#FFFFFF]">
                {currentItem.jp}
              </div>
              <div className="text-xs font-mono text-[#E8E0D5]/60">
                {currentItem.romaji}
              </div>
              <div className="text-xs text-[#C83C50] font-semibold pt-1">
                {localizedMeaning}
              </div>
            </div>
          )}
        </div>

        {/* Multiple Choice Question */}
        <div className="space-y-4 pt-4 border-t border-[#E8E0D5]/15">
          <h2 className="text-sm font-bold text-[#FFFFFF] text-center">
            {uiText[6] || "What does this sentence mean?"}
          </h2>

          <div className="space-y-2.5">
            {localizedChoices.map((choice, idx) => {
              const isSelected = selectedOption === idx;
              let btnClass = "bg-[#E8E0D5]/5 border-[#E8E0D5]/15 text-[#E8E0D5] hover:bg-[#E8E0D5]/15";

              if (isAnswerChecked) {
                if (idx === currentItem.answer) {
                  btnClass = "bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-bold";
                } else if (isSelected && !isCorrect) {
                  btnClass = "bg-rose-500/20 border-rose-500/50 text-rose-300";
                }
              } else if (isSelected) {
                btnClass = "bg-[#C83C50]/20 border-[#C83C50] text-[#FFFFFF] font-semibold";
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswerChecked}
                  onClick={() => setSelectedOption(idx)}
                  className={`w-full p-4 rounded-xl border text-left text-sm transition-all flex items-center justify-between ${btnClass}`}
                >
                  <span>{choice}</span>
                  {isAnswerChecked && idx === currentItem.answer && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
                  {isAnswerChecked && isSelected && !isCorrect && (
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback & Actions */}
          <div className="pt-2">
            {!isAnswerChecked ? (
              <button
                disabled={selectedOption === null}
                onClick={handleCheckAnswer}
                className="w-full py-3 rounded-xl bg-[#C83C50] hover:bg-[#C83C50]/90 text-[#FFFFFF] font-bold text-xs shadow-lg shadow-[#C83C50]/25 transition-all disabled:opacity-50"
              >
                {uiText[7] || "Check Answer"}
              </button>
            ) : (
              <div className="space-y-3">
                <div
                  className={`p-3.5 rounded-xl border text-xs font-semibold text-center flex items-center justify-center space-x-2 ${
                    isCorrect
                      ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
                      : "bg-rose-500/15 border-rose-500/30 text-rose-300"
                  }`}
                >
                  {isCorrect ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>{uiText[8] || "Correct! Well done."}</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-rose-400" />
                      <span>{uiText[9] || "Not quite. Listen again."}</span>
                    </>
                  )}
                </div>

                <button
                  onClick={handleNext}
                  className="w-full py-3 rounded-xl bg-[#C83C50] hover:bg-[#C83C50]/90 text-[#FFFFFF] font-bold text-xs shadow-lg shadow-[#C83C50]/25 transition-all flex items-center justify-center space-x-2"
                >
                  <span>{currentIndex < LISTEN_ITEMS.length - 1 ? "Next Sentence" : "Start Over"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
