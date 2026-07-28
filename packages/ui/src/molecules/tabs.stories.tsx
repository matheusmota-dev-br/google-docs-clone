import type { Meta, StoryObj } from "@storybook/react-vite";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

const meta = {
  title: "Molecules/Tabs",
  component: Tabs,
  decorators: [
    (Story) => (
      <div className="w-[26rem]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="recent">
      <TabsList>
        <TabsTrigger value="recent">Recent</TabsTrigger>
        <TabsTrigger value="shared">Shared with me</TabsTrigger>
        <TabsTrigger value="starred">Starred</TabsTrigger>
      </TabsList>
      <TabsContent value="recent" className="py-4 text-sm text-muted-foreground">
        Documents you opened in the last 30 days.
      </TabsContent>
      <TabsContent value="shared" className="py-4 text-sm text-muted-foreground">
        Documents other people gave you access to.
      </TabsContent>
      <TabsContent value="starred" className="py-4 text-sm text-muted-foreground">
        Nothing starred yet.
      </TabsContent>
    </Tabs>
  ),
};
