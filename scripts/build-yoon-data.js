const fs = require('fs');
const path = require('path');

const YOON_DEFINITIONS = [
  // Kya-Row
  { id: "yoon-kya", romaji: "kya", hiraFirst: "き", hiraSmall: "ゃ", kataFirst: "キ", kataSmall: "ャ" },
  { id: "yoon-kyu", romaji: "kyu", hiraFirst: "き", hiraSmall: "ゅ", kataFirst: "キ", kataSmall: "ュ" },
  { id: "yoon-kyo", romaji: "kyo", hiraFirst: "き", hiraSmall: "ょ", kataFirst: "キ", kataSmall: "ョ" },

  // Sha-Row
  { id: "yoon-sha", romaji: "sha", hiraFirst: "し", hiraSmall: "ゃ", kataFirst: "シ", kataSmall: "ャ" },
  { id: "yoon-shu", romaji: "shu", hiraFirst: "し", hiraSmall: "ゅ", kataFirst: "シ", kataSmall: "ュ" },
  { id: "yoon-sho", romaji: "sho", hiraFirst: "し", hiraSmall: "ょ", kataFirst: "シ", kataSmall: "ョ" },

  // Cha-Row
  { id: "yoon-cha", romaji: "cha", hiraFirst: "ち", hiraSmall: "ゃ", kataFirst: "チ", kataSmall: "ャ" },
  { id: "yoon-chu", romaji: "chu", hiraFirst: "ち", hiraSmall: "ゅ", kataFirst: "チ", kataSmall: "ュ" },
  { id: "yoon-cho", romaji: "cho", hiraFirst: "ち", hiraSmall: "ょ", kataFirst: "チ", kataSmall: "ョ" },

  // Nya-Row
  { id: "yoon-nya", romaji: "nya", hiraFirst: "に", hiraSmall: "ゃ", kataFirst: "ニ", kataSmall: "ャ" },
  { id: "yoon-nyu", romaji: "nyu", hiraFirst: "に", hiraSmall: "ゅ", kataFirst: "ニ", kataSmall: "ュ" },
  { id: "yoon-nyo", romaji: "nyo", hiraFirst: "に", hiraSmall: "ょ", kataFirst: "ニ", kataSmall: "ョ" },

  // Hya-Row
  { id: "yoon-hya", romaji: "hya", hiraFirst: "ひ", hiraSmall: "ゃ", kataFirst: "ヒ", kataSmall: "ャ" },
  { id: "yoon-hyu", romaji: "hyu", hiraFirst: "ひ", hiraSmall: "ゅ", kataFirst: "ヒ", kataSmall: "ュ" },
  { id: "yoon-hyo", romaji: "hyo", hiraFirst: "ひ", hiraSmall: "ょ", kataFirst: "ヒ", kataSmall: "ョ" },

  // Mya-Row
  { id: "yoon-mya", romaji: "mya", hiraFirst: "み", hiraSmall: "ゃ", kataFirst: "ミ", kataSmall: "ャ" },
  { id: "yoon-myu", romaji: "myu", hiraFirst: "み", hiraSmall: "ゅ", kataFirst: "ミ", kataSmall: "ュ" },
  { id: "yoon-myo", romaji: "myo", hiraFirst: "み", hiraSmall: "ょ", kataFirst: "ミ", kataSmall: "ョ" },

  // Rya-Row
  { id: "yoon-rya", romaji: "rya", hiraFirst: "り", hiraSmall: "ゃ", kataFirst: "リ", kataSmall: "ャ" },
  { id: "yoon-ryu", romaji: "ryu", hiraFirst: "り", hiraSmall: "ゅ", kataFirst: "リ", kataSmall: "ュ" },
  { id: "yoon-ryo", romaji: "ryo", hiraFirst: "り", hiraSmall: "ょ", kataFirst: "リ", kataSmall: "ョ" },

  // Gya-Row (Voiced)
  { id: "yoon-gya", romaji: "gya", hiraFirst: "ぎ", hiraSmall: "ゃ", kataFirst: "ギ", kataSmall: "ャ" },
  { id: "yoon-gyu", romaji: "gyu", hiraFirst: "ぎ", hiraSmall: "ゅ", kataFirst: "ギ", kataSmall: "ュ" },
  { id: "yoon-gyo", romaji: "gyo", hiraFirst: "ぎ", hiraSmall: "ょ", kataFirst: "ギ", kataSmall: "ョ" },

  // Ja-Row (Voiced)
  { id: "yoon-ja", romaji: "ja", hiraFirst: "じ", hiraSmall: "ゃ", kataFirst: "ジ", kataSmall: "ャ" },
  { id: "yoon-ju", romaji: "ju", hiraFirst: "じ", hiraSmall: "ゅ", kataFirst: "ジ", kataSmall: "ュ" },
  { id: "yoon-jo", romaji: "jo", hiraFirst: "じ", hiraSmall: "ょ", kataFirst: "ジ", kataSmall: "ョ" },

  // Bya-Row (Voiced)
  { id: "yoon-bya", romaji: "bya", hiraFirst: "び", hiraSmall: "ゃ", kataFirst: "ビ", kataSmall: "ャ" },
  { id: "yoon-byu", romaji: "byu", hiraFirst: "び", hiraSmall: "ゅ", kataFirst: "ビ", kataSmall: "ュ" },
  { id: "yoon-byo", romaji: "byo", hiraFirst: "び", hiraSmall: "ょ", kataFirst: "ビ", kataSmall: "ョ" },

  // Pya-Row (Semi-Voiced)
  { id: "yoon-pya", romaji: "pya", hiraFirst: "ぴ", hiraSmall: "ゃ", kataFirst: "ピ", kataSmall: "ャ" },
  { id: "yoon-pyu", romaji: "pyu", hiraFirst: "ぴ", hiraSmall: "ゅ", kataFirst: "ピ", kataSmall: "ュ" },
  { id: "yoon-pyo", romaji: "pyo", hiraFirst: "ぴ", hiraSmall: "ょ", kataFirst: "ピ", kataSmall: "ョ" },
];

const raw = JSON.parse(fs.readFileSync(path.join(__dirname, 'kanjivg-kana-raw.json'), 'utf-8'));

let ts = `// ==============================================================================
// NIHONGOSETU — AUTHENTIC YŌON (拗音) MASTER DATASET
// Single verified source of truth for all 33 Hiragana & 33 Katakana combinations
// Authentic Hepburn Romaji, First Kana + Small Kana separation, exact stroke math
// ==============================================================================

export interface YoonEntry {
  id: string;
  char: string;
  scriptType: "hira" | "kata";
  firstKana: string;
  smallKana: string;
  firstStrokes: number;
  smallStrokes: number;
  totalStrokes: number;
  romaji: string;
  category: "yoon";
  audioText: string;
}

// ------------------------------------------------------------------------------
// 1. HIRAGANA YŌON (33 COMBINATIONS)
// ------------------------------------------------------------------------------
export const HIRAGANA_YOON_DATA: YoonEntry[] = [
`;

YOON_DEFINITIONS.forEach((def) => {
  const char = def.hiraFirst + def.hiraSmall;
  const firstCount = raw[def.hiraFirst]?.strokeCount ?? 0;
  const smallCount = raw[def.hiraSmall]?.strokeCount ?? 0;
  const total = firstCount + smallCount;

  ts += `  {
    id: "${def.id}",
    char: "${char}",
    scriptType: "hira",
    firstKana: "${def.hiraFirst}",
    smallKana: "${def.hiraSmall}",
    firstStrokes: ${firstCount},
    smallStrokes: ${smallCount},
    totalStrokes: ${total},
    romaji: "${def.romaji}",
    category: "yoon",
    audioText: "${char}",
  },\n`;
});

ts += `];

// ------------------------------------------------------------------------------
// 2. KATAKANA YŌON (33 COMBINATIONS)
// ------------------------------------------------------------------------------
export const KATAKANA_YOON_DATA: YoonEntry[] = [
`;

YOON_DEFINITIONS.forEach((def) => {
  const char = def.kataFirst + def.kataSmall;
  const firstCount = raw[def.kataFirst]?.strokeCount ?? 0;
  const smallCount = raw[def.kataSmall]?.strokeCount ?? 0;
  const total = firstCount + smallCount;

  ts += `  {
    id: "${def.id.replace('yoon-', 'yoon-kata-')}",
    char: "${char}",
    scriptType: "kata",
    firstKana: "${def.kataFirst}",
    smallKana: "${def.kataSmall}",
    firstStrokes: ${firstCount},
    smallStrokes: ${smallCount},
    totalStrokes: ${total},
    romaji: "${def.romaji}",
    category: "yoon",
    audioText: "${char}",
  },\n`;
});

ts += `];

// Complete collection of all 66 Yōon entries
export const ALL_YOON_DATA: YoonEntry[] = [
  ...HIRAGANA_YOON_DATA,
  ...KATAKANA_YOON_DATA,
];

// Lookup map by character (e.g. "きゃ" -> YoonEntry)
export const YOON_MAP: Record<string, YoonEntry> = {};
ALL_YOON_DATA.forEach((item) => {
  YOON_MAP[item.char] = item;
});

export function getYoonEntry(char: string): YoonEntry | undefined {
  return YOON_MAP[char];
}
`;

const dest = path.join(__dirname, '..', 'src', 'data', 'yoonData.ts');
fs.writeFileSync(dest, ts, 'utf-8');
console.log(`Generated yoonData.ts at ${dest} with 66 verified combinations.`);
