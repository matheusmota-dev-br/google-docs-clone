"use client";

import * as React from "react";
import { LogOutIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "../atoms/avatar";
import { Button } from "../atoms/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";

export interface UserMenuProps {
  name: string;
  email?: string;
  avatarUrl?: string;
  onSignOut?: () => void;
  /** Extra entries rendered above the sign-out item. */
  children?: React.ReactNode;
}

const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

/** Account control in the app header: who you are, and how to leave. */
const UserMenu = ({ name, email, avatarUrl, onSignOut, children }: UserMenuProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full"
        aria-label={`Account menu for ${name}`}
      >
        <Avatar className="size-8">
          <AvatarImage src={avatarUrl} alt="" />
          <AvatarFallback className="text-xs font-medium">
            {initials(name)}
          </AvatarFallback>
        </Avatar>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-60">
      <DropdownMenuLabel className="font-normal">
        <p className="text-sm font-medium">{name}</p>
        {email && <p className="truncate text-xs text-muted-foreground">{email}</p>}
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      {children}
      <DropdownMenuItem onSelect={onSignOut}>
        <LogOutIcon className="mr-2 size-4" />
        Sign out
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);
UserMenu.displayName = "UserMenu";

export { UserMenu };
