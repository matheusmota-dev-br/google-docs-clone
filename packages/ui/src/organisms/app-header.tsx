import * as React from "react";

import { Logo } from "../atoms/logo";
import { cn } from "../lib/utils";

export interface AppHeaderProps extends React.ComponentPropsWithoutRef<"header"> {
  /** Left slot. Defaults to the bare `<Logo>`; apps wrap it in a link. */
  brand?: React.ReactNode;
  /** Centre slot, normally a `<SearchField>`. */
  search?: React.ReactNode;
  /** Right slot: org switcher, avatar, notifications. */
  actions?: React.ReactNode;
}

/**
 * Top-level product bar: brand on the left, search in the middle, account
 * controls on the right. Slots rather than props so app-specific widgets
 * (Clerk, Liveblocks) never leak into the design system.
 */
const AppHeader = ({ brand, search, actions, className, ...props }: AppHeaderProps) => (
  <header
    className={cn("flex h-16 w-full items-center gap-6 bg-background px-4", className)}
    {...props}
  >
    <div className="flex shrink-0 items-center">{brand ?? <Logo />}</div>
    <div className="flex flex-1 justify-center">{search}</div>
    <div className="flex shrink-0 items-center gap-3">{actions}</div>
  </header>
);
AppHeader.displayName = "AppHeader";

export { AppHeader };
