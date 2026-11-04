import { KanjiEntry } from "../../types/content";

/**
 * JLPT N5 Kanji Modular Dataset
 * Attribution: MEXT Elementary Kyōiku Grade 1 / EDRDG KANJIDIC2
 * All post-2010 JLPT classifications are curricular reference standards (isEstimated: true).
 */
export const N5_KANJI: KanjiEntry[] = [
  {
    id: "kj_n5_001",
    character: "日",
    jlptLevel: "N5",
    levelMetadata: {
      level: "N5",
      isEstimated: true,
      sourceReference: "MEXT Kyōiku Kanji Grade 1 / EDRDG KANJIDIC2",
      officialDisclaimer: "JLPT does not publish official fixed kanji lists.",
    },
    meaningEn: "day; sun",
    meaningTa: "நாள் / சூரியன்",
    onyomi: ["ニチ", "ジツ"],
    kunyomi: ["ひ", "-び", "-か"],
    romajiOn: ["nichi", "jitsu"],
    romajiKun: ["hi", "-bi", "-ka"],
    strokeCount: 4,
    radical: { character: "日", nameJa: "ひ", nameEn: "sun, day", strokes: 4, number: 72 },
    grade: 1,
    frequencyRank: 42,
    compounds: [
      { word: "日本", reading: "にほん", romaji: "nihon", meaningEn: "Japan", meaningTa: "ஜப்பான்", jlptLevel: "N5" },
      { word: "日曜日", reading: "にちようび", romaji: "nichiyoubi", meaningEn: "Sunday", meaningTa: "ஞாயிற்றுக்கிழமை", jlptLevel: "N5" }
    ],
    examples: [
      { id: "ex_kj_n5_001_1", ja: "今日はいい天気です。", kana: "きょうはいいてんきです。", romaji: "Kyou wa ii tenki desu.", en: "The weather is nice today.", ta: "இன்று நல்ல வானிலை நிலவுகிறது." }
    ],
    mnemonic: "A picture of the sun in the sky with a line across the center.",
    difficulty: 1,
    source: "KANJIDIC2 / MEXT Grade 1",
    reviewStatus: "published",
    createdDate: "2026-11-04T00:00:00Z"
  },
  {
    id: "kj_n5_002",
    character: "月",
    jlptLevel: "N5",
    levelMetadata: {
      level: "N5",
      isEstimated: true,
      sourceReference: "MEXT Kyōiku Kanji Grade 1 / EDRDG KANJIDIC2",
      officialDisclaimer: "JLPT does not publish official fixed kanji lists.",
    },
    meaningEn: "month; moon",
    meaningTa: "மாதம் / நிலவு",
    onyomi: ["ゲツ", "ガツ"],
    kunyomi: ["つき"],
    romajiOn: ["getsu", "gatsu"],
    romajiKun: ["tsuki"],
    strokeCount: 4,
    radical: { character: "月", nameJa: "つき", nameEn: "moon, month", strokes: 4, number: 74 },
    grade: 1,
    frequencyRank: 23,
    compounds: [
      { word: "月曜日", reading: "げつようび", romaji: "getsuyoubi", meaningEn: "Monday", meaningTa: "திங்கட்கிழமை", jlptLevel: "N5" },
      { word: "一月", reading: "いちがつ", romaji: "ichigatsu", meaningEn: "January", meaningTa: "ஜனவரி", jlptLevel: "N5" }
    ],
    examples: [
      { id: "ex_kj_n5_002_1", ja: "今夜は月がきれいです。", kana: "こんやはつきがきれいです。", romaji: "Konya wa tsuki ga kirei desu.", en: "The moon is beautiful tonight.", ta: "இன்று இரவு நிலா அழகாக இருக்கிறது." }
    ],
    mnemonic: "A crescent moon partially veiled by clouds.",
    difficulty: 1,
    source: "KANJIDIC2 / MEXT Grade 1",
    reviewStatus: "published",
    createdDate: "2026-11-04T00:00:00Z"
  },
  {
    id: "kj_n5_003",
    character: "人",
    jlptLevel: "N5",
    levelMetadata: {
      level: "N5",
      isEstimated: true,
      sourceReference: "MEXT Kyōiku Kanji Grade 1 / EDRDG KANJIDIC2",
      officialDisclaimer: "JLPT does not publish official fixed kanji lists.",
    },
    meaningEn: "person",
    meaningTa: "மனிதர் / ஆள்",
    onyomi: ["ジン", "ニン"],
    kunyomi: ["ひと", "-り", "-と"],
    romajiOn: ["jin", "nin"],
    romajiKun: ["hito", "-ri", "-to"],
    strokeCount: 2,
    radical: { character: "人", nameJa: "ひと", nameEn: "person", strokes: 2, number: 9 },
    grade: 1,
    frequencyRank: 5,
    compounds: [
      { word: "日本人", reading: "にほんじん", romaji: "nihonjin", meaningEn: "Japanese person", meaningTa: "ஜப்பானியர்", jlptLevel: "N5" },
      { word: "三人", reading: "さんにん", romaji: "sannin", meaningEn: "three people", meaningTa: "மூன்று நபர்கள்", jlptLevel: "N5" }
    ],
    examples: [
      { id: "ex_kj_n5_003_1", ja: "あの人は誰ですか。", kana: "あのひとはだれですか。", romaji: "Ano hito wa dare desu ka.", en: "Who is that person?", ta: "அந்த நபர் யார்?" }
    ],
    mnemonic: "A side view of a human being standing on two legs.",
    difficulty: 1,
    source: "KANJIDIC2 / MEXT Grade 1",
    reviewStatus: "published",
    createdDate: "2026-11-04T00:00:00Z"
  },
  {
    id: "kj_n5_004",
    character: "火",
    jlptLevel: "N5",
    levelMetadata: {
      level: "N5",
      isEstimated: true,
      sourceReference: "MEXT Kyōiku Kanji Grade 1 / EDRDG KANJIDIC2",
      officialDisclaimer: "JLPT does not publish official fixed kanji lists.",
    },
    meaningEn: "fire",
    meaningTa: "நெருப்பு / தீ",
    onyomi: ["カ"],
    kunyomi: ["ひ", "-び", "ほ-"],
    romajiOn: ["ka"],
    romajiKun: ["hi", "-bi", "ho-"],
    strokeCount: 4,
    radical: { character: "火", nameJa: "ひ", nameEn: "fire", strokes: 4, number: 86 },
    grade: 1,
    frequencyRank: 574,
    compounds: [
      { word: "火曜日", reading: "かようび", romaji: "kayoubi", meaningEn: "Tuesday", meaningTa: "செவ்வாய்க்கிழமை", jlptLevel: "N5" },
      { word: "火山", reading: "かざん", romaji: "kazan", meaningEn: "volcano", meaningTa: "எரிமலை", jlptLevel: "N5" }
    ],
    examples: [
      { id: "ex_kj_n5_004_1", ja: "火に気をつけてください。", kana: "ひにきをつけてください。", romaji: "Hi ni ki o tsukete kudasai.", en: "Please be careful with fire.", ta: "நெருப்புடன் கவனமாக இருங்கள்." }
    ],
    mnemonic: "Sparks flying up from a roaring campfire.",
    difficulty: 1,
    source: "KANJIDIC2 / MEXT Grade 1",
    reviewStatus: "published",
    createdDate: "2026-11-04T00:00:00Z"
  },
  {
    id: "kj_n5_005",
    character: "水",
    jlptLevel: "N5",
    levelMetadata: {
      level: "N5",
      isEstimated: true,
      sourceReference: "MEXT Kyōiku Kanji Grade 1 / EDRDG KANJIDIC2",
      officialDisclaimer: "JLPT does not publish official fixed kanji lists.",
    },
    meaningEn: "water",
    meaningTa: "தண்ணீர் / நீர்",
    onyomi: ["スイ"],
    kunyomi: ["みず"],
    romajiOn: ["sui"],
    romajiKun: ["mizu"],
    strokeCount: 4,
    radical: { character: "水", nameJa: "みず", nameEn: "water", strokes: 4, number: 85 },
    grade: 1,
    frequencyRank: 223,
    compounds: [
      { word: "水曜日", reading: "すいようび", romaji: "suiyoubi", meaningEn: "Wednesday", meaningTa: "புதன்கிழமை", jlptLevel: "N5" },
      { word: "水道", reading: "すいどう", romaji: "suidou", meaningEn: "water supply", meaningTa: "குடிநீர் வழங்கல்", jlptLevel: "N5" }
    ],
    examples: [
      { id: "ex_kj_n5_005_1", ja: "水を一杯ください。", kana: "みずをいっぱいください。", romaji: "Mizu o ippai kudasai.", en: "Please give me a glass of water.", ta: "தயவுசெய்து ஒரு டம்ளர் தண்ணீர் கொடுங்கள்." }
    ],
    mnemonic: "A flowing stream with ripples splashing on either side.",
    difficulty: 1,
    source: "KANJIDIC2 / MEXT Grade 1",
    reviewStatus: "published",
    createdDate: "2026-11-04T00:00:00Z"
  },
  {
    id: "kj_n5_006",
    character: "木",
    jlptLevel: "N5",
    levelMetadata: {
      level: "N5",
      isEstimated: true,
      sourceReference: "MEXT Kyōiku Kanji Grade 1 / EDRDG KANJIDIC2",
      officialDisclaimer: "JLPT does not publish official fixed kanji lists.",
    },
    meaningEn: "tree; wood",
    meaningTa: "மரம்",
    onyomi: ["ボク", "モク"],
    kunyomi: ["き", "こ-"],
    romajiOn: ["boku", "moku"],
    romajiKun: ["ki", "ko-"],
    strokeCount: 4,
    radical: { character: "木", nameJa: "き", nameEn: "tree", strokes: 4, number: 75 },
    grade: 1,
    frequencyRank: 317,
    compounds: [
      { word: "木曜日", reading: "もくようび", romaji: "mokuyoubi", meaningEn: "Thursday", meaningTa: "வியாழக்கிழமை", jlptLevel: "N5" },
      { word: "木材", reading: "もくざい", romaji: "mokuzai", meaningEn: "lumber; timber", meaningTa: "மரம் / பலகை", jlptLevel: "N5" }
    ],
    examples: [
      { id: "ex_kj_n5_006_1", ja: "庭に大きな木があります。", kana: "にわにおおきなきがあります。", romaji: "Niwa ni ookina ki ga arimasu.", en: "There is a big tree in the garden.", ta: "தோட்டத்தில் ஒரு பெரிய மரம் உள்ளது." }
    ],
    mnemonic: "A tree trunk with branches stretching upward and roots deep underground.",
    difficulty: 1,
    source: "KANJIDIC2 / MEXT Grade 1",
    reviewStatus: "published",
    createdDate: "2026-11-04T00:00:00Z"
  },
  {
    id: "kj_n5_007",
    character: "金",
    jlptLevel: "N5",
    levelMetadata: {
      level: "N5",
      isEstimated: true,
      sourceReference: "MEXT Kyōiku Kanji Grade 1 / EDRDG KANJIDIC2",
      officialDisclaimer: "JLPT does not publish official fixed kanji lists.",
    },
    meaningEn: "gold; money",
    meaningTa: "தங்கம் / பணம்",
    onyomi: ["キン", "コン"],
    kunyomi: ["かね", "かな-"],
    romajiOn: ["kin", "kon"],
    romajiKun: ["kane", "kana-"],
    strokeCount: 8,
    radical: { character: "金", nameJa: "かね", nameEn: "metal, gold", strokes: 8, number: 167 },
    grade: 1,
    frequencyRank: 52,
    compounds: [
      { word: "金曜日", reading: "きんようび", romaji: "kinyoubi", meaningEn: "Friday", meaningTa: "வெள்ளிக்கிழமை", jlptLevel: "N5" },
      { word: "お金", reading: "おかね", romaji: "okane", meaningEn: "money", meaningTa: "பணம்", jlptLevel: "N5" }
    ],
    examples: [
      { id: "ex_kj_n5_007_1", ja: "金曜日に会いましょう。", kana: "きんようびにあいましょう。", romaji: "Kinyoubi ni aimashou.", en: "Let's meet on Friday.", ta: "வெள்ளிக்கிழமை சந்திப்போம்." }
    ],
    mnemonic: "Gold nuggets hidden underground sheltered beneath a roof.",
    difficulty: 1,
    source: "KANJIDIC2 / MEXT Grade 1",
    reviewStatus: "published",
    createdDate: "2026-11-04T00:00:00Z"
  },
  {
    id: "kj_n5_008",
    character: "土",
    jlptLevel: "N5",
    levelMetadata: {
      level: "N5",
      isEstimated: true,
      sourceReference: "MEXT Kyōiku Kanji Grade 1 / EDRDG KANJIDIC2",
      officialDisclaimer: "JLPT does not publish official fixed kanji lists.",
    },
    meaningEn: "earth; soil; ground",
    meaningTa: "மண் / பூமி",
    onyomi: ["ド", "ト"],
    kunyomi: ["つち"],
    romajiOn: ["do", "to"],
    romajiKun: ["tsuchi"],
    strokeCount: 3,
    radical: { character: "土", nameJa: "つち", nameEn: "earth, soil", strokes: 3, number: 32 },
    grade: 1,
    frequencyRank: 304,
    compounds: [
      { word: "土曜日", reading: "どようび", romaji: "doyoubi", meaningEn: "Saturday", meaningTa: "சனிக்கிழமை", jlptLevel: "N5" },
      { word: "土地", reading: "とち", romaji: "tochi", meaningEn: "land; plot", meaningTa: "நிலம்", jlptLevel: "N5" }
    ],
    examples: [
      { id: "ex_kj_n5_008_1", ja: "土曜日は休みです。", kana: "どようびはやすみです。", romaji: "Doyoubi wa yasumi desu.", en: "Saturday is a day off.", ta: "சனிக்கிழமை விடுமுறை நாள்." }
    ],
    mnemonic: "A plant sprout pushing through the soil on the ground.",
    difficulty: 1,
    source: "KANJIDIC2 / MEXT Grade 1",
    reviewStatus: "published",
    createdDate: "2026-11-04T00:00:00Z"
  },
  {
    id: "kj_n5_009",
    character: "山",
    jlptLevel: "N5",
    levelMetadata: {
      level: "N5",
      isEstimated: true,
      sourceReference: "MEXT Kyōiku Kanji Grade 1 / EDRDG KANJIDIC2",
      officialDisclaimer: "JLPT does not publish official fixed kanji lists.",
    },
    meaningEn: "mountain",
    meaningTa: "மலை",
    onyomi: ["サン", "セン"],
    kunyomi: ["やま"],
    romajiOn: ["san", "sen"],
    romajiKun: ["yama"],
    strokeCount: 3,
    radical: { character: "山", nameJa: "やま", nameEn: "mountain", strokes: 3, number: 46 },
    grade: 1,
    frequencyRank: 131,
    compounds: [
      { word: "富士山", reading: "ふじさん", romaji: "fujisan", meaningEn: "Mount Fuji", meaningTa: "புஜி மலை", jlptLevel: "N5" },
      { word: "山道", reading: "やまみち", romaji: "yamamichi", meaningEn: "mountain path", meaningTa: "மலைப்பாதை", jlptLevel: "N5" }
    ],
    examples: [
      { id: "ex_kj_n5_009_1", ja: "夏に山へ登ります。", kana: "なつにやまへのぼります。", romaji: "Natsu ni yama e noborimasu.", en: "I climb mountains in the summer.", ta: "கோடைகாலத்தில் மலை ஏறுவேன்." }
    ],
    mnemonic: "Three mountain peaks towering against the horizon.",
    difficulty: 1,
    source: "KANJIDIC2 / MEXT Grade 1",
    reviewStatus: "published",
    createdDate: "2026-11-04T00:00:00Z"
  },
  {
    id: "kj_n5_010",
    character: "川",
    jlptLevel: "N5",
    levelMetadata: {
      level: "N5",
      isEstimated: true,
      sourceReference: "MEXT Kyōiku Kanji Grade 1 / EDRDG KANJIDIC2",
      officialDisclaimer: "JLPT does not publish official fixed kanji lists.",
    },
    meaningEn: "river; stream",
    meaningTa: "ஆறு / நதி",
    onyomi: ["セン"],
    kunyomi: ["かわ"],
    romajiOn: ["sen"],
    romajiKun: ["kawa"],
    strokeCount: 3,
    radical: { character: "川", nameJa: "かわ", nameEn: "river", strokes: 3, number: 47 },
    grade: 1,
    frequencyRank: 181,
    compounds: [
      { word: "小川", reading: "おがわ", romaji: "ogawa", meaningEn: "brook; stream", meaningTa: "சிற்றாறு", jlptLevel: "N5" },
      { word: "河川", reading: "かせん", romaji: "kasen", meaningEn: "rivers; waterways", meaningTa: "நதிகள்", jlptLevel: "N5" }
    ],
    examples: [
      { id: "ex_kj_n5_010_1", ja: "川で魚を釣ります。", kana: "かわでさかなをつります。", romaji: "Kawa de sakana o tsurimasu.", en: "I fish in the river.", ta: "ஆற்றில் மீன் பிடிக்கிறேன்." }
    ],
    mnemonic: "Three streams of water flowing side by side.",
    difficulty: 1,
    source: "KANJIDIC2 / MEXT Grade 1",
    reviewStatus: "published",
    createdDate: "2026-11-04T00:00:00Z"
  },
  {
    id: "kj_n5_011",
    character: "生",
    jlptLevel: "N5",
    levelMetadata: {
      level: "N5",
      isEstimated: true,
      sourceReference: "MEXT Kyōiku Kanji Grade 1 / EDRDG KANJIDIC2",
      officialDisclaimer: "JLPT does not publish official fixed kanji lists.",
    },
    meaningEn: "life; birth; to live",
    meaningTa: "வாழ்க்கை / பிறப்பு",
    onyomi: ["セイ", "ショウ"],
    kunyomi: ["いきる", "うまれる", "なま"],
    romajiOn: ["sei", "shou"],
    romajiKun: ["ikiru", "umareru", "nama"],
    strokeCount: 5,
    radical: { character: "生", nameJa: "うまれる", nameEn: "life, birth", strokes: 5, number: 100 },
    grade: 1,
    frequencyRank: 29,
    compounds: [
      { word: "先生", reading: "せんせい", romaji: "sensei", meaningEn: "teacher", meaningTa: "ஆசிரியர்", jlptLevel: "N5" },
      { word: "学生", reading: "がくせい", romaji: "gakusei", meaningEn: "student", meaningTa: "மாணவர்", jlptLevel: "N5" }
    ],
    examples: [
      { id: "ex_kj_n5_011_1", ja: "先生、質問があります。", kana: "せんせい、しつもんがあります。", romaji: "Sensei, shitsumon ga arimasu.", en: "Teacher, I have a question.", ta: "ஆசிரியரே, எனக்கு ஒரு கேள்வி உள்ளது." }
    ],
    mnemonic: "A seedling breaking through the ground to begin life.",
    difficulty: 1,
    source: "KANJIDIC2 / MEXT Grade 1",
    reviewStatus: "published",
    createdDate: "2026-11-04T00:00:00Z"
  },
  {
    id: "kj_n5_012",
    character: "学",
    jlptLevel: "N5",
    levelMetadata: {
      level: "N5",
      isEstimated: true,
      sourceReference: "MEXT Kyōiku Kanji Grade 1 / EDRDG KANJIDIC2",
      officialDisclaimer: "JLPT does not publish official fixed kanji lists.",
    },
    meaningEn: "study; learning; science",
    meaningTa: "படிப்பு / கற்றல்",
    onyomi: ["ガク"],
    kunyomi: ["まなぶ"],
    romajiOn: ["gaku"],
    romajiKun: ["manabu"],
    strokeCount: 8,
    radical: { character: "子", nameJa: "こ", nameEn: "child", strokes: 3, number: 39 },
    grade: 1,
    frequencyRank: 66,
    compounds: [
      { word: "学校", reading: "がっこう", romaji: "gakkou", meaningEn: "school", meaningTa: "பள்ளி", jlptLevel: "N5" },
      { word: "大学", reading: "だいがく", romaji: "daigaku", meaningEn: "university", meaningTa: "பல்கலைக்கழகம்", jlptLevel: "N5" }
    ],
    examples: [
      { id: "ex_kj_n5_012_1", ja: "日本語を学びます。", kana: "にほんごをまなびます。", romaji: "Nihongo o manabimasu.", en: "I learn Japanese.", ta: "நான் ஜப்பானிய மொழி கற்கிறேன்." }
    ],
    mnemonic: "A child studying beneath a school roof with knowledge sparks.",
    difficulty: 1,
    source: "KANJIDIC2 / MEXT Grade 1",
    reviewStatus: "published",
    createdDate: "2026-11-04T00:00:00Z"
  },
  {
    id: "kj_n5_013",
    character: "校",
    jlptLevel: "N5",
    levelMetadata: {
      level: "N5",
      isEstimated: true,
      sourceReference: "MEXT Kyōiku Kanji Grade 1 / EDRDG KANJIDIC2",
      officialDisclaimer: "JLPT does not publish official fixed kanji lists.",
    },
    meaningEn: "school; exam",
    meaningTa: "பள்ளிக்கூடம்",
    onyomi: ["コウ"],
    kunyomi: [],
    romajiOn: ["kou"],
    romajiKun: [],
    strokeCount: 10,
    radical: { character: "木", nameJa: "き", nameEn: "tree", strokes: 4, number: 75 },
    grade: 1,
    frequencyRank: 266,
    compounds: [
      { word: "学校", reading: "がっこう", romaji: "gakkou", meaningEn: "school", meaningTa: "பள்ளி", jlptLevel: "N5" },
      { word: "高校", reading: "こうこう", romaji: "koukou", meaningEn: "high school", meaningTa: "மேல்நிலைப் பள்ளி", jlptLevel: "N5" }
    ],
    examples: [
      { id: "ex_kj_n5_013_1", ja: "学校へ歩いて行きます。", kana: "がっこうへあるいていきます。", romaji: "Gakkou e aruite ikimasu.", en: "I walk to school.", ta: "நான் பள்ளிக்கு நடந்து செல்கிறேன்." }
    ],
    mnemonic: "A wooden building where people gather to exchange ideas.",
    difficulty: 1,
    source: "KANJIDIC2 / MEXT Grade 1",
    reviewStatus: "published",
    createdDate: "2026-11-04T00:00:00Z"
  },
  {
    id: "kj_n5_014",
    character: "田",
    jlptLevel: "N5",
    levelMetadata: {
      level: "N5",
      isEstimated: true,
      sourceReference: "MEXT Kyōiku Kanji Grade 1 / EDRDG KANJIDIC2",
      officialDisclaimer: "JLPT does not publish official fixed kanji lists.",
    },
    meaningEn: "rice field; paddy",
    meaningTa: "வயல் / நெல்வயல்",
    onyomi: ["デン"],
    kunyomi: ["た"],
    romajiOn: ["den"],
    romajiKun: ["ta"],
    strokeCount: 5,
    radical: { character: "田", nameJa: "た", nameEn: "rice field", strokes: 5, number: 102 },
    grade: 1,
    frequencyRank: 90,
    compounds: [
      { word: "田んぼ", reading: "たんぼ", romaji: "tanbo", meaningEn: "rice field", meaningTa: "நெல் வயல்", jlptLevel: "N5" },
      { word: "水田", reading: "すいでん", romaji: "suiden", meaningEn: "watered rice field", meaningTa: "நீர் வயல்", jlptLevel: "N5" }
    ],
    examples: [
      { id: "ex_kj_n5_014_1", ja: "田んぼに稲が育っています。", kana: "たんぼにいねがそだっています。", romaji: "Tanbo ni ine ga sodatte imasu.", en: "Rice is growing in the paddy.", ta: "வயலில் நெற்பயிர்கள் வளர்கின்றன." }
    ],
    mnemonic: "An aerial view of a rice paddy divided into four plots.",
    difficulty: 1,
    source: "KANJIDIC2 / MEXT Grade 1",
    reviewStatus: "published",
    createdDate: "2026-11-04T00:00:00Z"
  },
  {
    id: "kj_n5_015",
    character: "口",
    jlptLevel: "N5",
    levelMetadata: {
      level: "N5",
      isEstimated: true,
      sourceReference: "MEXT Kyōiku Kanji Grade 1 / EDRDG KANJIDIC2",
      officialDisclaimer: "JLPT does not publish official fixed kanji lists.",
    },
    meaningEn: "mouth; opening",
    meaningTa: "வாய் / நுழைவு",
    onyomi: ["コウ", "ク"],
    kunyomi: ["くち"],
    romajiOn: ["kou", "ku"],
    romajiKun: ["kuchi"],
    strokeCount: 3,
    radical: { character: "口", nameJa: "くち", nameEn: "mouth", strokes: 3, number: 30 },
    grade: 1,
    frequencyRank: 279,
    compounds: [
      { word: "入口", reading: "いりぐち", romaji: "iriguchi", meaningEn: "entrance", meaningTa: "நுழைவாயில்", jlptLevel: "N5" },
      { word: "出口", reading: "でぐち", romaji: "deguchi", meaningEn: "exit", meaningTa: "வெளியேறும் வழி", jlptLevel: "N5" }
    ],
    examples: [
      { id: "ex_kj_n5_015_1", ja: "駅の入口はあちらです。", kana: "えきのいりぐちはあちらです。", romaji: "Eki no iriguchi wa achira desu.", en: "The station entrance is over there.", ta: "நிலையத்தின் நுழைவாயில் அங்கே உள்ளது." }
    ],
    mnemonic: "A wide open mouth.",
    difficulty: 1,
    source: "KANJIDIC2 / MEXT Grade 1",
    reviewStatus: "published",
    createdDate: "2026-11-04T00:00:00Z"
  },
  {
    id: "kj_n5_016",
    character: "目",
    jlptLevel: "N5",
    levelMetadata: {
      level: "N5",
      isEstimated: true,
      sourceReference: "MEXT Kyōiku Kanji Grade 1 / EDRDG KANJIDIC2",
      officialDisclaimer: "JLPT does not publish official fixed kanji lists.",
    },
    meaningEn: "eye; look",
    meaningTa: "கண்",
    onyomi: ["モク", "ボク"],
    kunyomi: ["め", "-め", "ま-"],
    romajiOn: ["moku", "boku"],
    romajiKun: ["me", "-me", "ma-"],
    strokeCount: 5,
    radical: { character: "目", nameJa: "め", nameEn: "eye", strokes: 5, number: 109 },
    grade: 1,
    frequencyRank: 76,
    compounds: [
      { word: "目的", reading: "もくてき", romaji: "mokuteki", meaningEn: "purpose; goal", meaningTa: "நோக்கம்", jlptLevel: "N5" },
      { word: "目薬", reading: "めぐすり", romaji: "megusuri", meaningEn: "eye drops", meaningTa: "கண் மருந்து", jlptLevel: "N5" }
    ],
    examples: [
      { id: "ex_kj_n5_016_1", ja: "目が痛いです。", kana: "めがいたいです。", romaji: "Me ga itai desu.", en: "My eye hurts.", ta: "என் கண் வலிக்கிறது." }
    ],
    mnemonic: "An eyeball with iris and pupil turned vertically.",
    difficulty: 1,
    source: "KANJIDIC2 / MEXT Grade 1",
    reviewStatus: "published",
    createdDate: "2026-11-04T00:00:00Z"
  },
  {
    id: "kj_n5_017",
    character: "耳",
    jlptLevel: "N5",
    levelMetadata: {
      level: "N5",
      isEstimated: true,
      sourceReference: "MEXT Kyōiku Kanji Grade 1 / EDRDG KANJIDIC2",
      officialDisclaimer: "JLPT does not publish official fixed kanji lists.",
    },
    meaningEn: "ear",
    meaningTa: "காது",
    onyomi: ["ジ"],
    kunyomi: ["みみ"],
    romajiOn: ["ji"],
    romajiKun: ["mimi"],
    strokeCount: 6,
    radical: { character: "耳", nameJa: "みみ", nameEn: "ear", strokes: 6, number: 128 },
    grade: 1,
    frequencyRank: 955,
    compounds: [
      { word: "耳", reading: "みみ", romaji: "mimi", meaningEn: "ear", meaningTa: "காது", jlptLevel: "N5" }
    ],
    examples: [
      { id: "ex_kj_n5_017_1", ja: "耳を澄ましてください。", kana: "みみをすましてください。", romaji: "Mimi o sumashite kudasai.", en: "Please listen closely.", ta: "தயவுசெய்து உற்றுக் கேளுங்கள்." }
    ],
    mnemonic: "An anatomical drawing of an outer ear and earlobe.",
    difficulty: 1,
    source: "KANJIDIC2 / MEXT Grade 1",
    reviewStatus: "published",
    createdDate: "2026-11-04T00:00:00Z"
  },
  {
    id: "kj_n5_018",
    character: "手",
    jlptLevel: "N5",
    levelMetadata: {
      level: "N5",
      isEstimated: true,
      sourceReference: "MEXT Kyōiku Kanji Grade 1 / EDRDG KANJIDIC2",
      officialDisclaimer: "JLPT does not publish official fixed kanji lists.",
    },
    meaningEn: "hand",
    meaningTa: "கை",
    onyomi: ["シュ", "ズ"],
    kunyomi: ["て", "た-"],
    romajiOn: ["shu", "zu"],
    romajiKun: ["te", "ta-"],
    strokeCount: 4,
    radical: { character: "手", nameJa: "て", nameEn: "hand", strokes: 4, number: 64 },
    grade: 1,
    frequencyRank: 60,
    compounds: [
      { word: "手紙", reading: "てがみ", romaji: "tegami", meaningEn: "letter", meaningTa: "கடிதம்", jlptLevel: "N5" },
      { word: "歌手", reading: "かしゅ", romaji: "kashu", meaningEn: "singer", meaningTa: "பாடகர்", jlptLevel: "N5" }
    ],
    examples: [
      { id: "ex_kj_n5_018_1", ja: "手を洗います。", kana: "てをあらいます。", romaji: "Te o araimasu.", en: "I wash my hands.", ta: "நான் கைகளைக் கழுவுகிறேன்." }
    ],
    mnemonic: "Five fingers spreading out from an open hand and wrist.",
    difficulty: 1,
    source: "KANJIDIC2 / MEXT Grade 1",
    reviewStatus: "published",
    createdDate: "2026-11-04T00:00:00Z"
  },
  {
    id: "kj_n5_019",
    character: "足",
    jlptLevel: "N5",
    levelMetadata: {
      level: "N5",
      isEstimated: true,
      sourceReference: "MEXT Kyōiku Kanji Grade 1 / EDRDG KANJIDIC2",
      officialDisclaimer: "JLPT does not publish official fixed kanji lists.",
    },
    meaningEn: "leg; foot; to be sufficient",
    meaningTa: "கால் / போதுமானது",
    onyomi: ["ソク"],
    kunyomi: ["あし", "たりる", "たす"],
    romajiOn: ["soku"],
    romajiKun: ["ashi", "tariru", "tasu"],
    strokeCount: 7,
    radical: { character: "足", nameJa: "あし", nameEn: "foot, leg", strokes: 7, number: 157 },
    grade: 1,
    frequencyRank: 354,
    compounds: [
      { word: "足音", reading: "あしおと", romaji: "ashioto", meaningEn: "footsteps", meaningTa: "காலடி சத்தம்", jlptLevel: "N5" },
      { word: "足りる", reading: "たりる", romaji: "tariru", meaningEn: "to be sufficient", meaningTa: "போதுமானதாக இருத்தல்", jlptLevel: "N5" }
    ],
    examples: [
      { id: "ex_kj_n5_019_1", ja: "足が速いですね。", kana: "あしがはやいですね。", romaji: "Ashi ga hayai desu ne.", en: "You run fast, don't you?", ta: "நீங்கள் வேகமாக ஓடுகிறீர்கள்." }
    ],
    mnemonic: "A knee, calf, and foot planted firmly on the ground.",
    difficulty: 1,
    source: "KANJIDIC2 / MEXT Grade 1",
    reviewStatus: "published",
    createdDate: "2026-11-04T00:00:00Z"
  },
  {
    id: "kj_n5_020",
    character: "力",
    jlptLevel: "N5",
    levelMetadata: {
      level: "N5",
      isEstimated: true,
      sourceReference: "MEXT Kyōiku Kanji Grade 1 / EDRDG KANJIDIC2",
      officialDisclaimer: "JLPT does not publish official fixed kanji lists.",
    },
    meaningEn: "power; strength",
    meaningTa: "வலிமை / ஆற்றல்",
    onyomi: ["リョク", "リキ"],
    kunyomi: ["ちから"],
    romajiOn: ["ryoku", "riki"],
    romajiKun: ["chikara"],
    strokeCount: 2,
    radical: { character: "力", nameJa: "ちから", nameEn: "power, force", strokes: 2, number: 19 },
    grade: 1,
    frequencyRank: 62,
    compounds: [
      { word: "電力", reading: "でんりょく", romaji: "denryoku", meaningEn: "electric power", meaningTa: "மின் ஆற்றல்", jlptLevel: "N5" },
      { word: "力持ち", reading: "ちからもち", romaji: "chikaramochi", meaningEn: "strong person", meaningTa: "பலம் வாய்ந்தவர்", jlptLevel: "N5" }
    ],
    examples: [
      { id: "ex_kj_n5_020_1", ja: "力を合わせましょう。", kana: "ちからをあわせましょう。", romaji: "Chikara o awasemashou.", en: "Let's join our forces together.", ta: "நாம் இணைந்து செயல்படுவோம்." }
    ],
    mnemonic: "A flexed arm demonstrating muscular force.",
    difficulty: 1,
    source: "KANJIDIC2 / MEXT Grade 1",
    reviewStatus: "published",
    createdDate: "2026-11-04T00:00:00Z"
  }
];

