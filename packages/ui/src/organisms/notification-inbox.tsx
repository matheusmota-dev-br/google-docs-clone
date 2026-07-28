"use client";

import { AtSignIcon, BellIcon, MessageSquareIcon } from "lucide-react";

import { Button } from "../atoms/button";
import { EmptyState } from "../molecules/empty-state";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../molecules/dropdown-menu";
import { ScrollArea } from "../molecules/scroll-area";
import { cn } from "../lib/utils";

export interface InboxNotification {
  id: string;
  kind: "COMMENT" | "MENTION";
  actorName: string;
  excerpt: string;
  documentTitle: string;
  createdAt: string | number | Date;
  read?: boolean;
}

export interface NotificationInboxProps {
  notifications: InboxNotification[];
  unreadCount?: number;
  onOpen?: (notification: InboxNotification) => void;
  onMarkAllRead?: () => void;
  loading?: boolean;
}

const relative = (value: string | number | Date) => {
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const seconds = (new Date(value).getTime() - Date.now()) / 1000;

  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["day", 86_400],
    ["hour", 3_600],
    ["minute", 60],
  ];

  for (const [unit, size] of units) {
    if (Math.abs(seconds) >= size)
      return formatter.format(Math.round(seconds / size), unit);
  }

  return formatter.format(Math.round(seconds), "second");
};

/**
 * Bell menu listing replies and mentions.
 *
 * Comments in a document you have open arrive over the collaboration socket;
 * this is for the ones in documents you do not.
 */
const NotificationInbox = ({
  notifications,
  unreadCount = 0,
  onOpen,
  onMarkAllRead,
  loading = false,
}: NotificationInboxProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        disabled={loading}
        aria-label={
          unreadCount > 0 ? `Notifications, ${unreadCount} unread` : "Notifications"
        }
      >
        <BellIcon className="size-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-[22rem] p-0">
      <div className="flex items-center justify-between border-b px-3 py-2">
        <p className="text-sm font-medium">Notifications</p>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={onMarkAllRead}
          >
            Mark all read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <EmptyState
          icon={BellIcon}
          title="You are all caught up"
          description="Replies and mentions will show up here."
          className="py-10"
        />
      ) : (
        <ScrollArea className="max-h-96">
          <ul className="divide-y">
            {notifications.map((notification) => (
              <li key={notification.id}>
                <button
                  type="button"
                  onClick={() => onOpen?.(notification)}
                  className={cn(
                    "flex w-full gap-3 px-3 py-3 text-left transition-colors hover:bg-accent hover:text-accent-foreground",
                    !notification.read && "bg-accent/40",
                  )}
                >
                  <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    {notification.kind === "MENTION" ? (
                      <AtSignIcon className="size-4" aria-hidden />
                    ) : (
                      <MessageSquareIcon className="size-4" aria-hidden />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm">
                      <strong className="font-medium">{notification.actorName}</strong>{" "}
                      {notification.kind === "MENTION"
                        ? "mentioned you in"
                        : "commented on"}{" "}
                      <strong className="font-medium">
                        {notification.documentTitle}
                      </strong>
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                      {notification.excerpt}
                    </span>
                    <span className="mt-1 block text-[11px] text-muted-foreground">
                      {relative(notification.createdAt)}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </ScrollArea>
      )}
    </DropdownMenuContent>
  </DropdownMenu>
);
NotificationInbox.displayName = "NotificationInbox";

export { NotificationInbox };
