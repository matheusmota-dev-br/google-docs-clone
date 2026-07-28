import type { Meta, StoryObj } from "@storybook/react-vite";
import { FilePlusIcon, SearchIcon, SettingsIcon, ShareIcon } from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "./command";

const meta = {
  title: "Organisms/Command",
  component: Command,
} satisfies Meta<typeof Command>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CommandPalette: Story = {
  render: () => (
    <Command className="w-96 rounded-lg border shadow-md">
      <CommandInput placeholder="Type a command or search…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Actions">
          <CommandItem>
            <FilePlusIcon className="mr-2 size-4" />
            New document
            <CommandShortcut>⌘N</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <ShareIcon className="mr-2 size-4" />
            Share
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Navigate">
          <CommandItem>
            <SearchIcon className="mr-2 size-4" />
            Search documents
          </CommandItem>
          <CommandItem>
            <SettingsIcon className="mr-2 size-4" />
            Settings
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};
