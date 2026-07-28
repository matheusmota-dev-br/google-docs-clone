import { create } from "zustand";

interface PendingThread {
  id: string;
  /** The text the new thread is anchored to. */
  quote: string;
}

interface CommentsState {
  /** A thread whose anchor exists but whose first comment has not been written. */
  pending: PendingThread | null;
  /** The thread currently highlighted in the sidebar. */
  activeThreadId: string | null;
  /** Hide resolved threads in the sidebar. */
  showResolved: boolean;

  startThread: (thread: PendingThread) => void;
  cancelThread: () => void;
  setActiveThread: (threadId: string | null) => void;
  toggleShowResolved: () => void;
}

/**
 * UI state for commenting. The threads themselves live in the document's
 * Y.Doc — this only tracks what the person in front of the screen is doing.
 */
export const useCommentsStore = create<CommentsState>((set) => ({
  pending: null,
  activeThreadId: null,
  showResolved: false,

  startThread: (pending) => set({ pending, activeThreadId: pending.id }),
  cancelThread: () => set({ pending: null }),
  setActiveThread: (activeThreadId) => set({ activeThreadId }),
  toggleShowResolved: () => set((state) => ({ showResolved: !state.showResolved })),
}));
