"use client";

import { useRouter } from "next/navigation";
import { Separator } from "@repo/ui/atoms";
import { NotificationInbox } from "@repo/ui/organisms";

import { useNotifications } from "@/hooks/use-notifications";

export const Inbox = () => {
  const router = useRouter();
  const { notifications, unreadCount, markAllRead } = useNotifications();

  return (
    <>
      <NotificationInbox
        unreadCount={unreadCount}
        notifications={notifications.map((notification) => ({
          id: notification.id,
          kind: notification.kind,
          actorName: notification.actorName,
          excerpt: notification.excerpt,
          documentTitle: notification.document.title,
          createdAt: notification.createdAt,
          read: notification.readAt !== null,
        }))}
        onMarkAllRead={() => void markAllRead()}
        onOpen={(notification) => {
          const source = notifications.find((item) => item.id === notification.id);
          if (source) router.push(`/documents/${source.document.id}`);
        }}
      />
      <Separator orientation="vertical" className="h-6" />
    </>
  );
};
