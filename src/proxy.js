import { NextResponse } from "next/server";

export async function proxy(request) {
  const cookie = request.cookies.get("sid")?.value;
  const pathname = request.nextUrl.pathname;

  const isPrivatePath = pathname === "/chat" || pathname.startsWith("/chat/");

  if (!cookie && isPrivatePath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|.*\\.png$).*)",
};
