// ==============================================================================
// NIHONGOSETU — JLPT CONTENT DATABASE TYPE DEFINITIONS
// ==============================================================================
// Strict schema definitions for JLPT Kanji, Vocabulary, Example Sentences,
// Content Sources, and Staged Quality Assurance Review Status.
//
// NOTE ON JLPT CLASSIFICATIONS:
// The Japan Foundation (JF) and Japan Educational Exchanges and Services (JEES)
// do not publish official fixed Kanji or vocabulary lists for post-2010 JLPT exams.
// All level classifications are curricular reference estimates based on
// standard references (e.g., KANJIDIC2, JMdict, MEXT Kyōiku Kanji).
// ==============================================================================

/**
 * Standard JLPT levels from elementary (N5) to advanced (N1).
 */
export type JLPTLevel = "N5" | "N4" | "N3" | "N2" | "N1";

/**
 * Staged review workflow for content quality assurance.
 * Unreviewed or partially validated content is never published as verified.
 */
export type ContentReviewStatus =
  | "imported"              // Ingested from source dataset; pending validation
  | "validated"             // Automated validation passed (schema, unicode, duplicates)
  | "needs_tamil_review"    // Japanese & English verified; Tamil gloss requires native review
  | "reviewed"              // Curriculum specialist verified accuracy
  | "published";            // Approved for student study in the active portal

/**
 * Japanese Parts of Speech classifications for vocabulary.
 */
export type PartOfSpeech =
  | "noun"
  | "verb_ichidan"          // 一段動詞 (Group 2, e.g. 食べる)
  | "verb_godan"            // 五段動詞 (Group 1, e.g. 行く, 話す)
  | "verb_irregular"        // 不規則動詞 (Group 3, e.g. する, 来る)
  | "i_adjective"           // い形容詞 (e.g. 高い)
  | "na_adjective"          // な形容詞 (e.g. 静か)
  | "adverb"                // 副詞 (e.g. ゆっくり)
  | "particle"              // 助詞 (e.g. は, が, を, に)
  | "conjunction"           // 接続詞 (e.g. そして, しかし)
  | "pronoun"               // 代名詞 (e.g. これ, 私)
  | "counter"               // 助数詞 (e.g. 本, 冊, 人)
  | "prefix"                // 接頭辞 (e.g. お-, ご-)
  | "suffix"                // 接尾辞 (e.g. -さん, -たち)
  | "expression"            // 慣用語・挨拶 (e.g. おはようございます)
  | "interjection";         // 感動詞 (e.g. ええと)

/**
 * Radical information for a Kanji character.
 */
export interface KanjiRadical {
  character: string;        // e.g. "日" or "氵"
  nameJa: string;           // Japanese radical name, e.g. "ひ / ひへん"
  nameEn: string;           // English descriptive radical name, e.g. "sun / day"
  strokes: number;          // Radical stroke count
  number?: number;          // Traditional Kangxi radical number (1–214)
}

/**
 * Compound word formed using a Kanji character.
 */
export interface KanjiCompound {
  word: string;             // Japanese word, e.g. "日本"
  reading: string;          // Kana reading, e.g. "にほん"
  romaji: string;           // Romaji transliteration, e.g. "nihon"
  meaningEn: string;        // English definition, e.g. "Japan"
  meaningTa?: string;       // Tamil definition, e.g. "ஜப்பான்"
  jlptLevel?: JLPTLevel;    // Estimated level of the compound word
}

/**
 * Example sentence with readings and multi-language translations.
 */
export interface ExampleSentence {
  id: string;               // Unique sentence ID, e.g. "ex_n5_001"
  ja: string;               // Natural Japanese sentence, e.g. "今日はいい天気です。"
  kana: string;             // Full Hiragana reading, e.g. "きょうはいいてんきです。"
  romaji?: string;          // Romaji transliteration, e.g. "Kyou wa ii tenki desu."
  en: string;               // Accurate English translation
  ta?: string;              // Accurate Tamil translation (where available)
  notes?: string;           // Grammar or cultural context note
  source?: string;          // Sentence attribution
}

/**
 * Source attribution and licensing metadata.
 */
export interface ContentSource {
  id: string;               // Unique source ID, e.g. "src_kanjidic2"
  name: string;             // Official name, e.g. "KANJIDIC2"
  organization: string;     // Publishing entity, e.g. "Electronic Dictionary Research & Development Group"
  url: string;              // Canonical URL
  license: string;          // e.g. "Creative Commons Attribution-ShareAlike 4.0"
  isOfficialJLPT: boolean;  // Always false for post-2010 reference lists
  methodology: string;      // How classifications were determined
}

/**
 * Metadata clarifying JLPT level classification status.
 */
export interface JLPTLevelMetadata {
  level: JLPTLevel;
  isEstimated: boolean;     // True for all post-2010 reference lists
  sourceReference: string;  // e.g. "EDRDG / MEXT Grade 1 Kyōiku Kanji"
  officialDisclaimer: string;
}

/**
 * Master Kanji Entry Schema.
 */
export interface KanjiEntry {
  id: string;                                   // Unique ID, e.g. "kj_n5_001"
  character: string;                            // Single Unicode Kanji, e.g. "日"
  jlptLevel: JLPTLevel;                         // JLPT level (N5..N1)
  levelMetadata: JLPTLevelMetadata;             // Reference attribution & disclaimer
  meaningEn: string;                            // Primary English meaning, e.g. "day; sun"
  meaningTa?: string;                           // Verified Tamil meaning, e.g. "நாள் / சூரியன்"
  meaningsMultilingual?: Record<string, string>;// Extended multilingual definitions (ta, hi, etc.)
  onyomi: string[];                             // Katakana readings, e.g. ["ニチ", "ジツ"]
  kunyomi: string[];                            // Hiragana readings, e.g. ["ひ", "-び", "-か"]
  romajiOn: string[];                           // Romaji On'yomi, e.g. ["nichi", "jitsu"]
  romajiKun: string[];                          // Romaji Kun'yomi, e.g. ["hi", "-bi", "-ka"]
  strokeCount: number;                          // Verified stroke count, e.g. 4
  radical: KanjiRadical;                        // Associated radical
  grade?: number;                               // Kyōiku grade: 1–6 (elementary), 8 (secondary)
  frequencyRank?: number;                       // Newspaper frequency rank (1 = most common)
  compounds: KanjiCompound[];                   // 2+ common compound words
  examples: ExampleSentence[];                  // Natural example sentences
  mnemonic?: string;                            // Memory aid / etymological visual hint
  difficulty: 1 | 2 | 3 | 4 | 5;                // Relative difficulty within the level
  source: string;                               // Attribution (e.g. "KANJIDIC2")
  reviewStatus: ContentReviewStatus;            // Quality assurance state
  createdDate: string;                          // ISO 8601 date string
  lastReviewedDate?: string;                    // ISO 8601 date string
}

/**
 * Master Vocabulary Entry Schema.
 */
export interface VocabularyEntry {
  id: string;                                   // Unique ID, e.g. "vb_n5_001"
  word: string;                                 // Japanese word in standard writing, e.g. "食べる"
  kanjiForm?: string;                           // Kanji form (null for pure kana words)
  readingHiragana: string;                      // Full Hiragana reading, e.g. "たべる"
  readingKatakana?: string;                     // For loanwords/gairaigo, e.g. "パン"
  romaji: string;                               // Standard Hepburn Romaji, e.g. "taberu"
  meaningEn: string;                            // Primary English definition
  meaningTa?: string;                           // Verified Tamil definition
  meaningsMultilingual?: Record<string, string>;// Extended 12-language definitions
  jlptLevel: JLPTLevel;                         // Target JLPT level
  levelMetadata: JLPTLevelMetadata;             // Reference attribution
  partOfSpeech: PartOfSpeech;                   // Grammatical part of speech
  category?: string;                            // Semantic category (e.g. "Food", "Basics")
  commonUsage?: string;                         // Contextual nuance or usage note
  examples: ExampleSentence[];                  // Natural example sentences
  relatedKanji: string[];                       // Individual Kanji characters used, e.g. ["食"]
  synonyms?: string[];                          // Synonymous Japanese words
  antonyms?: string[];                          // Antonymous Japanese words
  collocations?: string[];                      // Common phrase patterns, e.g. ["朝ご飯を食べる"]
  audioPrompt?: string;                         // Text sent to ja-JP speech synthesizer
  source: string;                               // Attribution (e.g. "JMdict")
  reviewStatus: ContentReviewStatus;            // Quality assurance state
  createdDate: string;                          // ISO 8601 date string
  lastReviewedDate?: string;                    // ISO 8601 date string
}

/**
 * Bidirectional relation mapping Kanji characters to Vocabulary words.
 */
export interface KanjiVocabularyRelation {
  kanjiId: string;
  kanjiCharacter: string;
  vocabularyId: string;
  vocabularyWord: string;
  reading: string;
  meaningEn: string;
}

/**
 * Content import batch payload.
 */
export interface ContentImportBatch<T> {
  batchId: string;
  source: ContentSource;
  importedAt: string;
  targetLevel: JLPTLevel;
  items: T[];
}

/**
 * Summary report returned after a batch import or validation run.
 */
export interface ValidationSummary {
  totalProcessed: number;
  validCount: number;
  errorCount: number;
  warningCount: number;
  duplicatesFound: number;
  errors: ValidationErrorItem[];
  warnings: ValidationWarningItem[];
}

export interface ValidationErrorItem {
  id: string;
  field: string;
  message: string;
  value?: unknown;
}

export interface ValidationWarningItem {
  id: string;
  field: string;
  message: string;
  value?: unknown;
}

