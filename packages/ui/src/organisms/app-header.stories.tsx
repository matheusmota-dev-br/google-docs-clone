import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { BellIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "../atoms/avatar";
import { Button } from "../atoms/button";
import { SearchField } from "../molecules/search-field";
import { AppHeader } from "./app-header";

const meta = {
  title: "Organisms/AppHeader",
  component: AppHeader,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div className="border-b">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AppHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

const Search = () => {
  const [value, setValue] = useState("");
  return (
    <SearchField value={value} onValueChange={setValue} onClear={() => setValue("")} />
  );
};

const Actions = () => (
  <>
    <Button variant="ghost" size="icon" aria-label="Notifications">
      <BellIcon />
    </Button>
    <Avatar className="size-8">
      <AvatarImage src="https://i.pravatar.cc/80?img=47" alt="Ada Lovelace" />
      <AvatarFallback>AL</AvatarFallback>
    </Avatar>
  </>
);

export const Default: Story = {
  args: { search: <Search />, actions: <Actions /> },
};

/** With no search slot the brand and actions sit at the two edges. */
export const WithoutSearch: Story = { args: { actions: <Actions /> } };
