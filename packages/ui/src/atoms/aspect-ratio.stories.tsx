import type { Meta, StoryObj } from "@storybook/react-vite";

import { AspectRatio } from "./aspect-ratio";

const meta = {
  title: "Atoms/AspectRatio",
  component: AspectRatio,
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AspectRatio>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A4-ish 3:4 is the ratio every document thumbnail in the product uses. */
export const DocumentThumbnail: Story = {
  args: { ratio: 3 / 4 },
  render: (args) => (
    <AspectRatio {...args}>
      <div className="flex size-full items-center justify-center rounded-md border bg-card text-sm text-muted-foreground">
        3 : 4
      </div>
    </AspectRatio>
  ),
};

export const Widescreen: Story = {
  args: { ratio: 16 / 9 },
  render: (args) => (
    <AspectRatio {...args}>
      <div className="flex size-full items-center justify-center rounded-md border bg-card text-sm text-muted-foreground">
        16 : 9
      </div>
    </AspectRatio>
  ),
};
