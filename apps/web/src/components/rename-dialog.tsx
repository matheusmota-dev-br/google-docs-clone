"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button, Input } from "@repo/ui/atoms";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/molecules";

import { useApi } from "@/hooks/use-api";

interface RenameDialogProps {
  documentId: string;
  initialTitle: string;
  children: React.ReactNode;
  onRenamed?: () => void;
}

export const RenameDialog = ({
  documentId,
  initialTitle,
  children,
  onRenamed,
}: RenameDialogProps) => {
  const { request } = useApi();
  const [isUpdating, setIsUpdating] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [open, setOpen] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsUpdating(true);

    try {
      await request(`/documents/${documentId}`, {
        method: "PATCH",
        body: { title: title.trim() || "Untitled document" },
      });
      toast.success("Document renamed");
      onRenamed?.();
      setOpen(false);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent onClick={(event) => event.stopPropagation()}>
        <form onSubmit={(event) => void onSubmit(event)}>
          <DialogHeader>
            <DialogTitle>Rename document</DialogTitle>
            <DialogDescription>Enter a new name for this document.</DialogDescription>
          </DialogHeader>
          <div className="my-4">
            <Input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Document name"
              aria-label="Document name"
              onClick={(event) => event.stopPropagation()}
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              disabled={isUpdating}
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isUpdating}>
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
