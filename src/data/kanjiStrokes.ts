// ==============================================================================
// NIHONGOSETU — KANJI STROKE ORDER DATA & VECTOR PATH ENGINE
// Precise vector stroke sequences, directions, and numbered starting points
// ==============================================================================

export interface KanjiStroke {
  index: number;
  d: string;
  startPoint: { x: number; y: number };
  directionHint?: string;
}

export interface KanjiStrokeData {
  character: string;
  strokeCount: number;
  radical: string;
  strokes: KanjiStroke[];
}

// Canonical Kanji Stroke Paths (Normalized 100x100 coordinate system)
export const KANJI_STROKE_DATA: Record<string, KanjiStroke[]> = {
  // 一 (1 stroke: horizontal left to right)
  "一": [
    { index: 1, d: "M 20 50 Q 50 48 80 50", startPoint: { x: 20, y: 50 }, directionHint: "horizontal" },
  ],
  // 二 (2 strokes: 1 top horizontal, 2 bottom longer horizontal)
  "二": [
    { index: 1, d: "M 30 36 Q 50 34 70 36", startPoint: { x: 30, y: 36 }, directionHint: "horizontal" },
    { index: 2, d: "M 20 68 Q 50 66 80 68", startPoint: { x: 20, y: 68 }, directionHint: "horizontal" },
  ],
  // 三 (3 strokes: 1 top, 2 middle shorter, 3 bottom longest)
  "三": [
    { index: 1, d: "M 28 28 Q 50 26 72 28", startPoint: { x: 28, y: 28 }, directionHint: "horizontal" },
    { index: 2, d: "M 34 48 Q 50 47 66 48", startPoint: { x: 34, y: 48 }, directionHint: "horizontal" },
    { index: 3, d: "M 18 72 Q 50 70 82 72", startPoint: { x: 18, y: 72 }, directionHint: "horizontal" },
  ],
  // 四 (5 strokes: 1 left vertical, 2 top-right box, 3 left curve inside, 4 right curve inside, 5 bottom close)
  "四": [
    { index: 1, d: "M 26 24 L 26 78", startPoint: { x: 26, y: 24 }, directionHint: "vertical" },
    { index: 2, d: "M 26 24 L 74 24 L 74 78", startPoint: { x: 26, y: 24 }, directionHint: "horizontal" },
    { index: 3, d: "M 42 36 L 38 58", startPoint: { x: 42, y: 36 }, directionHint: "vertical" },
    { index: 4, d: "M 54 34 Q 62 38 62 58", startPoint: { x: 54, y: 34 }, directionHint: "curve" },
    { index: 5, d: "M 26 78 L 74 78", startPoint: { x: 26, y: 78 }, directionHint: "horizontal" },
  ],
  // 五 (4 strokes: 1 top horizontal, 2 center slant, 3 middle-bottom box hook, 4 bottom horizontal)
  "五": [
    { index: 1, d: "M 24 26 Q 50 24 76 26", startPoint: { x: 24, y: 26 }, directionHint: "horizontal" },
    { index: 2, d: "M 50 26 L 44 74", startPoint: { x: 50, y: 26 }, directionHint: "vertical" },
    { index: 3, d: "M 30 50 L 66 50 L 62 74", startPoint: { x: 30, y: 50 }, directionHint: "horizontal" },
    { index: 4, d: "M 18 74 Q 50 72 82 74", startPoint: { x: 18, y: 74 }, directionHint: "horizontal" },
  ],
  // 六 (4 strokes: 1 top dot, 2 horizontal, 3 left slash, 4 right dot)
  "六": [
    { index: 1, d: "M 50 18 L 50 30", startPoint: { x: 50, y: 18 }, directionHint: "vertical" },
    { index: 2, d: "M 20 38 Q 50 36 80 38", startPoint: { x: 20, y: 38 }, directionHint: "horizontal" },
    { index: 3, d: "M 42 50 C 38 64 30 76 20 84", startPoint: { x: 42, y: 50 }, directionHint: "down-right" },
    { index: 4, d: "M 60 52 C 66 64 74 74 80 82", startPoint: { x: 60, y: 52 }, directionHint: "down-right" },
  ],
  // 七 (2 strokes: 1 horizontal cutting upwards, 2 vertical curve hook)
  "七": [
    { index: 1, d: "M 22 52 Q 50 46 78 40", startPoint: { x: 22, y: 52 }, directionHint: "horizontal" },
    { index: 2, d: "M 48 24 L 48 64 Q 50 78 68 76 L 74 68", startPoint: { x: 48, y: 24 }, directionHint: "curve" },
  ],
  // 八 (2 strokes: 1 left flare, 2 right flare)
  "八": [
    { index: 1, d: "M 42 26 C 36 46 28 66 18 80", startPoint: { x: 42, y: 26 }, directionHint: "down-right" },
    { index: 2, d: "M 58 24 C 64 48 74 68 84 82", startPoint: { x: 58, y: 24 }, directionHint: "down-right" },
  ],
  // 九 (2 strokes: 1 left slant, 2 horizontal-turn-curve-hook)
  "九": [
    { index: 1, d: "M 48 22 C 44 48 34 68 22 82", startPoint: { x: 48, y: 22 }, directionHint: "down-right" },
    { index: 2, d: "M 32 38 L 68 32 L 64 56 Q 64 78 78 74 L 80 66", startPoint: { x: 32, y: 38 }, directionHint: "curve" },
  ],
  // 十 (2 strokes: 1 horizontal, 2 vertical through center)
  "十": [
    { index: 1, d: "M 22 50 Q 50 48 78 50", startPoint: { x: 22, y: 50 }, directionHint: "horizontal" },
    { index: 2, d: "M 50 20 L 50 82", startPoint: { x: 50, y: 20 }, directionHint: "vertical" },
  ],
  // 日 (4 strokes: 1 left vertical, 2 top-right box, 3 middle horizontal, 4 bottom horizontal)
  "日": [
    { index: 1, d: "M 30 24 L 30 78", startPoint: { x: 30, y: 24 }, directionHint: "vertical" },
    { index: 2, d: "M 30 24 L 70 24 L 70 78", startPoint: { x: 30, y: 24 }, directionHint: "horizontal" },
    { index: 3, d: "M 30 50 L 70 50", startPoint: { x: 30, y: 50 }, directionHint: "horizontal" },
    { index: 4, d: "M 30 78 L 70 78", startPoint: { x: 30, y: 78 }, directionHint: "horizontal" },
  ],
  // 月 (4 strokes: 1 left curve, 2 top-right box with hook, 3 mid horizontal, 4 lower horizontal)
  "月": [
    { index: 1, d: "M 32 20 C 32 46 28 68 22 84", startPoint: { x: 32, y: 20 }, directionHint: "vertical" },
    { index: 2, d: "M 32 20 L 68 20 L 68 84 Q 62 86 58 78", startPoint: { x: 32, y: 20 }, directionHint: "horizontal" },
    { index: 3, d: "M 32 42 L 68 42", startPoint: { x: 32, y: 42 }, directionHint: "horizontal" },
    { index: 4, d: "M 32 62 L 68 62", startPoint: { x: 32, y: 62 }, directionHint: "horizontal" },
  ],
  // 火 (4 strokes: 1 left dot, 2 right slant, 3 center long sweep down-left, 4 sweep down-right)
  "火": [
    { index: 1, d: "M 28 42 C 28 50 24 58 20 62", startPoint: { x: 28, y: 42 }, directionHint: "down-right" },
    { index: 2, d: "M 74 38 L 66 48", startPoint: { x: 74, y: 38 }, directionHint: "down-right" },
    { index: 3, d: "M 50 18 C 50 50 42 70 24 84", startPoint: { x: 50, y: 18 }, directionHint: "down-right" },
    { index: 4, d: "M 50 50 C 58 64 68 76 80 84", startPoint: { x: 50, y: 50 }, directionHint: "down-right" },
  ],
  // 水 (4 strokes: 1 center hook, 2 left horizontal-diagonal, 3 right top, 4 right bottom sweep)
  "水": [
    { index: 1, d: "M 50 16 L 50 78 Q 44 84 38 78", startPoint: { x: 50, y: 16 }, directionHint: "vertical" },
    { index: 2, d: "M 24 40 L 40 36 L 24 64", startPoint: { x: 24, y: 40 }, directionHint: "horizontal" },
    { index: 3, d: "M 72 32 L 58 48", startPoint: { x: 72, y: 32 }, directionHint: "down-right" },
    { index: 4, d: "M 54 52 C 62 64 72 74 80 80", startPoint: { x: 54, y: 52 }, directionHint: "down-right" },
  ],
  // 木 (4 strokes: 1 horizontal, 2 center vertical, 3 left sweep, 4 right sweep)
  "木": [
    { index: 1, d: "M 22 40 Q 50 38 78 40", startPoint: { x: 22, y: 40 }, directionHint: "horizontal" },
    { index: 2, d: "M 50 18 L 50 82", startPoint: { x: 50, y: 18 }, directionHint: "vertical" },
    { index: 3, d: "M 50 40 C 42 56 32 70 18 80", startPoint: { x: 50, y: 40 }, directionHint: "down-right" },
    { index: 4, d: "M 50 40 C 58 56 68 70 82 80", startPoint: { x: 50, y: 40 }, directionHint: "down-right" },
  ],
  // 金 (8 strokes)
  "金": [
    { index: 1, d: "M 50 16 C 42 30 32 44 18 54", startPoint: { x: 50, y: 16 }, directionHint: "down-right" },
    { index: 2, d: "M 50 18 C 60 30 70 44 82 54", startPoint: { x: 50, y: 18 }, directionHint: "down-right" },
    { index: 3, d: "M 34 44 Q 50 42 66 44", startPoint: { x: 34, y: 44 }, directionHint: "horizontal" },
    { index: 4, d: "M 28 58 Q 50 56 72 58", startPoint: { x: 28, y: 58 }, directionHint: "horizontal" },
    { index: 5, d: "M 50 44 L 50 78", startPoint: { x: 50, y: 44 }, directionHint: "vertical" },
    { index: 6, d: "M 36 66 L 30 74", startPoint: { x: 36, y: 66 }, directionHint: "down-right" },
    { index: 7, d: "M 64 66 L 70 74", startPoint: { x: 64, y: 66 }, directionHint: "down-right" },
    { index: 8, d: "M 20 80 Q 50 78 80 80", startPoint: { x: 20, y: 80 }, directionHint: "horizontal" },
  ],
  // 土 (3 strokes: 1 horizontal, 2 vertical, 3 longer bottom horizontal)
  "土": [
    { index: 1, d: "M 32 44 Q 50 42 68 44", startPoint: { x: 32, y: 44 }, directionHint: "horizontal" },
    { index: 2, d: "M 50 20 L 50 74", startPoint: { x: 50, y: 20 }, directionHint: "vertical" },
    { index: 3, d: "M 20 74 Q 50 72 80 74", startPoint: { x: 20, y: 74 }, directionHint: "horizontal" },
  ],
  // 山 (3 strokes: 1 center tall vertical, 2 left vertical into bottom horizontal, 3 right vertical)
  "山": [
    { index: 1, d: "M 50 18 L 50 78", startPoint: { x: 50, y: 18 }, directionHint: "vertical" },
    { index: 2, d: "M 28 44 L 28 78 L 74 78", startPoint: { x: 28, y: 44 }, directionHint: "vertical" },
    { index: 3, d: "M 74 44 L 74 78", startPoint: { x: 74, y: 44 }, directionHint: "vertical" },
  ],
  // 川 (3 strokes: 1 left curve, 2 mid vertical, 3 right tall vertical)
  "川": [
    { index: 1, d: "M 28 26 C 28 46 26 64 20 74", startPoint: { x: 28, y: 26 }, directionHint: "vertical" },
    { index: 2, d: "M 50 32 L 50 70", startPoint: { x: 50, y: 32 }, directionHint: "vertical" },
    { index: 3, d: "M 72 20 L 72 82", startPoint: { x: 72, y: 20 }, directionHint: "vertical" },
  ],
  // 人 (2 strokes: 1 left leg, 2 right leg)
  "人": [
    { index: 1, d: "M 50 20 C 44 48 34 68 18 84", startPoint: { x: 50, y: 20 }, directionHint: "down-right" },
    { index: 2, d: "M 44 44 C 54 60 66 74 82 84", startPoint: { x: 44, y: 44 }, directionHint: "down-right" },
  ],
};

// Procedural fallback stroke paths for any Kanji using its stroke count
export function getKanjiStrokes(char: string, strokeCount: number = 4): KanjiStroke[] {
  if (KANJI_STROKE_DATA[char]) {
    return KANJI_STROKE_DATA[char];
  }

  // Construct structured procedural strokes for characters awaiting custom SVG vectors
  const strokes: KanjiStroke[] = [];
  const safeCount = Math.max(1, Math.min(20, strokeCount));
  const step = 60 / (safeCount + 1);

  for (let i = 1; i <= safeCount; i++) {
    const y = Math.round(20 + i * step);
    if (i % 2 === 1) {
      strokes.push({
        index: i,
        d: `M 24 ${y} Q 50 ${y - 2} 76 ${y}`,
        startPoint: { x: 24, y },
        directionHint: "horizontal",
      });
    } else {
      const x = Math.round(30 + ((i / 2) * 15) % 40);
      strokes.push({
        index: i,
        d: `M ${x} 22 L ${x} 80`,
        startPoint: { x, y: 22 },
        directionHint: "vertical",
      });
    }
  }

  return strokes;
}

export const getKanjiStrokeData = getKanjiStrokes;

