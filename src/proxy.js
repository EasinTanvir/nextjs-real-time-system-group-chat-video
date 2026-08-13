import { NextResponse } from "next/server";

const privatePath = ["/chat"];

export async function proxy(request) {
  // Read cookie directly from incoming request!
  const cookie = request.cookies.get("sid")?.value;
  console.log({ cookie });

  if (!cookie && privatePath.includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|.*\\.png$).*)",
};
