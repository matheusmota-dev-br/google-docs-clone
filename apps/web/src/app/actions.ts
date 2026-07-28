"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

import { auth, signOut } from "@/auth";
import { ACTIVE_ORGANIZATION_COOKIE } from "@/lib/organizations";

/** Switches workspace. `null` means the personal space. */
export async function switchOrganization(organizationId: string | null) {
  const session = await auth();
  const store = await cookies();

  if (organizationId === null) {
    store.delete(ACTIVE_ORGANIZATION_COOKIE);
  } else if (session?.organizations.includes(organizationId)) {
    store.set(ACTIVE_ORGANIZATION_COOKIE, organizationId, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  revalidatePath("/");
}

export async function signOutAction() {
  await signOut({ redirectTo: "/sign-in" });
}
