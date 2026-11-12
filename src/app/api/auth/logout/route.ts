import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({
    success: true,
    redirect: "/login",
    message: "Logged out successfully",
  });

  // Explicitly invalidate session cookie
  response.cookies.set({
    name: "nihongo_session",
    value: "",
    path: "/",
    sameSite: "lax",
    maxAge: 0,
    expires: new Date(0),
  });

  return response;
}

export async function GET() {
  return POST();
}

