import { VocabularyEntry } from "../../types/content";

/**
 * JLPT N4 Vocabulary Modular Dataset Container
 */
export const N4_VOCABULARY: VocabularyEntry[] = [
  {
    id: "vb_n4_001",
    word: "案内する",
    kanjiForm: "案内する",
    readingHiragana: "あんないする",
    romaji: "annai suru",
    meaningEn: "to guide; to show around",
    meaningTa: "வழிகாட்டு",
    meaningsMultilingual: {
      en: "to guide; to show around",
      ta: "வழிகாட்டு",
    },
    jlptLevel: "N4",
    levelMetadata: {
      level: "N4",
      isEstimated: true,
      sourceReference: "JMdict (EDRDG)",
      officialDisclaimer: "JLPT does not publish official vocabulary lists.",
    },
    partOfSpeech: "verb_irregular",
    category: "Verbs",
    examples: [
      {
        id: "ex_vb_n4_001_1",
        ja: "町を案内します。",
        kana: "まちをあんないします。",
        en: "I will show you around the town.",
        ta: "நகரத்தை சுற்றிக் காட்டுகிறேன்.",
      },
    ],
    relatedKanji: ["案", "内"],
    source: "JMdict",
    reviewStatus: "validated",
    createdDate: "2026-11-04T00:00:00Z",
  },
];

