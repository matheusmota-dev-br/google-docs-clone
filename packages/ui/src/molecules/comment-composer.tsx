"use client";

import * as React from "react";

import { Button } from "../atoms/button";
import { Textarea } from "../atoms/textarea";
import { cn } from "../lib/utils";

export interface MentionableMember {
  id: string;
  name: string;
}

export interface CommentSubmission {
  body: string;
  /** Ids of the members referenced with `@` in the body. */
  mentions: string[];
}

export interface CommentComposerProps extends Omit<
  React.ComponentPropsWithoutRef<"div">,
  "onSubmit"
> {
  members?: MentionableMember[];
  placeholder?: string;
  submitLabel?: string;
  autoFocus?: boolean;
  busy?: boolean;
  onSubmit: (submission: CommentSubmission) => void;
  onCancel?: () => void;
}

/** The `@word` immediately before the caret, if the caret is inside one. */
const mentionQueryAt = (value: string, caret: number) => {
  const upToCaret = value.slice(0, caret);
  const match = /(?:^|\s)@([\p{L}\p{N}._-]*)$/u.exec(upToCaret);

  return match
    ? { query: match[1] ?? "", start: caret - (match[1]?.length ?? 0) - 1 }
    : null;
};

/**
 * Writes a comment, with `@` mention completion.
 *
 * Deliberately a plain textarea rather than a second rich-text editor: a
 * comment box that behaves like the OS text field is easier to use than one
 * that almost behaves like the document.
 */
const CommentComposer = ({
  members = [],
  placeholder = "Add a comment…",
  submitLabel = "Comment",
  autoFocus = false,
  busy = false,
  onSubmit,
  onCancel,
  className,
  ...props
}: CommentComposerProps) => {
  const [value, setValue] = React.useState("");
  const [mention, setMention] = React.useState<{ query: string; start: number } | null>(
    null,
  );
  const [highlighted, setHighlighted] = React.useState(0);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const suggestions = React.useMemo(() => {
    if (!mention) return [];
    const query = mention.query.toLowerCase();

    return members
      .filter((member) => member.name.toLowerCase().includes(query))
      .slice(0, 5);
  }, [members, mention]);

  const syncMention = (next: string, caret: number) => {
    setMention(members.length > 0 ? mentionQueryAt(next, caret) : null);
    setHighlighted(0);
  };

  const insertMention = (member: MentionableMember) => {
    if (!mention) return;

    const before = value.slice(0, mention.start);
    const after = value.slice(mention.start + 1 + mention.query.length);
    const next = `${before}@${member.name} ${after}`;

    setValue(next);
    setMention(null);
    queueMicrotask(() => {
      const caret = before.length + member.name.length + 2;
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(caret, caret);
    });
  };

  const submit = () => {
    const body = value.trim();
    if (!body || busy) return;

    const mentioned = members
      .filter((member) => body.includes(`@${member.name}`))
      .map((member) => member.id);

    onSubmit({ body, mentions: [...new Set(mentioned)] });
    setValue("");
    setMention(null);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (suggestions.length > 0) {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setHighlighted((index) => (index + 1) % suggestions.length);
        return;
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setHighlighted((index) => (index - 1 + suggestions.length) % suggestions.length);
        return;
      }
      if (event.key === "Enter" || event.key === "Tab") {
        const member = suggestions[highlighted];
        if (member) {
          event.preventDefault();
          insertMention(member);
          return;
        }
      }
      if (event.key === "Escape") {
        event.preventDefault();
        setMention(null);
        return;
      }
    }

    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      submit();
    }

    if (event.key === "Escape") onCancel?.();
  };

  return (
    <div className={cn("relative space-y-2", className)} {...props}>
      <Textarea
        ref={textareaRef}
        value={value}
        autoFocus={autoFocus}
        placeholder={placeholder}
        rows={2}
        aria-label={placeholder}
        onKeyDown={onKeyDown}
        onChange={(event) => {
          setValue(event.target.value);
          syncMention(event.target.value, event.target.selectionStart);
        }}
        className="min-h-[4.5rem] resize-none text-sm"
      />

      {suggestions.length > 0 && (
        <ul
          role="listbox"
          aria-label="Mention a teammate"
          className="absolute z-30 max-h-48 w-full overflow-auto rounded-md border bg-popover p-1 shadow-md"
        >
          {suggestions.map((member, index) => (
            <li key={member.id}>
              <button
                type="button"
                role="option"
                aria-selected={index === highlighted}
                onMouseDown={(event) => {
                  event.preventDefault();
                  insertMention(member);
                }}
                className={cn(
                  "w-full rounded-sm px-2 py-1.5 text-left text-sm",
                  index === highlighted && "bg-accent text-accent-foreground",
                )}
              >
                {member.name}
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-center justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button
          type="button"
          size="sm"
          onClick={submit}
          disabled={busy || value.trim().length === 0}
        >
          {submitLabel}
        </Button>
      </div>
    </div>
  );
};
CommentComposer.displayName = "CommentComposer";

export { CommentComposer };
