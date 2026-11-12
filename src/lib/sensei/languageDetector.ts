// ==============================================================================
// NIHONGOSETU — EXPLICIT LANGUAGE PARSER & DETECTOR
// Detects user input language, code-switching, and explicit explanation directives
// ==============================================================================

import {
  UNIVERSAL_LANGUAGES,
  getLanguageByCode,
  findLanguageByNameOrKeyword,
} from "./languages";

export interface DetectionResult {
  detectedInputLanguage: string; // ISO code e.g. "en", "ta", "ja", "fr", "hi"
  explicitExplanationLanguage?: string; // ISO code e.g. "en", "ta", "fr", "es", "ja", etc.
  isExplicit: boolean; // True if user explicitly demanded a language
  cleanedPrompt: string; // User prompt with language instructions intact or formatted
  confidence: number;
}

// Explicit Japanese language mapping for "X語で"
const JAPANESE_LANGUAGE_NAME_MAP: Record<string, string> = {
  英語: "en",
  タミル語: "ta",
  日本語: "ja",
  ヒンディー語: "hi",
  フランス語: "fr",
  スペイン語: "es",
  ドイツ語: "de",
  ロシア語: "ru",
  中国語: "zh-CN",
  韓国語: "ko",
  タガログ語: "fil",
  フィリピン語: "fil",
  イタリア語: "it",
  アラビア語: "ar",
  ポルトガル語: "pt",
  オランダ語: "nl",
  ベトナム語: "vi",
  タイ語: "th",
  インドネシア語: "id",
};

// Common Tamil / Tanglish words to recognize Tanglish
const TANGLISH_MARKERS = [
  "enna", "epdi", "eppadi", "engae", "edhukku", "edhuku", "pannunga", "pannu",
  "sollunga", "sollu", "solli", "purila", "puriyala", "purinjidhu", "vilakku",
  "vilakkavum", "indha", "andha", "vandhadhu", "varuma", "konjam", "nalla",
  "romba", "enna difference", "venum", "koodadhu", "irukku", "irukkum"
];

// Common Filipino / Tagalog words
const TAGALOG_MARKERS = [
  "ipaliwanag", "paki", "paano", "ano", "bakit", "salamat", "kamusta",
  "kumusta", "sa tagalog", "sa filipino", "nito", "ito", "iyon", "mga", "gamitin", "kung paano"
];

// Common French markers
const FRENCH_MARKERS = [
  "expliquez", "expliquer", "en français", "en francais", "en japonais", "s'il vous plaît", "pourquoi", "comment", "cette règle"
];

// Common Spanish markers
const SPANISH_MARKERS = [
  "explica", "explicar", "en español", "por favor", "cómo", "por qué", "qué significa"
];

// Common German markers
const GERMAN_MARKERS = [
  "erkläre", "erklären", "auf deutsch", "bitte", "warum", "wie", "was bedeutet"
];

// Common Russian markers
const RUSSIAN_MARKERS = [
  "объясни", "объясните", "по-русски", "на русском", "пожалуйста", "что значит"
];

export function detectLanguages(rawPrompt: string): DetectionResult {
  const prompt = rawPrompt.trim();
  const lower = prompt.toLowerCase();

  let explicitLanguageCode: string | undefined;

  // 1. Explicit Japanese instruction: e.g. "英語で説明してください", "フランス語で教えて"
  for (const [jpName, code] of Object.entries(JAPANESE_LANGUAGE_NAME_MAP)) {
    if (prompt.includes(`${jpName}で`)) {
      explicitLanguageCode = code;
      break;
    }
  }

  // 2. Explicit English patterns: e.g. "explain this in English", "explain in French", "tell me in Spanish"
  if (!explicitLanguageCode) {
    const inLanguageMatch = lower.match(
      /(?:explain|translate|tell me|speak|talk|write|describe|convert)(?:\s+(?:this|it|everything|grammar|kanji|concept|meaning))?\s+(?:in|into|using)\s+([a-zA-Z\u0080-\uFFFF]+)/i
    );
    if (inLanguageMatch && inLanguageMatch[1]) {
      const candidate = inLanguageMatch[1].trim();
      const matched = findLanguageByNameOrKeyword(candidate);
      if (matched) {
        explicitLanguageCode = matched.code;
      }
    }
  }

  // 3. Tanglish / Tamil suffix patterns: e.g. "English-la", "English-ல", "Tamil-la", "French-la explain pannunga"
  if (!explicitLanguageCode) {
    const tanglishSuffixMatch = prompt.match(
      /([a-zA-Z]+)-(?:la|le|il|ல|இல்|இல)(?:[\s,.]|$)/i
    );
    if (tanglishSuffixMatch && tanglishSuffixMatch[1]) {
      const candidate = tanglishSuffixMatch[1].trim();
      const matched = findLanguageByNameOrKeyword(candidate);
      if (matched) {
        explicitLanguageCode = matched.code;
      }
    }
  }

  // 4. Tamil native script requests: e.g. "தமிழ்ல விளக்கு", "ஆங்கிலத்தில் விளக்குக"
  if (!explicitLanguageCode) {
    if (prompt.includes("தமிழ்ல") || prompt.includes("தமிழில்")) {
      explicitLanguageCode = "ta";
    } else if (prompt.includes("ஆங்கிலத்தில்") || prompt.includes("இங்கிலீஷ்ல")) {
      explicitLanguageCode = "en";
    } else if (prompt.includes("ஜப்பானிய மொழியில்") || prompt.includes("ஜப்பானிஸ்ல")) {
      explicitLanguageCode = "ja";
    } else if (prompt.includes("ஹிந்தியில்") || prompt.includes("இந்தில")) {
      explicitLanguageCode = "hi";
    }
  }

  // 5. Explicit foreign language self-instructions (French, Spanish, German, Russian, Arabic, Tagalog):
  if (!explicitLanguageCode) {
    if (lower.includes("en français") || lower.includes("en francais") || lower.includes("expliquez en français")) {
      explicitLanguageCode = "fr";
    } else if (lower.includes("en español") || lower.includes("en espanol") || lower.includes("explica en español")) {
      explicitLanguageCode = "es";
    } else if (lower.includes("auf deutsch") || lower.includes("erkläre auf deutsch")) {
      explicitLanguageCode = "de";
    } else if (lower.includes("на русском") || lower.includes("по-русски") || lower.includes("объясни на русском")) {
      explicitLanguageCode = "ru";
    } else if (lower.includes("sa tagalog") || lower.includes("sa filipino") || lower.includes("ipaliwanag sa tagalog")) {
      explicitLanguageCode = "fil";
    } else if (lower.includes("hindi mein") || lower.includes("हिन्दी में")) {
      explicitLanguageCode = "hi";
    } else if (lower.includes("بالعربية") || lower.includes("بالعربي")) {
      explicitLanguageCode = "ar";
    }
  }

  // 6. Direct prepositional phrases: e.g. "in Japanese", "en japonais", "in French", "sa Tagalog", "auf Deutsch", "in Spanish"
  if (!explicitLanguageCode) {
    const prepMatch = lower.match(/\b(?:in|into|using|en|auf|sa|po sa)\s+([a-zA-ZÀ-ÿ\u0080-\uFFFF]+)\b/i);
    if (prepMatch && prepMatch[1]) {
      const candidate = prepMatch[1].trim();
      const matched = findLanguageByNameOrKeyword(candidate);
      if (matched) {
        explicitLanguageCode = matched.code;
      }
    }
  }

  // --- DETECT INPUT LANGUAGE SCRIPT / TOKENS ---
  let detectedInputLanguage = "en"; // Default for Latin text
  let confidence = 0.8;

  // 1. Tamil script check (highest precision for Tamil characters)
  if (/[\u0B80-\u0BFF]/.test(prompt)) {
    detectedInputLanguage = "ta";
    confidence = 0.99;
  }
  // 2. Cyrillic (Russian, Ukrainian)
  else if (/[\u0400-\u04FF]/.test(prompt)) {
    detectedInputLanguage = "ru";
    confidence = 0.95;
  }
  // 3. Arabic
  else if (/[\u0600-\u06FF]/.test(prompt)) {
    detectedInputLanguage = "ar";
    confidence = 0.95;
  }
  // 4. Devanagari (Hindi, Sanskrit, Marathi, Nepali)
  else if (/[\u0900-\u097F]/.test(prompt)) {
    detectedInputLanguage = "hi";
    confidence = 0.95;
  }
  // 5. Korean Hangul
  else if (/[\uAC00-\uD7AF\u1100-\u11FF]/.test(prompt)) {
    detectedInputLanguage = "ko";
    confidence = 0.98;
  }
  // 6. Check Tagalog / Filipino keywords (even if a Japanese kana is quoted in the prompt)
  else if (TAGALOG_MARKERS.some((marker) => lower.includes(marker))) {
    detectedInputLanguage = "fil";
    confidence = 0.95;
  }
  // 7. Check Tanglish / Romanized Tamil
  else if (TANGLISH_MARKERS.some((marker) => lower.includes(marker))) {
    detectedInputLanguage = "ta";
    confidence = 0.92;
  }
  // 8. Check French
  else if (FRENCH_MARKERS.some((marker) => lower.includes(marker))) {
    detectedInputLanguage = "fr";
    confidence = 0.92;
  }
  // 9. Check Spanish
  else if (SPANISH_MARKERS.some((marker) => lower.includes(marker))) {
    detectedInputLanguage = "es";
    confidence = 0.92;
  }
  // 10. Check German
  else if (GERMAN_MARKERS.some((marker) => lower.includes(marker))) {
    detectedInputLanguage = "de";
    confidence = 0.92;
  }
  // 11. Japanese script check (Hiragana / Katakana)
  else if (/[\u3040-\u309F\u30A0-\u30FF]/.test(prompt)) {
    const latinChars = (prompt.match(/[a-zA-Z]/g) || []).length;
    const jpChars = (prompt.match(/[\u3040-\u309F\u30A0-\u30FF]/g) || []).length;
    if (latinChars > jpChars) {
      // Latin sentence referencing isolated Japanese terms/kana
      detectedInputLanguage = "en";
      confidence = 0.88;
    } else {
      detectedInputLanguage = "ja";
      confidence = 0.98;
    }
  }
  // 12. Chinese CJK without Kana
  else if (/[\u4E00-\u9FFF]/.test(prompt)) {
    const latinChars = (prompt.match(/[a-zA-Z]/g) || []).length;
    const cjkChars = (prompt.match(/[\u4E00-\u9FFF]/g) || []).length;
    if (latinChars > cjkChars) {
      detectedInputLanguage = "en";
      confidence = 0.88;
    } else {
      detectedInputLanguage = "zh-CN";
      confidence = 0.9;
    }
  }

  return {
    detectedInputLanguage,
    explicitExplanationLanguage: explicitLanguageCode,
    isExplicit: Boolean(explicitLanguageCode),
    cleanedPrompt: prompt,
    confidence,
  };
}
