import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import {
  JLPTLevel,
  getServerQuestionsForLevel,
  ExamReviewItem,
} from "@/data/serverQuestions";

const VALID_LEVELS: JLPTLevel[] = ["N5", "N4", "N3", "N2", "N1"];

// Ephemeral runtime secret for local development when env var is omitted
// Never uses a static predictable fallback string
const DEV_EPHEMERAL_SECRET = crypto.randomBytes(32).toString("hex");

interface GradeRequestBody {
  level: string;
  answers: Record<string, number>;
  questionIds: string[];
  timeSpentSeconds?: number;
  attemptId?: string;
}

export async function POST(req: NextRequest) {
  try {
    // 1. Strict Server Secret Validation
    const serverSalt = process.env.EXAM_VERIFICATION_SECRET;
    if (!serverSalt && process.env.NODE_ENV === "production") {
      console.error("Security Alert: EXAM_VERIFICATION_SECRET is required in production environment.");
      return NextResponse.json(
        { error: "Server grading misconfigured: Cryptographic secret missing in production." },
        { status: 500 }
      );
    }
    const activeSecret = serverSalt || DEV_EPHEMERAL_SECRET;

    // 2. Authentication & Attempt Ownership Inspection
    const sessionCookie = req.cookies.get("nihongo_session")?.value;
    const authHeader = req.headers.get("authorization");
    let userIdentifier = "anonymous-learner";

    if (sessionCookie) {
      try {
        const parsed = JSON.parse(decodeURIComponent(sessionCookie));
        if (parsed && typeof parsed.email === "string" && parsed.email.length > 0) {
          userIdentifier = parsed.email.toLowerCase().trim();
        }
      } catch {
        // Fallback to anonymous
      }
    } else if (authHeader && authHeader.startsWith("Bearer ")) {
      userIdentifier = "bearer-authenticated-user";
    }

    const body: GradeRequestBody = await req.json();

    // 3. Validate Level
    const rawLevel = (body.level || "").toUpperCase();
    if (!VALID_LEVELS.includes(rawLevel as JLPTLevel)) {
      return NextResponse.json(
        { error: "Invalid JLPT level specified." },
        { status: 400 }
      );
    }
    const level = rawLevel as JLPTLevel;

    // 4. Validate Question IDs
    if (!Array.isArray(body.questionIds) || body.questionIds.length === 0) {
      return NextResponse.json(
        { error: "Question IDs list is required." },
        { status: 400 }
      );
    }

    if (body.questionIds.length > 50) {
      return NextResponse.json(
        { error: "Exceeded maximum questions per examination (maximum 50)." },
        { status: 400 }
      );
    }

    // Deduplicate question IDs to prevent duplicate scoring exploit
    const uniqueQuestionIds = Array.from(new Set(body.questionIds));
    if (uniqueQuestionIds.length !== body.questionIds.length) {
      return NextResponse.json(
        { error: "Duplicate question IDs detected in submission." },
        { status: 400 }
      );
    }

    const answers = body.answers && typeof body.answers === "object" ? body.answers : {};

    // 5. Load Server Source of Truth for this Level (Exclusively from serverQuestions.ts)
    const serverQuestions = getServerQuestionsForLevel(level);
    const questionMap = new Map(serverQuestions.map((q) => [q.id, q]));

    // 6. Secure Evaluation & Review Construction
    let correctCount = 0;
    const review: ExamReviewItem[] = [];

    for (const qId of body.questionIds) {
      const serverQ = questionMap.get(qId);
      if (!serverQ) {
        return NextResponse.json(
          { error: `Question ${qId} does not exist for level ${level}.` },
          { status: 400 }
        );
      }

      const userSelected = typeof answers[qId] === "number" ? answers[qId] : null;
      const isCorrect = userSelected === serverQ.correctIndex;
      if (isCorrect) {
        correctCount++;
      }

      // Solutions and explanations are released exclusively on the server post-submission
      review.push({
        id: serverQ.id,
        question: serverQ.question,
        options: serverQ.options,
        userSelected,
        correctIndex: serverQ.correctIndex,
        isCorrect,
        explanation: serverQ.explanation,
        explanationTa: serverQ.explanationTa,
        category: serverQ.category,
        section: serverQ.section,
      });
    }

    const total = body.questionIds.length;
    const percentage = Math.round((correctCount / total) * 100);
    const passed = percentage >= 70; // 70% passing threshold
    const gradedAt = new Date().toISOString();
    const attemptId = body.attemptId || `att-${Date.now()}-${crypto.randomBytes(6).toString("hex")}`;

    // 7. Cryptographic HMAC-SHA256 Signing
    const hmacPayload = `${attemptId}:${userIdentifier}:${level}:${correctCount}:${total}:${percentage}:${passed}:${gradedAt}`;
    const signature = crypto
      .createHmac("sha256", activeSecret)
      .update(hmacPayload)
      .digest("hex");

    return NextResponse.json({
      success: true,
      verifiedScore: {
        attemptId,
        user: userIdentifier,
        score: correctCount,
        total,
        percentage,
        passed,
        level,
        gradedAt,
        signature,
      },
      review,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal grading error";
    return NextResponse.json(
      { error: "Examination grading failed: " + message },
      { status: 500 }
    );
  }
}
