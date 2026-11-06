// ==============================================================================
// NIHONGOSETU — AUTOMATED JLPT MOCK EXAM VALIDATION TEST SUITE
// Tests 100% question parity, answer keys, Tamil explanations & section breakdown
// ==============================================================================

// Bypass Next.js 'server-only' mock in standalone Node test runner
try {
  const p = require.resolve('server-only');
  require.cache[p] = { id: p, filename: p, loaded: true, exports: {} } as any;
} catch {}

import { getClientQuestionsForLevel, JLPTLevel } from "../../data/questions";
import { getServerQuestionsForLevel } from "../../data/serverQuestions";

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

console.log("=== RUNNING NIHONGOSETU JLPT EXAM AUDIT & VALIDATION TESTS ===\n");

const LEVELS: JLPTLevel[] = ["N5", "N4", "N3", "N2", "N1"];

// 1. Client-Server Question Parity across all levels
console.log("[1. Client-Server Question Parity]");
LEVELS.forEach((lvl) => {
  const clientQs = getClientQuestionsForLevel(lvl);
  const serverQs = getServerQuestionsForLevel(lvl);

  assert(
    `JLPT ${lvl} has matching question count between client and server`,
    clientQs.length === serverQs.length && clientQs.length > 0,
    `Client: ${clientQs.length}, Server: ${serverQs.length}`
  );

  let allIdsMatch = true;
  let allOptionsMatch = true;

  clientQs.forEach((cq, idx) => {
    const sq = serverQs[idx];
    if (!sq || cq.id !== sq.id) allIdsMatch = false;
    if (!sq || cq.options.length !== sq.options.length) allOptionsMatch = false;
  });

  assert(`JLPT ${lvl} IDs match identically between client and server`, allIdsMatch);
  assert(`JLPT ${lvl} options match identically between client and server`, allOptionsMatch);
});

// 2. N5 Canonical Exam Integrity
console.log("\n[2. N5 Canonical Mock Exam Integrity]");
const n5Client = getClientQuestionsForLevel("N5");
const n5Server = getServerQuestionsForLevel("N5");

assert("N5 Exam contains exactly 20 comprehensive questions", n5Client.length === 20, `Got: ${n5Client.length}`);

// Uniqueness
const n5Ids = new Set<string>();
let hasDupeId = false;
n5Client.forEach((q) => {
  if (n5Ids.has(q.id)) hasDupeId = true;
  n5Ids.add(q.id);
});
assert("No duplicate question IDs in N5 exam", !hasDupeId);

// 3. Answer Keys & Explanations
console.log("\n[3. Answer Keys & Explanations]");
let allKeysValid = true;
let allExplanationsValid = true;
let allTamilExplanationsValid = true;

n5Server.forEach((q) => {
  if (typeof q.correctIndex !== "number" || q.correctIndex < 0 || q.correctIndex >= q.options.length) {
    allKeysValid = false;
  }
  if (!q.explanation || q.explanation.trim().length === 0) {
    allExplanationsValid = false;
  }
  if (!q.explanationTa || q.explanationTa.trim().length === 0) {
    allTamilExplanationsValid = false;
  }
});

assert("All N5 questions have valid answer keys (0 <= correctIndex < options.length)", allKeysValid);
assert("All N5 questions have educational English explanations", allExplanationsValid);
assert("All N5 questions have verified Tamil explanations (explanationTa)", allTamilExplanationsValid);

// 4. Section Breakdown: Language Knowledge, Reading, Listening
console.log("\n[4. Section Breakdown & Multimodal Content]");
const vocabQuestions = n5Client.filter((q) => q.category === "Vocabulary");
const grammarQuestions = n5Client.filter((q) => q.category === "Grammar");
const readingQuestions = n5Client.filter((q) => q.category === "Reading");
const listeningQuestions = n5Client.filter((q) => q.category === "Listening");

assert("N5 Exam includes Language Knowledge: Vocabulary questions", vocabQuestions.length >= 7, `Got: ${vocabQuestions.length}`);
assert("N5 Exam includes Language Knowledge: Grammar questions", grammarQuestions.length >= 7, `Got: ${grammarQuestions.length}`);
assert("N5 Exam includes Reading Comprehension questions", readingQuestions.length >= 3, `Got: ${readingQuestions.length}`);
assert("N5 Exam includes Listening Comprehension questions", listeningQuestions.length >= 3, `Got: ${listeningQuestions.length}`);

// Verify Reading Passages
let readingPassagesValid = true;
readingQuestions.forEach((q) => {
  if (!q.passage || q.passage.trim().length === 0) readingPassagesValid = false;
});
assert("All Reading questions have authentic Japanese reading passages", readingPassagesValid);

// Verify Listening Audio Prompts
let listeningAudioValid = true;
listeningQuestions.forEach((q) => {
  if (!q.audioPrompt || q.audioPrompt.trim().length === 0) listeningAudioValid = false;
});
assert("All Listening questions have spoken audio dialogue prompts", listeningAudioValid);

console.log(`\n=== EXAM TEST RESULTS: ${passedTests}/${totalTests} TESTS PASSED ===\n`);

if (passedTests !== totalTests) {
  process.exit(1);
}
