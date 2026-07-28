import type { Config } from "tailwindcss";
import sharedConfig from "@repo/tailwind-config";

export default {
  presets: [sharedConfig as Omit<Config, "content">],
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    // Class names used by the design system have to be scanned too.
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
} satisfies Config;
