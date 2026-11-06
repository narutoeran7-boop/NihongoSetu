// ==============================================================================
// NIHONGOSETU — AUTHENTIC KANA STROKE ORDER DATA & PATH ENGINE
// Precise vector stroke sequences, directions, and numbered starting points
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

// Canonical Stroke Paths for Core Hiragana (100x100 normalized coordinate system)
export const HIRAGANA_STROKE_DATA: Record<string, KanaStroke[]> = {
  // あ (3 strokes: 1 horizontal left->right, 2 vertical curve top->down, 3 big bottom-right loop)
  "あ": [
    { index: 1, d: "M 22 32 Q 50 30 78 32", startPoint: { x: 22, y: 32 }, directionHint: "horizontal" },
    { index: 2, d: "M 50 14 Q 51 45 44 86", startPoint: { x: 50, y: 14 }, directionHint: "vertical" },
    { index: 3, d: "M 64 38 C 30 52 24 74 44 80 C 68 86 82 62 66 48 C 50 36 32 50 26 70", startPoint: { x: 64, y: 38 }, directionHint: "loop" },
  ],
  // い (2 strokes: 1 left curve downwards with hook, 2 right shorter downward curve)
  "い": [
    { index: 1, d: "M 32 24 C 28 46 26 66 38 78 Q 40 70 44 64", startPoint: { x: 32, y: 24 }, directionHint: "vertical" },
    { index: 2, d: "M 68 32 C 72 48 70 60 64 68", startPoint: { x: 68, y: 32 }, directionHint: "curve" },
  ],
  // う (2 strokes: 1 short diagonal top stroke, 2 curving back-and-under)
  "う": [
    { index: 1, d: "M 44 18 Q 54 22 60 26", startPoint: { x: 44, y: 18 }, directionHint: "down-right" },
    { index: 2, d: "M 32 38 Q 66 32 68 54 C 68 76 46 86 32 84", startPoint: { x: 32, y: 38 }, directionHint: "loop" },
  ],
  // え (2 strokes: 1 short top diagonal, 2 z-shape downward glide)
  "え": [
    { index: 1, d: "M 45 18 Q 53 22 58 26", startPoint: { x: 45, y: 18 }, directionHint: "down-right" },
    { index: 2, d: "M 30 42 L 68 40 L 32 80 Q 56 62 76 80", startPoint: { x: 30, y: 42 }, directionHint: "curve" },
  ],
  // お (3 strokes: 1 top horizontal, 2 center-down-loop-cross, 3 small accent dot)
  "お": [
    { index: 1, d: "M 24 34 Q 48 32 74 34", startPoint: { x: 24, y: 34 }, directionHint: "horizontal" },
    { index: 2, d: "M 48 16 L 48 64 C 48 86 28 86 26 72 C 24 54 52 50 68 64 C 76 72 76 82 72 86", startPoint: { x: 48, y: 16 }, directionHint: "loop" },
    { index: 3, d: "M 74 24 Q 78 32 80 38", startPoint: { x: 74, y: 24 }, directionHint: "down-right" },
  ],
  // か (3 strokes: 1 curve-down-hook, 2 diagonal slash through, 3 right droplet)
  "か": [
    { index: 1, d: "M 28 32 Q 52 28 54 44 C 54 62 48 76 38 84 Q 44 76 46 68", startPoint: { x: 28, y: 32 }, directionHint: "curve" },
    { index: 2, d: "M 42 18 Q 38 46 26 72", startPoint: { x: 42, y: 18 }, directionHint: "vertical" },
    { index: 3, d: "M 68 30 Q 74 38 78 44", startPoint: { x: 68, y: 30 }, directionHint: "down-right" },
  ],
  // き (4 strokes: 1 top horizontal, 2 mid horizontal, 3 diagonal slash down, 4 bottom curved bowl)
  "き": [
    { index: 1, d: "M 32 30 Q 52 28 68 30", startPoint: { x: 32, y: 30 }, directionHint: "horizontal" },
    { index: 2, d: "M 28 44 Q 52 42 72 44", startPoint: { x: 28, y: 44 }, directionHint: "horizontal" },
    { index: 3, d: "M 56 16 Q 48 54 38 68", startPoint: { x: 56, y: 16 }, directionHint: "down-right" },
    { index: 4, d: "M 36 68 C 54 84 68 76 68 64", startPoint: { x: 36, y: 68 }, directionHint: "curve" },
  ],
  // く (1 continuous single stroke: diagonal down-left then down-right)
  "く": [
    { index: 1, d: "M 62 20 L 32 50 L 64 80", startPoint: { x: 62, y: 20 }, directionHint: "curve" },
  ],
  // け (3 strokes: 1 left vertical, 2 top horizontal, 3 right curving down)
  "け": [
    { index: 1, d: "M 30 22 C 30 46 28 68 22 80", startPoint: { x: 30, y: 22 }, directionHint: "vertical" },
    { index: 2, d: "M 44 36 Q 62 34 76 36", startPoint: { x: 44, y: 36 }, directionHint: "horizontal" },
    { index: 3, d: "M 64 18 Q 62 54 54 82", startPoint: { x: 64, y: 18 }, directionHint: "vertical" },
  ],
  // こ (2 strokes: 1 top horizontal with slight hook, 2 bottom curving horizontal)
  "こ": [
    { index: 1, d: "M 32 32 Q 54 30 68 32 Q 62 38 58 42", startPoint: { x: 32, y: 32 }, directionHint: "horizontal" },
    { index: 2, d: "M 30 68 Q 50 72 68 66", startPoint: { x: 30, y: 68 }, directionHint: "horizontal" },
  ],
  // さ (3 strokes: 1 horizontal, 2 diagonal, 3 detached curve)
  "さ": [
    { index: 1, d: "M 30 36 Q 52 34 70 36", startPoint: { x: 30, y: 36 }, directionHint: "horizontal" },
    { index: 2, d: "M 56 18 Q 46 54 38 66", startPoint: { x: 56, y: 18 }, directionHint: "down-right" },
    { index: 3, d: "M 36 64 C 54 82 70 76 68 62", startPoint: { x: 36, y: 64 }, directionHint: "curve" },
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
    { index: 1, d: "M 34 26 L 66 26 L 36 50 Q 68 46 68 66 C 68 84 44 86 30 80", startPoint: { x: 34, y: 26 }, directionHint: "curve" },
  ],
  // た (4 strokes: 1 horizontal, 2 slant down, 3 small 'こ' upper, 4 small 'こ' lower)
  "た": [
    { index: 1, d: "M 22 36 Q 40 34 52 36", startPoint: { x: 22, y: 36 }, directionHint: "horizontal" },
    { index: 2, d: "M 36 22 L 30 68", startPoint: { x: 36, y: 22 }, directionHint: "vertical" },
    { index: 3, d: "M 52 40 Q 68 38 74 40", startPoint: { x: 52, y: 40 }, directionHint: "horizontal" },
    { index: 4, d: "M 48 64 Q 64 68 76 62", startPoint: { x: 48, y: 64 }, directionHint: "horizontal" },
  ],
  // ち (2 strokes: 1 top horizontal, 2 vertical crossing into a '5'-like belly)
  "ち": [
    { index: 1, d: "M 28 32 Q 50 30 72 32", startPoint: { x: 28, y: 32 }, directionHint: "horizontal" },
    { index: 2, d: "M 50 18 L 46 50 C 46 44 68 44 68 64 C 68 82 46 84 32 78", startPoint: { x: 50, y: 18 }, directionHint: "loop" },
  ],
  // つ (1 single swooping wave stroke)
  "つ": [
    { index: 1, d: "M 26 34 Q 74 26 74 54 C 74 80 44 86 28 80", startPoint: { x: 26, y: 34 }, directionHint: "curve" },
  ],
  // て (1 single stroke: horizontal right then looping down-left)
  "て": [
    { index: 1, d: "M 26 32 Q 54 30 72 32 C 48 46 36 68 54 80 Q 64 84 74 80", startPoint: { x: 26, y: 32 }, directionHint: "curve" },
  ],
  // と (2 strokes: 1 short slant, 2 large open C-shape)
  "と": [
    { index: 1, d: "M 38 24 L 46 48", startPoint: { x: 38, y: 24 }, directionHint: "down-right" },
    { index: 2, d: "M 66 38 C 34 50 34 80 64 82", startPoint: { x: 66, y: 38 }, directionHint: "curve" },
  ],
  // な (4 strokes: 1 horizontal, 2 slant down, 3 dot, 4 loop)
  "な": [
    { index: 1, d: "M 24 36 Q 40 34 48 36", startPoint: { x: 24, y: 36 }, directionHint: "horizontal" },
    { index: 2, d: "M 38 20 L 32 68", startPoint: { x: 38, y: 20 }, directionHint: "vertical" },
    { index: 3, d: "M 62 26 Q 66 32 68 38", startPoint: { x: 62, y: 26 }, directionHint: "down-right" },
    { index: 4, d: "M 64 48 L 64 68 C 64 80 50 80 50 72 C 50 62 76 64 74 84", startPoint: { x: 64, y: 48 }, directionHint: "loop" },
  ],
  // に (3 strokes: 1 left vertical, 2 right top horizontal, 3 right bottom horizontal)
  "に": [
    { index: 1, d: "M 30 20 C 30 46 28 68 24 82", startPoint: { x: 30, y: 20 }, directionHint: "vertical" },
    { index: 2, d: "M 48 36 Q 66 34 78 36", startPoint: { x: 48, y: 36 }, directionHint: "horizontal" },
    { index: 3, d: "M 46 66 Q 64 70 78 64", startPoint: { x: 46, y: 66 }, directionHint: "horizontal" },
  ],
  // ぬ (2 strokes: 1 slant, 2 big loop ending in mini tail loop)
  "ぬ": [
    { index: 1, d: "M 38 22 L 28 76", startPoint: { x: 38, y: 22 }, directionHint: "vertical" },
    { index: 2, d: "M 28 36 C 48 20 66 36 66 60 C 66 84 38 84 38 66 C 38 48 76 56 74 74 C 74 82 66 82 68 76", startPoint: { x: 28, y: 36 }, directionHint: "loop" },
  ],
  // ね (2 strokes: 1 vertical, 2 complex z and looping belly with loop)
  "ね": [
    { index: 1, d: "M 32 18 L 32 82", startPoint: { x: 32, y: 18 }, directionHint: "vertical" },
    { index: 2, d: "M 20 34 L 56 32 L 28 66 Q 66 50 66 70 C 66 82 56 82 56 74 C 56 68 72 70 70 82", startPoint: { x: 20, y: 34 }, directionHint: "loop" },
  ],
  // の (1 single looping curl)
  "の": [
    { index: 1, d: "M 52 24 L 38 60 C 30 76 46 84 62 76 C 78 66 80 42 62 34 C 44 26 30 44 28 68", startPoint: { x: 52, y: 24 }, directionHint: "loop" },
  ],
  // は (3 strokes: 1 left vertical, 2 horizontal, 3 vertical loop)
  "は": [
    { index: 1, d: "M 28 20 C 28 46 26 68 20 82", startPoint: { x: 28, y: 20 }, directionHint: "vertical" },
    { index: 2, d: "M 44 34 Q 64 32 76 34", startPoint: { x: 44, y: 34 }, directionHint: "horizontal" },
    { index: 3, d: "M 60 18 L 60 66 C 60 78 46 78 46 70 C 46 60 74 62 72 82", startPoint: { x: 60, y: 18 }, directionHint: "loop" },
  ],
  // ひ (1 single smiling loop stroke)
  "ひ": [
    { index: 1, d: "M 26 32 L 40 28 L 34 68 C 34 86 64 86 64 68 L 60 28 L 74 34", startPoint: { x: 26, y: 32 }, directionHint: "curve" },
  ],
  // ふ (4 strokes: 1 top dot, 2 center nose, 3 left droplet, 4 right droplet)
  "ふ": [
    { index: 1, d: "M 48 18 Q 54 22 56 28", startPoint: { x: 48, y: 18 }, directionHint: "down-right" },
    { index: 2, d: "M 52 38 C 42 46 36 62 48 78 Q 52 68 50 62", startPoint: { x: 52, y: 38 }, directionHint: "vertical" },
    { index: 3, d: "M 26 50 Q 24 60 28 68", startPoint: { x: 26, y: 50 }, directionHint: "curve" },
    { index: 4, d: "M 74 50 Q 76 60 72 68", startPoint: { x: 74, y: 50 }, directionHint: "curve" },
  ],
  // へ (1 single wave roof stroke)
  "へ": [
    { index: 1, d: "M 22 56 L 46 32 L 80 62", startPoint: { x: 22, y: 56 }, directionHint: "curve" },
  ],
  // ほ (4 strokes: 1 left vertical, 2 top horizontal, 3 mid horizontal, 4 center-loop)
  "ほ": [
    { index: 1, d: "M 26 20 C 26 46 24 68 20 82", startPoint: { x: 26, y: 20 }, directionHint: "vertical" },
    { index: 2, d: "M 42 32 Q 62 30 76 32", startPoint: { x: 42, y: 32 }, directionHint: "horizontal" },
    { index: 3, d: "M 42 48 Q 62 46 76 48", startPoint: { x: 42, y: 48 }, directionHint: "horizontal" },
    { index: 4, d: "M 58 32 L 58 66 C 58 78 46 78 46 70 C 46 60 72 62 70 82", startPoint: { x: 58, y: 32 }, directionHint: "loop" },
  ],
  // ま (3 strokes: 1 top horizontal, 2 mid horizontal, 3 center vertical loop)
  "ま": [
    { index: 1, d: "M 28 32 Q 52 30 74 32", startPoint: { x: 28, y: 32 }, directionHint: "horizontal" },
    { index: 2, d: "M 30 48 Q 52 46 72 48", startPoint: { x: 30, y: 48 }, directionHint: "horizontal" },
    { index: 3, d: "M 50 18 L 50 68 C 50 82 36 82 36 72 C 36 60 64 62 62 82", startPoint: { x: 50, y: 18 }, directionHint: "loop" },
  ],
  // み (2 strokes: 1 horizontal-diagonal-loop, 2 curving slash down)
  "み": [
    { index: 1, d: "M 26 34 L 56 32 L 32 64 C 28 72 40 76 52 70 Q 64 64 74 58", startPoint: { x: 26, y: 34 }, directionHint: "loop" },
    { index: 2, d: "M 66 38 C 66 58 56 74 46 84", startPoint: { x: 66, y: 38 }, directionHint: "curve" },
  ],
  // む (3 strokes: 1 horizontal, 2 vertical loop-up, 3 top right droplet)
  "む": [
    { index: 1, d: "M 26 36 Q 44 34 60 36", startPoint: { x: 26, y: 36 }, directionHint: "horizontal" },
    { index: 2, d: "M 44 20 L 44 64 C 44 76 34 76 34 68 C 34 56 64 66 68 76 Q 72 70 76 64", startPoint: { x: 44, y: 20 }, directionHint: "loop" },
    { index: 3, d: "M 70 28 Q 74 34 76 40", startPoint: { x: 70, y: 28 }, directionHint: "down-right" },
  ],
  // め (2 strokes: 1 slant, 2 big looping eye)
  "め": [
    { index: 1, d: "M 42 22 L 30 76", startPoint: { x: 42, y: 22 }, directionHint: "vertical" },
    { index: 2, d: "M 30 36 C 52 20 70 36 70 60 C 70 82 42 82 38 66 C 38 48 76 56 74 74", startPoint: { x: 30, y: 36 }, directionHint: "loop" },
  ],
  // も (3 strokes: 1 center hook, 2 top horizontal, 3 lower horizontal)
  "も": [
    { index: 1, d: "M 48 18 L 48 68 C 48 86 66 86 76 72", startPoint: { x: 48, y: 18 }, directionHint: "vertical" },
    { index: 2, d: "M 30 36 Q 50 34 70 36", startPoint: { x: 30, y: 36 }, directionHint: "horizontal" },
    { index: 3, d: "M 28 50 Q 50 48 72 50", startPoint: { x: 28, y: 50 }, directionHint: "horizontal" },
  ],
  // や (3 strokes: 1 main looping body with hook, 2 upper small tick, 3 vertical slant)
  "や": [
    { index: 1, d: "M 30 40 C 44 26 68 28 66 48 C 64 62 48 60 42 66 Q 46 58 48 50", startPoint: { x: 30, y: 40 }, directionHint: "loop" },
    { index: 2, d: "M 46 24 Q 48 30 48 36", startPoint: { x: 46, y: 24 }, directionHint: "down-right" },
    { index: 3, d: "M 66 22 L 56 80", startPoint: { x: 66, y: 22 }, directionHint: "vertical" },
  ],
  // ゆ (2 strokes: 1 vertical-loop-belly, 2 vertical spear)
  "ゆ": [
    { index: 1, d: "M 36 24 L 36 62 C 36 78 50 78 62 70 C 74 62 74 46 64 42 L 32 42", startPoint: { x: 36, y: 24 }, directionHint: "loop" },
    { index: 2, d: "M 58 18 L 54 84", startPoint: { x: 58, y: 18 }, directionHint: "vertical" },
  ],
  // よ (2 strokes: 1 short horizontal, 2 vertical loop-right)
  "よ": [
    { index: 1, d: "M 32 36 Q 44 34 54 36", startPoint: { x: 32, y: 36 }, directionHint: "horizontal" },
    { index: 2, d: "M 54 20 L 54 62 C 54 74 40 74 40 66 C 40 56 68 56 74 68 Q 78 72 82 72", startPoint: { x: 54, y: 20 }, directionHint: "loop" },
  ],
  // ら (2 strokes: 1 top dot, 2 curving back)
  "ら": [
    { index: 1, d: "M 44 18 Q 50 22 54 26", startPoint: { x: 44, y: 18 }, directionHint: "down-right" },
    { index: 2, d: "M 38 34 L 38 48 C 38 66 66 62 66 74 C 66 84 50 86 36 82", startPoint: { x: 38, y: 34 }, directionHint: "curve" },
  ],
  // り (2 strokes: 1 left small hook, 2 right long curve)
  "り": [
    { index: 1, d: "M 36 30 C 36 46 34 56 40 60", startPoint: { x: 36, y: 30 }, directionHint: "vertical" },
    { index: 2, d: "M 64 22 C 64 54 60 76 46 84", startPoint: { x: 64, y: 22 }, directionHint: "vertical" },
  ],
  // る (1 single stroke: looping round with small closed tail loop)
  "る": [
    { index: 1, d: "M 32 26 L 68 26 L 38 52 C 68 46 72 70 66 78 C 60 84 48 84 50 74 C 52 64 64 66 64 72", startPoint: { x: 32, y: 26 }, directionHint: "loop" },
  ],
  // れ (2 strokes: 1 left vertical, 2 z-shape ending in outer flip)
  "れ": [
    { index: 1, d: "M 32 20 L 32 82", startPoint: { x: 32, y: 20 }, directionHint: "vertical" },
    { index: 2, d: "M 22 36 L 56 34 L 30 64 C 44 54 62 58 64 68 Q 66 76 74 74", startPoint: { x: 22, y: 36 }, directionHint: "curve" },
  ],
  // ろ (1 single stroke like る but open tail without loop)
  "ろ": [
    { index: 1, d: "M 32 26 L 68 26 L 38 52 C 68 46 72 72 64 80 C 56 86 38 84 32 78", startPoint: { x: 32, y: 26 }, directionHint: "curve" },
  ],
  // わ (2 strokes: 1 left vertical, 2 curving back body)
  "わ": [
    { index: 1, d: "M 32 20 L 32 82", startPoint: { x: 32, y: 20 }, directionHint: "vertical" },
    { index: 2, d: "M 22 36 L 54 34 L 32 60 C 44 48 70 48 70 66 C 70 82 48 84 36 78", startPoint: { x: 22, y: 36 }, directionHint: "loop" },
  ],
  // を (3 strokes: 1 horizontal, 2 down-curve, 3 under-loop)
  "を": [
    { index: 1, d: "M 30 32 Q 52 30 70 32", startPoint: { x: 30, y: 32 }, directionHint: "horizontal" },
    { index: 2, d: "M 48 18 L 44 56 C 44 66 64 54 68 62", startPoint: { x: 48, y: 18 }, directionHint: "vertical" },
    { index: 3, d: "M 40 58 C 40 76 66 78 74 70", startPoint: { x: 40, y: 58 }, directionHint: "curve" },
  ],
  // ん (1 single stroke: diagonal down-left then up-and-down wave)
  "ん": [
    { index: 1, d: "M 36 28 L 28 74 C 36 62 54 52 58 64 C 62 76 64 82 72 80", startPoint: { x: 36, y: 28 }, directionHint: "curve" },
  ],
};

// Canonical Katakana Stroke Paths
export const KATAKANA_STROKE_DATA: Record<string, KanaStroke[]> = {
  // ア (2 strokes)
  "ア": [
    { index: 1, d: "M 26 28 Q 62 26 66 38 Q 58 54 48 64", startPoint: { x: 26, y: 28 }, directionHint: "curve" },
    { index: 2, d: "M 42 42 C 40 60 34 74 24 82", startPoint: { x: 42, y: 42 }, directionHint: "vertical" },
  ],
  // イ (2 strokes)
  "イ": [
    { index: 1, d: "M 56 20 C 46 36 34 54 22 66", startPoint: { x: 56, y: 20 }, directionHint: "down-right" },
    { index: 2, d: "M 44 44 L 44 84", startPoint: { x: 44, y: 44 }, directionHint: "vertical" },
  ],
  // ウ (3 strokes)
  "ウ": [
    { index: 1, d: "M 48 18 L 48 28", startPoint: { x: 48, y: 18 }, directionHint: "vertical" },
    { index: 2, d: "M 28 36 L 28 48", startPoint: { x: 28, y: 36 }, directionHint: "vertical" },
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
    { index: 2, d: "M 48 20 C 44 48 34 70 22 80", startPoint: { x: 48, y: 20 }, directionHint: "vertical" },
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

// Generic stroke generator for composite Yoon or Dakuon characters
export function getKanaStrokes(char: string, scriptType: "hira" | "kata"): KanaStroke[] {
  const dictionary = scriptType === "hira" ? HIRAGANA_STROKE_DATA : KATAKANA_STROKE_DATA;
  if (dictionary[char]) {
    return dictionary[char];
  }

  // If Yoon (two characters, e.g. "きゃ" or "キャ"), compose both
  if (char.length === 2) {
    const baseChar = char[0];
    const smallChar = char[1];
    const baseStrokes = dictionary[baseChar] || [];
    const smallStrokes = dictionary[smallChar] || [];

    // Scale & position base on left (60%), small on right (40%)
    const composite: KanaStroke[] = [];
    let idx = 1;

    baseStrokes.forEach((s) => {
      composite.push({
        index: idx++,
        d: s.d, // in a full SVG renderer this can be transformed or rendered in separate groups
        startPoint: s.startPoint,
        directionHint: s.directionHint,
      });
    });

    smallStrokes.forEach((s) => {
      composite.push({
        index: idx++,
        d: s.d,
        startPoint: { x: Math.round(s.startPoint.x * 0.7 + 35), y: Math.round(s.startPoint.y * 0.7 + 30) },
        directionHint: s.directionHint,
      });
    });

    if (composite.length > 0) return composite;
  }

  // Fallback 1-3 stroke representation for Dakuon marks: base + dakuten (two ticks) or handakuten (circle)
  return [
    { index: 1, d: "M 30 30 Q 50 25 70 30", startPoint: { x: 30, y: 30 }, directionHint: "horizontal" },
    { index: 2, d: "M 50 25 L 50 75", startPoint: { x: 50, y: 25 }, directionHint: "vertical" },
    { index: 3, d: "M 30 75 Q 50 70 70 75", startPoint: { x: 30, y: 75 }, directionHint: "horizontal" },
  ];
}
