import { config } from "@repo/eslint-config/base";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...config,
  {
    rules: {
      // Nest's DI relies on parameter decorators and empty constructors.
      "@typescript-eslint/no-extraneous-class": "off",
    },
  },
];
