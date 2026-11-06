// ==============================================================================
// NIHONGOSETU — ANDROID & PWA SPLASH SCREEN GENERATOR
// ==============================================================================
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const SOURCE_IMAGE = 'C:/Users/ELCOT/.gemini/antigravity/brain/d3cf65e2-9c95-4d76-8fd8-efd583fed49f/.user_uploaded/media_1793776755653_a84ef38a.jpg';

const ANDROID_MASTER_DIR = path.join(__dirname, '../android/master');
const ANDROID_RES_DIR = path.join(__dirname, '../android/res');
const PUBLIC_SPLASH_DIR = path.join(__dirname, '../public/splash');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Background color matching the artwork's outer edge: #030F27
const BG_COLOR = '#030F27';

async function createSplashComposite(width, height, artRatio = 0.82) {
  const artMaxDimension = Math.round(Math.min(width * artRatio, height * 0.72));
  
  // Resize source artwork keeping aspect ratio
  const resizedArt = await sharp(SOURCE_IMAGE)
    .resize(artMaxDimension, artMaxDimension, { fit: 'contain', background: { r: 3, g: 15, b: 39, alpha: 0 } })
    .png()
    .toBuffer();

  const artMeta = await sharp(resizedArt).metadata();
  const left = Math.round((width - artMeta.width) / 2);
  const top = Math.round((height - artMeta.height) / 2);

  const bgSvg = Buffer.from(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="skyGlow" cx="50%" cy="45%" r="65%">
          <stop offset="0%" stop-color="#0b1e4a" />
          <stop offset="70%" stop-color="#030F27" />
          <stop offset="100%" stop-color="#010714" />
        </radialGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#skyGlow)" />
    </svg>
  `);

  return sharp(bgSvg)
    .composite([{ input: resizedArt, left, top }])
    .png();
}

async function generate() {
  console.log('--- Generating NihongoSetu Splash Screens (Android & PWA) ---');

  ensureDir(ANDROID_MASTER_DIR);
  ensureDir(ANDROID_RES_DIR);
  ensureDir(PUBLIC_SPLASH_DIR);

  // 1. Android Master Assets
  console.log('1. Generating Master Android Splash Assets...');
  // 1024x1024 master art
  await sharp(SOURCE_IMAGE)
    .png()
    .toFile(path.join(ANDROID_MASTER_DIR, 'splash_master_1024.png'));

  // 1080x1920 Master portrait
  const masterPortrait = await createSplashComposite(1080, 1920, 0.88);
  await masterPortrait.toFile(path.join(ANDROID_MASTER_DIR, 'splash_portrait_1080x1920.png'));

  // Android 12+ API 31+ windowSplashScreenAnimatedIcon (480x480 centered artwork)
  await sharp(SOURCE_IMAGE)
    .resize(480, 480, { fit: 'contain' })
    .png()
    .toFile(path.join(ANDROID_MASTER_DIR, 'splash_icon_center.png'));

  // 2. Android Density Drawables
  console.log('2. Generating Android Density-Specific Drawables...');
  const androidDensities = [
    { dir: 'drawable-port-mdpi', w: 320, h: 480, ratio: 0.85 },
    { dir: 'drawable-port-hdpi', w: 480, h: 800, ratio: 0.85 },
    { dir: 'drawable-port-xhdpi', w: 720, h: 1280, ratio: 0.85 },
    { dir: 'drawable-port-xxhdpi', w: 1080, h: 1920, ratio: 0.85 },
    { dir: 'drawable-port-xxxhdpi', w: 1440, h: 2560, ratio: 0.85 },
    { dir: 'drawable-land-xxhdpi', w: 1920, h: 1080, ratio: 0.65 },
  ];

  for (const item of androidDensities) {
    const targetDir = path.join(ANDROID_RES_DIR, item.dir);
    ensureDir(targetDir);
    const img = await createSplashComposite(item.w, item.h, item.ratio);
    await img.toFile(path.join(targetDir, 'splash_screen.png'));
  }

  // Also put raw splash_art and splash_icon into main drawable
  ensureDir(path.join(ANDROID_RES_DIR, 'drawable'));
  ensureDir(path.join(ANDROID_RES_DIR, 'drawable-nodpi'));

  await sharp(SOURCE_IMAGE)
    .resize(800, 800, { fit: 'contain' })
    .png()
    .toFile(path.join(ANDROID_RES_DIR, 'drawable/splash_art.png'));

  await sharp(SOURCE_IMAGE)
    .resize(480, 480, { fit: 'contain' })
    .png()
    .toFile(path.join(ANDROID_RES_DIR, 'drawable/splash_icon.png'));

  // Full portrait nodpi fallback
  await (await createSplashComposite(1080, 1920, 0.85))
    .toFile(path.join(ANDROID_RES_DIR, 'drawable-nodpi/splash_screen.png'));

  // 3. Android XML Resource Files
  console.log('3. Writing Android XML themes, colors, and drawables...');
  ensureDir(path.join(ANDROID_RES_DIR, 'values'));
  ensureDir(path.join(ANDROID_RES_DIR, 'values-v31'));

  // colors.xml
  const colorsXml = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="splash_background">#030F27</color>
    <color name="splash_accent">#C83C50</color>
</resources>
`;
  fs.writeFileSync(path.join(ANDROID_RES_DIR, 'values/colors.xml'), colorsXml, 'utf8');

  // splash_screen.xml (Layer-list for API < 31)
  const splashLayerList = `<?xml version="1.0" encoding="utf-8"?>
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:drawable="@color/splash_background" />
    <item>
        <bitmap
            android:gravity="center"
            android:src="@drawable/splash_art" />
    </item>
</layer-list>
`;
  fs.writeFileSync(path.join(ANDROID_RES_DIR, 'drawable/splash_screen.xml'), splashLayerList, 'utf8');

  // styles_splash.xml (API < 31 fallback)
  const stylesLegacy = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <!-- NihongoSetu Splash Theme for Android API < 31 -->
    <style name="Theme.NihongoSetu.Starting" parent="Theme.AppCompat.NoActionBar">
        <item name="android:windowBackground">@drawable/splash_screen</item>
        <item name="android:statusBarColor">@color/splash_background</item>
        <item name="android:navigationBarColor">@color/splash_background</item>
    </style>
</resources>
`;
  fs.writeFileSync(path.join(ANDROID_RES_DIR, 'values/styles_splash.xml'), stylesLegacy, 'utf8');

  // values-v31/styles_splash.xml (Android 12+ API 31+ SplashScreen API)
  const stylesV31 = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <!-- NihongoSetu Splash Theme for Android 12+ (API 31+) -->
    <style name="Theme.NihongoSetu.Starting" parent="Theme.SplashScreen">
        <item name="windowSplashScreenBackground">@color/splash_background</item>
        <item name="windowSplashScreenAnimatedIcon">@drawable/splash_icon</item>
        <item name="windowSplashScreenIconBackgroundColor">@color/splash_background</item>
        <item name="postSplashScreenTheme">@style/Theme.NihongoSetu</item>
    </style>
</resources>
`;
  fs.writeFileSync(path.join(ANDROID_RES_DIR, 'values-v31/styles_splash.xml'), stylesV31, 'utf8');

  // 4. Web & PWA Launch Screens
  console.log('4. Generating Web & PWA Launch Screens...');
  // Master splash art in public
  await sharp(SOURCE_IMAGE)
    .png()
    .toFile(path.join(PUBLIC_SPLASH_DIR, 'splash-master.png'));

  // PWA Portrait (1080x1920)
  const pwaPortrait = await createSplashComposite(1080, 1920, 0.88);
  await pwaPortrait.toFile(path.join(PUBLIC_SPLASH_DIR, 'splash-portrait.png'));

  // PWA Landscape (1920x1080)
  const pwaLandscape = await createSplashComposite(1920, 1080, 0.65);
  await pwaLandscape.toFile(path.join(PUBLIC_SPLASH_DIR, 'splash-landscape.png'));

  // Centered icon for manifest or quick loading
  await sharp(SOURCE_IMAGE)
    .resize(512, 512, { fit: 'contain' })
    .png()
    .toFile(path.join(PUBLIC_SPLASH_DIR, 'splash-icon-512.png'));

  // 5. Apple Touch Startup Images (iOS PWA)
  console.log('5. Generating Apple Touch Startup Images for iOS PWA...');
  const iosDevices = [
    { name: 'apple-splash-2048-2732.png', w: 2048, h: 2732, ratio: 0.80 }, // 12.9" iPad Pro
    { name: 'apple-splash-1668-2388.png', w: 1668, h: 2388, ratio: 0.82 }, // 11" iPad Pro
    { name: 'apple-splash-1536-2048.png', w: 1536, h: 2048, ratio: 0.82 }, // 9.7" iPad
    { name: 'apple-splash-1290-2796.png', w: 1290, h: 2796, ratio: 0.88 }, // iPhone 14/15/16 Pro Max
    { name: 'apple-splash-1179-2556.png', w: 1179, h: 2556, ratio: 0.88 }, // iPhone 14/15/16 Pro
    { name: 'apple-splash-1170-2532.png', w: 1170, h: 2532, ratio: 0.88 }, // iPhone 12/13/14
    { name: 'apple-splash-1125-2436.png', w: 1125, h: 2436, ratio: 0.88 }, // iPhone X/XS/11 Pro
    { name: 'apple-splash-1242-2688.png', w: 1242, h: 2688, ratio: 0.88 }, // iPhone XS Max/11 Pro Max
    { name: 'apple-splash-828-1792.png',  w: 828,  h: 1792, ratio: 0.88 }, // iPhone XR/11
    { name: 'apple-splash-750-1334.png',  w: 750,  h: 1334, ratio: 0.88 }, // iPhone SE/8/7
  ];

  for (const dev of iosDevices) {
    const splash = await createSplashComposite(dev.w, dev.h, dev.ratio);
    await splash.toFile(path.join(PUBLIC_SPLASH_DIR, dev.name));
  }

  console.log('✓ All Android & PWA splash screen assets successfully generated!');
}

generate().catch(err => {
  console.error('Splash screen generation failed:', err);
  process.exit(1);
});

