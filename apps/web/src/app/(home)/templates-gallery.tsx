"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { TemplateGallery, type TemplateOption } from "@repo/ui/organisms";

import { useWorkspace } from "@/components/providers";
import { useApi } from "@/hooks/use-api";
import { templates } from "@/constants/templates";
import type { DocumentDto } from "@/lib/api";

interface TemplatesGalleryProps {
  onCreated?: () => void;
}

export const TemplatesGallery = ({ onCreated }: TemplatesGalleryProps) => {
  const router = useRouter();
  const { request } = useApi();
  const { activeOrganization } = useWorkspace();
  const [isCreating, setIsCreating] = useState(false);

  const onSelect = async (template: TemplateOption) => {
    const initialContent =
      templates.find(({ id }) => id === template.id)?.initialContent ?? "";

    setIsCreating(true);
    try {
      const document = await request<DocumentDto>("/documents", {
        method: "POST",
        body: {
          title: template.label,
          initialContent,
          ...(activeOrganization ? { organizationId: activeOrganization } : {}),
        },
      });

      toast.success("Document created");
      onCreated?.();
      router.push(`/documents/${document.id}`);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <TemplateGallery
      templates={templates}
      busy={isCreating}
      onSelect={(template) => void onSelect(template)}
    />
  );
};
