import { createRemoteJWKSet, jwtVerify } from "jose";

import { config } from "./config";

export interface CollabUser {
  /** Keycloak `sub`. */
  id: string;
  name: string;
  color: string;
  /** Keycloak group names. */
  organizations: string[];
}

export interface CollabContext {
  user: CollabUser;
}

/**
 * Cached remote key set. `jose` refetches on key rotation by itself, so the
 * collaboration server never needs a shared secret with Keycloak.
 */
const jwks = createRemoteJWKSet(
  new URL(`${config.keycloak.issuer}/protocol/openid-connect/certs`),
);

/** Mirrors `colorFor` in the API so a person keeps one colour everywhere. */
export const colorFor = (seed: string): string => {
  let hash = 0;
  for (const char of seed) hash = (hash * 31 + char.charCodeAt(0)) | 0;

  return `hsl(${Math.abs(hash) % 360}, 72%, 55%)`;
};

export const verifyToken = async (token: string): Promise<CollabUser> => {
  const { payload } = await jwtVerify(token, jwks, {
    issuer: config.keycloak.issuer,
    audience: config.keycloak.audience,
  });

  const claims = payload as {
    sub?: string;
    name?: string;
    given_name?: string;
    family_name?: string;
    preferred_username?: string;
    groups?: string[];
  };

  if (!claims.sub) throw new Error("Token has no subject");

  const fullName = [claims.given_name, claims.family_name].filter(Boolean).join(" ");

  return {
    id: claims.sub,
    name: claims.name || fullName || claims.preferred_username || "Anonymous",
    color: colorFor(claims.sub),
    organizations: (claims.groups ?? []).map((group) => group.replace(/^\//, "")),
  };
};
