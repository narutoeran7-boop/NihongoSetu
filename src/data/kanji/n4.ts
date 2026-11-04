import { KanjiEntry } from "../../types/content";

/**
 * JLPT N4 Kanji Modular Dataset
 * Attribution: MEXT Elementary Kyōiku Grade 2–3 / EDRDG KANJIDIC2
 */
export const N4_KANJI: KanjiEntry[] = [
  {
    id: "kj_n4_001",
    character: "会",
    jlptLevel: "N4",
    levelMetadata: {
      level: "N4",
      isEstimated: true,
      sourceReference: "MEXT Kyōiku Kanji Grade 2 / EDRDG KANJIDIC2",
      officialDisclaimer: "JLPT does not publish official fixed kanji lists.",
    },
    meaningEn: "meet; association; society",
    meaningTa: "சந்திப்பு / சங்கம்",
    onyomi: ["カイ", "エ"],
    kunyomi: ["あう"],
    romajiOn: ["kai", "e"],
    romajiKun: ["au"],
    strokeCount: 6,
    radical: { character: "人", nameJa: "ひと", nameEn: "person", strokes: 2, number: 9 },
    compounds: [
      { word: "会社", reading: "かいしゃ", romaji: "kaisha", meaningEn: "company", meaningTa: "நிறுவனம்", jlptLevel: "N4" },
      { word: "会う", reading: "あう", romaji: "au", meaningEn: "to meet", meaningTa: "சந்தித்தல்", jlptLevel: "N5" }
    ],
    examples: [
      { id: "ex_kj_n4_001_1", ja: "明日友達と会います。", kana: "あしたともだちとあいます。", en: "I will meet a friend tomorrow.", ta: "நாளை நண்பரைச் சந்திப்பேன்." }
    ],
    difficulty: 2,
    source: "KANJIDIC2 / MEXT Grade 2",
    reviewStatus: "validated",
    createdDate: "2026-11-04T00:00:00Z"
  },
  {
    id: "kj_n4_002",
    character: "同",
    jlptLevel: "N4",
    levelMetadata: {
      level: "N4",
      isEstimated: true,
      sourceReference: "MEXT Kyōiku Kanji Grade 2 / EDRDG KANJIDIC2",
      officialDisclaimer: "JLPT does not publish official fixed kanji lists.",
    },
    meaningEn: "same; agree; equal",
    meaningTa: "அதே / ஒரே",
    onyomi: ["ドウ"],
    kunyomi: ["おなじ"],
    romajiOn: ["dou"],
    romajiKun: ["onaji"],
    strokeCount: 6,
    radical: { character: "口", nameJa: "くち", nameEn: "mouth", strokes: 3, number: 30 },
    compounds: [
      { word: "同じ", reading: "おなじ", romaji: "onaji", meaningEn: "same", meaningTa: "அதே போன்ற", jlptLevel: "N5" },
      { word: "同時", reading: "どうじ", romaji: "douji", meaningEn: "simultaneous", meaningTa: "அதே நேரம்", jlptLevel: "N4" }
    ],
    examples: [
      { id: "ex_kj_n4_002_1", ja: "彼と同じ意見です。", kana: "かれとおなじいけんです。", en: "I have the same opinion as him.", ta: "அவருடன் எனக்கும் அதே கருத்துதான்." }
    ],
    difficulty: 2,
    source: "KANJIDIC2 / MEXT Grade 2",
    reviewStatus: "validated",
    createdDate: "2026-11-04T00:00:00Z"
  },
  {
    id: "kj_n4_003",
    character: "事",
    jlptLevel: "N4",
    levelMetadata: {
      level: "N4",
      isEstimated: true,
      sourceReference: "MEXT Kyōiku Kanji Grade 3 / EDRDG KANJIDIC2",
      officialDisclaimer: "JLPT does not publish official fixed kanji lists.",
    },
    meaningEn: "matter; thing; business",
    meaningTa: "விஷயம் / காரியம்",
    onyomi: ["ジ", "ズ"],
    kunyomi: ["こと", "つかう"],
    romajiOn: ["ji", "zu"],
    romajiKun: ["koto", "tsukau"],
    strokeCount: 8,
    radical: { character: "亅", nameJa: "はねぼう", nameEn: "hook", strokes: 1, number: 6 },
    compounds: [
      { word: "仕事", reading: "しごと", romaji: "shigoto", meaningEn: "work; job", meaningTa: "வேலை", jlptLevel: "N5" },
      { word: "大事", reading: "だいじ", romaji: "daiji", meaningEn: "important", meaningTa: "முக்கியமானது", jlptLevel: "N5" }
    ],
    examples: [
      { id: "ex_kj_n4_003_1", ja: "仕事が終わりました。", kana: "しごとがおわりました。", en: "Work has ended.", ta: "வேலை முடிந்துவிட்டது." }
    ],
    difficulty: 2,
    source: "KANJIDIC2 / MEXT Grade 3",
    reviewStatus: "validated",
    createdDate: "2026-11-04T00:00:00Z"
  },
  {
    id: "kj_n4_004",
    character: "自",
    jlptLevel: "N4",
    levelMetadata: {
      level: "N4",
      isEstimated: true,
      sourceReference: "MEXT Kyōiku Kanji Grade 2 / EDRDG KANJIDIC2",
      officialDisclaimer: "JLPT does not publish official fixed kanji lists.",
    },
    meaningEn: "oneself; self",
    meaningTa: "சுயம் / தானாக",
    onyomi: ["ジ", "シ"],
    kunyomi: ["みずから", "おのずから"],
    romajiOn: ["ji", "shi"],
    romajiKun: ["mizukara", "onozukara"],
    strokeCount: 6,
    radical: { character: "自", nameJa: "みずから", nameEn: "self", strokes: 6, number: 132 },
    compounds: [
      { word: "自分", reading: "じぶん", romaji: "jibun", meaningEn: "oneself", meaningTa: "தான்", jlptLevel: "N5" },
      { word: "自転車", reading: "じてんしゃ", romaji: "jitensha", meaningEn: "bicycle", meaningTa: "மிதிவண்டி", jlptLevel: "N5" }
    ],
    examples: [
      { id: "ex_kj_n4_004_1", ja: "自分で決めます。", kana: "じぶんできめます。", en: "I will decide by myself.", ta: "நானே முடிவு செய்வேன்." }
    ],
    difficulty: 2,
    source: "KANJIDIC2 / MEXT Grade 2",
    reviewStatus: "validated",
    createdDate: "2026-11-04T00:00:00Z"
  },
  {
    id: "kj_n4_005",
    character: "社",
    jlptLevel: "N4",
    levelMetadata: {
      level: "N4",
      isEstimated: true,
      sourceReference: "MEXT Kyōiku Kanji Grade 2 / EDRDG KANJIDIC2",
      officialDisclaimer: "JLPT does not publish official fixed kanji lists.",
    },
    meaningEn: "company; firm; shrine",
    meaningTa: "நிறுவனம் / சமூகம்",
    onyomi: ["シャ"],
    kunyomi: ["やしろ"],
    romajiOn: ["sha"],
    romajiKun: ["yashiro"],
    strokeCount: 7,
    radical: { character: "示", nameJa: "しめす", nameEn: "altar, display", strokes: 5, number: 113 },
    compounds: [
      { word: "会社", reading: "かいしゃ", romaji: "kaisha", meaningEn: "company", meaningTa: "நிறுவனம்", jlptLevel: "N5" },
      { word: "社会", reading: "しゃかい", romaji: "shakai", meaningEn: "society", meaningTa: "சமூகம்", jlptLevel: "N4" }
    ],
    examples: [
      { id: "ex_kj_n4_005_1", ja: "新しい会社に入りました。", kana: "あたらしいかいしゃにはいりました。", en: "I joined a new company.", ta: "புதிய நிறுவனத்தில் சேர்ந்தேன்." }
    ],
    difficulty: 2,
    source: "KANJIDIC2 / MEXT Grade 2",
    reviewStatus: "validated",
    createdDate: "2026-11-04T00:00:00Z"
  },
  {
    id: "kj_n4_006",
    character: "発",
    jlptLevel: "N4",
    levelMetadata: {
      level: "N4",
      isEstimated: true,
      sourceReference: "MEXT Kyōiku Kanji Grade 3 / EDRDG KANJIDIC2",
      officialDisclaimer: "JLPT does not publish official fixed kanji lists.",
    },
    meaningEn: "departure; emit; publish",
    meaningTa: "புறப்பாடு / வெளியீடு",
    onyomi: ["ハツ", "ホツ"],
    kunyomi: [],
    romajiOn: ["hatsu", "hotsu"],
    romajiKun: [],
    strokeCount: 9,
    radical: { character: "癶", nameJa: "はつがしら", nameEn: "tent", strokes: 5, number: 105 },
    compounds: [
      { word: "出発", reading: "しゅっぱつ", romaji: "shuppatsu", meaningEn: "departure", meaningTa: "புறப்பாடு", jlptLevel: "N4" },
      { word: "発音", reading: "はつおん", romaji: "hatsuon", meaningEn: "pronunciation", meaningTa: "உச்சரிப்பு", jlptLevel: "N4" }
    ],
    examples: [
      { id: "ex_kj_n4_006_1", ja: "電車が出発します。", kana: "でんしゃがしゅっぱつします。", en: "The train departs.", ta: "ரயில் புறப்படுகிறது." }
    ],
    difficulty: 2,
    source: "KANJIDIC2 / MEXT Grade 3",
    reviewStatus: "validated",
    createdDate: "2026-11-04T00:00:00Z"
  },
  {
    id: "kj_n4_007",
    character: "者",
    jlptLevel: "N4",
    levelMetadata: {
      level: "N4",
      isEstimated: true,
      sourceReference: "MEXT Kyōiku Kanji Grade 3 / EDRDG KANJIDIC2",
      officialDisclaimer: "JLPT does not publish official fixed kanji lists.",
    },
    meaningEn: "someone; person",
    meaningTa: "நபர் / மனிதர்",
    onyomi: ["シャ"],
    kunyomi: ["もの"],
    romajiOn: ["sha"],
    romajiKun: ["mono"],
    strokeCount: 8,
    radical: { character: "老", nameJa: "おい", nameEn: "old", strokes: 6, number: 125 },
    compounds: [
      { word: "医者", reading: "いしゃ", romaji: "isha", meaningEn: "doctor", meaningTa: "மருத்துவர்", jlptLevel: "N5" },
      { word: "若者", reading: "わかもの", romaji: "wakamono", meaningEn: "young person", meaningTa: "இளைஞர்", jlptLevel: "N4" }
    ],
    examples: [
      { id: "ex_kj_n4_007_1", ja: "医者に行きました。", kana: "いしゃにいきました。", en: "I went to the doctor.", ta: "நான் மருத்துவரிடம் சென்றேன்." }
    ],
    difficulty: 2,
    source: "KANJIDIC2 / MEXT Grade 3",
    reviewStatus: "validated",
    createdDate: "2026-11-04T00:00:00Z"
  },
  {
    id: "kj_n4_008",
    character: "地",
    jlptLevel: "N4",
    levelMetadata: {
      level: "N4",
      isEstimated: true,
      sourceReference: "MEXT Kyōiku Kanji Grade 2 / EDRDG KANJIDIC2",
      officialDisclaimer: "JLPT does not publish official fixed kanji lists.",
    },
    meaningEn: "ground; earth; land",
    meaningTa: "நிலம் / தரை",
    onyomi: ["チ", "ジ"],
    kunyomi: [],
    romajiOn: ["chi", "ji"],
    romajiKun: [],
    strokeCount: 6,
    radical: { character: "土", nameJa: "つち", nameEn: "earth", strokes: 3, number: 32 },
    compounds: [
      { word: "地下", reading: "ちか", romaji: "chika", meaningEn: "underground", meaningTa: "பாதாளம்", jlptLevel: "N4" },
      { word: "地図", reading: "ちず", romaji: "chizu", meaningEn: "map", meaningTa: "வரைபடம்", jlptLevel: "N5" }
    ],
    examples: [
      { id: "ex_kj_n4_008_1", ja: "地図を見ながら歩きます。", kana: "ちずをみながらあるきます。", en: "I walk while looking at the map.", ta: "வரைபடத்தைப் பார்த்துக் கொண்டே நடக்கிறேன்." }
    ],
    difficulty: 2,
    source: "KANJIDIC2 / MEXT Grade 2",
    reviewStatus: "validated",
    createdDate: "2026-11-04T00:00:00Z"
  },
  {
    id: "kj_n4_009",
    character: "業",
    jlptLevel: "N4",
    levelMetadata: {
      level: "N4",
      isEstimated: true,
      sourceReference: "MEXT Kyōiku Kanji Grade 3 / EDRDG KANJIDIC2",
      officialDisclaimer: "JLPT does not publish official fixed kanji lists.",
    },
    meaningEn: "business; vocation; arts",
    meaningTa: "தொழில் / பாடம்",
    onyomi: ["ギョウ", "ゴウ"],
    kunyomi: ["わざ"],
    romajiOn: ["gyou", "gou"],
    romajiKun: ["waza"],
    strokeCount: 13,
    radical: { character: "木", nameJa: "き", nameEn: "tree", strokes: 4, number: 75 },
    compounds: [
      { word: "授業", reading: "じゅぎょう", romaji: "jugyou", meaningEn: "class; lesson", meaningTa: "வகுப்பு", jlptLevel: "N5" },
      { word: "工業", reading: "こうぎょう", romaji: "kougyou", meaningEn: "industry", meaningTa: "தொழில்துறை", jlptLevel: "N4" }
    ],
    examples: [
      { id: "ex_kj_n4_009_1", ja: "九時に授業が始まります。", kana: "くじにじゅぎょうがはじまります。", en: "Class starts at nine o'clock.", ta: "ஒன்பது மணிக்கு வகுப்பு தொடங்குகிறது." }
    ],
    difficulty: 2,
    source: "KANJIDIC2 / MEXT Grade 3",
    reviewStatus: "validated",
    createdDate: "2026-11-04T00:00:00Z"
  },
  {
    id: "kj_n4_010",
    character: "方",
    jlptLevel: "N4",
    levelMetadata: {
      level: "N4",
      isEstimated: true,
      sourceReference: "MEXT Kyōiku Kanji Grade 2 / EDRDG KANJIDIC2",
      officialDisclaimer: "JLPT does not publish official fixed kanji lists.",
    },
    meaningEn: "direction; person; method",
    meaningTa: "திசை / முறை",
    onyomi: ["ホウ"],
    kunyomi: ["かた", "-かた"],
    romajiOn: ["hou"],
    romajiKun: ["kata", "-kata"],
    strokeCount: 4,
    radical: { character: "方", nameJa: "ほう", nameEn: "direction", strokes: 4, number: 70 },
    compounds: [
      { word: "方法", reading: "ほうほう", romaji: "houhou", meaningEn: "method; way", meaningTa: "முறை", jlptLevel: "N4" },
      { word: "夕方", reading: "ゆうがた", romaji: "yuugata", meaningEn: "evening", meaningTa: "மாலை நேரம்", jlptLevel: "N5" }
    ],
    examples: [
      { id: "ex_kj_n4_010_1", ja: "使い方が分かりますか。", kana: "つかいかたがわかりますか。", en: "Do you know how to use it?", ta: "இதை எப்படி பயன்படுத்துவது என்று தெரியுமா?" }
    ],
    difficulty: 2,
    source: "KANJIDIC2 / MEXT Grade 2",
    reviewStatus: "validated",
    createdDate: "2026-11-04T00:00:00Z"
  },
  {
    id: "kj_n4_011",
    character: "新",
    jlptLevel: "N4",
    levelMetadata: {
      level: "N4",
      isEstimated: true,
      sourceReference: "MEXT Kyōiku Kanji Grade 2 / EDRDG KANJIDIC2",
      officialDisclaimer: "JLPT does not publish official fixed kanji lists.",
    },
    meaningEn: "new",
    meaningTa: "புதிய",
    onyomi: ["シン"],
    kunyomi: ["あたらしい", "あらた", "にい-"],
    romajiOn: ["shin"],
    romajiKun: ["atarashii", "arata", "nii-"],
    strokeCount: 13,
    radical: { character: "斤", nameJa: "おの", nameEn: "axe", strokes: 4, number: 69 },
    compounds: [
      { word: "新しい", reading: "あたらしい", romaji: "atarashii", meaningEn: "new", meaningTa: "புதிய", jlptLevel: "N5" },
      { word: "新聞", reading: "しんぶん", romaji: "shinbun", meaningEn: "newspaper", meaningTa: "செய்தித்தாள்", jlptLevel: "N5" }
    ],
    examples: [
      { id: "ex_kj_n4_011_1", ja: "新しい車を買いました。", kana: "あたらしいくるまをかいました。", en: "I bought a new car.", ta: "நான் ஒரு புதிய கார் வாங்கினேன்." }
    ],
    difficulty: 2,
    source: "KANJIDIC2 / MEXT Grade 2",
    reviewStatus: "validated",
    createdDate: "2026-11-04T00:00:00Z"
  },
  {
    id: "kj_n4_012",
    character: "場",
    jlptLevel: "N4",
    levelMetadata: {
      level: "N4",
      isEstimated: true,
      sourceReference: "MEXT Kyōiku Kanji Grade 2 / EDRDG KANJIDIC2",
      officialDisclaimer: "JLPT does not publish official fixed kanji lists.",
    },
    meaningEn: "location; place",
    meaningTa: "இடம்",
    onyomi: ["ジョウ", "チョウ"],
    kunyomi: ["ば"],
    romajiOn: ["jou", "chou"],
    romajiKun: ["ba"],
    strokeCount: 12,
    radical: { character: "土", nameJa: "つち", nameEn: "earth", strokes: 3, number: 32 },
    compounds: [
      { word: "場所", reading: "ばしょ", romaji: "basho", meaningEn: "place; location", meaningTa: "இடம்", jlptLevel: "N4" },
      { word: "工場", reading: "こうじょう", romaji: "koujou", meaningEn: "factory", meaningTa: "தொழிற்சாலை", jlptLevel: "N4" }
    ],
    examples: [
      { id: "ex_kj_n4_012_1", ja: "待ち合わせの場所はここです。", kana: "まちあわせのばしょはここです。", en: "The meeting place is right here.", ta: "சந்திக்கும் இடம் இதுதான்." }
    ],
    difficulty: 2,
    source: "KANJIDIC2 / MEXT Grade 2",
    reviewStatus: "validated",
    createdDate: "2026-11-04T00:00:00Z"
  },
  {
    id: "kj_n4_013",
    character: "員",
    jlptLevel: "N4",
    levelMetadata: {
      level: "N4",
      isEstimated: true,
      sourceReference: "MEXT Kyōiku Kanji Grade 3 / EDRDG KANJIDIC2",
      officialDisclaimer: "JLPT does not publish official fixed kanji lists.",
    },
    meaningEn: "employee; member; number",
    meaningTa: "உறுப்பினர் / பணியாளர்",
    onyomi: ["イン"],
    kunyomi: [],
    romajiOn: ["in"],
    romajiKun: [],
    strokeCount: 10,
    radical: { character: "口", nameJa: "くち", nameEn: "mouth", strokes: 3, number: 30 },
    compounds: [
      { word: "会社員", reading: "かいしゃいん", romaji: "kaishain", meaningEn: "company employee", meaningTa: "நிறுவன ஊழியர்", jlptLevel: "N5" },
      { word: "店員", reading: "てんいん", romaji: "ten'in", meaningEn: "store clerk", meaningTa: "கடை ஊழியர்", jlptLevel: "N4" }
    ],
    examples: [
      { id: "ex_kj_n4_013_1", ja: "兄は会社員です。", kana: "あにはかいしゃいんです。", en: "My older brother is a company employee.", ta: "என் அண்ணன் ஒரு நிறுவன ஊழியர்." }
    ],
    difficulty: 2,
    source: "KANJIDIC2 / MEXT Grade 3",
    reviewStatus: "validated",
    createdDate: "2026-11-04T00:00:00Z"
  },
  {
    id: "kj_n4_014",
    character: "立",
    jlptLevel: "N4",
    levelMetadata: {
      level: "N4",
      isEstimated: true,
      sourceReference: "MEXT Kyōiku Kanji Grade 1 / EDRDG KANJIDIC2",
      officialDisclaimer: "JLPT does not publish official fixed kanji lists.",
    },
    meaningEn: "stand up; rise; set up",
    meaningTa: "நில் / எழு",
    onyomi: ["リツ", "リュウ"],
    kunyomi: ["たつ", "たてる"],
    romajiOn: ["ritsu", "ryuu"],
    romajiKun: ["tatsu", "tateru"],
    strokeCount: 5,
    radical: { character: "立", nameJa: "たつ", nameEn: "stand", strokes: 5, number: 117 },
    compounds: [
      { word: "立つ", reading: "たつ", romaji: "tatsu", meaningEn: "to stand", meaningTa: "நிற்றல்", jlptLevel: "N5" },
      { word: "国立", reading: "こくりつ", romaji: "kokuritsu", meaningEn: "national", meaningTa: "தேசிய", jlptLevel: "N4" }
    ],
    examples: [
      { id: "ex_kj_n4_014_1", ja: "ドアの前に立っています。", kana: "ドアのまえにたっています。", en: "I am standing in front of the door.", ta: "கதவின் முன் நிற்கிறேன்." }
    ],
    difficulty: 2,
    source: "KANJIDIC2 / MEXT Grade 1",
    reviewStatus: "validated",
    createdDate: "2026-11-04T00:00:00Z"
  },
  {
    id: "kj_n4_015",
    character: "開",
    jlptLevel: "N4",
    levelMetadata: {
      level: "N4",
      isEstimated: true,
      sourceReference: "MEXT Kyōiku Kanji Grade 3 / EDRDG KANJIDIC2",
      officialDisclaimer: "JLPT does not publish official fixed kanji lists.",
    },
    meaningEn: "open; unfold; unseal",
    meaningTa: "திற",
    onyomi: ["カイ"],
    kunyomi: ["ひらく", "ひらける", "あく", "あける"],
    romajiOn: ["kai"],
    romajiKun: ["hiraku", "hirakeru", "aku", "akeru"],
    strokeCount: 12,
    radical: { character: "門", nameJa: "もん", nameEn: "gate", strokes: 8, number: 169 },
    compounds: [
      { word: "開く", reading: "あく", romaji: "aku", meaningEn: "to open", meaningTa: "திறத்தல்", jlptLevel: "N5" },
      { word: "開始", reading: "かいし", romaji: "kaishi", meaningEn: "start; commencement", meaningTa: "தொடக்கம்", jlptLevel: "N3" }
    ],
    examples: [
      { id: "ex_kj_n4_015_1", ja: "窓を開けてください。", kana: "まどをあけてください。", en: "Please open the window.", ta: "தயவுசெய்து ஜன்னலைத் திறக்கவும்." }
    ],
    difficulty: 2,
    source: "KANJIDIC2 / MEXT Grade 3",
    reviewStatus: "validated",
    createdDate: "2026-11-04T00:00:00Z"
  },
  {
    id: "kj_n4_016",
    character: "不",
    jlptLevel: "N4",
    levelMetadata: {
      level: "N4",
      isEstimated: true,
      sourceReference: "MEXT Kyōiku Kanji Grade 4 / EDRDG KANJIDIC2",
      officialDisclaimer: "JLPT does not publish official fixed kanji lists.",
    },
    meaningEn: "negative; non-; bad",
    meaningTa: "அல்ல / எதிர்மறை",
    onyomi: ["フ", "ブ"],
    kunyomi: [],
    romajiOn: ["fu", "bu"],
    romajiKun: [],
    strokeCount: 4,
    radical: { character: "一", nameJa: "いち", nameEn: "one", strokes: 1, number: 1 },
    compounds: [
      { word: "不便", reading: "ふべん", romaji: "fuben", meaningEn: "inconvenient", meaningTa: "சௌகரியமற்ற", jlptLevel: "N5" },
      { word: "不安", reading: "ふあん", romaji: "fuan", meaningEn: "anxiety; worry", meaningTa: "கவலை", jlptLevel: "N4" }
    ],
    examples: [
      { id: "ex_kj_n4_016_1", ja: "バスがなくて不便です。", kana: "バスがなくてふべんです。", en: "It is inconvenient without buses.", ta: "பேருந்து இல்லாததால் சிரமமாக உள்ளது." }
    ],
    difficulty: 2,
    source: "KANJIDIC2 / MEXT Grade 4",
    reviewStatus: "validated",
    createdDate: "2026-11-04T00:00:00Z"
  },
  {
    id: "kj_n4_017",
    character: "世",
    jlptLevel: "N4",
    levelMetadata: {
      level: "N4",
      isEstimated: true,
      sourceReference: "MEXT Kyōiku Kanji Grade 3 / EDRDG KANJIDIC2",
      officialDisclaimer: "JLPT does not publish official fixed kanji lists.",
    },
    meaningEn: "generation; world; society",
    meaningTa: "உலகம் / தலைமுறை",
    onyomi: ["セイ", "セ", "ソウ"],
    kunyomi: ["よ"],
    romajiOn: ["sei", "se", "sou"],
    romajiKun: ["yo"],
    strokeCount: 5,
    radical: { character: "一", nameJa: "いち", nameEn: "one", strokes: 1, number: 1 },
    compounds: [
      { word: "世界", reading: "せかい", romaji: "sekai", meaningEn: "world", meaningTa: "உலகம்", jlptLevel: "N4" },
      { word: "世の中", reading: "よのなか", romaji: "yononaka", meaningEn: "society; the world", meaningTa: "உலகம்", jlptLevel: "N4" }
    ],
    examples: [
      { id: "ex_kj_n4_017_1", ja: "世界中を旅したいです。", kana: "せかいじゅうをたびしたいです。", en: "I want to travel around the world.", ta: "நான் உலகம் முழுவதும் பயணம் செய்ய விரும்புகிறேன்." }
    ],
    difficulty: 2,
    source: "KANJIDIC2 / MEXT Grade 3",
    reviewStatus: "validated",
    createdDate: "2026-11-04T00:00:00Z"
  },
  {
    id: "kj_n4_018",
    character: "主",
    jlptLevel: "N4",
    levelMetadata: {
      level: "N4",
      isEstimated: true,
      sourceReference: "MEXT Kyōiku Kanji Grade 3 / EDRDG KANJIDIC2",
      officialDisclaimer: "JLPT does not publish official fixed kanji lists.",
    },
    meaningEn: "master; main thing; owner",
    meaningTa: "முக்கிய / தலைவர்",
    onyomi: ["シュ", "ス", "シュウ"],
    kunyomi: ["ぬし", "おも"],
    romajiOn: ["shu", "su", "shuu"],
    romajiKun: ["nushi", "omo"],
    strokeCount: 5,
    radical: { character: "丶", nameJa: "てん", nameEn: "dot", strokes: 1, number: 3 },
    compounds: [
      { word: "主人", reading: "しゅじん", romaji: "shujin", meaningEn: "husband; master", meaningTa: "கணவர் / தலைவர்", jlptLevel: "N4" },
      { word: "主に", reading: "おもに", romaji: "omoni", meaningEn: "mainly", meaningTa: "முக்கியமாக", jlptLevel: "N4" }
    ],
    examples: [
      { id: "ex_kj_n4_018_1", ja: "主に野菜を食べます。", kana: "おもにやさいをたべます。", en: "I mainly eat vegetables.", ta: "நான் முக்கியமாக காய்கறிகளைச் சாப்பிடுகிறேன்." }
    ],
    difficulty: 2,
    source: "KANJIDIC2 / MEXT Grade 3",
    reviewStatus: "validated",
    createdDate: "2026-11-04T00:00:00Z"
  },
  {
    id: "kj_n4_019",
    character: "用",
    jlptLevel: "N4",
    levelMetadata: {
      level: "N4",
      isEstimated: true,
      sourceReference: "MEXT Kyōiku Kanji Grade 2 / EDRDG KANJIDIC2",
      officialDisclaimer: "JLPT does not publish official fixed kanji lists.",
    },
    meaningEn: "utilize; business; service",
    meaningTa: "பயன்படுத்து / காரியம்",
    onyomi: ["ヨウ"],
    kunyomi: ["もちいる"],
    romajiOn: ["you"],
    romajiKun: ["mochiiru"],
    strokeCount: 5,
    radical: { character: "用", nameJa: "よう", nameEn: "use", strokes: 5, number: 101 },
    compounds: [
      { word: "用事", reading: "ようじ", romaji: "youji", meaningEn: "errand; business", meaningTa: "வேலை / காரியம்", jlptLevel: "N4" },
      { word: "使用", reading: "しよう", romaji: "shiyou", meaningEn: "use; application", meaningTa: "பயன்பாடு", jlptLevel: "N3" }
    ],
    examples: [
      { id: "ex_kj_n4_019_1", ja: "午後から用事があります。", kana: "ごごからようじがあります。", en: "I have errands starting this afternoon.", ta: "மதியத்திற்கு மேல் எனக்கு ஒரு வேலை இருக்கிறது." }
    ],
    difficulty: 2,
    source: "KANJIDIC2 / MEXT Grade 2",
    reviewStatus: "validated",
    createdDate: "2026-11-04T00:00:00Z"
  },
  {
    id: "kj_n4_020",
    character: "度",
    jlptLevel: "N4",
    levelMetadata: {
      level: "N4",
      isEstimated: true,
      sourceReference: "MEXT Kyōiku Kanji Grade 3 / EDRDG KANJIDIC2",
      officialDisclaimer: "JLPT does not publish official fixed kanji lists.",
    },
    meaningEn: "degrees; occurrence; time",
    meaningTa: "தரம் / முறை",
    onyomi: ["ド", "ト", "タク"],
    kunyomi: ["たび", "たい"],
    romajiOn: ["do", "to", "taku"],
    romajiKun: ["tabi", "tai"],
    strokeCount: 9,
    radical: { character: "广", nameJa: "まだれ", nameEn: "dotted cliff", strokes: 3, number: 53 },
    compounds: [
      { word: "今度", reading: "こんど", romaji: "kondo", meaningEn: "this time; next time", meaningTa: "இந்த முறை", jlptLevel: "N5" },
      { word: "温度", reading: "おんど", romaji: "ondo", meaningEn: "temperature", meaningTa: "வெப்பநிலை", jlptLevel: "N4" }
    ],
    examples: [
      { id: "ex_kj_n4_020_1", ja: "もう一度言ってください。", kana: "もういちどいってください。", en: "Please say it one more time.", ta: "தயவுசெய்து மீண்டும் ஒரு முறை சொல்லுங்கள்." }
    ],
    difficulty: 2,
    source: "KANJIDIC2 / MEXT Grade 3",
    reviewStatus: "validated",
    createdDate: "2026-11-04T00:00:00Z"
  }
];

