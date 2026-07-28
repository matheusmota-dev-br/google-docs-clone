import NextAuth, { type DefaultSession } from "next-auth";
import Keycloak from "next-auth/providers/keycloak";
import type { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    /** Keycloak access token, forwarded to the API and the collab socket. */
    accessToken: string;
    /** Keycloak group names the user belongs to. */
    organizations: string[];
    /** Set when the refresh token is spent — the UI asks for a fresh sign-in. */
    error?: "RefreshFailed";
    user: { id: string } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    /**
     * The Keycloak `sub`.
     *
     * Auth.js mints its own random `sub` for the session, but the API, the
     * collaboration server and every `ownerId` in Postgres are keyed on
     * Keycloak's. Carrying it explicitly keeps all four in agreement about who
     * the user is.
     */
    keycloakId?: string;
    accessToken?: string;
    refreshToken?: string;
    idToken?: string;
    /** Unix seconds. */
    expiresAt?: number;
    organizations?: string[];
    error?: "RefreshFailed";
  }
}

const issuer = process.env.AUTH_KEYCLOAK_ISSUER!;

/**
 * Trades the refresh token for a new access token.
 *
 * Keycloak access tokens are short-lived (15 minutes in the bundled realm) but
 * the editor holds a websocket open for much longer, so this runs on every
 * session read once the token is close to expiring.
 */
async function refresh(token: JWT): Promise<JWT> {
  try {
    const response = await fetch(`${issuer}/protocol/openid-connect/token`, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        client_id: process.env.AUTH_KEYCLOAK_ID!,
        client_secret: process.env.AUTH_KEYCLOAK_SECRET!,
        refresh_token: token.refreshToken!,
      }),
    });

    if (!response.ok) throw new Error(`Keycloak responded ${response.status}`);

    const refreshed = (await response.json()) as {
      access_token: string;
      expires_in: number;
      refresh_token?: string;
      id_token?: string;
    };

    return {
      ...token,
      accessToken: refreshed.access_token,
      refreshToken: refreshed.refresh_token ?? token.refreshToken,
      idToken: refreshed.id_token ?? token.idToken,
      expiresAt: Math.floor(Date.now() / 1000) + refreshed.expires_in,
      error: undefined,
    };
  } catch {
    // Surfaced to the UI rather than thrown: the user needs to sign in again.
    return { ...token, error: "RefreshFailed" };
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Keycloak({ issuer })],
  session: { strategy: "jwt" },
  pages: { signIn: "/sign-in", error: "/sign-in" },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        return {
          ...token,
          sub: profile?.sub ?? token.sub,
          keycloakId: profile?.sub ?? undefined,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          idToken: account.id_token,
          expiresAt: account.expires_at,
          organizations: ((profile?.groups as string[] | undefined) ?? []).map((group) =>
            group.replace(/^\//, ""),
          ),
        };
      }

      const expiresAt = (token.expiresAt ?? 0) * 1000;
      // Refresh a little early so an in-flight request never races expiry.
      if (Date.now() < expiresAt - 30_000) return token;

      return refresh(token);
    },

    session({ session, token }) {
      session.user.id = token.keycloakId ?? token.sub!;
      session.accessToken = token.accessToken ?? "";
      session.organizations = token.organizations ?? [];
      session.error = token.error;

      return session;
    },
  },
});
