import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const rawCookie = req.cookies.get("nihongo_session")?.value;

  if (!rawCookie) {
    return NextResponse.json({ authenticated: false, user: null });
  }

  try {
    let decoded = rawCookie;
    try {
      decoded = decodeURIComponent(decoded);
    } catch {}
    try {
      decoded = decodeURIComponent(decoded);
    } catch {}
    const user = JSON.parse(decoded);
    return NextResponse.json({ authenticated: true, user });
  } catch {
    return NextResponse.json({ authenticated: false, user: null });
  }
}
