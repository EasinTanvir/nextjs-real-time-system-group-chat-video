import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getCookie } from "./lib/cookies";

const publicPaths = ["/login", "/register"];
export async function proxy(request) {
  const cookie = await getCookie("sid");

  if (!cookie && !publicPaths.includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|.*\\.png$).*)",
};
