"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { KanjiStroke, getKanjiStrokes } from "@/data/kanjiStrokes";
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  Eye,
  EyeOff,
  Volume2,
} from "lucide-react";

interface KanjiStrokePlayerProps {
  character: string;
  strokeCount: number;
  radical?: string;
  radicalName?: string;
  onAudioPlay?: () => void;
}

export default function KanjiStrokePlayer({
  character,
  strokeCount,
  radical,
  radicalName,
  onAudioPlay,
}: KanjiStrokePlayerProps) {
  const strokes: KanjiStroke[] = getKanjiStrokes(character, strokeCount);
  const actualStrokeCount = strokeCount || strokes.length || 1;

  // Animation state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(actualStrokeCount);
  const [showNumbers, setShowNumbers] = useState(true);
  const [showGuide, setShowGuide] = useState(true);
  const [brushColor, setBrushColor] = useState<string>("#C83C50");

  // Canvas drawing state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

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

  // Reset when character changes
  useEffect(() => {
    setIsPlaying(false);
    setCurrentStep(actualStrokeCount);
    clearCanvas();
  }, [character, actualStrokeCount]);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);
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

  return (
    <div className="space-y-4">
      {/* Stroke Animation Stage */}
      <div className="relative w-full aspect-square max-w-[280px] sm:max-w-[300px] mx-auto rounded-3xl bg-[#0B1323] border-2 border-[#E8E0D5]/25 overflow-hidden shadow-inner flex items-center justify-center">
        {/* Crosshair guidelines */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-full h-px border-b border-dashed border-[#E8E0D5]/15" />
          <div className="h-full w-px border-r border-dashed border-[#E8E0D5]/15 absolute" />
        </div>

        {/* Ghost character */}
        {showGuide && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <span className="text-[170px] font-black font-japanese text-[#FFFFFF]/10 leading-none">
              {character}
            </span>
          </div>
        )}

        {/* SVG Stroke Vector Renderer */}
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full pointer-events-none p-4"
        >
          {strokes.map((stroke, idx) => {
            const strokeNum = idx + 1;
            const isVisible = strokeNum <= currentStep;
            const isCurrent = strokeNum === currentStep;

            if (!isVisible) return null;

            return (
              <g key={`stroke-${character}-${strokeNum}`}>
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

        {/* Drawing Canvas */}
        <canvas
          ref={canvasRef}
          width={300}
          height={300}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="absolute inset-0 w-full h-full cursor-crosshair touch-none z-10"
        />

        {/* Step indicator */}
        <div className="absolute bottom-2.5 right-3 z-20 px-2 py-0.5 rounded-full bg-[#101C35]/80 border border-[#E8E0D5]/20 text-[10px] text-[#E8E0D5]/80 font-mono">
          {currentStep} / {actualStrokeCount} 画
        </div>
      </div>

      {/* Playback & Step Controls */}
      <div className="flex flex-col space-y-2.5">
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => {
              setIsPlaying(false);
              setCurrentStep((p) => Math.max(0, p - 1));
            }}
            disabled={currentStep <= 0}
            className="p-2 rounded-xl bg-[#E8E0D5]/10 hover:bg-[#E8E0D5]/20 disabled:opacity-40 text-[#FFFFFF] transition-all"
            title="前へ (Previous stroke)"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>

          {isPlaying ? (
            <button
              onClick={() => setIsPlaying(false)}
              className="px-4 py-2 rounded-xl bg-[#C83C50] text-[#FFFFFF] font-bold text-xs flex items-center space-x-1 shadow"
            >
              <Pause className="w-3.5 h-3.5 fill-current" />
              <span>一時停止</span>
            </button>
          ) : (
            <button
              onClick={() => {
                if (currentStep >= actualStrokeCount) setCurrentStep(1);
                setIsPlaying(true);
              }}
              className="px-4 py-2 rounded-xl bg-[#C83C50] hover:bg-[#B03244] text-[#FFFFFF] font-bold text-xs flex items-center space-x-1 shadow"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>書き順再生</span>
            </button>
          )}

          <button
            onClick={() => {
              setIsPlaying(false);
              setCurrentStep((p) => Math.min(actualStrokeCount, p + 1));
            }}
            disabled={currentStep >= actualStrokeCount}
            className="p-2 rounded-xl bg-[#E8E0D5]/10 hover:bg-[#E8E0D5]/20 disabled:opacity-40 text-[#FFFFFF] transition-all"
            title="次へ (Next stroke)"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              setIsPlaying(false);
              setCurrentStep(1);
              setTimeout(() => setIsPlaying(true), 150);
            }}
            className="p-2 rounded-xl bg-[#E8E0D5]/10 hover:bg-[#E8E0D5]/20 text-[#FFFFFF] transition-all"
            title="もう一度 (Replay)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Practice Canvas Controls */}
        <div className="flex items-center justify-between text-xs pt-2 border-t border-[#E8E0D5]/15">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setBrushColor("#C83C50")}
              className={`w-5 h-5 rounded-full bg-[#C83C50] border-2 ${
                brushColor === "#C83C50" ? "border-[#FFFFFF]" : "border-transparent"
              }`}
              title="朱色"
            />
            <button
              onClick={() => setBrushColor("#FFFFFF")}
              className={`w-5 h-5 rounded-full bg-[#FFFFFF] border-2 ${
                brushColor === "#FFFFFF" ? "border-[#C83C50]" : "border-transparent"
              }`}
              title="白墨"
            />
            <button
              onClick={() => setShowGuide(!showGuide)}
              className="px-2 py-1 rounded-lg text-[11px] bg-[#E8E0D5]/10 hover:bg-[#E8E0D5]/20 text-[#E8E0D5] flex items-center space-x-1"
            >
              {showGuide ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              <span>{showGuide ? "お手本を隠す" : "お手本を表示"}</span>
            </button>
          </div>

          <button
            onClick={clearCanvas}
            className="px-2.5 py-1 rounded-lg bg-[#E8E0D5]/10 hover:bg-[#E8E0D5]/20 text-[#E8E0D5] text-[11px] font-semibold"
          >
            消去
          </button>
        </div>
      </div>
    </div>
  );
}
