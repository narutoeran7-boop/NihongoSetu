import { VocabularyEntry } from "../../types/content";

/**
 * JLPT N2 Vocabulary Modular Dataset Container
 */
export const N2_VOCABULARY: VocabularyEntry[] = [
  {
    id: "vb_n2_001",
    word: "維持",
    kanjiForm: "維持",
    readingHiragana: "いじ",
    romaji: "iji",
    meaningEn: "maintenance; preservation; improvement",
    meaningTa: "பராமரிப்பு",
    meaningsMultilingual: {
      en: "maintenance; preservation",
      ta: "பராமரிப்பு",
    },
    jlptLevel: "N2",
    levelMetadata: {
      level: "N2",
      isEstimated: true,
      sourceReference: "JMdict (EDRDG)",
      officialDisclaimer: "JLPT does not publish official vocabulary lists.",
    },
    partOfSpeech: "noun",
    category: "Business",
    examples: [
      {
        id: "ex_vb_n2_001_1",
        ja: "健康を維持します。",
        kana: "けんこうをいじします。",
        en: "I maintain my health.",
        ta: "ஆரோக்கியத்தைப் பராமரிக்கிறேன்.",
      },
    ],
    relatedKanji: ["維", "持"],
    source: "JMdict",
    reviewStatus: "validated",
    createdDate: "2026-11-04T00:00:00Z",
  },
];

