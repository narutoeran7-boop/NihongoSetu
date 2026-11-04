import { KanjiEntry } from "../../types/content";

/**
 * JLPT N3 Kanji Modular Dataset
 * Attribution: MEXT Elementary Kyōiku Grade 3–4 / EDRDG KANJIDIC2
 */
export const N3_KANJI: KanjiEntry[] = [
  {
    id: "kj_n3_001",
    character: "政",
    jlptLevel: "N3",
    levelMetadata: {
      level: "N3",
      isEstimated: true,
      sourceReference: "MEXT Kyōiku Kanji Grade 5 / EDRDG KANJIDIC2",
      officialDisclaimer: "JLPT does not publish official fixed kanji lists.",
    },
    meaningEn: "politics; government",
    meaningTa: "அரசியல் / அரசு",
    onyomi: ["セイ", "ショウ"],
    kunyomi: ["まつりごと"],
    romajiOn: ["sei", "shou"],
    romajiKun: ["matsurigoto"],
    strokeCount: 9,
    radical: { character: "攴", nameJa: "ぼくづくり", nameEn: "rap", strokes: 4, number: 66 },
    compounds: [
      { word: "政治", reading: "せいじ", romaji: "seiji", meaningEn: "politics", meaningTa: "அரசியல்", jlptLevel: "N3" },
      { word: "政府", reading: "せいふ", romaji: "seifu", meaningEn: "government", meaningTa: "அரசாங்கம்", jlptLevel: "N3" }
    ],
    examples: [
      { id: "ex_kj_n3_001_1", ja: "政治のニュースを見ました。", kana: "せいじのニュースをみました。", en: "I watched the political news.", ta: "நான் அரசியல் செய்திகளைப் பார்த்தேன்." }
    ],
    difficulty: 3,
    source: "KANJIDIC2 / MEXT Grade 5",
    reviewStatus: "validated",
    createdDate: "2026-11-04T00:00:00Z"
  },
  {
    id: "kj_n3_002",
    character: "議",
    jlptLevel: "N3",
    levelMetadata: {
      level: "N3",
      isEstimated: true,
      sourceReference: "MEXT Kyōiku Kanji Grade 4 / EDRDG KANJIDIC2",
      officialDisclaimer: "JLPT does not publish official fixed kanji lists.",
    },
    meaningEn: "deliberation; consultation; debate",
    meaningTa: "விவாதம் / கலந்தாலோசனை",
    onyomi: ["ギ"],
    kunyomi: [],
    romajiOn: ["gi"],
    romajiKun: [],
    strokeCount: 20,
    radical: { character: "言", nameJa: "ごんべん", nameEn: "speech", strokes: 7, number: 149 },
    compounds: [
      { word: "会議", reading: "かいぎ", romaji: "kaigi", meaningEn: "meeting; conference", meaningTa: "கூட்டம்", jlptLevel: "N4" },
      { word: "議員", reading: "ぎいん", romaji: "giin", meaningEn: "assembly member", meaningTa: "மன்ற உறுப்பினர்", jlptLevel: "N3" }
    ],
    examples: [
      { id: "ex_kj_n3_002_1", ja: "午後から会議に出席します。", kana: "ごごからかいぎにしゅっせきします。", en: "I will attend a meeting this afternoon.", ta: "மதியத்திற்கு மேல் நான் கூட்டத்தில் கலந்துகொள்வேன்." }
    ],
    difficulty: 3,
    source: "KANJIDIC2 / MEXT Grade 4",
    reviewStatus: "validated",
    createdDate: "2026-11-04T00:00:00Z"
  },
  {
    id: "kj_n3_003",
    character: "民",
    jlptLevel: "N3",
    levelMetadata: {
      level: "N3",
      isEstimated: true,
      sourceReference: "MEXT Kyōiku Kanji Grade 4 / EDRDG KANJIDIC2",
      officialDisclaimer: "JLPT does not publish official fixed kanji lists.",
    },
    meaningEn: "people; nation; subjects",
    meaningTa: "மக்கள் / குடிமக்கள்",
    onyomi: ["ミン"],
    kunyomi: ["たみ"],
    romajiOn: ["min"],
    romajiKun: ["tami"],
    strokeCount: 5,
    radical: { character: "氏", nameJa: "うじ", nameEn: "clan", strokes: 4, number: 83 },
    compounds: [
      { word: "国民", reading: "こくみん", romaji: "kokumin", meaningEn: "citizens; people of a nation", meaningTa: "குடிமக்கள்", jlptLevel: "N3" },
      { word: "市民", reading: "しみん", romaji: "shimin", meaningEn: "city resident", meaningTa: "நகர மக்கள்", jlptLevel: "N4" }
    ],
    examples: [
      { id: "ex_kj_n3_003_1", ja: "市民のために働きます。", kana: "しみんのためにはたらきます。", en: "I work for the citizens.", ta: "நான் மக்களுக்காக உழைக்கிறேன்." }
    ],
    difficulty: 3,
    source: "KANJIDIC2 / MEXT Grade 4",
    reviewStatus: "validated",
    createdDate: "2026-11-04T00:00:00Z"
  },
  {
    id: "kj_n3_004",
    character: "連",
    jlptLevel: "N3",
    levelMetadata: {
      level: "N3",
      isEstimated: true,
      sourceReference: "MEXT Kyōiku Kanji Grade 4 / EDRDG KANJIDIC2",
      officialDisclaimer: "JLPT does not publish official fixed kanji lists.",
    },
    meaningEn: "take along; connect; join",
    meaningTa: "இணை / தொடர்",
    onyomi: ["レン"],
    kunyomi: ["つれる", "つらなる"],
    romajiOn: ["ren"],
    romajiKun: ["tsureru", "tsuranaru"],
    strokeCount: 10,
    radical: { character: "辵", nameJa: "しんにょう", nameEn: "road", strokes: 3, number: 162 },
    compounds: [
      { word: "連絡", reading: "れんらく", romaji: "renraku", meaningEn: "contact; communication", meaningTa: "தொடர்பு", jlptLevel: "N4" },
      { word: "連休", reading: "れんきゅう", romaji: "renkyuu", meaningEn: "consecutive holidays", meaningTa: "தொடர் விடுமுறை", jlptLevel: "N3" }
    ],
    examples: [
      { id: "ex_kj_n3_004_1", ja: "明日連絡してください。", kana: "あしたれんらくしてください。", en: "Please contact me tomorrow.", ta: "தயவுசெய்து நாளை தொடர்பு கொள்ளுங்கள்." }
    ],
    difficulty: 3,
    source: "KANJIDIC2 / MEXT Grade 4",
    reviewStatus: "validated",
    createdDate: "2026-11-04T00:00:00Z"
  },
  {
    id: "kj_n3_005",
    character: "対",
    jlptLevel: "N3",
    levelMetadata: {
      level: "N3",
      isEstimated: true,
      sourceReference: "MEXT Kyōiku Kanji Grade 3 / EDRDG KANJIDIC2",
      officialDisclaimer: "JLPT does not publish official fixed kanji lists.",
    },
    meaningEn: "vis-a-vis; opposite; against",
    meaningTa: "எதிராக / நேர்மாறான",
    onyomi: ["タイ", "ツイ"],
    kunyomi: [],
    romajiOn: ["tai", "tsui"],
    romajiKun: [],
    strokeCount: 7,
    radical: { character: "寸", nameJa: "すん", nameEn: "inch", strokes: 3, number: 41 },
    compounds: [
      { word: "反対", reading: "はんたい", romaji: "hantai", meaningEn: "opposition; reverse", meaningTa: "எதிர்ப்பு", jlptLevel: "N4" },
      { word: "対象", reading: "たいしょう", romaji: "taishou", meaningEn: "target; subject", meaningTa: "இலக்கு", jlptLevel: "N3" }
    ],
    examples: [
      { id: "ex_kj_n3_005_1", ja: "その意見に反対です。", kana: "そのいけんにはんたいです。", en: "I am against that opinion.", ta: "அந்தக் கருத்தை நான் எதிர்க்கிறேன்." }
    ],
    difficulty: 3,
    source: "KANJIDIC2 / MEXT Grade 3",
    reviewStatus: "validated",
    createdDate: "2026-11-04T00:00:00Z"
  }
];

