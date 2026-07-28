"use client";

import { EditorShell } from "@repo/ui/templates";

import type { DocumentDto } from "@/lib/api";
import { CollaborationRoom } from "./collaboration-provider";
import { Editor } from "./editor";
import { NavBar } from "./navbar";
import { Toolbar } from "./toolbar";

interface DocumentProps {
  document: DocumentDto;
}

export const Document = ({ document }: DocumentProps) => (
  <CollaborationRoom documentId={document.id}>
    <EditorShell navbar={<NavBar data={document} />} toolbar={<Toolbar />}>
      <Editor document={document} />
    </EditorShell>
  </CollaborationRoom>
);
