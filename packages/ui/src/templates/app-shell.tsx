import * as React from "react";

import { cn } from "../lib/utils";

export interface AppShellProps extends React.ComponentPropsWithoutRef<"div"> {
  /** Pinned to the top of the viewport — usually an `<AppHeader>`. */
  header: React.ReactNode;
}

/**
 * Page skeleton for the document browser: one fixed 4rem header over a
 * scrolling body. Templates own layout and spacing only — never data.
 */
const AppShell = ({ header, children, className, ...props }: AppShellProps) => (
  <div className={cn("flex min-h-screen flex-col bg-background", className)} {...props}>
    <div className="fixed inset-x-0 top-0 z-20 h-16 border-b bg-background">{header}</div>
    <main className="mt-16 flex-1">{children}</main>
  </div>
);
AppShell.displayName = "AppShell";

export { AppShell };
