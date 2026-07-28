import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { OrganizationSwitcher } from "./organization-switcher";

/**
 * Workspaces are groups in the identity provider. The component renders
 * whatever the caller passes and reports the choice back — it never decides
 * membership.
 */
const meta: Meta<typeof OrganizationSwitcher> = {
  title: "Molecules/OrganizationSwitcher",
  component: OrganizationSwitcher,
};

export default meta;
type Story = StoryObj<typeof OrganizationSwitcher>;

const organizations = [
  { id: "acme", name: "Acme" },
  { id: "globex", name: "Globex" },
];

const Controlled = ({ initial }: { initial: string | null }) => {
  const [value, setValue] = useState<string | null>(initial);

  return (
    <OrganizationSwitcher
      organizations={organizations}
      value={value}
      onChange={setValue}
    />
  );
};

export const PersonalSpace: Story = { render: () => <Controlled initial={null} /> };

export const InsideAnOrganization: Story = {
  render: () => <Controlled initial="acme" />,
};

/** Someone who only belongs to their personal space still gets the control. */
export const NoOrganizations: Story = {
  render: () => (
    <OrganizationSwitcher organizations={[]} value={null} onChange={() => {}} />
  ),
};
