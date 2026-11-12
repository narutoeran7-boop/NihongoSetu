"use client";

import { queueSyncItem } from "@/lib/storage/offline";

export interface StudentProfile {
  name: string;
  email: string;
  role: "student" | "admin";
  targetLevel: string;
  nativeLanguage: string;
  streak: number;
  lastActive: string;
  learnedKanji: string[];
  learnedVocab: string[];
  mockScores: {
    level: string;
    score: number;
    total: number;
    percentage: number;
    passed: boolean;
    date: string;
  }[];
  notes?: Record<string, string>;
  isDemo?: boolean;
}

export interface PrototypeState {
  lang: string;
  theme: string;
  streak: number;
  last: string;
  mocks: Record<string, { score: number; total: number; date: string }>;
  best: number;
}

export const DEFAULT_PROFILE: StudentProfile = {
  name: "Sakura Tanaka",
  email: "student@nihongosetu.org",
  role: "student",
  targetLevel: "N5",
  nativeLanguage: "en",
  streak: 3,
  lastActive: new Date().toISOString(),
  learnedKanji: ["日", "一", "国", "会", "人", "年", "大"],
  learnedVocab: ["わたし", "あなた", "にほんご", "せんせい", "がくせい", "はい", "いいえ"],
  mockScores: [
    {
      level: "N5",
      score: 18,
      total: 20,
      percentage: 90,
      passed: true,
      date: new Date(Date.now() - 86400000).toISOString(),
    },
  ],
  notes: {},
  isDemo: false,
};

export const DEMO_PROFILE: StudentProfile = {
  name: "Kenji Sato (Demo Student)",
  email: "demo.student@nihongosetu.org",
  role: "student",
  targetLevel: "N5",
  nativeLanguage: "en",
  streak: 5,
  lastActive: new Date().toISOString(),
  learnedKanji: ["日", "一", "国", "会", "人", "年", "大", "十", "二", "本", "中", "長", "出", "三"],
  learnedVocab: ["わたし", "あなた", "にほんご", "せんせい", "がくせい", "はい", "いいえ", "ありがとう", "おはよう", "さようなら"],
  mockScores: [
    {
      level: "N5",
      score: 19,
      total: 20,
      percentage: 95,
      passed: true,
      date: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      level: "N5",
      score: 16,
      total: 20,
      percentage: 80,
      passed: true,
      date: new Date(Date.now() - 172800000).toISOString(),
    },
  ],
  notes: {},
  isDemo: true,
};

export function getStudentProfile(): StudentProfile {
  if (typeof window === "undefined") return DEFAULT_PROFILE;
  try {
    const raw = localStorage.getItem("nihongo_user");
    if (!raw) {
      localStorage.setItem("nihongo_user", JSON.stringify(DEFAULT_PROFILE));
      return DEFAULT_PROFILE;
    }
    const parsed = JSON.parse(raw);
    const base = parsed.isDemo || parsed.email?.includes("demo") ? DEMO_PROFILE : DEFAULT_PROFILE;
    return { ...base, ...parsed };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveStudentProfile(profile: StudentProfile): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("nihongo_user", JSON.stringify(profile));
    // Also sync to legacy prototype state "ns"
    const ns: PrototypeState = {
      lang: profile.nativeLanguage || "en",
      theme: "",
      streak: profile.streak || 0,
      last: new Date().toISOString().split("T")[0],
      mocks: {},
      best: profile.mockScores.length > 0 ? Math.max(...profile.mockScores.map((m) => m.percentage)) : 0,
    };
    profile.mockScores.forEach((m) => {
      ns.mocks[m.level] = { score: m.score, total: m.total, date: m.date };
    });
    localStorage.setItem("ns", JSON.stringify(ns));

    // Demo accounts are strictly isolated: NEVER queue sync items to remote Firestore
    if (profile.isDemo || profile.email === "demo.student@nihongosetu.org" || profile.email?.includes("demo")) {
      return;
    }

    // Queue for background synchronization for registered users
    queueSyncItem("users", "update", profile.email || "student", {
      name: profile.name,
      targetLevel: profile.targetLevel,
      nativeLanguage: profile.nativeLanguage,
      streak: profile.streak,
      lastActive: profile.lastActive,
      learnedKanjiCount: profile.learnedKanji.length,
      learnedVocabCount: profile.learnedVocab.length,
    });
  } catch (err) {
    console.error("Failed to persist student profile:", err);
  }
}

export function recordStudyActivity(): StudentProfile {
  const profile = getStudentProfile();
  const today = new Date().toISOString().split("T")[0];
  const lastDate = profile.lastActive ? profile.lastActive.split("T")[0] : "";

  if (lastDate !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    if (lastDate === yesterday) {
      profile.streak = (profile.streak || 0) + 1;
    } else if (!lastDate) {
      profile.streak = 1;
    } else {
      // missed a day
      profile.streak = 1;
    }
    profile.lastActive = new Date().toISOString();
    saveStudentProfile(profile);
  }

  return profile;
}

export function toggleLearnedKanji(kanji: string): boolean {
  const profile = getStudentProfile();
  const list = new Set(profile.learnedKanji || []);
  let isNowLearned = false;
  if (list.has(kanji)) {
    list.delete(kanji);
    isNowLearned = false;
  } else {
    list.add(kanji);
    isNowLearned = true;
  }
  profile.learnedKanji = Array.from(list);
  saveStudentProfile(profile);
  return isNowLearned;
}

export function toggleLearnedVocab(term: string): boolean {
  const profile = getStudentProfile();
  const list = new Set(profile.learnedVocab || []);
  let isNowLearned = false;
  if (list.has(term)) {
    list.delete(term);
    isNowLearned = false;
  } else {
    list.add(term);
    isNowLearned = true;
  }
  profile.learnedVocab = Array.from(list);
  saveStudentProfile(profile);
  return isNowLearned;
}

export function saveMockExamResult(
  level: string,
  score: number,
  total: number,
  signature?: string
): { passed: boolean; percentage: number } {
  const profile = getStudentProfile();
  const percentage = Math.round((score / total) * 100);
  const passed = percentage >= 70;
  const examDate = new Date().toISOString();

  profile.mockScores.unshift({
    level,
    score,
    total,
    percentage,
    passed,
    date: examDate,
  });

  saveStudentProfile(profile);

  // Secure sync queuing: only queue if server signature is attached and not a demo account
  if (signature && !profile.isDemo && !profile.email?.includes("demo")) {
    queueSyncItem("mockScores", "create", `exam-${level}-${Date.now()}`, {
      level,
      score,
      total,
      percentage,
      passed,
      signature,
      date: examDate,
    });
  }

  return { passed, percentage };
}
