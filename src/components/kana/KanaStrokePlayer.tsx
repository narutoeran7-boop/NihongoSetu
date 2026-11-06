"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { KanaStroke, getKanaStrokes } from "@/data/kanaStrokes";
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  Eye,
  EyeOff,
  PenTool,
  Volume2,
} from "lucide-react";

interface KanaStrokePlayerProps {
  char: string;
  romaji: string;
  scriptType: "hira" | "kata";
  strokeCount: number;
  onAudioPlay?: () => void;
}

export default function KanaStrokePlayer({
  char,
  romaji,
  scriptType,
  strokeCount,
  onAudioPlay,
}: KanaStrokePlayerProps) {
  const strokes: KanaStroke[] = getKanaStrokes(char, scriptType);
  const actualStrokeCount = strokes.length > 0 ? strokes.length : strokeCount;

  // Animation state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(actualStrokeCount); // 1-based, 0 = none, actualStrokeCount = all drawn
  const [showNumbers, setShowNumbers] = useState(true);
  const [showGuide, setShowGuide] = useState(true);
  const [brushColor, setBrushColor] = useState<string>("#C83C50");

  // Canvas drawing state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  // Auto-play timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= actualStrokeCount) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 750);
    }
    return () => clearInterval(timer);
  }, [isPlaying, actualStrokeCount]);

  // Reset when char changes
  useEffect(() => {
    setIsPlaying(false);
    setCurrentStep(actualStrokeCount);
    clearCanvas();
  }, [char, scriptType, actualStrokeCount]);

  // Canvas drawing handlers
  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);
    setHasDrawn(true);
    const rect = canvas.getBoundingClientRect();
    const clientX = "clientX" in e ? e.clientX : e.touches[0].clientX;
    const clientY = "clientY" in e ? e.clientY : e.touches[0].clientY;
    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = 14;
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

    const rect = canvas.getBoundingClientRect();
    const clientX = "clientX" in e ? e.clientX : e.touches[0].clientX;
    const clientY = "clientY" in e ? e.clientY : e.touches[0].clientY;
    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  // Playback actions
  const handlePlay = () => {
    if (currentStep >= actualStrokeCount) {
      setCurrentStep(1);
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleReplay = () => {
    setIsPlaying(false);
    setCurrentStep(1);
    setTimeout(() => setIsPlaying(true), 150);
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
    setCurrentStep(actualStrokeCount);
    clearCanvas();
  };

  return (
    <div className="bg-[#101C35] border border-[#E8E0D5]/20 rounded-3xl p-6 sm:p-7 space-y-6 shadow-2xl">
      {/* Top Header Card: Japanese Character & Reading */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E8E0D5]/15">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-[#0B1323] border border-[#E8E0D5]/25 flex items-center justify-center text-4xl font-black font-japanese text-[#FFFFFF] shadow-inner">
            {char}
          </div>
          <div>
            <div className="text-sm font-bold text-[#FFFFFF] flex items-center space-x-2">
              <span className="text-xs text-[#E8E0D5]/60 font-normal">ローマ字:</span>
              <span className="text-[#C83C50] text-base">{romaji}</span>
            </div>
            <div className="text-xs text-[#E8E0D5]/70 mt-0.5">
              画数: <span className="font-bold text-[#FFFFFF]">{actualStrokeCount}画</span> · 正しい書き順
            </div>
          </div>
        </div>

        {onAudioPlay && (
          <button
            onClick={onAudioPlay}
            className="p-3 rounded-2xl bg-[#C83C50]/20 hover:bg-[#C83C50]/30 text-[#C83C50] border border-[#C83C50]/35 transition-all shadow active:scale-95"
            title="音声を聞く"
            aria-label="音声を聞く"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Main Interactive Stage (Stroke Animator + Canvas) */}
      <div className="relative w-full aspect-square max-w-[320px] mx-auto rounded-3xl bg-[#0B1323] border-2 border-[#E8E0D5]/25 overflow-hidden shadow-inner flex items-center justify-center">
        {/* Guide Grid Crosshairs */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-full h-px border-b border-dashed border-[#E8E0D5]/15" />
          <div className="h-full w-px border-r border-dashed border-[#E8E0D5]/15 absolute" />
        </div>

        {/* Ghost background character if guide enabled */}
        {showGuide && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <span className="text-[170px] font-black font-japanese text-[#FFFFFF]/8 leading-none">
              {char}
            </span>
          </div>
        )}

        {/* Authentic SVG Stroke Animator Engine */}
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full pointer-events-none p-4"
        >
          {/* Render Completed & Active Strokes */}
          {strokes.map((stroke, idx) => {
            const strokeNum = idx + 1;
            const isVisible = strokeNum <= currentStep;
            const isCurrent = strokeNum === currentStep;

            if (!isVisible) return null;

            return (
              <g key={`stroke-${char}-${strokeNum}`}>
                {/* Background glow for current active stroke */}
                {isCurrent && (
                  <path
                    d={stroke.d}
                    fill="none"
                    stroke="#C83C50"
                    strokeWidth="11"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="opacity-40 animate-pulse"
                  />
                )}
                {/* Main stroke line */}
                <path
                  d={stroke.d}
                  fill="none"
                  stroke={isCurrent ? "#C83C50" : "#FFFFFF"}
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-all duration-300"
                />
                {/* Stroke Number Badge */}
                {showNumbers && (
                  <g transform={`translate(${stroke.startPoint.x - 4}, ${stroke.startPoint.y - 4})`}>
                    <circle cx="4" cy="4" r="5.5" fill="#C83C50" stroke="#FFFFFF" strokeWidth="1" />
                    <text
                      x="4"
                      y="6.2"
                      fontSize="5"
                      fontWeight="bold"
                      fill="#FFFFFF"
                      textAnchor="middle"
                      className="select-none pointer-events-none"
                    >
                      {strokeNum}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* User Practice Drawing Canvas */}
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

        {/* Step Indicator Badge */}
        <div className="absolute bottom-2.5 right-3 z-20 px-2 py-0.5 rounded-full bg-[#101C35]/80 border border-[#E8E0D5]/20 text-[10px] text-[#E8E0D5]/80 font-mono">
          {currentStep} / {actualStrokeCount} 画
        </div>
      </div>

      {/* Animation Playback Controls */}
      <div className="flex flex-col space-y-3">
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={handleStepPrev}
            disabled={currentStep <= 0}
            className="p-2.5 rounded-xl bg-[#E8E0D5]/10 hover:bg-[#E8E0D5]/20 disabled:opacity-40 text-[#FFFFFF] transition-all"
            title="前へ (Previous stroke)"
            aria-label="前へ"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          {isPlaying ? (
            <button
              onClick={handlePause}
              className="px-5 py-2.5 rounded-xl bg-[#C83C50] hover:bg-[#B03244] text-[#FFFFFF] font-bold text-xs flex items-center space-x-1.5 shadow-lg shadow-[#C83C50]/30 transition-all"
            >
              <Pause className="w-4 h-4 fill-current" />
              <span>一時停止</span>
            </button>
          ) : (
            <button
              onClick={handlePlay}
              className="px-5 py-2.5 rounded-xl bg-[#C83C50] hover:bg-[#B03244] text-[#FFFFFF] font-bold text-xs flex items-center space-x-1.5 shadow-lg shadow-[#C83C50]/30 transition-all"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>再生</span>
            </button>
          )}

          <button
            onClick={handleStepNext}
            disabled={currentStep >= actualStrokeCount}
            className="p-2.5 rounded-xl bg-[#E8E0D5]/10 hover:bg-[#E8E0D5]/20 disabled:opacity-40 text-[#FFFFFF] transition-all"
            title="次へ (Next stroke)"
            aria-label="次へ"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <button
            onClick={handleReplay}
            className="p-2.5 rounded-xl bg-[#E8E0D5]/10 hover:bg-[#E8E0D5]/20 text-[#FFFFFF] transition-all"
            title="もう一度 (Replay)"
            aria-label="もう一度"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Practice Canvas Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-[#E8E0D5]/15 text-xs">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setBrushColor("#C83C50")}
              className={`w-6 h-6 rounded-full bg-[#C83C50] border-2 ${
                brushColor === "#C83C50" ? "border-[#FFFFFF]" : "border-transparent"
              }`}
              title="朱色筆 (Red Brush)"
            />
            <button
              onClick={() => setBrushColor("#FFFFFF")}
              className={`w-6 h-6 rounded-full bg-[#FFFFFF] border-2 ${
                brushColor === "#FFFFFF" ? "border-[#C83C50]" : "border-transparent"
              }`}
              title="白墨筆 (White Brush)"
            />
            <button
              onClick={() => setShowGuide(!showGuide)}
              className="px-2.5 py-1.5 rounded-lg text-xs bg-[#E8E0D5]/10 hover:bg-[#E8E0D5]/20 text-[#E8E0D5] flex items-center space-x-1 transition-colors"
            >
              {showGuide ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showGuide ? "お手本を隠す" : "お手本を表示"}</span>
            </button>
          </div>

          <button
            onClick={clearCanvas}
            className="px-3 py-1.5 rounded-lg bg-[#E8E0D5]/10 hover:bg-[#E8E0D5]/20 text-[#E8E0D5] text-xs font-semibold flex items-center space-x-1.5 transition-colors"
          >
            <span>消去</span>
          </button>
        </div>
      </div>
    </div>
  );
}
