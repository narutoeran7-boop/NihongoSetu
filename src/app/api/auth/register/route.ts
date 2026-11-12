import { NextResponse } from "next/server";
import { registerUserCredentials } from "@/lib/auth/credentials";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name, role, targetLevel, nativeLanguage } = body || {};

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required." },
        { status: 400 }
      );
    }

    const regResult = registerUserCredentials({
      email,
      password,
      name,
      role: role || "student",
      targetLevel: targetLevel || "N5",
      nativeLanguage: nativeLanguage || "en",
    });

    if (!regResult.success || !regResult.user) {
      return NextResponse.json(
        { success: false, error: regResult.error || "Registration failed." },
        { status: 400 }
      );
    }

    const user = regResult.user;
    const response = NextResponse.json({
      success: true,
      redirect: user.role === "admin" ? "/admin" : "/portal",
      user,
      message: `Account created! Welcome, ${user.name}.`,
    });

    // Determine whether to set Secure flag (true for HTTPS / Cloudflare tunnel, false for localhost HTTP)
    const isHttps = req.headers.get("x-forwarded-proto") === "https" || req.url.startsWith("https");

    // Set cookie
    const sessionCookieValue = JSON.stringify(user);
    response.cookies.set({
      name: "nihongo_session",
      value: sessionCookieValue,
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      secure: isHttps,
    });

    return response;
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Internal registration error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

