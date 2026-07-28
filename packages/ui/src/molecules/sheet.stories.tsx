import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../atoms/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet";

const meta = {
  title: "Molecules/Sheet",
  component: Sheet,
  argTypes: {},
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CommentsPanel: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open comments</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Comments</SheetTitle>
          <SheetDescription>3 open threads on this document.</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  ),
};
