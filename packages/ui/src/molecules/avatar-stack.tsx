"use client";

import * as React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "../atoms/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";
import { cn } from "../lib/utils";

export interface AvatarStackUser {
  id: string | number;
  name: string;
  avatar?: string;
}

export interface AvatarStackProps extends React.ComponentPropsWithoutRef<"div"> {
  users: AvatarStackUser[];
  /** Extra users beyond this count collapse into a `+N` chip. */
  max?: number;
  size?: "sm" | "md";
}

const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

/**
 * Overlapping presence avatars for the people currently in a document.
 * Purely presentational — the realtime source (Liveblocks, websockets, a mock)
 * is the caller's concern.
 */
const AvatarStack = ({
  users,
  max = 5,
  size = "md",
  className,
  ...props
}: AvatarStackProps) => {
  const visible = users.slice(0, max);
  const overflow = users.length - visible.length;
  const sizeClass = size === "sm" ? "size-7" : "size-9";

  if (users.length === 0) return null;

  return (
    <TooltipProvider delayDuration={200}>
      <div className={cn("flex items-center", className)} {...props}>
        {visible.map((user) => (
          <Tooltip key={user.id}>
            <TooltipTrigger asChild>
              <Avatar
                className={cn(
                  sizeClass,
                  "-ml-2 border-2 border-background bg-muted first:ml-0",
                )}
              >
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="text-xs font-medium">
                  {initials(user.name)}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>{user.name}</TooltipContent>
          </Tooltip>
        ))}
        {overflow > 0 && (
          <span
            className={cn(
              sizeClass,
              "-ml-2 flex items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium text-muted-foreground",
            )}
          >
            +{overflow}
          </span>
        )}
      </div>
    </TooltipProvider>
  );
};
AvatarStack.displayName = "AvatarStack";

export { AvatarStack };
