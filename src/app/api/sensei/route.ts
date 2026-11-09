import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

// Rate limiting in-memory store: IP -> array of timestamps
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 20;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  const validTimestamps = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (validTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    rateLimitMap.set(ip, validTimestamps);
    return true;
  }

  validTimestamps.push(now);
  rateLimitMap.set(ip, validTimestamps);

  // Periodic cleanup if map grows
  if (rateLimitMap.size > 1000) {
    for (const [key, times] of rateLimitMap.entries()) {
      const active = times.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
      if (active.length === 0) rateLimitMap.delete(key);
      else rateLimitMap.set(key, active);
    }
  }

  return false;
}

const DEFAULT_SYSTEM_PROMPT = `You are Nihongo AI Sensei (日本語節の先生), a warm, encouraging, and expert Japanese teacher on the NihongoSetu platform.
Your mission is to help learners master Japanese from JLPT N5 to N1.

Key Teaching Guidelines:
1. Multilingual Support:
   - Detect the learner's language naturally.
   - You fluently understand and explain in English, Tamil (தமிழ்), Tanglish (Tamil in Latin script), Hindi (हिन्दी), Telugu (తెలుగు), Malayalam (മലയാളം), Kannada (ಕನ್ನಡ), Bengali, Marathi, Gujarati, Punjabi, Urdu, Odia, Japanese, Simplified/Traditional Chinese, Korean, Spanish, French, German, and Arabic.
   - If the student writes in Tamil or Tanglish (e.g., "Sensei, wa kum ga kum enna difference?", "epdi padikanum?"), respond naturally in their language while keeping Japanese terminology crystal-clear.

2. Authentic Japanese Structure:
   - Always provide Kanji/Kana + Romaji + Natural Translation.
   - Explain grammatical nuances (e.g., SOV order, particles, transitive vs. intransitive verbs).
   - Distinguish polite (丁寧語 / です・ます), casual (ため口), and respectful Keigo (尊敬語・謙譲語) when relevant.

3. Encouraging & Constructive Correction:
   - When a student makes a mistake, gently explain why, show the natural Japanese alternative, and encourage them.
   - For vocabulary and grammar, provide 1–2 practical, everyday example sentences.

4. Application & Button Context:
   - If the student asks about a button, feature, lesson, or stroke practice from the provided application context, explain the exact feature from the NihongoSetu interface accurately.`;

interface KnowledgeEntry {
  keywords: string[];
  reply: string;
}

const KNOWLEDGE_FALLBACKS: KnowledgeEntry[] = [
  {
    keywords: ["hello", "hi", "konnichiwa", "こんにちは", "வணக்கம்", "vanakkam", "namaste", "नमस्ते"],
    reply: `こんにちは！ (Konnichiwa!) Welcome to NihongoSetu.

I am Sensei, your Japanese language tutor. Whether you are learning Hiragana/Katakana stroke orders, JLPT N5 Kanji, core vocabulary, or grammar particles, I am here to guide you step-by-step.

Feel free to ask questions in English, Tamil (தமிழ் / Tanglish), Hindi (हिन्दी), or Japanese! What would you like to explore today?`,
  },
  {
    keywords: ["wa", "ga", "は", "が", "வித்தியாசம்"],
    reply: `**は (wa) vs. が (ga)** is one of the most fundamental grammatical distinctions in Japanese:

1. **は (wa) — Topic Marker:**
   • Marks what the sentence is *about* (the overarching topic).
   • Information *after* は is the new or important focus.
   • Example: 私は学生です (Watashi wa gakusei desu) = *Speaking of me, I am a student.*
   • Tamil / Tanglish: "என்னைப் பற்றிச் சொன்னால், நான் ஒரு மாணவன்."

2. **が (ga) — Subject Marker (Identifier):**
   • Identifies *who* or *what* specifically performs the action.
   • Information *before* が is the key answer to "who?" or "which?".
   • Example: だれが来ましたか？ 田中さんが来ました (Tanaka-san ga kimashita) = *Who came? Tanaka-san (specifically) came.*
   • Tamil / Tanglish: "யார் வந்தார்? தனகா தான் வந்தார் (குறிப்பிட்டுச் சொல்கிறது)."

**Quick Rule of Thumb:** If someone asks "Who did it?", use **が**. If introducing a general topic, use **は**.`,
  },
  {
    keywords: ["te-form", "te form", "て形", "conjugat", "て-form"],
    reply: `The Japanese て-form (Te-Form) links clauses, makes polite requests (〜てください), and expresses continuous action (〜ています).

Conjugation guide for Group 1 (Godan) Verbs:
• う, つ, る → って (買う → 買って / 待つ → 待って)
• む, ぶ, ぬ → んで (飲む → 飲んで / 死ぬ → 死んで)
• く → いて (書く → 書いて) ※ Exception: 行く → 行って
• ぐ → いで (泳ぐ → 泳いで)
• す → して (話す → 話して)

Group 2 (Ichidan) Verbs: Drop る and add て:
• 食べる → 食べて
• 見る → 見て

Irregular Verbs:
• する → して
• くる (来る) → きて (来て)`,
  },
  {
    keywords: ["restaurant", "food", "dining", "order", "eat", "cafe", "menu"],
    reply: `Essential Japanese dining phrases:

1. すみません！ (Sumimasen!) — "Excuse me!" (Call the waiter's attention).
2. これをください (Kore o kudasai) — "This one, please." (Pointing at the menu).
3. お水をいただけますか？ (Omizu o itadakemasu ka?) — "Could I please have some water?"
4. お会計をお願いします (O-kaikei o onegai shimasu) — "The check/bill, please."
5. ごちそうさまでした！ (Gochisousama deshita!) — "Thank you for the delicious meal!" (Said to the staff when leaving).`,
  },
  {
    keywords: ["kanji", "radical", "reading", "on-yomi", "kun-yomi", "onyomi", "kunyomi"],
    reply: `Understanding Kanji Readings (音読み On-yomi vs 訓読み Kun-yomi):

1. 音読み (On-yomi) — Chinese-derived phonetic readings:
   • Used mostly in multi-kanji compound words (熟語 Jukugo).
   • Example: 水 (SUI) in 水泳 (suiei - swimming).

2. 訓読み (Kun-yomi) — Native Japanese readings:
   • Used when the kanji stands alone as a word, often with okurigana (hiragana suffixes).
   • Example: 水 (mizu - water).

Study Tip: Learn kanji inside real vocabulary words rather than memorizing isolated readings!`,
  },
  {
    keywords: ["particle", "particles", "助詞", "ni", "de", "wo", "to"],
    reply: `Core Japanese Particles Overview:

• を (o/wo): Direct object marker → 本を読む (Hon o yomu — Read a book)
• に (ni): Specific time, destination, indirect object → 東京に行く (Toukyou ni iku — Go to Tokyo)
• で (de): Location of an action, means/tool → 電車で行く (Densha de iku — Go by train)
• と (to): "And" (exhaustive list), or "with" a person → 友達と話す (Tomodachi to hanasu — Talk with a friend)
• も (mo): "Also" / "too" (replaces は/を) → 私も行きます (Watashi mo ikimasu — I will also go)`,
  },
  {
    keywords: ["jlpt", "n5", "n4", "n3", "n2", "n1", "exam", "pass", "score"],
    reply: `JLPT (Japanese-Language Proficiency Test) Level Overview:

• N5 (Beginner): ~100 Kanji, ~800 Vocabulary. Basic Hiragana, Katakana, and daily expressions.
• N4 (Elementary): ~300 Kanji, ~1,500 Vocabulary. Comprehension of everyday topics and basic conversations.
• N3 (Intermediate): ~650 Kanji, ~3,750 Vocabulary. Bridge level to natural newspaper headlines and moderate speeds.
• N2 (Pre-Advanced): ~1,000 Kanji, ~6,000 Vocabulary. Business Japanese, abstract articles, and natural dialogues.
• N1 (Advanced): ~2,000+ Kanji, ~10,000+ Vocabulary. Nuanced native-level comprehension across technical/academic fields.

Passing threshold on NihongoSetu mock exams is 70%. Consistency in daily flashcards and mock tests is key!`,
  },
];

export async function POST(req: NextRequest) {
  // 1. Authentication Check (Require authenticated learner or admin session)
  const sessionCookie = req.cookies.get("nihongo_session")?.value;
  const authHeader = req.headers.get("authorization");

  let isAuthenticated = false;
  if (sessionCookie) {
    try {
      const parsed = JSON.parse(decodeURIComponent(sessionCookie));
      if (parsed && typeof parsed.email === "string" && parsed.email.length > 0) {
        isAuthenticated = true;
      }
    } catch {
      isAuthenticated = false;
    }
  }
  if (!isAuthenticated && authHeader && authHeader.startsWith("Bearer ")) {
    isAuthenticated = true;
  }

  if (!isAuthenticated) {
    return NextResponse.json(
      { error: "Authentication required to consult AI Sensei. Please sign in to NihongoSetu." },
      { status: 401 }
    );
  }

  // 2. Rate limiting check
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "127.0.0.1";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Please wait a minute before sending another question to Sensei." },
      { status: 429 }
    );
  }

  // 2. Parse request payload
  let prompt = "";
  let instructions = DEFAULT_SYSTEM_PROMPT;
  let contextInfo = "";

  try {
    const body = await req.json();

    if (body.prompt && typeof body.prompt === "string") {
      prompt = body.prompt.trim();
    } else if (Array.isArray(body.messages) && body.messages.length > 0) {
      const last = body.messages[body.messages.length - 1];
      if (last && typeof last.content === "string") {
        prompt = last.content.trim();
      }
    }

    if (body.instructions && typeof body.instructions === "string") {
      instructions = body.instructions;
    }

    if (body.context && typeof body.context === "object") {
      contextInfo = `\n\n[Active Application & Learning Context]:\n${JSON.stringify(body.context, null, 2)}`;
    }
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON request payload." },
      { status: 400 }
    );
  }

  // 3. Validation
  if (!prompt) {
    return NextResponse.json(
      { error: "Prompt cannot be empty." },
      { status: 400 }
    );
  }

  if (prompt.length > 1000) {
    return NextResponse.json(
      { error: "Prompt is too long (maximum 1000 characters)." },
      { status: 400 }
    );
  }

  // 4. Google GenAI SDK Integration (Server-side via GEMINI_API_KEY environment variable)
  const geminiApiKey = process.env.GEMINI_API_KEY?.trim();
  const isKeyConfigured = Boolean(
    geminiApiKey &&
    !geminiApiKey.includes("your_") &&
    geminiApiKey.length > 10
  );

  if (isKeyConfigured && geminiApiKey) {
    const fullUserPrompt = contextInfo ? `${prompt}${contextInfo}` : prompt;
    const ai = new GoogleGenAI({ apiKey: geminiApiKey });
    const targetModel = process.env.GEMINI_MODEL || "gemini-2.5-flash";

    try {
      const response = await ai.models.generateContent({
        model: targetModel,
        contents: fullUserPrompt,
        config: {
          systemInstruction: instructions,
          temperature: 0.6,
          maxOutputTokens: 1000,
        },
      });

      const candidateText = response.text?.trim();
      if (candidateText) {
        return NextResponse.json({
          reply: candidateText,
          source: "gemini",
        });
      }
    } catch {
      // Fallback attempt with gemini-1.5-flash in case primary model is temporarily unavailable
      try {
        const response = await ai.models.generateContent({
          model: "gemini-1.5-flash",
          contents: fullUserPrompt,
          config: {
            systemInstruction: instructions,
            temperature: 0.6,
            maxOutputTokens: 1000,
          },
        });

        const candidateText = response.text?.trim();
        if (candidateText) {
          return NextResponse.json({
            reply: candidateText,
            source: "gemini",
          });
        }
      } catch {
        // Fallback gracefully to local intelligent knowledge bank without exposing errors or keys
      }
    }
  }

  // 5. Intelligent Pedagogical Fallback
  const lowerPrompt = prompt.toLowerCase();
  for (const entry of KNOWLEDGE_FALLBACKS) {
    if (entry.keywords.some((kw) => lowerPrompt.includes(kw.toLowerCase()))) {
      return NextResponse.json({
        reply: entry.reply,
        source: "fallback",
      });
    }
  }

  // Generic encouraging tutor response
  const genericReply = `こんにちは！ That is an insightful question about Japanese language learning.

In Japanese, always keep the fundamental sentence structure in mind:
• Subject / Topic: Marked by は (wa) or が (ga)
• Object: Marked by を (o/wo)
• Verb: Always placed at the end of the clause

Example:
私は日本語を勉強しています。
(Watashi wa nihongo o benkyou shite imasu.)
"I am studying Japanese."

Would you like to explore specific example sentences, practice conjugations, or dive into JLPT exam questions for your target level?`;

  return NextResponse.json({
    reply: genericReply,
    source: "fallback",
  });
}
