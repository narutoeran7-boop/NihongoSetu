// ==============================================================================
// NIHONGOSETU — AUTHENTIC JAPANESE KANA STROKE ORDER & VECTOR ENGINE
// Authoritative MEXT Kyōiku Kanji / Kana standard handwriting sequences
// Correct stroke counts, start points, directions, curvatures & proportions
// ==============================================================================

export interface KanaStroke {
  index: number;
  d: string;
  startPoint: { x: number; y: number };
  directionHint?: "horizontal" | "vertical" | "down-right" | "down-left" | "up-right" | "loop" | "curve";
}

export interface KanaStrokeData {
  char: string;
  romaji: string;
  strokeCount: number;
  viewBox: string; // standard "0 0 100 100"
  strokes: KanaStroke[];
}

// ------------------------------------------------------------------------------
// 1. AUTHENTIC BASIC HIRAGANA STROKE DATA (46 Characters — 100x100 Coordinate Space)
// ------------------------------------------------------------------------------
export const HIRAGANA_STROKE_DATA: Record<string, KanaStroke[]> = {
  // あ (3 strokes: 1 top horizontal, 2 center vertical curving left, 3 authentic wide loop)
  "あ": [
    { index: 1, d: "M 22 32 C 40 30 60 30 78 32", startPoint: { x: 22, y: 32 }, directionHint: "horizontal" },
    { index: 2, d: "M 50 16 C 50 38 46 64 42 84", startPoint: { x: 50, y: 16 }, directionHint: "vertical" },
    { index: 3, d: "M 58 36 C 42 50 32 64 36 76 C 42 86 64 86 76 74 C 84 62 76 46 62 48 C 50 50 42 62 48 76 C 54 84 66 84 72 76", startPoint: { x: 58, y: 36 }, directionHint: "loop" },
  ],
  // い (2 strokes: 1 left vertical curve with hook, 2 right shorter downward curve)
  "い": [
    { index: 1, d: "M 30 26 C 26 48 26 68 36 76 C 39 74 43 68 45 60", startPoint: { x: 30, y: 26 }, directionHint: "vertical" },
    { index: 2, d: "M 70 32 C 73 46 71 58 65 68", startPoint: { x: 70, y: 32 }, directionHint: "curve" },
  ],
  // う (2 strokes: 1 short diagonal top accent, 2 curving arch down)
  "う": [
    { index: 1, d: "M 44 18 C 50 22 56 25 60 27", startPoint: { x: 44, y: 18 }, directionHint: "down-right" },
    { index: 2, d: "M 34 38 C 56 32 70 42 68 58 C 66 74 48 84 32 82", startPoint: { x: 34, y: 38 }, directionHint: "loop" },
  ],
  // え (2 strokes: 1 short top diagonal, 2 z-shape downward glide to wave)
  "え": [
    { index: 1, d: "M 45 18 C 51 22 56 25 60 27", startPoint: { x: 45, y: 18 }, directionHint: "down-right" },
    { index: 2, d: "M 30 42 L 68 39 L 32 78 C 54 62 72 70 78 78", startPoint: { x: 30, y: 42 }, directionHint: "curve" },
  ],
  // お (3 strokes: 1 top horizontal, 2 center-down loop, 3 upper-right accent dot)
  "お": [
    { index: 1, d: "M 24 34 C 46 32 62 32 74 34", startPoint: { x: 24, y: 34 }, directionHint: "horizontal" },
    { index: 2, d: "M 48 16 L 48 62 C 48 82 32 82 32 68 C 32 54 52 52 68 62 C 76 70 76 80 68 86", startPoint: { x: 48, y: 16 }, directionHint: "loop" },
    { index: 3, d: "M 74 24 C 77 28 80 32 81 37", startPoint: { x: 74, y: 24 }, directionHint: "down-right" },
  ],
  // か (3 strokes: 1 horizontal curve with hook, 2 diagonal slash through, 3 top-right droplet)
  "か": [
    { index: 1, d: "M 26 32 C 48 28 56 34 54 52 C 52 68 46 78 38 82 C 42 74 44 68 42 60", startPoint: { x: 26, y: 32 }, directionHint: "curve" },
    { index: 2, d: "M 44 16 C 40 44 32 64 22 78", startPoint: { x: 44, y: 16 }, directionHint: "vertical" },
    { index: 3, d: "M 68 26 C 73 32 77 38 78 44", startPoint: { x: 68, y: 26 }, directionHint: "down-right" },
  ],
  // き (4 strokes: 1 top horizontal, 2 mid horizontal, 3 diagonal slash with hook, 4 detached lower bowl)
  "き": [
    { index: 1, d: "M 32 30 C 48 28 58 28 68 30", startPoint: { x: 32, y: 30 }, directionHint: "horizontal" },
    { index: 2, d: "M 28 44 C 48 42 60 42 72 44", startPoint: { x: 28, y: 44 }, directionHint: "horizontal" },
    { index: 3, d: "M 56 16 L 38 62 C 34 58 30 54 28 52", startPoint: { x: 56, y: 16 }, directionHint: "down-right" },
    { index: 4, d: "M 34 68 C 52 82 68 76 68 62", startPoint: { x: 34, y: 68 }, directionHint: "curve" },
  ],
  // く (1 single stroke: diagonal down-left then down-right)
  "く": [
    { index: 1, d: "M 62 22 L 32 50 L 64 80", startPoint: { x: 62, y: 22 }, directionHint: "curve" },
  ],
  // け (3 strokes: 1 left vertical with hook, 2 top horizontal, 3 right vertical curving down)
  "け": [
    { index: 1, d: "M 30 22 C 30 46 28 68 24 78 C 28 72 32 68 34 66", startPoint: { x: 30, y: 22 }, directionHint: "vertical" },
    { index: 2, d: "M 44 36 C 56 34 68 34 76 36", startPoint: { x: 44, y: 36 }, directionHint: "horizontal" },
    { index: 3, d: "M 64 18 C 62 52 56 72 48 84", startPoint: { x: 64, y: 18 }, directionHint: "vertical" },
  ],
  // こ (2 strokes: 1 top horizontal with slight hook, 2 bottom curving horizontal)
  "こ": [
    { index: 1, d: "M 32 32 C 48 30 62 30 70 32 C 65 38 60 42 56 44", startPoint: { x: 32, y: 32 }, directionHint: "horizontal" },
    { index: 2, d: "M 30 68 C 48 72 64 70 72 64", startPoint: { x: 30, y: 68 }, directionHint: "horizontal" },
  ],
  // さ (3 strokes: 1 horizontal, 2 diagonal slash with hook, 3 detached curve)
  "さ": [
    { index: 1, d: "M 30 36 C 46 34 58 34 70 36", startPoint: { x: 30, y: 36 }, directionHint: "horizontal" },
    { index: 2, d: "M 56 18 L 38 60 C 34 56 30 52 28 50", startPoint: { x: 56, y: 18 }, directionHint: "down-right" },
    { index: 3, d: "M 34 66 C 52 82 70 76 68 62", startPoint: { x: 34, y: 66 }, directionHint: "curve" },
  ],
  // し (1 single stroke: vertical down then curving up to the right)
  "し": [
    { index: 1, d: "M 42 18 L 42 66 C 42 86 64 88 74 72", startPoint: { x: 42, y: 18 }, directionHint: "vertical" },
  ],
  // す (2 strokes: 1 horizontal, 2 vertical through loop and tail)
  "す": [
    { index: 1, d: "M 22 36 C 46 34 62 34 78 36", startPoint: { x: 22, y: 36 }, directionHint: "horizontal" },
    { index: 2, d: "M 52 16 L 52 46 C 52 62 36 62 36 50 C 36 38 60 38 54 60 L 46 86", startPoint: { x: 52, y: 16 }, directionHint: "loop" },
  ],
  // せ (3 strokes: 1 horizontal, 2 right vertical with hook, 3 left vertical-curving)
  "せ": [
    { index: 1, d: "M 26 38 C 48 36 64 36 76 38", startPoint: { x: 26, y: 38 }, directionHint: "horizontal" },
    { index: 2, d: "M 64 22 L 64 66 C 58 72 52 70 48 68", startPoint: { x: 64, y: 22 }, directionHint: "vertical" },
    { index: 3, d: "M 40 18 L 40 70 C 56 72 70 70 76 66", startPoint: { x: 40, y: 18 }, directionHint: "curve" },
  ],
  // そ (1 single continuous zig-zag stroke)
  "そ": [
    { index: 1, d: "M 32 26 L 64 26 L 36 48 L 62 46 C 46 62 34 76 66 82", startPoint: { x: 32, y: 26 }, directionHint: "curve" },
  ],
  // た (4 strokes: 1 top horizontal, 2 diagonal slash, 3 right upper horizontal, 4 right lower curve)
  "た": [
    { index: 1, d: "M 22 36 C 34 34 44 34 52 36", startPoint: { x: 22, y: 36 }, directionHint: "horizontal" },
    { index: 2, d: "M 38 20 C 34 46 28 66 22 76", startPoint: { x: 38, y: 20 }, directionHint: "vertical" },
    { index: 3, d: "M 54 42 C 62 40 70 40 76 42", startPoint: { x: 54, y: 42 }, directionHint: "horizontal" },
    { index: 4, d: "M 52 66 C 62 70 70 68 76 62", startPoint: { x: 52, y: 66 }, directionHint: "horizontal" },
  ],
  // ち (2 strokes: 1 horizontal, 2 vertical curving into crescent loop)
  "ち": [
    { index: 1, d: "M 28 32 C 46 30 60 30 72 32", startPoint: { x: 28, y: 32 }, directionHint: "horizontal" },
    { index: 2, d: "M 48 16 L 40 48 C 64 40 76 58 64 78 C 54 88 36 86 32 76", startPoint: { x: 48, y: 16 }, directionHint: "loop" },
  ],
  // つ (1 single curve)
  "つ": [
    { index: 1, d: "M 28 40 C 64 26 78 50 68 72 C 58 84 38 84 28 76", startPoint: { x: 28, y: 40 }, directionHint: "curve" },
  ],
  // て (1 single stroke: horizontal then large curved bowl)
  "て": [
    { index: 1, d: "M 26 32 L 68 30 L 36 54 C 58 56 74 72 54 84", startPoint: { x: 26, y: 32 }, directionHint: "curve" },
  ],
  // と (2 strokes: 1 short diagonal, 2 open crescent)
  "と": [
    { index: 1, d: "M 40 22 L 52 46", startPoint: { x: 40, y: 22 }, directionHint: "down-right" },
    { index: 2, d: "M 64 38 C 42 54 36 68 44 78 C 52 86 64 82 66 78", startPoint: { x: 64, y: 38 }, directionHint: "curve" },
  ],
  // な (4 strokes: 1 horizontal, 2 diagonal slash, 3 accent dot, 4 loop)
  "な": [
    { index: 1, d: "M 24 36 C 34 34 44 34 52 36", startPoint: { x: 24, y: 36 }, directionHint: "horizontal" },
    { index: 2, d: "M 40 20 C 34 46 28 64 24 74", startPoint: { x: 40, y: 20 }, directionHint: "vertical" },
    { index: 3, d: "M 64 30 C 68 34 72 38 74 42", startPoint: { x: 64, y: 30 }, directionHint: "down-right" },
    { index: 4, d: "M 62 44 L 62 70 C 62 84 50 84 50 74 C 50 64 68 64 68 78", startPoint: { x: 62, y: 44 }, directionHint: "loop" },
  ],
  // に (3 strokes: 1 left vertical with hook, 2 upper right horizontal, 3 lower right horizontal)
  "に": [
    { index: 1, d: "M 30 22 C 30 46 28 68 24 78 C 28 72 32 68 34 66", startPoint: { x: 30, y: 22 }, directionHint: "vertical" },
    { index: 2, d: "M 48 38 C 58 36 68 36 76 38", startPoint: { x: 48, y: 38 }, directionHint: "horizontal" },
    { index: 3, d: "M 46 66 C 58 70 70 68 78 64", startPoint: { x: 46, y: 66 }, directionHint: "horizontal" },
  ],
  // ぬ (2 strokes: 1 diagonal slash, 2 sweeping loop with terminal loop)
  "ぬ": [
    { index: 1, d: "M 38 22 L 26 74", startPoint: { x: 38, y: 22 }, directionHint: "vertical" },
    { index: 2, d: "M 28 38 L 60 32 L 34 74 C 48 50 74 50 74 70 C 74 82 62 82 64 72 C 66 66 78 72 78 82", startPoint: { x: 28, y: 38 }, directionHint: "loop" },
  ],
  // ね (2 strokes: 1 left vertical, 2 zigzag with terminal loop)
  "ね": [
    { index: 1, d: "M 32 18 L 32 80", startPoint: { x: 32, y: 18 }, directionHint: "vertical" },
    { index: 2, d: "M 22 36 L 62 34 L 28 74 C 44 48 68 48 68 68 C 68 80 56 80 58 72 C 60 66 70 72 70 80", startPoint: { x: 22, y: 36 }, directionHint: "loop" },
  ],
  // の (1 single continuous loop)
  "の": [
    { index: 1, d: "M 52 28 L 40 56 C 28 76 50 86 68 76 C 82 64 78 38 54 38 C 36 38 26 60 34 76", startPoint: { x: 52, y: 28 }, directionHint: "loop" },
  ],
  // は (3 strokes: 1 left vertical with hook, 2 top horizontal, 3 loop stem)
  "は": [
    { index: 1, d: "M 30 20 C 30 46 28 68 24 78 C 28 72 32 68 34 66", startPoint: { x: 30, y: 20 }, directionHint: "vertical" },
    { index: 2, d: "M 46 36 C 58 34 68 34 76 36", startPoint: { x: 46, y: 36 }, directionHint: "horizontal" },
    { index: 3, d: "M 62 20 L 62 66 C 62 84 44 84 44 70 C 44 56 68 56 66 78", startPoint: { x: 62, y: 20 }, directionHint: "loop" },
  ],
  // ひ (1 single stroke: wide symmetrical bowl)
  "ひ": [
    { index: 1, d: "M 28 36 L 48 34 L 30 66 C 40 84 66 84 74 60 L 70 34", startPoint: { x: 28, y: 36 }, directionHint: "curve" },
  ],
  // ふ (4 strokes: 1 top dot, 2 center hook, 3 left dot, 4 right dot)
  "ふ": [
    { index: 1, d: "M 48 18 C 52 22 56 25 58 28", startPoint: { x: 48, y: 18 }, directionHint: "down-right" },
    { index: 2, d: "M 50 36 C 50 56 40 64 34 58", startPoint: { x: 50, y: 36 }, directionHint: "curve" },
    { index: 3, d: "M 30 50 C 27 56 25 62 24 66", startPoint: { x: 30, y: 50 }, directionHint: "vertical" },
    { index: 4, d: "M 68 46 C 72 52 76 58 78 62", startPoint: { x: 68, y: 46 }, directionHint: "down-right" },
  ],
  // へ (1 single stroke: hill wave)
  "へ": [
    { index: 1, d: "M 24 56 L 46 32 L 80 64", startPoint: { x: 24, y: 56 }, directionHint: "curve" },
  ],
  // ほ (4 strokes: 1 left vertical with hook, 2 upper horizontal, 3 lower horizontal, 4 center loop)
  "ほ": [
    { index: 1, d: "M 28 20 C 28 46 26 68 22 78 C 26 72 30 68 32 66", startPoint: { x: 28, y: 20 }, directionHint: "vertical" },
    { index: 2, d: "M 44 32 C 56 30 68 30 76 32", startPoint: { x: 44, y: 32 }, directionHint: "horizontal" },
    { index: 3, d: "M 46 48 C 56 46 66 46 74 48", startPoint: { x: 46, y: 48 }, directionHint: "horizontal" },
    { index: 4, d: "M 60 22 L 60 66 C 60 84 44 84 44 70 C 44 56 66 56 64 78", startPoint: { x: 60, y: 22 }, directionHint: "loop" },
  ],
  // ま (3 strokes: 1 upper horizontal, 2 lower horizontal, 3 vertical loop)
  "ま": [
    { index: 1, d: "M 28 32 C 48 30 64 30 74 32", startPoint: { x: 28, y: 32 }, directionHint: "horizontal" },
    { index: 2, d: "M 30 48 C 48 46 62 46 72 48", startPoint: { x: 30, y: 48 }, directionHint: "horizontal" },
    { index: 3, d: "M 52 16 L 52 66 C 52 84 36 84 36 70 C 36 56 58 56 56 78", startPoint: { x: 52, y: 16 }, directionHint: "loop" },
  ],
  // み (2 strokes: 1 horizontal-down-loop-right, 2 slanted vertical)
  "み": [
    { index: 1, d: "M 28 32 L 66 30 L 34 64 C 28 74 42 80 52 70 L 78 70", startPoint: { x: 28, y: 32 }, directionHint: "loop" },
    { index: 2, d: "M 62 44 L 46 84", startPoint: { x: 62, y: 44 }, directionHint: "down-right" },
  ],
  // む (3 strokes: 1 top horizontal, 2 vertical loop with hook, 3 top-right droplet)
  "む": [
    { index: 1, d: "M 26 34 C 44 32 58 32 68 34", startPoint: { x: 26, y: 34 }, directionHint: "horizontal" },
    { index: 2, d: "M 44 20 L 44 66 C 44 82 32 82 32 72 C 32 60 62 60 74 54 L 72 46", startPoint: { x: 44, y: 20 }, directionHint: "loop" },
    { index: 3, d: "M 72 26 C 75 30 77 34 78 38", startPoint: { x: 72, y: 26 }, directionHint: "down-right" },
  ],
  // め (2 strokes: 1 diagonal slash, 2 sweeping oval loop)
  "め": [
    { index: 1, d: "M 38 24 L 26 72", startPoint: { x: 38, y: 24 }, directionHint: "vertical" },
    { index: 2, d: "M 28 40 L 64 30 L 36 74 C 50 50 76 52 72 74 C 68 86 48 84 36 76", startPoint: { x: 28, y: 40 }, directionHint: "loop" },
  ],
  // も (3 strokes: 1 center vertical curve first, 2 top horizontal, 3 bottom horizontal — MEXT canonical order)
  "も": [
    { index: 1, d: "M 48 18 L 48 68 C 48 86 68 86 76 72", startPoint: { x: 48, y: 18 }, directionHint: "vertical" },
    { index: 2, d: "M 30 38 C 46 36 60 36 70 38", startPoint: { x: 30, y: 38 }, directionHint: "horizontal" },
    { index: 3, d: "M 26 54 C 46 52 62 52 74 54", startPoint: { x: 26, y: 54 }, directionHint: "horizontal" },
  ],
  // や (3 strokes: 1 main curve with hook, 2 top accent tick, 3 vertical slice)
  "や": [
    { index: 1, d: "M 26 38 C 56 28 68 36 68 46 L 50 80", startPoint: { x: 26, y: 38 }, directionHint: "curve" },
    { index: 2, d: "M 44 22 L 48 32", startPoint: { x: 44, y: 22 }, directionHint: "down-right" },
    { index: 3, d: "M 56 18 L 34 82", startPoint: { x: 56, y: 18 }, directionHint: "vertical" },
  ],
  // ゆ (2 strokes: 1 authentic loop, 2 vertical slice down through center)
  "ゆ": [
    { index: 1, d: "M 40 20 C 38 42 36 56 36 64 C 36 78 48 78 56 68 C 62 60 64 48 62 38", startPoint: { x: 40, y: 20 }, directionHint: "loop" },
    { index: 2, d: "M 52 16 L 52 84", startPoint: { x: 52, y: 16 }, directionHint: "vertical" },
  ],
  // よ (2 strokes: 1 top horizontal, 2 vertical down through left loop to horizontal right)
  "よ": [
    { index: 1, d: "M 30 36 C 42 34 50 34 58 36", startPoint: { x: 30, y: 36 }, directionHint: "horizontal" },
    { index: 2, d: "M 52 18 L 52 62 C 52 74 38 76 34 68 C 30 60 42 56 54 58 L 74 60", startPoint: { x: 52, y: 18 }, directionHint: "loop" },
  ],
  // ら (2 strokes: 1 top dot, 2 vertical into crescent bowl)
  "ら": [
    { index: 1, d: "M 44 20 C 48 24 52 26 54 28", startPoint: { x: 44, y: 20 }, directionHint: "down-right" },
    { index: 2, d: "M 36 40 L 54 38 L 38 54 C 58 52 74 66 56 84", startPoint: { x: 36, y: 40 }, directionHint: "curve" },
  ],
  // り (2 strokes: 1 left vertical with hook, 2 right longer vertical curving down-left)
  "り": [
    { index: 1, d: "M 36 26 L 36 56 C 38 52 42 50 44 48", startPoint: { x: 36, y: 26 }, directionHint: "vertical" },
    { index: 2, d: "M 62 18 L 62 60 C 62 78 52 84 40 84", startPoint: { x: 62, y: 18 }, directionHint: "vertical" },
  ],
  // る (1 single stroke with bottom loop)
  "る": [
    { index: 1, d: "M 32 28 L 66 26 L 36 60 C 56 56 74 68 66 84 C 58 90 48 84 52 76 C 56 68 68 74 64 82", startPoint: { x: 32, y: 28 }, directionHint: "loop" },
  ],
  // れ (2 strokes: 1 left vertical, 2 zigzag and right sweep)
  "れ": [
    { index: 1, d: "M 32 20 L 32 80", startPoint: { x: 32, y: 20 }, directionHint: "vertical" },
    { index: 2, d: "M 22 36 L 64 34 L 32 68 L 56 48 C 64 58 74 74 80 66", startPoint: { x: 22, y: 36 }, directionHint: "curve" },
  ],
  // ろ (1 single stroke — like る without terminal loop)
  "ろ": [
    { index: 1, d: "M 32 28 L 66 26 L 36 60 C 56 56 74 68 56 84", startPoint: { x: 32, y: 28 }, directionHint: "curve" },
  ],
  // わ (2 strokes: 1 left vertical, 2 zigzag with large rounded back)
  "わ": [
    { index: 1, d: "M 32 20 L 32 82", startPoint: { x: 32, y: 20 }, directionHint: "vertical" },
    { index: 2, d: "M 22 36 L 54 34 L 32 60 C 44 48 70 48 70 66 C 70 82 48 84 36 78", startPoint: { x: 22, y: 36 }, directionHint: "loop" },
  ],
  // を (3 strokes: 1 horizontal, 2 down-curve, 3 under-loop)
  "を": [
    { index: 1, d: "M 28 30 C 46 28 58 28 72 30", startPoint: { x: 28, y: 30 }, directionHint: "horizontal" },
    { index: 2, d: "M 48 16 L 36 58 C 48 54 58 52 66 52", startPoint: { x: 48, y: 16 }, directionHint: "vertical" },
    { index: 3, d: "M 40 56 C 40 78 66 80 74 70", startPoint: { x: 40, y: 56 }, directionHint: "curve" },
  ],
  // ん (1 single stroke)
  "ん": [
    { index: 1, d: "M 36 26 L 28 76 C 36 60 54 52 58 64 C 62 76 64 82 72 80", startPoint: { x: 36, y: 26 }, directionHint: "curve" },
  ],
};

// ------------------------------------------------------------------------------
// 2. AUTHENTIC BASIC KATAKANA STROKE DATA (46 Characters — 100x100 Coordinate Space)
// ------------------------------------------------------------------------------
export const KATAKANA_STROKE_DATA: Record<string, KanaStroke[]> = {
  // ア (2 strokes)
  "ア": [
    { index: 1, d: "M 26 28 C 50 26 66 26 66 38 C 58 52 48 62 46 64", startPoint: { x: 26, y: 28 }, directionHint: "curve" },
    { index: 2, d: "M 44 38 C 42 56 36 72 22 82", startPoint: { x: 44, y: 38 }, directionHint: "down-left" },
  ],
  // イ (2 strokes)
  "イ": [
    { index: 1, d: "M 56 18 C 46 34 34 52 22 66", startPoint: { x: 56, y: 18 }, directionHint: "down-left" },
    { index: 2, d: "M 44 40 L 44 84", startPoint: { x: 44, y: 40 }, directionHint: "vertical" },
  ],
  // ウ (3 strokes)
  "ウ": [
    { index: 1, d: "M 50 16 L 50 26", startPoint: { x: 50, y: 16 }, directionHint: "vertical" },
    { index: 2, d: "M 30 34 L 30 48", startPoint: { x: 30, y: 34 }, directionHint: "vertical" },
    { index: 3, d: "M 30 36 C 54 32 70 32 72 44 C 66 64 52 78 36 84", startPoint: { x: 30, y: 36 }, directionHint: "curve" },
  ],
  // エ (3 strokes)
  "エ": [
    { index: 1, d: "M 28 26 C 46 24 60 24 72 26", startPoint: { x: 28, y: 26 }, directionHint: "horizontal" },
    { index: 2, d: "M 50 26 L 50 74", startPoint: { x: 50, y: 26 }, directionHint: "vertical" },
    { index: 3, d: "M 22 74 C 44 72 62 72 78 74", startPoint: { x: 22, y: 74 }, directionHint: "horizontal" },
  ],
  // オ (3 strokes)
  "オ": [
    { index: 1, d: "M 24 32 C 46 30 62 30 76 32", startPoint: { x: 24, y: 32 }, directionHint: "horizontal" },
    { index: 2, d: "M 52 18 L 52 76 C 48 82 42 80 40 76", startPoint: { x: 52, y: 18 }, directionHint: "vertical" },
    { index: 3, d: "M 50 42 C 42 58 32 70 20 78", startPoint: { x: 50, y: 42 }, directionHint: "down-left" },
  ],
  // カ (2 strokes)
  "カ": [
    { index: 1, d: "M 26 32 C 52 28 68 28 68 42 C 68 62 60 76 48 82", startPoint: { x: 26, y: 32 }, directionHint: "curve" },
    { index: 2, d: "M 48 18 C 44 48 34 70 22 80", startPoint: { x: 48, y: 18 }, directionHint: "vertical" },
  ],
  // キ (3 strokes)
  "キ": [
    { index: 1, d: "M 30 32 C 48 30 58 30 70 32", startPoint: { x: 30, y: 32 }, directionHint: "horizontal" },
    { index: 2, d: "M 26 48 C 46 46 60 46 74 48", startPoint: { x: 26, y: 48 }, directionHint: "horizontal" },
    { index: 3, d: "M 54 18 C 50 54 40 72 26 82", startPoint: { x: 54, y: 18 }, directionHint: "down-left" },
  ],
  // ク (2 strokes)
  "ク": [
    { index: 1, d: "M 46 22 C 38 34 30 46 24 54", startPoint: { x: 46, y: 22 }, directionHint: "down-left" },
    { index: 2, d: "M 36 34 C 58 30 70 30 70 42 C 68 64 54 78 36 84", startPoint: { x: 36, y: 34 }, directionHint: "curve" },
  ],
  // ケ (3 strokes)
  "ケ": [
    { index: 1, d: "M 46 20 C 38 34 30 46 22 56", startPoint: { x: 46, y: 20 }, directionHint: "down-left" },
    { index: 2, d: "M 32 40 C 50 38 64 38 78 40", startPoint: { x: 32, y: 40 }, directionHint: "horizontal" },
    { index: 3, d: "M 58 40 C 56 60 48 74 34 82", startPoint: { x: 58, y: 40 }, directionHint: "vertical" },
  ],
  // コ (2 strokes)
  "コ": [
    { index: 1, d: "M 30 28 L 70 28 L 70 72", startPoint: { x: 30, y: 28 }, directionHint: "horizontal" },
    { index: 2, d: "M 30 72 L 70 72", startPoint: { x: 30, y: 72 }, directionHint: "horizontal" },
  ],
  // サ (3 strokes)
  "サ": [
    { index: 1, d: "M 24 38 C 46 36 62 36 76 38", startPoint: { x: 24, y: 38 }, directionHint: "horizontal" },
    { index: 2, d: "M 40 24 L 38 68", startPoint: { x: 40, y: 24 }, directionHint: "vertical" },
    { index: 3, d: "M 62 26 C 62 52 56 68 44 76", startPoint: { x: 62, y: 26 }, directionHint: "vertical" },
  ],
  // シ (3 strokes — stroke 3 starts at bottom and sweeps UP to top-right)
  "シ": [
    { index: 1, d: "M 32 30 L 44 36", startPoint: { x: 32, y: 30 }, directionHint: "down-right" },
    { index: 2, d: "M 28 48 L 40 54", startPoint: { x: 28, y: 48 }, directionHint: "down-right" },
    { index: 3, d: "M 30 80 C 44 68 58 50 72 30", startPoint: { x: 30, y: 80 }, directionHint: "up-right" },
  ],
  // ス (2 strokes)
  "ス": [
    { index: 1, d: "M 28 32 L 68 32 L 44 78", startPoint: { x: 28, y: 32 }, directionHint: "curve" },
    { index: 2, d: "M 52 54 C 60 64 70 74 78 80", startPoint: { x: 52, y: 54 }, directionHint: "down-right" },
  ],
  // セ (2 strokes)
  "セ": [
    { index: 1, d: "M 26 36 L 68 36 L 68 64 C 60 66 54 66 48 64", startPoint: { x: 26, y: 36 }, directionHint: "horizontal" },
    { index: 2, d: "M 44 20 L 44 72 L 76 72", startPoint: { x: 44, y: 20 }, directionHint: "vertical" },
  ],
  // ソ (2 strokes — stroke 2 starts at top-right and sweeps DOWN to bottom-left)
  "ソ": [
    { index: 1, d: "M 36 28 L 46 40", startPoint: { x: 36, y: 28 }, directionHint: "down-right" },
    { index: 2, d: "M 68 24 C 54 48 42 66 26 80", startPoint: { x: 68, y: 24 }, directionHint: "down-left" },
  ],
  // タ (3 strokes)
  "タ": [
    { index: 1, d: "M 44 20 C 36 34 28 46 22 56", startPoint: { x: 44, y: 20 }, directionHint: "down-left" },
    { index: 2, d: "M 32 38 L 68 38 C 66 64 52 76 34 82", startPoint: { x: 32, y: 38 }, directionHint: "curve" },
    { index: 3, d: "M 42 54 L 62 64", startPoint: { x: 42, y: 54 }, directionHint: "down-right" },
  ],
  // チ (3 strokes)
  "チ": [
    { index: 1, d: "M 66 22 L 32 32", startPoint: { x: 66, y: 22 }, directionHint: "down-left" },
    { index: 2, d: "M 24 48 C 46 46 62 46 76 48", startPoint: { x: 24, y: 48 }, directionHint: "horizontal" },
    { index: 3, d: "M 52 34 C 50 60 40 74 24 82", startPoint: { x: 52, y: 34 }, directionHint: "vertical" },
  ],
  // ツ (3 strokes — stroke 3 starts at top-right and sweeps DOWN to bottom-left)
  "ツ": [
    { index: 1, d: "M 32 26 L 38 38", startPoint: { x: 32, y: 26 }, directionHint: "down-right" },
    { index: 2, d: "M 48 30 L 54 44", startPoint: { x: 48, y: 30 }, directionHint: "down-right" },
    { index: 3, d: "M 72 26 C 60 50 48 68 28 80", startPoint: { x: 72, y: 26 }, directionHint: "down-left" },
  ],
  // テ (3 strokes)
  "テ": [
    { index: 1, d: "M 32 28 C 46 26 58 26 68 28", startPoint: { x: 32, y: 28 }, directionHint: "horizontal" },
    { index: 2, d: "M 22 46 C 46 44 62 44 78 46", startPoint: { x: 22, y: 46 }, directionHint: "horizontal" },
    { index: 3, d: "M 50 46 C 46 64 38 74 24 82", startPoint: { x: 50, y: 46 }, directionHint: "vertical" },
  ],
  // ト (2 strokes)
  "ト": [
    { index: 1, d: "M 44 18 L 44 82", startPoint: { x: 44, y: 18 }, directionHint: "vertical" },
    { index: 2, d: "M 44 44 L 72 58", startPoint: { x: 44, y: 44 }, directionHint: "down-right" },
  ],
  // ナ (2 strokes)
  "ナ": [
    { index: 1, d: "M 24 38 C 46 36 62 36 76 38", startPoint: { x: 24, y: 38 }, directionHint: "horizontal" },
    { index: 2, d: "M 46 22 C 44 48 36 68 22 80", startPoint: { x: 46, y: 22 }, directionHint: "vertical" },
  ],
  // ニ (2 strokes)
  "ニ": [
    { index: 1, d: "M 30 36 C 46 34 58 34 70 36", startPoint: { x: 30, y: 36 }, directionHint: "horizontal" },
    { index: 2, d: "M 22 66 C 46 64 62 64 78 66", startPoint: { x: 22, y: 66 }, directionHint: "horizontal" },
  ],
  // ヌ (2 strokes)
  "ヌ": [
    { index: 1, d: "M 26 34 L 66 34 L 44 78", startPoint: { x: 26, y: 34 }, directionHint: "curve" },
    { index: 2, d: "M 40 48 L 74 72", startPoint: { x: 40, y: 48 }, directionHint: "down-right" },
  ],
  // ネ (4 strokes)
  "ネ": [
    { index: 1, d: "M 42 18 L 42 26", startPoint: { x: 42, y: 18 }, directionHint: "vertical" },
    { index: 2, d: "M 28 34 L 56 34 L 32 78", startPoint: { x: 28, y: 34 }, directionHint: "curve" },
    { index: 3, d: "M 42 44 L 42 82", startPoint: { x: 42, y: 44 }, directionHint: "vertical" },
    { index: 4, d: "M 52 56 L 70 74", startPoint: { x: 52, y: 56 }, directionHint: "down-right" },
  ],
  // ノ (1 single stroke)
  "ノ": [
    { index: 1, d: "M 66 22 C 54 44 40 64 22 80", startPoint: { x: 66, y: 22 }, directionHint: "down-left" },
  ],
  // ハ (2 strokes)
  "ハ": [
    { index: 1, d: "M 40 32 C 34 50 26 66 18 76", startPoint: { x: 40, y: 32 }, directionHint: "down-left" },
    { index: 2, d: "M 60 32 C 64 50 72 66 82 76", startPoint: { x: 60, y: 32 }, directionHint: "down-right" },
  ],
  // ヒ (2 strokes)
  "ヒ": [
    { index: 1, d: "M 30 32 C 46 30 58 30 68 32", startPoint: { x: 30, y: 32 }, directionHint: "horizontal" },
    { index: 2, d: "M 38 22 L 38 68 L 74 66", startPoint: { x: 38, y: 22 }, directionHint: "vertical" },
  ],
  // フ (1 single stroke)
  "フ": [
    { index: 1, d: "M 26 30 L 68 30 C 66 58 54 74 36 82", startPoint: { x: 26, y: 30 }, directionHint: "curve" },
  ],
  // ヘ (1 single stroke)
  "ヘ": [
    { index: 1, d: "M 24 54 L 46 32 L 78 62", startPoint: { x: 24, y: 54 }, directionHint: "curve" },
  ],
  // ホ (4 strokes)
  "ホ": [
    { index: 1, d: "M 24 32 C 46 30 62 30 76 32", startPoint: { x: 24, y: 32 }, directionHint: "horizontal" },
    { index: 2, d: "M 50 18 L 50 78 C 46 82 40 80 38 78", startPoint: { x: 50, y: 18 }, directionHint: "vertical" },
    { index: 3, d: "M 34 46 C 30 58 26 68 20 74", startPoint: { x: 34, y: 46 }, directionHint: "down-left" },
    { index: 4, d: "M 66 46 C 70 58 74 68 80 74", startPoint: { x: 66, y: 46 }, directionHint: "down-right" },
  ],
  // マ (2 strokes)
  "マ": [
    { index: 1, d: "M 26 32 L 68 32 L 46 64", startPoint: { x: 26, y: 32 }, directionHint: "curve" },
    { index: 2, d: "M 48 54 L 72 74", startPoint: { x: 48, y: 54 }, directionHint: "down-right" },
  ],
  // ミ (3 strokes)
  "ミ": [
    { index: 1, d: "M 34 30 L 64 38", startPoint: { x: 34, y: 30 }, directionHint: "down-right" },
    { index: 2, d: "M 30 48 L 66 56", startPoint: { x: 30, y: 48 }, directionHint: "down-right" },
    { index: 3, d: "M 26 66 L 70 76", startPoint: { x: 26, y: 66 }, directionHint: "down-right" },
  ],
  // ム (2 strokes)
  "ム": [
    { index: 1, d: "M 48 22 L 30 60 L 74 60", startPoint: { x: 48, y: 22 }, directionHint: "curve" },
    { index: 2, d: "M 60 46 L 72 66", startPoint: { x: 60, y: 46 }, directionHint: "down-right" },
  ],
  // メ (2 strokes)
  "メ": [
    { index: 1, d: "M 64 24 C 52 46 40 66 24 80", startPoint: { x: 64, y: 24 }, directionHint: "down-left" },
    { index: 2, d: "M 34 38 L 70 72", startPoint: { x: 34, y: 38 }, directionHint: "down-right" },
  ],
  // モ (3 strokes)
  "モ": [
    { index: 1, d: "M 28 32 C 46 30 60 30 72 32", startPoint: { x: 28, y: 32 }, directionHint: "horizontal" },
    { index: 2, d: "M 22 48 C 46 46 62 46 78 48", startPoint: { x: 22, y: 48 }, directionHint: "horizontal" },
    { index: 3, d: "M 46 20 L 46 70 L 74 68", startPoint: { x: 46, y: 20 }, directionHint: "vertical" },
  ],
  // ヤ (2 strokes)
  "ヤ": [
    { index: 1, d: "M 26 38 C 50 30 64 30 66 46 L 50 78", startPoint: { x: 26, y: 38 }, directionHint: "curve" },
    { index: 2, d: "M 48 22 L 36 78", startPoint: { x: 48, y: 22 }, directionHint: "vertical" },
  ],
  // ユ (2 strokes)
  "ユ": [
    { index: 1, d: "M 32 30 L 66 30 L 66 58 L 32 58", startPoint: { x: 32, y: 30 }, directionHint: "horizontal" },
    { index: 2, d: "M 46 46 L 46 76 L 76 76", startPoint: { x: 46, y: 46 }, directionHint: "vertical" },
  ],
  // ヨ (3 strokes — canonical MEXT order: 1 top horizontal + down stem, 2 middle horizontal, 3 bottom horizontal)
  "ヨ": [
    { index: 1, d: "M 30 28 L 70 28 L 70 72", startPoint: { x: 30, y: 28 }, directionHint: "horizontal" },
    { index: 2, d: "M 30 50 L 66 50", startPoint: { x: 30, y: 50 }, directionHint: "horizontal" },
    { index: 3, d: "M 30 72 L 70 72", startPoint: { x: 30, y: 72 }, directionHint: "horizontal" },
  ],
  // ラ (2 strokes)
  "ラ": [
    { index: 1, d: "M 32 26 C 46 24 58 24 68 26", startPoint: { x: 32, y: 26 }, directionHint: "horizontal" },
    { index: 2, d: "M 46 38 L 68 38 C 66 66 52 78 34 84", startPoint: { x: 46, y: 38 }, directionHint: "curve" },
  ],
  // リ (2 strokes)
  "リ": [
    { index: 1, d: "M 38 28 L 38 56", startPoint: { x: 38, y: 28 }, directionHint: "vertical" },
    { index: 2, d: "M 62 22 C 62 52 56 74 42 82", startPoint: { x: 62, y: 22 }, directionHint: "vertical" },
  ],
  // ル (2 strokes)
  "ル": [
    { index: 1, d: "M 38 24 C 36 46 32 64 24 78", startPoint: { x: 38, y: 24 }, directionHint: "vertical" },
    { index: 2, d: "M 58 20 L 58 68 C 64 78 70 76 74 72", startPoint: { x: 58, y: 20 }, directionHint: "vertical" },
  ],
  // レ (1 single stroke)
  "レ": [
    { index: 1, d: "M 42 22 L 42 74 L 74 70", startPoint: { x: 42, y: 22 }, directionHint: "vertical" },
  ],
  // ロ (3 strokes)
  "ロ": [
    { index: 1, d: "M 32 28 L 32 74", startPoint: { x: 32, y: 28 }, directionHint: "vertical" },
    { index: 2, d: "M 32 28 L 70 28 L 70 74", startPoint: { x: 32, y: 28 }, directionHint: "horizontal" },
    { index: 3, d: "M 30 74 L 72 74", startPoint: { x: 30, y: 74 }, directionHint: "horizontal" },
  ],
  // ワ (2 strokes)
  "ワ": [
    { index: 1, d: "M 30 32 L 30 52", startPoint: { x: 30, y: 32 }, directionHint: "vertical" },
    { index: 2, d: "M 30 32 L 70 32 C 68 64 54 78 34 84", startPoint: { x: 30, y: 32 }, directionHint: "curve" },
  ],
  // ヲ (3 strokes)
  "ヲ": [
    { index: 1, d: "M 28 32 C 46 30 60 30 74 32", startPoint: { x: 28, y: 32 }, directionHint: "horizontal" },
    { index: 2, d: "M 30 48 C 46 46 58 46 68 48", startPoint: { x: 30, y: 48 }, directionHint: "horizontal" },
    { index: 3, d: "M 56 32 C 54 54 44 72 28 82", startPoint: { x: 56, y: 32 }, directionHint: "vertical" },
  ],
  // ン (2 strokes — stroke 2 starts at bottom-left and sweeps UP to top-right)
  "ン": [
    { index: 1, d: "M 32 34 L 42 42", startPoint: { x: 32, y: 34 }, directionHint: "down-right" },
    { index: 2, d: "M 30 78 C 42 66 56 48 72 28", startPoint: { x: 30, y: 78 }, directionHint: "up-right" },
  ],
};

// ------------------------------------------------------------------------------
// 3. DIACRITIC BASE MAPPINGS & POSITIONING
// ------------------------------------------------------------------------------
interface DiacriticPlacement {
  base: string;
  type: "dakuten" | "handakuten";
  offset?: { x: number; y: number };
}

const DAKUTEN_BASE_MAP: Record<string, DiacriticPlacement> = {
  // Hiragana Dakuten
  "が": { base: "か", type: "dakuten", offset: { x: 4, y: -2 } },
  "ぎ": { base: "き", type: "dakuten", offset: { x: 2, y: -2 } },
  "ぐ": { base: "く", type: "dakuten", offset: { x: 0, y: 0 } },
  "げ": { base: "け", type: "dakuten", offset: { x: 2, y: -2 } },
  "ご": { base: "こ", type: "dakuten", offset: { x: 0, y: 0 } },
  "ざ": { base: "さ", type: "dakuten", offset: { x: 2, y: -2 } },
  "じ": { base: "し", type: "dakuten", offset: { x: 0, y: 0 } },
  "ず": { base: "す", type: "dakuten", offset: { x: 0, y: 0 } },
  "ぜ": { base: "せ", type: "dakuten", offset: { x: 2, y: -2 } },
  "ぞ": { base: "そ", type: "dakuten", offset: { x: 0, y: 0 } },
  "だ": { base: "た", type: "dakuten", offset: { x: 2, y: -2 } },
  "ぢ": { base: "ち", type: "dakuten", offset: { x: 0, y: 0 } },
  "づ": { base: "つ", type: "dakuten", offset: { x: 0, y: 0 } },
  "で": { base: "て", type: "dakuten", offset: { x: 0, y: 0 } },
  "ど": { base: "と", type: "dakuten", offset: { x: 0, y: 0 } },
  "ば": { base: "は", type: "dakuten", offset: { x: 4, y: 0 } },
  "び": { base: "ひ", type: "dakuten", offset: { x: 4, y: 0 } },
  "ぶ": { base: "ふ", type: "dakuten", offset: { x: 2, y: 0 } },
  "べ": { base: "へ", type: "dakuten", offset: { x: 0, y: 4 } },
  "ぼ": { base: "ほ", type: "dakuten", offset: { x: 4, y: 0 } },

  // Hiragana Handakuten
  "ぱ": { base: "は", type: "handakuten", offset: { x: 2, y: 0 } },
  "ぴ": { base: "ひ", type: "handakuten", offset: { x: 2, y: 2 } },
  "ぷ": { base: "ふ", type: "handakuten", offset: { x: 0, y: 0 } },
  "ぺ": { base: "へ", type: "handakuten", offset: { x: 0, y: 4 } },
  "ぽ": { base: "ほ", type: "handakuten", offset: { x: 2, y: 0 } },

  // Katakana Dakuten
  "ガ": { base: "カ", type: "dakuten", offset: { x: 4, y: 0 } },
  "ギ": { base: "キ", type: "dakuten", offset: { x: 2, y: 0 } },
  "グ": { base: "ク", type: "dakuten", offset: { x: 0, y: 0 } },
  "ゲ": { base: "ケ", type: "dakuten", offset: { x: 2, y: 0 } },
  "ゴ": { base: "コ", type: "dakuten", offset: { x: 0, y: 0 } },
  "ザ": { base: "サ", type: "dakuten", offset: { x: 2, y: 0 } },
  "ジ": { base: "シ", type: "dakuten", offset: { x: 0, y: 0 } },
  "ズ": { base: "ス", type: "dakuten", offset: { x: 0, y: 0 } },
  "ゼ": { base: "セ", type: "dakuten", offset: { x: 2, y: 0 } },
  "ゾ": { base: "ソ", type: "dakuten", offset: { x: 0, y: 0 } },
  "ダ": { base: "タ", type: "dakuten", offset: { x: 2, y: 0 } },
  "ヂ": { base: "チ", type: "dakuten", offset: { x: 0, y: 0 } },
  "ヅ": { base: "ツ", type: "dakuten", offset: { x: 0, y: 0 } },
  "デ": { base: "テ", type: "dakuten", offset: { x: 0, y: 0 } },
  "ド": { base: "ト", type: "dakuten", offset: { x: 0, y: 0 } },
  "バ": { base: "ハ", type: "dakuten", offset: { x: 2, y: 0 } },
  "ビ": { base: "ヒ", type: "dakuten", offset: { x: 2, y: 0 } },
  "ブ": { base: "フ", type: "dakuten", offset: { x: 0, y: 0 } },
  "ベ": { base: "ヘ", type: "dakuten", offset: { x: 0, y: 4 } },
  "ボ": { base: "ホ", type: "dakuten", offset: { x: 2, y: 0 } },

  // Katakana Handakuten
  "パ": { base: "ハ", type: "handakuten", offset: { x: 2, y: 0 } },
  "ピ": { base: "ヒ", type: "handakuten", offset: { x: 2, y: 0 } },
  "プ": { base: "フ", type: "handakuten", offset: { x: 0, y: 0 } },
  "ペ": { base: "ヘ", type: "handakuten", offset: { x: 0, y: 4 } },
  "ポ": { base: "ホ", type: "handakuten", offset: { x: 2, y: 0 } },
};

const SMALL_KANA_BASE_MAP: Record<string, string> = {
  "ぁ": "あ", "ぃ": "い", "ぅ": "う", "ぇ": "え", "ぉ": "お",
  "ゃ": "や", "ゅ": "ゆ", "ょ": "よ", "っ": "つ",
  "ァ": "ア", "ィ": "イ", "ゥ": "ウ", "ェ": "エ", "ォ": "オ",
  "ャ": "ヤ", "ュ": "ユ", "ョ": "ヨ", "ッ": "ツ",
};

// ------------------------------------------------------------------------------
// SVG PATH TRANSFORMATION ENGINE (Mathematically parses and transforms commands)
// ------------------------------------------------------------------------------
export function transformPath(d: string, scale: number, offsetX: number, offsetY: number): string {
  const clean = d.replace(/,/g, " ").trim();
  return clean.replace(/([A-Za-z])([^A-Za-z]*)/g, (_match, cmd: string, argsStr: string) => {
    const upper = cmd.toUpperCase();
    const numbers = argsStr.trim().split(/\s+/).filter(Boolean).map(Number);
    if (numbers.length === 0) return cmd;

    if (upper === "M" || upper === "L" || upper === "T") {
      const res: string[] = [];
      for (let i = 0; i < numbers.length; i += 2) {
        const x = Math.round(numbers[i] * scale + offsetX);
        const y = Math.round((numbers[i + 1] ?? 0) * scale + offsetY);
        res.push(`${x} ${y}`);
      }
      return `${cmd} ${res.join(" ")}`;
    }

    if (upper === "C") {
      const res: string[] = [];
      for (let i = 0; i < numbers.length; i += 6) {
        const x1 = Math.round(numbers[i] * scale + offsetX);
        const y1 = Math.round(numbers[i + 1] * scale + offsetY);
        const x2 = Math.round(numbers[i + 2] * scale + offsetX);
        const y2 = Math.round(numbers[i + 3] * scale + offsetY);
        const x = Math.round(numbers[i + 4] * scale + offsetX);
        const y = Math.round(numbers[i + 5] * scale + offsetY);
        res.push(`${x1} ${y1} ${x2} ${y2} ${x} ${y}`);
      }
      return `${cmd} ${res.join(" ")}`;
    }

    if (upper === "Q" || upper === "S") {
      const res: string[] = [];
      for (let i = 0; i < numbers.length; i += 4) {
        const x1 = Math.round(numbers[i] * scale + offsetX);
        const y1 = Math.round(numbers[i + 1] * scale + offsetY);
        const x = Math.round(numbers[i + 2] * scale + offsetX);
        const y = Math.round(numbers[i + 3] * scale + offsetY);
        res.push(`${x1} ${y1} ${x} ${y}`);
      }
      return `${cmd} ${res.join(" ")}`;
    }

    if (upper === "A") {
      // rx ry x-axis-rotation large-arc sweep x y
      const rx = (numbers[0] * scale).toFixed(1);
      const ry = (numbers[1] * scale).toFixed(1);
      const rot = numbers[2];
      const large = numbers[3];
      const sweep = numbers[4];
      const x = Math.round(numbers[5] * scale + offsetX);
      const y = Math.round(numbers[6] * scale + offsetY);
      return `${cmd} ${rx} ${ry} ${rot} ${large} ${sweep} ${x} ${y}`;
    }

    // Default fallback
    const res: string[] = [];
    for (let i = 0; i < numbers.length; i += 2) {
      const x = Math.round(numbers[i] * scale + offsetX);
      const y = Math.round((numbers[i + 1] ?? 0) * scale + offsetY);
      res.push(`${x} ${y}`);
    }
    return `${cmd} ${res.join(" ")}`;
  });
}

// ------------------------------------------------------------------------------
// 4. COMPREHENSIVE KANA STROKE RETRIEVAL ENGINE
// ------------------------------------------------------------------------------
export function getKanaStrokes(char: string, scriptType: "hira" | "kata"): KanaStroke[] {
  const dictionary = scriptType === "hira" ? HIRAGANA_STROKE_DATA : KATAKANA_STROKE_DATA;

  // 1. Direct Basic Kana Lookup
  if (dictionary[char]) {
    return dictionary[char];
  }

  // 2. Dakuten & Handakuten Characters
  if (DAKUTEN_BASE_MAP[char]) {
    const { base, type, offset = { x: 0, y: 0 } } = DAKUTEN_BASE_MAP[char];
    const baseStrokes = dictionary[base] || [];
    const result: KanaStroke[] = [];
    let idx = 1;

    // Base character strokes come first (1..N)
    baseStrokes.forEach((s) => {
      result.push({
        index: idx++,
        d: s.d,
        startPoint: { ...s.startPoint },
        directionHint: s.directionHint,
      });
    });

    const ox = offset.x;
    const oy = offset.y;

    if (type === "dakuten") {
      // Stroke N+1: Upper Dakuten tick
      const d1Start = { x: 76 + ox, y: 13 + oy };
      const d1End = { x: 86 + ox, y: 19 + oy };
      result.push({
        index: idx++,
        d: `M ${d1Start.x} ${d1Start.y} L ${d1End.x} ${d1End.y}`,
        startPoint: d1Start,
        directionHint: "down-right",
      });
      // Stroke N+2: Lower Dakuten tick
      const d2Start = { x: 72 + ox, y: 23 + oy };
      const d2End = { x: 82 + ox, y: 29 + oy };
      result.push({
        index: idx++,
        d: `M ${d2Start.x} ${d2Start.y} L ${d2End.x} ${d2End.y}`,
        startPoint: d2Start,
        directionHint: "down-right",
      });
    } else {
      // Stroke N+1: Handakuten circle (maru)
      const cx = 78 + ox;
      const cy = 15 + oy;
      result.push({
        index: idx++,
        d: `M ${cx} ${cy - 5} A 5 5 0 1 1 ${cx - 0.1} ${cy - 5} Z`,
        startPoint: { x: cx, y: cy - 5 },
        directionHint: "curve",
      });
    }

    return result;
  }

  // 3. Small Kana (ぁ, ぃ, ぅ, ぇ, ぉ, っ, ゃ, ゅ, ょ, ァ, etc.)
  if (SMALL_KANA_BASE_MAP[char]) {
    const base = SMALL_KANA_BASE_MAP[char];
    const baseStrokes = dictionary[base] || [];
    const scale = 0.70;
    const offsetX = 14;
    const offsetY = 20;

    return baseStrokes.map((s, i) => ({
      index: i + 1,
      d: transformPath(s.d, scale, offsetX, offsetY),
      startPoint: {
        x: Math.round(s.startPoint.x * scale + offsetX),
        y: Math.round(s.startPoint.y * scale + offsetY),
      },
      directionHint: s.directionHint,
    }));
  }

  // 4. Yōon Combinations (Two-character pairs, e.g. "きゃ", "キャ", "ギャ")
  if (char.length === 2) {
    const baseChar = char[0];
    const smallChar = char[1];

    // Determine base character strokes (supports base with dakuten, e.g. ぎゃ -> ぎ + ゃ)
    const baseStrokes = getKanaStrokes(baseChar, scriptType);

    // Determine small character base
    const smallBase = SMALL_KANA_BASE_MAP[smallChar] || smallChar;
    const smallBaseStrokes = dictionary[smallBase] || [];

    const result: KanaStroke[] = [];
    let idx = 1;

    // Left character: 0.62 scale, shifted left
    const baseScale = 0.62;
    const baseOffsetX = 4;
    const baseOffsetY = 16;
    baseStrokes.forEach((s) => {
      result.push({
        index: idx++,
        d: transformPath(s.d, baseScale, baseOffsetX, baseOffsetY),
        startPoint: {
          x: Math.round(s.startPoint.x * baseScale + baseOffsetX),
          y: Math.round(s.startPoint.y * baseScale + baseOffsetY),
        },
        directionHint: s.directionHint,
      });
    });

    // Right character (Small Kana): 0.48 scale, shifted bottom-right
    const smallScale = 0.48;
    const smallOffsetX = 50;
    const smallOffsetY = 40;
    smallBaseStrokes.forEach((s) => {
      result.push({
        index: idx++,
        d: transformPath(s.d, smallScale, smallOffsetX, smallOffsetY),
        startPoint: {
          x: Math.round(s.startPoint.x * smallScale + smallOffsetX),
          y: Math.round(s.startPoint.y * smallScale + smallOffsetY),
        },
        directionHint: s.directionHint,
      });
    });

    if (result.length > 0) {
      return result;
    }
  }

  // Graceful fallback single stroke if unknown character
  return [
    { index: 1, d: "M 20 50 L 80 50", startPoint: { x: 20, y: 50 }, directionHint: "horizontal" },
  ];
}
