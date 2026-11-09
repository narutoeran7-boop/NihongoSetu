const { ALL_KANA, BASIC_KANA, DAKUON_KANA, YOON_KANA, SMALL_KANA } = require("../src/data/kana.ts");
const { getKanaStrokes, HIRAGANA_STROKE_DATA, KATAKANA_STROKE_DATA } = require("../src/data/kanaStrokes.ts");

console.log("Validating Kana Stroke Engine across ALL_KANA...");

let totalPassed = 0;
let totalChecked = 0;
let errors = [];

// 1. Validate All 46 Basic Hiragana
console.log("\n1. Basic Hiragana (46 characters):");
BASIC_KANA.forEach((item) => {
  totalChecked++;
  const strokes = getKanaStrokes(item.hira, "hira");
  if (!strokes || strokes.length === 0) {
    errors.push(`Missing strokes for Hiragana ${item.hira}`);
  } else if (strokes.length !== item.strokes.hira) {
    errors.push(`Mismatch for ${item.hira}: expected ${item.strokes.hira}, got ${strokes.length}`);
  } else {
    totalPassed++;
  }
});
console.log(`  Passed: ${totalPassed} / ${totalChecked}`);

// 2. Validate All 46 Basic Katakana
console.log("\n2. Basic Katakana (46 characters):");
let kataChecked = 0;
let kataPassed = 0;
BASIC_KANA.forEach((item) => {
  kataChecked++;
  const strokes = getKanaStrokes(item.kata, "kata");
  if (!strokes || strokes.length === 0) {
    errors.push(`Missing strokes for Katakana ${item.kata}`);
  } else if (strokes.length !== item.strokes.kata) {
    errors.push(`Mismatch for Katakana ${item.kata}: expected ${item.strokes.kata}, got ${strokes.length}`);
  } else {
    kataPassed++;
  }
});
console.log(`  Passed: ${kataPassed} / ${kataChecked}`);

// 3. Validate Dakuten / Handakuten (25 characters)
console.log("\n3. Dakuten & Handakuten (25 characters):");
let dakuChecked = 0;
let dakuPassed = 0;
DAKUON_KANA.forEach((item) => {
  dakuChecked++;
  const hiraStrokes = getKanaStrokes(item.hira, "hira");
  const kataStrokes = getKanaStrokes(item.kata, "kata");

  if (!hiraStrokes || hiraStrokes.length !== item.strokes.hira) {
    errors.push(`Dakuten Hiragana ${item.hira} mismatch: expected ${item.strokes.hira}, got ${hiraStrokes ? hiraStrokes.length : 0}`);
  } else if (!kataStrokes || kataStrokes.length !== item.strokes.kata) {
    errors.push(`Dakuten Katakana ${item.kata} mismatch: expected ${item.strokes.kata}, got ${kataStrokes ? kataStrokes.length : 0}`);
  } else {
    dakuPassed++;
  }
});
console.log(`  Passed: ${dakuPassed} / ${dakuChecked}`);

// 4. Validate Yōon (33 characters)
console.log("\n4. Yōon Combinations (33 combinations):");
let yoonChecked = 0;
let yoonPassed = 0;
YOON_KANA.forEach((item) => {
  yoonChecked++;
  const hiraStrokes = getKanaStrokes(item.hira, "hira");
  const kataStrokes = getKanaStrokes(item.kata, "kata");

  if (!hiraStrokes || hiraStrokes.length !== item.strokes.hira) {
    errors.push(`Yoon Hiragana ${item.hira} mismatch: expected ${item.strokes.hira}, got ${hiraStrokes ? hiraStrokes.length : 0}`);
  } else if (!kataStrokes || kataStrokes.length !== item.strokes.kata) {
    errors.push(`Yoon Katakana ${item.kata} mismatch: expected ${item.strokes.kata}, got ${kataStrokes ? kataStrokes.length : 0}`);
  } else {
    yoonPassed++;
  }
});
console.log(`  Passed: ${yoonPassed} / ${yoonChecked}`);

// 5. Validate Small Kana (9 characters)
console.log("\n5. Small Kana (9 characters):");
let smallChecked = 0;
let smallPassed = 0;
SMALL_KANA.forEach((item) => {
  smallChecked++;
  const hiraStrokes = getKanaStrokes(item.hira, "hira");
  const kataStrokes = getKanaStrokes(item.kata, "kata");

  if (!hiraStrokes || hiraStrokes.length !== item.strokes.hira) {
    errors.push(`Small Hiragana ${item.hira} mismatch: expected ${item.strokes.hira}, got ${hiraStrokes ? hiraStrokes.length : 0}`);
  } else if (!kataStrokes || kataStrokes.length !== item.strokes.kata) {
    errors.push(`Small Katakana ${item.kata} mismatch: expected ${item.strokes.kata}, got ${kataStrokes ? kataStrokes.length : 0}`);
  } else {
    smallPassed++;
  }
});
console.log(`  Passed: ${smallPassed} / ${smallChecked}`);

if (errors.length > 0) {
  console.error(`\nFAILED: Found ${errors.length} errors:`);
  errors.slice(0, 15).forEach((e) => console.error(`  - ${e}`));
  process.exit(1);
} else {
  console.log(`\nALL 113 KANA ITEMS (226 SCRIPT VARIANTS) PASSED WITH 100% ACCURACY!`);
}

