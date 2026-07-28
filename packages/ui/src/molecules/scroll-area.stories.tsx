import type { Meta, StoryObj } from "@storybook/react-vite";

import { Separator } from "../atoms/separator";
import { ScrollArea } from "./scroll-area";

const meta = {
  title: "Molecules/ScrollArea",
  component: ScrollArea,
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const VersionHistory: Story = {
  render: () => (
    <ScrollArea className="h-64 w-72 rounded-md border">
      <div className="p-4">
        <p className="mb-3 text-sm font-medium">Version history</p>
        {Array.from({ length: 24 }, (_, index) => (
          <div key={index}>
            <p className="py-2 text-sm text-muted-foreground">
              Edit {24 - index} · {index === 0 ? "just now" : `${index}h ago`}
            </p>
            <Separator />
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};
