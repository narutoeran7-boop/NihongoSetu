import { NextResponse } from "next/server";
import { verifyUserCredentials } from "@/lib/auth/credentials";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, role } = body || {};

    if (!email || typeof email !== "string" || !email.trim()) {
      return NextResponse.json(
        { success: false, error: "Please enter your email address." },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { success: false, error: "Please enter your password." },
        { status: 400 }
      );
    }

    const verification = verifyUserCredentials(email, password, role);
    if (!verification.success || !verification.user) {
      return NextResponse.json(
        { success: false, error: verification.error || "Invalid email or password." },
        { status: 401 }
      );
    }

    const user = verification.user;
    const redirectUrl = user.role === "admin" ? "/admin" : "/portal";

    const response = NextResponse.json({
      success: true,
      redirect: redirectUrl,
      user,
      message: `Welcome back, ${user.name}!`,
    });

    // Determine whether to set Secure flag (true for HTTPS / Cloudflare tunnel, false for localhost HTTP)
    const isHttps = req.headers.get("x-forwarded-proto") === "https" || req.url.startsWith("https");

    // Set session cookie readable by both server middleware and client
    const sessionCookieValue = JSON.stringify(user);
    response.cookies.set({
      name: "nihongo_session",
      value: sessionCookieValue,
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      secure: isHttps,
    });

    return response;
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Internal authentication error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

