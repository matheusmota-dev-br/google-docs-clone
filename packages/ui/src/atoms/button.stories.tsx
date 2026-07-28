import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowRightIcon, TrashIcon } from "lucide-react";

import { Button } from "./button";

/**
 * The primary action element. Everything clickable that is not a link renders
 * a `<Button>`; use `asChild` to keep the styling while swapping the tag.
 */
const meta = {
  title: "Atoms/Button",
  component: Button,
  args: { children: "Share" },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["default", "secondary", "outline", "ghost", "link", "destructive"],
    },
    size: { control: "inline-radio", options: ["sm", "default", "lg", "icon"] },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Every variant side by side — the quickest way to pick the right emphasis. */
export const Variants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button>Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
      <Button variant="destructive">Destructive</Button>
    </div>
  ),
};

export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex items-center gap-3">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon" aria-label="Delete">
        <TrashIcon />
      </Button>
    </div>
  ),
};

/** Icons are sized automatically by the button's `[&_svg]` rules. */
export const WithIcon: Story = {
  args: {
    children: (
      <>
        Continue <ArrowRightIcon />
      </>
    ),
  },
};

export const Disabled: Story = { args: { disabled: true } };
