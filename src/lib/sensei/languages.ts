// ==============================================================================
// NIHONGOSETU — UNIVERSAL MULTILINGUAL LANGUAGE REGISTRY
// Language-Agnostic Understanding, Explanation, and Speech Support
// ==============================================================================

export type LanguageRegion =
  | "Indian"
  | "East Asian"
  | "Southeast Asian"
  | "European"
  | "Middle Eastern";

export interface UniversalLanguage {
  code: string; // ISO 639-1 / BCP-47
  name: string; // English Name
  nativeName: string; // Native Script
  speechCode: string; // Primary BCP-47 speech tag
  alternateSpeechCodes?: string[]; // Fallback speech codes
  region: LanguageRegion;
  keywords: string[]; // Search/trigger keywords (lowercased)
}

export const UNIVERSAL_LANGUAGES: UniversalLanguage[] = [
  // --- INDIAN LANGUAGES ---
  {
    code: "ta",
    name: "Tamil",
    nativeName: "தமிழ்",
    speechCode: "ta-IN",
    alternateSpeechCodes: ["ta-LK", "ta-SG"],
    region: "Indian",
    keywords: ["tamil", "தமிழ்", "tanglish", "tamizh", "thamizh", "தமிழில்"],
  },
  {
    code: "en",
    name: "English",
    nativeName: "English",
    speechCode: "en-US",
    alternateSpeechCodes: ["en-IN", "en-GB", "en-AU"],
    region: "Indian", // Common in India / Global
    keywords: ["english", "ஆங்கிலம்", "अंग्रेजी", "英語", "inglés", "anglais", "englische"],
  },
  {
    code: "hi",
    name: "Hindi",
    nativeName: "हिन्दी",
    speechCode: "hi-IN",
    region: "Indian",
    keywords: ["hindi", "हिन्दी", "हिंदी", "hinglish"],
  },
  {
    code: "te",
    name: "Telugu",
    nativeName: "తెలుగు",
    speechCode: "te-IN",
    region: "Indian",
    keywords: ["telugu", "తెలుగు"],
  },
  {
    code: "ml",
    name: "Malayalam",
    nativeName: "മലയാളം",
    speechCode: "ml-IN",
    region: "Indian",
    keywords: ["malayalam", "മലയാളം"],
  },
  {
    code: "kn",
    name: "Kannada",
    nativeName: "ಕನ್ನಡ",
    speechCode: "kn-IN",
    region: "Indian",
    keywords: ["kannada", "ಕನ್ನಡ"],
  },
  {
    code: "bn",
    name: "Bengali",
    nativeName: "বাংলা",
    speechCode: "bn-IN",
    alternateSpeechCodes: ["bn-BD"],
    region: "Indian",
    keywords: ["bengali", "bangla", "বাংলা"],
  },
  {
    code: "mr",
    name: "Marathi",
    nativeName: "मराठी",
    speechCode: "mr-IN",
    region: "Indian",
    keywords: ["marathi", "मराठी"],
  },
  {
    code: "gu",
    name: "Gujarati",
    nativeName: "ગુજરાતી",
    speechCode: "gu-IN",
    region: "Indian",
    keywords: ["gujarati", "ગુજરાતી"],
  },
  {
    code: "pa",
    name: "Punjabi",
    nativeName: "ਪੰਜਾਬੀ",
    speechCode: "pa-IN",
    region: "Indian",
    keywords: ["punjabi", "ਪੰਜਾਬੀ"],
  },
  {
    code: "ur",
    name: "Urdu",
    nativeName: "اردو",
    speechCode: "ur-IN",
    alternateSpeechCodes: ["ur-PK"],
    region: "Indian",
    keywords: ["urdu", "اردو"],
  },
  {
    code: "or",
    name: "Odia",
    nativeName: "ଓଡ଼ିଆ",
    speechCode: "or-IN",
    region: "Indian",
    keywords: ["odia", "oriya", "ଓଡ଼ିଆ"],
  },
  {
    code: "as",
    name: "Assamese",
    nativeName: "অসমীয়া",
    speechCode: "as-IN",
    region: "Indian",
    keywords: ["assamese", "অসমীয়া"],
  },
  {
    code: "sa",
    name: "Sanskrit",
    nativeName: "संस्कृतम्",
    speechCode: "sa-IN",
    region: "Indian",
    keywords: ["sanskrit", "संस्कृतम्", "संस्कृत"],
  },
  {
    code: "ne",
    name: "Nepali",
    nativeName: "नेपाली",
    speechCode: "ne-NP",
    region: "Indian",
    keywords: ["nepali", "नेपाली"],
  },
  {
    code: "kok",
    name: "Konkani",
    nativeName: "कोंकणी",
    speechCode: "kok-IN",
    region: "Indian",
    keywords: ["konkani", "कोंकणी"],
  },
  {
    code: "ks",
    name: "Kashmiri",
    nativeName: "کٲشُر",
    speechCode: "ks-IN",
    region: "Indian",
    keywords: ["kashmiri", "کٲشُر"],
  },
  {
    code: "sd",
    name: "Sindhi",
    nativeName: "سنڌي",
    speechCode: "sd-IN",
    region: "Indian",
    keywords: ["sindhi", "سنڌي"],
  },
  {
    code: "mni",
    name: "Manipuri (Meitei)",
    nativeName: "ꯃꯤꯇꯩꯂꯣꯟ",
    speechCode: "mni-IN",
    region: "Indian",
    keywords: ["manipuri", "meitei", "ꯃꯤꯇꯩꯂꯣꯟ"],
  },
  {
    code: "sat",
    name: "Santali",
    nativeName: "ᱥᱟᱱᱛᱟᱲᱤ",
    speechCode: "sat-IN",
    region: "Indian",
    keywords: ["santali", "ᱥᱟᱱᱛᱟᱲᱤ"],
  },
  {
    code: "mai",
    name: "Maithili",
    nativeName: "मैथिली",
    speechCode: "mai-IN",
    region: "Indian",
    keywords: ["maithili", "मैथिली"],
  },
  {
    code: "doi",
    name: "Dogri",
    nativeName: "डोगरी",
    speechCode: "doi-IN",
    region: "Indian",
    keywords: ["dogri", "डोगरी"],
  },
  {
    code: "brx",
    name: "Bodo",
    nativeName: "बड़ो",
    speechCode: "brx-IN",
    region: "Indian",
    keywords: ["bodo", "बड़ो"],
  },

  // --- EAST ASIAN LANGUAGES ---
  {
    code: "ja",
    name: "Japanese",
    nativeName: "日本語",
    speechCode: "ja-JP",
    region: "East Asian",
    keywords: ["japanese", "日本語", "nihongo", "にほんご", "japonais", "japonaise", "japonés", "japanisch"],
  },
  {
    code: "zh-CN",
    name: "Simplified Chinese",
    nativeName: "简体中文",
    speechCode: "zh-CN",
    region: "East Asian",
    keywords: ["chinese", "mandarin", "中文", "简体中文", "普通话", "zhongwen"],
  },
  {
    code: "zh-TW",
    name: "Traditional Chinese",
    nativeName: "繁體中文",
    speechCode: "zh-TW",
    region: "East Asian",
    keywords: ["traditional chinese", "繁體中文", "國語"],
  },
  {
    code: "ko",
    name: "Korean",
    nativeName: "한국어",
    speechCode: "ko-KR",
    region: "East Asian",
    keywords: ["korean", "한국어", "hangul", "조선말"],
  },

  // --- SOUTHEAST ASIAN LANGUAGES ---
  {
    code: "fil",
    name: "Filipino / Tagalog",
    nativeName: "Filipino",
    speechCode: "fil-PH",
    alternateSpeechCodes: ["tl-PH"],
    region: "Southeast Asian",
    keywords: ["filipino", "tagalog", "pilipino", "tagalog language"],
  },
  {
    code: "id",
    name: "Indonesian",
    nativeName: "Bahasa Indonesia",
    speechCode: "id-ID",
    region: "Southeast Asian",
    keywords: ["indonesian", "bahasa indonesia", "indo"],
  },
  {
    code: "ms",
    name: "Malay",
    nativeName: "Bahasa Melayu",
    speechCode: "ms-MY",
    region: "Southeast Asian",
    keywords: ["malay", "bahasa melayu", "melayu"],
  },
  {
    code: "th",
    name: "Thai",
    nativeName: "ภาษาไทย",
    speechCode: "th-TH",
    region: "Southeast Asian",
    keywords: ["thai", "ภาษาไทย", "siamese"],
  },
  {
    code: "vi",
    name: "Vietnamese",
    nativeName: "Tiếng Việt",
    speechCode: "vi-VN",
    region: "Southeast Asian",
    keywords: ["vietnamese", "tiếng việt", "tieng viet"],
  },
  {
    code: "my",
    name: "Burmese",
    nativeName: "မြန်မာဘာသာ",
    speechCode: "my-MM",
    region: "Southeast Asian",
    keywords: ["burmese", "myanmar", "မြန်မာဘာသာ"],
  },
  {
    code: "km",
    name: "Khmer",
    nativeName: "ភាសាខ្មែរ",
    speechCode: "km-KH",
    region: "Southeast Asian",
    keywords: ["khmer", "cambodian", "ភាសាខ្មែរ"],
  },
  {
    code: "lo",
    name: "Lao",
    nativeName: "ພາສາລາວ",
    speechCode: "lo-LA",
    region: "Southeast Asian",
    keywords: ["lao", "laotian", "ພາສາລາວ"],
  },

  // --- EUROPEAN LANGUAGES ---
  {
    code: "fr",
    name: "French",
    nativeName: "Français",
    speechCode: "fr-FR",
    alternateSpeechCodes: ["fr-CA"],
    region: "European",
    keywords: ["french", "français", "francais", "en français", "französisch"],
  },
  {
    code: "es",
    name: "Spanish",
    nativeName: "Español",
    speechCode: "es-ES",
    alternateSpeechCodes: ["es-MX", "es-US"],
    region: "European",
    keywords: ["spanish", "español", "espanol", "en español", "castellano"],
  },
  {
    code: "pt",
    name: "Portuguese",
    nativeName: "Português",
    speechCode: "pt-PT",
    alternateSpeechCodes: ["pt-BR"],
    region: "European",
    keywords: ["portuguese", "português", "portugues"],
  },
  {
    code: "de",
    name: "German",
    nativeName: "Deutsch",
    speechCode: "de-DE",
    region: "European",
    keywords: ["german", "deutsch", "auf deutsch", "allemand"],
  },
  {
    code: "it",
    name: "Italian",
    nativeName: "Italiano",
    speechCode: "it-IT",
    region: "European",
    keywords: ["italian", "italiano", "in italiano"],
  },
  {
    code: "ru",
    name: "Russian",
    nativeName: "Русский",
    speechCode: "ru-RU",
    region: "European",
    keywords: ["russian", "русский", "по-русски", "русс"],
  },
  {
    code: "uk",
    name: "Ukrainian",
    nativeName: "Українська",
    speechCode: "uk-UA",
    region: "European",
    keywords: ["ukrainian", "українська", "українською"],
  },
  {
    code: "nl",
    name: "Dutch",
    nativeName: "Nederlands",
    speechCode: "nl-NL",
    region: "European",
    keywords: ["dutch", "nederlands", "in het nederlands"],
  },
  {
    code: "pl",
    name: "Polish",
    nativeName: "Polski",
    speechCode: "pl-PL",
    region: "European",
    keywords: ["polish", "polski", "po polsku"],
  },
  {
    code: "sv",
    name: "Swedish",
    nativeName: "Svenska",
    speechCode: "sv-SE",
    region: "European",
    keywords: ["swedish", "svenska", "på svenska"],
  },
  {
    code: "no",
    name: "Norwegian",
    nativeName: "Norsk",
    speechCode: "nb-NO",
    region: "European",
    keywords: ["norwegian", "norsk", "på norsk"],
  },
  {
    code: "da",
    name: "Danish",
    nativeName: "Dansk",
    speechCode: "da-DK",
    region: "European",
    keywords: ["danish", "dansk", "på dansk"],
  },
  {
    code: "fi",
    name: "Finnish",
    nativeName: "Suomi",
    speechCode: "fi-FI",
    region: "European",
    keywords: ["finnish", "suomi", "suomeksi"],
  },
  {
    code: "el",
    name: "Greek",
    nativeName: "Ελληνικά",
    speechCode: "el-GR",
    region: "European",
    keywords: ["greek", "ελληνικά", "greek language"],
  },
  {
    code: "cs",
    name: "Czech",
    nativeName: "Čeština",
    speechCode: "cs-CZ",
    region: "European",
    keywords: ["czech", "čeština", "česky"],
  },
  {
    code: "ro",
    name: "Romanian",
    nativeName: "Română",
    speechCode: "ro-RO",
    region: "European",
    keywords: ["romanian", "română", "romana"],
  },
  {
    code: "hu",
    name: "Hungarian",
    nativeName: "Magyar",
    speechCode: "hu-HU",
    region: "European",
    keywords: ["hungarian", "magyar", "magyarul"],
  },
  {
    code: "tr",
    name: "Turkish",
    nativeName: "Türkçe",
    speechCode: "tr-TR",
    region: "European",
    keywords: ["turkish", "türkçe", "turkce"],
  },

  // --- MIDDLE EASTERN LANGUAGES ---
  {
    code: "ar",
    name: "Arabic",
    nativeName: "العربية",
    speechCode: "ar-SA",
    alternateSpeechCodes: ["ar-EG", "ar-AE"],
    region: "Middle Eastern",
    keywords: ["arabic", "العربية", "عربي", "بالعربية"],
  },
  {
    code: "fa",
    name: "Persian (Farsi)",
    nativeName: "فارسی",
    speechCode: "fa-IR",
    region: "Middle Eastern",
    keywords: ["persian", "farsi", "فارسی"],
  },
  {
    code: "he",
    name: "Hebrew",
    nativeName: "עברית",
    speechCode: "he-IL",
    region: "Middle Eastern",
    keywords: ["hebrew", "עברית", "ivrit"],
  },
];

// Quick Lookup Map
const LANGUAGE_BY_CODE = new Map<string, UniversalLanguage>();
UNIVERSAL_LANGUAGES.forEach((lang) => {
  LANGUAGE_BY_CODE.set(lang.code.toLowerCase(), lang);
});

export function getLanguageByCode(code?: string): UniversalLanguage | undefined {
  if (!code) return undefined;
  return LANGUAGE_BY_CODE.get(code.toLowerCase());
}

export function findLanguageByNameOrKeyword(query: string): UniversalLanguage | undefined {
  if (!query) return undefined;
  const clean = query.trim().toLowerCase();

  // Exact code match
  if (LANGUAGE_BY_CODE.has(clean)) return LANGUAGE_BY_CODE.get(clean);

  // Exact or keyword match
  for (const lang of UNIVERSAL_LANGUAGES) {
    if (lang.name.toLowerCase() === clean) return lang;
    if (lang.nativeName.toLowerCase() === clean) return lang;
    if (lang.keywords.some((kw) => kw.toLowerCase() === clean)) return lang;
  }

  // Substring match
  for (const lang of UNIVERSAL_LANGUAGES) {
    if (lang.keywords.some((kw) => clean.includes(kw.toLowerCase()))) return lang;
  }

  return undefined;
}
