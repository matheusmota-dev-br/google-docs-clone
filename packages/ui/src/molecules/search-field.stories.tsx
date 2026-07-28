import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { SearchField } from "./search-field";

/**
 * Controlled on purpose: the app stores the query in the URL, Storybook keeps
 * it in local state, and neither needs the component to change.
 */
const meta = {
  title: "Molecules/SearchField",
  component: SearchField,
  decorators: [
    (Story) => (
      <div className="w-[36rem]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SearchField>;

export default meta;
type Story = StoryObj<typeof meta>;

const Controlled = (args: Partial<React.ComponentProps<typeof SearchField>>) => {
  const [value, setValue] = useState(args.value ?? "");
  return (
    <SearchField
      {...args}
      value={value}
      onValueChange={setValue}
      onClear={() => setValue("")}
    />
  );
};

export const Empty: Story = {
  render: (args) => <Controlled {...args} />,
  args: { value: "", onValueChange: () => {} },
};

/** The clear button only appears once there is something to clear. */
export const WithQuery: Story = {
  render: (args) => <Controlled {...args} />,
  args: { value: "quarterly report", onValueChange: () => {} },
};
