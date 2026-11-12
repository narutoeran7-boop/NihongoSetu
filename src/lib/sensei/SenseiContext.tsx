"use client";

// ==============================================================================
// NIHONGOSETU — GLOBAL SENSEI CONTEXT PROVIDER
// Provides website-wide language configuration, active page context, and modal state
// ==============================================================================

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import {
  SenseiLanguageSettings,
  DEFAULT_SENSEI_SETTINGS,
  getSenseiSettings,
  saveSenseiSettings,
} from "./senseiState";
import { UniversalLanguage, getLanguageByCode } from "./languages";

export interface ActivePageContext {
  pathname: string;
  pageTitle?: string;
  category?: "kana" | "kanji" | "vocab" | "grammar" | "exam" | "dashboard" | "general";
  selectedItem?: Record<string, unknown>;
  selectedText?: string;
}

interface SenseiContextValue {
  settings: SenseiLanguageSettings;
  updateSettings: (partial: Partial<SenseiLanguageSettings>) => void;
  activeLanguage: UniversalLanguage;
  pageContext: ActivePageContext;
  setPageContext: (ctx: Partial<ActivePageContext>) => void;
  isFloatingOpen: boolean;
  setIsFloatingOpen: (open: boolean) => void;
  toggleFloating: () => void;
  askSensei: (initialPrompt?: string, contextOverride?: Record<string, unknown>) => void;
  preloadedPrompt: string | null;
  clearPreloadedPrompt: () => void;
}

const SenseiContext = createContext<SenseiContextValue | null>(null);

export function SenseiProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [settings, setSettingsState] = useState<SenseiLanguageSettings>(DEFAULT_SENSEI_SETTINGS);
  const [pageContext, setPageContextState] = useState<ActivePageContext>({
    pathname: pathname || "/",
  });
  const [isFloatingOpen, setIsFloatingOpen] = useState(false);
  const [preloadedPrompt, setPreloadedPrompt] = useState<string | null>(null);

  useEffect(() => {
    // Load persisted language preferences from localStorage after mount
    const saved = getSenseiSettings();
    setSettingsState(saved);
  }, []);

  // Update pathname in page context whenever route changes
  useEffect(() => {
    setPageContextState((prev) => ({
      ...prev,
      pathname: pathname || "/",
    }));
  }, [pathname]);

  const updateSettings = useCallback((partial: Partial<SenseiLanguageSettings>) => {
    const updated = saveSenseiSettings(partial);
    setSettingsState(updated);
  }, []);

  const setPageContext = useCallback((ctx: Partial<ActivePageContext>) => {
    setPageContextState((prev) => ({
      ...prev,
      ...ctx,
    }));
  }, []);

  const toggleFloating = useCallback(() => {
    setIsFloatingOpen((prev) => !prev);
  }, []);

  const askSensei = useCallback(
    (initialPrompt?: string, contextOverride?: Record<string, unknown>) => {
      if (contextOverride) {
        setPageContextState((prev) => ({
          ...prev,
          selectedItem: contextOverride,
        }));
      }
      if (initialPrompt) {
        setPreloadedPrompt(initialPrompt);
      }
      setIsFloatingOpen(true);
    },
    []
  );

  const clearPreloadedPrompt = useCallback(() => {
    setPreloadedPrompt(null);
  }, []);

  const activeLanguage =
    getLanguageByCode(settings.explanationLanguage) || {
      code: "en",
      name: "English",
      nativeName: "English",
      speechCode: "en-US",
      region: "Indian",
      keywords: ["english"],
    };

  return (
    <SenseiContext.Provider
      value={{
        settings,
        updateSettings,
        activeLanguage,
        pageContext,
        setPageContext,
        isFloatingOpen,
        setIsFloatingOpen,
        toggleFloating,
        askSensei,
        preloadedPrompt,
        clearPreloadedPrompt,
      }}
    >
      {children}
    </SenseiContext.Provider>
  );
}

export function useSensei() {
  const ctx = useContext(SenseiContext);
  if (!ctx) {
    throw new Error("useSensei must be used within a SenseiProvider");
  }
  return ctx;
}

