import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { LoaderIcon } from "lucide-react";

import { cn } from "../lib/utils";

const spinnerVariants = cva("animate-spin text-muted-foreground", {
  variants: {
    size: {
      sm: "size-4",
      md: "size-6",
      lg: "size-10",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export interface SpinnerProps
  extends
    Omit<React.ComponentPropsWithoutRef<"span">, "children">,
    VariantProps<typeof spinnerVariants> {
  /** Announced to assistive tech while the spinner is visible. */
  label?: string;
}

/**
 * The single indeterminate loading indicator of the design system. Everything
 * that waits — pages, tables, buttons — renders this so "loading" always looks
 * the same.
 */
const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(
  ({ className, size, label = "Loading", ...props }, ref) => (
    <span
      ref={ref}
      role="status"
      aria-live="polite"
      className={cn("inline-flex", className)}
      {...props}
    >
      <LoaderIcon aria-hidden className={spinnerVariants({ size })} />
      <span className="sr-only">{label}</span>
    </span>
  ),
);
Spinner.displayName = "Spinner";

export { Spinner, spinnerVariants };
