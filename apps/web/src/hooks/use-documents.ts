"use client";

import { useCallback } from "react";
import useSWRInfinite from "swr/infinite";

import { type DocumentPage, apiRequest } from "@/lib/api";
import { useApi } from "./use-api";

const PAGE_SIZE = 5;

interface UseDocumentsOptions {
  search?: string;
  organizationId?: string | null;
}

/**
 * Cursor-paginated document list.
 *
 * Convex pushed updates on its own; with a plain REST API the list revalidates
 * on focus and whenever a mutation calls `refresh()`.
 */
export function useDocuments({ search, organizationId }: UseDocumentsOptions) {
  const { token, ready } = useApi();

  const getKey = (index: number, previous: DocumentPage | null) => {
    if (!ready) return null;
    if (previous && previous.nextCursor === null) return null;

    const params = new URLSearchParams({ limit: String(PAGE_SIZE) });
    if (search) params.set("search", search);
    if (organizationId) params.set("organizationId", organizationId);
    if (index > 0 && previous?.nextCursor) params.set("cursor", previous.nextCursor);

    return `/documents?${params.toString()}`;
  };

  const { data, error, size, setSize, isLoading, isValidating, mutate } =
    useSWRInfinite<DocumentPage>(
      getKey,
      (path: string) => apiRequest<DocumentPage>(path, { token }),
      { revalidateFirstPage: true, keepPreviousData: true },
    );

  const lastPage = data?.at(-1);

  return {
    /** `undefined` while the first page is in flight — the table shows a spinner. */
    documents: data?.flatMap((page) => page.items),
    error,
    isLoading: isLoading || (!data && !error),
    isLoadingMore: isValidating && (data?.length ?? 0) < size,
    canLoadMore: Boolean(lastPage?.nextCursor),
    loadMore: useCallback(() => void setSize((current) => current + 1), [setSize]),
    refresh: mutate,
  };
}
