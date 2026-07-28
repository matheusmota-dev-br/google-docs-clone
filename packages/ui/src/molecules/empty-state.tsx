import * as React from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "../lib/utils";

export interface EmptyStateProps extends React.ComponentPropsWithoutRef<"div"> {
  icon?: LucideIcon;
  title: string;
  description?: string;
  /** Primary call to action — usually a `<Button>`. */
  action?: React.ReactNode;
}

/**
 * Shown wherever a collection is legitimately empty (no documents, no search
 * results). Distinct from a loading state on purpose: an empty state always
 * explains *why* it is empty and offers the next step.
 */
const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) => (
  <div
    className={cn(
      "flex flex-col items-center justify-center gap-3 px-6 py-14 text-center",
      className,
    )}
    {...props}
  >
    {Icon && (
      <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Icon className="size-6" aria-hidden />
      </span>
    )}
    <div className="space-y-1">
      <p className="font-medium text-foreground">{title}</p>
      {description && (
        <p className="mx-auto max-w-sm text-sm text-muted-foreground">{description}</p>
      )}
    </div>
    {action}
  </div>
);
EmptyState.displayName = "EmptyState";

export { EmptyState };
