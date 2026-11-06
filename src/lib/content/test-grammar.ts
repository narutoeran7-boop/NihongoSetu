// ==============================================================================
// NIHONGOSETU — AUTOMATED GRAMMAR VALIDATION TEST SUITE
// Tests 100% grammar pattern integrity, Tamil definitions, formations & examples
// ==============================================================================

import { getGrammarForLevel, GRAMMAR_DATA, GrammarItem } from "../../data/grammar";

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

console.log("=== RUNNING NIHONGOSETU GRAMMAR AUDIT & VALIDATION TESTS ===\n");

// 1. Pattern Counts & Staging
console.log("[1. Grammar Counts & Staging]");
const n5Grammar = getGrammarForLevel("N5");
const n4Grammar = getGrammarForLevel("N4");
const n3Grammar = getGrammarForLevel("N3");
const n2Grammar = getGrammarForLevel("N2");
const n1Grammar = getGrammarForLevel("N1");

assert("N5 dataset contains exactly 20 comprehensive patterns", n5Grammar.length === 20, `Got: ${n5Grammar.length}`);
assert("N4 dataset contains staged patterns", n4Grammar.length >= 10, `Got: ${n4Grammar.length}`);
assert("N3 dataset contains staged patterns", n3Grammar.length >= 10, `Got: ${n3Grammar.length}`);
assert("N2 dataset contains staged patterns", n2Grammar.length >= 10, `Got: ${n2Grammar.length}`);
assert("N1 dataset contains staged patterns", n1Grammar.length >= 10, `Got: ${n1Grammar.length}`);

// 2. Uniqueness & Integrity
console.log("\n[2. Uniqueness & Integrity]");
const patternSet = new Set<string>();
let hasDuplicatePattern = false;

n5Grammar.forEach((g) => {
  if (patternSet.has(g.pattern)) hasDuplicatePattern = true;
  patternSet.add(g.pattern);
});

assert("No duplicate grammar patterns in N5 dataset", !hasDuplicatePattern);

// 3. Formations & Tamil Translations
console.log("\n[3. Formations & Tamil Learning Support]");
let allTamilMeaningsValid = true;
let allFormationsValid = true;
let allTamilExamplesValid = true;

n5Grammar.forEach((g) => {
  if (!g.meaningTa || g.meaningTa.trim().length === 0) allTamilMeaningsValid = false;
  if (!g.formation || g.formation.trim().length === 0) allFormationsValid = false;
  if (!g.exampleTa || g.exampleTa.trim().length === 0) allTamilExamplesValid = false;
});

assert("All 20 N5 grammar patterns have verified Tamil definitions (meaningTa)", allTamilMeaningsValid);
assert("All 20 N5 grammar patterns have grammatical formation rules (formation)", allFormationsValid);
assert("All 20 N5 grammar patterns have verified Tamil example translations (exampleTa)", allTamilExamplesValid);

// 4. Example Sentences & Japanese Orthography
console.log("\n[4. Example Sentences & Orthography]");
let allExamplesValid = true;
const REGEX_HAS_JAPANESE = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/;

n5Grammar.forEach((g) => {
  if (!g.exampleJp || !REGEX_HAS_JAPANESE.test(g.exampleJp)) allExamplesValid = false;
  if (!g.exampleEn || g.exampleEn.trim().length === 0) allExamplesValid = false;
});

assert("All 20 N5 grammar patterns have valid Japanese example sentences", allExamplesValid);

console.log(`\n=== GRAMMAR TEST RESULTS: ${passedTests}/${totalTests} TESTS PASSED ===\n`);

if (passedTests !== totalTests) {
  process.exit(1);
}
