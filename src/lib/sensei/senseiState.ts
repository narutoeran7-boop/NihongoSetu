// ==============================================================================
// NIHONGOSETU — MULTILINGUAL SENSEI STATE & PERSISTENCE
// Manages independent Input, Response/Explanation, Conversation, and Voice languages
// ==============================================================================

export interface SenseiLanguageSettings {
  inputLanguage: string; // "auto" | language code ("en", "ta", "ja", "fr", "es", "hi", etc.)
  responseLanguage: string; // language code ("en", "ta", "ja", "fr", "es", "hi", etc.)
  explanationLanguage: string; // alias/synced with responseLanguage
  conversationLanguage: string; // "auto" | language code
  voiceOutputLanguage: string; // "follow_response" | "follow_explanation" | "none" | specific language code
  voiceName: string; // specific voice name or "default"
  languageMode: "auto" | "custom";
}

export const DEFAULT_SENSEI_SETTINGS: SenseiLanguageSettings = {
  inputLanguage: "auto",
  responseLanguage: "en", // Universal, clear default — easily changed to any language
  explanationLanguage: "en",
  conversationLanguage: "auto",
  voiceOutputLanguage: "follow_explanation",
  voiceName: "default",
  languageMode: "auto",
};

const STORAGE_KEY = "nihongosetu_sensei_settings_v3";

export function getSenseiSettings(): SenseiLanguageSettings {
  if (typeof window === "undefined") {
    return DEFAULT_SENSEI_SETTINGS;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem("nihongosetu_sensei_settings_v2");
    if (!raw) return DEFAULT_SENSEI_SETTINGS;

    const parsed = JSON.parse(raw);
    const respLang = typeof parsed.responseLanguage === "string"
      ? parsed.responseLanguage
      : typeof parsed.explanationLanguage === "string"
      ? parsed.explanationLanguage
      : DEFAULT_SENSEI_SETTINGS.responseLanguage;

    return {
      inputLanguage: typeof parsed.inputLanguage === "string" ? parsed.inputLanguage : DEFAULT_SENSEI_SETTINGS.inputLanguage,
      responseLanguage: respLang,
      explanationLanguage: respLang,
      conversationLanguage: typeof parsed.conversationLanguage === "string" ? parsed.conversationLanguage : DEFAULT_SENSEI_SETTINGS.conversationLanguage,
      voiceOutputLanguage: typeof parsed.voiceOutputLanguage === "string" ? parsed.voiceOutputLanguage : DEFAULT_SENSEI_SETTINGS.voiceOutputLanguage,
      voiceName: typeof parsed.voiceName === "string" ? parsed.voiceName : DEFAULT_SENSEI_SETTINGS.voiceName,
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
  
  // Synchronize responseLanguage and explanationLanguage
  let targetResponseLang = current.responseLanguage;
  if (typeof partial.responseLanguage === "string") {
    targetResponseLang = partial.responseLanguage;
  } else if (typeof partial.explanationLanguage === "string") {
    targetResponseLang = partial.explanationLanguage;
  }

  const updated: SenseiLanguageSettings = {
    ...current,
    ...partial,
    responseLanguage: targetResponseLang,
    explanationLanguage: targetResponseLang,
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

