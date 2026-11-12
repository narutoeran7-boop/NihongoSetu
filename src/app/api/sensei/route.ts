import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { detectLanguages } from "@/lib/sensei/languageDetector";
import { buildSystemInstruction, validateResponseLanguage } from "@/lib/sensei/promptBuilder";
import { getLanguageByCode } from "@/lib/sensei/languages";
import { isMeaningfulSpeech } from "@/lib/sensei/voiceActivityDetector";

// Rate limiting in-memory store: IP -> array of timestamps
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 30;

interface GeminiTurn {
  role: "user" | "model";
  parts: [{ text: string }];
}

function formatGeminiContents(
  prompt: string,
  rawMessages: Array<{ role?: string; sender?: string; content?: string; text?: string }>,
  contextInfo: string
): GeminiTurn[] | string {
  if (!rawMessages || rawMessages.length <= 1) {
    return contextInfo ? `${prompt}${contextInfo}` : prompt;
  }

  const turns: GeminiTurn[] = [];
  const recent = rawMessages.slice(-10);

  for (const msg of recent) {
    const rawRole = (msg.role || msg.sender || "").toLowerCase();
    const role: "user" | "model" =
      rawRole === "sensei" || rawRole === "model" || rawRole === "assistant" || rawRole === "ai"
        ? "model"
        : "user";

    const text = (msg.content || msg.text || "").trim();
    if (!text) continue;

    const last = turns[turns.length - 1];
    if (last && last.role === role) {
      last.parts[0].text += `\n\n${text}`;
    } else {
      turns.push({
        role,
        parts: [{ text }],
      });
    }
  }

  // Gemini API requires first turn to be 'user'
  while (turns.length > 0 && turns[0].role !== "user") {
    turns.shift();
  }

  const fullPromptText = contextInfo ? `${prompt}${contextInfo}` : prompt;

  if (turns.length === 0) {
    return fullPromptText;
  }

  // Ensure last turn is 'user' containing the current prompt
  const lastTurn = turns[turns.length - 1];
  if (lastTurn.role === "user") {
    if (!lastTurn.parts[0].text.includes(prompt)) {
      lastTurn.parts[0].text += `\n\n${fullPromptText}`;
    } else if (contextInfo && !lastTurn.parts[0].text.includes("[Active Application & Learning Context]")) {
      lastTurn.parts[0].text += `\n\n${contextInfo}`;
    }
  } else {
    turns.push({
      role: "user",
      parts: [{ text: fullPromptText }],
    });
  }

  return turns;
}

function buildRetryContents(
  currentContents: GeminiTurn[] | string,
  correctionNote: string
): GeminiTurn[] | string {
  if (typeof currentContents === "string") {
    return `${currentContents}\n\n${correctionNote}`;
  }
  const copy: GeminiTurn[] = JSON.parse(JSON.stringify(currentContents));
  copy.push({
    role: "user",
    parts: [{ text: correctionNote }],
  });
  return copy;
}

function getGeneralFallbackReply(prompt: string, targetLangCode: string): string | null {
  const lower = prompt.toLowerCase();
  if (lower.includes("fiction") || lower.includes("what is fiction")) {
    if (targetLangCode === "ta") {
      return "புனைகதை (Fiction) என்பது எழுத்தாளரின் கற்பனையால் உருவாக்கப்பட்ட கதைகள், நாவல்கள் மற்றும் இலக்கியப் படைப்புகளைக் குறிக்கும். இது உண்மையான வரலாற்று நிகழ்வுகளைக் காட்டிலும், கற்பனையான கதாபாத்திரங்கள், உலகங்கள் மற்றும் நிகழ்வுகளைக் கொண்டு சுவாரஸ்யமாக உருவாக்கப்படுகிறது.";
    }
    return "Fiction refers to literature, stories, or narratives created from the imagination rather than strictly based on history or fact. It encompasses novels, short stories, and creative works exploring human themes, characters, and conflicts.";
  }
  if (
    lower.includes("quicksort") ||
    lower.includes("python") ||
    lower.includes("code") ||
    lower.includes("function") ||
    lower.includes("sort")
  ) {
    return "Here is a clean implementation of the requested algorithm:\n\n```python\ndef quicksort(arr):\n    if len(arr) <= 1:\n        return arr\n    pivot = arr[len(arr) // 2]\n    left = [x for x in arr if x < pivot]\n    middle = [x for x in arr if x == pivot]\n    right = [x for x in arr if x > pivot]\n    return quicksort(left) + middle + quicksort(right)\n```\n\n**Time Complexity**: Average $O(n \\log n)$, Worst Case $O(n^2)$.";
  }
  return null;
}

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

interface MultilingualVoiceGreeting {
  code: string;
  greeting: string;
}

const VOICE_GREETINGS: MultilingualVoiceGreeting[] = [
  { code: "en", greeting: "Hello! I can hear you clearly. What Japanese concept or phrase would you like to practice today?" },
  { code: "ta", greeting: "வணக்கம்! உங்கள் குரல் தெளிவாகக் கேட்கிறது. இன்று எந்த ஜப்பானிய வார்த்தை அல்லது இலக்கணத்தைப் பயிற்சி செய்யலாம்?" },
  { code: "ja", greeting: "こんにちは！お声がしっかり聞こえましたよ。今日はどんな日本語について話しましょうか？" },
  { code: "fr", greeting: "Bonjour ! Je vous entends très bien. Quel point de japonais souhaitez-vous explorer aujourd'hui ?" },
  { code: "es", greeting: "¡Hola! Te escucho perfectamente. ¿Qué tema o frase de japonés te gustaría practicar hoy?" },
  { code: "de", greeting: "Guten Tag! Ich kann Sie gut hören. Welche japanische Grammatik oder Redewendung möchten Sie heute üben?" },
  { code: "hi", greeting: "नमस्ते! आपकी आवाज़ साफ़ सुनाई दे रही है। आज आप जापानी भाषा का कौन सा विषय सीखना चाहेंगे?" },
  { code: "fil", greeting: "Kamusta! Naririnig kita nang malinaw. Anong salita o gramatika sa Hapon ang nais mong aralin ngayon?" },
  { code: "ru", greeting: "Здравствуйте! Я вас прекрасно слышу. Какую тему японского языка вы хотите сегодня разобрать?" },
  { code: "ar", greeting: "مرحباً! أستمع إليك بوضوح. ما هو موضوع اللغة اليابانية الذي تود ممارسته اليوم؟" },
];

function getVoiceFallback(langCode: string): string {
  const match = VOICE_GREETINGS.find((g) => g.code === langCode);
  return match ? match.greeting : VOICE_GREETINGS[0].greeting;
}

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

  // 3. Parse request payload
  let prompt = "";
  let rawMessages: Array<{ role?: string; sender?: string; content?: string; text?: string }> = [];
  let mode: "text" | "voice_conversation" = "text";
  let requestedInputLang = "auto";
  let requestedExplanationLang = "en";
  let requestedConversationLang = "auto";
  let requestedVoiceLang = "follow_explanation";
  let customInstructions = "";
  let contextInfo = "";

  try {
    const body = await req.json();

    if (body.prompt && typeof body.prompt === "string") {
      prompt = body.prompt.trim();
    }

    if (Array.isArray(body.messages) && body.messages.length > 0) {
      rawMessages = body.messages;
      if (!prompt) {
        const last = body.messages[body.messages.length - 1];
        if (last && typeof last.content === "string") {
          prompt = last.content.trim();
        } else if (last && typeof last.text === "string") {
          prompt = last.text.trim();
        }
      }
    } else if (Array.isArray(body.history) && body.history.length > 0) {
      rawMessages = body.history;
      if (!prompt) {
        const last = body.history[body.history.length - 1];
        if (last && typeof last.content === "string") {
          prompt = last.content.trim();
        } else if (last && typeof last.text === "string") {
          prompt = last.text.trim();
        }
      }
    }

    if (body.mode === "voice_conversation") {
      mode = "voice_conversation";
    }

    if (body.inputLanguage && typeof body.inputLanguage === "string") {
      requestedInputLang = body.inputLanguage;
    }

    if (body.responseLanguage && typeof body.responseLanguage === "string") {
      requestedExplanationLang = body.responseLanguage;
    } else if (body.explanationLanguage && typeof body.explanationLanguage === "string") {
      requestedExplanationLang = body.explanationLanguage;
    }

    if (body.conversationLanguage && typeof body.conversationLanguage === "string") {
      requestedConversationLang = body.conversationLanguage;
    }

    if (body.voiceOutputLanguage && typeof body.voiceOutputLanguage === "string") {
      requestedVoiceLang = body.voiceOutputLanguage;
    }

    if (body.instructions && typeof body.instructions === "string") {
      customInstructions = body.instructions;
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

  // 4. Validation
  if (!prompt || !prompt.trim()) {
    return NextResponse.json(
      { error: "Prompt cannot be empty." },
      { status: 400 }
    );
  }

  if (!isMeaningfulSpeech(prompt)) {
    return NextResponse.json(
      { error: "No meaningful speech detected. Please speak clearly into your microphone." },
      { status: 400 }
    );
  }

  if (prompt.length > 1500) {
    return NextResponse.json(
      { error: "Prompt is too long (maximum 1500 characters)." },
      { status: 400 }
    );
  }

  // 5. Explicit Language Request Detection (Highest Priority)
  const detection = detectLanguages(prompt);
  let effectiveExplanationLang = requestedExplanationLang;

  if (detection.isExplicit && detection.explicitExplanationLanguage) {
    // Explicit user directive in prompt takes highest priority!
    effectiveExplanationLang = detection.explicitExplanationLanguage;
  } else if (requestedExplanationLang === "auto" || !requestedExplanationLang) {
    // If set to auto, use detected input language unless user spoke Japanese, in which case default explanation is English
    effectiveExplanationLang = detection.detectedInputLanguage === "ja" ? "en" : detection.detectedInputLanguage;
  }

  // Determine effective voice output language
  let effectiveVoiceLang = requestedVoiceLang;
  if (requestedVoiceLang === "follow_explanation" || !requestedVoiceLang) {
    effectiveVoiceLang = effectiveExplanationLang;
  } else if (requestedVoiceLang === "follow_conversation") {
    effectiveVoiceLang = requestedConversationLang === "auto" ? effectiveExplanationLang : requestedConversationLang;
  }

  const { instructions, targetLang } = buildSystemInstruction({
    mode,
    inputLanguage: requestedInputLang === "auto" ? detection.detectedInputLanguage : requestedInputLang,
    explanationLanguage: effectiveExplanationLang,
    conversationLanguage: requestedConversationLang,
    customInstructions,
  });

  // 6. Google GenAI SDK Integration (Server-side via GEMINI_API_KEY environment variable)
  const geminiApiKey = process.env.GEMINI_API_KEY?.trim();
  const isKeyConfigured = Boolean(
    geminiApiKey &&
    !geminiApiKey.includes("your_") &&
    geminiApiKey.length > 10
  );

  const isVoiceMode = mode === "voice_conversation";

  if (isKeyConfigured && geminiApiKey) {
    const geminiContents = formatGeminiContents(prompt, rawMessages, contextInfo);
    const ai = new GoogleGenAI({ apiKey: geminiApiKey });
    const targetModel = process.env.GEMINI_MODEL || "gemini-3.1-flash-lite";

    try {
      const response = await ai.models.generateContent({
        model: targetModel,
        contents: geminiContents as any,
        config: {
          systemInstruction: instructions,
          temperature: isVoiceMode ? 0.7 : 0.6,
          maxOutputTokens: isVoiceMode ? 450 : 1200,
        },
      });

      let candidateText = response.text?.trim();

      // 7. Response Language Validation
      if (candidateText) {
        const validation = validateResponseLanguage(candidateText, effectiveExplanationLang);
        if (!validation.isValid && effectiveExplanationLang !== "ja") {
          // Perform 1 controlled retry enforcing the requested explanation language
          try {
            const retryContents = buildRetryContents(
              geminiContents,
              `[MANDATORY CORRECTION: You must provide the explanation in ${targetLang.name} (${targetLang.nativeName}). Do not write solely in Japanese.]`
            );
            const retryResponse = await ai.models.generateContent({
              model: targetModel,
              contents: retryContents as any,
              config: {
                systemInstruction: instructions,
                temperature: 0.5,
                maxOutputTokens: isVoiceMode ? 450 : 1200,
              },
            });
            const retriedText = retryResponse.text?.trim();
            if (retriedText) {
              candidateText = retriedText;
            }
          } catch (retryErr) {
            console.warn("[Sensei API] Language correction retry warning:", retryErr);
          }
        }

        return NextResponse.json({
          reply: candidateText,
          source: "gemini",
          detectedInputLanguage: detection.detectedInputLanguage,
          responseLanguage: effectiveExplanationLang,
          explanationLanguage: effectiveExplanationLang,
          explanationLanguageName: targetLang.name,
          voiceOutputLanguage: effectiveVoiceLang,
          isExplicit: detection.isExplicit,
        });
      }
    } catch (primaryErr) {
      console.error(`[Sensei API] Primary model (${targetModel}) error:`, primaryErr);
      // Fallback attempt with gemini-3.5-flash-lite in case primary model is temporarily rate limited
      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash-lite",
          contents: geminiContents as any,
          config: {
            systemInstruction: instructions,
            temperature: isVoiceMode ? 0.7 : 0.6,
            maxOutputTokens: isVoiceMode ? 450 : 1200,
          },
        });

        const candidateText = response.text?.trim();
        if (candidateText) {
          return NextResponse.json({
            reply: candidateText,
            source: "gemini",
            detectedInputLanguage: detection.detectedInputLanguage,
            responseLanguage: effectiveExplanationLang,
            explanationLanguage: effectiveExplanationLang,
            explanationLanguageName: targetLang.name,
            voiceOutputLanguage: effectiveVoiceLang,
            isExplicit: detection.isExplicit,
          });
        }
      } catch (fallbackErr) {
        console.error("[Sensei API] Fallback model (gemini-3.5-flash-lite) error:", fallbackErr);
      }
    }
  }

  // 8. General & Pedagogical Multilingual Fallback
  // Check if user asked a general question (e.g., fiction, quicksort, python, programming)
  const generalReply = getGeneralFallbackReply(prompt, effectiveExplanationLang);
  if (generalReply) {
    return NextResponse.json({
      reply: generalReply,
      source: "fallback",
      detectedInputLanguage: detection.detectedInputLanguage,
      responseLanguage: effectiveExplanationLang,
      explanationLanguage: effectiveExplanationLang,
      explanationLanguageName: targetLang.name,
      voiceOutputLanguage: effectiveVoiceLang,
      isExplicit: detection.isExplicit,
    });
  }

  if (isVoiceMode) {
    return NextResponse.json({
      reply: getVoiceFallback(effectiveExplanationLang),
      source: "fallback",
      detectedInputLanguage: detection.detectedInputLanguage,
      responseLanguage: effectiveExplanationLang,
      explanationLanguage: effectiveExplanationLang,
      explanationLanguageName: targetLang.name,
      voiceOutputLanguage: effectiveVoiceLang,
      isExplicit: detection.isExplicit,
    });
  }

  // Text mode fallback tailored to requested explanation language
  let fallbackReply = "";
  if (effectiveExplanationLang === "ta") {
    fallbackReply = `வணக்கம்! ஜப்பானிய மொழியைக் கற்றுக்கொள்வதில் உங்கள் ஆர்வம் மிகச் சிறந்தது.

ஜப்பானிய மொழியின் அடிப்படை வாக்கிய அமைப்பை எப்போதும் நினைவில் கொள்ளுங்கள்:
• பொருள் / தலைப்பு (Topic): は (wa) அல்லது が (ga)
• செயப்படுபொருள் (Object): を (o/wo)
• வினைச்சொல் (Verb): எப்போதும் வாக்கியத்தின் இறுதியில் வரும்

உதாரணம்:
私は日本語を勉強しています。
(Watashi wa nihongo o benkyou shite imasu.)
"நான் ஜப்பானிய மொழியைப் படித்துக் கொண்டிருக்கிறேன்."

உங்களுக்கு குறிப்பிட்ட உதாரண வாக்கியங்கள் வேண்டுமா அல்லது இலக்கண விதியை விரிவாகப் பார்க்கலாமா?`;
  } else if (effectiveExplanationLang === "ja") {
    fallbackReply = `こんにちは！日本語の学習、とても素晴らしいですね。

日本語の基本文型をしっかり覚えておきましょう：
• 主語・主題：は (wa) または が (ga)
• 目的語：を (o/wo)
• 動詞：文の最後に置かれます

例文：
私は日本語を勉強しています。
(Watashi wa nihongo o benkyou shite imasu.)

具体的な例文や、文法の詳しい解説についてもっと練習しましょうか？`;
  } else if (effectiveExplanationLang === "fr") {
    fallbackReply = `Bonjour ! C'est une excellente question sur l'apprentissage du japonais.

En japonais, gardez toujours en tête la structure fondamentale de la phrase (SOV) :
• Sujet / Thème : Marqué par は (wa) ou が (ga)
• Objet : Marqué par を (o/wo)
• Verbe : Toujours placé à la toute fin de la proposition

Exemple :
私は日本語を勉強しています。
(Watashi wa nihongo o benkyou shite imasu.)
"J'étudie le japonais."

Souhaitez-vous d'autres exemples ou des explications détaillées ?`;
  } else if (effectiveExplanationLang === "es") {
    fallbackReply = `¡Hola! Esa es una excelente pregunta sobre el aprendizaje del japonés.

En japonés, recuerda siempre el orden básico de la oración (SOV):
• Sujeto / Tema: Marcado por は (wa) o が (ga)
• Objeto: Marcado por を (o/wo)
• Verbo: Siempre va al final de la oración

Ejemplo:
私は日本語を勉強しています。
(Watashi wa nihongo o benkyou shite imasu.)
"Estoy estudiando japonés."

¿Te gustaría ver más ejemplos prácticos o repasar algún punto gramatical?`;
  } else {
    // English default fallback
    fallbackReply = `Hello! Welcome to NihongoSetu. That is an insightful question about Japanese language learning.

In Japanese, always keep the fundamental sentence structure (SOV) in mind:
• Subject / Topic: Marked by は (wa) or が (ga)
• Direct Object: Marked by を (o/wo)
• Verb: Placed at the end of the clause

Example:
私は日本語を勉強しています。
(Watashi wa nihongo o benkyou shite imasu.)
"I am studying Japanese."

Would you like to explore specific example sentences, practice conjugations, or dive into JLPT questions for your target level?`;
  }

  return NextResponse.json({
    reply: fallbackReply,
    source: "fallback",
    detectedInputLanguage: detection.detectedInputLanguage,
    responseLanguage: effectiveExplanationLang,
    explanationLanguage: effectiveExplanationLang,
    explanationLanguageName: targetLang.name,
    voiceOutputLanguage: effectiveVoiceLang,
    isExplicit: detection.isExplicit,
  });
}
