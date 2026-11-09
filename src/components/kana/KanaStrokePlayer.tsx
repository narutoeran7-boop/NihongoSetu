"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { KanaStroke, getKanaStrokes, KANJIVG_VIEWBOX } from "@/data/kanaStrokes";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  Eye,
  EyeOff,
  Volume2,
  CheckCircle2,
  PenTool,
  Film,
  Sparkles,
  AlertCircle,
  Hash,
} from "lucide-react";

interface KanaStrokePlayerProps {
  char: string;
  romaji: string;
  scriptType: "hira" | "kata";
  strokeCount: number;
  onAudioPlay?: () => void;
}

type PlayerMode = "animate" | "practice" | "freehand";

export default function KanaStrokePlayer({
  char,
  romaji,
  scriptType,
  strokeCount,
  onAudioPlay,
}: KanaStrokePlayerProps) {
  const { t } = useLanguage();
  const strokes: KanaStroke[] = getKanaStrokes(char, scriptType);
  const actualStrokeCount = strokes.length > 0 ? strokes.length : strokeCount;

  // Active Mode: 'animate' | 'practice' | 'freehand'
  const [mode, setMode] = useState<PlayerMode>("practice");

  // Animation state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(actualStrokeCount); // 0..actualStrokeCount
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1); // 0.5, 1, 1.5, 2
  const [showNumbers, setShowNumbers] = useState(true);
  const [showGuide, setShowGuide] = useState(true);

  // Practice state
  const [practiceStep, setPracticeStep] = useState(0); // 0..strokes.length
  const [practiceFeedback, setPracticeFeedback] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);
  const [practiceCompleted, setPracticeCompleted] = useState(false);

  // Canvas drawing state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState<string>("#C83C50");
  const drawnPointsRef = useRef<{ x: number; y: number }[]>([]);

  // ----------------------------------------------------------------------------
  // Animation Timer
  // ----------------------------------------------------------------------------
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && mode === "animate") {
      const intervalMs = Math.round(750 / playbackSpeed);
      timer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= actualStrokeCount) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, intervalMs);
    }
    return () => clearInterval(timer);
  }, [isPlaying, actualStrokeCount, playbackSpeed, mode]);

  // Reset when char or scriptType changes
  useEffect(() => {
    setIsPlaying(false);
    setCurrentStep(actualStrokeCount);
    setPracticeStep(0);
    setPracticeCompleted(false);
    setPracticeFeedback(null);
    clearCanvas();
  }, [char, scriptType, actualStrokeCount]);

  // ----------------------------------------------------------------------------
  // Canvas Management
  // ----------------------------------------------------------------------------
  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, []);

  // ----------------------------------------------------------------------------
  // Geometric Stroke Validation (Practice Mode)
  // ----------------------------------------------------------------------------
  const validateStroke = (points: { x: number; y: number }[]) => {
    if (practiceStep >= strokes.length) return;
    const expected = strokes[practiceStep];
    if (!expected) return;

    if (points.length < 3) {
      setPracticeFeedback({
        type: "error",
        message: t("script_feedback_retry"),
      });
      return;
    }

    const start = points[0];
    const end = points[points.length - 1];

    // 1. Proximity check on start point (distance in 109x109 KanjiVG space)
    const distToStart = Math.hypot(start.x - expected.startPoint.x, start.y - expected.startPoint.y);
    if (distToStart > 26) {
      setPracticeFeedback({
        type: "error",
        message: t("script_feedback_start_near", practiceStep + 1),
      });
      return;
    }

    // 2. Direction check based on directionHint
    const deltaX = end.x - start.x;
    const deltaY = end.y - start.y;
    let directionValid = true;

    if (expected.directionHint === "horizontal") {
      if (deltaX < 5) directionValid = false;
    } else if (expected.directionHint === "vertical") {
      if (deltaY < 5) directionValid = false;
    } else if (expected.directionHint === "down-right") {
      if (deltaX < -10 || deltaY < -10) directionValid = false;
    } else if (expected.directionHint === "down-left") {
      if (deltaX > 10 || deltaY < -10) directionValid = false;
    } else if (expected.directionHint === "up-right") {
      if (deltaY > 10 || deltaX < -10) directionValid = false;
    }

    if (!directionValid) {
      setPracticeFeedback({
        type: "error",
        message: t("script_feedback_direction"),
      });
      return;
    }

    // 3. Stroke Passed Validation!
    const nextStep = practiceStep + 1;
    if (nextStep >= strokes.length) {
      setPracticeStep(nextStep);
      setPracticeCompleted(true);
      setPracticeFeedback({
        type: "success",
        message: t("script_all_completed"),
      });
    } else {
      setPracticeStep(nextStep);
      setPracticeFeedback({
        type: "success",
        message: t("script_feedback_correct", practiceStep + 1),
      });
    }
  };

  // ----------------------------------------------------------------------------
  // Touch / Mouse Drawing Handlers
  // ----------------------------------------------------------------------------
  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = "clientX" in e ? e.clientX : e.touches[0].clientX;
    const clientY = "clientY" in e ? e.clientY : e.touches[0].clientY;
    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;
    return { x, y };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);
    const { x, y } = getCanvasCoords(e);

    // Save normalized 0..109 KanjiVG coordinate
    drawnPointsRef.current = [{ x: (x / canvas.width) * 109, y: (y / canvas.height) * 109 }];

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = 12;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = brushColor;
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = getCanvasCoords(e);
    drawnPointsRef.current.push({ x: (x / canvas.width) * 109, y: (y / canvas.height) * 109 });

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    if (mode === "practice" && !practiceCompleted) {
      validateStroke(drawnPointsRef.current);
    }
    drawnPointsRef.current = [];
  };

  // ----------------------------------------------------------------------------
  // Playback & Controls
  // ----------------------------------------------------------------------------
  const handlePlay = () => {
    setMode("animate");
    if (currentStep >= actualStrokeCount) {
      setCurrentStep(1);
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleReplay = () => {
    setMode("animate");
    setIsPlaying(false);
    setCurrentStep(1);
    setTimeout(() => setIsPlaying(true), 120);
  };

  const handleStepPrev = () => {
    setIsPlaying(false);
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const handleStepNext = () => {
    setIsPlaying(false);
    setCurrentStep((prev) => Math.min(actualStrokeCount, prev + 1));
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(1);
    setPracticeStep(0);
    setPracticeCompleted(false);
    setPracticeFeedback(null);
    clearCanvas();
  };

  const handleRestartPractice = () => {
    setPracticeStep(0);
    setPracticeCompleted(false);
    setPracticeFeedback(null);
    clearCanvas();
  };

  return (
    <div className="bg-[#101C35] border border-[#E8E0D5]/20 rounded-3xl p-5 sm:p-7 space-y-6 shadow-2xl">
      {/* Top Header Card: Character, Romaji & Audio */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E8E0D5]/15">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-[#0B1323] border border-[#E8E0D5]/25 flex items-center justify-center text-4xl font-black font-japanese text-[#FFFFFF] shadow-inner">
            {char}
          </div>
          <div>
            <div className="text-sm font-bold text-[#FFFFFF] flex items-center space-x-2">
              <span className="text-xs text-[#E8E0D5]/60 font-normal">{t("script_romaji")}:</span>
              <span className="text-[#C83C50] text-base font-mono">{romaji}</span>
            </div>
            <div className="text-xs text-[#E8E0D5]/70 mt-0.5">
              {t("script_stroke_count")}:{" "}
              <span className="font-bold text-[#FFFFFF]">
                {actualStrokeCount} {t("script_strokes_unit")}
              </span>{" "}
              · {t("script_stroke_order")}
            </div>
          </div>
        </div>

        {onAudioPlay && (
          <button
            onClick={onAudioPlay}
            className="p-3 rounded-2xl bg-[#C83C50]/20 hover:bg-[#C83C50]/30 text-[#C83C50] border border-[#C83C50]/35 transition-all shadow active:scale-95"
            title={t("script_listen_audio")}
            aria-label={t("script_listen_audio")}
          >
            <Volume2 className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Mode Switcher Tabs */}
      <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-[#0B1323] border border-[#E8E0D5]/15">
        <button
          onClick={() => {
            setMode("practice");
            setIsPlaying(false);
          }}
          className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${
            mode === "practice"
              ? "bg-[#C83C50] text-[#FFFFFF] shadow-md shadow-[#C83C50]/30"
              : "text-[#E8E0D5]/70 hover:text-[#FFFFFF]"
          }`}
        >
          <PenTool className="w-3.5 h-3.5" />
          <span>{t("script_mode_practice")}</span>
        </button>

        <button
          onClick={() => {
            setMode("animate");
            handlePlay();
          }}
          className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${
            mode === "animate"
              ? "bg-[#C83C50] text-[#FFFFFF] shadow-md shadow-[#C83C50]/30"
              : "text-[#E8E0D5]/70 hover:text-[#FFFFFF]"
          }`}
        >
          <Film className="w-3.5 h-3.5" />
          <span>{t("script_mode_animate")}</span>
        </button>

        <button
          onClick={() => {
            setMode("freehand");
            setIsPlaying(false);
          }}
          className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${
            mode === "freehand"
              ? "bg-[#C83C50] text-[#FFFFFF] shadow-md shadow-[#C83C50]/30"
              : "text-[#E8E0D5]/70 hover:text-[#FFFFFF]"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t("script_mode_freehand")}</span>
        </button>
      </div>

      {/* Main Interactive Stage (SVG Guide + Animator + Canvas) */}
      <div className="relative w-full aspect-square max-w-[320px] mx-auto rounded-3xl bg-[#0B1323] border-2 border-[#E8E0D5]/25 overflow-hidden shadow-inner flex items-center justify-center">
        {/* Guide Crosshairs */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-full h-px border-b border-dashed border-[#E8E0D5]/15" />
          <div className="h-full w-px border-r border-dashed border-[#E8E0D5]/15 absolute" />
        </div>

        {/* Authentic SVG Stroke Animator & Guide Engine */}
        <svg
          viewBox={KANJIVG_VIEWBOX}
          className="absolute inset-0 w-full h-full pointer-events-none"
        >
          {/* 1. Static Reference Guide Overlay (Identical matching vector geometry) */}
          {showGuide && (
            <g className="opacity-20 pointer-events-none">
              {strokes.map((s, idx) => (
                <path
                  key={`guide-${idx}`}
                  d={s.d}
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ))}
            </g>
          )}

          {/* 2. Mode: Animation Renderer */}
          {mode === "animate" &&
            strokes.map((stroke, idx) => {
              const strokeNum = idx + 1;
              const isVisible = strokeNum <= currentStep;
              const isCurrent = strokeNum === currentStep;
              if (!isVisible) return null;

              const pos = stroke.numberPoint || { x: stroke.startPoint.x - 4, y: stroke.startPoint.y - 4 };

              return (
                <g key={`anim-stroke-${idx}`}>
                  {isCurrent && (
                    <path
                      d={stroke.d}
                      fill="none"
                      stroke="#C83C50"
                      strokeWidth="12"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="opacity-40 animate-pulse"
                    />
                  )}
                  <path
                    d={stroke.d}
                    fill="none"
                    stroke={isCurrent ? "#C83C50" : "#FFFFFF"}
                    strokeWidth="7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-all duration-300"
                  />
                  {showNumbers && (
                    <g>
                      <circle cx={pos.x} cy={pos.y} r="5.2" fill="#C83C50" stroke="#FFFFFF" strokeWidth="1" />
                      <text
                        x={pos.x}
                        y={pos.y + 0.3}
                        fontSize="5"
                        fontWeight="bold"
                        fill="#FFFFFF"
                        textAnchor="middle"
                        dominantBaseline="central"
                        className="select-none pointer-events-none"
                      >
                        {strokeNum}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

          {/* 3. Mode: Guided Practice Renderer */}
          {mode === "practice" && (
            <g>
              {/* Highlight the next required stroke in pulsing red if guide enabled */}
              {showGuide && practiceStep < strokes.length && (
                <path
                  d={strokes[practiceStep].d}
                  fill="none"
                  stroke="#C83C50"
                  strokeWidth="9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="opacity-50 animate-pulse"
                />
              )}

              {/* Number Badges for Guided Practice */}
              {showNumbers &&
                strokes.map((stroke, idx) => {
                  const isCurrent = idx === practiceStep;
                  const isPassed = idx < practiceStep;
                  const badgeColor = isPassed ? "#10B981" : isCurrent ? "#C83C50" : "#E8E0D5";
                  const textColor = isPassed || isCurrent ? "#FFFFFF" : "#101C35";
                  const pos = stroke.numberPoint || { x: stroke.startPoint.x - 4, y: stroke.startPoint.y - 4 };

                  return (
                    <g key={`practice-badge-${idx}`}>
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r={isCurrent ? "6" : "5"}
                        fill={badgeColor}
                        stroke="#FFFFFF"
                        strokeWidth="1"
                        className={isCurrent ? "animate-bounce" : ""}
                      />
                      <text
                        x={pos.x}
                        y={pos.y + 0.3}
                        fontSize="5"
                        fontWeight="bold"
                        fill={textColor}
                        textAnchor="middle"
                        dominantBaseline="central"
                        className="select-none pointer-events-none"
                      >
                        {idx + 1}
                      </text>
                    </g>
                  );
                })}
            </g>
          )}
        </svg>

        {/* User Practice Drawing Canvas (100% 1-to-1 coordinate aligned with SVG) */}
        <canvas
          ref={canvasRef}
          width={320}
          height={320}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="absolute inset-0 w-full h-full cursor-crosshair touch-none z-10"
        />

        {/* Bottom Right Step Indicator Badge */}
        <div className="absolute bottom-2.5 right-3 z-20 px-2.5 py-0.5 rounded-full bg-[#101C35]/90 border border-[#E8E0D5]/20 text-[10px] text-[#E8E0D5]/90 font-mono flex items-center space-x-1.5 shadow">
          {mode === "practice" ? (
            <>
              {practiceCompleted && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
              <span>
                {t("script_step_indicator", practiceStep, actualStrokeCount)}
              </span>
            </>
          ) : (
            <>
              {currentStep >= actualStrokeCount && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
              <span>
                {t("script_step_indicator", currentStep, actualStrokeCount)}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Real-time Feedback Banner for Practice Mode */}
      {mode === "practice" && practiceFeedback && (
        <div
          className={`px-4 py-2.5 rounded-2xl text-xs font-semibold flex items-center justify-between transition-all ${
            practiceFeedback.type === "success"
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
              : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
          }`}
        >
          <div className="flex items-center space-x-2">
            {practiceFeedback.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            )}
            <span>{practiceFeedback.message}</span>
          </div>

          {practiceCompleted && (
            <button
              onClick={handleRestartPractice}
              className="ml-3 px-2.5 py-1 rounded-xl bg-emerald-500/30 hover:bg-emerald-500/40 text-emerald-200 text-xs font-bold transition-colors"
            >
              {t("script_retry_char")}
            </button>
          )}
        </div>
      )}

      {/* Controls Section Depending on Active Mode */}
      {mode === "animate" ? (
        /* Animation Playback Controls */
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-center space-x-2">
            {/* Previous Stroke */}
            <button
              onClick={handleStepPrev}
              disabled={currentStep <= 0}
              className="p-2.5 rounded-xl bg-[#E8E0D5]/10 hover:bg-[#E8E0D5]/20 disabled:opacity-40 text-[#FFFFFF] transition-all"
              title={t("script_prev_stroke")}
              aria-label={t("script_prev_stroke")}
            >
              <SkipBack className="w-4 h-4" />
            </button>

            {/* Play / Pause Toggle */}
            {isPlaying ? (
              <button
                onClick={handlePause}
                className="px-5 py-2.5 rounded-xl bg-[#C83C50] hover:bg-[#B03244] text-[#FFFFFF] font-bold text-xs flex items-center space-x-1.5 shadow-lg shadow-[#C83C50]/30 transition-all"
              >
                <Pause className="w-4 h-4 fill-current" />
                <span>{t("script_pause")}</span>
              </button>
            ) : (
              <button
                onClick={handlePlay}
                className="px-5 py-2.5 rounded-xl bg-[#C83C50] hover:bg-[#B03244] text-[#FFFFFF] font-bold text-xs flex items-center space-x-1.5 shadow-lg shadow-[#C83C50]/30 transition-all"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{t("script_play")}</span>
              </button>
            )}

            {/* Next Stroke */}
            <button
              onClick={handleStepNext}
              disabled={currentStep >= actualStrokeCount}
              className="p-2.5 rounded-xl bg-[#E8E0D5]/10 hover:bg-[#E8E0D5]/20 disabled:opacity-40 text-[#FFFFFF] transition-all"
              title={t("script_next_stroke")}
              aria-label={t("script_next_stroke")}
            >
              <SkipForward className="w-4 h-4" />
            </button>

            {/* Replay */}
            <button
              onClick={handleReplay}
              className="p-2.5 rounded-xl bg-[#E8E0D5]/10 hover:bg-[#E8E0D5]/20 text-[#FFFFFF] transition-all"
              title={t("script_replay")}
              aria-label={t("script_replay")}
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Restart */}
            <button
              onClick={handleReset}
              className="px-3 py-2.5 rounded-xl bg-[#E8E0D5]/10 hover:bg-[#E8E0D5]/20 text-xs font-semibold text-[#FFFFFF] transition-all"
              title={t("script_restart")}
            >
              <span>{t("script_restart")}</span>
            </button>
          </div>

          {/* Speed & Guide Row */}
          <div className="flex items-center justify-between pt-2 border-t border-[#E8E0D5]/15 text-xs">
            <div className="flex items-center space-x-1.5">
              <span className="text-[#E8E0D5]/60 text-[11px] mr-1">{t("script_speed")}:</span>
              {[0.5, 1, 1.5, 2].map((spd) => (
                <button
                  key={`spd-${spd}`}
                  onClick={() => setPlaybackSpeed(spd)}
                  className={`px-2 py-1 rounded-md text-[11px] font-mono font-bold transition-all ${
                    playbackSpeed === spd
                      ? "bg-[#C83C50] text-[#FFFFFF]"
                      : "bg-[#E8E0D5]/10 text-[#E8E0D5]/70 hover:bg-[#E8E0D5]/20"
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-1.5">
              <button
                onClick={() => setShowNumbers(!showNumbers)}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  showNumbers ? "bg-[#C83C50]/20 text-[#C83C50]" : "bg-[#E8E0D5]/10 text-[#E8E0D5]/70"
                }`}
                title="Toggle Stroke Numbers"
              >
                <Hash className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setShowGuide(!showGuide)}
                className="px-2.5 py-1 rounded-lg text-xs bg-[#E8E0D5]/10 hover:bg-[#E8E0D5]/20 text-[#E8E0D5] flex items-center space-x-1 transition-colors"
              >
                {showGuide ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showGuide ? t("script_hide_guide") : t("script_show_guide")}</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Practice / Freehand Canvas Controls */
        <div className="flex items-center justify-between pt-2 border-t border-[#E8E0D5]/15 text-xs">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setBrushColor("#C83C50")}
              className={`w-6 h-6 rounded-full bg-[#C83C50] border-2 transition-all ${
                brushColor === "#C83C50" ? "border-[#FFFFFF] scale-110 shadow" : "border-transparent"
              }`}
              title={t("script_brush_red")}
            />
            <button
              onClick={() => setBrushColor("#FFFFFF")}
              className={`w-6 h-6 rounded-full bg-[#FFFFFF] border-2 transition-all ${
                brushColor === "#FFFFFF" ? "border-[#C83C50] scale-110 shadow" : "border-transparent"
              }`}
              title={t("script_brush_white")}
            />

            <button
              onClick={() => setShowGuide(!showGuide)}
              className="px-2.5 py-1.5 rounded-lg text-xs bg-[#E8E0D5]/10 hover:bg-[#E8E0D5]/20 text-[#E8E0D5] flex items-center space-x-1 transition-colors"
            >
              {showGuide ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showGuide ? t("script_hide_guide") : t("script_show_guide")}</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            {mode === "practice" && (
              <button
                onClick={handleRestartPractice}
                className="px-3 py-1.5 rounded-lg bg-[#E8E0D5]/10 hover:bg-[#E8E0D5]/20 text-[#E8E0D5] text-xs font-semibold transition-colors"
              >
                {t("script_restart")}
              </button>
            )}

            <button
              onClick={clearCanvas}
              className="px-3 py-1.5 rounded-lg bg-[#E8E0D5]/10 hover:bg-[#E8E0D5]/20 text-[#E8E0D5] text-xs font-semibold flex items-center space-x-1.5 transition-colors"
            >
              <span>{t("script_clear_canvas")}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
