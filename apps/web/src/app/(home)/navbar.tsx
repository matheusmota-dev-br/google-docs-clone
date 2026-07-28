"use client";

import Link from "next/link";
import { useTransition } from "react";
import { useSession } from "next-auth/react";
import { Logo } from "@repo/ui/atoms";
import { OrganizationSwitcher, UserMenu } from "@repo/ui/molecules";
import { AppHeader } from "@repo/ui/organisms";

import { signOutAction, switchOrganization } from "@/app/actions";
import { useWorkspace } from "@/components/providers";
import { SearchInput } from "./search-input";

/** Turns a Keycloak group name into something worth showing a person. */
const humanize = (group: string) =>
  group.replace(/[-_]/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

export const Navbar = () => {
  const { data: session } = useSession();
  const { activeOrganization, organizations } = useWorkspace();
  const [pending, startTransition] = useTransition();

  return (
    <AppHeader
      brand={
        <Link href="/" aria-label="Docs home" className="rounded-sm">
          <Logo />
        </Link>
      }
      search={<SearchInput />}
      actions={
        <>
          <OrganizationSwitcher
            organizations={organizations.map((group) => ({
              id: group,
              name: humanize(group),
            }))}
            value={activeOrganization}
            disabled={pending}
            onChange={(organizationId) =>
              startTransition(() => void switchOrganization(organizationId))
            }
          />
          <UserMenu
            name={session?.user?.name ?? "Anonymous"}
            email={session?.user?.email ?? undefined}
            avatarUrl={session?.user?.image ?? undefined}
            onSignOut={() => startTransition(() => void signOutAction())}
          />
        </>
      }
    />
  );
};
