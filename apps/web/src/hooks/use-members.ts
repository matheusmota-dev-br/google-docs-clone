"use client";

import useSWR from "swr";

import { type MemberDto, apiRequest } from "@/lib/api";
import { useApi } from "./use-api";

/**
 * People who can be mentioned in the current workspace. Comes straight from
 * Keycloak — the app keeps no user table of its own.
 */
export function useMembers(organizationId?: string | null) {
  const { token, ready } = useApi();
  const query = organizationId
    ? `?organizationId=${encodeURIComponent(organizationId)}`
    : "";

  const { data } = useSWR<MemberDto[]>(
    ready ? `/users${query}` : null,
    (path: string) => apiRequest<MemberDto[]>(path, { token }),
    { revalidateOnFocus: false },
  );

  return data ?? [];
}
