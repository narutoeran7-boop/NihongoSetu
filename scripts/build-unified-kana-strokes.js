const fs = require('fs');
const path = require('path');

const rawData = JSON.parse(fs.readFileSync(path.join(__dirname, 'kanjivg-kana-raw.json'), 'utf-8'));

let ts = `// ==============================================================================
// NIHONGOSETU — AUTHENTIC KANJIVG KANA STROKE ORDER & VECTOR ENGINE
// Authoritative KanjiVG dataset (CC-BY-SA 3.0 Ulrich Apel / KanjiVG Project)
// 100% Scholarly stroke sequences, start points, directions, & number positions
// ==============================================================================

export interface KanaStroke {
  index: number;
  d: string;
  startPoint: { x: number; y: number };
  numberPoint?: { x: number; y: number };
  directionHint?: string;
  component?: "first" | "small";
  componentChar?: string;
}

export interface KanaStrokeData {
  char: string;
  code?: string;
  type: "hira" | "kata";
  strokeCount: number;
  viewBox: string;
  strokes: KanaStroke[];
}

export const KANJIVG_VIEWBOX = "0 0 109 109";
export const YOON_VIEWBOX = "0 0 218 109";

export function getKanaViewBox(char: string): string {
  return char.length === 2 ? YOON_VIEWBOX : KANJIVG_VIEWBOX;
}

export const KANA_STROKE_MAP: Record<string, KanaStroke[]> = {
`;

for (const [char, entry] of Object.entries(rawData)) {
  ts += `  // ${char} (${entry.type}, ${entry.strokeCount} strokes)\n`;
  ts += `  ${JSON.stringify(char)}: [\n`;
  for (const s of entry.strokes) {
    ts += `    {\n`;
    ts += `      index: ${s.index},\n`;
    ts += `      d: ${JSON.stringify(s.d)},\n`;
    ts += `      startPoint: { x: ${s.startPoint.x}, y: ${s.startPoint.y} },\n`;
    if (s.numberPoint) {
      ts += `      numberPoint: { x: ${s.numberPoint.x}, y: ${s.numberPoint.y} },\n`;
    }
    if (s.directionHint) {
      ts += `      directionHint: ${JSON.stringify(s.directionHint)},\n`;
    }
    ts += `    },\n`;
  }
  ts += `  ],\n`;
}

ts += `};

// ------------------------------------------------------------------------------
// SVG PATH TRANSFORMATION ENGINE (For Yōon combinations)
// ------------------------------------------------------------------------------
export function transformPath(d: string, scale: number, offsetX: number, offsetY: number): string {
  // 1. Normalize numbers separated by minus sign or comma
  const clean = d
    .replace(/,/g, " ")
    .replace(/([0-9])-/g, "$1 -")
    .replace(/\\s+/g, " ")
    .trim();

  // 2. Parse command tokens
  return clean.replace(/([A-Za-z])([^A-Za-z]*)/g, (_match, cmd: string, argsStr: string) => {
    const rawNumbers = argsStr.trim().split(/\\s+/).filter(Boolean).map(Number);
    if (rawNumbers.length === 0) return cmd;

    if (cmd === "M") {
      const res: string[] = [];
      for (let i = 0; i < rawNumbers.length; i += 2) {
        const x = +(rawNumbers[i] * scale + offsetX).toFixed(2);
        const y = +((rawNumbers[i + 1] ?? 0) * scale + offsetY).toFixed(2);
        res.push(\`\${x},\${y}\`);
      }
      return \`M\${res.join(" ")}\`;
    }

    if (cmd === "c") {
      // Relative cubic bezier: only scale deltas, DO NOT add offset!
      const res: string[] = [];
      for (let i = 0; i < rawNumbers.length; i += 6) {
        const dx1 = +(rawNumbers[i] * scale).toFixed(2);
        const dy1 = +(rawNumbers[i + 1] * scale).toFixed(2);
        const dx2 = +(rawNumbers[i + 2] * scale).toFixed(2);
        const dy2 = +(rawNumbers[i + 3] * scale).toFixed(2);
        const dx = +(rawNumbers[i + 4] * scale).toFixed(2);
        const dy = +(rawNumbers[i + 5] * scale).toFixed(2);
        res.push(\`\${dx1},\${dy1} \${dx2},\${dy2} \${dx},\${dy}\`);
      }
      return \`c\${res.join(" ")}\`;
    }

    if (cmd === "C") {
      // Absolute cubic bezier: scale and offset
      const res: string[] = [];
      for (let i = 0; i < rawNumbers.length; i += 6) {
        const x1 = +(rawNumbers[i] * scale + offsetX).toFixed(2);
        const y1 = +(rawNumbers[i + 1] * scale + offsetY).toFixed(2);
        const x2 = +(rawNumbers[i + 2] * scale + offsetX).toFixed(2);
        const y2 = +(rawNumbers[i + 3] * scale + offsetY).toFixed(2);
        const x = +(rawNumbers[i + 4] * scale + offsetX).toFixed(2);
        const y = +(rawNumbers[i + 5] * scale + offsetY).toFixed(2);
        res.push(\`\${x1},\${y1} \${x2},\${y2} \${x},\${y}\`);
      }
      return \`C\${res.join(" ")}\`;
    }

    if (cmd === "m" || cmd === "l") {
      // Relative move/line: only scale
      const res: string[] = [];
      for (let i = 0; i < rawNumbers.length; i += 2) {
        const dx = +(rawNumbers[i] * scale).toFixed(2);
        const dy = +(rawNumbers[i + 1] * scale).toFixed(2);
        res.push(\`\${dx},\${dy}\`);
      }
      return \`\${cmd}\${res.join(" ")}\`;
    }

    if (cmd === "L") {
      // Absolute line: scale and offset
      const res: string[] = [];
      for (let i = 0; i < rawNumbers.length; i += 2) {
        const x = +(rawNumbers[i] * scale + offsetX).toFixed(2);
        const y = +(rawNumbers[i + 1] * scale + offsetY).toFixed(2);
        res.push(\`\${x},\${y}\`);
      }
      return \`L\${res.join(" ")}\`;
    }

    return \`\${cmd}\${rawNumbers.join(" ")}\`;
  });
}

// ------------------------------------------------------------------------------
// COMPREHENSIVE KANA STROKE RETRIEVAL ENGINE
// ------------------------------------------------------------------------------
export function getKanaStrokes(char: string, _scriptType?: "hira" | "kata"): KanaStroke[] {
  // 1. Direct KanjiVG Single Character Lookup (Basic, Dakuon, Handakuten, Small Kana)
  if (KANA_STROKE_MAP[char]) {
    return KANA_STROKE_MAP[char];
  }

  // 2. Yōon Combination (Two-character pairs: Base Kana in Box 1 + Small Kana in Box 2)
  if (char.length === 2) {
    const baseChar = char[0];
    const smallChar = char[1];

    const baseStrokes = KANA_STROKE_MAP[baseChar] || [];
    const smallStrokes = KANA_STROKE_MAP[smallChar] || [];

    const result: KanaStroke[] = [];
    let idx = 1;

    // Box 1 (Main Kana): Left region 0..109, center (54.5, 54.5)
    // Scale = 0.85, centered with 8.18px margin
    const baseScale = 0.85;
    const baseOffsetX = 8.18;
    const baseOffsetY = 8.18;
    baseStrokes.forEach((s) => {
      const startX = +(s.startPoint.x * baseScale + baseOffsetX).toFixed(2);
      const startY = +(s.startPoint.y * baseScale + baseOffsetY).toFixed(2);
      const numX = s.numberPoint ? +(s.numberPoint.x * baseScale + baseOffsetX).toFixed(2) : startX;
      const numY = s.numberPoint ? +(s.numberPoint.y * baseScale + baseOffsetY).toFixed(2) : startY;
      result.push({
        index: idx++,
        d: transformPath(s.d, baseScale, baseOffsetX, baseOffsetY),
        startPoint: { x: startX, y: startY },
        numberPoint: { x: numX, y: numY },
        directionHint: s.directionHint,
        component: "first",
        componentChar: baseChar,
      });
    });

    // Box 2 (Small Kana): Right region 109..218, center (163.5, 54.5)
    // Authentic small kana scale = 0.62, centered in Box 2
    const smallScale = 0.62;
    const smallOffsetX = 129.71;
    const smallOffsetY = 20.71;
    smallStrokes.forEach((s) => {
      const startX = +(s.startPoint.x * smallScale + smallOffsetX).toFixed(2);
      const startY = +(s.startPoint.y * smallScale + smallOffsetY).toFixed(2);
      const numX = s.numberPoint ? +(s.numberPoint.x * smallScale + smallOffsetX).toFixed(2) : startX;
      const numY = s.numberPoint ? +(s.numberPoint.y * smallScale + smallOffsetY).toFixed(2) : startY;
      result.push({
        index: idx++,
        d: transformPath(s.d, smallScale, smallOffsetX, smallOffsetY),
        startPoint: { x: startX, y: startY },
        numberPoint: { x: numX, y: numY },
        directionHint: s.directionHint,
        component: "small",
        componentChar: smallChar,
      });
    });

    if (result.length > 0) {
      return result;
    }
  }

  // Graceful fallback single stroke if unknown character
  return [
    { index: 1, d: "M20,54.5L89,54.5", startPoint: { x: 20, y: 54.5 }, numberPoint: { x: 15, y: 50 } },
  ];
}

// Backward-compatibility aliases
export const HIRAGANA_STROKE_DATA = KANA_STROKE_MAP;
export const KATAKANA_STROKE_DATA = KANA_STROKE_MAP;
`;

const destPath = path.join(__dirname, '..', 'src', 'data', 'kanaStrokes.ts');
fs.writeFileSync(destPath, ts, 'utf-8');
console.log(`Generated unified KanjiVG kana strokes at ${destPath}`);
