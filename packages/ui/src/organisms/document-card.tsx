"use client";

import * as React from "react";

import { cn } from "../lib/utils";

export interface DocumentCardProps extends Omit<
  React.ComponentPropsWithoutRef<"button">,
  "title"
> {
  title: string;
  /** Preview image for the template/document. */
  previewUrl?: string;
  /** Renders the highlighted "start here" treatment. */
  featured?: boolean;
}

/**
 * A tappable A4-ratio thumbnail used by the template gallery. It is a real
 * `<button>` so keyboard and screen-reader users get the same affordance as a
 * mouse click.
 */
const DocumentCard = React.forwardRef<HTMLButtonElement, DocumentCardProps>(
  ({ title, previewUrl, featured = false, className, disabled, ...props }, ref) => (
    <div className={cn("flex flex-col gap-y-2.5", className)}>
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        aria-label={`Create a document from the ${title} template`}
        style={
          previewUrl
            ? {
                backgroundImage: `url(${previewUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }
            : undefined
        }
        className={cn(
          "aspect-[3/4] w-full rounded-md border bg-card transition-all",
          "hover:-translate-y-0.5 hover:border-primary hover:shadow-paper",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          featured && "border-primary/50 ring-1 ring-primary/20",
        )}
        {...props}
      />
      <p className="truncate text-sm font-medium">{title}</p>
    </div>
  ),
);
DocumentCard.displayName = "DocumentCard";

export { DocumentCard };
