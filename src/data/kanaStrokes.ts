// ==============================================================================
// NIHONGOSETU — AUTHENTIC KANA STROKE ORDER DATA & PATH ENGINE
// Authoritative Japanese stroke sequences, directions, and starting points
// Standard MEXT elementary Kyōiku writing conventions
// ==============================================================================

export interface KanaStroke {
  index: number;
  d: string;
  startPoint: { x: number; y: number };
  directionHint?: "horizontal" | "vertical" | "down-right" | "loop" | "curve";
}

export interface KanaStrokeData {
  char: string;
  romaji: string;
  strokeCount: number;
  viewBox: string; // standard "0 0 100 100"
  strokes: KanaStroke[];
}

// ------------------------------------------------------------------------------
// 1. BASIC HIRAGANA STROKE DATA (46 Characters — 100x100 Coordinate Space)
// ------------------------------------------------------------------------------
export const HIRAGANA_STROKE_DATA: Record<string, KanaStroke[]> = {
  // あ (3 strokes: 1 top horizontal, 2 center vertical down, 3 big bottom-right loop)
  "あ": [
    { index: 1, d: "M 22 32 Q 50 28 78 32", startPoint: { x: 22, y: 32 }, directionHint: "horizontal" },
    { index: 2, d: "M 50 14 Q 50 48 44 86", startPoint: { x: 50, y: 14 }, directionHint: "vertical" },
    { index: 3, d: "M 64 36 C 42 50 28 64 36 76 C 44 86 64 86 76 74 C 84 64 78 48 64 48 C 50 48 40 58 42 74 C 44 82 54 84 62 82", startPoint: { x: 64, y: 36 }, directionHint: "loop" },
  ],
  // い (2 strokes: 1 left curve downwards with hook, 2 right shorter downward curve)
  "い": [
    { index: 1, d: "M 32 24 C 28 46 26 66 36 76 Q 38 70 42 64", startPoint: { x: 32, y: 24 }, directionHint: "vertical" },
    { index: 2, d: "M 68 32 C 72 48 70 60 64 68", startPoint: { x: 68, y: 32 }, directionHint: "curve" },
  ],
  // う (2 strokes: 1 short diagonal top stroke, 2 curving arch down)
  "う": [
    { index: 1, d: "M 44 18 Q 54 22 60 26", startPoint: { x: 44, y: 18 }, directionHint: "down-right" },
    { index: 2, d: "M 34 38 Q 66 32 68 54 C 68 76 46 86 32 82", startPoint: { x: 34, y: 38 }, directionHint: "loop" },
  ],
  // え (2 strokes: 1 short top diagonal, 2 z-shape downward glide)
  "え": [
    { index: 1, d: "M 45 18 Q 53 22 58 26", startPoint: { x: 45, y: 18 }, directionHint: "down-right" },
    { index: 2, d: "M 30 42 L 68 40 L 32 78 Q 56 62 76 78", startPoint: { x: 30, y: 42 }, directionHint: "curve" },
  ],
  // お (3 strokes: 1 top horizontal, 2 center-down-loop-cross, 3 small accent dot)
  "お": [
    { index: 1, d: "M 24 34 Q 48 32 74 34", startPoint: { x: 24, y: 34 }, directionHint: "horizontal" },
    { index: 2, d: "M 48 16 L 48 64 C 48 86 28 86 28 72 C 28 56 52 52 68 64 C 76 72 76 82 68 86", startPoint: { x: 48, y: 16 }, directionHint: "loop" },
    { index: 3, d: "M 74 24 Q 78 30 80 36", startPoint: { x: 74, y: 24 }, directionHint: "down-right" },
  ],
  // か (3 strokes: 1 curve-down-hook, 2 diagonal slash through, 3 right droplet)
  "か": [
    { index: 1, d: "M 28 32 Q 52 28 54 44 C 54 62 48 76 38 84 Q 44 76 46 68", startPoint: { x: 28, y: 32 }, directionHint: "curve" },
    { index: 2, d: "M 42 18 Q 38 46 26 72", startPoint: { x: 42, y: 18 }, directionHint: "vertical" },
    { index: 3, d: "M 68 30 Q 74 38 78 44", startPoint: { x: 68, y: 30 }, directionHint: "down-right" },
  ],
  // き (4 strokes: 1 top horizontal, 2 mid horizontal, 3 diagonal slash with hook, 4 bottom curved bowl)
  "き": [
    { index: 1, d: "M 32 30 Q 52 28 68 30", startPoint: { x: 32, y: 30 }, directionHint: "horizontal" },
    { index: 2, d: "M 28 44 Q 52 42 72 44", startPoint: { x: 28, y: 44 }, directionHint: "horizontal" },
    { index: 3, d: "M 56 16 L 38 64 Q 34 60 30 56", startPoint: { x: 56, y: 16 }, directionHint: "down-right" },
    { index: 4, d: "M 34 70 C 52 84 68 78 68 64", startPoint: { x: 34, y: 70 }, directionHint: "curve" },
  ],
  // く (1 single stroke: diagonal down-left then down-right)
  "く": [
    { index: 1, d: "M 62 20 L 32 50 L 64 80", startPoint: { x: 62, y: 20 }, directionHint: "curve" },
  ],
  // け (3 strokes: 1 left vertical with hook, 2 top horizontal, 3 right curving down)
  "け": [
    { index: 1, d: "M 30 22 C 30 46 28 68 24 78 Q 28 72 32 68", startPoint: { x: 30, y: 22 }, directionHint: "vertical" },
    { index: 2, d: "M 44 36 Q 62 34 76 36", startPoint: { x: 44, y: 36 }, directionHint: "horizontal" },
    { index: 3, d: "M 64 18 Q 62 54 54 82", startPoint: { x: 64, y: 18 }, directionHint: "vertical" },
  ],
  // こ (2 strokes: 1 top horizontal with slight hook, 2 bottom curving horizontal)
  "こ": [
    { index: 1, d: "M 32 32 Q 54 30 68 32 Q 62 38 58 42", startPoint: { x: 32, y: 32 }, directionHint: "horizontal" },
    { index: 2, d: "M 30 68 Q 50 72 68 66", startPoint: { x: 30, y: 68 }, directionHint: "horizontal" },
  ],
  // さ (3 strokes: 1 horizontal, 2 diagonal with hook, 3 detached curve)
  "さ": [
    { index: 1, d: "M 30 36 Q 52 34 70 36", startPoint: { x: 30, y: 36 }, directionHint: "horizontal" },
    { index: 2, d: "M 56 18 L 38 62 Q 34 58 30 54", startPoint: { x: 56, y: 18 }, directionHint: "down-right" },
    { index: 3, d: "M 34 66 C 52 82 70 76 68 62", startPoint: { x: 34, y: 66 }, directionHint: "curve" },
  ],
  // し (1 single stroke: vertical down then curving up to the right)
  "し": [
    { index: 1, d: "M 42 18 L 42 66 C 42 86 64 88 74 72", startPoint: { x: 42, y: 18 }, directionHint: "vertical" },
  ],
  // す (2 strokes: 1 horizontal, 2 vertical with loop and tail)
  "す": [
    { index: 1, d: "M 22 36 Q 50 34 78 36", startPoint: { x: 22, y: 36 }, directionHint: "horizontal" },
    { index: 2, d: "M 52 16 L 52 48 C 52 64 36 64 36 52 C 36 40 60 40 54 62 L 48 86", startPoint: { x: 52, y: 16 }, directionHint: "loop" },
  ],
  // せ (3 strokes: 1 horizontal, 2 right vertical with hook, 3 left vertical-curving)
  "せ": [
    { index: 1, d: "M 26 38 Q 52 36 76 38", startPoint: { x: 26, y: 38 }, directionHint: "horizontal" },
    { index: 2, d: "M 64 22 L 64 68 Q 58 72 52 70", startPoint: { x: 64, y: 22 }, directionHint: "vertical" },
    { index: 3, d: "M 40 18 L 40 70 Q 56 72 74 68", startPoint: { x: 40, y: 18 }, directionHint: "curve" },
  ],
  // そ (1 single continuous zig-zag stroke)
  "そ": [
    { index: 1, d: "M 32 26 L 64 26 L 36 50 L 62 48 C 46 64 34 76 66 82", startPoint: { x: 32, y: 26 }, directionHint: "curve" },
  ],
  // た (4 strokes: 1 top horizontal, 2 diagonal slash, 3 right upper horizontal, 4 right lower curve)
  "た": [
    { index: 1, d: "M 22 36 Q 38 34 50 36", startPoint: { x: 22, y: 36 }, directionHint: "horizontal" },
    { index: 2, d: "M 38 20 Q 34 46 26 74", startPoint: { x: 38, y: 20 }, directionHint: "vertical" },
    { index: 3, d: "M 54 42 Q 66 40 76 42", startPoint: { x: 54, y: 42 }, directionHint: "horizontal" },
    { index: 4, d: "M 52 66 Q 66 70 76 62", startPoint: { x: 52, y: 66 }, directionHint: "horizontal" },
  ],
  // ち (2 strokes: 1 horizontal, 2 vertical curving into crescent loop)
  "ち": [
    { index: 1, d: "M 28 32 Q 50 30 72 32", startPoint: { x: 28, y: 32 }, directionHint: "horizontal" },
    { index: 2, d: "M 50 16 L 42 50 C 64 42 76 60 64 80 C 54 88 36 86 32 76", startPoint: { x: 50, y: 16 }, directionHint: "loop" },
  ],
  // つ (1 single curve)
  "つ": [
    { index: 1, d: "M 28 40 Q 64 28 74 52 C 74 78 44 86 28 76", startPoint: { x: 28, y: 40 }, directionHint: "curve" },
  ],
  // て (1 single stroke: horizontal then large curved bowl)
  "て": [
    { index: 1, d: "M 26 32 L 68 30 L 36 56 C 56 58 74 72 54 84", startPoint: { x: 26, y: 32 }, directionHint: "curve" },
  ],
  // と (2 strokes: 1 short diagonal, 2 open crescent)
  "と": [
    { index: 1, d: "M 40 22 L 52 46", startPoint: { x: 40, y: 22 }, directionHint: "down-right" },
    { index: 2, d: "M 64 38 C 42 54 36 68 44 78 C 52 86 64 82 66 78", startPoint: { x: 64, y: 38 }, directionHint: "curve" },
  ],
  // な (4 strokes: 1 horizontal, 2 slash, 3 dot, 4 loop)
  "な": [
    { index: 1, d: "M 24 36 Q 38 34 50 36", startPoint: { x: 24, y: 36 }, directionHint: "horizontal" },
    { index: 2, d: "M 40 20 Q 34 46 28 72", startPoint: { x: 40, y: 20 }, directionHint: "vertical" },
    { index: 3, d: "M 64 30 Q 70 36 74 40", startPoint: { x: 64, y: 30 }, directionHint: "down-right" },
    { index: 4, d: "M 62 44 L 62 70 C 62 84 50 84 50 74 C 50 66 68 66 68 80", startPoint: { x: 62, y: 44 }, directionHint: "loop" },
  ],
  // に (3 strokes: 1 left vertical with hook, 2 upper right horizontal, 3 lower right horizontal)
  "に": [
    { index: 1, d: "M 30 22 C 30 46 28 68 24 78 Q 28 72 32 68", startPoint: { x: 30, y: 22 }, directionHint: "vertical" },
    { index: 2, d: "M 48 38 Q 62 36 76 38", startPoint: { x: 48, y: 38 }, directionHint: "horizontal" },
    { index: 3, d: "M 46 66 Q 62 70 78 64", startPoint: { x: 46, y: 66 }, directionHint: "horizontal" },
  ],
  // ぬ (2 strokes: 1 diagonal slash, 2 sweeping loop with terminal loop)
  "ぬ": [
    { index: 1, d: "M 38 22 L 28 74", startPoint: { x: 38, y: 22 }, directionHint: "vertical" },
    { index: 2, d: "M 28 38 L 60 32 L 34 76 C 48 52 74 52 74 72 C 74 84 62 84 64 74 C 66 68 78 74 78 84", startPoint: { x: 28, y: 38 }, directionHint: "loop" },
  ],
  // ね (2 strokes: 1 left vertical, 2 zigzag with terminal loop)
  "ね": [
    { index: 1, d: "M 32 18 L 32 80", startPoint: { x: 32, y: 18 }, directionHint: "vertical" },
    { index: 2, d: "M 22 36 L 62 34 L 28 76 C 44 48 68 48 68 68 C 68 80 56 80 58 72 C 60 66 70 72 70 80", startPoint: { x: 22, y: 36 }, directionHint: "loop" },
  ],
  // の (1 single stroke)
  "の": [
    { index: 1, d: "M 52 28 L 40 56 C 28 76 50 86 68 76 C 82 64 78 38 54 38 C 36 38 26 60 34 76", startPoint: { x: 52, y: 28 }, directionHint: "loop" },
  ],
  // は (3 strokes: 1 left vertical with hook, 2 top horizontal, 3 loop)
  "は": [
    { index: 1, d: "M 30 20 C 30 46 28 68 24 78 Q 28 72 32 68", startPoint: { x: 30, y: 20 }, directionHint: "vertical" },
    { index: 2, d: "M 46 36 Q 62 34 76 36", startPoint: { x: 46, y: 36 }, directionHint: "horizontal" },
    { index: 3, d: "M 62 20 L 62 66 C 62 84 44 84 44 70 C 44 58 68 58 66 78", startPoint: { x: 62, y: 20 }, directionHint: "loop" },
  ],
  // ひ (1 single stroke)
  "ひ": [
    { index: 1, d: "M 28 36 L 48 34 L 30 66 C 40 84 66 84 74 60 L 70 34", startPoint: { x: 28, y: 36 }, directionHint: "curve" },
  ],
  // ふ (4 strokes: 1 top dot, 2 center hook, 3 left dot, 4 right dot)
  "ふ": [
    { index: 1, d: "M 48 18 Q 54 22 58 26", startPoint: { x: 48, y: 18 }, directionHint: "down-right" },
    { index: 2, d: "M 50 36 C 50 56 40 64 34 58", startPoint: { x: 50, y: 36 }, directionHint: "curve" },
    { index: 3, d: "M 30 50 Q 26 58 24 66", startPoint: { x: 30, y: 50 }, directionHint: "vertical" },
    { index: 4, d: "M 68 46 Q 74 54 78 62", startPoint: { x: 68, y: 46 }, directionHint: "down-right" },
  ],
  // へ (1 single stroke: hill wave)
  "へ": [
    { index: 1, d: "M 24 56 L 46 32 L 80 64", startPoint: { x: 24, y: 56 }, directionHint: "curve" },
  ],
  // ほ (4 strokes: 1 left vertical with hook, 2 upper horizontal, 3 lower horizontal, 4 center loop)
  "ほ": [
    { index: 1, d: "M 28 20 C 28 46 26 68 22 78 Q 26 72 30 68", startPoint: { x: 28, y: 20 }, directionHint: "vertical" },
    { index: 2, d: "M 44 32 Q 60 30 76 32", startPoint: { x: 44, y: 32 }, directionHint: "horizontal" },
    { index: 3, d: "M 46 48 Q 60 46 74 48", startPoint: { x: 46, y: 48 }, directionHint: "horizontal" },
    { index: 4, d: "M 60 22 L 60 66 C 60 84 44 84 44 70 C 44 58 66 58 64 78", startPoint: { x: 60, y: 22 }, directionHint: "loop" },
  ],
  // ま (3 strokes: 1 upper horizontal, 2 lower horizontal, 3 vertical loop)
  "ま": [
    { index: 1, d: "M 28 32 Q 52 30 74 32", startPoint: { x: 28, y: 32 }, directionHint: "horizontal" },
    { index: 2, d: "M 30 48 Q 52 46 72 48", startPoint: { x: 30, y: 48 }, directionHint: "horizontal" },
    { index: 3, d: "M 52 16 L 52 66 C 52 84 36 84 36 70 C 36 58 58 58 56 78", startPoint: { x: 52, y: 16 }, directionHint: "loop" },
  ],
  // み (2 strokes: 1 horizontal-down-loop-right, 2 slanted vertical)
  "み": [
    { index: 1, d: "M 28 32 L 66 30 L 34 64 C 28 74 42 80 52 70 L 78 70", startPoint: { x: 28, y: 32 }, directionHint: "loop" },
    { index: 2, d: "M 62 44 L 46 84", startPoint: { x: 62, y: 44 }, directionHint: "down-right" },
  ],
  // む (3 strokes: 1 top horizontal, 2 vertical loop with up-right hook, 3 top-right droplet)
  "む": [
    { index: 1, d: "M 26 34 Q 48 32 68 34", startPoint: { x: 26, y: 34 }, directionHint: "horizontal" },
    { index: 2, d: "M 44 20 L 44 66 C 44 82 32 82 32 72 C 32 62 62 62 74 54 L 72 46", startPoint: { x: 44, y: 20 }, directionHint: "loop" },
    { index: 3, d: "M 72 26 Q 76 30 78 34", startPoint: { x: 72, y: 26 }, directionHint: "down-right" },
  ],
  // め (2 strokes: 1 diagonal slash, 2 sweeping oval loop)
  "め": [
    { index: 1, d: "M 38 24 L 28 72", startPoint: { x: 38, y: 24 }, directionHint: "vertical" },
    { index: 2, d: "M 28 40 L 64 30 L 36 74 C 50 52 76 54 72 74 C 68 86 48 84 36 76", startPoint: { x: 28, y: 40 }, directionHint: "loop" },
  ],
  // も (3 strokes: 1 center vertical curve first, 2 top horizontal, 3 bottom horizontal — canonical MEXT order)
  "も": [
    { index: 1, d: "M 48 20 L 48 68 C 48 86 68 86 76 72", startPoint: { x: 48, y: 20 }, directionHint: "vertical" },
    { index: 2, d: "M 30 38 Q 50 36 70 38", startPoint: { x: 30, y: 38 }, directionHint: "horizontal" },
    { index: 3, d: "M 26 54 Q 50 52 74 54", startPoint: { x: 26, y: 54 }, directionHint: "horizontal" },
  ],
  // や (3 strokes: 1 main curve with hook, 2 top accent tick, 3 vertical slice)
  "や": [
    { index: 1, d: "M 26 38 Q 66 28 68 46 L 50 80", startPoint: { x: 26, y: 38 }, directionHint: "curve" },
    { index: 2, d: "M 44 22 L 48 32", startPoint: { x: 44, y: 22 }, directionHint: "down-right" },
    { index: 3, d: "M 56 18 L 34 82", startPoint: { x: 56, y: 18 }, directionHint: "vertical" },
  ],
  // ゆ (2 strokes: 1 vertical-loop-up, 2 long vertical through center)
  "ゆ": [
    { index: 1, d: "M 38 20 L 36 68 C 36 84 58 82 64 64 L 62 38", startPoint: { x: 38, y: 20 }, directionHint: "loop" },
    { index: 2, d: "M 52 16 L 52 84", startPoint: { x: 52, y: 16 }, directionHint: "vertical" },
  ],
  // よ (2 strokes: 1 top horizontal, 2 vertical with loop)
  "よ": [
    { index: 1, d: "M 30 36 Q 44 34 58 36", startPoint: { x: 30, y: 36 }, directionHint: "horizontal" },
    { index: 2, d: "M 52 18 L 52 66 C 52 84 34 84 34 70 C 34 58 64 58 70 68", startPoint: { x: 52, y: 18 }, directionHint: "loop" },
  ],
  // ら (2 strokes: 1 top dot, 2 vertical then crescent bowl)
  "ら": [
    { index: 1, d: "M 44 20 Q 50 24 54 28", startPoint: { x: 44, y: 20 }, directionHint: "down-right" },
    { index: 2, d: "M 36 40 L 54 38 L 38 54 C 58 52 74 66 56 84", startPoint: { x: 36, y: 40 }, directionHint: "curve" },
  ],
  // り (2 strokes: 1 left vertical with hook, 2 right longer vertical curving down-left)
  "り": [
    { index: 1, d: "M 36 26 L 36 56 Q 38 52 42 50", startPoint: { x: 36, y: 26 }, directionHint: "vertical" },
    { index: 2, d: "M 62 18 L 62 60 C 62 78 52 84 40 84", startPoint: { x: 62, y: 18 }, directionHint: "vertical" },
  ],
  // る (1 single stroke with bottom loop)
  "る": [
    { index: 1, d: "M 32 28 L 66 26 L 36 60 C 56 56 74 68 66 84 C 56 92 48 86 52 78 C 56 70 66 76 62 82", startPoint: { x: 32, y: 28 }, directionHint: "loop" },
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
    { index: 1, d: "M 28 30 Q 50 28 72 30", startPoint: { x: 28, y: 30 }, directionHint: "horizontal" },
    { index: 2, d: "M 48 16 L 36 58 Q 50 54 62 52", startPoint: { x: 48, y: 16 }, directionHint: "vertical" },
    { index: 3, d: "M 40 56 C 40 78 66 80 74 70", startPoint: { x: 40, y: 56 }, directionHint: "curve" },
  ],
  // ん (1 single stroke)
  "ん": [
    { index: 1, d: "M 36 26 L 28 76 C 36 60 54 52 58 64 C 62 76 64 82 72 80", startPoint: { x: 36, y: 26 }, directionHint: "curve" },
  ],
};

// ------------------------------------------------------------------------------
// 2. BASIC KATAKANA STROKE DATA (46 Characters — 100x100 Coordinate Space)
// ------------------------------------------------------------------------------
export const KATAKANA_STROKE_DATA: Record<string, KanaStroke[]> = {
  // ア (2 strokes)
  "ア": [
    { index: 1, d: "M 26 28 Q 62 26 66 38 Q 58 52 48 62", startPoint: { x: 26, y: 28 }, directionHint: "curve" },
    { index: 2, d: "M 42 40 C 40 58 34 74 22 82", startPoint: { x: 42, y: 40 }, directionHint: "vertical" },
  ],
  // イ (2 strokes)
  "イ": [
    { index: 1, d: "M 56 20 C 46 36 34 54 22 66", startPoint: { x: 56, y: 20 }, directionHint: "down-right" },
    { index: 2, d: "M 44 42 L 44 84", startPoint: { x: 44, y: 42 }, directionHint: "vertical" },
  ],
  // ウ (3 strokes)
  "ウ": [
    { index: 1, d: "M 48 16 L 48 26", startPoint: { x: 48, y: 16 }, directionHint: "vertical" },
    { index: 2, d: "M 28 34 L 28 46", startPoint: { x: 28, y: 34 }, directionHint: "vertical" },
    { index: 3, d: "M 28 36 Q 66 32 72 44 C 66 64 52 78 36 84", startPoint: { x: 28, y: 36 }, directionHint: "curve" },
  ],
  // エ (3 strokes)
  "エ": [
    { index: 1, d: "M 28 26 Q 50 24 72 26", startPoint: { x: 28, y: 26 }, directionHint: "horizontal" },
    { index: 2, d: "M 50 26 L 50 74", startPoint: { x: 50, y: 26 }, directionHint: "vertical" },
    { index: 3, d: "M 22 74 Q 50 72 78 74", startPoint: { x: 22, y: 74 }, directionHint: "horizontal" },
  ],
  // オ (3 strokes)
  "オ": [
    { index: 1, d: "M 24 32 Q 52 30 76 32", startPoint: { x: 24, y: 32 }, directionHint: "horizontal" },
    { index: 2, d: "M 52 18 L 52 76 Q 46 82 40 78", startPoint: { x: 52, y: 18 }, directionHint: "vertical" },
    { index: 3, d: "M 50 42 C 42 58 32 70 20 78", startPoint: { x: 50, y: 42 }, directionHint: "down-right" },
  ],
  // カ (2 strokes)
  "カ": [
    { index: 1, d: "M 26 32 Q 66 28 68 42 C 68 62 60 76 48 82", startPoint: { x: 26, y: 32 }, directionHint: "curve" },
    { index: 2, d: "M 48 18 C 44 48 34 70 22 80", startPoint: { x: 48, y: 18 }, directionHint: "vertical" },
  ],
  // キ (3 strokes)
  "キ": [
    { index: 1, d: "M 30 32 Q 52 30 70 32", startPoint: { x: 30, y: 32 }, directionHint: "horizontal" },
    { index: 2, d: "M 26 48 Q 52 46 74 48", startPoint: { x: 26, y: 48 }, directionHint: "horizontal" },
    { index: 3, d: "M 54 18 C 50 54 40 72 26 82", startPoint: { x: 54, y: 18 }, directionHint: "vertical" },
  ],
  // ク (2 strokes)
  "ク": [
    { index: 1, d: "M 46 22 C 38 34 30 46 24 54", startPoint: { x: 46, y: 22 }, directionHint: "down-right" },
    { index: 2, d: "M 36 34 Q 68 30 70 42 C 68 64 54 78 36 84", startPoint: { x: 36, y: 34 }, directionHint: "curve" },
  ],
  // ケ (3 strokes)
  "ケ": [
    { index: 1, d: "M 46 20 C 38 34 30 46 22 56", startPoint: { x: 46, y: 20 }, directionHint: "down-right" },
    { index: 2, d: "M 32 40 Q 56 38 78 40", startPoint: { x: 32, y: 40 }, directionHint: "horizontal" },
    { index: 3, d: "M 58 40 C 56 60 48 74 34 82", startPoint: { x: 58, y: 40 }, directionHint: "vertical" },
  ],
  // コ (2 strokes)
  "コ": [
    { index: 1, d: "M 30 28 Q 66 26 68 36 L 68 72", startPoint: { x: 30, y: 28 }, directionHint: "horizontal" },
    { index: 2, d: "M 30 72 Q 52 70 68 72", startPoint: { x: 30, y: 72 }, directionHint: "horizontal" },
  ],
  // サ (3 strokes)
  "サ": [
    { index: 1, d: "M 24 38 Q 52 36 76 38", startPoint: { x: 24, y: 38 }, directionHint: "horizontal" },
    { index: 2, d: "M 40 24 L 38 68", startPoint: { x: 40, y: 24 }, directionHint: "vertical" },
    { index: 3, d: "M 62 26 C 62 52 56 68 44 76", startPoint: { x: 62, y: 26 }, directionHint: "vertical" },
  ],
  // シ (3 strokes)
  "シ": [
    { index: 1, d: "M 32 30 L 40 34", startPoint: { x: 32, y: 30 }, directionHint: "down-right" },
    { index: 2, d: "M 28 48 L 36 52", startPoint: { x: 28, y: 48 }, directionHint: "down-right" },
    { index: 3, d: "M 32 80 C 44 68 58 50 72 32", startPoint: { x: 32, y: 80 }, directionHint: "curve" },
  ],
  // ス (2 strokes)
  "ス": [
    { index: 1, d: "M 28 32 Q 66 28 68 38 L 44 78", startPoint: { x: 28, y: 32 }, directionHint: "curve" },
    { index: 2, d: "M 52 54 C 60 64 70 74 78 80", startPoint: { x: 52, y: 54 }, directionHint: "down-right" },
  ],
  // セ (2 strokes)
  "セ": [
    { index: 1, d: "M 26 36 Q 66 32 68 44 L 68 64 Q 60 66 54 66", startPoint: { x: 26, y: 36 }, directionHint: "horizontal" },
    { index: 2, d: "M 44 20 L 44 72 Q 58 74 76 72", startPoint: { x: 44, y: 20 }, directionHint: "vertical" },
  ],
  // ソ (2 strokes)
  "ソ": [
    { index: 1, d: "M 36 28 L 46 38", startPoint: { x: 36, y: 28 }, directionHint: "down-right" },
    { index: 2, d: "M 66 24 C 54 48 42 66 26 80", startPoint: { x: 66, y: 24 }, directionHint: "down-right" },
  ],
  // タ (3 strokes)
  "タ": [
    { index: 1, d: "M 44 20 C 36 34 28 46 22 56", startPoint: { x: 44, y: 20 }, directionHint: "down-right" },
    { index: 2, d: "M 32 38 Q 66 34 68 44 C 66 64 52 76 34 82", startPoint: { x: 32, y: 38 }, directionHint: "curve" },
    { index: 3, d: "M 42 54 L 62 64", startPoint: { x: 42, y: 54 }, directionHint: "down-right" },
  ],
  // チ (3 strokes)
  "チ": [
    { index: 1, d: "M 66 22 L 32 32", startPoint: { x: 66, y: 22 }, directionHint: "horizontal" },
    { index: 2, d: "M 24 48 Q 52 46 76 48", startPoint: { x: 24, y: 48 }, directionHint: "horizontal" },
    { index: 3, d: "M 52 34 C 50 60 40 74 24 82", startPoint: { x: 52, y: 34 }, directionHint: "vertical" },
  ],
  // ツ (3 strokes)
  "ツ": [
    { index: 1, d: "M 32 26 L 38 36", startPoint: { x: 32, y: 26 }, directionHint: "down-right" },
    { index: 2, d: "M 48 30 L 54 42", startPoint: { x: 48, y: 30 }, directionHint: "down-right" },
    { index: 3, d: "M 72 26 C 60 50 48 68 28 80", startPoint: { x: 72, y: 26 }, directionHint: "down-right" },
  ],
  // テ (3 strokes)
  "テ": [
    { index: 1, d: "M 32 28 Q 50 26 68 28", startPoint: { x: 32, y: 28 }, directionHint: "horizontal" },
    { index: 2, d: "M 22 46 Q 52 44 78 46", startPoint: { x: 22, y: 46 }, directionHint: "horizontal" },
    { index: 3, d: "M 50 46 C 46 64 38 74 24 82", startPoint: { x: 50, y: 46 }, directionHint: "vertical" },
  ],
  // ト (2 strokes)
  "ト": [
    { index: 1, d: "M 44 18 L 44 82", startPoint: { x: 44, y: 18 }, directionHint: "vertical" },
    { index: 2, d: "M 44 44 L 72 58", startPoint: { x: 44, y: 44 }, directionHint: "down-right" },
  ],
  // ナ (2 strokes)
  "ナ": [
    { index: 1, d: "M 24 38 Q 52 36 76 38", startPoint: { x: 24, y: 38 }, directionHint: "horizontal" },
    { index: 2, d: "M 46 22 C 44 48 36 68 22 80", startPoint: { x: 46, y: 22 }, directionHint: "vertical" },
  ],
  // ニ (2 strokes)
  "ニ": [
    { index: 1, d: "M 30 36 Q 50 34 70 36", startPoint: { x: 30, y: 36 }, directionHint: "horizontal" },
    { index: 2, d: "M 22 66 Q 50 64 78 66", startPoint: { x: 22, y: 66 }, directionHint: "horizontal" },
  ],
  // ヌ (2 strokes)
  "ヌ": [
    { index: 1, d: "M 26 34 Q 64 30 66 40 L 44 78", startPoint: { x: 26, y: 34 }, directionHint: "curve" },
    { index: 2, d: "M 40 48 L 74 72", startPoint: { x: 40, y: 48 }, directionHint: "down-right" },
  ],
  // ネ (4 strokes)
  "ネ": [
    { index: 1, d: "M 42 18 L 42 26", startPoint: { x: 42, y: 18 }, directionHint: "vertical" },
    { index: 2, d: "M 28 34 Q 54 32 56 40 L 32 78", startPoint: { x: 28, y: 34 }, directionHint: "curve" },
    { index: 3, d: "M 42 44 L 42 82", startPoint: { x: 42, y: 44 }, directionHint: "vertical" },
    { index: 4, d: "M 52 56 L 70 74", startPoint: { x: 52, y: 56 }, directionHint: "down-right" },
  ],
  // ノ (1 single stroke)
  "ノ": [
    { index: 1, d: "M 66 22 C 54 44 40 64 22 80", startPoint: { x: 66, y: 22 }, directionHint: "down-right" },
  ],
  // ハ (2 strokes)
  "ハ": [
    { index: 1, d: "M 40 32 C 34 50 26 66 18 76", startPoint: { x: 40, y: 32 }, directionHint: "down-right" },
    { index: 2, d: "M 60 32 C 64 50 72 66 82 76", startPoint: { x: 60, y: 32 }, directionHint: "down-right" },
  ],
  // ヒ (2 strokes)
  "ヒ": [
    { index: 1, d: "M 30 32 Q 52 30 68 32", startPoint: { x: 30, y: 32 }, directionHint: "horizontal" },
    { index: 2, d: "M 38 22 L 38 68 Q 56 70 74 66", startPoint: { x: 38, y: 22 }, directionHint: "vertical" },
  ],
  // フ (1 single stroke)
  "フ": [
    { index: 1, d: "M 26 30 Q 66 26 68 38 C 66 58 54 74 36 82", startPoint: { x: 26, y: 30 }, directionHint: "curve" },
  ],
  // ヘ (1 single stroke)
  "ヘ": [
    { index: 1, d: "M 24 54 L 46 32 L 78 62", startPoint: { x: 24, y: 54 }, directionHint: "curve" },
  ],
  // ホ (4 strokes)
  "ホ": [
    { index: 1, d: "M 24 32 Q 50 30 76 32", startPoint: { x: 24, y: 32 }, directionHint: "horizontal" },
    { index: 2, d: "M 50 18 L 50 78 Q 44 82 38 78", startPoint: { x: 50, y: 18 }, directionHint: "vertical" },
    { index: 3, d: "M 34 46 C 30 58 26 68 20 74", startPoint: { x: 34, y: 46 }, directionHint: "down-right" },
    { index: 4, d: "M 66 46 C 70 58 74 68 80 74", startPoint: { x: 66, y: 46 }, directionHint: "down-right" },
  ],
  // マ (2 strokes)
  "マ": [
    { index: 1, d: "M 26 32 Q 66 28 68 40 L 46 64", startPoint: { x: 26, y: 32 }, directionHint: "curve" },
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
    { index: 1, d: "M 48 22 L 30 60 Q 64 54 74 60", startPoint: { x: 48, y: 22 }, directionHint: "curve" },
    { index: 2, d: "M 60 46 L 72 66", startPoint: { x: 60, y: 46 }, directionHint: "down-right" },
  ],
  // メ (2 strokes)
  "メ": [
    { index: 1, d: "M 64 24 C 52 46 40 66 24 80", startPoint: { x: 64, y: 24 }, directionHint: "down-right" },
    { index: 2, d: "M 34 38 L 70 72", startPoint: { x: 34, y: 38 }, directionHint: "down-right" },
  ],
  // モ (3 strokes)
  "モ": [
    { index: 1, d: "M 28 32 Q 52 30 72 32", startPoint: { x: 28, y: 32 }, directionHint: "horizontal" },
    { index: 2, d: "M 22 48 Q 52 46 78 48", startPoint: { x: 22, y: 48 }, directionHint: "horizontal" },
    { index: 3, d: "M 46 20 L 46 70 Q 58 72 74 68", startPoint: { x: 46, y: 20 }, directionHint: "vertical" },
  ],
  // ヤ (2 strokes)
  "ヤ": [
    { index: 1, d: "M 26 38 Q 64 30 66 46 L 50 78", startPoint: { x: 26, y: 38 }, directionHint: "curve" },
    { index: 2, d: "M 48 22 L 36 78", startPoint: { x: 48, y: 22 }, directionHint: "vertical" },
  ],
  // ユ (2 strokes)
  "ユ": [
    { index: 1, d: "M 32 30 L 66 30 L 66 58 L 32 58", startPoint: { x: 32, y: 30 }, directionHint: "horizontal" },
    { index: 2, d: "M 46 46 L 46 76 L 76 76", startPoint: { x: 46, y: 46 }, directionHint: "vertical" },
  ],
  // ヨ (3 strokes)
  "ヨ": [
    { index: 1, d: "M 32 28 Q 66 26 68 36 L 68 72 Q 48 74 32 72", startPoint: { x: 32, y: 28 }, directionHint: "horizontal" },
    { index: 2, d: "M 32 50 Q 52 48 66 50", startPoint: { x: 32, y: 50 }, directionHint: "horizontal" },
    { index: 3, d: "M 32 72 L 32 28", startPoint: { x: 32, y: 72 }, directionHint: "vertical" },
  ],
  // ラ (2 strokes)
  "ラ": [
    { index: 1, d: "M 32 26 Q 52 24 68 26", startPoint: { x: 32, y: 26 }, directionHint: "horizontal" },
    { index: 2, d: "M 46 38 Q 68 36 68 46 C 66 66 52 78 34 84", startPoint: { x: 46, y: 38 }, directionHint: "curve" },
  ],
  // リ (2 strokes)
  "リ": [
    { index: 1, d: "M 38 28 L 38 56", startPoint: { x: 38, y: 28 }, directionHint: "vertical" },
    { index: 2, d: "M 62 22 C 62 52 56 74 42 82", startPoint: { x: 62, y: 22 }, directionHint: "vertical" },
  ],
  // ル (2 strokes)
  "ル": [
    { index: 1, d: "M 38 24 C 36 46 32 64 24 78", startPoint: { x: 38, y: 24 }, directionHint: "vertical" },
    { index: 2, d: "M 58 20 L 58 68 Q 64 78 74 72", startPoint: { x: 58, y: 20 }, directionHint: "vertical" },
  ],
  // レ (1 single stroke)
  "レ": [
    { index: 1, d: "M 42 22 L 42 74 Q 56 76 74 70", startPoint: { x: 42, y: 22 }, directionHint: "vertical" },
  ],
  // ロ (3 strokes)
  "ロ": [
    { index: 1, d: "M 32 28 L 32 74", startPoint: { x: 32, y: 28 }, directionHint: "vertical" },
    { index: 2, d: "M 32 28 Q 68 26 70 36 L 70 74", startPoint: { x: 32, y: 28 }, directionHint: "horizontal" },
    { index: 3, d: "M 32 74 Q 52 72 70 74", startPoint: { x: 32, y: 74 }, directionHint: "horizontal" },
  ],
  // ワ (2 strokes)
  "ワ": [
    { index: 1, d: "M 30 32 L 30 52", startPoint: { x: 30, y: 32 }, directionHint: "vertical" },
    { index: 2, d: "M 30 32 Q 68 28 70 42 C 68 64 54 78 34 84", startPoint: { x: 30, y: 32 }, directionHint: "curve" },
  ],
  // ヲ (3 strokes)
  "ヲ": [
    { index: 1, d: "M 28 32 Q 52 30 74 32", startPoint: { x: 28, y: 32 }, directionHint: "horizontal" },
    { index: 2, d: "M 30 48 Q 50 46 68 48", startPoint: { x: 30, y: 48 }, directionHint: "horizontal" },
    { index: 3, d: "M 56 32 C 54 54 44 72 28 82", startPoint: { x: 56, y: 32 }, directionHint: "vertical" },
  ],
  // ン (2 strokes)
  "ン": [
    { index: 1, d: "M 32 34 L 42 42", startPoint: { x: 32, y: 34 }, directionHint: "down-right" },
    { index: 2, d: "M 30 78 C 42 66 56 48 72 28", startPoint: { x: 30, y: 78 }, directionHint: "curve" },
  ],
};

// ------------------------------------------------------------------------------
// 3. DIACRITIC BASE MAPPINGS (Dakuten / Handakuten / Small Kana roots)
// ------------------------------------------------------------------------------
const DAKUTEN_BASE_MAP: Record<string, { base: string; type: "dakuten" | "handakuten" }> = {
  // Hiragana Dakuten
  "が": { base: "か", type: "dakuten" },
  "ぎ": { base: "き", type: "dakuten" },
  "ぐ": { base: "く", type: "dakuten" },
  "げ": { base: "け", type: "dakuten" },
  "ご": { base: "こ", type: "dakuten" },
  "ざ": { base: "さ", type: "dakuten" },
  "じ": { base: "し", type: "dakuten" },
  "ず": { base: "す", type: "dakuten" },
  "ぜ": { base: "せ", type: "dakuten" },
  "ぞ": { base: "そ", type: "dakuten" },
  "だ": { base: "た", type: "dakuten" },
  "ぢ": { base: "ち", type: "dakuten" },
  "づ": { base: "つ", type: "dakuten" },
  "で": { base: "て", type: "dakuten" },
  "ど": { base: "と", type: "dakuten" },
  "ば": { base: "は", type: "dakuten" },
  "び": { base: "ひ", type: "dakuten" },
  "ぶ": { base: "ふ", type: "dakuten" },
  "べ": { base: "へ", type: "dakuten" },
  "ぼ": { base: "ほ", type: "dakuten" },
  // Hiragana Handakuten
  "ぱ": { base: "は", type: "handakuten" },
  "ぴ": { base: "ひ", type: "handakuten" },
  "ぷ": { base: "ふ", type: "handakuten" },
  "ぺ": { base: "へ", type: "handakuten" },
  "ぽ": { base: "ほ", type: "handakuten" },

  // Katakana Dakuten
  "ガ": { base: "カ", type: "dakuten" },
  "ギ": { base: "キ", type: "dakuten" },
  "グ": { base: "ク", type: "dakuten" },
  "ゲ": { base: "ケ", type: "dakuten" },
  "ゴ": { base: "コ", type: "dakuten" },
  "ザ": { base: "サ", type: "dakuten" },
  "ジ": { base: "シ", type: "dakuten" },
  "ズ": { base: "ス", type: "dakuten" },
  "ゼ": { base: "セ", type: "dakuten" },
  "ゾ": { base: "ソ", type: "dakuten" },
  "ダ": { base: "タ", type: "dakuten" },
  "ヂ": { base: "チ", type: "dakuten" },
  "ヅ": { base: "ツ", type: "dakuten" },
  "デ": { base: "テ", type: "dakuten" },
  "ド": { base: "ト", type: "dakuten" },
  "バ": { base: "ハ", type: "dakuten" },
  "ビ": { base: "ヒ", type: "dakuten" },
  "ブ": { base: "フ", type: "dakuten" },
  "ベ": { base: "ヘ", type: "dakuten" },
  "ボ": { base: "ホ", type: "dakuten" },
  // Katakana Handakuten
  "パ": { base: "ハ", type: "handakuten" },
  "ピ": { base: "ヒ", type: "handakuten" },
  "プ": { base: "フ", type: "handakuten" },
  "ペ": { base: "ヘ", type: "handakuten" },
  "ポ": { base: "ホ", type: "handakuten" },
};

const SMALL_KANA_BASE_MAP: Record<string, string> = {
  "ぁ": "あ", "ぃ": "い", "ぅ": "う", "ぇ": "え", "ぉ": "お",
  "ゃ": "や", "ゅ": "ゆ", "ょ": "よ", "っ": "つ",
  "ァ": "ア", "ィ": "イ", "ゥ": "ウ", "ェ": "エ", "ォ": "オ",
  "ャ": "ヤ", "ュ": "ユ", "ョ": "ヨ", "ッ": "ツ",
};

// SVG path transformation helper: scales and offsets an SVG path string
function transformPath(d: string, scale: number, offsetX: number, offsetY: number): string {
  return d.replace(/([0-9.]+)\s+([0-9.]+)/g, (_match, xStr, yStr) => {
    const x = Math.round(parseFloat(xStr) * scale + offsetX);
    const y = Math.round(parseFloat(yStr) * scale + offsetY);
    return `${x} ${y}`;
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
    const { base, type } = DAKUTEN_BASE_MAP[char];
    const baseStrokes = dictionary[base] || [];
    const result: KanaStroke[] = [];
    let idx = 1;

    // Base character strokes come first (1..N)
    baseStrokes.forEach((s) => {
      result.push({
        index: idx++,
        d: s.d,
        startPoint: s.startPoint,
        directionHint: s.directionHint,
      });
    });

    if (type === "dakuten") {
      // Stroke N+1: Upper Dakuten tick
      result.push({
        index: idx++,
        d: "M 74 14 L 84 20",
        startPoint: { x: 74, y: 14 },
        directionHint: "down-right",
      });
      // Stroke N+2: Lower Dakuten tick
      result.push({
        index: idx++,
        d: "M 70 24 L 80 30",
        startPoint: { x: 70, y: 24 },
        directionHint: "down-right",
      });
    } else {
      // Stroke N+1: Handakuten circle (maru)
      result.push({
        index: idx++,
        d: "M 78 14 A 5.5 5.5 0 1 1 77.9 14",
        startPoint: { x: 78, y: 14 },
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

  // 4. Yōon Combinations (Two-character pairs, e.g. "きゃ", "キャ")
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

    // Left character: 0.65 scale, shifted left
    const baseScale = 0.65;
    const baseOffsetX = 2;
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

    // Right character (Small Kana): 0.50 scale, shifted bottom-right
    const smallScale = 0.50;
    const smallOffsetX = 48;
    const smallOffsetY = 36;
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

  // Graceful fallback single stroke if completely unknown character
  return [
    { index: 1, d: "M 20 50 L 80 50", startPoint: { x: 20, y: 50 }, directionHint: "horizontal" },
  ];
}
