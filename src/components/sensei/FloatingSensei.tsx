"use client";

// ==============================================================================
// NIHONGOSETU — FLOATING UNIVERSAL MULTILINGUAL AI SENSEI
// Website-wide assistant available across all pages with context awareness
// ==============================================================================

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  Bot,
  X,
  Send,
  Mic,
  MicOff,
  Volume2,
  Settings,
  Sparkles,
  HelpCircle,
  Minimize2,
  ChevronDown,
  Globe,
  Radio,
  Check,
  RefreshCw,
} from "lucide-react";
import { useSensei } from "@/lib/sensei/SenseiContext";
import { UNIVERSAL_LANGUAGES, UniversalLanguage, getLanguageByCode } from "@/lib/sensei/languages";
import { isMeaningfulSpeech } from "@/lib/sensei/voiceActivityDetector";

interface Message {
  id: string;
  role: "user" | "sensei";
  content: string;
  source?: "gemini" | "fallback";
  explanationLanguage?: string;
  timestamp: number;
}

export default function FloatingSensei() {
  const pathname = usePathname();
  const {
    settings,
    updateSettings,
    activeLanguage,
    pageContext,
    isFloatingOpen,
    setIsFloatingOpen,
    preloadedPrompt,
    clearPreloadedPrompt,
  } = useSensei();

  // If user is already on the dedicated /portal/sensei page, hide the floating widget
  const isDedicatedSenseiPage = pathname === "/portal/sensei";

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial-welcome",
      role: "sensei",
      content: `Hello! I am **Nihongo AI Sensei** (日本語節の先生).

I am available across NihongoSetu to help you master Japanese.
You can ask questions in any language, and ask me to explain in **English, Tamil (தமிழ்), Japanese (日本語), French, Spanish, Hindi**, or any language!

How can I help you right now?`,
      timestamp: Date.now(),
    },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "settings">("chat");
  const [isListening, setIsListening] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const listeningTimeoutRef = useRef<any>(null);
  const messagesRef = useRef<Message[]>(messages);
  messagesRef.current = messages;

  // Auto-scroll message feed
  useEffect(() => {
    if (isFloatingOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isFloatingOpen]);

  // Handle preloaded prompt triggered externally (e.g. askSensei("Explain this kana"))
  useEffect(() => {
    if (preloadedPrompt && isFloatingOpen) {
      handleSend(preloadedPrompt);
      clearPreloadedPrompt();
    }
  }, [preloadedPrompt, isFloatingOpen]);

  // Setup Web Speech Recognition with anti-stuck watchdog and noise filtering
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;

        const langToUse =
          settings.inputLanguage === "auto"
            ? activeLanguage.speechCode
            : getLanguageByCode(settings.inputLanguage)?.speechCode || "en-US";
        recognition.lang = langToUse;

        recognition.onresult = (event: any) => {
          if (listeningTimeoutRef.current) {
            clearTimeout(listeningTimeoutRef.current);
            listeningTimeoutRef.current = null;
          }
          const transcript = event.results[0]?.[0]?.transcript;
          if (transcript && isMeaningfulSpeech(transcript)) {
            setInput(transcript);
            handleSend(transcript);
          }
          setIsListening(false);
        };

        recognition.onerror = () => {
          if (listeningTimeoutRef.current) {
            clearTimeout(listeningTimeoutRef.current);
            listeningTimeoutRef.current = null;
          }
          setIsListening(false);
        };

        recognition.onend = () => {
          if (listeningTimeoutRef.current) {
            clearTimeout(listeningTimeoutRef.current);
            listeningTimeoutRef.current = null;
          }
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      if (listeningTimeoutRef.current) {
        clearTimeout(listeningTimeoutRef.current);
      }
    };
  }, [settings.inputLanguage, activeLanguage]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      if (listeningTimeoutRef.current) {
        clearTimeout(listeningTimeoutRef.current);
        listeningTimeoutRef.current = null;
      }
      try {
        recognitionRef.current.stop();
      } catch {}
      setIsListening(false);
    } else {
      try {
        const langToUse =
          settings.inputLanguage === "auto"
            ? activeLanguage.speechCode
            : getLanguageByCode(settings.inputLanguage)?.speechCode || "en-US";
        recognitionRef.current.lang = langToUse;
        recognitionRef.current.start();
        setIsListening(true);

        // Anti-stuck safety watchdog: Auto abort if no speech resolved within 9 seconds
        if (listeningTimeoutRef.current) clearTimeout(listeningTimeoutRef.current);
        listeningTimeoutRef.current = setTimeout(() => {
          if (recognitionRef.current) {
            try {
              recognitionRef.current.stop();
            } catch {}
          }
          setIsListening(false);
        }, 9000);
      } catch {
        setIsListening(false);
      }
    }
  };

  const handleSend = async (customPrompt?: string) => {
    const textToSend = (customPrompt || input).trim();
    if (!textToSend || !isMeaningfulSpeech(textToSend) || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: textToSend,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!customPrompt) setInput("");
    setIsLoading(true);

    try {
      const currentHistory = messagesRef.current;
      const response = await fetch("/api/sensei", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: textToSend,
          messages: [...currentHistory, userMessage].slice(-10).map((m) => ({
            role: m.role === "user" ? "user" : "model",
            content: m.content,
          })),
          inputLanguage: settings.inputLanguage,
          responseLanguage: settings.responseLanguage || settings.explanationLanguage,
          explanationLanguage: settings.explanationLanguage,
          conversationLanguage: settings.conversationLanguage,
          voiceOutputLanguage: settings.voiceOutputLanguage,
          context: {
            pathname: pageContext.pathname,
            pageTitle: pageContext.pageTitle || typeof document !== "undefined" ? document.title : "",
            selectedItem: pageContext.selectedItem,
          },
        }),
      });

      const data = await response.json();
      if (data.isExplicit && data.explanationLanguage) {
        updateSettings({
          responseLanguage: data.explanationLanguage,
          explanationLanguage: data.explanationLanguage,
        });
      }
      const senseiReply = data.reply || "Sensei is reflecting on this. Please ask again.";

      const senseiMessage: Message = {
        id: `sensei-${Date.now()}`,
        role: "sensei",
        content: senseiReply,
        source: data.source,
        explanationLanguage: data.explanationLanguage,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, senseiMessage]);

      // If user voiceOutputLanguage is active, speak the reply
      if (settings.voiceOutputLanguage !== "none") {
        speakResponse(senseiReply, data.voiceOutputLanguage || settings.explanationLanguage, senseiMessage.id);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "sensei",
          content: "I could not connect right now. Please check your network connection.",
          source: "fallback",
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const speakResponse = (text: string, langCode: string, messageId: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();
    setSpeakingMsgId(messageId);

    // Clean markdown symbols for cleaner speech
    const cleanSpeech = text
      .replace(/[#*_`~>]/g, "")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .slice(0, 350);

    const utterance = new SpeechSynthesisUtterance(cleanSpeech);
    const targetLang = getLanguageByCode(langCode);
    utterance.lang = targetLang?.speechCode || "en-US";
    utterance.rate = 0.95;

    // Pick a natural browser voice if available
    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = voices.find(
      (v) =>
        v.lang === utterance.lang ||
        v.lang.startsWith(langCode) ||
        (targetLang?.alternateSpeechCodes && targetLang.alternateSpeechCodes.includes(v.lang))
    );
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onend = () => setSpeakingMsgId(null);
    utterance.onerror = () => setSpeakingMsgId(null);

    window.speechSynthesis.speak(utterance);
  };

  const handleExplainCurrentPage = () => {
    const title = typeof document !== "undefined" ? document.title : "";
    const prompt = `Please explain the Japanese learning concepts on this page (${pathname} - ${title}) in ${activeLanguage.name}. Give me a helpful overview and recommended study steps.`;
    handleSend(prompt);
  };

  // If user is on the dedicated Sensei page, don't show floating widget
  if (isDedicatedSenseiPage) {
    return null;
  }

  return (
    <>
      {/* Floating Action Button */}
      {!isFloatingOpen && (
        <button
          onClick={() => setIsFloatingOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-[#C83C50] via-[#E85D75] to-[#B0283C] text-white rounded-full shadow-2xl hover:shadow-[#C83C50]/50 hover:scale-105 active:scale-95 transition-all duration-200 group border border-white/20 select-none"
          title={`Ask AI Sensei (Explaining in ${activeLanguage.name})`}
          aria-label="Open Nihongo AI Sensei"
        >
          <div className="relative">
            <Bot className="w-5 h-5 transition-transform group-hover:rotate-12" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse border-2 border-[#101C35]" />
          </div>
          <span className="text-xs font-bold tracking-wide hidden sm:inline">
            AI Sensei
          </span>
          <span className="text-[10px] font-semibold uppercase bg-black/30 px-2 py-0.5 rounded-full border border-white/10">
            {activeLanguage.code.toUpperCase()}
          </span>
        </button>
      )}

      {/* Floating Slide-over / Modal Drawer */}
      {isFloatingOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[95vw] sm:w-[440px] h-[580px] max-h-[85vh] bg-[#101C35]/95 backdrop-blur-xl border border-[#E8E0D5]/20 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-white animate-in slide-in-from-bottom-5 duration-200">
          {/* Drawer Header */}
          <div className="p-3.5 bg-[#152342] border-b border-[#E8E0D5]/15 flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#C83C50] to-[#E85D75] flex items-center justify-center text-white shadow-md">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                  Nihongo AI Sensei
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#C83C50]/20 text-[#E85D75] border border-[#C83C50]/40 font-mono">
                    PRO
                  </span>
                </h3>
                <p className="text-[10px] text-[#E8E0D5]/60 flex items-center gap-1">
                  <Globe className="w-3 h-3 text-cyan-400" />
                  Explaining in:{" "}
                  <span className="font-semibold text-cyan-300">
                    {activeLanguage.name} ({activeLanguage.nativeName})
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Language Switch Dropdown Trigger */}
              <div className="relative">
                <button
                  onClick={() => setShowLangMenu((prev) => !prev)}
                  className="px-2 py-1 bg-white/10 hover:bg-white/15 text-white text-[11px] font-medium rounded-lg border border-white/10 flex items-center gap-1 transition"
                  title="Change Explanation Language"
                >
                  <Globe className="w-3 h-3 text-[#E85D75]" />
                  <span>{activeLanguage.code.toUpperCase()}</span>
                  <ChevronDown className="w-2.5 h-2.5 opacity-60" />
                </button>

                {showLangMenu && (
                  <div className="absolute right-0 top-full mt-1 w-56 max-h-60 overflow-y-auto bg-[#152342] border border-[#E8E0D5]/20 rounded-xl shadow-2xl py-1 z-50 text-xs">
                    <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#E8E0D5]/50 border-b border-white/10">
                      Explanation Language
                    </div>
                    {UNIVERSAL_LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          updateSettings({ explanationLanguage: lang.code });
                          setShowLangMenu(false);
                        }}
                        className={`w-full px-3 py-1.5 text-left flex items-center justify-between hover:bg-white/10 transition ${
                          settings.explanationLanguage === lang.code
                            ? "text-[#C83C50] font-bold bg-[#C83C50]/10"
                            : "text-[#E8E0D5]/90"
                        }`}
                      >
                        <span>
                          {lang.name} ({lang.nativeName})
                        </span>
                        {settings.explanationLanguage === lang.code && (
                          <Check className="w-3.5 h-3.5 text-[#C83C50]" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Settings Tab Toggle */}
              <button
                onClick={() => setActiveTab(activeTab === "chat" ? "settings" : "chat")}
                className={`p-1.5 rounded-lg border transition ${
                  activeTab === "settings"
                    ? "bg-[#C83C50] text-white border-[#C83C50]"
                    : "bg-white/5 hover:bg-white/10 text-[#E8E0D5]/70 border-white/10"
                }`}
                title="Sensei Language Settings"
              >
                <Settings className="w-3.5 h-3.5" />
              </button>

              {/* Close Drawer Button */}
              <button
                onClick={() => setIsFloatingOpen(false)}
                className="p-1.5 hover:bg-white/10 text-[#E8E0D5]/70 hover:text-white rounded-lg transition"
                title="Minimize Sensei"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Context Bar */}
          <div className="px-3 py-1.5 bg-[#0D1629] border-b border-[#E8E0D5]/10 flex items-center justify-between text-[11px] text-[#E8E0D5]/70">
            <span className="truncate max-w-[240px]">
              Active Page: <span className="text-white font-mono">{pathname}</span>
            </span>
            <button
              onClick={handleExplainCurrentPage}
              className="text-[#E85D75] hover:text-white flex items-center gap-1 font-semibold text-[10px] transition"
            >
              <Sparkles className="w-2.5 h-2.5" />
              Explain Page
            </button>
          </div>

          {/* Body: Chat View */}
          {activeTab === "chat" && (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Message Feed */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3 text-xs">
                {messages.map((m) => {
                  const isSensei = m.role === "sensei";
                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isSensei ? "items-start" : "items-end"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-sm leading-relaxed ${
                          isSensei
                            ? "bg-[#1C2C4E] text-[#F3EFEA] border border-[#E8E0D5]/10 rounded-tl-sm"
                            : "bg-[#C83C50] text-white rounded-tr-sm font-medium"
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{m.content}</div>

                        {isSensei && (
                          <div className="mt-2 pt-1.5 border-t border-white/10 flex items-center justify-between text-[10px] text-[#E8E0D5]/50">
                            <span className="flex items-center gap-1">
                              {m.source === "gemini" ? "Gemini Pro" : "Pedagogical Core"}
                            </span>
                            <button
                              onClick={() =>
                                speakResponse(
                                  m.content,
                                  m.explanationLanguage || settings.explanationLanguage,
                                  m.id
                                )
                              }
                              className={`p-1 rounded hover:bg-white/10 text-cyan-300 hover:text-white transition flex items-center gap-1 ${
                                speakingMsgId === m.id ? "text-amber-300 animate-pulse" : ""
                              }`}
                              title="Listen to response"
                            >
                              <Volume2 className="w-3 h-3" />
                              <span>{speakingMsgId === m.id ? "Playing..." : "Speak"}</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {isLoading && (
                  <div className="flex items-center gap-2 text-[#E8E0D5]/60 text-xs py-2 px-3 bg-[#1C2C4E] rounded-xl w-fit border border-[#E8E0D5]/10">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#E85D75]" />
                    <span>Sensei is thinking in {activeLanguage.name}...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompt Suggestions */}
              <div className="px-3 py-1.5 bg-[#0D1629]/70 border-t border-[#E8E0D5]/10 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[10px]">
                <button
                  onClick={() => handleSend("Explain particles は and が in English with examples.")}
                  className="px-2 py-1 bg-white/5 hover:bg-white/10 rounded-lg whitespace-nowrap text-[#E8E0D5]/80 hover:text-white transition border border-white/5"
                >
                  は vs が (EN)
                </button>
                <button
                  onClick={() => handleSend("இந்த grammar-ஐ தமிழ்ல explain பண்ணுங்க.")}
                  className="px-2 py-1 bg-white/5 hover:bg-white/10 rounded-lg whitespace-nowrap text-[#E8E0D5]/80 hover:text-white transition border border-white/5"
                >
                  தமிழ்ல விளக்கு (TA)
                </button>
                <button
                  onClick={() => handleSend("日本語でこの文法を説明してください。")}
                  className="px-2 py-1 bg-white/5 hover:bg-white/10 rounded-lg whitespace-nowrap text-[#E8E0D5]/80 hover:text-white transition border border-white/5"
                >
                  日本語で説明 (JA)
                </button>
                <button
                  onClick={() => handleSend("Expliquez la forme en て en français.")}
                  className="px-2 py-1 bg-white/5 hover:bg-white/10 rounded-lg whitespace-nowrap text-[#E8E0D5]/80 hover:text-white transition border border-white/5"
                >
                  En français (FR)
                </button>
                <button
                  onClick={() => handleSend("Explica la diferencia entre に y で en español.")}
                  className="px-2 py-1 bg-white/5 hover:bg-white/10 rounded-lg whitespace-nowrap text-[#E8E0D5]/80 hover:text-white transition border border-white/5"
                >
                  En español (ES)
                </button>
              </div>

              {/* Input Bar */}
              <div className="p-2.5 bg-[#152342] border-t border-[#E8E0D5]/15 flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`p-2 rounded-xl transition ${
                    isListening
                      ? "bg-red-500 text-white animate-pulse"
                      : "bg-white/10 hover:bg-white/15 text-[#E8E0D5]/80 hover:text-white"
                  }`}
                  title={isListening ? "Listening... (Click to stop)" : "Speak to Sensei"}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder={`Ask Sensei in any language...`}
                  className="flex-1 bg-[#101C35] text-white text-xs px-3.5 py-2.5 rounded-xl border border-[#E8E0D5]/20 focus:outline-none focus:border-[#C83C50] transition placeholder:text-[#E8E0D5]/40"
                  disabled={isLoading}
                />

                <button
                  type="button"
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isLoading}
                  className="p-2.5 bg-[#C83C50] hover:bg-[#B0283C] disabled:opacity-40 text-white rounded-xl transition flex items-center justify-center shadow"
                  title="Send message"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Body: Settings View */}
          {activeTab === "settings" && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              <div className="border-b border-white/10 pb-3">
                <h4 className="font-bold text-white text-sm mb-1">
                  Multilingual AI Sensei Configuration
                </h4>
                <p className="text-[11px] text-[#E8E0D5]/60">
                  Separate your input language from your desired explanation and voice output language.
                </p>
              </div>

              {/* 1. Input Language */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#E85D75] uppercase tracking-wide">
                  Input Language (What you speak or write)
                </label>
                <select
                  value={settings.inputLanguage}
                  onChange={(e) => updateSettings({ inputLanguage: e.target.value })}
                  className="w-full bg-[#101C35] text-white text-xs p-2.5 rounded-xl border border-white/15 focus:outline-none focus:border-[#C83C50]"
                >
                  <option value="auto">Auto-detect (Universal)</option>
                  {UNIVERSAL_LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.name} ({l.nativeName})
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. Explanation Language */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#E85D75] uppercase tracking-wide">
                  Explanation Language (How Sensei explains concepts)
                </label>
                <select
                  value={settings.explanationLanguage}
                  onChange={(e) => updateSettings({ explanationLanguage: e.target.value })}
                  className="w-full bg-[#101C35] text-white text-xs p-2.5 rounded-xl border border-white/15 focus:outline-none focus:border-[#C83C50]"
                >
                  {UNIVERSAL_LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.name} ({l.nativeName})
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-[#E8E0D5]/50 italic">
                  Note: Explicit requests in your prompt (e.g. &ldquo;Explain in French&rdquo;) always take highest priority.
                </p>
              </div>

              {/* 3. Voice Output Language */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#E85D75] uppercase tracking-wide">
                  Voice Output Language
                </label>
                <select
                  value={settings.voiceOutputLanguage}
                  onChange={(e) => updateSettings({ voiceOutputLanguage: e.target.value })}
                  className="w-full bg-[#101C35] text-white text-xs p-2.5 rounded-xl border border-white/15 focus:outline-none focus:border-[#C83C50]"
                >
                  <option value="follow_explanation">Follow Explanation Language</option>
                  <option value="follow_conversation">Follow Conversation Language</option>
                  <option value="none">Mute Spoken Audio</option>
                  {UNIVERSAL_LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.name} ({l.nativeName})
                    </option>
                  ))}
                </select>
              </div>

              {/* 4. Conversation Language Mode */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#E85D75] uppercase tracking-wide">
                  Conversation Practice Language
                </label>
                <select
                  value={settings.conversationLanguage}
                  onChange={(e) => updateSettings({ conversationLanguage: e.target.value })}
                  className="w-full bg-[#101C35] text-white text-xs p-2.5 rounded-xl border border-white/15 focus:outline-none focus:border-[#C83C50]"
                >
                  <option value="auto">Adaptive / Follow User</option>
                  <option value="ja">Japanese Immersion (日本語)</option>
                  <option value="en">English Conversation</option>
                  <option value="ta">Tamil Conversation (தமிழ்)</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setActiveTab("chat")}
                  className="w-full py-2 bg-[#C83C50] text-white font-bold rounded-xl shadow transition"
                >
                  Save & Return to Chat
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

