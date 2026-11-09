"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Bot,
  User,
  Send,
  Sparkles,
  RotateCcw,
  BookOpen,
  HelpCircle,
  Copy,
  Check,
  Volume2,
} from "lucide-react";
import { getStudentProfile } from "@/lib/storage/studentState";

interface ChatMessage {
  id: string;
  sender: "user" | "sensei";
  text: string;
  timestamp: string;
}

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

2. **が (ga) — Subject Marker (Identifier):**
   • Identifies *who* or *what* specifically performs the action.
   • Information *before* が is the key answer to "who?" or "which?".
   • Example: だれが来ましたか？ 田中さんが来ました (Tanaka-san ga kimashita) = *Who came? Tanaka-san (specifically) came.*

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
    text: "こんにちは！ I am Sensei, your personal Japanese AI tutor on NihongoSetu. How can I assist your JLPT studies today? Feel free to ask about grammar nuances, sentence translation, or Kanji memory strategies!",
    timestamp: "10:00 AM",
  },
];

export default function AISenseiPage() {
  const counterRef = useRef(1);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const speakText = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      // Clean markdown symbols for speech
      const cleaned = text.replace(/[*#_~]/g, "");
      const utterance = new SpeechSynthesisUtterance(cleaned);
      utterance.lang = "ja-JP";
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    } catch {
      // ignore
    }
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSend = async (userText: string) => {
    const query = userText.trim();
    if (!query) return;

    counterRef.current += 1;
    const currentId = counterRef.current;
    const userMsg: ChatMessage = {
      id: `u-${currentId}`,
      sender: "user",
      text: query,
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      // Attempt backend API proxy route with student context
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
          const senseiMsg: ChatMessage = {
            id: `s-${counterRef.current}`,
            sender: "sensei",
            text: data.reply,
            timestamp: "Just now",
          };
          setMessages((prev) => [...prev, senseiMsg]);
          setIsTyping(false);
          return;
        }
      }
    } catch {
      // Fallback to local intelligent knowledge bank
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
        reply = `That is an excellent question! In Japanese linguistics, understanding the structural context is key.

When learning this concept, keep the Subject-Object-Verb (SOV) sentence order in mind:
• **Subject** comes first with particles like は (wa) or が (ga)
• **Object** follows with を (o)
• **Verb** always concludes the clause

Would you like me to formulate custom Japanese practice sentences or explain the corresponding JLPT level grammar rule in greater detail?`;
      }

      counterRef.current += 1;
      const senseiMsg: ChatMessage = {
        id: `s-${counterRef.current}`,
        sender: "sensei",
        text: reply,
        timestamp: "Just now",
      };
      setMessages((prev) => [...prev, senseiMsg]);
      setIsTyping(false);
    }, 700);
  };

  const handleClearChat = () => {
    counterRef.current += 1;
    setMessages([
      {
        id: `initial-reset-${counterRef.current}`,
        sender: "sensei",
        text: "チャットがリセットされました。 How can I assist you with your Japanese study goals today?",
        timestamp: "Just now",
      },
    ]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#C83C50]/20 text-[#C83C50] text-xs font-semibold mb-2 border border-[#C83C50]/30">
            <Bot className="w-3.5 h-3.5" />
            <span>AI Sensei · Dedicated Japanese Tutor</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#FFFFFF]">
            Interactive Japanese AI Tutor
          </h1>
          <p className="text-xs text-[#E8E0D5]/70 mt-1">
            Real-time grammatical explanations, nuance clarifications, and sentence parsing.
          </p>
        </div>

        <button
          onClick={handleClearChat}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#E8E0D5]/10 hover:bg-[#E8E0D5]/20 text-[#E8E0D5] text-xs font-semibold transition-colors shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Session</span>
        </button>
      </div>

      {/* Suggested Prompts Shelf */}
      <div className="bg-[#101C35] border border-[#E8E0D5]/15 rounded-2xl p-4 space-y-2 shadow-lg">
        <div className="flex items-center space-x-2 text-xs font-bold text-[#E8E0D5]/80">
          <Sparkles className="w-3.5 h-3.5 text-[#C83C50]" />
          <span>Recommended Study Inquiries:</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {SUGGESTED_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="px-3 py-1.5 rounded-xl bg-[#E8E0D5]/5 hover:bg-[#E8E0D5]/15 border border-[#E8E0D5]/15 text-[#E8E0D5] text-xs whitespace-nowrap transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Thread Container */}
      <div className="bg-[#101C35] border border-[#E8E0D5]/20 rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col h-[520px]">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((msg) => {
            const isSensei = msg.sender === "sensei";

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
                  className={`max-w-[85%] rounded-2xl p-4 space-y-2 text-xs leading-relaxed shadow-md ${
                    isSensei
                      ? "bg-[#0B1323] text-[#FFFFFF] border border-[#E8E0D5]/15"
                      : "bg-[#C83C50] text-[#FFFFFF] font-medium"
                  }`}
                >
                  <div className="whitespace-pre-line">{msg.text}</div>

                  <div className="flex items-center justify-between pt-1 border-t border-[#FFFFFF]/10 text-[10px] opacity-60">
                    <span>{msg.timestamp}</span>
                    {isSensei && (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => copyToClipboard(msg.id, msg.text)}
                          className="hover:opacity-100 p-0.5"
                          title="Copy text"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                        <button
                          onClick={() => speakText(msg.text)}
                          className="hover:opacity-100 p-0.5"
                          title="Read aloud"
                        >
                          <Volume2 className="w-3 h-3 text-[#C83C50]" />
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
              <div className="p-3.5 rounded-2xl bg-[#0B1323] border border-[#E8E0D5]/15 flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-[#C83C50] animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-[#C83C50] animate-bounce delay-100" />
                <span className="w-2 h-2 rounded-full bg-[#C83C50] animate-bounce delay-200" />
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="pt-4 border-t border-[#E8E0D5]/15 flex items-center space-x-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Sensei anything about Japanese grammar, vocabulary, or culture..."
            className="flex-1 bg-[#0B1323] border border-[#E8E0D5]/25 rounded-2xl px-4 py-3 text-xs text-[#FFFFFF] placeholder-[#E8E0D5]/40 focus:outline-none focus:border-[#C83C50]"
          />

          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="p-3 rounded-2xl bg-[#C83C50] hover:bg-[#B03244] text-[#FFFFFF] shadow-lg shadow-[#C83C50]/20 disabled:opacity-40 transition-all"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
