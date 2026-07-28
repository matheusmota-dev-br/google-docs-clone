import type { Meta, StoryObj } from "@storybook/react-vite";

import { Avatar, AvatarFallback, AvatarImage } from "../atoms/avatar";
import { Button } from "../atoms/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./hover-card";

const meta = {
  title: "Molecules/HoverCard",
  component: HoverCard,
} satisfies Meta<typeof HoverCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Collaborator: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link">@ada</Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-72">
        <div className="flex gap-3">
          <Avatar>
            <AvatarImage src="https://i.pravatar.cc/80?img=47" alt="Ada Lovelace" />
            <AvatarFallback>AL</AvatarFallback>
          </Avatar>
          <div className="space-y-1 text-sm">
            <p className="font-medium">Ada Lovelace</p>
            <p className="text-muted-foreground">Editing since 09:41</p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};
