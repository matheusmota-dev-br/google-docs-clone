"use client";

import { useCallback, useEffect, useState } from "react";
import type { Editor } from "@tiptap/react";

/**
 * Where each comment thread's highlighted text sits, in pixels from the top of
 * `container`.
 *
 * Measured from the live DOM rather than from document positions: the sidebar
 * has to line up with what is on screen, including wrapped lines, images and
 * tables. Recomputed whenever the document changes or the window resizes.
 */
export function useThreadAnchors(
  editor: Editor | null,
  container: HTMLElement | null,
): Record<string, number> {
  const [anchors, setAnchors] = useState<Record<string, number>>({});

  const measure = useCallback(() => {
    if (!editor || !container) return;

    const containerTop = container.getBoundingClientRect().top;
    const next: Record<string, number> = {};

    editor.state.doc.descendants((node, pos) => {
      if (!node.isText) return;

      for (const mark of node.marks) {
        const threadId = mark.attrs.threadId as string | undefined;
        if (mark.type.name !== "comment" || !threadId || threadId in next) continue;

        try {
          next[threadId] = Math.max(0, editor.view.coordsAtPos(pos).top - containerTop);
        } catch {
          // Position no longer resolvable mid-transaction; the next pass gets it.
        }
      }
    });

    setAnchors((current) => {
      const unchanged =
        Object.keys(next).length === Object.keys(current).length &&
        Object.entries(next).every(([id, top]) => current[id] === top);

      return unchanged ? current : next;
    });
  }, [editor, container]);

  useEffect(() => {
    if (!editor) return;

    // The first pass waits for a frame: `coordsAtPos` needs the prose laid out
    // before it can report where anything actually is.
    const first = requestAnimationFrame(measure);

    editor.on("update", measure);
    editor.on("selectionUpdate", measure);
    window.addEventListener("resize", measure);

    return () => {
      cancelAnimationFrame(first);
      editor.off("update", measure);
      editor.off("selectionUpdate", measure);
      window.removeEventListener("resize", measure);
    };
  }, [editor, measure]);

  return anchors;
}
