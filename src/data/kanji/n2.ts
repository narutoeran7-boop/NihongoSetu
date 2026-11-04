import { KanjiEntry } from "../../types/content";

/**
 * JLPT N2 Kanji Modular Dataset
 * Attribution: MEXT Elementary Kyōiku Grade 5–6 / EDRDG KANJIDIC2
 */
export const N2_KANJI: KanjiEntry[] = [
  {
    id: "kj_n2_001",
    character: "営",
    jlptLevel: "N2",
    levelMetadata: {
      level: "N2",
      isEstimated: true,
      sourceReference: "MEXT Kyōiku Kanji Grade 5 / EDRDG KANJIDIC2",
      officialDisclaimer: "JLPT does not publish official fixed kanji lists.",
    },
    meaningEn: "occupation; manage; build",
    meaningTa: "வணிகம் / நிர்வாகம்",
    onyomi: ["エイ"],
    kunyomi: ["いとなむ"],
    romajiOn: ["ei"],
    romajiKun: ["itonamu"],
    strokeCount: 12,
    radical: { character: "口", nameJa: "くち", nameEn: "mouth", strokes: 3, number: 30 },
    compounds: [
      { word: "営業", reading: "えいぎょう", romaji: "eigyou", meaningEn: "business operations", meaningTa: "வணிக நடவடிக்கைகள்", jlptLevel: "N3" },
      { word: "経営", reading: "けいえい", romaji: "keiei", meaningEn: "management", meaningTa: "மேலாண்மை", jlptLevel: "N2" }
    ],
    examples: [
      { id: "ex_kj_n2_001_1", ja: "父は会社を経営しています。", kana: "ちちはかいしゃをけいえいしています。", en: "My father manages a company.", ta: "என் தந்தை ஒரு நிறுவனத்தை நிர்வகிக்கிறார்." }
    ],
    difficulty: 4,
    source: "KANJIDIC2 / MEXT Grade 5",
    reviewStatus: "validated",
    createdDate: "2026-11-04T00:00:00Z"
  },
  {
    id: "kj_n2_002",
    character: "責",
    jlptLevel: "N2",
    levelMetadata: {
      level: "N2",
      isEstimated: true,
      sourceReference: "MEXT Kyōiku Kanji Grade 5 / EDRDG KANJIDIC2",
      officialDisclaimer: "JLPT does not publish official fixed kanji lists.",
    },
    meaningEn: "blame; condemn; censure; responsibility",
    meaningTa: "பொறுப்பு / குற்றம் சாட்டுதல்",
    onyomi: ["セキ"],
    kunyomi: ["せめる"],
    romajiOn: ["seki"],
    romajiKun: ["semeru"],
    strokeCount: 11,
    radical: { character: "貝", nameJa: "かい", nameEn: "shell", strokes: 7, number: 154 },
    compounds: [
      { word: "責任", reading: "せきにん", romaji: "sekinin", meaningEn: "responsibility", meaningTa: "பொறுப்பு", jlptLevel: "N3" }
    ],
    examples: [
      { id: "ex_kj_n2_002_1", ja: "自分の行動に責任を持ちます。", kana: "じぶんのこうどうにせきにんをもちます。", en: "I take responsibility for my actions.", ta: "என் செயல்களுக்கு நானே பொறுப்பேற்கிறேன்." }
    ],
    difficulty: 4,
    source: "KANJIDIC2 / MEXT Grade 5",
    reviewStatus: "validated",
    createdDate: "2026-11-04T00:00:00Z"
  }
];

