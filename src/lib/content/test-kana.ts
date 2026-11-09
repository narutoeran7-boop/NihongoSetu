// ==============================================================================
// NIHONGOSETU — AUTOMATED KANA VALIDATION TEST SUITE
// Tests 100% Gojuon ordering, character integrity, uniqueness & stroke data
// ==============================================================================

import {
  BASIC_KANA,
  DAKUON_KANA,
  YOON_KANA,
  SMALL_KANA,
  ALL_KANA,
  GOJUON_ROWS,
} from "../../data/kana";
import { HIRAGANA_STROKE_DATA, KATAKANA_STROKE_DATA, getKanaStrokes } from "../../data/kanaStrokes";
import { ALL_YOON_DATA, HIRAGANA_YOON_DATA, KATAKANA_YOON_DATA } from "../../data/yoonData";

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

console.log("=== RUNNING NIHONGOSETU KANA AUDIT & VALIDATION TESTS ===\n");

// 1. Character Counts
console.log("[1. Character Counts]");
assert("Basic Gojuon has exactly 46 characters", BASIC_KANA.length === 46, `Got: ${BASIC_KANA.length}`);
assert("Dakuon / Handakuon has exactly 25 characters", DAKUON_KANA.length === 25, `Got: ${DAKUON_KANA.length}`);
assert("Yoon has exactly 33 combinations (21 unvoiced + 12 voiced/semi-voiced)", YOON_KANA.length === 33, `Got: ${YOON_KANA.length}`);
assert("Small Kana has exactly 12 characters", SMALL_KANA.length === 12, `Got: ${SMALL_KANA.length}`);
assert("ALL_KANA total equals 116 items", ALL_KANA.length === 116, `Got: ${ALL_KANA.length}`);

// 2. Uniqueness & No Duplicates
console.log("\n[2. Uniqueness & Integrity]");
const hiraSet = new Set<string>();
const kataSet = new Set<string>();
const idSet = new Set<string>();
let hasDuplicateHira = false;
let hasDuplicateKata = false;
let hasDuplicateId = false;

ALL_KANA.forEach((k) => {
  if (hiraSet.has(k.hira)) hasDuplicateHira = true;
  hiraSet.add(k.hira);

  if (kataSet.has(k.kata)) hasDuplicateKata = true;
  kataSet.add(k.kata);

  if (idSet.has(k.id)) hasDuplicateId = true;
  idSet.add(k.id);
});

assert("No duplicate Hiragana characters exist across all datasets", !hasDuplicateHira);
assert("No duplicate Katakana characters exist across all datasets", !hasDuplicateKata);
assert("All Kana records have globally unique IDs", !hasDuplicateId);

// 3. Canonical Gojuon Order
console.log("\n[3. Standard Gojuon Order]");
const expectedFirst5 = ["あ", "い", "う", "え", "お"];
const actualFirst5 = BASIC_KANA.slice(0, 5).map((k) => k.hira);
assert(
  "First 5 characters are standard A-row [あ, い, う, え, お]",
  JSON.stringify(actualFirst5) === JSON.stringify(expectedFirst5),
  `Got: ${actualFirst5.join(", ")}`
);

const lastChar = BASIC_KANA[BASIC_KANA.length - 1];
assert("Last character of Gojuon is 'ん' (n)", lastChar.hira === "ん" && lastChar.romaji === "n");

const expectedRows = ["a", "ka", "sa", "ta", "na", "ha", "ma", "ya", "ra", "wa"];
const actualRows = GOJUON_ROWS.map((r) => r.key).filter((k) => k !== "n");
assert("All 10 canonical Gojuon rows are configured in order", JSON.stringify(actualRows) === JSON.stringify(expectedRows));

// 4. Dakuten & Handakuten Integrity
console.log("\n[4. Dakuten & Handakuten Integrity]");
const dakuonHira = DAKUON_KANA.map((k) => k.hira);
assert("Contains Ga-row (が ぎ ぐ げ ご)", ["が", "ぎ", "ぐ", "げ", "ご"].every((c) => dakuonHira.includes(c)));
assert("Contains Za-row (ざ じ ず ぜ ぞ)", ["ざ", "じ", "ず", "ぜ", "ぞ"].every((c) => dakuonHira.includes(c)));
assert("Contains Da-row (だ ぢ づ で ど)", ["だ", "ぢ", "づ", "で", "ど"].every((c) => dakuonHira.includes(c)));
assert("Contains Ba-row (ば び ぶ べ ぼ)", ["ば", "び", "ぶ", "べ", "ぼ"].every((c) => dakuonHira.includes(c)));
assert("Contains Pa-row (ぱ ぴ ぷ ぺ ぽ)", ["ぱ", "ぴ", "ぷ", "ぺ", "ぽ"].every((c) => dakuonHira.includes(c)));

// 5. Yoon Voiced & Semi-Voiced Coverage
console.log("\n[5. Yoon Coverage]");
const yoonHira = YOON_KANA.map((k) => k.hira);
assert("Contains Unvoiced Yoon (きゃ きゅ きょ ...)", ["きゃ", "きゅ", "きょ", "しゃ", "しゅ", "しょ"].every((c) => yoonHira.includes(c)));
assert("Contains Voiced Gya-row (ぎゃ ぎゅ ぎょ)", ["ぎゃ", "ぎゅ", "ぎょ"].every((c) => yoonHira.includes(c)));
assert("Contains Voiced Ja-row (じゃ じゅ じょ)", ["じゃ", "じゅ", "じょ"].every((c) => yoonHira.includes(c)));
assert("Contains Voiced Bya-row (びゃ びゅ びょ)", ["びゃ", "びゅ", "びょ"].every((c) => yoonHira.includes(c)));
assert("Contains Semi-Voiced Pya-row (ぴゃ ぴゅ ぴょ)", ["ぴゃ", "ぴゅ", "ぴょ"].every((c) => yoonHira.includes(c)));

// 6. Small Kana Coverage
console.log("\n[6. Small Kana Coverage]");
const smallHira = SMALL_KANA.map((k) => k.hira);
const expectedSmall = ["ぁ", "ぃ", "ぅ", "ぇ", "ぉ", "ゃ", "ゅ", "ょ", "っ", "ゎ", "ゕ", "ゖ"];
assert("Contains all 12 small Kana characters", expectedSmall.every((c) => smallHira.includes(c)));

// 7. Stroke Data Integrity
console.log("\n[7. Stroke Data Integrity]");
let allStrokesPositive = true;
ALL_KANA.forEach((k) => {
  if (k.strokes.hira <= 0 || k.strokes.kata <= 0) {
    allStrokesPositive = false;
  }
});
assert("All Kana have positive stroke counts for both Hiragana and Katakana", allStrokesPositive);

assert(
  "Hiragana stroke vector paths exist for core characters (あ..ん)",
  Object.keys(HIRAGANA_STROKE_DATA).length >= 46,
  `Got ${Object.keys(HIRAGANA_STROKE_DATA).length} characters`
);
assert(
  "Katakana stroke vector paths exist for core characters (ア..ン)",
  Object.keys(KATAKANA_STROKE_DATA).length >= 46,
  `Got ${Object.keys(KATAKANA_STROKE_DATA).length} characters`
);

// 8. Explicit Character Stroke Checks (MEXT Standards)
console.log("\n[8. Explicit Character Stroke Checks]");
const hiraExpectedCounts: Record<string, number> = {
  "あ": 3, "い": 2, "う": 2, "え": 2, "お": 3,
  "き": 3, "さ": 3, "ち": 2, "ふ": 4, "ん": 1,
};
Object.entries(hiraExpectedCounts).forEach(([char, count]) => {
  const strokes = getKanaStrokes(char, "hira");
  assert(
    `Hiragana '${char}' has exactly ${count} strokes (MEXT)`,
    strokes.length === count,
    `Got ${strokes.length}`
  );
});

// 9. All 116 Kana Stroke Engine Coverage
console.log("\n[9. Full 116 Kana Stroke Engine Validation]");
let allHiraStrokesMatch = true;
let allKataStrokesMatch = true;
ALL_KANA.forEach((item) => {
  const hStrokes = getKanaStrokes(item.hira, "hira");
  if (!hStrokes || hStrokes.length !== item.strokes.hira) {
    allHiraStrokesMatch = false;
    console.error(`  Mismatch hira '${item.hira}': expected ${item.strokes.hira}, got ${hStrokes ? hStrokes.length : 0}`);
  }
  const kStrokes = getKanaStrokes(item.kata, "kata");
  if (!kStrokes || kStrokes.length !== item.strokes.kata) {
    allKataStrokesMatch = false;
    console.error(`  Mismatch kata '${item.kata}': expected ${item.strokes.kata}, got ${kStrokes ? kStrokes.length : 0}`);
  }
});
assert("All 116 Hiragana characters have exact matching stroke sequences", allHiraStrokesMatch);
assert("All 116 Katakana characters have exact matching stroke sequences", allKataStrokesMatch);

// 10. User-Specified Problem Characters (あ, い, か, が, び, ゆ, きゃ, きゅ, きょ, キャ)
console.log("\n[10. User-Specified Problem Characters (あ, い, か, が, び, ゆ, きゃ, よ)]");
const targetChecks = [
  { char: "あ", type: "hira" as const, expected: 3, label: "あ (Hiragana 'a')" },
  { char: "い", type: "hira" as const, expected: 2, label: "い (Hiragana 'i')" },
  { char: "か", type: "hira" as const, expected: 3, label: "か (Hiragana 'ka')" },
  { char: "が", type: "hira" as const, expected: 5, label: "が (Hiragana 'ga' with 2 dakuten marks)" },
  { char: "び", type: "hira" as const, expected: 3, label: "び (Hiragana 'bi' with 2 dakuten marks)" },
  { char: "ゆ", type: "hira" as const, expected: 2, label: "ゆ (Hiragana 'yu')" },
  { char: "よ", type: "hira" as const, expected: 2, label: "よ (Hiragana 'yo')" },
  { char: "きゃ", type: "hira" as const, expected: 6, label: "きゃ (Yōon 'kya': ki 3 + ya 3)" },
  { char: "きゅ", type: "hira" as const, expected: 5, label: "きゅ (Yōon 'kyu': ki 3 + yu 2)" },
  { char: "きょ", type: "hira" as const, expected: 5, label: "きょ (Yōon 'kyo': ki 3 + yo 2)" },
  { char: "キャ", type: "kata" as const, expected: 5, label: "キャ (Katakana 'kya': ki 3 + ya 2)" },
  { char: "キュ", type: "kata" as const, expected: 5, label: "キュ (Katakana 'kyu': ki 3 + yu 2)" },
  { char: "キョ", type: "kata" as const, expected: 6, label: "キョ (Katakana 'kyo': ki 3 + yo 3)" },
  { char: "ヨ", type: "kata" as const, expected: 3, label: "ヨ (Katakana 'yo')" },
];

targetChecks.forEach(({ char, type, expected, label }) => {
  const strokes = getKanaStrokes(char, type);
  assert(`${label} has exactly ${expected} strokes`, strokes.length === expected, `Got ${strokes.length}`);

  // Check sequential indices
  const indicesSequential = strokes.every((s, i) => s.index === i + 1);
  assert(`${label} has sequential stroke indices (1..${expected})`, indicesSequential);

  // Check valid SVG path strings
  const validPaths = strokes.every((s) => s.d.startsWith("M") && !s.d.includes("NaN"));
  assert(`${label} has valid SVG path syntax with non-null coordinates`, validPaths);
});

// 11. Authoritative Yōon Master Dataset Audit
console.log("\n[11. Authoritative Yōon Master Dataset Audit]");
assert("HIRAGANA_YOON_DATA has exactly 33 combinations", HIRAGANA_YOON_DATA.length === 33, `Got ${HIRAGANA_YOON_DATA.length}`);
assert("KATAKANA_YOON_DATA has exactly 33 combinations", KATAKANA_YOON_DATA.length === 33, `Got ${KATAKANA_YOON_DATA.length}`);
assert("ALL_YOON_DATA has exactly 66 total entries", ALL_YOON_DATA.length === 66, `Got ${ALL_YOON_DATA.length}`);

let allYoonSumsMatch = true;
let allYoonVectorsMatch = true;
let allYoonComponentsPresent = true;

ALL_YOON_DATA.forEach((entry) => {
  if (entry.totalStrokes !== entry.firstStrokes + entry.smallStrokes) {
    allYoonSumsMatch = false;
    console.error(`  Sum mismatch for ${entry.char}: total ${entry.totalStrokes} !== ${entry.firstStrokes} + ${entry.smallStrokes}`);
  }

  const strokes = getKanaStrokes(entry.char, entry.scriptType);
  if (strokes.length !== entry.totalStrokes) {
    allYoonVectorsMatch = false;
    console.error(`  Vector count mismatch for ${entry.char}: expected ${entry.totalStrokes}, got ${strokes.length}`);
  }

  const hasComponents = strokes.every((s) => s.component === "first" || s.component === "small");
  if (!hasComponents) {
    allYoonComponentsPresent = false;
    console.error(`  Missing component tag in strokes of ${entry.char}`);
  }
});

assert("All 66 Yōon entries satisfy exact stroke math (total = first + small)", allYoonSumsMatch);
assert("All 66 Yōon entries have exact matching stroke vectors from getKanaStrokes", allYoonVectorsMatch);
assert("All 66 Yōon entries have component separation tags (first & small)", allYoonComponentsPresent);

console.log(`\n=== KANA TEST RESULTS: ${passedTests}/${totalTests} TESTS PASSED ===\n`);

if (passedTests !== totalTests) {
  process.exit(1);
}
