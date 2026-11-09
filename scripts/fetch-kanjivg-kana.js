const fs = require('fs');
const path = require('path');
const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        return resolve(null); // 404 or other
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function parseSvg(svgText) {
  if (!svgText) return null;
  // Extract paths
  const pathRegex = /<path[^>]+id="[^"]+-s(\d+)"[^>]+d="([^"]+)"/g;
  const strokes = [];
  let match;
  while ((match = pathRegex.exec(svgText)) !== null) {
    const idx = parseInt(match[1], 10);
    const d = match[2];
    // Find starting point from M x,y or M x y
    const mMatch = d.match(/^[Mm]\s*([0-9.]+)[,\s]+([0-9.]+)/);
    const startX = mMatch ? parseFloat(mMatch[1]) : 50;
    const startY = mMatch ? parseFloat(mMatch[2]) : 50;
    strokes.push({
      index: idx,
      d,
      startPoint: { x: startX, y: startY }
    });
  }

  // Extract stroke number positions
  const numRegex = /<text[^>]+matrix\(\s*1\s+0\s+0\s+1\s+([0-9.]+)\s+([0-9.]+)\s*\)[^>]*>(\d+)<\/text>/g;
  while ((match = numRegex.exec(svgText)) !== null) {
    const numX = parseFloat(match[1]);
    const numY = parseFloat(match[2]);
    const idx = parseInt(match[3], 10);
    const stroke = strokes.find(s => s.index === idx);
    if (stroke) {
      stroke.numberPoint = { x: numX, y: numY };
    }
  }

  return strokes;
}

async function run() {
  console.log("Fetching KanjiVG Kana SVGs...");
  const chars = [];
  
  // Hiragana range 0x3041 to 0x3093
  for (let c = 0x3041; c <= 0x3096; c++) {
    chars.push({ code: c, char: String.fromCharCode(c), type: 'hira' });
  }

  // Katakana range 0x30a1 to 0x30f6
  for (let c = 0x30a1; c <= 0x30f6; c++) {
    chars.push({ code: c, char: String.fromCharCode(c), type: 'kata' });
  }

  const results = {};
  let fetchedCount = 0;

  for (const item of chars) {
    const hex = item.code.toString(16).padStart(5, '0');
    const url = `https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji/${hex}.svg`;
    try {
      const svg = await fetchUrl(url);
      if (svg) {
        const strokes = parseSvg(svg);
        if (strokes && strokes.length > 0) {
          results[item.char] = {
            char: item.char,
            code: hex,
            type: item.type,
            strokeCount: strokes.length,
            strokes
          };
          fetchedCount++;
        }
      }
    } catch (e) {
      console.error(`Error fetching ${item.char} (${hex}):`, e.message);
    }
  }

  console.log(`Successfully parsed ${fetchedCount} KanjiVG characters.`);
  const outputPath = path.join(__dirname, 'kanjivg-kana-raw.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), 'utf-8');
  console.log(`Saved to ${outputPath}`);
}

run();

