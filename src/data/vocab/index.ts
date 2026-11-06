// ==============================================================================
// NIHONGOSETU — MODULAR VOCABULARY DATA LAYER
// ==============================================================================
import { VocabularyEntry, JLPTLevel } from "../../types/content";
import { N5_VOCABULARY } from "./n5";
import { N4_VOCABULARY } from "./n4";
import { N3_VOCABULARY } from "./n3";
import { N2_VOCABULARY } from "./n2";
import { N1_VOCABULARY } from "./n1";

export { N5_VOCABULARY, N4_VOCABULARY, N3_VOCABULARY, N2_VOCABULARY, N1_VOCABULARY };

/**
 * Legacy MultilingualVocabWord interface for backward compatibility with existing portal pages.
 */
export interface MultilingualVocabWord {
  kanji: string;
  reading: string;
  romaji: string;
  category: string;
  exampleJa: string;
  exampleEn: string;
  meaning: Record<string, string>;
}

const ALL_MODULAR_VOCAB: VocabularyEntry[] = [
  ...N5_VOCABULARY,
  ...N4_VOCABULARY,
  ...N3_VOCABULARY,
  ...N2_VOCABULARY,
  ...N1_VOCABULARY,
];

const VOCAB_BY_WORD = new Map<string, VocabularyEntry>(
  ALL_MODULAR_VOCAB.map((v) => [v.word, v])
);

const VOCAB_BY_LEVEL: Record<JLPTLevel, VocabularyEntry[]> = {
  N5: N5_VOCABULARY,
  N4: N4_VOCABULARY,
  N3: N3_VOCABULARY,
  N2: N2_VOCABULARY,
  N1: N1_VOCABULARY,
};

/**
 * Converts a rich schema VocabularyEntry to legacy MultilingualVocabWord.
 */
export function vocabularyEntryToMultilingualWord(entry: VocabularyEntry): MultilingualVocabWord {
  const primaryExample = entry.examples[0] || { ja: "", en: "" };
  const meaningMap: Record<string, string> = {
    en: entry.meaningEn,
    ta: entry.meaningTa || "",
    ...(entry.meaningsMultilingual || {}),
  };

  return {
    kanji: entry.word,
    reading: entry.readingHiragana,
    romaji: entry.romaji,
    category: entry.category || "Basics",
    exampleJa: primaryExample.ja,
    exampleEn: primaryExample.en,
    meaning: meaningMap,
  };
}

export const VOCAB_TARGET_COUNTS = {
  N5: 800,
  N4: 1500,
  N3: 3750,
  N2: 6000,
  N1: 10000,
};

export const CORE_VOCABULARY: MultilingualVocabWord[] = N5_VOCABULARY.map(vocabularyEntryToMultilingualWord);

/**
 * Retrieves all Vocabulary entries across all JLPT levels.
 */
export function getAllModularVocab(): VocabularyEntry[] {
  return ALL_MODULAR_VOCAB;
}

/**
 * Retrieves Vocabulary entries for a specific JLPT level.
 */
export function getModularVocabForLevel(level: JLPTLevel): VocabularyEntry[] {
  return VOCAB_BY_LEVEL[level] || [];
}

/**
 * Retrieves a single vocabulary entry by word.
 */
export function getModularVocabByWord(word: string): VocabularyEntry | undefined {
  return VOCAB_BY_WORD.get(word);
}

/**
 * Filters Vocabulary by search term across word, reading, English meaning, and Tamil meaning.
 */
export function searchModularVocab(
  query: string,
  level?: JLPTLevel,
  category?: string
): VocabularyEntry[] {
  const cleanQ = query.trim().toLowerCase();
  const pool = level ? getModularVocabForLevel(level) : getAllModularVocab();

  return pool.filter((v) => {
    const matchesCat = !category || category === "All" || v.category === category;
    if (!matchesCat) return false;
    if (!cleanQ) return true;

    return (
      v.word.includes(cleanQ) ||
      v.readingHiragana.includes(cleanQ) ||
      v.romaji.toLowerCase().includes(cleanQ) ||
      v.meaningEn.toLowerCase().includes(cleanQ) ||
      (v.meaningTa && v.meaningTa.includes(cleanQ))
    );
  });
}

