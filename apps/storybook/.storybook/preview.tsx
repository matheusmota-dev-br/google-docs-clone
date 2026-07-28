import type { Preview } from "@storybook/react-vite";
import { withThemeByClassName } from "@storybook/addon-themes";
import { Toaster } from "@repo/ui/molecules";

import "./preview.css";

const preview: Preview = {
  parameters: {
    layout: "centered",
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
      expanded: true,
    },
    backgrounds: { disable: true },
    a11y: { test: "todo" },
    options: {
      /**
       * Sort the sidebar by Atomic Design layer instead of alphabetically, so
       * the navigation reads bottom-up the way the system is built.
       */
      storySort: {
        order: [
          "Getting Started",
          "Foundations",
          "Atoms",
          "Molecules",
          "Organisms",
          "Templates",
        ],
      },
    },
    docs: {
      codePanel: true,
    },
  },
  decorators: [
    withThemeByClassName({
      themes: { light: "", dark: "dark" },
      defaultTheme: "light",
    }),
    (Story) => (
      <div className="bg-background text-foreground">
        <Story />
        <Toaster />
      </div>
    ),
  ],
  tags: ["autodocs"],
};

export default preview;
