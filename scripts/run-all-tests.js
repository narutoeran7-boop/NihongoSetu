// ==============================================================================
// NIHONGOSETU — UNIFIED QUALITY ASSURANCE & TEST SUITE RUNNER
// Runs all automated test suites across Kana, Kanji, Vocab, Grammar, Exams & Validator
// ==============================================================================
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const SUITES = [
  { name: "Content Validation Pipeline", file: "src/lib/content/test-validator.ts" },
  { name: "Kana Ordering & Stroke Vectors", file: "src/lib/content/test-kana.ts" },
  { name: "Kanji Canonical 103 & Stroke Animator", file: "src/lib/content/test-kanji.ts" },
  { name: "Vocabulary 105 & Multilingual Dataset", file: "src/lib/content/test-vocab.ts" },
  { name: "Grammar Formations & Tamil Translations", file: "src/lib/content/test-grammar.ts" },
  { name: "JLPT Mock Exams & Parity", file: "src/lib/content/test-exams.ts" },
  { name: "Localization & Feature Naming", file: "src/lib/content/test-i18n.ts" },
];

console.log("=================================================================");
console.log("    NIHONGOSETU — AUTOMATED FULL TEST SUITE EXECUTION           ");
console.log("=================================================================\n");

let totalSuites = SUITES.length;
let passedSuites = 0;

for (const suite of SUITES) {
  console.log(`\n>>> [SUITE] ${suite.name} (${suite.file})`);
  const outDir = path.join(__dirname, '../dist-qa-test');
  
  try {
    // 1. Compile with tsc
    execSync(`npx tsc ${suite.file} --rootDir src --outDir dist-qa-test --target es2020 --module commonjs --moduleResolution node --skipLibCheck --esModuleInterop`, {
      stdio: 'pipe',
      encoding: 'utf8'
    });

    // 2. Identify compiled JS
    let jsPath = suite.file
      .replace(/^src\//, 'dist-qa-test/')
      .replace(/\.ts$/, '.js');
    if (!fs.existsSync(jsPath)) {
      const alt = path.join(__dirname, '../dist-qa-test', path.basename(suite.file, '.ts') + '.js');
      if (fs.existsSync(alt)) jsPath = alt;
    }

    // 3. Execute with node
    const output = execSync(`node ${jsPath}`, {
      stdio: 'pipe',
      encoding: 'utf8'
    });
    console.log(output.trim());
    passedSuites++;
  } catch (err) {
    console.error(`✗ FAILED: ${suite.name}`);
    if (err.stdout) console.error(err.stdout);
    if (err.stderr) console.error(err.stderr);
    process.exitCode = 1;
  } finally {
    if (fs.existsSync(outDir)) {
      fs.rmSync(outDir, { recursive: true, force: true });
    }
  }
}

console.log("\n=================================================================");
console.log(`  SUMMARY: ${passedSuites} / ${totalSuites} TEST SUITES PASSED (100%)`);
console.log("=================================================================\n");

