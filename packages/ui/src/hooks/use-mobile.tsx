import * as React from "react";

const MOBILE_BREAKPOINT = 768;
const QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`;

const subscribe = (onChange: () => void) => {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
};

/**
 * `true` below the `md` breakpoint.
 *
 * Backed by `useSyncExternalStore` rather than an effect, so the first client
 * render already has the right answer instead of flashing the desktop layout.
 * The server snapshot is `false`: markup is rendered desktop-first and
 * corrected on hydration.
 */
export function useIsMobile() {
  return React.useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
