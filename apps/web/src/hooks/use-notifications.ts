"use client";

import useSWR from "swr";

import { type NotificationPage, apiRequest } from "@/lib/api";
import { useApi } from "./use-api";

/**
 * Inbox rows written by the collaboration server.
 *
 * Comments inside a document you have open arrive over Yjs instantly; this
 * poll exists for the ones in documents you do not. Twenty seconds is plenty
 * for a bell icon and costs one small query.
 */
export function useNotifications() {
  const { token, ready } = useApi();

  const { data, mutate } = useSWR<NotificationPage>(
    ready ? "/notifications" : null,
    (path: string) => apiRequest<NotificationPage>(path, { token }),
    { refreshInterval: 20_000, revalidateOnFocus: true },
  );

  const markAllRead = async () => {
    await apiRequest("/notifications/read", { token, method: "POST", body: {} });
    await mutate();
  };

  return {
    notifications: data?.items ?? [],
    unreadCount: data?.unreadCount ?? 0,
    markAllRead,
  };
}
