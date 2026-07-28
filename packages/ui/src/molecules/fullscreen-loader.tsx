import * as React from "react";

import { Spinner } from "../atoms/spinner";
import { cn } from "../lib/utils";

export interface FullscreenLoaderProps extends React.ComponentPropsWithoutRef<"div"> {
  label?: string;
}

/** Blocking, full-viewport loading state used by route-level suspense boundaries. */
const FullscreenLoader = ({ label, className, ...props }: FullscreenLoaderProps) => (
  <div
    className={cn(
      "flex min-h-screen flex-col items-center justify-center gap-2",
      className,
    )}
    {...props}
  >
    <Spinner size="md" label={label ?? "Loading"} />
    {label && <p className="text-sm text-muted-foreground">{label}</p>}
  </div>
);
FullscreenLoader.displayName = "FullscreenLoader";

export { FullscreenLoader };
