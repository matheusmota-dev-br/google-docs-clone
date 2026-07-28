import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  BoldIcon,
  ItalicIcon,
  Link2Icon,
  ListIcon,
  PrinterIcon,
  RedoIcon,
  UnderlineIcon,
  UndoIcon,
} from "lucide-react";

import { Button } from "../atoms/button";
import { Logo } from "../atoms/logo";
import { Separator } from "../atoms/separator";
import { AvatarStack } from "../molecules/avatar-stack";
import { EditorShell } from "./editor-shell";

/**
 * The editor chrome. Everything inside `navbar` and `toolbar` is hidden when
 * printing, so what lands in the PDF is only the page itself.
 */
const meta = {
  title: "Templates/EditorShell",
  component: EditorShell,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof EditorShell>;

export default meta;
type Story = StoryObj<typeof meta>;

const collaborators = [
  { id: 1, name: "Ada Lovelace", avatar: "https://i.pravatar.cc/80?img=47" },
  { id: 2, name: "Grace Hopper", avatar: "https://i.pravatar.cc/80?img=32" },
  { id: 3, name: "Alan Turing", avatar: "https://i.pravatar.cc/80?img=13" },
];

const Navbar = () => (
  <div className="flex items-center gap-3">
    <Logo markOnly />
    <div>
      <p className="text-sm font-medium">Q3 planning</p>
      <p className="text-xs text-muted-foreground">All changes saved</p>
    </div>
    <div className="ml-auto flex items-center gap-3">
      <AvatarStack users={collaborators} size="sm" />
      <Separator orientation="vertical" className="h-6" />
      <Button size="sm">Share</Button>
    </div>
  </div>
);

const toolbarButtons = [
  { icon: UndoIcon, label: "Undo" },
  { icon: RedoIcon, label: "Redo" },
  { icon: PrinterIcon, label: "Print" },
  { icon: BoldIcon, label: "Bold" },
  { icon: ItalicIcon, label: "Italic" },
  { icon: UnderlineIcon, label: "Underline" },
  { icon: Link2Icon, label: "Insert link" },
  { icon: ListIcon, label: "Bulleted list" },
];

const Toolbar = () => (
  <div className="flex min-h-[40px] items-center gap-x-0.5 overflow-x-auto rounded-3xl bg-muted px-2.5">
    {toolbarButtons.map(({ icon: Icon, label }) => (
      <Button
        key={label}
        variant="ghost"
        size="icon"
        aria-label={label}
        className="size-8"
      >
        <Icon className="size-4" />
      </Button>
    ))}
  </div>
);

export const Default: Story = {
  args: {
    navbar: <Navbar />,
    toolbar: <Toolbar />,
    children: (
      <div className="size-full overflow-x-auto px-4">
        <div className="mx-auto flex w-[816px] min-w-max justify-center py-4">
          <div className="min-h-[1054px] w-[816px] rounded-sm border bg-card p-14 shadow-paper">
            <h1 className="mb-6 text-2xl font-semibold">Q3 planning</h1>
            <p className="text-sm leading-7 text-muted-foreground">
              This is the paper the document is written on. The shell owns the chrome and
              the desk it sits on; the editor owns everything inside.
            </p>
          </div>
        </div>
      </div>
    ),
  },
};
