"use client";

import { AppShell } from "@repo/ui/templates";

import { useWorkspace } from "@/components/providers";
import { useDocuments } from "@/hooks/use-documents";
import { useSearchParam } from "@/hooks/use-search-param";
import { DocumentsTable } from "./documents-table";
import { Navbar } from "./navbar";
import { TemplatesGallery } from "./templates-gallery";

const Home = () => {
  const [search] = useSearchParam();
  const { activeOrganization } = useWorkspace();
  const documents = useDocuments({ search, organizationId: activeOrganization });

  return (
    <AppShell header={<Navbar />}>
      <TemplatesGallery onCreated={() => void documents.refresh()} />
      <DocumentsTable {...documents} />
    </AppShell>
  );
};

export default Home;
