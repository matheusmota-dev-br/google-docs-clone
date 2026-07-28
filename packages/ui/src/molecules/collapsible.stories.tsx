import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChevronsUpDownIcon } from "lucide-react";

import { Button } from "../atoms/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./collapsible";

const meta = {
  title: "Molecules/Collapsible",
  component: Collapsible,
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Collapsible>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Collapsible className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Advanced page setup</p>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Toggle">
            <ChevronsUpDownIcon className="size-4" />
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="space-y-2 text-sm text-muted-foreground">
        <p className="rounded-md border px-3 py-2">Left margin — 56 px</p>
        <p className="rounded-md border px-3 py-2">Right margin — 56 px</p>
      </CollapsibleContent>
    </Collapsible>
  ),
};
