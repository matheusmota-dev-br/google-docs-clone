import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

const meta = {
  title: "Molecules/Table",
  component: Table,
  decorators: [
    (Story) => (
      <div className="w-[34rem]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

const rows = [
  { name: "Q3 planning", owner: "Organization", date: "March 12, 2026" },
  { name: "Design review notes", owner: "Personal", date: "March 09, 2026" },
  { name: "Offsite agenda", owner: "Organization", date: "February 28, 2026" },
];

export const Default: Story = {
  render: () => (
    <Table>
      <TableCaption>Documents you edited recently.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Shared</TableHead>
          <TableHead>Created at</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.name}>
            <TableCell className="font-medium">{row.name}</TableCell>
            <TableCell className="text-muted-foreground">{row.owner}</TableCell>
            <TableCell className="text-muted-foreground">{row.date}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};
