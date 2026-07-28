import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./carousel";

const meta = {
  title: "Organisms/Carousel",
  component: Carousel,
  decorators: [
    (Story) => (
      <div className="w-[28rem] px-12">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Carousel opts={{ align: "start" }}>
      <CarouselContent>
        {Array.from({ length: 8 }, (_, index) => (
          <CarouselItem key={index} className="basis-1/3">
            <div className="flex aspect-square items-center justify-center rounded-md border bg-card text-2xl font-medium">
              {index + 1}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
};
