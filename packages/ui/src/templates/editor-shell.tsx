import * as React from "react";

import { cn } from "../lib/utils";

export interface EditorShellProps extends React.ComponentPropsWithoutRef<"div"> {
  /** Document title, menus and collaborators. */
  navbar: React.ReactNode;
  /** Formatting controls, pinned directly under the navbar. */
  toolbar: React.ReactNode;
}

/**
 * Page skeleton for the editor: a pinned chrome stack (navbar + toolbar) above
 * the scrollable "desk" the paper sits on. Everything in the chrome is hidden
 * when printing so the exported PDF contains only the document itself.
 */
const EditorShell = ({
  navbar,
  toolbar,
  children,
  className,
  ...props
}: EditorShellProps) => (
  <div className={cn("min-h-screen bg-canvas", className)} {...props}>
    <div className="fixed inset-x-0 top-0 z-20 flex flex-col gap-y-2 bg-canvas px-4 pt-2 print:hidden">
      {navbar}
      {toolbar}
    </div>
    <div className="pt-[114px] print:pt-0">{children}</div>
  </div>
);
EditorShell.displayName = "EditorShell";

export { EditorShell };
