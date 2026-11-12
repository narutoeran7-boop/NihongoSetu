import { NextResponse } from "next/server";
import { getDemoSessionPayload } from "@/lib/auth/credentials";

export async function POST(req: Request) {
  try {
    let role: "student" | "admin" = "student";
    try {
      const body = await req.json();
      if (body?.role === "admin") {
        role = "admin";
      }
    } catch {
      // Body may be empty on direct button clicks; defaults to student
      role = "student";
    }

    const demoUser = getDemoSessionPayload(role);
    const redirectUrl = role === "admin" ? "/admin" : "/portal";

    const response = NextResponse.json({
      success: true,
      redirect: redirectUrl,
      user: demoUser,
      message: `Demo mode activated: Signed in as ${demoUser.name}`,
    });

    // Determine whether to set Secure flag (true for HTTPS / Cloudflare tunnel, false for localhost HTTP)
    const isHttps = req.headers.get("x-forwarded-proto") === "https" || req.url.startsWith("https");

    // Set session cookie
    const sessionCookieValue = JSON.stringify(demoUser);
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
    const errorMessage = err instanceof Error ? err.message : "Failed to initialize demo session";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

