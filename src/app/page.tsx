import React from "react";
import Link from "next/link";
import PublicNavbar from "@/components/public/Navbar";
import PublicFooter from "@/components/public/Footer";
import {
  Sparkles,
  BookOpen,
  PenTool,
  Headphones,
  Award,
  Languages,
  CheckCircle2,
  Bot,
  ArrowRight,
  ShieldCheck
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#101C35] text-[#FFFFFF] flex flex-col font-sans">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-32 border-b border-[#E8E0D5]/10">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#E8E0D5_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Top Pill */}
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#C83C50]/15 border border-[#C83C50]/30 text-xs font-semibold text-[#FFFFFF] shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#C83C50]" />
              <span>Dedicated Japanese Learning Platform for India & Global Learners</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#FFFFFF] leading-tight">
              日本語への架け橋
              <span className="block text-2xl sm:text-4xl font-extrabold text-[#E8E0D5] mt-3">
                Your Bridge to Japanese Fluency
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-xl text-[#E8E0D5]/80 font-light leading-relaxed max-w-2xl mx-auto">
              Master the Japanese Language from Hiragana and Katakana to JLPT N1. Learn vocabulary in 12 native languages, practice stroke orders on retina canvas, take timed mock examinations, and consult AI Sensei.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/portal"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#C83C50] hover:bg-[#B03244] text-[#FFFFFF] font-bold text-base shadow-xl shadow-[#C83C50]/30 transition-all flex items-center justify-center space-x-2 group"
              >
                <span>Enter Student Portal</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/jlpt"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#E8E0D5]/10 hover:bg-[#E8E0D5]/20 text-[#FFFFFF] font-semibold text-base border border-[#E8E0D5]/20 transition-all flex items-center justify-center space-x-2"
              >
                <span>Explore JLPT Roadmap</span>
              </Link>
            </div>

            {/* Trust Highlights */}
            <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-[#E8E0D5]/70">
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>100% Free Core Curriculum</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <Languages className="w-4 h-4 text-[#C83C50]" />
                <span>12 Interface Languages</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Offline-Ready Progress Storage</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="py-20 sm:py-28 bg-[#101C35] border-b border-[#E8E0D5]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs uppercase font-extrabold tracking-widest text-[#C83C50]">
              The NihongoSetu Learning Suite
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-[#FFFFFF]">
              Engineered for Complete Language Acquisition
            </h3>
            <p className="text-sm text-[#E8E0D5]/80">
              Every tool and module is calibrated to eliminate the barriers of traditional textbook study.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1: Japanese Script */}
            <div className="p-8 rounded-2xl bg-[#FFFFFF]/5 border border-[#E8E0D5]/15 hover:border-[#C83C50]/50 transition-all group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#C83C50]/15 border border-[#C83C50]/30 flex items-center justify-center text-[#C83C50] mb-6 group-hover:scale-110 transition-transform">
                  <PenTool className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-[#FFFFFF] mb-2">
                  Japanese Script & Stroke Order
                </h4>
                <p className="text-sm text-[#E8E0D5]/80 leading-relaxed mb-4">
                  Learn all 46 basic syllables, dakuon, and yōon for both Hiragana and Katakana. Practice authentic stroke orders interactively on an in-browser high-DPI canvas.
                </p>
              </div>
              <Link href="/portal/kana" className="text-xs font-semibold text-[#C83C50] flex items-center space-x-1 group-hover:underline">
                <span>Start Script Practice</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Feature 2: Multilingual Vocab */}
            <div className="p-8 rounded-2xl bg-[#FFFFFF]/5 border border-[#E8E0D5]/15 hover:border-[#C83C50]/50 transition-all group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#C83C50]/15 border border-[#C83C50]/30 flex items-center justify-center text-[#C83C50] mb-6 group-hover:scale-110 transition-transform">
                  <Languages className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-[#FFFFFF] mb-2">
                  12-Language Vocabulary
                </h4>
                <p className="text-sm text-[#E8E0D5]/80 leading-relaxed mb-4">
                  Bridging concepts directly into your native language: English, Tamil, Hindi, Telugu, Malayalam, Kannada, Bengali, Marathi, Tagalog, Arabic, French, and Spanish.
                </p>
              </div>
              <Link href="/portal/vocab" className="text-xs font-semibold text-[#C83C50] flex items-center space-x-1 group-hover:underline">
                <span>Browse Vocabulary</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Feature 3: Kanji Mastery */}
            <div className="p-8 rounded-2xl bg-[#FFFFFF]/5 border border-[#E8E0D5]/15 hover:border-[#C83C50]/50 transition-all group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#C83C50]/15 border border-[#C83C50]/30 flex items-center justify-center text-[#C83C50] mb-6 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-[#FFFFFF] mb-2">
                  1,097 Kanji Vault
                </h4>
                <p className="text-sm text-[#E8E0D5]/80 leading-relaxed mb-4">
                  Complete Joyo and JLPT kanji coverage with Onyomi, Kunyomi, radical groupings, stroke orders, and real-world compound vocabulary examples.
                </p>
              </div>
              <Link href="/portal/kanji" className="text-xs font-semibold text-[#C83C50] flex items-center space-x-1 group-hover:underline">
                <span>Explore Kanji Vault</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Feature 4: Timed Mock Exams */}
            <div className="p-8 rounded-2xl bg-[#FFFFFF]/5 border border-[#E8E0D5]/15 hover:border-[#C83C50]/50 transition-all group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#C83C50]/15 border border-[#C83C50]/30 flex items-center justify-center text-[#C83C50] mb-6 group-hover:scale-110 transition-transform">
                  <Award className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-[#FFFFFF] mb-2">
                  JLPT Mock Exam Simulator
                </h4>
                <p className="text-sm text-[#E8E0D5]/80 leading-relaxed mb-4">
                  Simulate official test conditions across N5, N4, N3, N2, and N1. Test question randomization, instantaneous score grading, and in-depth explanations.
                </p>
              </div>
              <Link href="/portal/jlpt" className="text-xs font-semibold text-[#C83C50] flex items-center space-x-1 group-hover:underline">
                <span>Take Mock Exam</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Feature 5: Audio Comprehension */}
            <div className="p-8 rounded-2xl bg-[#FFFFFF]/5 border border-[#E8E0D5]/15 hover:border-[#C83C50]/50 transition-all group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#C83C50]/15 border border-[#C83C50]/30 flex items-center justify-center text-[#C83C50] mb-6 group-hover:scale-110 transition-transform">
                  <Headphones className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-[#FFFFFF] mb-2">
                  Listening Comprehension
                </h4>
                <p className="text-sm text-[#E8E0D5]/80 leading-relaxed mb-4">
                  Daily Japanese spoken phrases with multiple playback speeds (1.0x normal, 0.75x slow), hidden transcript toggles, and multiple-choice meaning checks.
                </p>
              </div>
              <Link href="/portal/listening" className="text-xs font-semibold text-[#C83C50] flex items-center space-x-1 group-hover:underline">
                <span>Practice Listening</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Feature 6: AI Sensei Tutor */}
            <div className="p-8 rounded-2xl bg-[#FFFFFF]/5 border border-[#E8E0D5]/15 hover:border-[#C83C50]/50 transition-all group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#C83C50]/15 border border-[#C83C50]/30 flex items-center justify-center text-[#C83C50] mb-6 group-hover:scale-110 transition-transform">
                  <Bot className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-[#FFFFFF] mb-2">
                  AI Sensei Assistant
                </h4>
                <p className="text-sm text-[#E8E0D5]/80 leading-relaxed mb-4">
                  Ask grammar questions, request nuance breakdowns between similar particles, generate custom example sentences, and receive tailored encouragement 24/7.
                </p>
              </div>
              <Link href="/portal/sensei" className="text-xs font-semibold text-[#C83C50] flex items-center space-x-1 group-hover:underline">
                <span>Chat with AI Sensei</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* JLPT Levels Section */}
      <section className="py-20 sm:py-28 bg-[#101C35] border-b border-[#E8E0D5]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="space-y-3 max-w-xl">
              <h2 className="text-xs uppercase font-extrabold tracking-widest text-[#C83C50]">
                Structured JLPT Framework
              </h2>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-[#FFFFFF]">
                A Clear Path From N5 to N1
              </h3>
              <p className="text-sm text-[#E8E0D5]/80">
                The Japanese-Language Proficiency Test (JLPT) is the global benchmark for Japanese competence. NihongoSetu guides you through every benchmark.
              </p>
            </div>
            <Link
              href="/jlpt"
              className="text-sm font-semibold text-[#C83C50] hover:text-[#FFFFFF] transition-colors flex items-center space-x-1.5"
            >
              <span>View Detailed Curriculum</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { level: "N5", name: "Beginner", vocab: "800 words", kanji: "80 kanji", desc: "Basic phrases, everyday greetings, hiragana, katakana, and elementary sentence structures." },
              { level: "N4", name: "Elementary", vocab: "1,500 words", kanji: "166 kanji", desc: "Daily conversation, family, shopping, work, and essential compound grammar points." },
              { level: "N3", name: "Intermediate", vocab: "3,750 words", kanji: "367 kanji", desc: "Bridge to natural Japanese: short newspaper articles, conversational fluency, and workplace communication." },
              { level: "N2", name: "Pre-Advanced", vocab: "6,000 words", kanji: "367 kanji", desc: "Professional and academic competency: reading general essays, news commentary, and business meetings." },
              { level: "N1", name: "Advanced", vocab: "10,000 words", kanji: "1,097 kanji", desc: "Complete native-level mastery across complex prose, nuanced arguments, and high-level technical Japanese." },
            ].map((item) => (
              <div
                key={item.level}
                className="p-6 rounded-2xl bg-[#FFFFFF]/5 border border-[#E8E0D5]/15 hover:border-[#C83C50] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-black text-[#C83C50]">{item.level}</span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#E8E0D5]/10 text-[#E8E0D5]">
                      {item.name}
                    </span>
                  </div>
                  <div className="text-xs space-y-1 mb-4 text-[#E8E0D5]/70">
                    <p>📚 {item.vocab}</p>
                    <p>字 {item.kanji}</p>
                  </div>
                  <p className="text-xs text-[#E8E0D5]/80 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <Link
                  href={`/jlpt#${item.level.toLowerCase()}`}
                  className="mt-6 text-xs font-semibold text-[#FFFFFF] hover:text-[#C83C50] transition-colors flex items-center justify-between pt-3 border-t border-[#E8E0D5]/10"
                >
                  <span>Explore {item.level}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Multilingual Bridge Feature Spotlight */}
      <section className="py-20 sm:py-28 bg-[#101C35] border-b border-[#E8E0D5]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-br from-[#E8E0D5]/10 to-[#E8E0D5]/5 border border-[#E8E0D5]/20 p-8 sm:p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="max-w-xl space-y-5">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#C83C50]/20 text-xs font-bold text-[#FFFFFF]">
                <Languages className="w-3.5 h-3.5 text-[#C83C50]" />
                <span>Zero Language Barrier</span>
              </div>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-[#FFFFFF]">
                Learn Japanese in Your Native Language
              </h3>
              <p className="text-sm sm:text-base text-[#E8E0D5]/80 leading-relaxed">
                Most platforms force students to learn Japanese strictly via English explanations. NihongoSetu breaks this limitation by delivering full vocabulary meanings, audio prompts, and grammatical explanations in 12 major Indian and international languages.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {["English", "தமிழ் (Tamil)", "हिन्दी (Hindi)", "తెలుగు (Telugu)", "മലയാളം (Malayalam)", "ಕನ್ನಡ (Kannada)", "বাংলা (Bengali)", "मराठी (Marathi)", "Tagalog", "العربية (Arabic)", "Français", "Español"].map((lang) => (
                  <span
                    key={lang}
                    className="text-xs px-3 py-1 rounded-lg bg-[#101C35] text-[#E8E0D5] border border-[#E8E0D5]/20 font-medium"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            <div className="w-full lg:w-96 rounded-2xl bg-[#101C35] border border-[#E8E0D5]/20 p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E8E0D5]/15">
                <span className="text-xs font-bold text-[#C83C50]">Example Multi-Lingual Lookup</span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-[#E8E0D5]/10 text-[#E8E0D5]">JLPT N5</span>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-[#FFFFFF] font-japanese">友達</p>
                <p className="text-sm text-[#E8E0D5]/70 font-mono">ともだち · tomodachi</p>
              </div>
              <div className="space-y-1.5 text-xs">
                <p className="text-[#E8E0D5]"><span className="text-[#E8E0D5]/60">English:</span> friend</p>
                <p className="text-[#E8E0D5]"><span className="text-[#E8E0D5]/60">Tamil:</span> நண்பன் / தோழன்</p>
                <p className="text-[#E8E0D5]"><span className="text-[#E8E0D5]/60">Hindi:</span> दोस्त / मित्र</p>
                <p className="text-[#E8E0D5]"><span className="text-[#E8E0D5]/60">Telugu:</span> స్నేహితుడు</p>
              </div>
              <div className="pt-2 border-t border-[#E8E0D5]/15 text-[11px] text-[#E8E0D5]/70 italic">
                &ldquo;友達と話します。 / I talk with a friend.&rdquo;
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#101C35] text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-[#C83C50] flex items-center justify-center font-bold text-3xl text-[#FFFFFF] mx-auto shadow-2xl shadow-[#C83C50]/30">
            節
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-[#FFFFFF]">
            Begin Your Japanese Journey Today
          </h2>
          <p className="text-base sm:text-lg text-[#E8E0D5]/80 max-w-xl mx-auto">
            Join NihongoSetu to build solid foundations in Kana, Kanji, and Grammar. No credit cards or subscriptions required for our complete core learning materials.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/portal"
              className="px-8 py-3.5 rounded-xl bg-[#C83C50] hover:bg-[#B03244] text-[#FFFFFF] font-bold text-base shadow-xl shadow-[#C83C50]/30 transition-all flex items-center space-x-2"
            >
              <span>Access Student Portal</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/features"
              className="px-8 py-3.5 rounded-xl bg-[#E8E0D5]/10 hover:bg-[#E8E0D5]/20 text-[#FFFFFF] font-semibold text-base border border-[#E8E0D5]/20 transition-all"
            >
              <span>See All Platform Features</span>
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
