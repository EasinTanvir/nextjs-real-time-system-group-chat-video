import { NextResponse } from "next/server";
import { getCookie } from "./lib/cookies";

const privatePath = ["/chat"];
export async function proxy(request) {
  const cookie = await getCookie("sid");
  console.log({ cookie });
  if (!cookie && privatePath.includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|.*\\.png$).*)",
};
