"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Lock, Mail, ArrowRight, ShieldCheck, UserCheck, Eye, EyeOff, Sparkles, AlertCircle, CheckCircle } from "lucide-react";
import PublicNavbar from "@/components/public/Navbar";
import PublicFooter from "@/components/public/Footer";
import { firebaseLogin } from "@/lib/firebase/authService";
import { isFirebaseConfigured } from "@/lib/firebase/config";

export default function LoginPage() {
  const [role, setRole] = useState<"student" | "admin">("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfoMessage(null);

    const trimmedEmail = (email || "").trim();
    if (!trimmedEmail) {
      setError("Please enter your email address.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setIsLoading(true);

    try {
      // 1. If Firebase is explicitly configured and not an internal demo address, attempt Firebase Auth
      if (isFirebaseConfigured() && !trimmedEmail.endsWith("@nihongosetu.org")) {
        const res = await firebaseLogin(trimmedEmail, password);
        if (!res.success) {
          setError(res.error || "Authentication failed. Please check your credentials.");
          setIsLoading(false);
          return;
        }

        const logged = res.user!;
        const sessionPayload = {
          name: logged.displayName || trimmedEmail.split("@")[0],
          email: logged.email,
          role: logged.role,
          targetLevel: "N5",
          nativeLanguage: "en",
          loggedInAt: new Date().toISOString(),
        };

        try {
          localStorage.setItem("nihongo_user", JSON.stringify(sessionPayload));
          if (typeof document !== "undefined") {
            document.cookie = `nihongo_session=${encodeURIComponent(JSON.stringify(sessionPayload))}; path=/; SameSite=Lax; max-age=604800`;
          }
        } catch {
          // ignore storage error
        }

        setIsLoading(false);
        window.location.href = logged.role === "admin" ? "/admin" : "/portal";
        return;
      }

      // 2. Authenticate through the server-side API endpoint
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail, password, role }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || "Invalid email or password. Please verify your credentials.");
        setIsLoading(false);
        return;
      }

      // Persist session to local storage for immediate client state sync
      if (typeof window !== "undefined") {
        localStorage.setItem("nihongo_user", JSON.stringify(data.user));
      }

      setInfoMessage(`Authenticated as ${data.user?.name || "Student"}. Redirecting...`);

      // Use full window navigation to guarantee the browser loads fresh server cookies
      window.location.href = data.redirect || (role === "admin" ? "/admin" : "/portal");
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Authentication service error. Please try again.";
      setError(errMsg);
      setIsLoading(false);
    }
  };

  /**
   * 1-Click Instant Demo Authentication
   * Creates an active demo session immediately without requiring typing credentials or registration.
   */
  const handleInstantDemo = async (demoRole: "student" | "admin") => {
    setError(null);
    setInfoMessage(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: demoRole }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Failed to initialize demo session. Please try again.");
        setIsLoading(false);
        return;
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("nihongo_user", JSON.stringify(data.user));
      }

      setInfoMessage(`Entering Demo Mode as ${data.user?.name}...`);
      window.location.href = data.redirect || (demoRole === "admin" ? "/admin" : "/portal");
    } catch {
      setError("Unable to connect to demo authentication service. Please check your network.");
      setIsLoading(false);
    }
  };

  /**
   * Pre-fill the form inputs for manual credential testing
   */
  const handleFillCredentials = (demoType: "student" | "admin") => {
    setError(null);
    setInfoMessage(null);
    if (demoType === "admin") {
      setEmail("admin@nihongosetu.org");
      setPassword("Sensei@2026!Admin");
      setRole("admin");
    } else {
      setEmail("student@nihongosetu.org");
      setPassword("Sakura@2026!JLPT");
      setRole("student");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#101C35] text-[#FFFFFF]">
      <PublicNavbar />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#C83C50] text-[#FFFFFF] shadow-xl shadow-[#C83C50]/20 font-bold text-2xl mb-2">
              節
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#FFFFFF]">
              Welcome to NihongoSetu
            </h1>
            <p className="text-sm text-[#E8E0D5]/70">
              {role === "admin"
                ? "Sign in to administrator command center"
                : "Sign in to access your JLPT learning studio & streak tracker"}
            </p>
          </div>

          {/* Role Segmented Switcher */}
          <div className="bg-[#101C35] p-1.5 rounded-xl border border-[#E8E0D5]/20 flex items-center">
            <button
              type="button"
              onClick={() => {
                setRole("student");
                setError(null);
              }}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center space-x-2 transition-all ${
                role === "student"
                  ? "bg-[#C83C50] text-[#FFFFFF] shadow"
                  : "text-[#E8E0D5]/70 hover:text-[#FFFFFF]"
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Student Portal</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setRole("admin");
                setError(null);
              }}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center space-x-2 transition-all ${
                role === "admin"
                  ? "bg-[#C83C50] text-[#FFFFFF] shadow"
                  : "text-[#E8E0D5]/70 hover:text-[#FFFFFF]"
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Portal</span>
            </button>
          </div>

          {/* 1-Click Instant Demo Access Box */}
          <div className="p-4 rounded-2xl bg-[#E8E0D5]/5 border border-[#E8E0D5]/15 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#E8E0D5] font-semibold flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-[#C83C50]" />
                <span>1-Click Instant Demo (No Registration)</span>
              </span>
              <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Ready
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                id="btn-student-demo"
                onClick={() => handleInstantDemo("student")}
                disabled={isLoading}
                className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#C83C50] to-[#E05A47] hover:from-[#b53547] hover:to-[#ce4f3d] text-white font-bold text-xs shadow-md shadow-[#C83C50]/20 flex items-center justify-center space-x-1.5 transition-all disabled:opacity-50"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Student Demo</span>
              </button>
              <button
                type="button"
                id="btn-admin-demo"
                onClick={() => handleInstantDemo("admin")}
                disabled={isLoading}
                className="py-2.5 px-3 rounded-xl bg-[#E8E0D5]/10 hover:bg-[#E8E0D5]/20 text-[#E8E0D5] font-semibold text-xs border border-[#E8E0D5]/20 flex items-center justify-center space-x-1.5 transition-all disabled:opacity-50"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Demo</span>
              </button>
            </div>
            <div className="flex items-center justify-between pt-1 text-[11px] text-[#E8E0D5]/60 border-t border-[#E8E0D5]/10">
              <span>Or pre-fill form credentials:</span>
              <div className="space-x-2">
                <button
                  type="button"
                  onClick={() => handleFillCredentials("student")}
                  className="text-emerald-400 hover:underline font-medium"
                >
                  Fill Student
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => handleFillCredentials("admin")}
                  className="text-amber-400 hover:underline font-medium"
                >
                  Fill Admin
                </button>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-[#101C35] border border-[#E8E0D5]/20 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
            {error && (
              <div
                id="login-error-banner"
                className="p-3.5 rounded-xl bg-[#C83C50]/15 border border-[#C83C50]/40 text-xs text-[#FFFFFF] flex items-center space-x-2.5"
              >
                <AlertCircle className="w-4 h-4 text-[#C83C50] shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {infoMessage && (
              <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-xs text-[#FFFFFF] flex items-center space-x-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{infoMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-[#E8E0D5] mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#E8E0D5]/50" />
                  <input
                    type="email"
                    id="input-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={role === "admin" ? "admin@nihongosetu.org" : "student@nihongosetu.org"}
                    className="w-full bg-[#101C35] border border-[#E8E0D5]/25 rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#FFFFFF] placeholder-[#E8E0D5]/40 focus:outline-none focus:border-[#C83C50] focus:ring-1 focus:ring-[#C83C50] transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-medium text-[#E8E0D5]">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-[#E8E0D5]/70 hover:text-[#C83C50] transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#E8E0D5]/50" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="input-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#101C35] border border-[#E8E0D5]/25 rounded-xl pl-10 pr-10 py-2.5 text-sm text-[#FFFFFF] placeholder-[#E8E0D5]/40 focus:outline-none focus:border-[#C83C50] focus:ring-1 focus:ring-[#C83C50] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#E8E0D5]/50 hover:text-[#FFFFFF]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 text-xs text-[#E8E0D5]/80 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded bg-[#101C35] border-[#E8E0D5]/30 text-[#C83C50] focus:ring-[#C83C50]"
                  />
                  <span>Remember my credentials</span>
                </label>
              </div>

              <button
                type="submit"
                id="btn-login-submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-[#C83C50] text-[#FFFFFF] font-semibold text-sm shadow-lg shadow-[#C83C50]/25 hover:bg-[#C83C50]/90 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <span>
                  {isLoading
                    ? "Authenticating..."
                    : role === "admin"
                    ? "Access Admin Command"
                    : "Enter Learning Portal"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Registration link */}
          <p className="text-center text-xs text-[#E8E0D5]/70">
            Don&apos;t have a student account yet?{" "}
            <Link
              href="/register"
              className="text-[#FFFFFF] font-semibold underline underline-offset-4 hover:text-[#C83C50] transition-colors"
            >
              Register for free
            </Link>
          </p>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
