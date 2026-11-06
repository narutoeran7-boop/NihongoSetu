import React from "react";
import Link from "next/link";
import PublicNavbar from "@/components/public/Navbar";
import PublicFooter from "@/components/public/Footer";
import {
  PenTool,
  BookOpen,
  Headphones,
  Award,
  Languages,
  Bot,
  Video,
  Database,
  Flame,
  ArrowRight,
  Sparkles
} from "lucide-react";

export default function FeaturesPage() {
  const features = [
    {
      icon: PenTool,
      title: "Japanese Script & Stroke Order Canvas",
      badge: "Japanese Script",
      description: "Master all 46 basic characters, dakuon, handakuon, and yōon for both Hiragana and Katakana. Draw directly onto an interactive high-DPI canvas with authentic stroke guides and numbered starting points.",
      link: "/portal/kana"
    },
    {
      icon: Languages,
      title: "12-Language Native Translation Engine",
      badge: "Multilingual",
      description: "Study Japanese vocabulary through your mother tongue. Includes full definitions and phonetic aids for English, Tamil, Hindi, Telugu, Malayalam, Kannada, Bengali, Marathi, Tagalog, Arabic, French, and Spanish.",
      link: "/portal/vocab"
    },
    {
      icon: BookOpen,
      title: "Comprehensive Kanji Vault (1,097 Characters)",
      badge: "Joyo Curriculum",
      description: "Explore all Joyo and JLPT kanji with Onyomi (Chinese readings), Kunyomi (Japanese readings), radical meanings, stroke counts, and verified compound vocabulary words.",
      link: "/portal/kanji"
    },
    {
      icon: Award,
      title: "JLPT Mock Examination Simulator",
      badge: "Exam Prep",
      description: "Official-style practice papers for N5 through N1. Features randomized question pools, a 20-question test format, real-time scoring, passing threshold indicators (70%+), and detailed explanations.",
      link: "/portal/jlpt"
    },
    {
      icon: Headphones,
      title: "Audio Comprehension & Listening Studio",
      badge: "Listening",
      description: "High-frequency native Japanese conversational phrases with variable speed controls (1.0x normal, 0.75x slow speed), toggleable hidden Japanese transcripts, and comprehension questions.",
      link: "/portal/listening"
    },
    {
      icon: Bot,
      title: "AI Sensei Personalized Tutor",
      badge: "AI Powered",
      description: "Integrated AI Japanese tutor specifically configured to assist learners with particle nuances, grammatical formations, contextual corrections, and culture-specific etiquette queries.",
      link: "/portal/sensei"
    },
    {
      icon: Video,
      title: "Curated JLPT Video Academy",
      badge: "Video Lessons",
      description: "Organized multi-level YouTube video playlists covering grammar lectures, listening drills, and exam-solving techniques categorized by level from N5 to N1.",
      link: "/portal/videos"
    },
    {
      icon: Database,
      title: "Offline-First Data Storage & Sync",
      badge: "Local-First",
      description: "Never lose study progress to spotty internet connections. All student bookmarks, quiz streaks, and exam results save locally to browser storage with seamless JSON backup and restore.",
      link: "/portal/settings"
    },
    {
      icon: Flame,
      title: "Streak Tracking & Study Analytics",
      badge: "Gamified Study",
      description: "Daily study streak tracking, best quiz score tracking, and visual JLPT progress bars to maintain learning momentum and habit formation.",
      link: "/portal"
    }
  ];

  return (
    <div className="min-h-screen bg-[#101C35] text-[#FFFFFF] flex flex-col font-sans">
      <PublicNavbar />

      <main className="flex-1 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#C83C50]/15 border border-[#C83C50]/30 text-xs font-semibold text-[#FFFFFF]">
              <Sparkles className="w-3.5 h-3.5 text-[#C83C50]" />
              <span>Full Capability Suite · 機能一覧</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-[#FFFFFF] tracking-tight">
              Platform Features & Learning Modules
            </h1>
            <p className="text-base sm:text-lg text-[#E8E0D5]/80 font-light leading-relaxed">
              Explore the dedicated tools engineered inside NihongoSetu to take you from your very first Hiragana stroke all the way to advanced JLPT N1 reading comprehension.
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="p-8 rounded-2xl bg-[#FFFFFF]/5 border border-[#E8E0D5]/15 hover:border-[#C83C50] transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-[#C83C50]/15 border border-[#C83C50]/30 flex items-center justify-center text-[#C83C50] group-hover:scale-110 transition-transform">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#E8E0D5]/10 text-[#E8E0D5] border border-[#E8E0D5]/20">
                        {f.badge}
                      </span>
                    </div>

                    <h2 className="text-xl font-bold text-[#FFFFFF]">{f.title}</h2>
                    <p className="text-sm text-[#E8E0D5]/80 leading-relaxed">
                      {f.description}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-[#E8E0D5]/10">
                    <Link
                      href={f.link}
                      className="text-xs font-bold text-[#C83C50] hover:text-[#FFFFFF] flex items-center space-x-1.5 transition-colors"
                    >
                      <span>Open in Student Portal</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Banner */}
          <div className="rounded-3xl bg-gradient-to-r from-[#C83C50]/20 to-[#101C35] border border-[#C83C50]/30 p-8 sm:p-12 text-center space-y-4">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#FFFFFF]">
              Ready to test your Japanese skills?
            </h3>
            <p className="text-sm sm:text-base text-[#E8E0D5]/80 max-w-xl mx-auto">
              Jump straight into our interactive practice rooms and experience the difference of a native-language guided Japanese curriculum.
            </p>
            <div className="pt-2">
              <Link
                href="/portal"
                className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-xl bg-[#C83C50] hover:bg-[#B03244] text-[#FFFFFF] font-bold shadow-xl shadow-[#C83C50]/30 transition-all"
              >
                <span>Launch Student Learning Hub</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
