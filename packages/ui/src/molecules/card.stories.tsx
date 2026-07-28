import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../atoms/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";

const meta = {
  title: "Molecules/Card",
  component: Card,
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Q3 planning</CardTitle>
        <CardDescription>Last edited 2 hours ago by Ada</CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Shared with 4 people in the Engineering workspace.
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="ghost" size="sm">
          Preview
        </Button>
        <Button size="sm">Open</Button>
      </CardFooter>
    </Card>
  ),
};
