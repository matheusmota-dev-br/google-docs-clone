"use client";

import * as React from "react";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "@repo/ui/molecules";

export interface Workspace {
  /** Active Keycloak group, or `null` for the personal space. */
  activeOrganization: string | null;
  /** Every group the signed-in user belongs to. */
  organizations: string[];
}

const WorkspaceContext = React.createContext<Workspace>({
  activeOrganization: null,
  organizations: [],
});

/** Which workspace the current page is scoped to. Resolved on the server. */
export const useWorkspace = () => React.useContext(WorkspaceContext);

export function Providers({
  session,
  workspace,
  children,
}: {
  session: Session | null;
  workspace: Workspace;
  children: React.ReactNode;
}) {
  return (
    <SessionProvider session={session} refetchOnWindowFocus>
      <WorkspaceContext.Provider value={workspace}>
        <NuqsAdapter>{children}</NuqsAdapter>
        <Toaster />
      </WorkspaceContext.Provider>
    </SessionProvider>
  );
}
