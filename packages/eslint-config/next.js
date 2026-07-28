import globals from "globals";
import pluginNext from "@next/eslint-plugin-next";

import { config as reactLibraryConfig } from "./react-library.js";

/**
 * ESLint configuration for Next.js applications (`apps/web`).
 *
 * @type {import("eslint").Linter.Config[]}
 */
export const config = [
  ...reactLibraryConfig,
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    plugins: {
      "@next/next": pluginNext,
    },
    rules: {
      ...pluginNext.configs.recommended.rules,
      ...pluginNext.configs["core-web-vitals"].rules,
    },
  },
];
