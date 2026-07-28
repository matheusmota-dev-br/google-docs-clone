import type { Config } from "tailwindcss";
import sharedConfig from "@repo/tailwind-config";

export default {
  presets: [sharedConfig as Omit<Config, "content">],
  content: [
    "./.storybook/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx,mdx}",
    // The components being documented live in the design system package.
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
} satisfies Config;
