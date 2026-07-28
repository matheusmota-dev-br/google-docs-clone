/**
 * The slice of a Keycloak access token the API actually uses.
 *
 * Identity lives in Keycloak, not in our database — the only thing we persist
 * is the `sub`, and organisations are Keycloak group names.
 */
export interface AuthUser {
  /** Keycloak `sub`. */
  id: string;
  username: string;
  name: string;
  email?: string;
  /** Group names the user belongs to, e.g. `["acme"]`. */
  organizations: string[];
}

export interface KeycloakClaims {
  sub: string;
  preferred_username?: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  email?: string;
  groups?: string[];
}

export const toAuthUser = (claims: KeycloakClaims): AuthUser => {
  const fullName = [claims.given_name, claims.family_name].filter(Boolean).join(" ");

  return {
    id: claims.sub,
    username: claims.preferred_username ?? claims.sub,
    name: claims.name || fullName || claims.preferred_username || "Anonymous",
    email: claims.email,
    // Keycloak emits group paths when `full.path` is on; normalise either shape.
    organizations: (claims.groups ?? []).map((group) => group.replace(/^\//, "")),
  };
};
