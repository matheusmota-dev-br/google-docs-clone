import type { Meta, StoryObj } from "@storybook/react-vite";
import { AlertTriangleIcon, InfoIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "./alert";

const meta = {
  title: "Molecules/Alert",
  component: Alert,
  decorators: [
    (Story) => (
      <div className="w-[28rem]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Alert>
      <InfoIcon className="size-4" />
      <AlertTitle>Offline edits are saved</AlertTitle>
      <AlertDescription>
        Your changes will sync as soon as the connection is back.
      </AlertDescription>
    </Alert>
  ),
};

export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive">
      <AlertTriangleIcon className="size-4" />
      <AlertTitle>Could not save</AlertTitle>
      <AlertDescription>
        You no longer have edit access to this document.
      </AlertDescription>
    </Alert>
  ),
};
