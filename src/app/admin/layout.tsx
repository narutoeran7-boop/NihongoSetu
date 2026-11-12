"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ShieldAlert,
  Users,
  BookOpen,
  Layers,
  Sparkles,
  BookMarked,
  FileCheck2,
  Globe,
  FileText,
  Settings,
  LogOut,
  ChevronRight,
  Menu,
  X,
  GraduationCap,
  Activity,
  CheckCircle2,
} from "lucide-react";
import { firebaseLogout } from "@/lib/firebase/authService";

const ADMIN_NAV = [
  { href: "/admin", label: "Dashboard", icon: Activity },
  { href: "/admin/students", label: "Students & Devices", icon: Users },
  { href: "/admin/courses", label: "Courses & Curricula", icon: BookOpen },
  { href: "/admin/content/vocab", label: "Vocabulary CMS", icon: Layers },
  { href: "/admin/content/kanji", label: "Kanji Database", icon: Sparkles },
  { href: "/admin/content/grammar", label: "Grammar Decks", icon: BookMarked },
  { href: "/admin/exams", label: "Exam Question Bank", icon: FileCheck2 },
  { href: "/admin/translations", label: "12-Language CMS", icon: Globe },
  { href: "/admin/audit-logs", label: "Security Audit Logs", icon: FileText },
  { href: "/admin/settings", label: "Platform & RBAC", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
      await firebaseLogout().catch(() => {});
      localStorage.removeItem("nihongo_user");
      if (typeof document !== "undefined") {
        document.cookie = "nihongo_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
      }
    } catch {
      // ignore
    }
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-[#0B1323] text-[#FFFFFF] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-[#101C35] border-r border-[#E8E0D5]/15 shrink-0 select-none">
        {/* Header */}
        <div className="h-20 flex items-center px-6 border-b border-[#E8E0D5]/15">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#C83C50] flex items-center justify-center font-bold text-xl text-[#FFFFFF] shadow-lg shadow-[#C83C50]/20">
              統
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-black tracking-tight text-[#FFFFFF]">
                  NihongoSetu
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
                  ADMIN
                </span>
              </div>
              <p className="text-[10px] text-[#E8E0D5]/60 font-medium">Command & Governance</p>
            </div>
          </Link>
        </div>

        {/* Status Pill */}
        <div className="px-4 py-2.5 mx-4 mt-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs">
          <span className="text-emerald-400 font-bold flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Node 24 Active</span>
          </span>
          <span className="text-[10px] text-[#E8E0D5]/60">RBAC Level 1</span>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {ADMIN_NAV.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? "bg-[#C83C50] text-[#FFFFFF] font-bold shadow-md shadow-[#C83C50]/20"
                    : "text-[#E8E0D5]/70 hover:text-[#FFFFFF] hover:bg-[#E8E0D5]/10"
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-[#FFFFFF]" : "text-[#E8E0D5]/60"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Switch to Student Portal */}
        <div className="p-4 border-t border-[#E8E0D5]/15 space-y-2">
          <Link
            href="/portal"
            className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl bg-[#E8E0D5]/10 hover:bg-[#E8E0D5]/20 text-[#E8E0D5] text-xs font-semibold transition-colors"
          >
            <div className="flex items-center space-x-2">
              <GraduationCap className="w-4 h-4 text-[#C83C50]" />
              <span>Switch to Student View</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          </Link>
          <div className="text-[10px] text-[#E8E0D5]/40 text-center">
            NihongoSetu Enterprise Admin
          </div>
        </div>
      </aside>

      {/* Main Column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-20 bg-[#101C35]/95 backdrop-blur-md border-b border-[#E8E0D5]/15 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-40">
          <div className="flex items-center space-x-3 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-lg text-[#E8E0D5] hover:bg-[#E8E0D5]/10"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-bold text-sm text-[#FFFFFF]">Admin Command</span>
          </div>

          <div className="hidden lg:flex items-center space-x-3">
            <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-[#E8E0D5]/5 border border-[#E8E0D5]/15 text-xs text-[#E8E0D5]/80">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>All Microservices Operational</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-400 font-bold text-xs flex items-center justify-center">
                AD
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-[#FFFFFF]">Master Sensei</div>
                <div className="text-[10px] text-[#E8E0D5]/60">admin@nihongosetu.org</div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-16">
          {children}
        </main>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-72 bg-[#101C35] border-r border-[#E8E0D5]/20 h-full flex flex-col p-4 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E0D5]/15 mb-2">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-[#C83C50] text-[#FFFFFF] font-bold text-sm flex items-center justify-center">
                  統
                </div>
                <span className="font-extrabold text-base text-[#FFFFFF]">Admin Command</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-lg text-[#E8E0D5] hover:bg-[#E8E0D5]/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto">
              {ADMIN_NAV.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium ${
                      isActive
                        ? "bg-[#C83C50] text-[#FFFFFF] font-bold"
                        : "text-[#E8E0D5]/80 hover:bg-[#E8E0D5]/10"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
