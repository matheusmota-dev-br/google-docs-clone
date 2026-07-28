import type { Config } from "tailwindcss";

/**
 * Shared Tailwind preset for the whole monorepo.
 *
 * Every colour maps to a CSS custom property defined in
 * `@repo/ui/styles.css`, so light/dark theming is a single class swap
 * on `<html>` and never a rebuild.
 */
declare const preset: Omit<Config, "content">;

export = preset;
