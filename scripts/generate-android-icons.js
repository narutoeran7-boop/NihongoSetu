// ==============================================================================
// NIHONGOSETU — ANDROID LAUNCHER ICON ASSET GENERATOR
// ==============================================================================
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const SOURCE_IMAGE = 'C:/Users/ELCOT/.gemini/antigravity/brain/d3cf65e2-9c95-4d76-8fd8-efd583fed49f/nihongosetu_app_icon_fullbleed_1793777111414.jpg';
const ANDROID_RES_DIR = path.join(__dirname, '../android/res');
const PUBLIC_ICONS_DIR = path.join(__dirname, '../public/icons');
const APP_DIR = path.join(__dirname, '../src/app');

// Standard Android Mipmap Densities
const DENSITIES = [
  { name: 'mipmap-mdpi', size: 48, adaptiveSize: 108 },
  { name: 'mipmap-hdpi', size: 72, adaptiveSize: 162 },
  { name: 'mipmap-xhdpi', size: 96, adaptiveSize: 216 },
  { name: 'mipmap-xxhdpi', size: 144, adaptiveSize: 324 },
  { name: 'mipmap-xxxhdpi', size: 192, adaptiveSize: 432 },
];

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function generate() {
  console.log('--- Generating NihongoSetu Android Launcher Assets ---');

  // Ensure target directories
  ensureDir(path.join(__dirname, '../android/master'));
  ensureDir(path.join(ANDROID_RES_DIR, 'mipmap-anydpi-v26'));
  ensureDir(path.join(ANDROID_RES_DIR, 'drawable'));
  ensureDir(PUBLIC_ICONS_DIR);
  ensureDir(APP_DIR);

  DENSITIES.forEach(d => {
    ensureDir(path.join(ANDROID_RES_DIR, d.name));
  });

  const baseSharp = sharp(SOURCE_IMAGE);

  // 1. Master 1024x1024 Play Store Icon
  console.log('Generating master 1024x1024 icons...');
  await baseSharp
    .clone()
    .resize(1024, 1024, { fit: 'cover' })
    .png()
    .toFile(path.join(__dirname, '../android/master/ic_launcher_master.png'));

  await baseSharp
    .clone()
    .resize(1024, 1024, { fit: 'cover' })
    .png()
    .toFile(path.join(PUBLIC_ICONS_DIR, 'icon-1024.png'));

  // 2. Next.js App Router canonical icons
  console.log('Generating Next.js app icons...');
  await baseSharp
    .clone()
    .resize(512, 512, { fit: 'cover' })
    .png()
    .toFile(path.join(APP_DIR, 'icon.png'));

  await baseSharp
    .clone()
    .resize(180, 180, { fit: 'cover' })
    .png()
    .toFile(path.join(APP_DIR, 'apple-icon.png'));

  // 3. PWA Icons (192, 512, maskable)
  console.log('Generating PWA icons...');
  await baseSharp
    .clone()
    .resize(192, 192, { fit: 'cover' })
    .png()
    .toFile(path.join(PUBLIC_ICONS_DIR, 'icon-192.png'));

  await baseSharp
    .clone()
    .resize(512, 512, { fit: 'cover' })
    .png()
    .toFile(path.join(PUBLIC_ICONS_DIR, 'icon-512.png'));

  // Maskable icons: 10% safe margin to prevent clipping in circle/squircle masks
  const maskableSvgBg = (size) => Buffer.from(`
    <svg width="${size}" height="${size}">
      <rect width="${size}" height="${size}" fill="#0A1128"/>
    </svg>
  `);

  const inner192 = await baseSharp.clone().resize(154, 154, { fit: 'cover' }).png().toBuffer();
  await sharp(maskableSvgBg(192))
    .composite([{ input: inner192, left: 19, top: 19 }])
    .png()
    .toFile(path.join(PUBLIC_ICONS_DIR, 'icon-maskable-192.png'));

  const inner512 = await baseSharp.clone().resize(410, 410, { fit: 'cover' }).png().toBuffer();
  await sharp(maskableSvgBg(512))
    .composite([{ input: inner512, left: 51, top: 51 }])
    .png()
    .toFile(path.join(PUBLIC_ICONS_DIR, 'icon-maskable-512.png'));

  // 4. Android Mipmap Density Icons (Legacy square and round)
  console.log('Generating Android legacy and round launcher icons...');
  for (const d of DENSITIES) {
    const dir = path.join(ANDROID_RES_DIR, d.name);

    // Standard square launcher
    await baseSharp
      .clone()
      .resize(d.size, d.size, { fit: 'cover' })
      .png()
      .toFile(path.join(dir, 'ic_launcher.png'));

    // Circular mask for ic_launcher_round
    const radius = d.size / 2;
    const circleMask = Buffer.from(
      `<svg width="${d.size}" height="${d.size}"><circle cx="${radius}" cy="${radius}" r="${radius}" fill="#fff" /></svg>`
    );

    const resizedBuffer = await baseSharp
      .clone()
      .resize(d.size, d.size, { fit: 'cover' })
      .png()
      .toBuffer();

    await sharp(resizedBuffer)
      .composite([{ input: circleMask, blend: 'dest-in' }])
      .png()
      .toFile(path.join(dir, 'ic_launcher_round.png'));

    // Adaptive icon layers for each density
    // Background layer (108dp base)
    await baseSharp
      .clone()
      .resize(d.adaptiveSize, d.adaptiveSize, { fit: 'cover' })
      .png()
      .toFile(path.join(dir, 'ic_launcher_background.png'));

    // Foreground layer (transparent background with icon content placed inside 66% safe area)
    const safeZoneSize = Math.round(d.adaptiveSize * 0.72);
    const offset = Math.round((d.adaptiveSize - safeZoneSize) / 2);
    const foregroundContent = await baseSharp
      .clone()
      .resize(safeZoneSize, safeZoneSize, { fit: 'cover' })
      .png()
      .toBuffer();

    const transparentBase = Buffer.from(
      `<svg width="${d.adaptiveSize}" height="${d.adaptiveSize}"></svg>`
    );

    await sharp(transparentBase)
      .composite([{ input: foregroundContent, left: offset, top: offset }])
      .png()
      .toFile(path.join(dir, 'ic_launcher_foreground.png'));
  }

  // 5. Android Adaptive Icon XML definitions (API 26+)
  console.log('Writing adaptive icon XML manifests...');
  const adaptiveXml = `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@mipmap/ic_launcher_background" />
    <foreground android:drawable="@mipmap/ic_launcher_foreground" />
</adaptive-icon>
`;

  fs.writeFileSync(path.join(ANDROID_RES_DIR, 'mipmap-anydpi-v26/ic_launcher.xml'), adaptiveXml, 'utf8');
  fs.writeFileSync(path.join(ANDROID_RES_DIR, 'mipmap-anydpi-v26/ic_launcher_round.xml'), adaptiveXml, 'utf8');

  // Vector background fallback
  const vectorBgXml = `<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="108dp"
    android:height="108dp"
    android:viewportWidth="108"
    android:viewportHeight="108">
    <path
        android:fillColor="#0A1128"
        android:pathData="M0,0h108v108h-108z" />
</vector>
`;
  fs.writeFileSync(path.join(ANDROID_RES_DIR, 'drawable/ic_launcher_background.xml'), vectorBgXml, 'utf8');

  // 6. Master Adaptive Layers (1024x1024)
  console.log('Writing master 1024x1024 adaptive layers...');
  await baseSharp
    .clone()
    .resize(1024, 1024, { fit: 'cover' })
    .png()
    .toFile(path.join(__dirname, '../android/master/ic_launcher_bg.png'));

  const safe1024 = Math.round(1024 * 0.72);
  const offset1024 = Math.round((1024 - safe1024) / 2);
  const fg1024Buffer = await baseSharp.clone().resize(safe1024, safe1024, { fit: 'cover' }).png().toBuffer();
  await sharp(Buffer.from('<svg width="1024" height="1024"></svg>'))
    .composite([{ input: fg1024Buffer, left: offset1024, top: offset1024 }])
    .png()
    .toFile(path.join(__dirname, '../android/master/ic_launcher_fg.png'));

  console.log('✓ All Android and web icon assets successfully generated.');
}

generate().catch(err => {
  console.error('Error generating assets:', err);
  process.exit(1);
});

