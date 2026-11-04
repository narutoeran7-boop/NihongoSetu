import { VocabularyEntry } from "../../types/content";

/**
 * JLPT N1 Vocabulary Modular Dataset Container
 */
export const N1_VOCABULARY: VocabularyEntry[] = [
  {
    id: "vb_n1_001",
    word: "遵守",
    kanjiForm: "遵守",
    readingHiragana: "じゅんしゅ",
    romaji: "junshu",
    meaningEn: "compliance; adherence; observance",
    meaningTa: "பின்பற்றுதல் / கீழ்ப்படிதல்",
    meaningsMultilingual: {
      en: "compliance; adherence; observance",
      ta: "பின்பற்றுதல் / கீழ்ப்படிதல்",
    },
    jlptLevel: "N1",
    levelMetadata: {
      level: "N1",
      isEstimated: true,
      sourceReference: "JMdict (EDRDG)",
      officialDisclaimer: "JLPT does not publish official vocabulary lists.",
    },
    partOfSpeech: "noun",
    category: "Formal",
    examples: [
      {
        id: "ex_vb_n1_001_1",
        ja: "法律を遵守しなければなりません。",
        kana: "ほうりつをじゅんしゅしなければなりません。",
        en: "We must comply with the law.",
        ta: "நாங்கள் சட்டத்தை மதிக்க வேண்டும்.",
      },
    ],
    relatedKanji: ["遵", "守"],
    source: "JMdict",
    reviewStatus: "validated",
    createdDate: "2026-11-04T00:00:00Z",
  },
];

