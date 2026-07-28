import { NextResponse } from "next/server";

import { auth } from "@/auth";

/**
 * Everything except the sign-in page and the auth endpoints needs a session.
 * Unauthenticated visitors are bounced to `/sign-in`, which sends them on to
 * Keycloak and brings them back where they were going.
 */
export default auth((request) => {
  const { pathname, search } = request.nextUrl;

  if (request.auth) return NextResponse.next();

  const signIn = new URL("/sign-in", request.nextUrl.origin);
  signIn.searchParams.set("callbackUrl", `${pathname}${search}`);

  return NextResponse.redirect(signIn);
});

export const config = {
  matcher: [
    // Skip Next internals, static files, the auth routes and the sign-in page.
    "/((?!api/auth|sign-in|_next/static|_next/image|favicon.ico|.*\\.svg$).*)",
  ],
};
