import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { passportJwtSecret } from "jwks-rsa";
import { ExtractJwt, Strategy } from "passport-jwt";

import { type AuthUser, type KeycloakClaims, toAuthUser } from "./auth-user";

/**
 * Validates Keycloak access tokens against the realm's published JWKS. No
 * shared secret and no round trip to Keycloak on the hot path — the signing
 * keys are fetched once and cached.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    const issuer = config.getOrThrow<string>("KEYCLOAK_ISSUER");

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      algorithms: ["RS256"],
      issuer,
      audience: config.getOrThrow<string>("KEYCLOAK_AUDIENCE"),
      secretOrKeyProvider: passportJwtSecret({
        jwksUri: `${issuer}/protocol/openid-connect/certs`,
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 10,
      }),
    });
  }

  validate(claims: KeycloakClaims): AuthUser {
    return toAuthUser(claims);
  }
}
