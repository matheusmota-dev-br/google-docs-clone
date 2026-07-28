import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "./navigation-menu";

const meta = {
  title: "Organisms/NavigationMenu",
  component: NavigationMenu,
} satisfies Meta<typeof NavigationMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Workspaces</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="w-64 p-2">
              {["Engineering", "Design", "Operations"].map((workspace) => (
                <li key={workspace}>
                  <NavigationMenuLink
                    href="#"
                    className="block rounded-md p-3 text-sm hover:bg-accent hover:text-accent-foreground"
                  >
                    {workspace}
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#" className={navigationMenuTriggerStyle()}>
            Templates
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
};
