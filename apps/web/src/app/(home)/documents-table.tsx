"use client";

import { useRouter } from "next/navigation";
import { FileSearchIcon, FileTextIcon } from "lucide-react";
import { EmptyState } from "@repo/ui/molecules";
import { DocumentTable, type DocumentSummary } from "@repo/ui/organisms";

import { useSearchParam } from "@/hooks/use-search-param";
import type { DocumentDto } from "@/lib/api";
import { DocumentMenu } from "./document-menu";

interface DocumentsTableProps {
  documents?: DocumentDto[];
  canLoadMore: boolean;
  isLoadingMore: boolean;
  isLoading: boolean;
  loadMore: () => void;
  refresh: () => void;
}

const toSummary = (document: DocumentDto): DocumentSummary => ({
  id: document.id,
  title: document.title,
  createdAt: document.createdAt,
  owner: document.organizationId ? "organization" : "personal",
});

/**
 * Adapter between the paginated REST list and the presentational
 * `<DocumentTable>` organism.
 */
export const DocumentsTable = ({
  documents,
  canLoadMore,
  isLoadingMore,
  isLoading,
  loadMore,
  refresh,
}: DocumentsTableProps) => {
  const router = useRouter();
  const [search] = useSearchParam();

  return (
    <DocumentTable
      documents={isLoading && !documents ? undefined : (documents ?? []).map(toSummary)}
      onSelect={(document) => router.push(`/documents/${document.id}`)}
      renderActions={(document) => (
        <DocumentMenu
          documentId={document.id}
          title={document.title}
          onChanged={refresh}
          onNewTab={(id) => window.open(`/documents/${id}`, "_blank")}
        />
      )}
      onLoadMore={loadMore}
      canLoadMore={canLoadMore}
      isLoadingMore={isLoadingMore}
      emptyState={
        search ? (
          <EmptyState
            icon={FileSearchIcon}
            title={`No documents match "${search}"`}
            description="Try a different search term, or clear the search to see everything."
          />
        ) : (
          <EmptyState
            icon={FileTextIcon}
            title="No documents yet"
            description="Pick a template above to create your first document."
          />
        )
      }
    />
  );
};
