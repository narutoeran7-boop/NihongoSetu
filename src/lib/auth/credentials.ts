import crypto from "crypto";
import fs from "fs";
import path from "path";

export interface StoredUser {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  salt: string;
  role: "student" | "admin";
  targetLevel: string;
  nativeLanguage: string;
  isDemo?: boolean;
  createdAt: string;
}

export interface UserSessionPayload {
  id: string;
  email: string;
  name: string;
  role: "student" | "admin";
  targetLevel: string;
  nativeLanguage: string;
  isDemo?: boolean;
  loggedInAt: string;
}

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, "sha256").toString("hex");
}

function generateSalt(): string {
  return crypto.randomBytes(16).toString("hex");
}

// Built-in verified seed credentials
const SEED_USERS_CONFIG = [
  {
    id: "usr_student_sakura",
    email: "student@nihongosetu.org",
    password: "Sakura@2026!JLPT",
    name: "Sakura Tanaka",
    role: "student" as const,
    targetLevel: "N5",
    nativeLanguage: "en",
    isDemo: false,
  },
  {
    id: "usr_student_arun",
    email: "arun.kumar@example.com",
    password: "Student@2026!",
    name: "Arun Kumar",
    role: "student" as const,
    targetLevel: "N5",
    nativeLanguage: "ta",
    isDemo: false,
  },
  {
    id: "usr_admin_sensei",
    email: "admin@nihongosetu.org",
    password: "Sensei@2026!Admin",
    name: "System Administrator",
    role: "admin" as const,
    targetLevel: "N1",
    nativeLanguage: "ja",
    isDemo: false,
  },
  {
    id: "usr_demo_student",
    email: "demo.student@nihongosetu.org",
    password: "DemoStudent@2026!",
    name: "Kenji Sato (Demo)",
    role: "student" as const,
    targetLevel: "N5",
    nativeLanguage: "en",
    isDemo: true,
  },
  {
    id: "usr_demo_admin",
    email: "demo.admin@nihongosetu.org",
    password: "DemoAdmin@2026!",
    name: "Sensei Tanaka (Demo Admin)",
    role: "admin" as const,
    targetLevel: "N1",
    nativeLanguage: "ja",
    isDemo: true,
  },
];

// In-memory cache initialized with hashed seed users
const FIXED_SALT = "nihongosetu_salt_v2026";
const IN_MEMORY_USERS = new Map<string, StoredUser>();

for (const seed of SEED_USERS_CONFIG) {
  const salt = FIXED_SALT;
  const passwordHash = hashPassword(seed.password, salt);
  IN_MEMORY_USERS.set(seed.email.toLowerCase(), {
    id: seed.id,
    email: seed.email.toLowerCase(),
    name: seed.name,
    passwordHash,
    salt,
    role: seed.role,
    targetLevel: seed.targetLevel,
    nativeLanguage: seed.nativeLanguage,
    isDemo: seed.isDemo,
    createdAt: new Date("2026-01-01T00:00:00Z").toISOString(),
  });
}

const DATA_DIR = path.join(process.cwd(), ".data");
const USERS_FILE_PATH = path.join(DATA_DIR, "local_users.json");

function ensureStorageDir(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch {
    // Ignore FS errors if environment is read-only
  }
}

function loadPersistedUsers(): void {
  try {
    if (fs.existsSync(USERS_FILE_PATH)) {
      const raw = fs.readFileSync(USERS_FILE_PATH, "utf-8");
      const list: StoredUser[] = JSON.parse(raw);
      for (const u of list) {
        if (!IN_MEMORY_USERS.has(u.email.toLowerCase())) {
          IN_MEMORY_USERS.set(u.email.toLowerCase(), u);
        }
      }
    }
  } catch {
    // Ignore read errors
  }
}

function savePersistedUsers(): void {
  try {
    ensureStorageDir();
    const list = Array.from(IN_MEMORY_USERS.values());
    fs.writeFileSync(USERS_FILE_PATH, JSON.stringify(list, null, 2), "utf-8");
  } catch {
    // Ignore write errors
  }
}

// Initial load
loadPersistedUsers();

/**
 * Verify credentials and return the sanitized user session payload if valid.
 */
export function verifyUserCredentials(
  email: string,
  rawPassword: string,
  expectedRole?: "student" | "admin"
): { success: boolean; user?: UserSessionPayload; error?: string } {
  loadPersistedUsers();
  const normalizedEmail = (email || "").trim().toLowerCase();

  if (!normalizedEmail) {
    return { success: false, error: "Email address is required." };
  }
  if (!rawPassword) {
    return { success: false, error: "Password is required." };
  }

  const user = IN_MEMORY_USERS.get(normalizedEmail);
  if (!user) {
    return {
      success: false,
      error: "No account found matching this email address. Please register or check credentials.",
    };
  }

  if (expectedRole && user.role !== expectedRole) {
    return {
      success: false,
      error: `This account is registered as a ${user.role}. Please switch to the ${user.role} login tab.`,
    };
  }

  const computedHash = hashPassword(rawPassword, user.salt);
  if (computedHash !== user.passwordHash) {
    return {
      success: false,
      error: "Incorrect password. Please verify and try again.",
    };
  }

  const userPayload: UserSessionPayload = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    targetLevel: user.targetLevel,
    nativeLanguage: user.nativeLanguage,
    isDemo: user.isDemo || false,
    loggedInAt: new Date().toISOString(),
  };

  return { success: true, user: userPayload };
}

/**
 * Provide immediate 1-click Demo session payload.
 */
export function getDemoSessionPayload(role: "student" | "admin" = "student"): UserSessionPayload {
  if (role === "admin") {
    return {
      id: "demo_admin_" + Date.now(),
      email: "demo.admin@nihongosetu.org",
      name: "Sensei Tanaka (Demo Admin)",
      role: "admin",
      targetLevel: "N1",
      nativeLanguage: "ja",
      isDemo: true,
      loggedInAt: new Date().toISOString(),
    };
  }

  return {
    id: "demo_student_" + Date.now(),
    email: "demo.student@nihongosetu.org",
    name: "Kenji Sato (Demo Student)",
    role: "student",
    targetLevel: "N5",
    nativeLanguage: "en",
    isDemo: true,
    loggedInAt: new Date().toISOString(),
  };
}

/**
 * Register a new user in the persistent store.
 */
export function registerUserCredentials(data: {
  email: string;
  password: string;
  name: string;
  role?: "student" | "admin";
  targetLevel?: string;
  nativeLanguage?: string;
}): { success: boolean; user?: UserSessionPayload; error?: string } {
  loadPersistedUsers();
  const normalizedEmail = (data.email || "").trim().toLowerCase();

  if (!normalizedEmail || !normalizedEmail.includes("@")) {
    return { success: false, error: "Please provide a valid email address." };
  }
  if (!data.password || data.password.length < 6) {
    return { success: false, error: "Password must be at least 6 characters long." };
  }
  if (IN_MEMORY_USERS.has(normalizedEmail)) {
    return { success: false, error: "An account with this email address already exists. Please log in." };
  }

  const salt = generateSalt();
  const passwordHash = hashPassword(data.password, salt);
  const newUser: StoredUser = {
    id: "usr_" + Date.now(),
    email: normalizedEmail,
    name: data.name?.trim() || normalizedEmail.split("@")[0] || "Japanese Learner",
    passwordHash,
    salt,
    role: data.role || "student",
    targetLevel: data.targetLevel || "N5",
    nativeLanguage: data.nativeLanguage || "en",
    isDemo: false,
    createdAt: new Date().toISOString(),
  };

  IN_MEMORY_USERS.set(normalizedEmail, newUser);
  savePersistedUsers();

  const userPayload: UserSessionPayload = {
    id: newUser.id,
    email: newUser.email,
    name: newUser.name,
    role: newUser.role,
    targetLevel: newUser.targetLevel,
    nativeLanguage: newUser.nativeLanguage,
    isDemo: false,
    loggedInAt: new Date().toISOString(),
  };

  return { success: true, user: userPayload };
}

