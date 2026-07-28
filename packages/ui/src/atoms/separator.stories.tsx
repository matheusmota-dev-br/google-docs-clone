import type { Meta, StoryObj } from "@storybook/react-vite";

import { Separator } from "./separator";

const meta = {
  title: "Atoms/Separator",
  component: Separator,
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: () => (
    <div className="w-72 space-y-3 text-sm">
      <p className="font-medium">Document settings</p>
      <Separator />
      <p className="text-muted-foreground">Page setup, margins and export.</p>
    </div>
  ),
};

/** Toolbars use the vertical orientation to group related controls. */
export const Vertical: Story = {
  render: () => (
    <div className="flex h-6 items-center gap-3 text-sm">
      <span>Edit</span>
      <Separator orientation="vertical" />
      <span>View</span>
      <Separator orientation="vertical" />
      <span>Insert</span>
    </div>
  ),
};
