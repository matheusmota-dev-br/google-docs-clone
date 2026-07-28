import * as React from "react";

import { cn } from "../lib/utils";

export interface LogoProps extends React.ComponentPropsWithoutRef<"span"> {
  /** Hide the wordmark and render the glyph only (mobile headers, favicons). */
  markOnly?: boolean;
  /** Text rendered next to the glyph. */
  wordmark?: string;
}

/**
 * Product lockup: a folded-corner page glyph plus the wordmark. Inline SVG on
 * purpose — it inherits `currentColor` so the same component works on light
 * surfaces, dark surfaces and inside a coloured button.
 */
const Logo = React.forwardRef<HTMLSpanElement, LogoProps>(
  ({ className, markOnly = false, wordmark = "Docs", ...props }, ref) => (
    <span
      ref={ref}
      className={cn("inline-flex items-center gap-2", className)}
      {...props}
    >
      <svg viewBox="0 0 24 24" aria-hidden className="size-7 shrink-0 text-primary">
        <path
          fill="currentColor"
          d="M14.5 2H7a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7.5L14.5 2Z"
          opacity={0.18}
        />
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth={1.6}
          strokeLinejoin="round"
          d="M14.5 2.75H7A2.25 2.25 0 0 0 4.75 5v14A2.25 2.25 0 0 0 7 21.25h10A2.25 2.25 0 0 0 19.25 19V7.5L14.5 2.75Z"
        />
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth={1.6}
          strokeLinejoin="round"
          d="M14.25 3v4.25h4.5"
        />
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth={1.6}
          strokeLinecap="round"
          d="M8 12h8M8 15.25h8M8 18.5h4.5"
        />
      </svg>
      {!markOnly && (
        <span className="text-xl font-medium tracking-tight">{wordmark}</span>
      )}
    </span>
  ),
);
Logo.displayName = "Logo";

export { Logo };
