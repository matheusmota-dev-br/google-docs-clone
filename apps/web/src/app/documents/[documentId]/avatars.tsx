"use client";

import { useEffect, useState } from "react";
import { Separator } from "@repo/ui/atoms";
import { AvatarStack, type AvatarStackUser } from "@repo/ui/molecules";

import { useCollaboration } from "./collaboration-provider";

interface AwarenessUser {
  id?: string;
  name?: string;
  color?: string;
}

/**
 * Who else is in the document right now.
 *
 * Presence comes from the Yjs awareness protocol — the same channel that draws
 * the remote cursors — so there is nothing to persist and nothing to poll.
 */
export const Avatars = () => {
  const { provider, self } = useCollaboration();
  const [others, setOthers] = useState<AvatarStackUser[]>([]);

  useEffect(() => {
    const { awareness } = provider;
    if (!awareness) return;

    const sync = () => {
      const peers: AvatarStackUser[] = [];

      for (const [clientId, state] of awareness.getStates()) {
        if (clientId === awareness.clientID) continue;

        const user = (state as { user?: AwarenessUser }).user;
        if (user?.name) peers.push({ id: clientId, name: user.name });
      }

      setOthers(peers);
    };

    sync();
    awareness.on("change", sync);

    return () => awareness.off("change", sync);
  }, [provider]);

  if (others.length === 0) return null;

  return (
    <>
      <AvatarStack
        users={[{ id: "self", name: `${self.name} (you)` }, ...others]}
        size="sm"
      />
      <Separator orientation="vertical" className="h-6" />
    </>
  );
};
