import { KanjiEntry } from "../../types/content";

/**
 * JLPT N1 Kanji Modular Dataset
 * Attribution: Secondary School Jōyō Kanji / EDRDG KANJIDIC2
 */
export const N1_KANJI: KanjiEntry[] = [
  {
    id: "kj_n1_001",
    character: "顕",
    jlptLevel: "N1",
    levelMetadata: {
      level: "N1",
      isEstimated: true,
      sourceReference: "Secondary Jōyō Kanji / EDRDG KANJIDIC2",
      officialDisclaimer: "JLPT does not publish official fixed kanji lists.",
    },
    meaningEn: "appear; manifest; clear",
    meaningTa: "வெளிப்படுதல் / தெளிவான",
    onyomi: ["ケン"],
    kunyomi: ["あらわれる"],
    romajiOn: ["ken"],
    romajiKun: ["arawareru"],
    strokeCount: 18,
    radical: { character: "頁", nameJa: "おおがい", nameEn: "leaf, page", strokes: 9, number: 181 },
    compounds: [
      { word: "顕著", reading: "けんちょ", romaji: "kencho", meaningEn: "remarkable; striking", meaningTa: "குறிப்பிடத்தக்க", jlptLevel: "N1" },
      { word: "顕微鏡", reading: "けんびきょう", romaji: "kenbikyou", meaningEn: "microscope", meaningTa: "நுண்ணோக்கி", jlptLevel: "N2" }
    ],
    examples: [
      { id: "ex_kj_n1_001_1", ja: "景気の回復が顕著に見られます。", kana: "けいきのかいふくがけんちょにみられます。", en: "Economic recovery is remarkably visible.", ta: "பொருளாதார மீட்பு குறிப்பிடத்தக்க அளவில் காணப்படுகிறது." }
    ],
    difficulty: 5,
    source: "KANJIDIC2 / Secondary Jōyō",
    reviewStatus: "validated",
    createdDate: "2026-11-04T00:00:00Z"
  }
];

