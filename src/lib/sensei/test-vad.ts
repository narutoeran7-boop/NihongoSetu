// ==============================================================================
// NIHONGOSETU — VOICE ACTIVITY DETECTION & NOISE SUPPRESSION TEST SUITE
// Verifies noise filtering, meaningful speech detection, and state machine flow
// ==============================================================================

import {
  VoiceActivityDetector,
  DEFAULT_VAD_CONFIG,
  isMeaningfulSpeech,
  VADState,
} from "./voiceActivityDetector";

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

export function runVADTests(): { passed: number; total: number; failed: number } {
  console.log("\n=== RUNNING NIHONGOSETU VAD & NOISE SUPPRESSION TESTS ===\n");

  // 1. Noise Suppression & Audio Configuration Parameters
  console.log("[1. Audio Constraints & VAD Configuration Thresholds]");
  assert(DEFAULT_VAD_CONFIG.minSpeechDurationMs >= 200, "Minimum speech duration is at least 200ms to reject clicks");
  assert(DEFAULT_VAD_CONFIG.silenceTurnTimeoutMs >= 900, "End-of-turn silence debounce is at least 900ms");
  assert(DEFAULT_VAD_CONFIG.silenceTurnTimeoutMs <= 1500, "End-of-turn silence debounce is under 1500ms to avoid stuck turn");
  assert(
    DEFAULT_VAD_CONFIG.interruptionThreshold > DEFAULT_VAD_CONFIG.baseSpeechThreshold + 15,
    "Interruption threshold is strictly higher than base speech threshold (prevents fan/static barge-in)"
  );
  assert(DEFAULT_VAD_CONFIG.noiseSensitivityMargin >= 10, "Noise sensitivity margin maintains buffer above ambient floor");
  assert(DEFAULT_VAD_CONFIG.maxSpeechTurnMs <= 25000, "Safety max-turn timeout enforces timely completion");

  // 2. Meaningful Speech Detection across Supported Languages
  console.log("\n[2. Meaningful Speech Recognition (True Positives)]");
  assert(isMeaningfulSpeech("こんにちは"), "Accepts Japanese greeting ('こんにちは')");
  assert(isMeaningfulSpeech("これは何ですか？"), "Accepts Japanese question ('これは何ですか？')");
  assert(isMeaningfulSpeech("食べます"), "Accepts Japanese verb ('食べます')");
  assert(isMeaningfulSpeech("வணக்கம்"), "Accepts Tamil greeting ('வணக்கம்')");
  assert(isMeaningfulSpeech("இந்த grammar-ஐ explain பண்ணுங்க"), "Accepts mixed Tamil/Tanglish request");
  assert(isMeaningfulSpeech("Hello Sensei, how are you?"), "Accepts conversational English phrase");
  assert(isMeaningfulSpeech("Bonjour, comment allez-vous?"), "Accepts French phrase");
  assert(isMeaningfulSpeech("Hola, ¿cómo estás?"), "Accepts Spanish phrase");
  assert(isMeaningfulSpeech("Guten Tag Sensei"), "Accepts German phrase");

  // 3. Background Noise & Meaningless Hallucination Rejection (True Negatives)
  console.log("\n[3. Background Noise & Non-Speech Rejection (True Negatives)]");
  assert(!isMeaningfulSpeech(""), "Rejects empty string");
  assert(!isMeaningfulSpeech("   "), "Rejects whitespace-only input");
  assert(!isMeaningfulSpeech("."), "Rejects single dot / punctuation click");
  assert(!isMeaningfulSpeech("..."), "Rejects static dots ('...')");
  assert(!isMeaningfulSpeech("---"), "Rejects dashes");
  assert(!isMeaningfulSpeech("a"), "Rejects isolated single letter ('a')");
  assert(!isMeaningfulSpeech("uh"), "Rejects filler noise token ('uh')");
  assert(!isMeaningfulSpeech("um"), "Rejects filler noise token ('um')");
  assert(!isMeaningfulSpeech("ah"), "Rejects filler noise token ('ah')");
  assert(!isMeaningfulSpeech("shh"), "Rejects mic static hiss ('shh')");

  // 4. State Machine Transition Integrity
  console.log("\n[4. State Machine Lifecycle (IDLE -> LISTENING -> SPEECH -> PROCESSING -> SPEAKING)]");
  const vad = new VoiceActivityDetector();
  assert(vad.getState() === "idle", "Initial state is 'idle'");

  vad.setState("listening");
  assert(vad.getState() === "listening", "Transitions to 'listening' when mic is active");

  vad.setState("speech_detected");
  assert(vad.getState() === "speech_detected", "Transitions to 'speech_detected' upon sustained vocal energy");

  vad.setState("processing");
  assert(vad.getState() === "processing", "Transitions to 'processing' when turn completes");

  vad.setAIPlaybackState(true);
  assert(vad.getState() === "speaking", "Transitions to 'speaking' when Sensei begins speech synthesis");

  vad.setAIPlaybackState(false);
  vad.resetToListening();
  assert(vad.getState() === "listening", "Transitions back to 'listening' seamlessly after Sensei finishes speaking");

  vad.setState("interrupted");
  assert(vad.getState() === "interrupted", "Transitions to 'interrupted' when student barge-in occurs");

  vad.destroy();
  assert(vad.getState() === "idle", "Transitions cleanly to 'idle' on destruction");

  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  console.log(`\n=== VAD & NOISE TEST RESULTS: ${passed}/${results.length} TESTS PASSED ===\n`);

  return { passed, total: results.length, failed };
}

if (typeof require !== "undefined" && require.main === module) {
  const summary = runVADTests();
  if (summary.failed > 0) process.exit(1);
}

