"use client";

import { useEffect, useRef, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import Image from "@tiptap/extension-image";
import ImageResize from "tiptap-extension-resize-image";
import Underline from "@tiptap/extension-underline";
import FontFamily from "@tiptap/extension-font-family";
import TextStyle from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import { Color } from "@tiptap/extension-color";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import { PROSE_FIELD, getMargins, metaMap } from "@repo/collab";

import { CommentMark } from "@/extensions/comment";
import { FontSizeExtension } from "@/extensions/font-size";
import { LineHeightExtension } from "@/extensions/line-height";
import type { DocumentDto } from "@/lib/api";
import { useCommentsStore } from "@/store/use-comments-store";
import { useEditorStore } from "@/store/use-editor-store";
import { useCollaboration } from "./collaboration-provider";
import { Ruler } from "./ruler";
import { Threads } from "./threads";

interface EditorProps {
  document: DocumentDto;
}

export const Editor = ({ document: documentDto }: EditorProps) => {
  const { doc, provider, synced, self } = useCollaboration();
  const { setEditor } = useEditorStore();
  const setActiveThread = useCommentsStore((state) => state.setActiveThread);

  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [margins, setMargins] = useState(() => getMargins(doc));
  const seeded = useRef(false);

  useEffect(() => {
    const meta = metaMap(doc);
    const sync = () => setMargins(getMargins(doc));

    sync();
    meta.observe(sync);

    return () => meta.unobserve(sync);
  }, [doc]);

  const editor = useEditor(
    {
      autofocus: true,
      immediatelyRender: false,
      onCreate: ({ editor: instance }) => setEditor(instance),
      onDestroy: () => setEditor(null),
      onUpdate: ({ editor: instance }) => setEditor(instance),
      onSelectionUpdate: ({ editor: instance }) => setEditor(instance),
      onTransaction: ({ editor: instance }) => setEditor(instance),
      onFocus: ({ editor: instance }) => setEditor(instance),
      onBlur: ({ editor: instance }) => setEditor(instance),
      onContentError: ({ editor: instance }) => setEditor(instance),
      editorProps: {
        attributes: {
          class:
            "flex min-h-[1054px] w-[816px] cursor-text flex-col rounded-sm border bg-card pb-10 pr-10 pt-10 shadow-paper focus:outline-none print:border-0 print:shadow-none",
        },
        /** Clicking highlighted text selects that conversation in the sidebar. */
        handleClickOn: (_view, _pos, node) => {
          const mark = node.marks?.find((candidate) => candidate.type.name === "comment");
          if (mark?.attrs.threadId) setActiveThread(mark.attrs.threadId as string);

          return false;
        },
      },
      extensions: [
        // Yjs owns undo/redo once Collaboration is installed.
        StarterKit.configure({ history: false }),
        Collaboration.configure({ document: doc, field: PROSE_FIELD }),
        CollaborationCursor.configure({
          provider,
          user: { name: self.name, color: self.color },
        }),
        CommentMark,
        LineHeightExtension,
        FontSizeExtension,
        TextAlign.configure({ types: ["heading", "paragraph"] }),
        Link.configure({ openOnClick: false, autolink: true, defaultProtocol: "https" }),
        Color,
        Highlight.configure({ multicolor: true }),
        FontFamily,
        TextStyle,
        Underline,
        TaskList,
        TaskItem.configure({ nested: true }),
        Table.configure({ resizable: true }),
        TableRow,
        TableHeader,
        TableCell,
        Image,
        ImageResize,
      ],
    },
    [doc, provider],
  );

  // Margins are shared state, so they change without the editor being recreated.
  useEffect(() => {
    if (!editor) return;

    const attributes = editor.options.editorProps.attributes as Record<string, string>;

    editor.setOptions({
      editorProps: {
        ...editor.options.editorProps,
        attributes: {
          ...attributes,
          style: `padding-left: ${margins.leftMargin}px; padding-right: ${margins.rightMargin}px;`,
        },
      },
    });
  }, [editor, margins.leftMargin, margins.rightMargin]);

  /**
   * Templates seed the document the first time it is opened.
   *
   * Only the owner does it, and only into a genuinely empty document, so two
   * people opening a fresh template at the same time cannot both write it.
   */
  useEffect(() => {
    if (!editor || !synced || seeded.current) return;
    seeded.current = true;

    const isOwner = documentDto.ownerId === self.id;
    const isEmpty = doc.getXmlFragment(PROSE_FIELD).length === 0;

    if (isOwner && isEmpty && documentDto.initialContent) {
      editor.commands.setContent(documentDto.initialContent, false);
    }
  }, [editor, synced, doc, documentDto.initialContent, documentDto.ownerId, self.id]);

  return (
    <div className="size-full overflow-x-auto bg-canvas px-4 print:overflow-visible print:bg-white print:p-0">
      <Ruler />
      <div
        ref={setContainer}
        className="relative mx-auto flex w-fit min-w-max items-start gap-6 py-4 print:block print:w-full print:min-w-0 print:py-0"
      >
        <EditorContent editor={editor} />
        <div className="hidden print:hidden lg:block">
          <Threads editor={editor} container={container} />
        </div>
      </div>
    </div>
  );
};
