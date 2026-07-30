import { unsealData } from "iron-session";
import { NextResponse, type NextRequest } from "next/server";
import { sessionOptions, type SessionData } from "@/lib/auth/session-options";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login") return NextResponse.next();

  const cookie = request.cookies.get(sessionOptions.cookieName)?.value;
  if (!cookie) return NextResponse.redirect(new URL("/admin/login", request.url));

  try {
    const data = await unsealData<SessionData>(cookie, { password: sessionOptions.password });
    if (!data.adminUserId) throw new Error("no session");
  } catch {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
