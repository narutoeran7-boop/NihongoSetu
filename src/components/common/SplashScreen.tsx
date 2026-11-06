"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

interface SplashScreenProps {
  /** Duration in milliseconds before fading out starts (default: 850ms) */
  minDuration?: number;
  /** Whether to show only once per browser session */
  oncePerSession?: boolean;
}

export default function SplashScreen({
  minDuration = 850,
  oncePerSession = true,
}: SplashScreenProps) {
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (oncePerSession) {
      const hasShown = sessionStorage.getItem("nihongosetu_splash_shown");
      if (hasShown) return;
    }

    // Activate splash
    setVisible(true);

    const timer = setTimeout(() => {
      setFading(true);
      const exitTimer = setTimeout(() => {
        setVisible(false);
        if (oncePerSession) {
          sessionStorage.setItem("nihongosetu_splash_shown", "true");
        }
      }, 450); // Matches CSS transition duration

      return () => clearTimeout(exitTimer);
    }, minDuration);

    return () => clearTimeout(timer);
  }, [minDuration, oncePerSession]);

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-label="Loading NihongoSetu"
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#030F27] transition-opacity duration-500 ease-out ${
        fading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Background radial atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0d2358] via-[#030F27] to-[#010714] pointer-events-none" />

      {/* Centered Artwork Card */}
      <div className="relative z-10 flex flex-col items-center max-w-[380px] sm:max-w-[440px] px-6 text-center animate-in fade-in zoom-in-95 duration-500">
        <div className="relative w-72 h-72 sm:w-80 sm:h-80 drop-shadow-[0_15px_35px_rgba(200,60,80,0.25)]">
          <Image
            src="/splash/splash-master.png"
            alt="NihongoSetu Japanese Learning App"
            fill
            priority
            sizes="(max-width: 640px) 288px, 320px"
            className="object-contain"
          />
        </div>

        {/* Minimal Japanese aesthetic loading pulse */}
        <div className="mt-4 flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-[#C83C50] animate-pulse" />
          <span className="text-xs font-semibold tracking-wider text-[#E8E0D5]/70 uppercase">
            日本語への架け橋
          </span>
          <span className="w-2 h-2 rounded-full bg-[#C83C50] animate-pulse delay-150" />
        </div>
      </div>
    </div>
  );
}

