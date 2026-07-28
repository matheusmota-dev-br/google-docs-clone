import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { MoreVerticalIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "../atoms/avatar";
import { Button } from "../atoms/button";
import { SearchField } from "../molecules/search-field";
import { AppHeader } from "../organisms/app-header";
import { DocumentTable, type DocumentSummary } from "../organisms/document-table";
import { TemplateGallery } from "../organisms/template-gallery";
import { AppShell } from "./app-shell";

/**
 * The complete document browser, assembled entirely from the design system.
 * This is the closest Storybook gets to the real `/` route — only the data
 * source differs.
 */
const meta: Meta<typeof AppShell> = {
  title: "Templates/AppShell",
  component: AppShell,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof AppShell>;

const templates = [
  { id: "blank-document", label: "Blank Document", imageUrl: "/blank-document.svg" },
  {
    id: "software-proposal",
    label: "Software Proposal",
    imageUrl: "/software-proposal.svg",
  },
  {
    id: "project-proposal",
    label: "Project Proposal",
    imageUrl: "/project-proposal.svg",
  },
  { id: "business-letter", label: "Business Letter", imageUrl: "/business-letter.svg" },
  { id: "resume", label: "Resume", imageUrl: "/resume.svg" },
  { id: "cover-letter", label: "Cover Letter", imageUrl: "/cover-letter.svg" },
];

const documents: DocumentSummary[] = [
  { id: "1", title: "Q3 planning", createdAt: "2026-03-12", owner: "organization" },
  { id: "2", title: "Design review notes", createdAt: "2026-03-09", owner: "personal" },
  { id: "3", title: "Offsite agenda", createdAt: "2026-02-28", owner: "organization" },
];

const DocumentBrowser = () => {
  const [query, setQuery] = useState("");

  return (
    <AppShell
      header={
        <AppHeader
          search={
            <SearchField
              value={query}
              onValueChange={setQuery}
              onClear={() => setQuery("")}
            />
          }
          actions={
            <Avatar className="size-8">
              <AvatarImage src="https://i.pravatar.cc/80?img=47" alt="Ada Lovelace" />
              <AvatarFallback>AL</AvatarFallback>
            </Avatar>
          }
        />
      }
    >
      <TemplateGallery templates={templates} />
      <DocumentTable
        documents={documents}
        canLoadMore
        onLoadMore={() => {}}
        renderActions={() => (
          <Button variant="ghost" size="icon" aria-label="Document actions">
            <MoreVerticalIcon className="size-4" />
          </Button>
        )}
      />
    </AppShell>
  );
};

export const DocumentBrowserPage: Story = { render: () => <DocumentBrowser /> };
