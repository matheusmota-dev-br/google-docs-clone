import type { Meta, StoryObj } from "@storybook/react-vite";
import { ClockIcon, FileTextIcon, StarIcon, Trash2Icon } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "./sidebar";
import { Logo } from "../atoms/logo";

const meta = {
  title: "Organisms/Sidebar",
  component: Sidebar,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

const items = [
  { title: "All documents", icon: FileTextIcon, active: true },
  { title: "Recent", icon: ClockIcon },
  { title: "Starred", icon: StarIcon },
  { title: "Trash", icon: Trash2Icon },
];

export const Default: Story = {
  render: () => (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="px-4 py-3">
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Library</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton isActive={item.active}>
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="flex h-14 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <span className="text-sm font-medium">All documents</span>
        </div>
        <div className="p-6 text-sm text-muted-foreground">
          Collapse the sidebar with the trigger, or press ⌘B.
        </div>
      </SidebarInset>
    </SidebarProvider>
  ),
};
