import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../atoms/button";
import { Input } from "../atoms/input";
import { Label } from "../atoms/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";

const meta = {
  title: "Molecules/Dialog",
  component: Dialog,
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The rename flow from the document menu. */
export const Rename: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Rename document</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename document</DialogTitle>
          <DialogDescription>Enter a new name for this document.</DialogDescription>
        </DialogHeader>
        <div className="my-4 space-y-2">
          <Label htmlFor="new-name">Document name</Label>
          <Input id="new-name" defaultValue="Q3 planning" />
        </div>
        <DialogFooter>
          <Button variant="ghost">Cancel</Button>
          <Button>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
