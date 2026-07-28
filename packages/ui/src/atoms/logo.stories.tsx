import type { Meta, StoryObj } from "@storybook/react-vite";

import { Logo } from "./logo";

const meta = {
  title: "Atoms/Logo",
  component: Logo,
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const MarkOnly: Story = { args: { markOnly: true } };

/** The glyph inherits `currentColor`, so it works on any surface. */
export const OnColour: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex items-center gap-6">
      <div className="rounded-lg bg-background p-4">
        <Logo />
      </div>
      <div className="rounded-lg bg-primary p-4 text-primary-foreground [&_svg]:text-primary-foreground">
        <Logo />
      </div>
    </div>
  ),
};
