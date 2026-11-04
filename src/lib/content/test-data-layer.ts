// ==============================================================================
// NIHONGOSETU — MODULAR DATA LAYER & BACKWARD COMPATIBILITY TEST SUITE
// ==============================================================================
import {
  getKanjiForLevel,
  KANJI_DATA,
  KANJI_TARGET_COUNTS,
  getAllModularKanji,
  getModularKanjiForLevel,
  getModularKanjiByChar,
  searchModularKanji,
  kanjiEntryToCardItem,
} from "../../data/kanji";
import {
  CORE_VOCABULARY,
  VOCAB_TARGET_COUNTS,
  getAllModularVocab,
  getModularVocabForLevel,
  getModularVocabByWord,
  searchModularVocab,
  vocabularyEntryToMultilingualWord,
} from "../../data/vocab";
import { validateKanjiBatch, validateVocabularyBatch } from "./validator";

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

console.log("=== RUNNING NIHONGOSETU DATA LAYER & COMPATIBILITY TESTS ===\n");

// ------------------------------------------------------------------------------
// 1. LEGACY KANJI COMPATIBILITY
// ------------------------------------------------------------------------------
console.log("[1. Legacy Kanji Compatibility]");
const legacyN5 = getKanjiForLevel("N5");
assert("getKanjiForLevel('N5') returns array of 20 items", Array.isArray(legacyN5) && legacyN5.length === 20);

const firstLegacy = legacyN5[0];
assert(
  "First legacy Kanji is '日' with intact shape",
  firstLegacy?.character === "日" &&
  Boolean(firstLegacy.kunyomi) &&
  Boolean(firstLegacy.onyomi) &&
  Boolean(firstLegacy.meanings) &&
  Boolean(firstLegacy.examples) &&
  firstLegacy.level === "N5"
);

assert(
  "KANJI_DATA raw tuple dataset is preserved across all levels",
  Array.isArray(KANJI_DATA.N5) &&
  Array.isArray(KANJI_DATA.N4) &&
  Array.isArray(KANJI_DATA.N3) &&
  Array.isArray(KANJI_DATA.N2) &&
  Array.isArray(KANJI_DATA.N1)
);

assert(
  "KANJI_TARGET_COUNTS preserves exact original values",
  KANJI_TARGET_COUNTS.N5 === 80 &&
  KANJI_TARGET_COUNTS.N4 === 166 &&
  KANJI_TARGET_COUNTS.N3 === 367 &&
  KANJI_TARGET_COUNTS.N2 === 367 &&
  KANJI_TARGET_COUNTS.N1 === 117
);

// ------------------------------------------------------------------------------
// 2. LEGACY VOCABULARY COMPATIBILITY
// ------------------------------------------------------------------------------
console.log("\n[2. Legacy Vocabulary Compatibility]");
assert("CORE_VOCABULARY preserves all 30 original words", Array.isArray(CORE_VOCABULARY) && CORE_VOCABULARY.length === 30);

const firstVocab = CORE_VOCABULARY[0];
const REQUIRED_LANGS = ["en", "ta", "hi", "te", "ml", "kn", "bn", "mr", "tl", "ar", "fr", "es"];
const hasAll12Langs = REQUIRED_LANGS.every((lang) => Boolean(firstVocab?.meaning[lang]));

assert(
  "First legacy vocab '私' has all 12 language translations intact",
  firstVocab?.kanji === "私" && firstVocab?.reading === "わたし" && hasAll12Langs
);

assert(
  "VOCAB_TARGET_COUNTS preserves exact original values",
  VOCAB_TARGET_COUNTS.N5 === 800 &&
  VOCAB_TARGET_COUNTS.N4 === 1500 &&
  VOCAB_TARGET_COUNTS.N3 === 3750 &&
  VOCAB_TARGET_COUNTS.N2 === 6000 &&
  VOCAB_TARGET_COUNTS.N1 === 10000
);

// ------------------------------------------------------------------------------
// 3. MODULAR KANJI DATA LAYER
// ------------------------------------------------------------------------------
console.log("\n[3. Modular Kanji Data Layer]");
const allModularKanji = getAllModularKanji();
assert("getAllModularKanji() returns all modular entries", allModularKanji.length >= 20);

const modularSun = getModularKanjiByChar("日");
assert(
  "getModularKanjiByChar('日') returns rich schema with radical and Tamil meaning",
  modularSun !== undefined &&
  modularSun.strokeCount === 4 &&
  modularSun.radical.character === "日" &&
  modularSun.meaningTa === "நாள் / சூரியன்" &&
  modularSun.compounds.length > 0 &&
  modularSun.examples.length > 0
);

const searchResult = searchModularKanji("Japan");
assert(
  "searchModularKanji('Japan') finds Kanji with compound matching 'Japan'",
  searchResult.some((k) => k.character === "日")
);

const convertedCard = kanjiEntryToCardItem(modularSun!);
assert(
  "kanjiEntryToCardItem adapter generates valid legacy KanjiCardItem",
  convertedCard.character === "日" &&
  convertedCard.level === "N5" &&
  convertedCard.meanings === "day; sun"
);

// ------------------------------------------------------------------------------
// 4. MODULAR VOCABULARY DATA LAYER
// ------------------------------------------------------------------------------
console.log("\n[4. Modular Vocabulary Data Layer]");
const allModularVocab = getAllModularVocab();
assert("getAllModularVocab() returns all modular vocabulary entries", allModularVocab.length >= 10);

const modularTaberu = getModularVocabByWord("食べる");
assert(
  "getModularVocabByWord('食べる') returns rich schema with verb type, Tamil, and related Kanji",
  modularTaberu !== undefined &&
  modularTaberu.partOfSpeech === "verb_ichidan" &&
  modularTaberu.meaningTa === "சாப்பிடு / உண்" &&
  modularTaberu.relatedKanji.includes("食")
);

const searchVocabResult = searchModularVocab("eat");
assert(
  "searchModularVocab('eat') finds '食べる'",
  searchVocabResult.some((v) => v.word === "食べる")
);

const convertedVocab = vocabularyEntryToMultilingualWord(modularTaberu!);
assert(
  "vocabularyEntryToMultilingualWord adapter generates valid MultilingualVocabWord with Tamil",
  convertedVocab.kanji === "食べる" &&
  convertedVocab.reading === "たべる" &&
  convertedVocab.meaning.en === "to eat" &&
  convertedVocab.meaning.ta === "சாப்பிடு / உண்"
);

// ------------------------------------------------------------------------------
// 5. VALIDATOR COMPLIANCE
// ------------------------------------------------------------------------------
console.log("\n[5. Validator Compliance]");
const kanjiValidation = validateKanjiBatch(allModularKanji);
assert(
  `All modular Kanji pass strict validation with 0 errors (${kanjiValidation.validCount}/${kanjiValidation.totalProcessed} valid)`,
  kanjiValidation.errorCount === 0 && kanjiValidation.validCount === allModularKanji.length,
  kanjiValidation.errors[0]?.message
);

const vocabValidation = validateVocabularyBatch(allModularVocab);
assert(
  `All modular Vocabulary pass strict validation with 0 errors (${vocabValidation.validCount}/${vocabValidation.totalProcessed} valid)`,
  vocabValidation.errorCount === 0 && vocabValidation.validCount === allModularVocab.length,
  vocabValidation.errors[0]?.message
);

console.log(`\n=== RESULTS: ${passedTests}/${totalTests} TESTS PASSED ===\n`);
if (passedTests === totalTests) {
  process.exit(0);
} else {
  process.exit(1);
}
