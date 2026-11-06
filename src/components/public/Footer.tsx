import React from "react";
import Link from "next/link";
import { BookOpen, Shield, HelpCircle, Heart } from "lucide-react";

export default function PublicFooter() {
  return (
    <footer className="bg-[#101C35] text-[#E8E0D5] border-t border-[#E8E0D5]/15 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-[#C83C50] flex items-center justify-center font-bold text-xl text-[#FFFFFF] shadow-lg shadow-[#C83C50]/20">
                節
              </div>
              <span className="text-2xl font-black tracking-tight text-[#FFFFFF]">
                NihongoSetu
              </span>
            </div>
            <p className="text-sm text-[#E8E0D5]/80 max-w-sm leading-relaxed">
              日本語への架け橋 — Your Bridge to Japanese. An institutional-grade Japanese learning platform designed for structured, step-by-step JLPT mastery.
            </p>
            <div className="pt-2 flex items-center space-x-2 text-xs text-[#E8E0D5]/60 font-japanese">
              <span>言語と文化の架け橋を目指して</span>
            </div>
          </div>

          {/* Learning Hub Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#FFFFFF] flex items-center space-x-1.5">
              <BookOpen className="w-4 h-4 text-[#C83C50]" />
              <span>Learning Modules</span>
            </h3>
            <ul className="space-y-2 text-sm text-[#E8E0D5]/80">
              <li>
                <Link href="/portal/kana" className="hover:text-[#FFFFFF] transition-colors">
                  Japanese Script & Writing
                </Link>
              </li>
              <li>
                <Link href="/portal/grammar" className="hover:text-[#FFFFFF] transition-colors">
                  JLPT Grammar Decks
                </Link>
              </li>
              <li>
                <Link href="/portal/vocab" className="hover:text-[#FFFFFF] transition-colors">
                  Vocabulary Vault
                </Link>
              </li>
              <li>
                <Link href="/portal/kanji" className="hover:text-[#FFFFFF] transition-colors">
                  Kanji Mastery Library
                </Link>
              </li>
              <li>
                <Link href="/portal/listening" className="hover:text-[#FFFFFF] transition-colors">
                  Listening Comprehension
                </Link>
              </li>
            </ul>
          </div>

          {/* JLPT Levels Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#FFFFFF] flex items-center space-x-1.5">
              <span>JLPT Pathways</span>
            </h3>
            <ul className="space-y-2 text-sm text-[#E8E0D5]/80">
              <li>
                <Link href="/jlpt#n5" className="hover:text-[#FFFFFF] transition-colors">
                  JLPT N5 (Beginner)
                </Link>
              </li>
              <li>
                <Link href="/jlpt#n4" className="hover:text-[#FFFFFF] transition-colors">
                  JLPT N4 (Elementary)
                </Link>
              </li>
              <li>
                <Link href="/jlpt#n3" className="hover:text-[#FFFFFF] transition-colors">
                  JLPT N3 (Intermediate)
                </Link>
              </li>
              <li>
                <Link href="/jlpt#n2" className="hover:text-[#FFFFFF] transition-colors">
                  JLPT N2 (Pre-Advanced)
                </Link>
              </li>
              <li>
                <Link href="/jlpt#n1" className="hover:text-[#FFFFFF] transition-colors">
                  JLPT N1 (Advanced)
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Help */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#FFFFFF] flex items-center space-x-1.5">
              <Shield className="w-4 h-4 text-[#C83C50]" />
              <span>Legal & Support</span>
            </h3>
            <ul className="space-y-2 text-sm text-[#E8E0D5]/80">
              <li>
                <Link href="/contact" className="hover:text-[#FFFFFF] transition-colors flex items-center space-x-1">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Contact & Support</span>
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#FFFFFF] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#FFFFFF] transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/portal" className="text-[#C83C50] hover:underline font-medium">
                  Student Sign In →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[#E8E0D5]/15 flex flex-col sm:flex-row items-center justify-between text-xs text-[#E8E0D5]/60 gap-4">
          <p>© {new Date().getFullYear()} NihongoSetu (日本語節). Dedicated to Japanese language learners worldwide.</p>
          <p className="flex items-center space-x-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-[#C83C50] fill-[#C83C50]" />
            <span>in Japanese Premium aesthetic</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
