/**
 * Thin client for the REST API.
 *
 * Every call carries the Keycloak access token from the session — the API
 * validates it against the realm's JWKS, so there is no separate app session
 * to keep in sync.
 */
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface RequestOptions {
  token: string;
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  signal?: AbortSignal;
}

export async function apiRequest<T>(
  path: string,
  { token, method = "GET", body, signal }: RequestOptions,
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    method,
    signal,
    headers: {
      authorization: `Bearer ${token}`,
      ...(body === undefined ? {} : { "content-type": "application/json" }),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    let message = `Request failed with ${response.status}`;

    try {
      const parsed = JSON.parse(detail) as { message?: string | string[] };
      if (parsed.message) {
        message = Array.isArray(parsed.message)
          ? parsed.message.join(", ")
          : parsed.message;
      }
    } catch {
      // Non-JSON error body — keep the generic message.
    }

    throw new ApiError(response.status, message);
  }

  return response.status === 204 ? (undefined as T) : ((await response.json()) as T);
}

/* ------------------------------------------------------------------ types */

export interface DocumentDto {
  id: string;
  title: string;
  ownerId: string;
  ownerName: string;
  organizationId: string | null;
  initialContent: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentPage {
  items: DocumentDto[];
  nextCursor: string | null;
}

export interface MemberDto {
  id: string;
  name: string;
  email?: string;
  color: string;
}

export interface NotificationDto {
  id: string;
  kind: "COMMENT" | "MENTION";
  threadId: string;
  commentId: string;
  actorName: string;
  excerpt: string;
  readAt: string | null;
  createdAt: string;
  document: { id: string; title: string };
}

export interface NotificationPage {
  items: NotificationDto[];
  unreadCount: number;
}
