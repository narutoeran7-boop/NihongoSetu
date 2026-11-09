import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { detectLanguages } from "@/lib/sensei/languageDetector";
import { buildSystemInstruction, validateResponseLanguage } from "@/lib/sensei/promptBuilder";
import { getLanguageByCode } from "@/lib/sensei/languages";

// Rate limiting in-memory store: IP -> array of timestamps
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 30;

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
    } else if (Array.isArray(body.messages) && body.messages.length > 0) {
      const last = body.messages[body.messages.length - 1];
      if (last && typeof last.content === "string") {
        prompt = last.content.trim();
      }
    }

    if (body.mode === "voice_conversation") {
      mode = "voice_conversation";
    }

    if (body.inputLanguage && typeof body.inputLanguage === "string") {
      requestedInputLang = body.inputLanguage;
    }

    if (body.explanationLanguage && typeof body.explanationLanguage === "string") {
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
  if (!prompt) {
    return NextResponse.json(
      { error: "Prompt cannot be empty." },
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
    const fullUserPrompt = contextInfo ? `${prompt}${contextInfo}` : prompt;
    const ai = new GoogleGenAI({ apiKey: geminiApiKey });
    const targetModel = process.env.GEMINI_MODEL || "gemini-3.5-flash";

    try {
      const response = await ai.models.generateContent({
        model: targetModel,
        contents: fullUserPrompt,
        config: {
          systemInstruction: instructions,
          temperature: isVoiceMode ? 0.7 : 0.6,
          maxOutputTokens: isVoiceMode ? 450 : 1200,
        },
      });

      let candidateText = response.text?.trim();

      // 7. Response Language Validation (Requirement 11)
      if (candidateText) {
        const validation = validateResponseLanguage(candidateText, effectiveExplanationLang);
        if (!validation.isValid && effectiveExplanationLang !== "ja") {
          // Perform 1 controlled retry enforcing the requested explanation language
          try {
            const retryResponse = await ai.models.generateContent({
              model: targetModel,
              contents: `${fullUserPrompt}\n\n[MANDATORY CORRECTION: You must provide the explanation in ${targetLang.name} (${targetLang.nativeName}). Do not write solely in Japanese.]`,
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
          } catch {
            // Keep candidateText if retry failed
          }
        }

        return NextResponse.json({
          reply: candidateText,
          source: "gemini",
          detectedInputLanguage: detection.detectedInputLanguage,
          explanationLanguage: effectiveExplanationLang,
          explanationLanguageName: targetLang.name,
          voiceOutputLanguage: effectiveVoiceLang,
          isExplicit: detection.isExplicit,
        });
      }
    } catch {
      // Fallback attempt with gemini-3.1-flash-lite in case primary model is temporarily unavailable
      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.1-flash-lite",
          contents: fullUserPrompt,
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
            explanationLanguage: effectiveExplanationLang,
            explanationLanguageName: targetLang.name,
            voiceOutputLanguage: effectiveVoiceLang,
            isExplicit: detection.isExplicit,
          });
        }
      } catch {
        // Fallback gracefully to multilingual knowledge bank
      }
    }
  }

  // 8. Pedagogical Multilingual Fallback
  if (isVoiceMode) {
    return NextResponse.json({
      reply: getVoiceFallback(effectiveExplanationLang),
      source: "fallback",
      detectedInputLanguage: detection.detectedInputLanguage,
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
    explanationLanguage: effectiveExplanationLang,
    explanationLanguageName: targetLang.name,
    voiceOutputLanguage: effectiveVoiceLang,
    isExplicit: detection.isExplicit,
  });
}
