// ==============================================================================
// NIHONGOSETU — AUTOMATED VOCABULARY VALIDATION TEST SUITE
// Tests 100% data integrity, Unicode ranges, validation pipeline, and compatibility
// ==============================================================================

import { N5_VOCABULARY } from "../../data/vocab/n5";
import { N4_VOCABULARY } from "../../data/vocab/n4";
import { N3_VOCABULARY } from "../../data/vocab/n3";
import { N2_VOCABULARY } from "../../data/vocab/n2";
import { N1_VOCABULARY } from "../../data/vocab/n1";
import {
  getAllModularVocab,
  getModularVocabForLevel,
  getModularVocabByWord,
  searchModularVocab,
  vocabularyEntryToMultilingualWord,
} from "../../data/vocab/index";
import { validateVocabularyEntry } from "./validator";

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

console.log("=== RUNNING NIHONGOSETU VOCABULARY AUDIT & VALIDATION TESTS ===\n");

// 1. Record Counts & JLPT Staging
console.log("[1. Vocabulary Counts & JLPT Staging]");
assert("N5 dataset contains at least 100 canonical entries", N5_VOCABULARY.length >= 100, `Got: ${N5_VOCABULARY.length}`);
const expectedTotal = N5_VOCABULARY.length + N4_VOCABULARY.length + N3_VOCABULARY.length + N2_VOCABULARY.length + N1_VOCABULARY.length;
assert("Total modular vocabulary matches sum of all staged levels", getAllModularVocab().length === expectedTotal, `Got: ${getAllModularVocab().length}, Expected: ${expectedTotal}`);

// 2. Uniqueness & Integrity
console.log("\n[2. Uniqueness & No Duplicates]");
const wordSet = new Set<string>();
const idSet = new Set<string>();
let hasDuplicateWord = false;
let hasDuplicateId = false;

N5_VOCABULARY.forEach((v) => {
  if (wordSet.has(v.word)) hasDuplicateWord = true;
  wordSet.add(v.word);

  if (idSet.has(v.id)) hasDuplicateId = true;
  idSet.add(v.id);
});

assert("No duplicate words exist in N5 vocabulary dataset", !hasDuplicateWord);
assert("No duplicate IDs exist in N5 vocabulary dataset", !hasDuplicateId);

// 3. Validation Pipeline
console.log("\n[3. Full Validation Pipeline (validateVocabularyEntry)]");
let allN5Valid = true;
const errorDetails: string[] = [];

N5_VOCABULARY.forEach((v) => {
  const result = validateVocabularyEntry(v);
  if (!result.isValid) {
    allN5Valid = false;
    errorDetails.push(`${v.word}: ${result.errors.map((e) => e.message).join(", ")}`);
  }
});

assert(
  "All N5 vocabulary entries pass validateVocabularyEntry with zero errors",
  allN5Valid,
  errorDetails.slice(0, 3).join("; ")
);

// 4. Tamil Meanings & Multilingual Integrity
console.log("\n[4. Multilingual & Tamil Learning Support]");
const missingTamil = N5_VOCABULARY.filter((v) => !v.meaningTa || v.meaningTa.trim() === "");
assert(
  "All N5 vocabulary entries have verified Tamil translations (meaningTa)",
  missingTamil.length === 0,
  `Missing count: ${missingTamil.length}`
);

// 5. Part of Speech Classification
console.log("\n[5. Grammatical Parts of Speech]");
const invalidPos = N5_VOCABULARY.filter((v) => !v.partOfSpeech);
assert("All N5 vocabulary entries have valid partOfSpeech tags", invalidPos.length === 0);

// 6. Post-2010 JLPT Metadata Disclaimer
console.log("\n[6. Post-2010 JLPT Metadata Disclaimer]");
const invalidMetadata = N5_VOCABULARY.filter(
  (v) => !v.levelMetadata || !v.levelMetadata.isEstimated || !v.levelMetadata.officialDisclaimer
);
assert(
  "All N5 vocabulary entries are marked isEstimated: true with official JLPT disclaimer",
  invalidMetadata.length === 0
);

// 7. Backward Compatibility Layer
console.log("\n[7. Backward Compatibility Layer]");
let allConvertible = true;
N5_VOCABULARY.forEach((v) => {
  const word = vocabularyEntryToMultilingualWord(v);
  if (!word.kanji || !word.reading || !word.romaji || !word.meaning || !word.meaning.en) {
    allConvertible = false;
  }
});
assert("vocabularyEntryToMultilingualWord successfully maps all N5 entries to legacy format", allConvertible);

// 8. Search & Retrieval Functions
console.log("\n[8. Search & Retrieval Functions]");
const taberu = getModularVocabByWord("食べる");
assert("getModularVocabByWord('食べる') returns correct entry", !!taberu && taberu.readingHiragana === "たべる");

const n5List = getModularVocabForLevel("N5");
assert("getModularVocabForLevel('N5') returns all N5 entries", n5List.length === N5_VOCABULARY.length);

const searchWater = searchModularVocab("water", "N5");
assert("searchModularVocab('water', 'N5') finds '水'", searchWater.some((v) => v.word === "水"));

const searchTamil = searchModularVocab("தண்ணீர்", "N5");
assert("searchModularVocab finds '水' by Tamil query 'தண்ணீர்'", searchTamil.some((v) => v.word === "水"));

console.log(`\n=== VOCABULARY TEST RESULTS: ${passedTests}/${totalTests} TESTS PASSED ===\n`);

if (passedTests !== totalTests) {
  process.exit(1);
}
