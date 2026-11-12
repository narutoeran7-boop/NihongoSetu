"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Bot,
  User,
  Send,
  Sparkles,
  RotateCcw,
  Copy,
  Check,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  Mic,
  MicOff,
  Radio,
  Languages,
  Headphones,
  AlertCircle,
  MessageSquare,
  Activity,
  Zap,
  Volume1,
  Sliders,
  ChevronRight,
  Info,
} from "lucide-react";
import { getStudentProfile, DEFAULT_PROFILE, StudentProfile } from "@/lib/storage/studentState";
import { useSensei } from "@/lib/sensei/SenseiContext";
import { UNIVERSAL_LANGUAGES, getLanguageByCode } from "@/lib/sensei/languages";
import { VoiceActivityDetector, VADState, isMeaningfulSpeech } from "@/lib/sensei/voiceActivityDetector";

interface ChatMessage {
  id: string;
  sender: "user" | "sensei";
  text: string;
  timestamp: string;
  source?: "gemini" | "fallback";
}

type VoiceState =
  | "idle"
  | "listening"
  | "speech_detected"
  | "processing"
  | "speaking"
  | "no_speech_detected"
  | "interrupted"
  | "error";

const SPEECH_LANGUAGES = [
  { code: "ja-JP", label: "Japanese (日本語)", flag: "🇯🇵" },
  { code: "ta-IN", label: "Tamil (தமிழ்)", flag: "🇮🇳" },
  { code: "en-IN", label: "English (India)", flag: "🇮🇳" },
  { code: "en-US", label: "English (US)", flag: "🇺🇸" },
  { code: "hi-IN", label: "Hindi (हिन्दी)", flag: "🇮🇳" },
];

const PRACTICE_PRESETS = [
  {
    id: "free_chat",
    title: "Free Japanese Chat",
    badge: "日本語雑談",
    prompt: "こんにちは先生！今日は日常会話の練習をしたいです。何か質問してください。",
    desc: "Casual conversation practice with natural dialogue flow.",
  },
  {
    id: "polite_keigo",
    title: "Polite & Keigo Coach",
    badge: "敬語・丁寧語",
    prompt: "先生、丁寧語（です・ます）とビジネス敬語の使い分けを練習したいです。ロールプレイを始めましょう。",
    desc: "Master formal Japanese expressions for exams & work.",
  },
  {
    id: "n5_conversation",
    title: "JLPT N5 Practice",
    badge: "N5 レベル",
    prompt: "Please give me a JLPT N5 conversational listening exercise with a question and multiple choice options.",
    desc: "Targeted N5 grammar, particles, and daily life scenarios.",
  },
  {
    id: "pronunciation_accent",
    title: "Pronunciation & Pitch Feedback",
    badge: "発音・イントネーション",
    prompt: "I want to practice my Japanese pronunciation. I will speak a Japanese sentence; please review its phonetics, pitch accent tips, and particle usage.",
    desc: "Receive real-time phonetic and intonation feedback.",
  },
  {
    id: "tanglish_tamil",
    title: "Tamil / Tanglish Helper",
    badge: "தமிழ் / Tanglish",
    prompt: "Sensei, please teach me Japanese grammar using Tamil and Tanglish explanations!",
    desc: "Understand complex Japanese concepts through Tamil & Tanglish.",
  },
];

const SUGGESTED_PROMPTS = [
  "Explain the difference between は (wa) and が (ga)",
  "How do I conjugate Japanese verbs into the て-form (te-form)?",
  "Give me 5 essential conversational phrases for dining in Japan",
  "What is the grammatical nuance of 〜わけにはいかない (JLPT N2)?",
  "How can I remember Kanji readings effectively without forgetting?",
];

const KNOWLEDGE_RESPONSES: Record<string, string> = {
  "wa_ga": `**は (wa) vs. が (ga)** is one of the most fundamental grammatical distinctions in Japanese:

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
  "te_form": `**The Japanese て-form (Te-Form)** is essential for linking actions, making polite requests (〜てください), and expressing ongoing states (〜ています).

Here is the quick conjugation guide for **Group 1 (Godan) Verbs**:
• **う, つ, る** → **って** (買**う** → 買**って**)
• **む, ぶ, ぬ** → **んで** (飲**む** → 飲**んで**)
• **く** → **いて** (書**く** → 書**いて**) *(Exception: 行く → 行って)*
• **ぐ** → **いで** (泳**ぐ** → 泳**いで**)
• **す** → **して** (話**す** → 話**して**)

**Group 2 (Ichidan) Verbs:** Drop る and add て:
• 食べ**る** → 食べ**て**
• 見**る** → 見**て**

**Irregular Verbs:**
• する → **して**
• くる → **きて**`,
  "restaurant": `Here are **5 essential Japanese phrases** for dining:

1. **すみません！ (Sumimasen!)**
   • *Excuse me!* (Call the server's attention politely).
2. **これをください (Kore o kudasai)**
   • *This one, please.* (Pointing at the menu).
3. **お水をいただけますか？ (Omizu o itadakemasu ka?)**
   • *Could I please have some water?*
4. **お会計をお願いします (O-kaikei o onegai shimasu)**
   • *The bill/check, please.*
5. **ごちそうさまでした！ (Gochisousama deshita!)**
   • *Thank you for the delicious meal!* (Said when leaving the restaurant).`,
};

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "initial-1",
    sender: "sensei",
    text: `こんにちは！ (Konnichiwa!) 🌸

I am **Nihongo AI Sensei**, your dedicated Japanese tutor powered by Google Gemini.

How can I assist your Japanese learning journey today?
• 🎙️ **Live Voice Studio**: Click **"Live Voice Studio"** above for continuous, real-time voice conversation!
• 🗣️ **Microphone Input**: Click the mic icon below to speak your questions naturally.
• 🎌 **JLPT Guidance**: Ask about N5–N1 grammar, Kanji readings, particles, or pronunciation!`,
    timestamp: "10:00 AM",
    source: "gemini",
  },
];

function cleanMarkdownForSpeech(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/#{1,6}\s+/g, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^[*-]\s+/gm, "")
    .replace(/^\d+\.\s+/gm, "")
    .replace(/^>\s+/gm, "")
    .replace(/---/g, "")
    .replace(/\|/g, " ")
    .replace(/\n{2,}/g, "\n")
    .trim();
}

export default function AISenseiPage() {
  const { settings, updateSettings, activeLanguage } = useSensei();
  const counterRef = useRef(1);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [studentProfile, setStudentProfile] = useState<StudentProfile>(DEFAULT_PROFILE);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Active App Studio Mode: 'text' vs 'voice'
  const [studioMode, setStudioMode] = useState<"text" | "voice">("text");

  // Real-Time Voice Studio States
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const voiceStateRef = useRef<VoiceState>("idle");
  voiceStateRef.current = voiceState;

  const [speechLang, setSpeechLang] = useState("ja-JP");
  const [speechRate, setSpeechRate] = useState(0.92);
  const [isMuted, setIsMuted] = useState(false);
  const isMutedRef = useRef(false);
  isMutedRef.current = isMuted;

  const [recognitionError, setRecognitionError] = useState<string | null>(null);
  const [liveUserTranscript, setLiveUserTranscript] = useState("");
  const [liveSenseiTranscript, setLiveSenseiTranscript] = useState("");

  // VAD & Web Speech Refs
  const recognitionRef = useRef<any>(null);
  const vadRef = useRef<VoiceActivityDetector | null>(null);
  const interimTranscriptRef = useRef<string>("");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Conversational Concurrency & Stale Closure Prevention Refs
  const messagesRef = useRef<ChatMessage[]>(INITIAL_MESSAGES);
  messagesRef.current = messages;
  const processVoiceTurnRef = useRef<(text: string) => Promise<void>>(null as any);
  const isProcessingTurnRef = useRef(false);

  // SpeechSynthesis Garbage Collection & Watchdog Protection
  const activeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const speechWatchdogRef = useRef<any>(null);
  const speechKeepAliveIntervalRef = useRef<any>(null);

  // Text-To-Speech Playback State for Text Mode
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    // Hydration-safe initial profile sync
    setStudentProfile(getStudentProfile());

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const loadVoices = () => {
        const v = window.speechSynthesis.getVoices();
        if (v && v.length > 0) {
          setAvailableVoices(v);
        }
      };
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, liveSenseiTranscript]);

  // Clean up all audio/speech resources on unmount
  useEffect(() => {
    return () => {
      stopAllAudio();
    };
  }, []);

  const stopAllAudio = useCallback(() => {
    if (speechWatchdogRef.current) {
      clearTimeout(speechWatchdogRef.current);
      speechWatchdogRef.current = null;
    }
    if (speechKeepAliveIntervalRef.current) {
      clearInterval(speechKeepAliveIntervalRef.current);
      speechKeepAliveIntervalRef.current = null;
    }
    activeUtteranceRef.current = null;
    if (typeof window !== "undefined") {
      (window as any).__senseiActiveUtterance = null;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    if (vadRef.current) {
      vadRef.current.destroy();
      vadRef.current = null;
    }
    interimTranscriptRef.current = "";
    isProcessingTurnRef.current = false;
    setSpeakingMsgId(null);
    setIsPaused(false);
  }, []);

  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------
  // VAD & Web Audio Visualizer Setup
  // --------------------------------------------------------------------------
  const setupAudioAnalyser = async (): Promise<boolean> => {
    if (vadRef.current) {
      return true;
    }

    const vad = new VoiceActivityDetector({
      minSpeechDurationMs: 220,
      silenceTurnTimeoutMs: 1100,
      noiseSensitivityMargin: 14,
      baseSpeechThreshold: 22,
      interruptionThreshold: 48,
    });

    vad.onStateChange = (state) => {
      setVoiceState(state);
    };

    vad.onVolumeUpdate = (stats) => {
      drawCanvasVisualization(stats.frequencyData, stats.volume);
    };

    vad.onTurnComplete = () => {
      // Auto-commit speech turn when silence is sustained after valid speech
      const speech = interimTranscriptRef.current.trim();
      if (speech && isMeaningfulSpeech(speech)) {
        if (recognitionRef.current) {
          try {
            recognitionRef.current.stop();
          } catch {}
        }
        processVoiceTurnRef.current?.(speech);
      } else {
        // Discard non-speech noise and resume listening
        interimTranscriptRef.current = "";
        vad.resetToListening();
      }
    };

    vad.onInterruptionTriggered = () => {
      const speech = interimTranscriptRef.current.trim();
      if (speech && isMeaningfulSpeech(speech) && speech.length >= 3) {
        triggerInterruption();
      }
    };

    const ready = await vad.initializeStream();
    if (!ready) {
      setRecognitionError(
        "Microphone access with studio noise suppression was denied or unavailable."
      );
      return false;
    }

    vadRef.current = vad;
    return true;
  };

  const drawCanvasVisualization = (dataArray: Uint8Array, volume: number) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const bufferLength = dataArray.length;
    const barWidth = (canvas.width / bufferLength) * 1.8;
    let x = 0;

    let barColor = "#38BDF8"; // Sky blue (listening)
    if (voiceStateRef.current === "speech_detected") barColor = "#10B981"; // Emerald green (speech detected)
    if (voiceStateRef.current === "processing") barColor = "#F59E0B"; // Amber (processing)
    if (voiceStateRef.current === "speaking") barColor = "#E11D48"; // Crimson (Sensei speaking)
    if (voiceStateRef.current === "interrupted") barColor = "#EAB308"; // Gold (interrupted)
    if (voiceStateRef.current === "error") barColor = "#EF4444"; // Red (error)

    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 255;
      const barHeight = Math.max(4, v * canvas.height * 0.9);
      ctx.fillStyle = barColor;
      ctx.beginPath();
      ctx.roundRect(x, (canvas.height - barHeight) / 2, barWidth - 2, barHeight, 4);
      ctx.fill();
      x += barWidth;
    }
  };

  // --------------------------------------------------------------------------
  // Natural Interruption Handler (Barge-In)
  // --------------------------------------------------------------------------
  const triggerInterruption = useCallback(() => {
    if (speechWatchdogRef.current) {
      clearTimeout(speechWatchdogRef.current);
      speechWatchdogRef.current = null;
    }
    if (speechKeepAliveIntervalRef.current) {
      clearInterval(speechKeepAliveIntervalRef.current);
      speechKeepAliveIntervalRef.current = null;
    }
    activeUtteranceRef.current = null;
    if (typeof window !== "undefined") {
      (window as any).__senseiActiveUtterance = null;
    }

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    vadRef.current?.setAIPlaybackState(false);
    isProcessingTurnRef.current = false;
    setVoiceState("interrupted");
    vadRef.current?.setState("interrupted");
    setLiveSenseiTranscript("Sensei: (Interrupted) Listening to you...");

    // Smoothly resume listening to the student
    setTimeout(() => {
      if (studioMode === "voice") {
        setVoiceState("listening");
        vadRef.current?.resetToListening();
        startSpeechRecognition();
      }
    }, 250);
  }, [studioMode]);

  // --------------------------------------------------------------------------
  // Voice Output (Speech Synthesis) Engine with Watchdog & GC Protection
  // --------------------------------------------------------------------------
  const speakSenseiResponse = useCallback(
    (text: string, onFinish?: () => void) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) {
        isProcessingTurnRef.current = false;
        if (onFinish) onFinish();
        return;
      }

      // Clear any prior speech & watchdog
      window.speechSynthesis.cancel();
      if (speechWatchdogRef.current) {
        clearTimeout(speechWatchdogRef.current);
        speechWatchdogRef.current = null;
      }
      if (speechKeepAliveIntervalRef.current) {
        clearInterval(speechKeepAliveIntervalRef.current);
        speechKeepAliveIntervalRef.current = null;
      }

      // Clean and guard text length for speech
      const cleaned = cleanMarkdownForSpeech(text).slice(0, 500);
      if (!cleaned || settings.voiceOutputLanguage === "none") {
        isProcessingTurnRef.current = false;
        if (voiceStateRef.current === "speaking" || voiceStateRef.current === "processing") {
          setVoiceState("listening");
          vadRef.current?.resetToListening();
        }
        if (onFinish) onFinish();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(cleaned);
      activeUtteranceRef.current = utterance;
      if (typeof window !== "undefined") {
        (window as any).__senseiActiveUtterance = utterance; // Prevent browser GC collection mid-speech
      }
      utterance.rate = speechRate;

      // Determine speech synthesis language from multilingual settings
      let targetVoiceLangCode = settings.voiceOutputLanguage;
      if (
        !targetVoiceLangCode ||
        targetVoiceLangCode === "follow_response" ||
        targetVoiceLangCode === "follow_explanation"
      ) {
        targetVoiceLangCode = settings.responseLanguage || settings.explanationLanguage || "en";
      } else if (targetVoiceLangCode === "follow_conversation") {
        targetVoiceLangCode =
          settings.conversationLanguage === "auto"
            ? settings.responseLanguage || settings.explanationLanguage || "en"
            : settings.conversationLanguage;
      }

      const langInfo = getLanguageByCode(targetVoiceLangCode);
      const targetSpeechCode = langInfo?.speechCode || "en-US";
      utterance.lang = targetSpeechCode;

      const voices = window.speechSynthesis.getVoices();
      let matchedVoice: SpeechSynthesisVoice | undefined;

      // 1. If user explicitly selected a voice by name, use it
      if (settings.voiceName && settings.voiceName !== "default") {
        matchedVoice = voices.find((v) => v.name === settings.voiceName);
      }

      // 2. Otherwise match by targetSpeechCode / targetVoiceLangCode
      if (!matchedVoice) {
        matchedVoice = voices.find(
          (v) =>
            v.lang === targetSpeechCode ||
            v.lang.toLowerCase() === targetSpeechCode.toLowerCase() ||
            v.lang.startsWith(targetVoiceLangCode) ||
            (langInfo?.alternateSpeechCodes && langInfo.alternateSpeechCodes.includes(v.lang))
        );
      }
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      let finalized = false;
      const finalizeSpeech = () => {
        if (finalized) return;
        finalized = true;

        if (speechWatchdogRef.current) {
          clearTimeout(speechWatchdogRef.current);
          speechWatchdogRef.current = null;
        }
        if (speechKeepAliveIntervalRef.current) {
          clearInterval(speechKeepAliveIntervalRef.current);
          speechKeepAliveIntervalRef.current = null;
        }

        activeUtteranceRef.current = null;
        if (typeof window !== "undefined") {
          (window as any).__senseiActiveUtterance = null;
        }
        vadRef.current?.setAIPlaybackState(false);
        isProcessingTurnRef.current = false;

        if (studioMode === "voice") {
          setVoiceState("listening");
          vadRef.current?.resetToListening();
          startSpeechRecognition();
        } else {
          setVoiceState("idle");
        }

        if (onFinish) onFinish();
      };

      utterance.onstart = () => {
        setVoiceState("speaking");
        vadRef.current?.setAIPlaybackState(true);
        setLiveSenseiTranscript(text);

        // Keepalive interval for Chrome to prevent silent speech engine stall
        speechKeepAliveIntervalRef.current = setInterval(() => {
          if (typeof window !== "undefined" && window.speechSynthesis.speaking && window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
          }
        }, 350);
      };

      utterance.onend = () => {
        finalizeSpeech();
      };

      utterance.onerror = () => {
        finalizeSpeech();
      };

      // Active watchdog: guarantees that speech will never stay stuck in SPEAKING state
      const estimatedDurationMs = Math.max(3500, Math.ceil(cleaned.length * 85));
      speechWatchdogRef.current = setTimeout(() => {
        finalizeSpeech();
      }, estimatedDurationMs + 3000);

      window.speechSynthesis.speak(utterance);
    },
    [speechRate, settings, studioMode]
  );

  // --------------------------------------------------------------------------
  // Voice Input (Speech Recognition) Engine
  // --------------------------------------------------------------------------
  const startSpeechRecognition = useCallback(() => {
    const SpeechRec =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRec) {
      setRecognitionError(
        "Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari."
      );
      setVoiceState("error");
      return;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
    }

    try {
      const recognition = new SpeechRec();
      const inputLangCode =
        settings.inputLanguage === "auto"
          ? (activeLanguage?.speechCode || speechLang)
          : (getLanguageByCode(settings.inputLanguage)?.speechCode || speechLang);
      recognition.lang = inputLangCode;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setVoiceState("listening");
        vadRef.current?.setState("listening");
      };

      recognition.onresult = (event: any) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }

        const trimmed = transcript.trim();
        interimTranscriptRef.current = trimmed;
        setLiveUserTranscript(trimmed);

        // Meaningful Interruption: Only interrupt Sensei if student actually speaks meaningful words (>= 3 chars)
        if (voiceStateRef.current === "speaking" && isMeaningfulSpeech(trimmed) && trimmed.length >= 3) {
          triggerInterruption();
        }

        // When speech turn is finalized by native speech recognizer
        if (event.results[0]?.isFinal && trimmed) {
          if (isMeaningfulSpeech(trimmed)) {
            vadRef.current?.handleSpeechRecognitionFinal();
            try {
              recognition.stop();
            } catch {}
            processVoiceTurnRef.current?.(trimmed);
          } else {
            // Discard noise hallucination (such as single period or click)
            interimTranscriptRef.current = "";
            setLiveUserTranscript("");
            vadRef.current?.resetToListening();
          }
        }
      };

      recognition.onerror = (event: any) => {
        if (event.error === "no-speech") {
          // Restart listening seamlessly if still in live voice mode without getting stuck
          if (studioMode === "voice" && voiceStateRef.current === "listening" && !isMutedRef.current) {
            setTimeout(() => {
              if (voiceStateRef.current === "listening") startSpeechRecognition();
            }, 300);
          }
        } else if (event.error === "not-allowed") {
          setRecognitionError("Microphone permission was denied.");
          setVoiceState("error");
        }
      };

      recognition.onend = () => {
        recognitionRef.current = null;
        if (voiceStateRef.current === "listening" && studioMode === "voice" && !isMutedRef.current) {
          setTimeout(() => {
            if (voiceStateRef.current === "listening") startSpeechRecognition();
          }, 300);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      // fallback
    }
  }, [speechLang, studioMode, triggerInterruption, settings, activeLanguage]);

  // --------------------------------------------------------------------------
  // Welcome Greeting Helper (Bilingual Spoken Greeting)
  // --------------------------------------------------------------------------
  const getWelcomeGreeting = useCallback((code: string) => {
    switch (code) {
      case "ta":
        return "வணக்கம்! நான் உங்கள் ஜப்பானிய AI ஆசிரியர். இன்று என்ன பயிற்சி செய்யலாம்?";
      case "ja":
        return "こんにちは！日本語節のAI先生です。今日はどんな日本語について話しましょうか？";
      case "fr":
        return "Bonjour ! Je suis votre Sensei de japonais. Quel point souhaitez-vous pratiquer aujourd'hui ?";
      case "es":
        return "¡Hola! Soy tu Sensei de japonés. ¿Qué te gustaría practicar hoy?";
      case "de":
        return "Guten Tag! Ich bin Ihr Japanisch-Sensei. Was möchten Sie heute üben?";
      case "hi":
        return "नमस्ते! मैं आपका जापानी शिक्षक हूँ। आज आप क्या सीखना चाहेंगे?";
      case "fil":
        return "Kamusta! Ako ang iyong AI Sensei sa Nihongo. Anong aralin ang gusto mong sanayin ngayon?";
      case "ru":
        return "Здравствуйте! Я ваш преподаватель японского языка. Что вы хотите разобрать сегодня?";
      case "ar":
        return "مرحباً! أنا معلمك للغة اليابانية. ما الذي تود ممارسته اليوم؟";
      default:
        return "Hello! I am Nihongo AI Sensei. What Japanese concept or phrase would you like to practice today?";
    }
  }, []);

  // --------------------------------------------------------------------------
  // Conversational Spoken Turn Processor with Noise Filtering & Stale-Closure Guard
  // --------------------------------------------------------------------------
  const processVoiceTurn = async (spokenText: string) => {
    if (!spokenText.trim() || !isMeaningfulSpeech(spokenText)) {
      vadRef.current?.resetToListening();
      setVoiceState("listening");
      return;
    }

    if (isProcessingTurnRef.current) {
      return;
    }
    isProcessingTurnRef.current = true;

    setVoiceState("processing");
    vadRef.current?.setState("processing");
    interimTranscriptRef.current = "";
    setLiveUserTranscript(spokenText);

    counterRef.current += 1;
    const userMsg: ChatMessage = {
      id: `u-${counterRef.current}`,
      sender: "user",
      text: spokenText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const profile = getStudentProfile();
      const currentHistory = messagesRef.current;
      const response = await fetch("/api/sensei", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: spokenText,
          messages: [...currentHistory, userMsg].slice(-10).map((m) => ({
            role: m.sender === "user" ? "user" : "model",
            content: m.text,
          })),
          mode: "voice_conversation",
          inputLanguage: settings.inputLanguage,
          responseLanguage: settings.responseLanguage || settings.explanationLanguage,
          explanationLanguage: settings.explanationLanguage,
          conversationLanguage: settings.conversationLanguage,
          voiceOutputLanguage: settings.voiceOutputLanguage,
          context: {
            currentRoute: "/portal/sensei",
            pageTitle: "AI Sensei Live Voice Studio",
            userProfile: {
              targetLevel: profile.targetLevel || "N5",
              nativeLanguage: profile.nativeLanguage || "en",
              streak: profile.streak || 1,
            },
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.reply) {
          // If Gemini recognized an explicit language switch in speech ("Explain in English", etc.), update client settings
          if (data.isExplicit && data.explanationLanguage) {
            updateSettings({
              responseLanguage: data.explanationLanguage,
              explanationLanguage: data.explanationLanguage,
            });
          }

          counterRef.current += 1;
          const senseiMsgId = `s-${counterRef.current}`;
          const senseiMsg: ChatMessage = {
            id: senseiMsgId,
            sender: "sensei",
            text: data.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            source: data.source || "gemini",
          };
          setMessages((prev) => [...prev, senseiMsg]);

          // Sensei speaks reply out loud, then resumes listening seamlessly!
          speakSenseiResponse(data.reply, () => {
            if (studioMode === "voice" && !isMutedRef.current) {
              setVoiceState("listening");
              vadRef.current?.resetToListening();
              startSpeechRecognition();
            }
          });
          return;
        }
      }
    } catch {
      // ignore
    }

    // Offline Voice Fallback
    const fallbackSpokenReply = getWelcomeGreeting(settings.responseLanguage || settings.explanationLanguage);
    counterRef.current += 1;
    const senseiMsg: ChatMessage = {
      id: `s-${counterRef.current}`,
      sender: "sensei",
      text: fallbackSpokenReply,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      source: "fallback",
    };
    setMessages((prev) => [...prev, senseiMsg]);
    speakSenseiResponse(fallbackSpokenReply, () => {
      if (studioMode === "voice" && !isMutedRef.current) {
        setVoiceState("listening");
        vadRef.current?.resetToListening();
        startSpeechRecognition();
      }
    });
  };

  processVoiceTurnRef.current = processVoiceTurn;

  // --------------------------------------------------------------------------
  // Live Voice Conversation Mode Lifecyle
  // --------------------------------------------------------------------------
  const startLiveVoiceConversation = async () => {
    setRecognitionError(null);
    setStudioMode("voice");
    setVoiceState("processing");

    const micReady = await setupAudioAnalyser();
    if (!micReady) {
      setVoiceState("error");
      return;
    }

    // Step 2: Sensei initiates natural spoken greeting tailored to configured explanation language
    const welcomeGreeting = getWelcomeGreeting(settings.explanationLanguage);
    speakSenseiResponse(welcomeGreeting, () => {
      // Step 3: Automatically listen to student's response!
      setVoiceState("listening");
      vadRef.current?.resetToListening();
      startSpeechRecognition();
    });
  };

  const endLiveVoiceConversation = () => {
    stopAllAudio();
    setVoiceState("idle");
    setStudioMode("text");
  };

  const forceResetVoice = () => {
    stopAllAudio();
    setRecognitionError(null);
    interimTranscriptRef.current = "";
    setLiveUserTranscript("");
    setLiveSenseiTranscript("");
    setVoiceState("listening");
    if (vadRef.current) {
      vadRef.current.resetToListening();
    }
    setTimeout(() => {
      setupAudioAnalyser().then(() => {
        startSpeechRecognition();
      });
    }, 200);
  };

  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    vadRef.current?.setMute(nextMute);
    if (nextMute) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
    } else {
      if (voiceState === "listening" || voiceState === "speech_detected") {
        startSpeechRecognition();
      }
    }
  };

  // --------------------------------------------------------------------------
  // Text Chat Mode Handlers
  // --------------------------------------------------------------------------
  const handleSendText = async (userText: string) => {
    const query = userText.trim();
    if (!query) return;

    counterRef.current += 1;
    const currentId = counterRef.current;
    const userMsg: ChatMessage = {
      id: `u-${currentId}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const profile = getStudentProfile();
      const currentHistory = messagesRef.current;
      const response = await fetch("/api/sensei", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: query,
          messages: [...currentHistory, userMsg].slice(-10).map((m) => ({
            role: m.sender === "user" ? "user" : "model",
            content: m.text,
          })),
          mode: "text",
          inputLanguage: settings.inputLanguage,
          responseLanguage: settings.responseLanguage || settings.explanationLanguage,
          explanationLanguage: settings.explanationLanguage,
          conversationLanguage: settings.conversationLanguage,
          voiceOutputLanguage: settings.voiceOutputLanguage,
          context: {
            currentRoute: "/portal/sensei",
            pageTitle: "AI Sensei Chat",
            userProfile: {
              targetLevel: profile.targetLevel || "N5",
              nativeLanguage: profile.nativeLanguage || "en",
              streak: profile.streak || 1,
            },
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.reply) {
          if (data.isExplicit && data.explanationLanguage) {
            updateSettings({
              responseLanguage: data.explanationLanguage,
              explanationLanguage: data.explanationLanguage,
            });
          }

          counterRef.current += 1;
          const senseiMsgId = `s-${counterRef.current}`;
          const senseiMsg: ChatMessage = {
            id: senseiMsgId,
            sender: "sensei",
            text: data.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            source: data.source || "gemini",
          };
          setMessages((prev) => [...prev, senseiMsg]);
          setIsTyping(false);
          return;
        }
      }
    } catch {
      // fallback
    }

    // Local offline knowledge fallback
    setTimeout(() => {
      let reply = "";
      const lower = query.toLowerCase();

      if (lower.includes("fiction") || lower.includes("what is fiction")) {
        reply = "Fiction refers to literature, stories, or creative narratives derived from imagination rather than strict historical or factual events. Examples include novels, short stories, and fables.";
      } else if (lower.includes("wa") && lower.includes("ga")) {
        reply = KNOWLEDGE_RESPONSES.wa_ga;
      } else if (lower.includes("te") || lower.includes("te-form") || lower.includes("て")) {
        reply = KNOWLEDGE_RESPONSES.te_form;
      } else if (lower.includes("restaurant") || lower.includes("dining") || lower.includes("food")) {
        reply = KNOWLEDGE_RESPONSES.restaurant;
      } else {
        reply = `こんにちは！ (Konnichiwa!) 🌸

That is an insightful question about Japanese language learning.

In Japanese, always keep the fundamental sentence structure in mind:
• **Subject / Topic**: Marked by は (wa) or が (ga)
• **Object**: Marked by を (o/wo)
• **Verb**: Always placed at the end of the clause (SOV structure)

**Example Sentence**:
私は日本語を勉強しています。
*(Watashi wa nihongo o benkyou shite imasu.)*
"I am studying Japanese."

Would you like to explore specific example sentences, practice verb conjugations, or dive into JLPT questions for your level?`;
      }

      counterRef.current += 1;
      const senseiMsgId = `s-${counterRef.current}`;
      const senseiMsg: ChatMessage = {
        id: senseiMsgId,
        sender: "sensei",
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        source: "fallback",
      };
      setMessages((prev) => [...prev, senseiMsg]);
      setIsTyping(false);
    }, 600);
  };

  const handleClearChat = () => {
    stopAllAudio();
    counterRef.current += 1;
    setMessages([
      {
        id: `initial-reset-${counterRef.current}`,
        sender: "sensei",
        text: "チャットがリセットされました。 (Chat has been reset.) How can I assist you with your Japanese study goals today?",
        timestamp: "Just now",
        source: "gemini",
      },
    ]);
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const speakSingleMessage = (msgId: string, text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (speakingMsgId === msgId) {
      if (isPaused) {
        window.speechSynthesis.resume();
        setIsPaused(false);
      } else {
        window.speechSynthesis.pause();
        setIsPaused(true);
      }
      return;
    }
    window.speechSynthesis.cancel();
    const cleaned = cleanMarkdownForSpeech(text);
    const utterance = new SpeechSynthesisUtterance(cleaned);
    const targetVoiceLangCode =
      settings.voiceOutputLanguage === "follow_explanation"
        ? settings.explanationLanguage
        : settings.voiceOutputLanguage === "follow_conversation"
        ? (settings.conversationLanguage === "auto" ? settings.explanationLanguage : settings.conversationLanguage)
        : settings.voiceOutputLanguage;
    const langInfo = getLanguageByCode(targetVoiceLangCode);
    utterance.lang = langInfo?.speechCode || "en-US";
    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = voices.find(
      (v) =>
        v.lang === utterance.lang ||
        v.lang.startsWith(targetVoiceLangCode) ||
        (langInfo?.alternateSpeechCodes && langInfo.alternateSpeechCodes.includes(v.lang))
    );
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }
    utterance.rate = speechRate;
    utterance.onstart = () => {
      setSpeakingMsgId(msgId);
      setIsPaused(false);
    };
    utterance.onend = () => {
      setSpeakingMsgId(null);
      setIsPaused(false);
    };
    utterance.onerror = () => {
      setSpeakingMsgId(null);
      setIsPaused(false);
    };
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header & Mode Navigation Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#C83C50]/20 text-[#C83C50] text-xs font-semibold mb-2 border border-[#C83C50]/30">
            <Bot className="w-3.5 h-3.5" />
            <span>AI Sensei · Dedicated Japanese Teacher</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#FFFFFF] tracking-tight">
            Nihongo Setu AI Sensei
          </h1>
          <p className="text-xs text-[#E8E0D5]/70 mt-1">
            Real-time human-like voice conversations, natural bilingual coaching, and JLPT N5 mastery.
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center p-1 rounded-2xl bg-[#0B1323] border border-[#E8E0D5]/20 shrink-0 shadow-lg">
          <button
            onClick={() => {
              if (studioMode === "voice") endLiveVoiceConversation();
              setStudioMode("text");
            }}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              studioMode === "text"
                ? "bg-[#C83C50] text-[#FFFFFF] shadow-md shadow-[#C83C50]/30"
                : "text-[#E8E0D5]/70 hover:text-[#FFFFFF]"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Text Studio</span>
          </button>

          <button
            onClick={() => {
              if (studioMode === "text") startLiveVoiceConversation();
            }}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              studioMode === "voice"
                ? "bg-gradient-to-r from-[#C83C50] to-rose-600 text-[#FFFFFF] shadow-lg shadow-[#C83C50]/40 animate-pulse"
                : "text-[#E8E0D5]/70 hover:text-[#FFFFFF]"
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Live Voice Studio</span>
          </button>
        </div>
      </div>

      {/* Universal Multilingual Configuration Hub */}
      <div className="bg-[#0B1323] border border-[#E8E0D5]/20 rounded-2xl p-4 sm:p-5 shadow-xl space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E8E0D5]/10 pb-3">
          <div className="flex items-center space-x-2">
            <Languages className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Multilingual Intelligence &amp; Language Independence
            </span>
          </div>
          <div className="text-[11px] text-[#E8E0D5]/70 flex items-center gap-1.5">
            <span>Explanation Language:</span>
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
              {activeLanguage.name} ({activeLanguage.nativeName})
            </span>
          </div>
        </div>

        {/* Quick Language Switch Badges */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-[#E8E0D5]/60">
            <span>Click to switch Sensei&apos;s explanation language instantly:</span>
            <span className="text-[10px] text-cyan-400/80">Independent of what you speak or type</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-xs">
            {[
              { code: "en", label: "English", flag: "🇬🇧" },
              { code: "ta", label: "தமிழ்", flag: "🇮🇳" },
              { code: "ja", label: "日本語", flag: "🇯🇵" },
              { code: "fr", label: "Français", flag: "🇫🇷" },
              { code: "es", label: "Español", flag: "🇪🇸" },
              { code: "hi", label: "हिन्दी", flag: "🇮🇳" },
              { code: "de", label: "Deutsch", flag: "🇩🇪" },
              { code: "fil", label: "Filipino", flag: "🇵🇭" },
              { code: "ru", label: "Русский", flag: "🇷🇺" },
              { code: "ar", label: "العربية", flag: "🇸🇦" },
            ].map((pill) => (
              <button
                key={pill.code}
                onClick={() => updateSettings({ explanationLanguage: pill.code })}
                className={`px-3 py-1.5 rounded-xl font-semibold flex items-center space-x-1.5 whitespace-nowrap transition-all ${
                  settings.explanationLanguage === pill.code
                    ? "bg-[#C83C50] text-white shadow-md shadow-[#C83C50]/30 scale-105 ring-2 ring-white/20"
                    : "bg-[#101C35] text-[#E8E0D5]/75 hover:text-white hover:bg-[#152342] border border-[#E8E0D5]/15"
                }`}
              >
                <span>{pill.flag}</span>
                <span>{pill.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Independent Language Settings Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
          <div>
            <label className="block text-[10px] font-bold uppercase text-[#E8E0D5]/60 mb-1">
              1. Input Language (What you speak/type)
            </label>
            <select
              value={settings.inputLanguage}
              onChange={(e) => updateSettings({ inputLanguage: e.target.value })}
              className="w-full bg-[#101C35] border border-[#E8E0D5]/20 text-white rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-[#C83C50]"
            >
              <option value="auto">Auto-detect (Universal)</option>
              {UNIVERSAL_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.name} ({l.nativeName})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-[#E8E0D5]/60 mb-1">
              2. Explanation Language (How Sensei teaches)
            </label>
            <select
              value={settings.explanationLanguage}
              onChange={(e) => updateSettings({ explanationLanguage: e.target.value })}
              className="w-full bg-[#101C35] border border-[#E8E0D5]/20 text-white rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-[#C83C50]"
            >
              {UNIVERSAL_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.name} ({l.nativeName})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-[#E8E0D5]/60 mb-1">
              3. Voice Output Language (Spoken Voice)
            </label>
            <select
              value={settings.voiceOutputLanguage}
              onChange={(e) => updateSettings({ voiceOutputLanguage: e.target.value })}
              className="w-full bg-[#101C35] border border-[#E8E0D5]/20 text-white rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-[#C83C50]"
            >
              <option value="follow_explanation">Follow Explanation Language</option>
              <option value="follow_conversation">Follow Conversation Practice</option>
              <option value="none">Mute Spoken Audio</option>
              {UNIVERSAL_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.name} ({l.nativeName})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Recognition Error Notice */}
      {recognitionError && (
        <div className="px-4 py-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between shadow-lg">
          <div className="flex items-center space-x-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{recognitionError}</span>
          </div>
          <button
            onClick={() => setRecognitionError(null)}
            className="text-xs underline hover:text-[#FFFFFF] ml-2 shrink-0 font-medium"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 1. DEDICATED LIVE VOICE CONVERSATION STUDIO                           */}
      {/* ==================================================================== */}
      {studioMode === "voice" && (
        <div className="bg-[#0B1323] border border-[#E8E0D5]/25 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
          {/* Ambient Background Aura */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#C83C50]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Status & Controls Bar */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-[#E8E0D5]/15 pb-4">
            <div className="flex items-center space-x-2">
              <span
                className={`w-3 h-3 rounded-full ${
                  voiceState === "listening"
                    ? "bg-sky-400 animate-ping"
                    : voiceState === "speech_detected"
                    ? "bg-emerald-400 animate-pulse"
                    : voiceState === "processing"
                    ? "bg-amber-400 animate-bounce"
                    : voiceState === "speaking"
                    ? "bg-rose-500 animate-pulse"
                    : voiceState === "interrupted"
                    ? "bg-amber-300 animate-ping"
                    : voiceState === "no_speech_detected"
                    ? "bg-slate-400"
                    : voiceState === "error"
                    ? "bg-red-500"
                    : "bg-gray-400"
                }`}
              />
              <span className="text-xs font-bold tracking-wide uppercase text-[#FFFFFF]">
                {voiceState === "listening" && "Sensei is Listening (Ready for your speech)"}
                {voiceState === "speech_detected" && "Speech Detected (Listening...)"}
                {voiceState === "processing" && "Processing Turn (Sensei is thinking...)"}
                {voiceState === "speaking" && "Sensei is Speaking..."}
                {voiceState === "interrupted" && "Interrupted — Listening to you"}
                {voiceState === "no_speech_detected" && "No Speech Detected"}
                {voiceState === "idle" && "Voice Studio Connected"}
                {voiceState === "error" && "Voice Studio Error"}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Mic Input Language Selector */}
              <div className="flex items-center space-x-1 bg-[#101C35] px-2.5 py-1.5 rounded-xl border border-[#E8E0D5]/20 text-xs" title="Microphone Input Language">
                <span className="text-[#E8E0D5]/60 text-[10px] font-bold uppercase">Mic:</span>
                <select
                  value={settings.inputLanguage}
                  onChange={(e) => updateSettings({ inputLanguage: e.target.value })}
                  className="bg-transparent text-cyan-300 font-semibold focus:outline-none cursor-pointer text-xs"
                >
                  <option value="auto" className="bg-[#101C35] text-white">Auto (Universal)</option>
                  {UNIVERSAL_LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code} className="bg-[#101C35] text-white">
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* AI Response Language Selector */}
              <div className="flex items-center space-x-1 bg-[#101C35] px-2.5 py-1.5 rounded-xl border border-[#E8E0D5]/20 text-xs" title="AI Sensei Response Language">
                <span className="text-[#E8E0D5]/60 text-[10px] font-bold uppercase">Respond in:</span>
                <select
                  value={settings.responseLanguage || settings.explanationLanguage}
                  onChange={(e) => updateSettings({ responseLanguage: e.target.value, explanationLanguage: e.target.value })}
                  className="bg-transparent text-emerald-300 font-semibold focus:outline-none cursor-pointer text-xs"
                >
                  {UNIVERSAL_LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code} className="bg-[#101C35] text-white">
                      {l.name} ({l.nativeName})
                    </option>
                  ))}
                </select>
              </div>

              {/* Spoken Voice Language Selector */}
              <div className="flex items-center space-x-1 bg-[#101C35] px-2.5 py-1.5 rounded-xl border border-[#E8E0D5]/20 text-xs" title="Voice Audio Speech">
                <span className="text-[#E8E0D5]/60 text-[10px] font-bold uppercase">Voice:</span>
                <select
                  value={settings.voiceOutputLanguage}
                  onChange={(e) => updateSettings({ voiceOutputLanguage: e.target.value })}
                  className="bg-transparent text-amber-300 font-semibold focus:outline-none cursor-pointer text-xs"
                >
                  <option value="follow_response" className="bg-[#101C35] text-white">Follow Response</option>
                  <option value="follow_explanation" className="bg-[#101C35] text-white">Follow Explanation</option>
                  <option value="none" className="bg-[#101C35] text-white">Mute Spoken Audio</option>
                  {UNIVERSAL_LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code} className="bg-[#101C35] text-white">
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Specific Voice Engine / Speaker Selector */}
              {availableVoices.length > 0 && (
                <div className="flex items-center space-x-1 bg-[#101C35] px-2.5 py-1.5 rounded-xl border border-[#E8E0D5]/20 text-xs hidden lg:flex" title="Specific Voice Speaker">
                  <span className="text-[#E8E0D5]/60 text-[10px] font-bold uppercase">Speaker:</span>
                  <select
                    value={settings.voiceName || "default"}
                    onChange={(e) => updateSettings({ voiceName: e.target.value })}
                    className="bg-transparent text-purple-300 font-semibold focus:outline-none cursor-pointer text-xs max-w-[130px] truncate"
                  >
                    <option value="default" className="bg-[#101C35] text-white">Default Natural</option>
                    {availableVoices.map((v) => (
                      <option key={v.name} value={v.name} className="bg-[#101C35] text-white">
                        {v.name} ({v.lang})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Speed Selector */}
              <select
                value={speechRate}
                onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                className="bg-[#101C35] border border-[#E8E0D5]/20 text-[#FFFFFF] text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-[#C83C50]"
                title="Speaking Speed"
              >
                <option value={0.8}>0.8x</option>
                <option value={0.92}>0.9x</option>
                <option value={1.1}>1.1x</option>
              </select>
            </div>
          </div>

          {/* Central Interactive Voice Orb & Reactive Audio Visualizer */}
          <div className="relative z-10 flex flex-col items-center justify-center py-6 space-y-4">
            <div className="relative flex items-center justify-center">
              {/* Concentric Reactive Glow Rings */}
              <div
                className={`absolute w-44 h-44 rounded-full transition-all duration-700 pointer-events-none ${
                  voiceState === "speech_detected"
                    ? "bg-emerald-500/25 scale-130 animate-pulse"
                    : voiceState === "listening"
                    ? "bg-sky-500/20 scale-125 animate-pulse"
                    : voiceState === "speaking"
                    ? "bg-[#C83C50]/25 scale-135 animate-ping"
                    : voiceState === "processing"
                    ? "bg-amber-500/25 scale-110 animate-pulse"
                    : voiceState === "interrupted"
                    ? "bg-amber-400/25 scale-120 animate-ping"
                    : "bg-[#E8E0D5]/5 scale-100"
                }`}
              />

              <div
                className={`relative w-32 h-32 rounded-full flex flex-col items-center justify-center shadow-2xl transition-all duration-500 border-2 ${
                  voiceState === "speech_detected"
                    ? "bg-gradient-to-tr from-[#0F2042] to-emerald-700 border-emerald-400 text-emerald-200 shadow-emerald-500/30 scale-105"
                    : voiceState === "listening"
                    ? "bg-gradient-to-tr from-[#0F2042] to-sky-700 border-sky-400 text-sky-200 shadow-sky-500/30 scale-105"
                    : voiceState === "speaking"
                    ? "bg-gradient-to-tr from-[#C83C50] to-rose-700 border-rose-300 text-[#FFFFFF] shadow-rose-500/40 scale-110"
                    : voiceState === "processing"
                    ? "bg-gradient-to-tr from-amber-700 to-amber-900 border-amber-400 text-amber-200 shadow-amber-500/30"
                    : voiceState === "interrupted"
                    ? "bg-gradient-to-tr from-amber-600 to-rose-700 border-amber-300 text-amber-100 shadow-amber-500/30"
                    : "bg-[#101C35] border-[#E8E0D5]/20 text-[#FFFFFF]"
                }`}
              >
                <span className="font-japanese font-black text-3xl select-none">
                  {voiceState === "speaking"
                    ? "先生"
                    : voiceState === "speech_detected" || voiceState === "listening"
                    ? "聞"
                    : voiceState === "processing"
                    ? "考"
                    : "節"}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest mt-1 opacity-80">
                  {voiceState.replace(/_/g, " ")}
                </span>
              </div>
            </div>

            {/* Live Frequency Equalizer Canvas */}
            <div className="w-full max-w-sm h-12 flex items-center justify-center">
              <canvas
                ref={canvasRef}
                width={360}
                height={48}
                className="w-full h-full rounded-xl bg-[#101C35]/50 border border-[#E8E0D5]/10"
              />
            </div>

            <p className="text-xs text-[#E8E0D5]/80 text-center max-w-md">
              {voiceState === "listening" && "Speak naturally into your mic. Sensei is listening..."}
              {voiceState === "speech_detected" && "Voice activity detected! Speak clearly..."}
              {voiceState === "processing" && "Sensei is processing your Japanese inquiry..."}
              {voiceState === "speaking" && "Sensei is talking. Speak loudly or click Interrupt to jump in."}
              {voiceState === "interrupted" && "Interruption detected! Listening to your new thought..."}
              {voiceState === "no_speech_detected" && "No speech heard. Waiting for you to speak..."}
              {voiceState === "idle" && "Ready to talk with Sensei."}
              {voiceState === "error" && "Microphone or connection issue. Click 'Reset Audio' below."}
            </p>
          </div>

          {/* Live Bilingual Conversation Subtitles / Teleprompter */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Student Transcript */}
            <div className="bg-[#101C35] border border-[#E8E0D5]/15 rounded-2xl p-4 space-y-1.5 shadow-md">
              <div className="flex items-center justify-between text-[11px] font-bold text-sky-400">
                <span className="flex items-center space-x-1.5">
                  <User className="w-3 h-3" />
                  <span>You Spoke:</span>
                </span>
                {liveUserTranscript && <span className="text-[10px] text-[#E8E0D5]/50">Transcribed</span>}
              </div>
              <p className="text-xs text-[#FFFFFF] min-h-[44px] leading-relaxed break-words">
                {liveUserTranscript || (
                  <span className="text-[#E8E0D5]/40 italic">Your spoken Japanese words will stream here...</span>
                )}
              </p>
            </div>

            {/* Sensei Transcript */}
            <div className="bg-[#101C35] border border-[#C83C50]/30 rounded-2xl p-4 space-y-1.5 shadow-md">
              <div className="flex items-center justify-between text-[11px] font-bold text-rose-400">
                <span className="flex items-center space-x-1.5">
                  <Bot className="w-3 h-3" />
                  <span>Sensei Replied:</span>
                </span>
                {liveSenseiTranscript && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                    Gemini 3.5 Live
                  </span>
                )}
              </div>
              <p className="text-xs text-[#FFFFFF] min-h-[44px] leading-relaxed break-words">
                {liveSenseiTranscript || (
                  <span className="text-[#E8E0D5]/40 italic">Sensei&apos;s natural voice response will stream here...</span>
                )}
              </p>
            </div>
          </div>

          {/* Live Studio Action Bar */}
          <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 pt-2">
            {/* Natural Interruption Button */}
            {voiceState === "speaking" && (
              <button
                onClick={triggerInterruption}
                className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-[#101C35] text-xs font-black flex items-center space-x-2 shadow-lg shadow-amber-500/20 transition-all animate-bounce"
                title="Interrupt Sensei"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Interrupt Sensei</span>
              </button>
            )}

            {/* Mute / Unmute Microphone */}
            <button
              onClick={toggleMute}
              className={`px-4 py-2.5 rounded-2xl border text-xs font-bold flex items-center space-x-2 transition-all shadow-md ${
                isMuted
                  ? "bg-red-500/20 border-red-500/40 text-red-400"
                  : "bg-[#101C35] border-[#E8E0D5]/20 text-[#FFFFFF] hover:bg-[#E8E0D5]/10"
              }`}
            >
              {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              <span>{isMuted ? "Unmute Mic" : "Mute Mic"}</span>
            </button>

            {/* Force Reset / Unstick Audio Button */}
            <button
              onClick={forceResetVoice}
              className="px-4 py-2.5 rounded-2xl bg-[#101C35] hover:bg-[#1A2C4E] border border-[#E8E0D5]/20 hover:border-amber-400/50 text-amber-200 text-xs font-bold flex items-center space-x-2 transition-all shadow-md"
              title="Reset microphone & speech recognition if stuck"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>Reset Audio</span>
            </button>

            {/* End Voice Conversation Button */}
            <button
              onClick={endLiveVoiceConversation}
              className="px-5 py-2.5 rounded-2xl bg-[#C83C50] hover:bg-[#B03244] text-[#FFFFFF] text-xs font-black flex items-center space-x-2 shadow-lg shadow-[#C83C50]/30 transition-all"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>End Live Conversation</span>
            </button>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 2. TEXT CHAT STUDIO WITH RICH MARKDOWN & SPEECH CONTROLS             */}
      {/* ==================================================================== */}
      {studioMode === "text" && (
        <div className="space-y-6">
          {/* Japanese Learning Practice Presets Shelf */}
          <div className="bg-[#101C35] border border-[#E8E0D5]/15 rounded-2xl p-4 space-y-2.5 shadow-lg">
            <div className="flex items-center justify-between text-xs font-bold text-[#E8E0D5]/90">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-3.5 h-3.5 text-[#C83C50]" />
                <span>Targeted Practice Modes:</span>
              </div>
              <button
                onClick={startLiveVoiceConversation}
                className="text-[11px] text-[#C83C50] hover:underline font-bold flex items-center space-x-1"
              >
                <span>Switch to Live Voice Studio</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
              {PRACTICE_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleSendText(preset.prompt)}
                  className="p-2.5 rounded-xl bg-[#E8E0D5]/5 hover:bg-[#E8E0D5]/15 border border-[#E8E0D5]/15 text-left transition-all group flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#C83C50]/20 text-[#C83C50] font-semibold font-japanese inline-block mb-1">
                      {preset.badge}
                    </span>
                    <div className="text-xs font-bold text-[#FFFFFF] group-hover:text-[#C83C50] transition-colors line-clamp-1">
                      {preset.title}
                    </div>
                  </div>
                  <p className="text-[10px] text-[#E8E0D5]/60 mt-1 line-clamp-2 leading-tight">
                    {preset.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Prompts */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[11px] text-[#E8E0D5]/50 shrink-0 flex items-center space-x-1 pl-1">
              <MessageSquare className="w-3 h-3 text-[#C83C50]" />
              <span>Quick Questions:</span>
            </span>
            {SUGGESTED_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendText(prompt)}
                className="px-3 py-1 rounded-xl bg-[#E8E0D5]/5 hover:bg-[#E8E0D5]/15 border border-[#E8E0D5]/15 text-[#E8E0D5] text-[11px] whitespace-nowrap transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Chat Thread Container */}
          <div className="bg-[#101C35] border border-[#E8E0D5]/20 rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col h-[540px]">
            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {messages.map((msg) => {
                const isSensei = msg.sender === "sensei";
                const isCurrentlySpeaking = speakingMsgId === msg.id;

                return (
                  <div
                    key={msg.id}
                    className={`flex items-start space-x-3 ${
                      isSensei ? "justify-start" : "justify-end"
                    }`}
                  >
                    {isSensei && (
                      <div className="w-8 h-8 rounded-xl bg-[#C83C50] text-[#FFFFFF] flex items-center justify-center shrink-0 font-bold text-xs shadow-md shadow-[#C83C50]/20">
                        節
                      </div>
                    )}

                    <div
                      className={`max-w-[88%] rounded-2xl p-4 space-y-2 text-xs leading-relaxed shadow-md break-words ${
                        isSensei
                          ? "bg-[#0B1323] text-[#FFFFFF] border border-[#E8E0D5]/15"
                          : "bg-[#C83C50] text-[#FFFFFF] font-medium"
                      }`}
                    >
                      {/* Markdown Renderer for AI Sensei */}
                      {isSensei ? (
                        <div className="prose prose-invert prose-xs max-w-none text-[#E8E0D5] space-y-2">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              h1: ({ children }) => (
                                <h1 className="text-base font-extrabold text-[#FFFFFF] border-b border-[#E8E0D5]/15 pb-1 my-2">
                                  {children}
                                </h1>
                              ),
                              h2: ({ children }) => (
                                <h2 className="text-sm font-bold text-[#FFFFFF] mt-3 mb-1.5 flex items-center space-x-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#C83C50] inline-block" />
                                  <span>{children}</span>
                                </h2>
                              ),
                              h3: ({ children }) => (
                                <h3 className="text-xs font-bold text-[#FFFFFF] mt-2 mb-1 text-[#C83C50]">
                                  {children}
                                </h3>
                              ),
                              p: ({ children }) => (
                                <p className="my-1.5 leading-relaxed text-[#E8E0D5]">
                                  {children}
                                </p>
                              ),
                              strong: ({ children }) => (
                                <strong className="font-bold text-[#FFFFFF]">
                                  {children}
                                </strong>
                              ),
                              em: ({ children }) => (
                                <em className="italic text-[#E8E0D5]/90">
                                  {children}
                                </em>
                              ),
                              ul: ({ children }) => (
                                <ul className="list-disc pl-4 space-y-1 my-1.5 text-[#E8E0D5]">
                                  {children}
                                </ul>
                              ),
                              ol: ({ children }) => (
                                <ol className="list-decimal pl-4 space-y-1 my-1.5 text-[#E8E0D5]">
                                  {children}
                                </ol>
                              ),
                              li: ({ children }) => (
                                <li className="my-0.5 leading-relaxed">{children}</li>
                              ),
                              blockquote: ({ children }) => (
                                <blockquote className="border-l-2 border-[#C83C50] pl-3 py-1 my-2 bg-[#E8E0D5]/5 rounded-r text-[#E8E0D5]/90 italic">
                                  {children}
                                </blockquote>
                              ),
                              code: ({ inline, className, children, ...props }: any) => {
                                if (inline) {
                                  return (
                                    <code
                                      className="px-1.5 py-0.5 rounded bg-[#101C35] text-amber-300 font-mono text-[11px] border border-[#E8E0D5]/20 font-japanese"
                                      {...props}
                                    >
                                      {children}
                                    </code>
                                  );
                                }
                                return (
                                  <pre className="p-3 rounded-xl bg-[#080E1A] border border-[#E8E0D5]/20 font-mono text-xs overflow-x-auto my-2 text-emerald-400">
                                    <code {...props}>{children}</code>
                                  </pre>
                                );
                              },
                              table: ({ children }) => (
                                <div className="overflow-x-auto my-2 border border-[#E8E0D5]/20 rounded-xl">
                                  <table className="w-full border-collapse text-left text-xs">
                                    {children}
                                  </table>
                                </div>
                              ),
                              thead: ({ children }) => (
                                <thead className="bg-[#101C35] border-b border-[#E8E0D5]/20 text-[#FFFFFF]">
                                  {children}
                                </thead>
                              ),
                              tbody: ({ children }) => (
                                <tbody className="divide-y divide-[#E8E0D5]/10">
                                  {children}
                                </tbody>
                              ),
                              tr: ({ children }) => (
                                <tr className="hover:bg-[#E8E0D5]/5">{children}</tr>
                              ),
                              th: ({ children }) => (
                                <th className="px-3 py-2 font-bold text-[#FFFFFF]">
                                  {children}
                                </th>
                              ),
                              td: ({ children }) => (
                                <td className="px-3 py-2 text-[#E8E0D5]">{children}</td>
                              ),
                              hr: () => (
                                <hr className="border-t border-[#E8E0D5]/20 my-3" />
                              ),
                            }}
                          >
                            {msg.text}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <div className="whitespace-pre-line">{msg.text}</div>
                      )}

                      {/* Message Actions */}
                      <div className="flex items-center justify-between pt-1.5 border-t border-[#FFFFFF]/10 text-[10px] opacity-70">
                        <div className="flex items-center space-x-2">
                          <span>{msg.timestamp}</span>
                          {isSensei && msg.source === "gemini" && (
                            <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[9px]">
                              Gemini 3.5
                            </span>
                          )}
                        </div>

                        {isSensei && (
                          <div className="flex items-center space-x-2">
                            {/* Speech Synthesis Play/Pause */}
                            <div className="flex items-center space-x-1 bg-[#101C35] border border-[#E8E0D5]/20 rounded-lg px-1.5 py-0.5">
                              <button
                                onClick={() => speakSingleMessage(msg.id, msg.text)}
                                className="hover:text-[#FFFFFF] transition-colors p-0.5"
                                title={
                                  isCurrentlySpeaking
                                    ? isPaused
                                      ? "Resume speech"
                                      : "Pause speech"
                                    : "Listen aloud"
                                }
                              >
                                {isCurrentlySpeaking ? (
                                  isPaused ? (
                                    <Play className="w-3 h-3 text-emerald-400" />
                                  ) : (
                                    <Pause className="w-3 h-3 text-amber-400 animate-pulse" />
                                  )
                                ) : (
                                  <Volume2 className="w-3 h-3 text-[#C83C50]" />
                                )}
                              </button>

                              {isCurrentlySpeaking && (
                                <button
                                  onClick={() => {
                                    window.speechSynthesis.cancel();
                                    setSpeakingMsgId(null);
                                    setIsPaused(false);
                                  }}
                                  className="hover:text-red-400 p-0.5"
                                  title="Stop speech"
                                >
                                  <Square className="w-2.5 h-2.5 fill-red-400 text-red-400" />
                                </button>
                              )}
                            </div>

                            {/* Copy Text */}
                            <button
                              onClick={() => copyToClipboard(msg.id, msg.text)}
                              className="hover:text-[#FFFFFF] p-1 rounded hover:bg-[#E8E0D5]/10 transition-colors"
                              title="Copy text"
                            >
                              {copiedId === msg.id ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {!isSensei && (
                      <div className="w-8 h-8 rounded-xl bg-[#E8E0D5]/20 text-[#FFFFFF] flex items-center justify-center shrink-0 font-bold text-xs">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-[#C83C50] text-[#FFFFFF] flex items-center justify-center shrink-0 font-bold text-xs">
                    節
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#0B1323] border border-[#E8E0D5]/15 flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-[#C83C50] animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-[#C83C50] animate-bounce delay-100" />
                    <span className="w-2 h-2 rounded-full bg-[#C83C50] animate-bounce delay-200" />
                    <span className="text-[11px] text-[#E8E0D5]/60 pl-1">
                      Sensei is formulating explanation...
                    </span>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Input Form & Speech Controls */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendText(input);
              }}
              className="pt-4 border-t border-[#E8E0D5]/15 flex items-center space-x-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Sensei anything in Japanese, Tamil, Tanglish, or English..."
                className="flex-1 bg-[#0B1323] border border-[#E8E0D5]/25 rounded-2xl px-4 py-3 text-xs text-[#FFFFFF] placeholder-[#E8E0D5]/40 focus:outline-none focus:border-[#C83C50]"
              />

              {/* Quick Microphone Button to dictate into text input */}
              <button
                type="button"
                onClick={() => {
                  startLiveVoiceConversation();
                }}
                className="p-3 rounded-2xl border border-[#E8E0D5]/25 bg-[#0B1323] hover:border-[#C83C50] text-[#E8E0D5] hover:text-[#FFFFFF] transition-all shrink-0"
                title="Open Live Voice Conversation Studio"
              >
                <Mic className="w-4 h-4 text-[#C83C50]" />
              </button>

              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="p-3 rounded-2xl bg-[#C83C50] hover:bg-[#B03244] text-[#FFFFFF] shadow-lg shadow-[#C83C50]/20 disabled:opacity-40 transition-all shrink-0"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
