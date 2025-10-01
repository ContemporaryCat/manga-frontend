import { DefaultSession, DefaultUser } from "@auth/core/types";
import { JWT as DefaultJWT } from "@auth/core/jwt";

declare module "@auth/core/types" {
  interface Session {
    user?: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    } & DefaultSession["user"];
    jwt?: DefaultJWT; // If you still need to expose JWT in session
  }

  interface User extends DefaultUser {
    // Add any custom properties to the User object here
    // For example:
    // customProperty?: string;
  }
}

declare module "@auth/core/jwt" {
  interface JWT extends DefaultJWT {
    // Add any custom properties to the JWT object here
    // For example:
    // customClaim?: string;
    name?: string | null;
    picture?: string | null;
  }
}