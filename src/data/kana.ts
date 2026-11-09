// ==============================================================================
// NIHONGOSETU — JAPANESE KANA (HIRAGANA & KATAKANA) MASTER DATASET
// Standard Gojuon Ordering, Dakuten/Handakuten, Yoon, & Small Kana
// ==============================================================================

export type KanaCategory = "basic" | "dakuon" | "yoon" | "small";

export interface KanaItem {
  id: string;
  hira: string;
  kata: string;
  romaji: string;
  category: KanaCategory;
  row?: string; // e.g. "a", "ka", "sa", "ta", "na", "ha", "ma", "ya", "ra", "wa"
  col?: number; // 0: a, 1: i, 2: u, 3: e, 4: o
  strokes: {
    hira: number;
    kata: number;
  };
  audioText?: string;
  mnemonic?: {
    en?: string;
    ta?: string;
  };
}

// ------------------------------------------------------------------------------
// 1. BASIC KANA (GOJUON — 46 CHARACTERS)
// Arranged strictly in Japanese Gojuon order:
// A, Ka, Sa, Ta, Na, Ha, Ma, Ya, Ra, Wa, N
// ------------------------------------------------------------------------------
export const BASIC_KANA: KanaItem[] = [
  // A-Row
  { id: "kana-a", hira: "あ", kata: "ア", romaji: "a", category: "basic", row: "a", col: 0, strokes: { hira: 3, kata: 2 } },
  { id: "kana-i", hira: "い", kata: "イ", romaji: "i", category: "basic", row: "a", col: 1, strokes: { hira: 2, kata: 2 } },
  { id: "kana-u", hira: "う", kata: "ウ", romaji: "u", category: "basic", row: "a", col: 2, strokes: { hira: 2, kata: 3 } },
  { id: "kana-e", hira: "え", kata: "エ", romaji: "e", category: "basic", row: "a", col: 3, strokes: { hira: 2, kata: 3 } },
  { id: "kana-o", hira: "お", kata: "オ", romaji: "o", category: "basic", row: "a", col: 4, strokes: { hira: 3, kata: 3 } },

  // Ka-Row
  { id: "kana-ka", hira: "か", kata: "カ", romaji: "ka", category: "basic", row: "ka", col: 0, strokes: { hira: 3, kata: 2 } },
  { id: "kana-ki", hira: "き", kata: "キ", romaji: "ki", category: "basic", row: "ka", col: 1, strokes: { hira: 3, kata: 3 } },
  { id: "kana-ku", hira: "く", kata: "ク", romaji: "ku", category: "basic", row: "ka", col: 2, strokes: { hira: 1, kata: 2 } },
  { id: "kana-ke", hira: "け", kata: "ケ", romaji: "ke", category: "basic", row: "ka", col: 3, strokes: { hira: 3, kata: 3 } },
  { id: "kana-ko", hira: "こ", kata: "コ", romaji: "ko", category: "basic", row: "ka", col: 4, strokes: { hira: 2, kata: 2 } },

  // Sa-Row
  { id: "kana-sa", hira: "さ", kata: "サ", romaji: "sa", category: "basic", row: "sa", col: 0, strokes: { hira: 3, kata: 3 } },
  { id: "kana-shi", hira: "し", kata: "シ", romaji: "shi", category: "basic", row: "sa", col: 1, strokes: { hira: 1, kata: 3 } },
  { id: "kana-su", hira: "す", kata: "ス", romaji: "su", category: "basic", row: "sa", col: 2, strokes: { hira: 2, kata: 2 } },
  { id: "kana-se", hira: "せ", kata: "セ", romaji: "se", category: "basic", row: "sa", col: 3, strokes: { hira: 3, kata: 2 } },
  { id: "kana-so", hira: "そ", kata: "ソ", romaji: "so", category: "basic", row: "sa", col: 4, strokes: { hira: 1, kata: 2 } },

  // Ta-Row
  { id: "kana-ta", hira: "た", kata: "タ", romaji: "ta", category: "basic", row: "ta", col: 0, strokes: { hira: 4, kata: 3 } },
  { id: "kana-chi", hira: "ち", kata: "チ", romaji: "chi", category: "basic", row: "ta", col: 1, strokes: { hira: 2, kata: 3 } },
  { id: "kana-tsu", hira: "つ", kata: "ツ", romaji: "tsu", category: "basic", row: "ta", col: 2, strokes: { hira: 1, kata: 3 } },
  { id: "kana-te", hira: "て", kata: "テ", romaji: "te", category: "basic", row: "ta", col: 3, strokes: { hira: 1, kata: 3 } },
  { id: "kana-to", hira: "と", kata: "ト", romaji: "to", category: "basic", row: "ta", col: 4, strokes: { hira: 2, kata: 2 } },

  // Na-Row
  { id: "kana-na", hira: "な", kata: "ナ", romaji: "na", category: "basic", row: "na", col: 0, strokes: { hira: 4, kata: 2 } },
  { id: "kana-ni", hira: "に", kata: "ニ", romaji: "ni", category: "basic", row: "na", col: 1, strokes: { hira: 3, kata: 2 } },
  { id: "kana-nu", hira: "ぬ", kata: "ヌ", romaji: "nu", category: "basic", row: "na", col: 2, strokes: { hira: 2, kata: 2 } },
  { id: "kana-ne", hira: "ね", kata: "ネ", romaji: "ne", category: "basic", row: "na", col: 3, strokes: { hira: 2, kata: 4 } },
  { id: "kana-no", hira: "の", kata: "ノ", romaji: "no", category: "basic", row: "na", col: 4, strokes: { hira: 1, kata: 1 } },

  // Ha-Row
  { id: "kana-ha", hira: "は", kata: "ハ", romaji: "ha", category: "basic", row: "ha", col: 0, strokes: { hira: 3, kata: 2 } },
  { id: "kana-hi", hira: "ひ", kata: "ヒ", romaji: "hi", category: "basic", row: "ha", col: 1, strokes: { hira: 1, kata: 2 } },
  { id: "kana-fu", hira: "ふ", kata: "フ", romaji: "fu", category: "basic", row: "ha", col: 2, strokes: { hira: 4, kata: 1 } },
  { id: "kana-he", hira: "へ", kata: "ヘ", romaji: "he", category: "basic", row: "ha", col: 3, strokes: { hira: 1, kata: 1 } },
  { id: "kana-ho", hira: "ほ", kata: "ホ", romaji: "ho", category: "basic", row: "ha", col: 4, strokes: { hira: 4, kata: 4 } },

  // Ma-Row
  { id: "kana-ma", hira: "ま", kata: "マ", romaji: "ma", category: "basic", row: "ma", col: 0, strokes: { hira: 3, kata: 2 } },
  { id: "kana-mi", hira: "み", kata: "ミ", romaji: "mi", category: "basic", row: "ma", col: 1, strokes: { hira: 2, kata: 3 } },
  { id: "kana-mu", hira: "む", kata: "ム", romaji: "mu", category: "basic", row: "ma", col: 2, strokes: { hira: 3, kata: 2 } },
  { id: "kana-me", hira: "め", kata: "メ", romaji: "me", category: "basic", row: "ma", col: 3, strokes: { hira: 2, kata: 2 } },
  { id: "kana-mo", hira: "も", kata: "モ", romaji: "mo", category: "basic", row: "ma", col: 4, strokes: { hira: 3, kata: 3 } },

  // Ya-Row (3 characters)
  { id: "kana-ya", hira: "や", kata: "ヤ", romaji: "ya", category: "basic", row: "ya", col: 0, strokes: { hira: 3, kata: 2 } },
  { id: "kana-yu", hira: "ゆ", kata: "ユ", romaji: "yu", category: "basic", row: "ya", col: 2, strokes: { hira: 2, kata: 2 } },
  { id: "kana-yo", hira: "よ", kata: "ヨ", romaji: "yo", category: "basic", row: "ya", col: 4, strokes: { hira: 2, kata: 3 } },

  // Ra-Row
  { id: "kana-ra", hira: "ら", kata: "ラ", romaji: "ra", category: "basic", row: "ra", col: 0, strokes: { hira: 2, kata: 2 } },
  { id: "kana-ri", hira: "り", kata: "リ", romaji: "ri", category: "basic", row: "ra", col: 1, strokes: { hira: 2, kata: 2 } },
  { id: "kana-ru", hira: "る", kata: "ル", romaji: "ru", category: "basic", row: "ra", col: 2, strokes: { hira: 1, kata: 2 } },
  { id: "kana-re", hira: "れ", kata: "レ", romaji: "re", category: "basic", row: "ra", col: 3, strokes: { hira: 2, kata: 1 } },
  { id: "kana-ro", hira: "ろ", kata: "ロ", romaji: "ro", category: "basic", row: "ra", col: 4, strokes: { hira: 1, kata: 3 } },

  // Wa-Row & N (3 characters)
  { id: "kana-wa", hira: "わ", kata: "ワ", romaji: "wa", category: "basic", row: "wa", col: 0, strokes: { hira: 2, kata: 2 } },
  { id: "kana-wo", hira: "を", kata: "ヲ", romaji: "wo", category: "basic", row: "wa", col: 4, strokes: { hira: 3, kata: 3 } },
  { id: "kana-n", hira: "ん", kata: "ン", romaji: "n", category: "basic", row: "wa", col: 2, strokes: { hira: 1, kata: 2 } },
];

// ------------------------------------------------------------------------------
// 2. DAKUTEN & HANDAKUTEN (濁音・半濁音 — 25 CHARACTERS)
// ------------------------------------------------------------------------------
export const DAKUON_KANA: KanaItem[] = [
  // Ga-Row (が ぎ ぐ げ ご)
  { id: "kana-ga", hira: "が", kata: "ガ", romaji: "ga", category: "dakuon", row: "ga", col: 0, strokes: { hira: 5, kata: 4 } },
  { id: "kana-gi", hira: "ぎ", kata: "ギ", romaji: "gi", category: "dakuon", row: "ga", col: 1, strokes: { hira: 5, kata: 5 } },
  { id: "kana-gu", hira: "ぐ", kata: "グ", romaji: "gu", category: "dakuon", row: "ga", col: 2, strokes: { hira: 3, kata: 4 } },
  { id: "kana-ge", hira: "げ", kata: "ゲ", romaji: "ge", category: "dakuon", row: "ga", col: 3, strokes: { hira: 5, kata: 5 } },
  { id: "kana-go", hira: "ご", kata: "ゴ", romaji: "go", category: "dakuon", row: "ga", col: 4, strokes: { hira: 4, kata: 4 } },

  // Za-Row (ざ じ ず ぜ ぞ)
  { id: "kana-za", hira: "ざ", kata: "ザ", romaji: "za", category: "dakuon", row: "za", col: 0, strokes: { hira: 5, kata: 5 } },
  { id: "kana-ji", hira: "じ", kata: "ジ", romaji: "ji", category: "dakuon", row: "za", col: 1, strokes: { hira: 3, kata: 5 } },
  { id: "kana-zu", hira: "ず", kata: "ズ", romaji: "zu", category: "dakuon", row: "za", col: 2, strokes: { hira: 4, kata: 4 } },
  { id: "kana-ze", hira: "ぜ", kata: "ゼ", romaji: "ze", category: "dakuon", row: "za", col: 3, strokes: { hira: 5, kata: 4 } },
  { id: "kana-zo", hira: "ぞ", kata: "ゾ", romaji: "zo", category: "dakuon", row: "za", col: 4, strokes: { hira: 3, kata: 4 } },

  // Da-Row (だ ぢ づ で ど)
  { id: "kana-da", hira: "だ", kata: "ダ", romaji: "da", category: "dakuon", row: "da", col: 0, strokes: { hira: 6, kata: 5 } },
  { id: "kana-dji", hira: "ぢ", kata: "ヂ", romaji: "ji", category: "dakuon", row: "da", col: 1, strokes: { hira: 4, kata: 5 } },
  { id: "kana-dzu", hira: "づ", kata: "ヅ", romaji: "zu", category: "dakuon", row: "da", col: 2, strokes: { hira: 3, kata: 5 } },
  { id: "kana-de", hira: "で", kata: "デ", romaji: "de", category: "dakuon", row: "da", col: 3, strokes: { hira: 3, kata: 5 } },
  { id: "kana-do", hira: "ど", kata: "ド", romaji: "do", category: "dakuon", row: "da", col: 4, strokes: { hira: 4, kata: 4 } },

  // Ba-Row (ば び ぶ べ ぼ)
  { id: "kana-ba", hira: "ば", kata: "バ", romaji: "ba", category: "dakuon", row: "ba", col: 0, strokes: { hira: 5, kata: 4 } },
  { id: "kana-bi", hira: "び", kata: "ビ", romaji: "bi", category: "dakuon", row: "ba", col: 1, strokes: { hira: 3, kata: 4 } },
  { id: "kana-bu", hira: "ぶ", kata: "ブ", romaji: "bu", category: "dakuon", row: "ba", col: 2, strokes: { hira: 6, kata: 3 } },
  { id: "kana-be", hira: "べ", kata: "ベ", romaji: "be", category: "dakuon", row: "ba", col: 3, strokes: { hira: 3, kata: 3 } },
  { id: "kana-bo", hira: "ぼ", kata: "ボ", romaji: "bo", category: "dakuon", row: "ba", col: 4, strokes: { hira: 6, kata: 6 } },

  // Pa-Row Handakuten (ぱ ぴ ぷ ぺ ぽ)
  { id: "kana-pa", hira: "ぱ", kata: "パ", romaji: "pa", category: "dakuon", row: "pa", col: 0, strokes: { hira: 4, kata: 3 } },
  { id: "kana-pi", hira: "ぴ", kata: "ピ", romaji: "pi", category: "dakuon", row: "pa", col: 1, strokes: { hira: 2, kata: 3 } },
  { id: "kana-pu", hira: "ぷ", kata: "プ", romaji: "pu", category: "dakuon", row: "pa", col: 2, strokes: { hira: 5, kata: 2 } },
  { id: "kana-pe", hira: "ぺ", kata: "ペ", romaji: "pe", category: "dakuon", row: "pa", col: 3, strokes: { hira: 2, kata: 2 } },
  { id: "kana-po", hira: "ぽ", kata: "ポ", romaji: "po", category: "dakuon", row: "pa", col: 4, strokes: { hira: 5, kata: 5 } },
];

// ------------------------------------------------------------------------------
// 3. YOON / CONTRACTED SOUNDS (拗音 — 33 COMBINATIONS)
// Standard combinations: Kya..Ryo (21) + Gya, Ja, Bya, Pya (12)
// ------------------------------------------------------------------------------
export const YOON_KANA: KanaItem[] = [
  // Kya-Row
  { id: "yoon-kya", hira: "きゃ", kata: "キャ", romaji: "kya", category: "yoon", strokes: { hira: 6, kata: 5 } },
  { id: "yoon-kyu", hira: "きゅ", kata: "キュ", romaji: "kyu", category: "yoon", strokes: { hira: 5, kata: 5 } },
  { id: "yoon-kyo", hira: "きょ", kata: "キョ", romaji: "kyo", category: "yoon", strokes: { hira: 5, kata: 6 } },

  // Sha-Row
  { id: "yoon-sha", hira: "しゃ", kata: "シャ", romaji: "sha", category: "yoon", strokes: { hira: 4, kata: 5 } },
  { id: "yoon-shu", hira: "しゅ", kata: "シュ", romaji: "shu", category: "yoon", strokes: { hira: 3, kata: 5 } },
  { id: "yoon-sho", hira: "しょ", kata: "ショ", romaji: "sho", category: "yoon", strokes: { hira: 3, kata: 6 } },

  // Cha-Row
  { id: "yoon-cha", hira: "ちゃ", kata: "チャ", romaji: "cha", category: "yoon", strokes: { hira: 5, kata: 5 } },
  { id: "yoon-chu", hira: "ちゅ", kata: "チュ", romaji: "chu", category: "yoon", strokes: { hira: 4, kata: 5 } },
  { id: "yoon-cho", hira: "ちょ", kata: "チョ", romaji: "cho", category: "yoon", strokes: { hira: 4, kata: 6 } },

  // Nya-Row
  { id: "yoon-nya", hira: "にゃ", kata: "ニャ", romaji: "nya", category: "yoon", strokes: { hira: 6, kata: 4 } },
  { id: "yoon-nyu", hira: "にゅ", kata: "ニュ", romaji: "nyu", category: "yoon", strokes: { hira: 5, kata: 4 } },
  { id: "yoon-nyo", hira: "にょ", kata: "ニョ", romaji: "nyo", category: "yoon", strokes: { hira: 5, kata: 5 } },

  // Hya-Row
  { id: "yoon-hya", hira: "ひゃ", kata: "ヒャ", romaji: "hya", category: "yoon", strokes: { hira: 4, kata: 4 } },
  { id: "yoon-hyu", hira: "ひゅ", kata: "ヒュ", romaji: "hyu", category: "yoon", strokes: { hira: 3, kata: 4 } },
  { id: "yoon-hyo", hira: "ひょ", kata: "ヒョ", romaji: "hyo", category: "yoon", strokes: { hira: 3, kata: 5 } },

  // Mya-Row
  { id: "yoon-mya", hira: "みゃ", kata: "ミャ", romaji: "mya", category: "yoon", strokes: { hira: 5, kata: 5 } },
  { id: "yoon-myu", hira: "みゅ", kata: "ミュ", romaji: "myu", category: "yoon", strokes: { hira: 4, kata: 5 } },
  { id: "yoon-myo", hira: "みょ", kata: "ミョ", romaji: "myo", category: "yoon", strokes: { hira: 4, kata: 6 } },

  // Rya-Row
  { id: "yoon-rya", hira: "りゃ", kata: "リャ", romaji: "rya", category: "yoon", strokes: { hira: 5, kata: 4 } },
  { id: "yoon-ryu", hira: "りゅ", kata: "リュ", romaji: "ryu", category: "yoon", strokes: { hira: 4, kata: 4 } },
  { id: "yoon-ryo", hira: "りょ", kata: "リョ", romaji: "ryo", category: "yoon", strokes: { hira: 4, kata: 5 } },

  // Gya-Row (Voiced)
  { id: "yoon-gya", hira: "ぎゃ", kata: "ギャ", romaji: "gya", category: "yoon", strokes: { hira: 8, kata: 7 } },
  { id: "yoon-gyu", hira: "ぎゅ", kata: "ギュ", romaji: "gyu", category: "yoon", strokes: { hira: 7, kata: 7 } },
  { id: "yoon-gyo", hira: "ぎょ", kata: "ギョ", romaji: "gyo", category: "yoon", strokes: { hira: 7, kata: 8 } },

  // Ja-Row (Voiced)
  { id: "yoon-ja", hira: "じゃ", kata: "ジャ", romaji: "ja", category: "yoon", strokes: { hira: 6, kata: 7 } },
  { id: "yoon-ju", hira: "じゅ", kata: "ジュ", romaji: "ju", category: "yoon", strokes: { hira: 5, kata: 7 } },
  { id: "yoon-jo", hira: "じょ", kata: "ジョ", romaji: "jo", category: "yoon", strokes: { hira: 5, kata: 8 } },

  // Bya-Row (Voiced)
  { id: "yoon-bya", hira: "びゃ", kata: "ビャ", romaji: "bya", category: "yoon", strokes: { hira: 6, kata: 6 } },
  { id: "yoon-byu", hira: "びゅ", kata: "ビュ", romaji: "byu", category: "yoon", strokes: { hira: 5, kata: 6 } },
  { id: "yoon-byo", hira: "びょ", kata: "ビョ", romaji: "byo", category: "yoon", strokes: { hira: 5, kata: 7 } },

  // Pya-Row (Semi-Voiced)
  { id: "yoon-pya", hira: "ぴゃ", kata: "ピャ", romaji: "pya", category: "yoon", strokes: { hira: 5, kata: 5 } },
  { id: "yoon-pyu", hira: "ぴゅ", kata: "ピュ", romaji: "pyu", category: "yoon", strokes: { hira: 4, kata: 5 } },
  { id: "yoon-pyo", hira: "ぴょ", kata: "ピョ", romaji: "pyo", category: "yoon", strokes: { hira: 4, kata: 6 } },
];

// ------------------------------------------------------------------------------
// 4. SMALL KANA (小さいかな — 12 CHARACTERS)
// ------------------------------------------------------------------------------
export const SMALL_KANA: KanaItem[] = [
  { id: "small-a", hira: "ぁ", kata: "ァ", romaji: "(a)", category: "small", strokes: { hira: 3, kata: 2 } },
  { id: "small-i", hira: "ぃ", kata: "ィ", romaji: "(i)", category: "small", strokes: { hira: 2, kata: 2 } },
  { id: "small-u", hira: "ぅ", kata: "ゥ", romaji: "(u)", category: "small", strokes: { hira: 2, kata: 3 } },
  { id: "small-e", hira: "ぇ", kata: "ェ", romaji: "(e)", category: "small", strokes: { hira: 2, kata: 3 } },
  { id: "small-o", hira: "ぉ", kata: "ォ", romaji: "(o)", category: "small", strokes: { hira: 3, kata: 3 } },
  { id: "small-ya", hira: "ゃ", kata: "ャ", romaji: "(ya)", category: "small", strokes: { hira: 3, kata: 2 } },
  { id: "small-yu", hira: "ゅ", kata: "ュ", romaji: "(yu)", category: "small", strokes: { hira: 2, kata: 2 } },
  { id: "small-yo", hira: "ょ", kata: "ョ", romaji: "(yo)", category: "small", strokes: { hira: 2, kata: 3 } },
  { id: "small-tsu", hira: "っ", kata: "ッ", romaji: "(tsu / sokuon)", category: "small", strokes: { hira: 1, kata: 3 } },
  { id: "small-wa", hira: "ゎ", kata: "ヮ", romaji: "(wa)", category: "small", strokes: { hira: 2, kata: 2 } },
  { id: "small-ka", hira: "ゕ", kata: "ヵ", romaji: "(ka)", category: "small", strokes: { hira: 3, kata: 2 } },
  { id: "small-ke", hira: "ゖ", kata: "ヶ", romaji: "(ke)", category: "small", strokes: { hira: 3, kata: 3 } },
];

// Complete collection for lookup & validation
export const ALL_KANA: KanaItem[] = [
  ...BASIC_KANA,
  ...DAKUON_KANA,
  ...YOON_KANA,
  ...SMALL_KANA,
];

// Row definitions for Gojuon Table Rendering
export const GOJUON_ROWS = [
  { key: "a", labelJp: "あ段", labelRomaji: "A-row", chars: ["あ", "い", "う", "え", "お"] },
  { key: "ka", labelJp: "か段", labelRomaji: "Ka-row", chars: ["か", "き", "く", "け", "こ"] },
  { key: "sa", labelJp: "さ段", labelRomaji: "Sa-row", chars: ["さ", "し", "す", "せ", "そ"] },
  { key: "ta", labelJp: "た段", labelRomaji: "Ta-row", chars: ["た", "ち", "つ", "て", "と"] },
  { key: "na", labelJp: "な段", labelRomaji: "Na-row", chars: ["な", "に", "ぬ", "ね", "の"] },
  { key: "ha", labelJp: "は段", labelRomaji: "Ha-row", chars: ["は", "ひ", "ふ", "へ", "ほ"] },
  { key: "ma", labelJp: "ま段", labelRomaji: "Ma-row", chars: ["ま", "み", "む", "め", "も"] },
  { key: "ya", labelJp: "や段", labelRomaji: "Ya-row", chars: ["や", "", "ゆ", "", "よ"] },
  { key: "ra", labelJp: "ら段", labelRomaji: "Ra-row", chars: ["ら", "り", "る", "れ", "ろ"] },
  { key: "wa", labelJp: "わ段", labelRomaji: "Wa-row", chars: ["わ", "", "", "", "を"] },
  { key: "n", labelJp: "ん", labelRomaji: "N", chars: ["ん", "", "", "", ""] },
];
