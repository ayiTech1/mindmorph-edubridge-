import type { NextAuthOptions, Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { compare } from "bcryptjs";
import { prisma, isDbConfigured } from "./prisma";

type AppRole = "SUPER_ADMIN" | "ADMIN" | "EDITOR" | "CONSULTANT" | "VIEWER";

/**
 * NextAuth v4 configuration — JWT strategy so we don't depend on database
 * tables for sessions (the middleware reads the JWT-encoded session cookie).
 *
 * Two providers:
 *   1. Credentials — email + password against the `User` table (bcrypt-hashed).
 *   2. Google      — for staff who sign in with their Google Workspace account.
 *
 * In development (no DATABASE_URL) the Credentials provider falls back to a
 * single hard-coded super-admin account, so the team can test the admin UI
 * end-to-end without provisioning MySQL first.
 */
export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt", maxAge: 30 * 60 }, // 30 minutes idle timeout (§5.1)
  jwt: { maxAge: 30 * 60 },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login"
  },
  cookies: {
    sessionToken: {
      // The cookie name our edge middleware looks for.
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-mindmorph.session"
          : "mindmorph.session",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production"
      }
    }
  },
  providers: [
    CredentialsProvider({
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;
        const email = credentials.email.trim().toLowerCase();

        // Dev fallback: a single hard-coded super-admin so the team can log
        // into the admin UI without setting up MySQL. Disabled in production.
        if (!isDbConfigured() && process.env.NODE_ENV !== "production") {
          if (email === "admin@mindmorphedubridge.com" && credentials.password === "mindmorph2026") {
            return {
              id: "dev-super-admin",
              email,
              name: "Dev Super Admin",
              role: "SUPER_ADMIN" as AppRole
            };
          }
          return null;
        }

        try {
          const user = await prisma.user.findUnique({ where: { email } });
          if (!user || !user.active || !user.passwordHash) return null;
          const ok = await compare(credentials.password, user.passwordHash);
          if (!ok) return null;

          // Best-effort last-login update — don't block sign-in if it fails.
          prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() }
          }).catch(() => undefined);

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.photoUrl ?? undefined,
            role: user.role as AppRole
          };
        } catch (err) {
          console.warn("[auth] credentials authorize failed:", err);
          return null;
        }
      }
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
              params: {
                // Restrict to Mindmorph Workspace if a hosted domain is set.
                ...(process.env.GOOGLE_HD ? { hd: process.env.GOOGLE_HD } : {}),
                prompt: "select_account"
              }
            }
          })
        ]
      : []),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // For Google sign-ins, only allow already-provisioned team members.
      if (account?.provider !== "google") return true;
      if (!isDbConfigured()) return true; // dev mode — accept any Google account

      const email = user.email?.toLowerCase();
      if (!email) return false;

      const teamMember = await prisma.user
        .findUnique({ where: { email } })
        .catch(() => null);
      if (!teamMember || !teamMember.active) return false;

      (user as { role?: AppRole }).role = teamMember.role as AppRole;
      return true;
    },
    async jwt({ token, user }): Promise<JWT> {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: AppRole }).role ?? "VIEWER";
      }
      return token;
    },
    async session({ session, token }): Promise<Session> {
      if (session.user) {
        (session.user as { id?: string }).id = token.id as string;
        (session.user as { role?: AppRole }).role = (token.role as AppRole) ?? "VIEWER";
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET ?? "dev-only-secret-change-in-production-please"
};

/** Type-narrowed helper for use in server components. */
export type AppSession = Session & {
  user?: {
    id?: string;
    email?: string | null;
    name?: string | null;
    image?: string | null;
    role?: AppRole;
  };
};
