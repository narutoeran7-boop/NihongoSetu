// ==============================================================================
// NIHONGOSETU — VALIDATOR TEST SUITE
// ==============================================================================
import {
  validateKanjiEntry,
  validateVocabularyEntry,
  validateKanjiBatch,
  validateVocabularyBatch,
} from "./validator";
import { KanjiEntry, VocabularyEntry } from "../../types/content";

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

console.log("=== RUNNING NIHONGOSETU CONTENT VALIDATOR TESTS ===\n");

// 1. Valid Kanji Test
const validKanji: KanjiEntry = {
  id: "kj_n5_001",
  character: "日",
  jlptLevel: "N5",
  levelMetadata: {
    level: "N5",
    isEstimated: true,
    sourceReference: "MEXT Kyōiku Kanji Grade 1 / EDRDG KANJIDIC2",
    officialDisclaimer: "JLPT does not publish official vocabulary or kanji lists.",
  },
  meaningEn: "day; sun",
  meaningTa: "நாள் / சூரியன்",
  onyomi: ["ニチ", "ジツ"],
  kunyomi: ["ひ", "-び", "-か"],
  romajiOn: ["nichi", "jitsu"],
  romajiKun: ["hi", "-bi", "-ka"],
  strokeCount: 4,
  radical: {
    character: "日",
    nameJa: "ひ / ひへん",
    nameEn: "sun, day",
    strokes: 4,
    number: 72,
  },
  grade: 1,
  frequencyRank: 42,
  compounds: [
    {
      word: "日本",
      reading: "にほん",
      romaji: "nihon",
      meaningEn: "Japan",
      meaningTa: "ஜப்பான்",
      jlptLevel: "N5",
    },
  ],
  examples: [
    {
      id: "ex_kj_n5_001_1",
      ja: "今日はいい天気です。",
      kana: "きょうはいいてんきです。",
      romaji: "Kyou wa ii tenki desu.",
      en: "The weather is nice today.",
      ta: "இன்று நல்ல வானிலை நிலவுகிறது.",
    },
  ],
  mnemonic: "A picture of the sun with a line across the center.",
  difficulty: 1,
  source: "KANJIDIC2 (EDRDG)",
  reviewStatus: "published",
  createdDate: new Date().toISOString(),
};

const kanjiResult = validateKanjiEntry(validKanji);
assert("Valid Kanji entry should pass with 0 errors", kanjiResult.isValid && kanjiResult.errors.length === 0);

// 2. Invalid Kanji (Non-Kanji Character)
const invalidCharKanji: KanjiEntry = {
  ...validKanji,
  id: "kj_n5_002",
  character: "A",
};
const invalidCharResult = validateKanjiEntry(invalidCharKanji);
assert(
  "Non-Kanji character 'A' should fail validation",
  !invalidCharResult.isValid && invalidCharResult.errors.some((e) => e.field === "character")
);

// 3. Onyomi in Hiragana (Orthography rule violation)
const invalidOnyomiKanji: KanjiEntry = {
  ...validKanji,
  id: "kj_n5_003",
  onyomi: ["にち"], // Should be Katakana ニチ
};
const invalidOnyomiResult = validateKanjiEntry(invalidOnyomiKanji);
assert(
  "On'yomi in Hiragana should trigger validation error",
  invalidOnyomiResult.errors.some((e) => e.field.startsWith("onyomi"))
);

// 4. Stroke Count Out of Range
const invalidStrokesKanji: KanjiEntry = {
  ...validKanji,
  id: "kj_n5_004",
  strokeCount: -2,
};
const invalidStrokesResult = validateKanjiEntry(invalidStrokesKanji);
assert(
  "Negative stroke count should fail validation",
  invalidStrokesResult.errors.some((e) => e.field === "strokeCount")
);

// 5. Placeholder Content Prohibition
const placeholderKanji: KanjiEntry = {
  ...validKanji,
  id: "kj_n5_005",
  meaningEn: "Kanji example 001",
};
const placeholderResult = validateKanjiEntry(placeholderKanji);
assert(
  "Placeholder English meaning should be rejected",
  placeholderResult.errors.some((e) => e.field === "meaningEn")
);

// 6. Kanji Batch Duplicate Character Detection
const batchResult = validateKanjiBatch([validKanji, { ...validKanji, id: "kj_n5_duplicate" }]);
assert(
  "Duplicate Kanji character in batch should be detected",
  batchResult.duplicatesFound > 0 && batchResult.errors.some((e) => e.field === "character")
);

// 7. Valid Vocabulary Test
const validVocab: VocabularyEntry = {
  id: "vb_n5_001",
  word: "食べる",
  kanjiForm: "食べる",
  readingHiragana: "たべる",
  romaji: "taberu",
  meaningEn: "to eat",
  meaningTa: "சாப்பிடு / உண்",
  jlptLevel: "N5",
  levelMetadata: {
    level: "N5",
    isEstimated: true,
    sourceReference: "JMdict (EDRDG)",
    officialDisclaimer: "JLPT does not publish official vocabulary or kanji lists.",
  },
  partOfSpeech: "verb_ichidan",
  category: "Verbs",
  commonUsage: "Essential ichidan verb for consuming food.",
  examples: [
    {
      id: "ex_vb_n5_001_1",
      ja: "朝ご飯を食べます。",
      kana: "あさごはんをたべます。",
      romaji: "Asagohan o tabemasu.",
      en: "I eat breakfast.",
      ta: "நான் காலை உணவு சாப்பிடுகிறேன்.",
    },
  ],
  relatedKanji: ["食"],
  source: "JMdict (EDRDG)",
  reviewStatus: "published",
  createdDate: new Date().toISOString(),
};

const vocabResult = validateVocabularyEntry(validVocab);
assert("Valid vocabulary entry should pass with 0 errors", vocabResult.isValid && vocabResult.errors.length === 0);

// 8. Invalid Reading in Vocabulary (English/Numbers in reading)
const invalidReadingVocab: VocabularyEntry = {
  ...validVocab,
  id: "vb_n5_002",
  readingHiragana: "taberu123",
};
const invalidReadingResult = validateVocabularyEntry(invalidReadingVocab);
assert(
  "Non-Hiragana reading in vocabulary should fail",
  invalidReadingResult.errors.some((e) => e.field === "readingHiragana")
);

// 9. Vocabulary Duplicate Word + Reading Check
const vocabBatchResult = validateVocabularyBatch([validVocab, { ...validVocab, id: "vb_n5_003" }]);
assert(
  "Duplicate vocabulary word + reading pair should be detected",
  vocabBatchResult.duplicatesFound > 0 && vocabBatchResult.errors.some((e) => e.field === "word")
);

// 10. Invalid JLPT Level Check
const invalidLevelVocab: VocabularyEntry = {
  ...validVocab,
  id: "vb_n5_004",
  jlptLevel: "N6" as unknown as "N5",
};
const invalidLevelResult = validateVocabularyEntry(invalidLevelVocab);
assert(
  "Invalid JLPT level 'N6' should fail validation",
  invalidLevelResult.errors.some((e) => e.field === "jlptLevel")
);

console.log(`\n=== RESULTS: ${passedTests}/${totalTests} TESTS PASSED ===\n`);
if (passedTests === totalTests) {
  process.exit(0);
} else {
  process.exit(1);
}

