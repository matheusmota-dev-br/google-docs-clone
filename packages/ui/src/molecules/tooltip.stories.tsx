import type { Meta, StoryObj } from "@storybook/react-vite";
import { BoldIcon } from "lucide-react";

import { Button } from "../atoms/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";

const meta = {
  title: "Molecules/Tooltip",
  component: Tooltip,
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A tooltip labels an icon-only control. It must never carry information the
 * user needs but cannot get anywhere else — it is invisible to touch users.
 */
export const IconButton: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Bold">
            <BoldIcon />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Bold (⌘B)</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};
