// ==============================================================================
// NIHONGOSETU — CONTENT VALIDATION PIPELINE & QUALITY ASSURANCE ENGINE
// ==============================================================================
// Rigorously validates Japanese language data integrity, Unicode ranges,
// duplicate detection, stroke count boundaries, and staged review statuses.
// ==============================================================================

import {
  KanjiEntry,
  VocabularyEntry,
  JLPTLevel,
  ContentReviewStatus,
  ValidationSummary,
  ValidationErrorItem,
  ValidationWarningItem,
} from "../../types/content";

// Unicode Regular Expression Ranges for Japanese Orthography
const REGEX_KANJI = /^[\u4E00-\u9FAF\u3400-\u4DBF]$/;
const REGEX_HAS_KANJI = /[\u4E00-\u9FAF\u3400-\u4DBF]/;
const REGEX_HIRAGANA_ONLY = /^[\u3040-\u309F\u30FC\s・.-]+$/;
const REGEX_KATAKANA_ONLY = /^[\u30A0-\u30FF\u30FC\s・.-]+$/;
const REGEX_HAS_JAPANESE = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/;

const VALID_LEVELS: JLPTLevel[] = ["N5", "N4", "N3", "N2", "N1"];
const VALID_STATUSES: ContentReviewStatus[] = [
  "imported",
  "validated",
  "needs_tamil_review",
  "reviewed",
  "published",
];

const PLACEHOLDER_PATTERNS = [
  /word\s*\d+/i,
  /kanji\s*example/i,
  /todo/i,
  /placeholder/i,
  /sample\s*meaning/i,
  /test\s*entry/i,
];

/**
 * Checks if a string contains known placeholder or filler content.
 */
function containsPlaceholder(text: string): boolean {
  if (!text) return false;
  return PLACEHOLDER_PATTERNS.some((pattern) => pattern.test(text));
}

/**
 * Validates a single Kanji entry.
 */
export function validateKanjiEntry(entry: KanjiEntry): {
  isValid: boolean;
  errors: ValidationErrorItem[];
  warnings: ValidationWarningItem[];
} {
  const errors: ValidationErrorItem[] = [];
  const warnings: ValidationWarningItem[] = [];
  const id = entry.id || "UNKNOWN_KANJI_ID";

  // 1. ID Validation
  if (!entry.id || typeof entry.id !== "string" || !entry.id.trim()) {
    errors.push({ id, field: "id", message: "Kanji ID is required and cannot be empty." });
  }

  // 2. Character Validation
  if (!entry.character) {
    errors.push({ id, field: "character", message: "Kanji character is required." });
  } else if (!REGEX_KANJI.test(entry.character)) {
    errors.push({
      id,
      field: "character",
      message: `Invalid Kanji character: '${entry.character}'. Must be a single CJK Unified Ideograph.`,
      value: entry.character,
    });
  }

  // 3. JLPT Level Validation
  if (!VALID_LEVELS.includes(entry.jlptLevel)) {
    errors.push({
      id,
      field: "jlptLevel",
      message: `Invalid JLPT level: '${entry.jlptLevel}'. Must be one of: ${VALID_LEVELS.join(", ")}.`,
      value: entry.jlptLevel,
    });
  }

  // 4. Level Classification Metadata Validation
  if (!entry.levelMetadata) {
    errors.push({
      id,
      field: "levelMetadata",
      message: "Level classification metadata is required to clearly document curriculum attribution.",
    });
  } else {
    if (entry.levelMetadata.isEstimated !== true) {
      warnings.push({
        id,
        field: "levelMetadata.isEstimated",
        message: "Post-2010 JLPT classifications should be marked as isEstimated: true (reference-based standard).",
      });
    }
    if (!entry.levelMetadata.sourceReference) {
      warnings.push({
        id,
        field: "levelMetadata.sourceReference",
        message: "Curriculum source reference is missing in level metadata.",
      });
    }
  }

  // 5. Meaning Validation
  if (!entry.meaningEn || !entry.meaningEn.trim()) {
    errors.push({ id, field: "meaningEn", message: "English meaning is required." });
  } else if (containsPlaceholder(entry.meaningEn)) {
    errors.push({
      id,
      field: "meaningEn",
      message: `English meaning contains prohibited placeholder text: '${entry.meaningEn}'.`,
      value: entry.meaningEn,
    });
  }

  // Tamil Meaning QA
  if (!entry.meaningTa || !entry.meaningTa.trim()) {
    if (entry.reviewStatus === "published") {
      warnings.push({
        id,
        field: "meaningTa",
        message: "Tamil meaning is absent for published entry. Set reviewStatus to 'needs_tamil_review'.",
      });
    }
  }

  // 6. Readings Validation
  if (!Array.isArray(entry.onyomi) || entry.onyomi.length === 0) {
    warnings.push({
      id,
      field: "onyomi",
      message: "No On'yomi readings provided (rare for standard JLPT Kanji).",
    });
  } else {
    entry.onyomi.forEach((on, idx) => {
      // Clean reading without middle dot or hyphen for testing Katakana
      const cleanOn = on.replace(/[-・\s]/g, "");
      if (cleanOn && !REGEX_KATAKANA_ONLY.test(cleanOn)) {
        errors.push({
          id,
          field: `onyomi[${idx}]`,
          message: `On'yomi reading '${on}' should be written in Katakana.`,
          value: on,
        });
      }
    });
  }

  if (!Array.isArray(entry.kunyomi)) {
    errors.push({ id, field: "kunyomi", message: "Kun'yomi must be an array of readings." });
  } else {
    entry.kunyomi.forEach((kun, idx) => {
      // Clean reading without okurigana separator (.) or hyphen (-)
      const cleanKun = kun.replace(/[-.・\s]/g, "");
      if (cleanKun && !REGEX_HIRAGANA_ONLY.test(cleanKun)) {
        errors.push({
          id,
          field: `kunyomi[${idx}]`,
          message: `Kun'yomi reading '${kun}' should be written in Hiragana.`,
          value: kun,
        });
      }
    });
  }

  // 7. Stroke Count & Radical Validation
  if (
    typeof entry.strokeCount !== "number" ||
    !Number.isInteger(entry.strokeCount) ||
    entry.strokeCount < 1 ||
    entry.strokeCount > 64
  ) {
    errors.push({
      id,
      field: "strokeCount",
      message: `Invalid stroke count: ${entry.strokeCount}. Must be an integer between 1 and 64.`,
      value: entry.strokeCount,
    });
  }

  if (!entry.radical || typeof entry.radical !== "object") {
    errors.push({ id, field: "radical", message: "Radical information object is required." });
  } else {
    if (!entry.radical.character) {
      errors.push({ id, field: "radical.character", message: "Radical character is required." });
    }
    if (!entry.radical.nameJa) {
      warnings.push({ id, field: "radical.nameJa", message: "Japanese radical name is recommended." });
    }
    if (
      typeof entry.radical.strokes !== "number" ||
      entry.radical.strokes < 1 ||
      entry.radical.strokes > entry.strokeCount
    ) {
      warnings.push({
        id,
        field: "radical.strokes",
        message: `Radical strokes (${entry.radical.strokes}) should be <= character stroke count (${entry.strokeCount}).`,
      });
    }
  }

  // 8. Compounds Validation
  if (!Array.isArray(entry.compounds) || entry.compounds.length === 0) {
    warnings.push({
      id,
      field: "compounds",
      message: "At least one compound word using the Kanji is strongly recommended.",
    });
  } else {
    entry.compounds.forEach((cmp, idx) => {
      if (!cmp.word || !REGEX_HAS_JAPANESE.test(cmp.word)) {
        errors.push({
          id,
          field: `compounds[${idx}].word`,
          message: `Compound word '${cmp.word}' must contain valid Japanese characters.`,
          value: cmp.word,
        });
      }
      if (!cmp.reading || !REGEX_HIRAGANA_ONLY.test(cmp.reading.replace(/[\s・]/g, ""))) {
        warnings.push({
          id,
          field: `compounds[${idx}].reading`,
          message: `Compound reading '${cmp.reading}' should be in Hiragana.`,
          value: cmp.reading,
        });
      }
      if (!cmp.meaningEn) {
        errors.push({
          id,
          field: `compounds[${idx}].meaningEn`,
          message: "Compound English meaning is required.",
        });
      }
    });
  }

  // 9. Examples Validation
  if (!Array.isArray(entry.examples)) {
    errors.push({ id, field: "examples", message: "Examples must be an array." });
  } else {
    entry.examples.forEach((ex, idx) => {
      if (!ex.ja || !REGEX_HAS_JAPANESE.test(ex.ja)) {
        errors.push({
          id,
          field: `examples[${idx}].ja`,
          message: `Example Japanese text must contain Japanese characters.`,
          value: ex.ja,
        });
      }
      if (!ex.en || !ex.en.trim()) {
        errors.push({
          id,
          field: `examples[${idx}].en`,
          message: `Example English translation is required.`,
        });
      }
    });
  }

  // 10. Review Status Validation
  if (!VALID_STATUSES.includes(entry.reviewStatus)) {
    errors.push({
      id,
      field: "reviewStatus",
      message: `Invalid review status: '${entry.reviewStatus}'. Must be one of: ${VALID_STATUSES.join(", ")}.`,
      value: entry.reviewStatus,
    });
  }

  // 11. Source Attribution
  if (!entry.source || !entry.source.trim()) {
    errors.push({ id, field: "source", message: "Source attribution is required for educational validity." });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validates a single Vocabulary entry.
 */
export function validateVocabularyEntry(entry: VocabularyEntry): {
  isValid: boolean;
  errors: ValidationErrorItem[];
  warnings: ValidationWarningItem[];
} {
  const errors: ValidationErrorItem[] = [];
  const warnings: ValidationWarningItem[] = [];
  const id = entry.id || "UNKNOWN_VOCAB_ID";

  // 1. ID Validation
  if (!entry.id || typeof entry.id !== "string" || !entry.id.trim()) {
    errors.push({ id, field: "id", message: "Vocabulary ID is required." });
  }

  // 2. Word Validation
  if (!entry.word || !entry.word.trim()) {
    errors.push({ id, field: "word", message: "Japanese word is required." });
  } else if (!REGEX_HAS_JAPANESE.test(entry.word)) {
    errors.push({
      id,
      field: "word",
      message: `Japanese word '${entry.word}' must contain valid Japanese characters.`,
      value: entry.word,
    });
  }

  // 3. Reading Validation
  if (!entry.readingHiragana || !entry.readingHiragana.trim()) {
    errors.push({ id, field: "readingHiragana", message: "Hiragana reading is required." });
  } else {
    const cleanReading = entry.readingHiragana.replace(/[\s・]/g, "");
    if (!REGEX_HIRAGANA_ONLY.test(cleanReading)) {
      errors.push({
        id,
        field: "readingHiragana",
        message: `Reading '${entry.readingHiragana}' must be in Hiragana.`,
        value: entry.readingHiragana,
      });
    }
  }

  // 4. Romaji Validation
  if (!entry.romaji || !entry.romaji.trim()) {
    errors.push({ id, field: "romaji", message: "Romaji transliteration is required." });
  }

  // 5. English Meaning Validation
  if (!entry.meaningEn || !entry.meaningEn.trim()) {
    errors.push({ id, field: "meaningEn", message: "English meaning is required." });
  } else if (containsPlaceholder(entry.meaningEn)) {
    errors.push({
      id,
      field: "meaningEn",
      message: `English meaning contains prohibited placeholder text: '${entry.meaningEn}'.`,
      value: entry.meaningEn,
    });
  }

  // Tamil Meaning QA
  if (!entry.meaningTa || !entry.meaningTa.trim()) {
    if (entry.reviewStatus === "published") {
      warnings.push({
        id,
        field: "meaningTa",
        message: "Tamil meaning absent for published entry. Mark status as 'needs_tamil_review'.",
      });
    }
  }

  // 6. JLPT Level Validation
  if (!VALID_LEVELS.includes(entry.jlptLevel)) {
    errors.push({
      id,
      field: "jlptLevel",
      message: `Invalid JLPT level: '${entry.jlptLevel}'. Must be one of: ${VALID_LEVELS.join(", ")}.`,
      value: entry.jlptLevel,
    });
  }

  // 7. Part of Speech Validation
  if (!entry.partOfSpeech) {
    errors.push({ id, field: "partOfSpeech", message: "Part of speech classification is required." });
  }

  // 8. Related Kanji Cross-check
  if (REGEX_HAS_KANJI.test(entry.word)) {
    if (!Array.isArray(entry.relatedKanji) || entry.relatedKanji.length === 0) {
      warnings.push({
        id,
        field: "relatedKanji",
        message: `Word '${entry.word}' contains Kanji but has no relatedKanji listed.`,
      });
    }
  }

  // 9. Examples Validation
  if (!Array.isArray(entry.examples) || entry.examples.length === 0) {
    warnings.push({
      id,
      field: "examples",
      message: "At least one natural example sentence is recommended for effective learning.",
    });
  } else {
    entry.examples.forEach((ex, idx) => {
      if (!ex.ja || !REGEX_HAS_JAPANESE.test(ex.ja)) {
        errors.push({
          id,
          field: `examples[${idx}].ja`,
          message: "Example Japanese text must contain valid Japanese characters.",
          value: ex.ja,
        });
      }
      if (!ex.en || !ex.en.trim()) {
        errors.push({
          id,
          field: `examples[${idx}].en`,
          message: "Example English translation is required.",
        });
      }
    });
  }

  // 10. Review Status Validation
  if (!VALID_STATUSES.includes(entry.reviewStatus)) {
    errors.push({
      id,
      field: "reviewStatus",
      message: `Invalid review status: '${entry.reviewStatus}'. Must be one of: ${VALID_STATUSES.join(", ")}.`,
      value: entry.reviewStatus,
    });
  }

  // 11. Source Attribution
  if (!entry.source || !entry.source.trim()) {
    errors.push({ id, field: "source", message: "Source attribution is required for educational validity." });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validates a batch of Kanji entries, enforcing uniqueness of IDs and characters.
 */
export function validateKanjiBatch(entries: KanjiEntry[]): ValidationSummary {
  const allErrors: ValidationErrorItem[] = [];
  const allWarnings: ValidationWarningItem[] = [];
  const seenIds = new Set<string>();
  const seenCharacters = new Map<string, string>(); // character -> id
  let duplicatesFound = 0;
  let validCount = 0;

  for (const entry of entries) {
    const { isValid, errors, warnings } = validateKanjiEntry(entry);
    allErrors.push(...errors);
    allWarnings.push(...warnings);

    // Duplicate ID Check
    if (entry.id) {
      if (seenIds.has(entry.id)) {
        duplicatesFound++;
        allErrors.push({
          id: entry.id,
          field: "id",
          message: `Duplicate Kanji ID found: '${entry.id}'.`,
          value: entry.id,
        });
      } else {
        seenIds.add(entry.id);
      }
    }

    // Duplicate Character Check
    if (entry.character) {
      if (seenCharacters.has(entry.character)) {
        duplicatesFound++;
        allErrors.push({
          id: entry.id,
          field: "character",
          message: `Duplicate Kanji character found: '${entry.character}' (previously seen in ${seenCharacters.get(
            entry.character
          )}).`,
          value: entry.character,
        });
      } else {
        seenCharacters.set(entry.character, entry.id);
      }
    }

    if (isValid && !errors.length) {
      validCount++;
    }
  }

  return {
    totalProcessed: entries.length,
    validCount,
    errorCount: allErrors.length,
    warningCount: allWarnings.length,
    duplicatesFound,
    errors: allErrors,
    warnings: allWarnings,
  };
}

/**
 * Validates a batch of Vocabulary entries, enforcing uniqueness of IDs and words/readings.
 */
export function validateVocabularyBatch(entries: VocabularyEntry[]): ValidationSummary {
  const allErrors: ValidationErrorItem[] = [];
  const allWarnings: ValidationWarningItem[] = [];
  const seenIds = new Set<string>();
  const seenWords = new Map<string, string>(); // word:reading -> id
  let duplicatesFound = 0;
  let validCount = 0;

  for (const entry of entries) {
    const { isValid, errors, warnings } = validateVocabularyEntry(entry);
    allErrors.push(...errors);
    allWarnings.push(...warnings);

    // Duplicate ID Check
    if (entry.id) {
      if (seenIds.has(entry.id)) {
        duplicatesFound++;
        allErrors.push({
          id: entry.id,
          field: "id",
          message: `Duplicate Vocabulary ID found: '${entry.id}'.`,
          value: entry.id,
        });
      } else {
        seenIds.add(entry.id);
      }
    }

    // Duplicate Word+Reading Check
    if (entry.word && entry.readingHiragana) {
      const key = `${entry.word}:${entry.readingHiragana}`;
      if (seenWords.has(key)) {
        duplicatesFound++;
        allErrors.push({
          id: entry.id,
          field: "word",
          message: `Duplicate vocabulary entry found for '${entry.word}' (${entry.readingHiragana}) previously seen in ${seenWords.get(
            key
          )}.`,
          value: key,
        });
      } else {
        seenWords.set(key, entry.id);
      }
    }

    if (isValid && !errors.length) {
      validCount++;
    }
  }

  return {
    totalProcessed: entries.length,
    validCount,
    errorCount: allErrors.length,
    warningCount: allWarnings.length,
    duplicatesFound,
    errors: allErrors,
    warnings: allWarnings,
  };
}

