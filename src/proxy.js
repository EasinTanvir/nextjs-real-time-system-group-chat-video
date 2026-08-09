import { cookies } from "next/headers";
import { NextResponse } from "next/server";
export async function proxy(request) {
  const cookie = (await cookies()).get("sid")?.value;

  return NextResponse.next();
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|.*\\.png$).*)",
};
