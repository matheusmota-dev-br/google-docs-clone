import type { Meta, StoryObj } from "@storybook/react-vite";

import { Label } from "../atoms/label";
import { RadioGroup, RadioGroupItem } from "./radio-group";

const meta = {
  title: "Molecules/RadioGroup",
  component: RadioGroup,
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ExportFormat: Story = {
  render: () => (
    <RadioGroup defaultValue="pdf" className="space-y-1">
      {[
        { value: "pdf", label: "PDF document (.pdf)" },
        { value: "html", label: "Web page (.html)" },
        { value: "txt", label: "Plain text (.txt)" },
        { value: "json", label: "Raw JSON (.json)" },
      ].map((option) => (
        <div key={option.value} className="flex items-center gap-2">
          <RadioGroupItem value={option.value} id={option.value} />
          <Label htmlFor={option.value}>{option.label}</Label>
        </div>
      ))}
    </RadioGroup>
  ),
};
