import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../atoms/button";
import { Input } from "../atoms/input";
import { Label } from "../atoms/label";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

const meta = {
  title: "Molecules/Popover",
  component: Popover,
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The toolbar's "insert link" affordance. */
export const InsertLink: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Insert link</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 space-y-3">
        <Label htmlFor="link-url">URL</Label>
        <div className="flex gap-2">
          <Input id="link-url" placeholder="https://example.com" />
          <Button size="sm">Apply</Button>
        </div>
      </PopoverContent>
    </Popover>
  ),
};
