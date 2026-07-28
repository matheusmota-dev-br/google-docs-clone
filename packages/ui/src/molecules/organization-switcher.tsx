"use client";

import {
  BuildingIcon,
  CheckIcon,
  ChevronsUpDownIcon,
  CircleUserIcon,
} from "lucide-react";

import { Button } from "../atoms/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { cn } from "../lib/utils";

export interface Organization {
  id: string;
  name: string;
}

export interface OrganizationSwitcherProps {
  organizations: Organization[];
  /** `null` selects the personal space. */
  value: string | null;
  onChange: (organizationId: string | null) => void;
  personalLabel?: string;
  disabled?: boolean;
}

/**
 * Chooses which workspace the document list belongs to. Workspaces are groups
 * in the identity provider, so this list is whatever the user's token says —
 * the component never decides membership.
 */
const OrganizationSwitcher = ({
  organizations,
  value,
  onChange,
  personalLabel = "Personal",
  disabled = false,
}: OrganizationSwitcherProps) => {
  const active = organizations.find((organization) => organization.id === value);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={disabled}
          className="max-w-52 justify-between gap-2"
        >
          <span className="flex min-w-0 items-center gap-2">
            {active ? (
              <BuildingIcon className="size-4 shrink-0" aria-hidden />
            ) : (
              <CircleUserIcon className="size-4 shrink-0" aria-hidden />
            )}
            <span className="truncate">{active?.name ?? personalLabel}</span>
          </span>
          <ChevronsUpDownIcon className="size-4 shrink-0 opacity-50" aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Workspace</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => onChange(null)}>
          <CircleUserIcon className="mr-2 size-4" aria-hidden />
          <span className="flex-1">{personalLabel}</span>
          <CheckIcon
            className={cn("size-4", value !== null && "invisible")}
            aria-hidden
          />
        </DropdownMenuItem>
        {organizations.map((organization) => (
          <DropdownMenuItem
            key={organization.id}
            onSelect={() => onChange(organization.id)}
          >
            <BuildingIcon className="mr-2 size-4" aria-hidden />
            <span className="flex-1 truncate">{organization.name}</span>
            <CheckIcon
              className={cn("size-4", value !== organization.id && "invisible")}
              aria-hidden
            />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
OrganizationSwitcher.displayName = "OrganizationSwitcher";

export { OrganizationSwitcher };
