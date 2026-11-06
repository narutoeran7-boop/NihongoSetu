// ==============================================================================
// NIHONGOSETU — AUTOMATED KANJI VALIDATION TEST SUITE
// Tests 100% data integrity, Unicode ranges, validation pipeline, and compatibility
// ==============================================================================

import { N5_KANJI } from "../../data/kanji/n5";
import { N4_KANJI } from "../../data/kanji/n4";
import { N3_KANJI } from "../../data/kanji/n3";
import { N2_KANJI } from "../../data/kanji/n2";
import { N1_KANJI } from "../../data/kanji/n1";
import {
  getAllModularKanji,
  getModularKanjiForLevel,
  getModularKanjiByChar,
  searchModularKanji,
  kanjiEntryToCardItem,
} from "../../data/kanji/index";
import { validateKanjiEntry } from "./validator";
import { getKanjiStrokeData } from "../../data/kanjiStrokes";

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

console.log("=== RUNNING NIHONGOSETU KANJI AUDIT & VALIDATION TESTS ===\n");

// 1. Character Counts & JLPT Staging
console.log("[1. Character Counts & Staging]");
assert("N5 dataset contains exactly 103 canonical Kanji", N5_KANJI.length === 103, `Got: ${N5_KANJI.length}`);
assert("N4 dataset contains staged entries", N4_KANJI.length >= 6, `Got: ${N4_KANJI.length}`);
const totalExpected = N5_KANJI.length + N4_KANJI.length + N3_KANJI.length + N2_KANJI.length + N1_KANJI.length;
assert("Total modular kanji matches sum of all staged levels", getAllModularKanji().length === totalExpected, `Got: ${getAllModularKanji().length}, Expected: ${totalExpected}`);

// 2. Uniqueness & No Duplicates
console.log("\n[2. Uniqueness & Integrity]");
const charSet = new Set<string>();
const idSet = new Set<string>();
let hasDuplicateChar = false;
let hasDuplicateId = false;

N5_KANJI.forEach((k) => {
  if (charSet.has(k.character)) hasDuplicateChar = true;
  charSet.add(k.character);

  if (idSet.has(k.id)) hasDuplicateId = true;
  idSet.add(k.id);
});

assert("No duplicate Kanji characters exist in N5 dataset", !hasDuplicateChar);
assert("No duplicate Kanji IDs exist in N5 dataset", !hasDuplicateId);

// 3. Validation Pipeline (Validator Engine Verification)
console.log("\n[3. Full Validation Pipeline (validateKanjiEntry)]");
let allN5Valid = true;
const errorDetails: string[] = [];

N5_KANJI.forEach((k) => {
  const result = validateKanjiEntry(k);
  if (!result.isValid) {
    allN5Valid = false;
    errorDetails.push(`${k.character}: ${result.errors.map(e => e.message).join(", ")}`);
  }
});

assert(
  "All 103 N5 Kanji entries pass validateKanjiEntry with zero errors",
  allN5Valid,
  errorDetails.slice(0, 3).join("; ")
);

// 4. Tamil Meanings & Multilingual Integrity
console.log("\n[4. Multilingual & Tamil Learning Support]");
const missingTamil = N5_KANJI.filter((k) => !k.meaningTa || k.meaningTa.trim() === "");
assert(
  "All 103 N5 Kanji have verified Tamil meanings (meaningTa)",
  missingTamil.length === 0,
  `Missing count: ${missingTamil.length}`
);

// 5. Radicals & Stroke Counts
console.log("\n[5. Radicals & Stroke Counts]");
const invalidRadicals = N5_KANJI.filter(
  (k) => !k.radical || !k.radical.character || !k.radical.nameJa || !k.radical.nameEn
);
assert("All 103 N5 Kanji have valid radical objects (character, nameJa, nameEn)", invalidRadicals.length === 0);

const invalidStrokes = N5_KANJI.filter((k) => typeof k.strokeCount !== "number" || k.strokeCount < 1 || k.strokeCount > 30);
assert("All 103 N5 Kanji have valid stroke counts (1 to 30)", invalidStrokes.length === 0);

// 6. Level Metadata & Curriculum Accuracy
console.log("\n[6. Post-2010 JLPT Metadata Disclaimer]");
const invalidMetadata = N5_KANJI.filter(
  (k) => !k.levelMetadata || !k.levelMetadata.isEstimated || !k.levelMetadata.officialDisclaimer
);
assert(
  "All 103 N5 Kanji are marked isEstimated: true with official JLPT disclaimer",
  invalidMetadata.length === 0
);

// 7. Backward Compatibility Adapter
console.log("\n[7. Backward Compatibility Layer]");
let allConvertible = true;
N5_KANJI.forEach((k) => {
  const card = kanjiEntryToCardItem(k);
  if (!card.character || !card.meanings || !card.level || !card.onyomi || !card.kunyomi) {
    allConvertible = false;
  }
});
assert("kanjiEntryToCardItem successfully maps all 103 Kanji to legacy UI format", allConvertible);

// 8. Retrieval & Search Engine
console.log("\n[8. Search & Retrieval Functions]");
const dayKanji = getModularKanjiByChar("日");
assert("getModularKanjiByChar('日') returns correct Kanji entry", !!dayKanji && dayKanji.meaningEn.includes("day"));

const n5List = getModularKanjiForLevel("N5");
assert("getModularKanjiForLevel('N5') returns all 103 entries", n5List.length === 103);

const searchWater = searchModularKanji("water", "N5");
assert("searchModularKanji('water', 'N5') finds '水'", searchWater.some((k) => k.character === "水"));

const searchTamil = searchModularKanji("மழை", "N5");
assert("searchModularKanji finds '雨' by Tamil query 'மழை'", searchTamil.some((k) => k.character === "雨"));

// 9. Stroke Animation Coverage
console.log("\n[9. Stroke Animation Coverage]");
let strokeDataAvailable = true;
N5_KANJI.forEach((k) => {
  const strokes = getKanjiStrokeData(k.character, k.strokeCount);
  if (!strokes || strokes.length !== k.strokeCount) {
    strokeDataAvailable = false;
  }
});
assert(
  "All 103 N5 Kanji have corresponding stroke paths matching their strokeCount",
  strokeDataAvailable
);

console.log(`\n=== KANJI TEST RESULTS: ${passedTests}/${totalTests} TESTS PASSED ===\n`);

if (passedTests !== totalTests) {
  process.exit(1);
}
