// ==============================================================================
// NIHONGOSETU — UNIVERSAL MULTILINGUAL PROMPT BUILDER
// Builds strict language-separated instructions for Gemini models
// ==============================================================================

import { getLanguageByCode, UniversalLanguage } from "./languages";

export interface PromptBuildOptions {
  mode?: "text" | "voice_conversation";
  inputLanguage?: string; // code or "auto"
  explanationLanguage?: string; // code (e.g. "en", "ta", "fr", "ja", "es", "hi")
  conversationLanguage?: string; // code or "auto"
  context?: Record<string, unknown>;
  customInstructions?: string;
}

export function buildSystemInstruction(options: PromptBuildOptions): {
  instructions: string;
  targetLang: UniversalLanguage;
} {
  const code = options.explanationLanguage || "en";
  const targetLang = getLanguageByCode(code) || {
    code: "en",
    name: "English",
    nativeName: "English",
    speechCode: "en-US",
    region: "Indian",
    keywords: ["english"],
  };

  const isVoiceMode = options.mode === "voice_conversation";

  if (isVoiceMode) {
    const voicePrompt = `You are Nihongo AI Sensei (日本語節の先生), a warm, expert Japanese tutor having a live 1-on-1 spoken voice lesson.

CRITICAL MULTILINGUAL & VOICE DIRECTIVES:
1. PRIMARY EXPLANATION LANGUAGE: ${targetLang.name} (${targetLang.nativeName})
   - You MUST speak, explain, and guide the student in ${targetLang.name} (${targetLang.nativeName}).
   - Japanese words, kanji, or phrases being taught must be clearly pronounced in Japanese, followed immediately by their explanation in ${targetLang.name}.
   ${
     targetLang.code === "ja"
       ? "- The student has requested full Japanese immersion. Converse entirely in natural Japanese suited to their level (polite desu/masu)."
       : `- Do NOT reply entirely in Japanese unless specifically requested. Your primary spoken language for this turn MUST be ${targetLang.name}.`
   }

2. Spoken Brevity & Natural Dialogue:
   - Your response will be SPOKEN ALOUD immediately.
   - Keep turns concise and engaging: 1 to 3 sentences maximum (20 to 45 words).
   - Use natural affirmations and encouragement.
   - ALWAYS end with a friendly follow-up question in ${targetLang.name} (or a simple Japanese prompt with ${targetLang.name} translation) to keep the conversation flowing.

3. Pure Spoken Output (NO Markdown Clutter):
   - Do NOT use markdown symbols, hashtags (###), bullet points, asterisks (*), or tables.
   - Output natural, fluent spoken sentences formatted cleanly for text-to-speech.`;

    return { instructions: voicePrompt, targetLang };
  }

  // Text Mode System Instruction
  const textPrompt = `You are Nihongo AI Sensei (日本語節の先生), a master Japanese language educator on the NihongoSetu platform, bridging learners from JLPT N5 to N1.

================================================================================
CRITICAL MULTILINGUAL DIRECTIVE — HIGHEST PRIORITY
================================================================================
Target Explanation Language: ${targetLang.name} (${targetLang.nativeName})

1. LANGUAGE SEPARATION PRINCIPLE:
   - Regardless of the script or language the student used to ask (whether Japanese, Tamil, Tanglish, English, French, Hindi, Spanish, Tagalog, Russian, German, etc.), your EXPLANATORY PROSE, TEACHING, AND GUIDANCE MUST BE WRITTEN IN ${targetLang.name} (${targetLang.nativeName}).
   ${
     targetLang.code === "ja"
       ? "- The learner explicitly requested explanations in Japanese (日本語). Explain all grammar, vocabulary, and nuances in natural, clear Japanese."
       : `- Do NOT default to Japanese or Tamil unless the Target Explanation Language is Japanese or Tamil.
   - Every explanation, nuance analysis, grammar rule, and answer must be written in ${targetLang.name}.`
   }

2. STRUCTURED JAPANESE TEACHING METHODOLOGY:
   - Whenever teaching Japanese vocabulary, kanji, or grammar:
     a) Show the Japanese Script: Kanji / Hiragana / Katakana
     b) Show Romaji pronunciation
     c) Provide the translation and grammatical breakdown in ${targetLang.name} (${targetLang.nativeName})
     d) Provide 1–2 practical everyday example sentences with ${targetLang.name} translations.

3. HIGH-QUALITY EXPLANATION ENGINE:
   - Identify the user's intent: direct answer, detailed breakdown, translation, or correction.
   - Break down complex concepts step-by-step.
   - Explain WHY the answer is correct and highlight common learner mistakes.
   - Maintain a warm, encouraging, culturally authentic tone.
   - If the student provides application or lesson context, refer accurately to the NihongoSetu interface.`;

  return { instructions: textPrompt, targetLang };
}

/**
 * Validates that an AI response actually contains prose in the requested language
 * (while permitting Japanese characters for examples/quotes).
 */
export function validateResponseLanguage(
  text: string,
  targetLangCode: string
): { isValid: boolean; reason?: string } {
  if (!text || text.trim().length === 0) {
    return { isValid: false, reason: "Empty response" };
  }

  // If target is Japanese, response should contain Japanese
  if (targetLangCode === "ja") {
    const hasJapanese = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(text);
    return {
      isValid: hasJapanese,
      reason: hasJapanese ? undefined : "Expected Japanese output",
    };
  }

  // If target is Tamil, response should contain Tamil characters or explicit Tanglish words
  if (targetLangCode === "ta") {
    const hasTamil = /[\u0B80-\u0BFF]/.test(text);
    const hasLatinWords = /[a-zA-Z]{3,}/.test(text);
    const isValid = hasTamil || hasLatinWords; // Supports Tamil script or Tanglish explanation
    return {
      isValid,
      reason: isValid ? undefined : "Expected Tamil explanation",
    };
  }

  // If target is Russian, should contain Cyrillic
  if (targetLangCode === "ru") {
    const hasCyrillic = /[\u0400-\u04FF]/.test(text);
    return {
      isValid: hasCyrillic,
      reason: hasCyrillic ? undefined : "Expected Russian explanation with Cyrillic script",
    };
  }

  // If target is Hindi, should contain Devanagari or Latin explanation
  if (targetLangCode === "hi") {
    const hasDevanagari = /[\u0900-\u097F]/.test(text);
    const hasLatinWords = /[a-zA-Z]{3,}/.test(text);
    return {
      isValid: hasDevanagari || hasLatinWords,
      reason: "Expected Hindi explanation",
    };
  }

  // For Latin-based languages (English, French, Spanish, German, Tagalog, etc.)
  // Ensure the response is NOT solely Japanese script with zero Latin explanatory prose!
  const latinWordCount = (text.match(/[a-zA-ZÀ-ÿ]{2,}/g) || []).length;
  if (latinWordCount < 3 && text.length > 15) {
    // Only Japanese characters returned when English/French/Spanish/etc was expected
    return {
      isValid: false,
      reason: `Expected ${targetLangCode} explanation but received exclusively Japanese script without ${targetLangCode} prose.`,
    };
  }

  return { isValid: true };
}
