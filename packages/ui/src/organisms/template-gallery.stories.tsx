import type { Meta, StoryObj } from "@storybook/react-vite";

import { TemplateGallery } from "./template-gallery";

const templates = [
  { id: "blank-document", label: "Blank Document", imageUrl: "/blank-document.svg" },
  {
    id: "software-proposal",
    label: "Software Proposal",
    imageUrl: "/software-proposal.svg",
  },
  {
    id: "project-proposal",
    label: "Project Proposal",
    imageUrl: "/project-proposal.svg",
  },
  { id: "business-letter", label: "Business Letter", imageUrl: "/business-letter.svg" },
  { id: "resume", label: "Resume", imageUrl: "/resume.svg" },
  { id: "cover-letter", label: "Cover Letter", imageUrl: "/cover-letter.svg" },
  { id: "letter", label: "Letter", imageUrl: "/letter.svg" },
];

const meta = {
  title: "Organisms/TemplateGallery",
  component: TemplateGallery,
  args: { templates },
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof TemplateGallery>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** While a document is being created every card is locked. */
export const Busy: Story = { args: { busy: true } };
