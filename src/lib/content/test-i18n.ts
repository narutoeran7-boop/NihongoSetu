// ==============================================================================
// NIHONGOSETU — AUTOMATED LOCALIZATION (I18N) TEST SUITE
// Tests 100% key parity, zero missing translations, and correct feature names
// ==============================================================================

import { TRANSLATIONS, SUPPORTED_LANGUAGES, TranslationKey } from "../i18n/translations";

let totalTests = 0;
let passedTests = 0;

function assert(description: string, condition: boolean, detail?: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ PASS: ${description}`);
  } else {
    console.error(`  ✗ FAIL: ${description}${detail ? ` (${detail})` : ""}`);
  }
}

console.log("=== RUNNING NIHONGOSETU LOCALIZATION (I18N) TESTS ===\n");

// 1. Supported Languages
console.log("[1. Supported Languages Coverage]");
const langCodes = SUPPORTED_LANGUAGES.map((l) => l.code);
assert("Contains English ('en')", langCodes.includes("en"));
assert("Contains Tamil ('ta')", langCodes.includes("ta"));
assert("Contains Japanese ('ja')", langCodes.includes("ja"));
assert("Exactly 3 primary supported interface languages", langCodes.length === 3);

// 2. Japanese Script Feature Renaming
console.log("\n[2. Japanese Script Feature Naming]");
assert(
  "English feature name is exactly 'Japanese Script'",
  TRANSLATIONS.en.feature_script_title === "Japanese Script",
  `Got: ${TRANSLATIONS.en.feature_script_title}`
);
assert(
  "Tamil feature name is exactly 'ஜப்பானிய எழுத்துகள்'",
  TRANSLATIONS.ta.feature_script_title === "ஜப்பானிய எழுத்துகள்",
  `Got: ${TRANSLATIONS.ta.feature_script_title}`
);
assert(
  "Japanese feature name is exactly '日本語の文字'",
  TRANSLATIONS.ja.feature_script_title === "日本語の文字",
  `Got: ${TRANSLATIONS.ja.feature_script_title}`
);

assert(
  "English sidebar navigation label is 'Japanese Script'",
  TRANSLATIONS.en.nav_script === "Japanese Script"
);
assert(
  "Tamil sidebar navigation label is 'ஜப்பானிய எழுத்துகள்'",
  TRANSLATIONS.ta.nav_script === "ஜப்பானிய எழுத்துகள்"
);
assert(
  "Japanese sidebar navigation label is '日本語の文字'",
  TRANSLATIONS.ja.nav_script === "日本語の文字"
);

// 3. Key Parity Between Languages
console.log("\n[3. Key Parity & Completeness]");
const enKeys = Object.keys(TRANSLATIONS.en) as TranslationKey[];
const taKeys = new Set(Object.keys(TRANSLATIONS.ta));
const jaKeys = new Set(Object.keys(TRANSLATIONS.ja));

let missingTa: string[] = [];
let missingJa: string[] = [];
let emptyStrings: string[] = [];

enKeys.forEach((key) => {
  if (!taKeys.has(key)) missingTa.push(key);
  if (!jaKeys.has(key)) missingJa.push(key);

  if (!TRANSLATIONS.en[key]) emptyStrings.push(`en.${key}`);
  if (!TRANSLATIONS.ta[key as keyof typeof TRANSLATIONS.ta]) emptyStrings.push(`ta.${key}`);
  if (!TRANSLATIONS.ja[key as keyof typeof TRANSLATIONS.ja]) emptyStrings.push(`ja.${key}`);
});

assert(
  `Tamil dictionary has 100% key parity with English (${enKeys.length} keys)`,
  missingTa.length === 0,
  `Missing in Tamil: ${missingTa.join(", ")}`
);
assert(
  `Japanese dictionary has 100% key parity with English (${enKeys.length} keys)`,
  missingJa.length === 0,
  `Missing in Japanese: ${missingJa.join(", ")}`
);
assert("No empty strings in any language translation dictionary", emptyStrings.length === 0, emptyStrings.join(", "));

// 4. Script Control Labels
console.log("\n[4. Japanese Script Control Labels]");
assert("Play in Japanese is '再生'", TRANSLATIONS.ja.script_play === "再生");
assert("Pause in Japanese is '一時停止'", TRANSLATIONS.ja.script_pause === "一時停止");
assert("Restart in Japanese is '最初から'", TRANSLATIONS.ja.script_restart === "最初から");
assert("Previous in Japanese is '前へ'", TRANSLATIONS.ja.script_prev_stroke === "前へ");
assert("Next in Japanese is '次へ'", TRANSLATIONS.ja.script_next_stroke === "次へ");
assert("Hide Guide in Japanese is 'お手本を隠す'", TRANSLATIONS.ja.script_hide_guide === "お手本を隠す");
assert("Show Guide in Japanese is 'お手本を表示'", TRANSLATIONS.ja.script_show_guide === "お手本を表示");

assert("Play in Tamil is 'இயக்கு'", TRANSLATIONS.ta.script_play === "இயக்கு");
assert("Pause in Tamil is 'இடைநிறுத்து'", TRANSLATIONS.ta.script_pause === "இடைநிறுத்து");
assert("Restart in Tamil is 'மீண்டும்'", TRANSLATIONS.ta.script_restart === "மீண்டும்");
assert("Hide Guide in Tamil is 'வழிகாட்டியை மறை'", TRANSLATIONS.ta.script_hide_guide === "வழிகாட்டியை மறை");

console.log(`\n=== LOCALIZATION TEST RESULTS: ${passedTests}/${totalTests} TESTS PASSED ===\n`);

if (passedTests !== totalTests) {
  process.exit(1);
}

