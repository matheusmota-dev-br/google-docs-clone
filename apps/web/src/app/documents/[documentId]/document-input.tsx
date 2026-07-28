"use client";

import { useRef, useState } from "react";
import { LoaderIcon } from "lucide-react";
import { BsCloudCheck, BsCloudSlash } from "react-icons/bs";
import { toast } from "sonner";

import { useApi } from "@/hooks/use-api";
import { useDebounce } from "@/hooks/use-debounce";
import { useCollaboration } from "./collaboration-provider";

interface DocumentInputProps {
  title: string;
  id: string;
}

export const DocumentInput = ({ title, id }: DocumentInputProps) => {
  // The title lives in Postgres, but the cloud icon reports the *document*
  // connection, which is what people actually worry about losing.
  const { status } = useCollaboration();
  const { request } = useApi();

  const [value, setValue] = useState(title);
  const [isPending, setIsPending] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const rename = async (nextTitle: string) => {
    setIsPending(true);
    try {
      await request(`/documents/${id}`, {
        method: "PATCH",
        body: { title: nextTitle.trim() || "Untitled document" },
      });
      toast.success("Document updated");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsPending(false);
    }
  };

  const debouncedRename = useDebounce((nextTitle: string) => {
    if (nextTitle === title) return;
    void rename(nextTitle);
  });

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    debouncedRename(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await rename(value);
    setIsEditing(false);
  };

  const showLoader = isPending || status === "connecting";
  const showError = status === "disconnected";

  return (
    <div className="flex items-center gap-2">
      {isEditing ? (
        <form
          onSubmit={(event) => void handleSubmit(event)}
          className="relative w-fit max-w-[50ch]"
        >
          <span className="invisible whitespace-pre px-1.5 text-lg">{value || " "}</span>
          <input
            ref={inputRef}
            value={value}
            onChange={onChange}
            onBlur={() => setIsEditing(false)}
            aria-label="Document title"
            className="absolute inset-0 truncate bg-transparent px-1.5 text-lg"
          />
        </form>
      ) : (
        <button
          type="button"
          onClick={() => {
            setIsEditing(true);
            setTimeout(() => inputRef.current?.focus(), 0);
          }}
          className="truncate rounded-sm px-1.5 text-lg hover:bg-muted"
        >
          {value}
        </button>
      )}
      {showError && <BsCloudSlash className="size-4 text-destructive" title="Offline" />}
      {!showError && !showLoader && <BsCloudCheck className="size-4" title="Saved" />}
      {showLoader && <LoaderIcon className="size-4 animate-spin text-muted-foreground" />}
    </div>
  );
};
