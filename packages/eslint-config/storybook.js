import storybook from "eslint-plugin-storybook";

import { config as reactLibraryConfig } from "./react-library.js";

/**
 * ESLint configuration for the Storybook workspace and for `*.stories.tsx`
 * files anywhere in the monorepo.
 *
 * @type {import("eslint").Linter.Config[]}
 */
export const config = [...reactLibraryConfig, ...storybook.configs["flat/recommended"]];
