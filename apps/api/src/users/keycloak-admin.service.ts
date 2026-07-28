import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

export interface Member {
  id: string;
  name: string;
  email?: string;
  /** Deterministic per-user colour, reused by cursors and avatars. */
  color: string;
}

interface KeycloakUser {
  id: string;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
}

interface KeycloakGroup {
  id: string;
  name: string;
}

/** Stable colour from a user id, so the same person looks the same everywhere. */
export const colorFor = (seed: string): string => {
  let hash = 0;
  for (const char of seed) hash = (hash * 31 + char.charCodeAt(0)) | 0;

  return `hsl(${Math.abs(hash) % 360}, 72%, 55%)`;
};

/**
 * Thin read-only wrapper over Keycloak's admin API.
 *
 * The application never stores a user table: the member list for mentions and
 * for `resolveUsers` is read straight from the realm using the API's own
 * service account.
 */
@Injectable()
export class KeycloakAdminService {
  private readonly logger = new Logger(KeycloakAdminService.name);
  private readonly baseUrl: string;
  private readonly realm: string;
  private readonly clientId: string;
  private readonly clientSecret: string;

  private token?: { value: string; expiresAt: number };
  private groupIds?: Map<string, string>;

  constructor(config: ConfigService) {
    this.baseUrl = config
      .getOrThrow<string>("KEYCLOAK_ADMIN_BASE_URL")
      .replace(/\/$/, "");
    this.realm = config.getOrThrow<string>("KEYCLOAK_REALM");
    this.clientId = config.getOrThrow<string>("KEYCLOAK_CLIENT_ID");
    this.clientSecret = config.getOrThrow<string>("KEYCLOAK_CLIENT_SECRET");
  }

  private async accessToken(): Promise<string> {
    if (this.token && this.token.expiresAt > Date.now() + 10_000) {
      return this.token.value;
    }

    const response = await fetch(
      `${this.baseUrl}/realms/${this.realm}/protocol/openid-connect/token`,
      {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "client_credentials",
          client_id: this.clientId,
          client_secret: this.clientSecret,
        }),
      },
    );

    if (!response.ok) {
      this.logger.error(`Service account login failed: ${response.status}`);
      throw new InternalServerErrorException("Could not reach the identity provider");
    }

    const body = (await response.json()) as { access_token: string; expires_in: number };
    this.token = {
      value: body.access_token,
      expiresAt: Date.now() + body.expires_in * 1000,
    };

    return this.token.value;
  }

  private async admin<T>(path: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}/admin/realms/${this.realm}${path}`, {
      headers: { authorization: `Bearer ${await this.accessToken()}` },
    });

    if (!response.ok) {
      this.logger.error(`Admin API ${path} failed: ${response.status}`);
      throw new InternalServerErrorException("Could not reach the identity provider");
    }

    return (await response.json()) as T;
  }

  private toMember(user: KeycloakUser): Member {
    const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ");

    return {
      id: user.id,
      name: fullName || user.username,
      email: user.email,
      color: colorFor(user.id),
    };
  }

  private async groupId(name: string): Promise<string | undefined> {
    if (!this.groupIds) {
      const groups = await this.admin<KeycloakGroup[]>("/groups");
      this.groupIds = new Map(groups.map((group) => [group.name, group.id]));
    }

    const cached = this.groupIds.get(name);
    if (cached) return cached;

    // Group created after the cache was built — refresh once.
    const groups = await this.admin<KeycloakGroup[]>("/groups");
    this.groupIds = new Map(groups.map((group) => [group.name, group.id]));

    return this.groupIds.get(name);
  }

  async membersOfGroup(name: string): Promise<Member[]> {
    const id = await this.groupId(name);
    if (!id) return [];

    const users = await this.admin<KeycloakUser[]>(`/groups/${id}/members?max=200`);

    return users.map((user) => this.toMember(user));
  }
}
