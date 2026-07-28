import type { Meta, StoryObj } from "@storybook/react-vite";

import { DocumentCard } from "./document-card";

const meta = {
  title: "Organisms/DocumentCard",
  component: DocumentCard,
  args: { title: "Software Proposal", previewUrl: "/software-proposal.svg" },
  decorators: [
    (Story) => (
      <div className="w-44">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DocumentCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Featured: Story = {
  args: { title: "Blank Document", previewUrl: "/blank-document.svg", featured: true },
};

/** Without a preview the card still reserves the same 3:4 footprint. */
export const WithoutPreview: Story = {
  args: { title: "Untitled", previewUrl: undefined },
};

export const Disabled: Story = { args: { disabled: true } };
