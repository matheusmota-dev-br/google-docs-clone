import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import type { StorybookConfig } from "@storybook/react-vite";

const here = dirname(fileURLToPath(import.meta.url));
const uiPackage = resolve(here, "../../../packages/ui");
const webPublic = resolve(here, "../../web/public");

const config: StorybookConfig = {
  /**
   * Component stories live next to the components they document inside
   * `@repo/ui`, so a component and its documentation are always renamed, moved
   * and reviewed together. Everything under `src` here is hand-written guides
   * and token galleries.
   */
  stories: [
    join(here, "../src/**/*.mdx"),
    join(here, "../src/**/*.stories.@(ts|tsx)"),
    join(uiPackage, "src/**/*.stories.@(ts|tsx)"),
  ],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y", "@storybook/addon-themes"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  // Serve the app's real template artwork so stories show the real product.
  staticDirs: [{ from: webPublic, to: "/" }],
  typescript: {
    // Prop tables are generated from each component's TypeScript types.
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
      propFilter: (prop) => !/node_modules/.test(prop.parent?.fileName ?? ""),
    },
  },
};

export default config;
