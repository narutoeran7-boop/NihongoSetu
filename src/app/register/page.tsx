"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Globe, Award, ArrowRight, CheckCircle2 } from "lucide-react";
import PublicNavbar from "@/components/public/Navbar";
import PublicFooter from "@/components/public/Footer";
import { firebaseRegister } from "@/lib/firebase/authService";
import { isFirebaseConfigured } from "@/lib/firebase/config";

const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English" },
  { code: "ta", name: "தமிழ் (Tamil)" },
  { code: "hi", name: "हिन्दी (Hindi)" },
  { code: "te", name: "తెలుగు (Telugu)" },
  { code: "ml", name: "മലയാളം (Malayalam)" },
  { code: "kn", name: "ಕನ್ನಡ (Kannada)" },
  { code: "bn", name: "বাংলা (Bengali)" },
  { code: "mr", name: "मराठी (Marathi)" },
  { code: "tl", name: "Tagalog (Filipino)" },
  { code: "ar", name: "العربية (Arabic)" },
  { code: "fr", name: "Français (French)" },
  { code: "es", name: "Español (Spanish)" },
];

const JLPT_LEVELS = [
  { code: "N5", label: "N5 — Beginner (Basic Kana & Phrases)" },
  { code: "N4", label: "N4 — Elementary (Daily Conversations)" },
  { code: "N3", label: "N3 — Intermediate (Bridge to Fluency)" },
  { code: "N2", label: "N2 — Upper-Intermediate (Business Ready)" },
  { code: "N1", label: "N1 — Advanced (Native Equivalence)" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nativeLanguage, setNativeLanguage] = useState("en");
  const [targetLevel, setTargetLevel] = useState("N5");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (!agreeTerms) {
      setError("Please agree to the Terms of Service & Privacy Policy.");
      return;
    }

    setIsLoading(true);

    if (isFirebaseConfigured()) {
      const res = await firebaseRegister(email, password, fullName.trim());
      if (!res.success) {
        setError(res.error || "Registration failed. Please try again.");
        setIsLoading(false);
        return;
      }

      const logged = res.user!;
      const newUser = {
        name: logged.displayName || fullName.trim() || "Japanese Learner",
        email: logged.email,
        role: "student" as const,
        targetLevel,
        nativeLanguage,
        createdAt: new Date().toISOString(),
        streak: 1,
        lastActive: new Date().toISOString(),
        learnedKanji: 0,
        learnedVocab: 0,
        mockScores: [],
      };

      try {
        localStorage.setItem("nihongo_user", JSON.stringify(newUser));
        if (typeof document !== "undefined") {
          document.cookie = `nihongo_session=${encodeURIComponent(JSON.stringify({
            name: newUser.name,
            email: newUser.email,
            role: "student",
          }))}; path=/; SameSite=Lax; max-age=604800`;
        }
      } catch {
        // ignore storage error
      }

      setIsLoading(false);
      router.push("/portal");
      return;
    }

    // Local / Server fallback registration
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
          name: fullName.trim(),
          role: "student",
          targetLevel,
          nativeLanguage,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        setError(data.error || "Registration failed. Please try again.");
        setIsLoading(false);
        return;
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("nihongo_user", JSON.stringify(data.user));
      }

      window.location.href = data.redirect || "/portal";
    } catch {
      setError("Registration service unavailable. Please check your network connection.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#101C35] text-[#FFFFFF]">
      <PublicNavbar />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-lg space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#C83C50] text-[#FFFFFF] shadow-xl shadow-[#C83C50]/20 font-bold text-2xl mb-2">
              架
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#FFFFFF]">
              Begin Your Japanese Journey
            </h1>
            <p className="text-sm text-[#E8E0D5]/70">
              Create your student profile and personalize your 12-language learning path.
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-[#101C35] border border-[#E8E0D5]/20 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
            {error && (
              <div className="p-3.5 rounded-xl bg-[#C83C50]/15 border border-[#C83C50]/40 text-xs text-[#FFFFFF] flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-[#C83C50]" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-medium text-[#E8E0D5] mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#E8E0D5]/50" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Arun Kumar / Kenji Sato"
                    className="w-full bg-[#101C35] border border-[#E8E0D5]/25 rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#FFFFFF] placeholder-[#E8E0D5]/40 focus:outline-none focus:border-[#C83C50] focus:ring-1 focus:ring-[#C83C50] transition-colors"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-[#E8E0D5] mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#E8E0D5]/50" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@example.com"
                    className="w-full bg-[#101C35] border border-[#E8E0D5]/25 rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#FFFFFF] placeholder-[#E8E0D5]/40 focus:outline-none focus:border-[#C83C50] focus:ring-1 focus:ring-[#C83C50] transition-colors"
                  />
                </div>
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#E8E0D5] mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#E8E0D5]/50" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#101C35] border border-[#E8E0D5]/25 rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#FFFFFF] placeholder-[#E8E0D5]/40 focus:outline-none focus:border-[#C83C50] focus:ring-1 focus:ring-[#C83C50] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#E8E0D5] mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#E8E0D5]/50" />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#101C35] border border-[#E8E0D5]/25 rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#FFFFFF] placeholder-[#E8E0D5]/40 focus:outline-none focus:border-[#C83C50] focus:ring-1 focus:ring-[#C83C50] transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Native Language & Target Level Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#E8E0D5] mb-1.5 flex items-center space-x-1.5">
                    <Globe className="w-3.5 h-3.5 text-[#C83C50]" />
                    <span>Native Language</span>
                  </label>
                  <select
                    value={nativeLanguage}
                    onChange={(e) => setNativeLanguage(e.target.value)}
                    className="w-full bg-[#101C35] border border-[#E8E0D5]/25 rounded-xl px-3 py-2.5 text-sm text-[#FFFFFF] focus:outline-none focus:border-[#C83C50] transition-colors"
                  >
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <option key={lang.code} value={lang.code} className="bg-[#101C35] text-[#FFFFFF]">
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#E8E0D5] mb-1.5 flex items-center space-x-1.5">
                    <Award className="w-3.5 h-3.5 text-[#C83C50]" />
                    <span>Target JLPT Level</span>
                  </label>
                  <select
                    value={targetLevel}
                    onChange={(e) => setTargetLevel(e.target.value)}
                    className="w-full bg-[#101C35] border border-[#E8E0D5]/25 rounded-xl px-3 py-2.5 text-sm text-[#FFFFFF] focus:outline-none focus:border-[#C83C50] transition-colors"
                  >
                    {JLPT_LEVELS.map((lvl) => (
                      <option key={lvl.code} value={lvl.code} className="bg-[#101C35] text-[#FFFFFF]">
                        {lvl.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Agreement */}
              <div className="pt-2">
                <label className="flex items-start space-x-2 text-xs text-[#E8E0D5]/80 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 rounded bg-[#101C35] border-[#E8E0D5]/30 text-[#C83C50] focus:ring-[#C83C50]"
                  />
                  <span>
                    I agree to the{" "}
                    <Link href="/terms" className="text-[#FFFFFF] underline hover:text-[#C83C50]">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-[#FFFFFF] underline hover:text-[#C83C50]">
                      Privacy Policy
                    </Link>
                    .
                  </span>
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-4 py-3 px-4 rounded-xl bg-[#C83C50] text-[#FFFFFF] font-semibold text-sm shadow-lg shadow-[#C83C50]/25 hover:bg-[#C83C50]/90 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <span>{isLoading ? "Creating Account..." : "Create Free Student Account"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Login Link */}
          <div className="text-center text-xs text-[#E8E0D5]/70 flex items-center justify-center space-x-1.5">
            <span>Already have an account?</span>
            <Link
              href="/login"
              className="text-[#FFFFFF] font-semibold underline underline-offset-4 hover:text-[#C83C50] transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
