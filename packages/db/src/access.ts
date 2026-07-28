import type { Document } from "@prisma/client";

/** The identity fields an access check needs, as carried by a Keycloak token. */
export interface DocumentActor {
  /** Keycloak `sub`. */
  id: string;
  /** Keycloak group names. */
  organizations: string[];
}

/**
 * A document is reachable when you created it, or when it belongs to a group
 * you are a member of.
 *
 * This lives next to the schema because both the REST API and the
 * collaboration server enforce it, and they must never disagree.
 */
export const canAccessDocument = (
  document: Pick<Document, "ownerId" | "organizationId">,
  actor: DocumentActor,
): boolean => {
  if (document.ownerId === actor.id) return true;

  return (
    document.organizationId !== null &&
    actor.organizations.includes(document.organizationId)
  );
};
