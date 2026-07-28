import type { Meta, StoryObj } from "@storybook/react-vite";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./resizable";

const meta: Meta<typeof ResizablePanelGroup> = {
  title: "Molecules/Resizable",
  component: ResizablePanelGroup,
};

export default meta;
type Story = StoryObj<typeof ResizablePanelGroup>;

export const DocumentAndComments: Story = {
  render: () => (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-56 w-[36rem] rounded-lg border"
    >
      <ResizablePanel defaultSize={70}>
        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
          Document
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={30}>
        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
          Comments
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
};
