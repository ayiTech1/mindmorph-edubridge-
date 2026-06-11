// Ambient module augmentation — these imports look "unused" but are required
// to extend the next-auth types via declaration merging.
import type { DefaultSession, DefaultUser } from "next-auth";
import type { DefaultJWT } from "next-auth/jwt";

type AppRole = "SUPER_ADMIN" | "ADMIN" | "EDITOR" | "CONSULTANT" | "VIEWER";

declare module "next-auth" {
  interface Session {
    user?: {
      id?: string;
      role?: AppRole;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role?: AppRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id?: string;
    role?: AppRole;
  }
}

export {};
