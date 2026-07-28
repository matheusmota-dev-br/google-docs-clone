import type { Meta, StoryObj } from "@storybook/react-vite";

import { Checkbox } from "./checkbox";
import { Label } from "./label";

const meta = {
  title: "Atoms/Checkbox",
  component: Checkbox,
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Checked: Story = { args: { defaultChecked: true } };

export const Disabled: Story = { args: { disabled: true, defaultChecked: true } };

/** The pattern used by the editor's task lists. */
export const TaskList: Story = {
  render: () => (
    <ul className="space-y-2">
      {[
        { id: "t1", label: "Draft the proposal", done: true },
        { id: "t2", label: "Review with the team", done: false },
        { id: "t3", label: "Send for signature", done: false },
      ].map((task) => (
        <li key={task.id} className="flex items-center gap-2">
          <Checkbox id={task.id} defaultChecked={task.done} />
          <Label
            htmlFor={task.id}
            className={task.done ? "text-muted-foreground line-through" : ""}
          >
            {task.label}
          </Label>
        </li>
      ))}
    </ul>
  ),
};
