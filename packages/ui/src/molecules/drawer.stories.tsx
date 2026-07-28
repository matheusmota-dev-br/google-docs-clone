import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../atoms/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./drawer";

/** The mobile counterpart of `<Dialog>` — it slides up and is swipe-dismissable. */
const meta = {
  title: "Molecules/Drawer",
  component: Drawer,
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Share document</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Share &ldquo;Q3 planning&rdquo;</DrawerTitle>
          <DrawerDescription>
            Anyone in your organization with the link can view this document.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <Button>Copy link</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};
