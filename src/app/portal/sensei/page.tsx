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
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Sparkle,
} from "lucide-react";
import { getStudentProfile, DEFAULT_PROFILE, StudentProfile } from "@/lib/storage/studentState";

interface ChatMessage {
  id: string;
  sender: "user" | "sensei";
  text: string;
  timestamp: string;
  source?: "gemini" | "fallback";
}

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
• 🗣️ **Voice Interaction**: Click the microphone to speak in Japanese, Tamil, or English!
• 🎙️ **Hands-Free Mode**: Toggle **Conversation Mode** above to talk continuously with me.
• 🎌 **JLPT Guidance**: Ask about N5–N1 grammar, Kanji mnemonics, or pronunciation!`,
    timestamp: "10:00 AM",
    source: "gemini",
  },
];

function cleanMarkdownForSpeech(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, "") // remove code blocks
    .replace(/`([^`]+)`/g, "$1") // inline code
    .replace(/#{1,6}\s+/g, "") // headings
    .replace(/\*\*([^*]+)\*\*/g, "$1") // bold
    .replace(/\*([^*]+)\*/g, "$1") // italic
    .replace(/__([^_]+)__/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // links
    .replace(/^[*-]\s+/gm, "") // bullet points
    .replace(/^\d+\.\s+/gm, "") // ordered lists
    .replace(/^>\s+/gm, "") // blockquotes
    .replace(/---/g, "") // horizontal rules
    .replace(/\|/g, " ") // table pipes
    .replace(/\n{2,}/g, "\n")
    .trim();
}

export default function AISenseiPage() {
  const counterRef = useRef(1);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [studentProfile, setStudentProfile] = useState<StudentProfile>(DEFAULT_PROFILE);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Voice Recognition States
  const [isListening, setIsListening] = useState(false);
  const [speechLang, setSpeechLang] = useState("ja-JP");
  const [recognitionError, setRecognitionError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  // Voice Output (Speech Synthesis) States
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Conversation Mode (Hands-Free Loop)
  const [conversationMode, setConversationMode] = useState(false);
  const conversationModeRef = useRef(false);
  conversationModeRef.current = conversationMode;

  useEffect(() => {
    // Hydration-safe profile loading
    setStudentProfile(getStudentProfile());
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Clean up speech recognition & synthesis on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // --------------------------------------------------------------------------
  // Voice Output: Enhanced Speech Synthesis
  // --------------------------------------------------------------------------
  const stopSpeaking = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setSpeakingId(null);
    setIsPaused(false);
  }, []);

  const pauseSpeaking = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause();
        setIsPaused(true);
      }
    }
  }, []);

  const resumeSpeaking = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        setIsPaused(false);
      }
    }
  }, []);

  const speakText = useCallback(
    (msgId: string, text: string) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) {
        setRecognitionError("Speech synthesis is not supported on this device/browser.");
        return;
      }

      // If already speaking this message, toggle pause/resume
      if (speakingId === msgId) {
        if (isPaused) {
          resumeSpeaking();
        } else {
          pauseSpeaking();
        }
        return;
      }

      window.speechSynthesis.cancel();
      const cleaned = cleanMarkdownForSpeech(text);
      if (!cleaned) return;

      const utterance = new SpeechSynthesisUtterance(cleaned);
      utteranceRef.current = utterance;

      // Detect predominant script to pick optimal voice
      const hasJapanese = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/.test(cleaned);
      const hasTamil = /[\u0b80-\u0bff]/.test(cleaned);

      const voices = window.speechSynthesis.getVoices();
      if (hasJapanese) {
        utterance.lang = "ja-JP";
        const jaVoice = voices.find((v) => v.lang.startsWith("ja"));
        if (jaVoice) utterance.voice = jaVoice;
        utterance.rate = 0.9;
      } else if (hasTamil) {
        utterance.lang = "ta-IN";
        const taVoice = voices.find((v) => v.lang.startsWith("ta"));
        if (taVoice) utterance.voice = taVoice;
        utterance.rate = 0.92;
      } else {
        utterance.lang = "en-US";
        const enVoice = voices.find((v) => v.lang.startsWith("en"));
        if (enVoice) utterance.voice = enVoice;
        utterance.rate = 0.95;
      }

      utterance.onstart = () => {
        setSpeakingId(msgId);
        setIsPaused(false);
      };

      utterance.onend = () => {
        setSpeakingId(null);
        setIsPaused(false);

        // In continuous conversation mode, prompt user to speak after Sensei finishes
        if (conversationModeRef.current) {
          setTimeout(() => {
            if (conversationModeRef.current && !recognitionRef.current) {
              startListening();
            }
          }, 600);
        }
      };

      utterance.onerror = () => {
        setSpeakingId(null);
        setIsPaused(false);
      };

      window.speechSynthesis.speak(utterance);
    },
    [speakingId, isPaused, resumeSpeaking, pauseSpeaking]
  );

  // --------------------------------------------------------------------------
  // Voice Input: Web Speech Recognition
  // --------------------------------------------------------------------------
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  const startListening = useCallback(() => {
    setRecognitionError(null);

    const SpeechRec =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRec) {
      setRecognitionError(
        "Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari for voice interaction."
      );
      return;
    }

    // Stop ongoing speech when user starts talking
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
    }

    try {
      const recognition = new SpeechRec();
      recognition.lang = speechLang;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }

        setInput(transcript);

        // If in auto conversation mode and final result is arrived, auto-send
        if (conversationModeRef.current && event.results[0].isFinal && transcript.trim()) {
          stopListening();
          handleSend(transcript.trim());
        }
      };

      recognition.onerror = (event: any) => {
        if (event.error === "not-allowed" || event.error === "service-not-allowed") {
          setRecognitionError("Microphone permission was denied. Please allow microphone access in your browser settings.");
        } else if (event.error === "no-speech") {
          // Silent timeout
        } else {
          setRecognitionError(`Voice recognition error: ${event.error}`);
        }
        setIsListening(false);
        recognitionRef.current = null;
      };

      recognition.onend = () => {
        setIsListening(false);
        recognitionRef.current = null;
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      setRecognitionError(`Failed to initialize microphone: ${err?.message || "Unknown error"}`);
      setIsListening(false);
      recognitionRef.current = null;
    }
  }, [speechLang]);

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // --------------------------------------------------------------------------
  // Message Sending & AI Response Handling
  // --------------------------------------------------------------------------
  const handleSend = async (userText: string) => {
    const query = userText.trim();
    if (!query) return;

    stopListening();

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
      // Attempt backend Gemini route with rich learner context
      const profile = getStudentProfile();
      const response = await fetch("/api/sensei", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: query,
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

          // In conversation mode, read response automatically
          if (conversationModeRef.current) {
            speakText(senseiMsgId, data.reply);
          }
          return;
        }
      }
    } catch {
      // Fallback gracefully on network timeout
    }

    // Local offline knowledge fallback
    setTimeout(() => {
      let reply = "";
      const lower = query.toLowerCase();

      if (lower.includes("wa") && lower.includes("ga")) {
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

      if (conversationModeRef.current) {
        speakText(senseiMsgId, reply);
      }
    }, 600);
  };

  const handleClearChat = () => {
    stopSpeaking();
    stopListening();
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#C83C50]/20 text-[#C83C50] text-xs font-semibold mb-2 border border-[#C83C50]/30">
            <Bot className="w-3.5 h-3.5" />
            <span>AI Sensei · Multilingual Voice & Text Tutor</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#FFFFFF] tracking-tight">
            Nihongo Setu AI Sensei
          </h1>
          <p className="text-xs text-[#E8E0D5]/70 mt-1">
            Real-time Japanese voice conversations, Tamil/Tanglish grammar explanations, and JLPT N5 coaching.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          {/* Hands-Free Conversation Mode Switch */}
          <button
            onClick={() => {
              const nextMode = !conversationMode;
              setConversationMode(nextMode);
              if (!nextMode) {
                stopListening();
                stopSpeaking();
              } else {
                startListening();
              }
            }}
            className={`inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-md ${
              conversationMode
                ? "bg-[#C83C50] text-[#FFFFFF] border-[#C83C50] ring-2 ring-[#C83C50]/40 animate-pulse"
                : "bg-[#101C35] text-[#E8E0D5] border-[#E8E0D5]/20 hover:bg-[#E8E0D5]/10"
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>{conversationMode ? "Voice Mode: Active" : "Start Voice Conversation"}</span>
          </button>

          <button
            onClick={handleClearChat}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#E8E0D5]/10 hover:bg-[#E8E0D5]/20 text-[#E8E0D5] text-xs font-semibold transition-colors shrink-0"
            title="Reset Chat Session"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Mic Error Banner if needed */}
      {recognitionError && (
        <div className="px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{recognitionError}</span>
          </div>
          <button
            onClick={() => setRecognitionError(null)}
            className="text-xs underline hover:text-[#FFFFFF] ml-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Voice Mode Active Status Bar */}
      {conversationMode && (
        <div className="px-4 py-2.5 rounded-2xl bg-[#C83C50]/15 border border-[#C83C50]/40 text-xs text-[#FFFFFF] flex items-center justify-between shadow-lg">
          <div className="flex items-center space-x-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C83C50] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#C83C50]" />
            </span>
            <span className="font-semibold">
              Hands-Free Conversation Mode Enabled: Speak into your microphone and Sensei will reply and speak back!
            </span>
          </div>
          <button
            onClick={() => {
              setConversationMode(false);
              stopListening();
              stopSpeaking();
            }}
            className="px-2.5 py-1 rounded-lg bg-[#C83C50] hover:bg-[#B03244] text-[#FFFFFF] text-[11px] font-bold"
          >
            Exit Voice Mode
          </button>
        </div>
      )}

      {/* Japanese Learning Practice Presets */}
      <div className="bg-[#101C35] border border-[#E8E0D5]/15 rounded-2xl p-4 space-y-2.5 shadow-lg">
        <div className="flex items-center justify-between text-xs font-bold text-[#E8E0D5]/90">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-3.5 h-3.5 text-[#C83C50]" />
            <span>Targeted Practice Modes:</span>
          </div>
          <span className="text-[10px] text-[#E8E0D5]/50 font-normal">Click any mode to begin</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {PRACTICE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleSend(preset.prompt)}
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

      {/* Suggested Prompts Shelf */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-[11px] text-[#E8E0D5]/50 shrink-0 flex items-center space-x-1 pl-1">
          <MessageSquare className="w-3 h-3 text-[#C83C50]" />
          <span>Quick Prompts:</span>
        </span>
        {SUGGESTED_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="px-3 py-1 rounded-xl bg-[#E8E0D5]/5 hover:bg-[#E8E0D5]/15 border border-[#E8E0D5]/15 text-[#E8E0D5] text-[11px] whitespace-nowrap transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Thread Container */}
      <div className="bg-[#101C35] border border-[#E8E0D5]/20 rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col h-[560px]">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((msg) => {
            const isSensei = msg.sender === "sensei";
            const isCurrentlySpeaking = speakingId === msg.id;

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

                  {/* Message Bottom Action Bar */}
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
                        {/* Audio Speaking Controls */}
                        <div className="flex items-center space-x-1 bg-[#101C35] border border-[#E8E0D5]/20 rounded-lg px-1.5 py-0.5">
                          <button
                            onClick={() => speakText(msg.id, msg.text)}
                            className="hover:text-[#FFFFFF] transition-colors p-0.5"
                            title={isCurrentlySpeaking ? (isPaused ? "Resume voice" : "Pause voice") : "Listen aloud"}
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
                              onClick={stopSpeaking}
                              className="hover:text-red-400 p-0.5"
                              title="Stop speech"
                            >
                              <Square className="w-2.5 h-2.5 fill-red-400 text-red-400" />
                            </button>
                          )}
                        </div>

                        {/* Copy Button */}
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

        {/* Input Form & Voice Controls */}
        <div className="pt-4 border-t border-[#E8E0D5]/15 space-y-2">
          {/* Active Voice Input Feedback Bar */}
          {isListening && (
            <div className="px-3.5 py-1.5 rounded-xl bg-[#C83C50]/20 border border-[#C83C50]/40 flex items-center justify-between text-xs text-[#FFFFFF]">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                <span className="font-bold">
                  Listening ({SPEECH_LANGUAGES.find((l) => l.code === speechLang)?.label})...
                </span>
                <span className="text-[11px] text-[#E8E0D5]/70 italic">Speak now</span>
              </div>
              <button
                onClick={stopListening}
                className="px-2 py-0.5 rounded bg-red-500 hover:bg-red-600 text-[10px] font-bold text-[#FFFFFF]"
              >
                Stop
              </button>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="flex items-center space-x-2"
          >
            {/* Language Selector Dropdown for Voice Input */}
            <div className="relative shrink-0">
              <select
                value={speechLang}
                onChange={(e) => setSpeechLang(e.target.value)}
                className="bg-[#0B1323] border border-[#E8E0D5]/25 rounded-2xl px-2.5 py-3 text-xs text-[#FFFFFF] focus:outline-none focus:border-[#C83C50] cursor-pointer"
                title="Select Voice Input Language"
              >
                {SPEECH_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-[#101C35] text-[#FFFFFF]">
                    {lang.flag} {lang.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Message Input Box */}
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                isListening
                  ? "Listening to your voice..."
                  : "Ask Sensei in Japanese, Tamil, Tanglish, or English..."
              }
              className="flex-1 bg-[#0B1323] border border-[#E8E0D5]/25 rounded-2xl px-4 py-3 text-xs text-[#FFFFFF] placeholder-[#E8E0D5]/40 focus:outline-none focus:border-[#C83C50]"
            />

            {/* Microphone Toggle Button */}
            <button
              type="button"
              onClick={toggleListening}
              className={`p-3 rounded-2xl border transition-all shrink-0 ${
                isListening
                  ? "bg-red-600 border-red-500 text-[#FFFFFF] ring-2 ring-red-400 animate-pulse shadow-lg shadow-red-500/30"
                  : "bg-[#0B1323] border-[#E8E0D5]/25 hover:border-[#C83C50] text-[#E8E0D5] hover:text-[#FFFFFF]"
              }`}
              title={isListening ? "Stop recording speech" : "Speak to Sensei (Voice Input)"}
              aria-label="Microphone Voice Input"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Send Message Button */}
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
    </div>
  );
}
