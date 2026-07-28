import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion";

const meta: Meta<typeof Accordion> = {
  title: "Molecules/Accordion",
  component: Accordion,
  decorators: [
    (Story) => (
      <div className="w-[26rem]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Accordion>;

export const Default: Story = {
  render: () => (
    <Accordion type="single" collapsible defaultValue="sharing">
      <AccordionItem value="sharing">
        <AccordionTrigger>Who can see this document?</AccordionTrigger>
        <AccordionContent>
          Anyone in your organization with the link can view it.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="history">
        <AccordionTrigger>Where is my version history?</AccordionTrigger>
        <AccordionContent>
          Every change is stored; open File → Version history to restore one.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="offline">
        <AccordionTrigger>Does offline editing work?</AccordionTrigger>
        <AccordionContent>
          Yes — edits queue locally and sync when you reconnect.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};
