// ==============================================================================
// NIHONGOSETU — MODULAR KANJI DATA LAYER
// ==============================================================================
import { KanjiEntry, JLPTLevel } from "../../types/content";
import { N5_KANJI } from "./n5";
import { N4_KANJI } from "./n4";
import { N3_KANJI } from "./n3";
import { N2_KANJI } from "./n2";
import { N1_KANJI } from "./n1";

export { N5_KANJI, N4_KANJI, N3_KANJI, N2_KANJI, N1_KANJI };

/**
 * Legacy KanjiCardItem interface for backward compatibility with existing portal pages.
 */
export interface KanjiCardItem {
  character: string;
  kunyomi: string;
  onyomi: string;
  meanings: string;
  examples: string;
  level: string;
}

const ALL_MODULAR_KANJI: KanjiEntry[] = [
  ...N5_KANJI,
  ...N4_KANJI,
  ...N3_KANJI,
  ...N2_KANJI,
  ...N1_KANJI,
];

const KANJI_BY_CHAR = new Map<string, KanjiEntry>(
  ALL_MODULAR_KANJI.map((k) => [k.character, k])
);

const KANJI_BY_LEVEL: Record<JLPTLevel, KanjiEntry[]> = {
  N5: N5_KANJI,
  N4: N4_KANJI,
  N3: N3_KANJI,
  N2: N2_KANJI,
  N1: N1_KANJI,
};

/**
 * Converts a rich schema KanjiEntry to the legacy UI KanjiCardItem.
 */
export function kanjiEntryToCardItem(entry: KanjiEntry): KanjiCardItem {
  const kunyomiStr = entry.kunyomi.length > 0 ? entry.kunyomi.join("・") : "—";
  const onyomiStr = entry.onyomi.length > 0 ? entry.onyomi.join("・") : "—";
  const examplesStr = entry.compounds.length > 0
    ? entry.compounds.map((c) => `${c.word}（${c.reading}）`).join("・")
    : (entry.examples[0]?.ja || "");

  return {
    character: entry.character,
    kunyomi: kunyomiStr,
    onyomi: onyomiStr,
    meanings: entry.meaningEn,
    examples: examplesStr,
    level: entry.jlptLevel,
  };
}

/**
 * Retrieves all Kanji entries across all JLPT levels.
 */
export function getAllModularKanji(): KanjiEntry[] {
  return ALL_MODULAR_KANJI;
}

/**
 * Retrieves rich Kanji entries for a specific JLPT level.
 */
export function getModularKanjiForLevel(level: JLPTLevel): KanjiEntry[] {
  return KANJI_BY_LEVEL[level] || [];
}

/**
 * Retrieves a single Kanji entry by its character.
 */
export function getModularKanjiByChar(char: string): KanjiEntry | undefined {
  return KANJI_BY_CHAR.get(char);
}

/**
 * Filters Kanji by search term across character, readings, English meaning, and compounds.
 */
export function searchModularKanji(query: string, level?: JLPTLevel): KanjiEntry[] {
  const cleanQ = query.trim().toLowerCase();
  if (!cleanQ) {
    return level ? getModularKanjiForLevel(level) : getAllModularKanji();
  }

  const pool = level ? getModularKanjiForLevel(level) : getAllModularKanji();
  return pool.filter((k) => {
    return (
      k.character.includes(cleanQ) ||
      k.meaningEn.toLowerCase().includes(cleanQ) ||
      (k.meaningTa && k.meaningTa.includes(cleanQ)) ||
      k.onyomi.some((on) => on.toLowerCase().includes(cleanQ)) ||
      k.kunyomi.some((kun) => kun.toLowerCase().includes(cleanQ)) ||
      k.romajiOn.some((ron) => ron.toLowerCase().includes(cleanQ)) ||
      k.romajiKun.some((rkun) => rkun.toLowerCase().includes(cleanQ)) ||
      k.compounds.some(
        (c) =>
          c.word.includes(cleanQ) ||
          c.reading.includes(cleanQ) ||
          c.meaningEn.toLowerCase().includes(cleanQ)
      )
    );
  });
}

