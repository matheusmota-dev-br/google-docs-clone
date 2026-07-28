"use client";

import { useCallback } from "react";
import { useSession } from "next-auth/react";

import { apiRequest } from "@/lib/api";

/**
 * `apiRequest` bound to the current session's access token.
 *
 * `useSession` re-runs the Auth.js `jwt` callback when the token nears expiry,
 * so the token handed out here is always fresh.
 */
export function useApi() {
  const { data: session } = useSession();
  const token = session?.accessToken ?? "";

  const request = useCallback(
    <T>(path: string, options: Omit<Parameters<typeof apiRequest>[1], "token"> = {}) =>
      apiRequest<T>(path, { ...options, token }),
    [token],
  );

  return { token, request, ready: token.length > 0 };
}
