import { Mark, mergeAttributes } from "@tiptap/react";

export interface CommentMarkOptions {
  HTMLAttributes: Record<string, unknown>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    comment: {
      /** Anchors a comment thread to the current selection. */
      setCommentThread: (threadId: string) => ReturnType;
      /** Removes the anchor for a thread, wherever it appears. */
      unsetCommentThread: (threadId: string) => ReturnType;
    };
  }
}

/**
 * The anchor that ties a comment thread to a span of text.
 *
 * The mark lives in the document, which means it travels through Yjs like any
 * other formatting: everyone sees the same highlight, and the anchor follows
 * the text as it is edited around it. The conversation itself is stored
 * separately in the document's `threads` map.
 */
export const CommentMark = Mark.create<CommentMarkOptions>({
  name: "comment",

  // Comments overlap other formatting and each other, and must not be carried
  // onto text typed at the edges of the highlight.
  inclusive: false,
  excludes: "",
  keepOnSplit: false,

  addOptions() {
    return { HTMLAttributes: {} };
  },

  addAttributes() {
    return {
      threadId: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-thread-id"),
        renderHTML: (attributes) =>
          attributes.threadId ? { "data-thread-id": attributes.threadId } : {},
      },
    };
  },

  parseHTML() {
    return [{ tag: "span[data-thread-id]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        class: "comment-anchor",
      }),
      0,
    ];
  },

  addCommands() {
    return {
      setCommentThread:
        (threadId) =>
        ({ commands }) =>
          commands.setMark(this.name, { threadId }),

      unsetCommentThread:
        (threadId) =>
        ({ state, tr, dispatch }) => {
          const type = state.schema.marks[this.name];
          if (!type) return false;

          let found = false;
          state.doc.descendants((node, pos) => {
            if (!node.isText) return;

            const mark = node.marks.find(
              (candidate) =>
                candidate.type === type && candidate.attrs.threadId === threadId,
            );

            if (mark) {
              tr.removeMark(pos, pos + node.nodeSize, mark);
              found = true;
            }
          });

          if (found && dispatch) dispatch(tr);

          return found;
        },
    };
  },
});
