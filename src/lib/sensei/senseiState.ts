// ==============================================================================
// NIHONGOSETU — MULTILINGUAL SENSEI STATE & PERSISTENCE
// Manages independent Input, Explanation, Conversation, and Voice languages
// ==============================================================================

export interface SenseiLanguageSettings {
  inputLanguage: string; // "auto" | language code ("en", "ta", "ja", "fr", "es", "hi", etc.)
  explanationLanguage: string; // language code ("en", "ta", "ja", "fr", "es", "hi", etc.)
  conversationLanguage: string; // "auto" | language code
  voiceOutputLanguage: string; // "follow_explanation" | "follow_conversation" | specific language code
  languageMode: "auto" | "custom";
}

export const DEFAULT_SENSEI_SETTINGS: SenseiLanguageSettings = {
  inputLanguage: "auto",
  explanationLanguage: "en", // Universal, clear default — easily changed to any language
  conversationLanguage: "auto",
  voiceOutputLanguage: "follow_explanation",
  languageMode: "auto",
};

const STORAGE_KEY = "nihongosetu_sensei_settings_v2";

export function getSenseiSettings(): SenseiLanguageSettings {
  if (typeof window === "undefined") {
    return DEFAULT_SENSEI_SETTINGS;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SENSEI_SETTINGS;

    const parsed = JSON.parse(raw);
    return {
      inputLanguage: typeof parsed.inputLanguage === "string" ? parsed.inputLanguage : DEFAULT_SENSEI_SETTINGS.inputLanguage,
      explanationLanguage: typeof parsed.explanationLanguage === "string" ? parsed.explanationLanguage : DEFAULT_SENSEI_SETTINGS.explanationLanguage,
      conversationLanguage: typeof parsed.conversationLanguage === "string" ? parsed.conversationLanguage : DEFAULT_SENSEI_SETTINGS.conversationLanguage,
      voiceOutputLanguage: typeof parsed.voiceOutputLanguage === "string" ? parsed.voiceOutputLanguage : DEFAULT_SENSEI_SETTINGS.voiceOutputLanguage,
      languageMode: parsed.languageMode === "custom" ? "custom" : "auto",
    };
  } catch {
    return DEFAULT_SENSEI_SETTINGS;
  }
}

export function saveSenseiSettings(
  partial: Partial<SenseiLanguageSettings>
): SenseiLanguageSettings {
  const current = getSenseiSettings();
  const updated: SenseiLanguageSettings = {
    ...current,
    ...partial,
  };

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Storage quota or private browsing safeguard
    }
  }

  return updated;
}
