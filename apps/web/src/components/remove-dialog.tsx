"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@repo/ui/molecules";

import { useApi } from "@/hooks/use-api";

interface RemoveDialogProps {
  documentId: string;
  children: React.ReactNode;
  /** Called after a successful delete; omit to navigate home instead. */
  onRemoved?: () => void;
}

export const RemoveDialog = ({ documentId, children, onRemoved }: RemoveDialogProps) => {
  const router = useRouter();
  const { request } = useApi();
  const [isRemoving, setIsRemoving] = useState(false);

  const onConfirm = async () => {
    setIsRemoving(true);

    try {
      await request(`/documents/${documentId}`, { method: "DELETE" });
      toast.success("Document removed");

      if (onRemoved) onRemoved();
      else router.push("/");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent onClick={(event) => event.stopPropagation()}>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your document.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isRemoving}
            onClick={(event) => {
              event.stopPropagation();
              void onConfirm();
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
