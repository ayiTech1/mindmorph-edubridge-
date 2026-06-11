import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Edge middleware — gates the /admin route group.
 *
 * We use NextAuth's `getToken` to decrypt the JWT session cookie at the edge.
 * Unauthenticated visitors get redirected to /admin/login with a `next`
 * parameter so they return to where they came from after signing in.
 *
 * The matcher is intentionally narrow — it doesn't run on the public site,
 * API routes, or metadata files.
 */
export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname === "/admin/login") {
    return NextResponse.next();
  }

  const token = await getToken({
    req,
    secret:
      process.env.NEXTAUTH_SECRET ?? "dev-only-secret-change-in-production-please",
    cookieName:
      process.env.NODE_ENV === "production"
        ? "__Secure-mindmorph.session"
        : "mindmorph.session"
  });

  if (!token) {
    const login = req.nextUrl.clone();
    login.pathname = "/admin/login";
    login.searchParams.set("next", req.nextUrl.pathname);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"]
};
