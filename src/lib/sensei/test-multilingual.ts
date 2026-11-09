// ==============================================================================
// NIHONGOSETU — UNIVERSAL MULTILINGUAL AI SENSEI VALIDATION SUITE
// Automated verification for language combinations, code-switching & directives
// ==============================================================================

import {
  UNIVERSAL_LANGUAGES,
  getLanguageByCode,
  findLanguageByNameOrKeyword,
} from "./languages";
import { detectLanguages } from "./languageDetector";
import { buildSystemInstruction, validateResponseLanguage } from "./promptBuilder";
import {
  DEFAULT_SENSEI_SETTINGS,
  saveSenseiSettings,
  getSenseiSettings,
} from "./senseiState";

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, name: string, errorMsg?: string) {
  if (condition) {
    results.push({ name, passed: true });
    console.log(`  ✓ PASS: ${name}`);
  } else {
    results.push({ name, passed: false, error: errorMsg || "Assertion failed" });
    console.error(`  ✗ FAIL: ${name} — ${errorMsg || "Assertion failed"}`);
  }
}

export function runMultilingualTests(): { passed: number; total: number; failed: number } {
  console.log("\n=== RUNNING NIHONGOSETU UNIVERSAL MULTILINGUAL TESTS ===\n");

  // 1. Language Catalog Completeness
  console.log("[1. Universal Language Catalog Coverage]");
  assert(UNIVERSAL_LANGUAGES.length >= 40, "Covers at least 40 universal world languages");
  const regions = new Set(UNIVERSAL_LANGUAGES.map((l) => l.region));
  assert(regions.has("Indian"), "Contains Indian languages (Tamil, Hindi, Telugu, Kannada, etc.)");
  assert(regions.has("East Asian"), "Contains East Asian languages (Japanese, Chinese, Korean)");
  assert(regions.has("Southeast Asian"), "Contains Southeast Asian languages (Filipino, Indonesian, Vietnamese, etc.)");
  assert(regions.has("European"), "Contains European languages (French, Spanish, German, Russian, etc.)");
  assert(regions.has("Middle Eastern"), "Contains Middle Eastern languages (Arabic, Persian, Hebrew)");

  // 2. Exact Language Combinations (Section 12 Required Tests)
  console.log("\n[2. Explicit Language Combination Directives]");

  // Test 1: Tamil input → English explanation
  const t1 = detectLanguages("இந்த grammar-ஐ English-ல explain பண்ணுங்க");
  assert(
    t1.detectedInputLanguage === "ta" && t1.explicitExplanationLanguage === "en",
    "Tamil input → English explanation ('இந்த grammar-ஐ English-ல explain பண்ணுங்க')"
  );

  // Test 2: English input → Tamil explanation
  const t2 = detectLanguages("Can you explain Japanese particles in Tamil?");
  assert(
    t2.detectedInputLanguage === "en" && t2.explicitExplanationLanguage === "ta",
    "English input → Tamil explanation ('Can you explain Japanese particles in Tamil?')"
  );

  // Test 3: Japanese input → Tamil explanation
  const t3 = detectLanguages("この文法をタミル語で説明してください");
  assert(
    t3.detectedInputLanguage === "ja" && t3.explicitExplanationLanguage === "ta",
    "Japanese input → Tamil explanation ('この文法をタミル語で説明してください')"
  );

  // Test 4: Tamil input → Japanese explanation
  const t4 = detectLanguages("indha topic-a Japanese-la explain pannunga");
  assert(
    t4.detectedInputLanguage === "ta" && t4.explicitExplanationLanguage === "ja",
    "Tamil input → Japanese explanation ('indha topic-a Japanese-la explain pannunga')"
  );

  // Test 5: Japanese input → English explanation
  const t5 = detectLanguages("この文法を英語で説明してください");
  assert(
    t5.detectedInputLanguage === "ja" && t5.explicitExplanationLanguage === "en",
    "Japanese input → English explanation ('この文法を英語で説明してください')"
  );

  // Test 6: English input → Japanese explanation
  const t6 = detectLanguages("Please explain this concept in Japanese");
  assert(
    t6.detectedInputLanguage === "en" && t6.explicitExplanationLanguage === "ja",
    "English input → Japanese explanation ('Please explain this concept in Japanese')"
  );

  // Test 7: Filipino input → French explanation
  const t7 = detectLanguages("Paki-explain naman po ito in French");
  assert(
    t7.detectedInputLanguage === "fil" && t7.explicitExplanationLanguage === "fr",
    "Filipino input → French explanation ('Paki-explain naman po ito in French')"
  );

  // Test 8: Russian input → English explanation
  const t8 = detectLanguages("Объясни эту грамматику in English");
  assert(
    t8.detectedInputLanguage === "ru" && t8.explicitExplanationLanguage === "en",
    "Russian input → English explanation ('Объясни эту грамматику in English')"
  );

  // Test 9: French input → Japanese explanation
  const t9 = detectLanguages("Expliquez cette règle en japonais s'il vous plaît");
  assert(
    t9.detectedInputLanguage === "fr" && t9.explicitExplanationLanguage === "ja",
    "French input → Japanese explanation ('Expliquez cette règle en japonais s\'il vous plaît')"
  );

  // Test 10: German input → Spanish explanation
  const t10 = detectLanguages("Erkläre diese Grammatik bitte in Spanish");
  assert(
    t10.detectedInputLanguage === "de" && t10.explicitExplanationLanguage === "es",
    "German input → Spanish explanation ('Erkläre diese Grammatik bitte in Spanish')"
  );

  // 3. Code-Switching & Romanized Tanglish
  console.log("\n[3. Code-Switching & Romanized Script Recognition]");
  const tanglish = detectLanguages("Sensei, wa kum ga kum enna difference? English-la explain pannu");
  assert(tanglish.detectedInputLanguage === "ta", "Recognizes Romanized Tanglish as Tamil input");
  assert(tanglish.explicitExplanationLanguage === "en", "Extracts English explanation request from Tanglish");

  const hinglish = detectLanguages("Is grammar ko Hindi mein samjhao please");
  assert(hinglish.explicitExplanationLanguage === "hi", "Recognizes Hindi request from 'Hindi mein samjhao'");

  const tagalogNative = detectLanguages("Ipaliwanag po sa Tagalog kung paano gamitin ang を");
  assert(tagalogNative.detectedInputLanguage === "fil", "Recognizes Tagalog markers");
  assert(tagalogNative.explicitExplanationLanguage === "fil", "Recognizes 'sa Tagalog' as Filipino target");

  // 4. Prompt Builder & Language Separation
  console.log("\n[4. Prompt Instruction Strictness & Separation]");
  const promptEn = buildSystemInstruction({
    inputLanguage: "ta",
    explanationLanguage: "en",
    mode: "text",
  });
  assert(
    promptEn.instructions.includes("Target Explanation Language: English"),
    "Builds target English explanation directive for Tamil input"
  );
  assert(
    promptEn.instructions.includes("Do NOT default to Japanese or Tamil unless the Target Explanation Language is Japanese or Tamil"),
    "Explicitly forbids defaulting to Japanese or Tamil when English is requested"
  );

  const promptFr = buildSystemInstruction({
    inputLanguage: "fil",
    explanationLanguage: "fr",
    mode: "text",
  });
  assert(
    promptFr.instructions.includes("Target Explanation Language: French"),
    "Builds target French explanation directive for Filipino input"
  );

  const promptVoice = buildSystemInstruction({
    explanationLanguage: "ta",
    mode: "voice_conversation",
  });
  assert(
    promptVoice.instructions.includes("PRIMARY EXPLANATION LANGUAGE: Tamil"),
    "Voice prompt enforces primary Tamil explanation"
  );
  assert(
    promptVoice.instructions.includes("1 to 3 sentences maximum"),
    "Voice prompt enforces 1 to 3 spoken sentence limits"
  );

  // 5. Response Language Validation
  console.log("\n[5. Response Language Validation]");
  const validEnglishResponse = `The particle **は (wa)** is the topic marker, while **が (ga)** marks the grammatical subject. For example, 私は学生です (Watashi wa gakusei desu).`;
  const v1 = validateResponseLanguage(validEnglishResponse, "en");
  assert(v1.isValid, "Accepts English explanation with Japanese example");

  const invalidAllJapaneseWhenEnglishWanted = `これは日本語の助詞です。主題を示します。`;
  const v2 = validateResponseLanguage(invalidAllJapaneseWhenEnglishWanted, "en");
  assert(!v2.isValid, "Rejects 100% Japanese text when English explanation was requested");

  const validRussian = `Частица **は (wa)** обозначает тему предложения. Например: 私は学生です.`;
  const v3 = validateResponseLanguage(validRussian, "ru");
  assert(v3.isValid, "Accepts Russian explanation containing Cyrillic prose");

  // 6. Settings Persistence & Independent State
  console.log("\n[6. State & Preference Persistence]");
  assert(
    DEFAULT_SENSEI_SETTINGS.inputLanguage === "auto" &&
    DEFAULT_SENSEI_SETTINGS.explanationLanguage === "en" &&
    DEFAULT_SENSEI_SETTINGS.voiceOutputLanguage === "follow_explanation",
    "Default settings maintain separate input and explanation languages"
  );

  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  console.log(`\n=== MULTILINGUAL TEST RESULTS: ${passed}/${results.length} TESTS PASSED ===\n`);

  return { passed, total: results.length, failed };
}

if (typeof require !== "undefined" && require.main === module) {
  const summary = runMultilingualTests();
  if (summary.failed > 0) process.exit(1);
}
