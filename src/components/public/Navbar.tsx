"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Globe, User, BookOpen } from "lucide-react";
import { T } from "@/data/translations";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { SupportedLanguage } from "@/lib/i18n/translations";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/features", label: "Features" },
  { href: "/jlpt", label: "JLPT Levels" },
  { href: "/resources", label: "Resources" },
  { href: "/contact", label: "Contact" },
];

export interface LanguageOption {
  code: string;
  name: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: "en", name: "English" },
  { code: "ta", name: "தமிழ்" },
  { code: "ja", name: "日本語" },
  { code: "hi", name: "हिन्दी" },
  { code: "te", name: "తెలుగు" },
  { code: "ml", name: "മലയാളം" },
  { code: "kn", name: "ಕನ್ನಡ" },
  { code: "bn", name: "বাংলা" },
  { code: "mr", name: "मराठी" },
  { code: "tl", name: "Tagalog" },
  { code: "ar", name: "العربية" },
  { code: "fr", name: "Français" },
  { code: "es", name: "Español" },
];

export default function PublicNavbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language: activeLang, setLanguage } = useLanguage();
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const t = T[activeLang] || T.en;

  return (
    <header className="sticky top-0 z-50 bg-[#101C35]/95 backdrop-blur-md border-b border-[#E8E0D5]/15 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#C83C50] flex items-center justify-center font-bold text-xl text-[#FFFFFF] shadow-lg shadow-[#C83C50]/20 group-hover:scale-105 transition-transform">
              節
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-extrabold tracking-tight text-[#FFFFFF]">
                  NihongoSetu
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#E8E0D5]/10 text-[#E8E0D5] font-japanese font-medium border border-[#E8E0D5]/20">
                  日本語節
                </span>
              </div>
              <p className="text-[11px] text-[#E8E0D5]/70 font-medium">
                {t.tag || "Your Bridge to Japanese"}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "text-[#FFFFFF] bg-[#E8E0D5]/15 font-semibold"
                      : "text-[#E8E0D5]/80 hover:text-[#FFFFFF] hover:bg-[#E8E0D5]/10"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#E8E0D5] bg-[#E8E0D5]/10 hover:bg-[#E8E0D5]/20 border border-[#E8E0D5]/20 transition-colors"
                aria-label="Select Language"
              >
                <Globe className="w-3.5 h-3.5 text-[#C83C50]" />
                <span>{LANGUAGES.find((l) => l.code === activeLang)?.name}</span>
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-40 rounded-xl bg-[#101C35] border border-[#E8E0D5]/20 shadow-2xl py-2 z-50 max-h-64 overflow-y-auto">
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLanguage(l.code as SupportedLanguage);
                        setLangMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs transition-colors ${
                        activeLang === l.code
                          ? "bg-[#C83C50] text-[#FFFFFF] font-semibold"
                          : "text-[#E8E0D5] hover:bg-[#E8E0D5]/10"
                      }`}
                    >
                      {l.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Login Link */}
            <Link
              href="/login"
              className="text-xs font-semibold px-4 py-2 rounded-lg text-[#E8E0D5] hover:text-[#FFFFFF] hover:bg-[#E8E0D5]/10 transition-colors flex items-center space-x-1.5"
            >
              <User className="w-3.5 h-3.5" />
              <span>Login</span>
            </Link>

            {/* Portal CTA */}
            <Link
              href="/portal"
              className="text-xs font-semibold px-4 py-2 rounded-lg bg-[#C83C50] hover:bg-[#B03244] text-[#FFFFFF] shadow-md shadow-[#C83C50]/25 transition-all flex items-center space-x-1.5"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Student Portal</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-2">
            <Link
              href="/portal"
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#C83C50] text-[#FFFFFF]"
            >
              Portal
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#E8E0D5] hover:bg-[#E8E0D5]/10 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#101C35] border-b border-[#E8E0D5]/20 px-4 pt-3 pb-6 space-y-3">
          <div className="flex flex-col space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2.5 rounded-lg text-sm font-medium ${
                  pathname === link.href
                    ? "bg-[#C83C50] text-[#FFFFFF] font-bold"
                    : "text-[#E8E0D5] hover:bg-[#E8E0D5]/10"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-[#E8E0D5]/15 flex items-center justify-between">
            <select
              value={activeLang}
              onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
              className="bg-[#101C35] text-[#E8E0D5] text-xs border border-[#E8E0D5]/20 rounded-lg px-2.5 py-1.5"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.name}
                </option>
              ))}
            </select>

            <div className="flex space-x-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg text-[#E8E0D5] bg-[#E8E0D5]/10"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg text-[#FFFFFF] bg-[#C83C50]"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
