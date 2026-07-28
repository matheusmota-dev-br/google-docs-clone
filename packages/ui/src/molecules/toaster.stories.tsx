import type { Meta, StoryObj } from "@storybook/react-vite";
import { toast } from "sonner";

import { Button } from "../atoms/button";
import { Toaster } from "./toaster";

/**
 * `<Toaster />` is already mounted by the Storybook preview (and by the app
 * layout). Fire toasts from anywhere with `toast()` from `sonner`.
 */
const meta = {
  title: "Molecules/Toaster",
  component: Toaster,
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button variant="outline" onClick={() => toast("Document created")}>
        Neutral
      </Button>
      <Button variant="outline" onClick={() => toast.success("Document renamed")}>
        Success
      </Button>
      <Button variant="outline" onClick={() => toast.error("Something went wrong")}>
        Error
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast("Document removed", {
            description: "It will stay in the trash for 30 days.",
            action: { label: "Undo", onClick: () => toast("Restored") },
          })
        }
      >
        With action
      </Button>
    </div>
  ),
};
