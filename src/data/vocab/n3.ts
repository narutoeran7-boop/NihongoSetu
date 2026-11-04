import { VocabularyEntry } from "../../types/content";

/**
 * JLPT N3 Vocabulary Modular Dataset Container
 */
export const N3_VOCABULARY: VocabularyEntry[] = [
  {
    id: "vb_n3_001",
    word: "解決",
    kanjiForm: "解決",
    readingHiragana: "かいけつ",
    romaji: "kaiketsu",
    meaningEn: "settlement; solution; resolution",
    meaningTa: "தீர்வு",
    meaningsMultilingual: {
      en: "settlement; solution; resolution",
      ta: "தீர்வு",
    },
    jlptLevel: "N3",
    levelMetadata: {
      level: "N3",
      isEstimated: true,
      sourceReference: "JMdict (EDRDG)",
      officialDisclaimer: "JLPT does not publish official vocabulary lists.",
    },
    partOfSpeech: "noun",
    category: "Society",
    examples: [
      {
        id: "ex_vb_n3_001_1",
        ja: "問題が解決しました。",
        kana: "もんだいがおいけつしました。",
        en: "The problem has been resolved.",
        ta: "பிரச்சனை தீர்க்கப்பட்டது.",
      },
    ],
    relatedKanji: ["解", "決"],
    source: "JMdict",
    reviewStatus: "validated",
    createdDate: "2026-11-04T00:00:00Z",
  },
];

