import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./select";

const meta = {
  title: "Molecules/Select",
  component: Select,
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FontFamily: Story = {
  render: () => (
    <Select defaultValue="inter">
      <SelectTrigger className="w-56">
        <SelectValue placeholder="Font" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Sans serif</SelectLabel>
          <SelectItem value="inter">Inter</SelectItem>
          <SelectItem value="arial">Arial</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Serif</SelectLabel>
          <SelectItem value="georgia">Georgia</SelectItem>
          <SelectItem value="times">Times New Roman</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};
