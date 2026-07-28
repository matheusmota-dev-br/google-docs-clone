"use client";

import * as React from "react";
import { HocuspocusProvider, type WebSocketStatus } from "@hocuspocus/provider";
import { useSession } from "next-auth/react";
import * as Y from "yjs";
import { FullscreenLoader } from "@repo/ui/molecules";

export interface Collaborator {
  clientId: number;
  id: string;
  name: string;
  color: string;
}

interface CollaborationValue {
  provider: HocuspocusProvider;
  doc: Y.Doc;
  status: WebSocketStatus;
  synced: boolean;
  self: { id: string; name: string; color: string };
}

const CollaborationContext = React.createContext<CollaborationValue | null>(null);

export function useCollaboration(): CollaborationValue {
  const value = React.useContext(CollaborationContext);
  if (!value) throw new Error("useCollaboration must be used inside <CollaborationRoom>");

  return value;
}

/** Same formula the API and the collab server use, so colours always agree. */
const colorFor = (seed: string): string => {
  let hash = 0;
  for (const char of seed) hash = (hash * 31 + char.charCodeAt(0)) | 0;

  return `hsl(${Math.abs(hash) % 360}, 72%, 55%)`;
};

interface CollaborationRoomProps {
  documentId: string;
  children: React.ReactNode;
}

/**
 * Opens the Yjs socket for one document and shares it with the tree below.
 *
 * The Keycloak access token is read through a ref rather than captured, so a
 * token refresh does not tear down the connection — Hocuspocus simply picks up
 * the current value the next time it (re)connects.
 */
export function CollaborationRoom({ documentId, children }: CollaborationRoomProps) {
  const { data: session } = useSession();
  const token = session?.accessToken ?? "";

  // Kept in a ref so a refreshed token reaches Hocuspocus without the effect
  // below re-running and tearing down a healthy connection.
  const tokenRef = React.useRef(token);
  React.useEffect(() => {
    tokenRef.current = token;
  }, [token]);

  const [value, setValue] = React.useState<CollaborationValue | null>(null);
  const [status, setStatus] = React.useState<WebSocketStatus>(
    "connecting" as WebSocketStatus,
  );
  const [synced, setSynced] = React.useState(false);

  const self = React.useMemo(
    () => ({
      id: session?.user?.id ?? "anonymous",
      name: session?.user?.name ?? "Anonymous",
      color: colorFor(session?.user?.id ?? "anonymous"),
    }),
    [session?.user?.id, session?.user?.name],
  );

  React.useEffect(() => {
    if (!token) return;

    const doc = new Y.Doc();
    const provider = new HocuspocusProvider({
      url: process.env.NEXT_PUBLIC_COLLAB_URL ?? "ws://localhost:4001",
      name: documentId,
      document: doc,
      token: () => tokenRef.current,
      onStatus: ({ status: next }) => setStatus(next),
      onSynced: () => setSynced(true),
    });

    setValue({
      provider,
      doc,
      status: "connecting" as WebSocketStatus,
      synced: false,
      self,
    });

    return () => {
      provider.destroy();
      doc.destroy();
      setValue(null);
      setSynced(false);
    };
    // `self` is intentionally omitted: a display-name change must not reconnect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentId, Boolean(token)]);

  if (!value) return <FullscreenLoader label="Connecting…" />;

  return (
    <CollaborationContext.Provider value={{ ...value, status, synced, self }}>
      {children}
    </CollaborationContext.Provider>
  );
}
