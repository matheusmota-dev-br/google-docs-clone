import { cookies } from "next/headers";

import { auth } from "@/auth";

export const ACTIVE_ORGANIZATION_COOKIE = "active-organization";

/**
 * The workspace the user is currently looking at, or `null` for their personal
 * space. Read from a cookie but always re-checked against the groups in the
 * token, so a hand-edited cookie cannot widen access.
 */
export async function getActiveOrganization(): Promise<string | null> {
  const [session, store] = await Promise.all([auth(), cookies()]);
  const requested = store.get(ACTIVE_ORGANIZATION_COOKIE)?.value;

  if (!requested || !session?.organizations.includes(requested)) return null;

  return requested;
}
