import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Button, Logo } from "@repo/ui/atoms";

import { auth, signIn } from "@/auth";

export const metadata: Metadata = { title: "Sign in" };

interface SignInPageProps {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}

const SignInPage = async ({ searchParams }: SignInPageProps) => {
  const { callbackUrl = "/", error } = await searchParams;
  const session = await auth();

  if (session && !session.error) redirect(callbackUrl);

  return (
    <main className="flex min-h-screen items-center justify-center bg-canvas px-4">
      <div className="w-full max-w-sm space-y-8 rounded-xl border bg-card p-8 shadow-paper">
        <div className="space-y-2 text-center">
          <Logo className="justify-center" />
          <h1 className="text-xl font-semibold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Documents are shared through your organization, so we need to know who you
            are.
          </p>
        </div>

        {error && (
          <p
            role="alert"
            className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            Sign-in did not complete. Please try again.
          </p>
        )}

        <form
          action={async () => {
            "use server";
            await signIn("keycloak", { redirectTo: callbackUrl });
          }}
        >
          <Button type="submit" className="w-full" size="lg">
            Continue with Keycloak
          </Button>
        </form>

        <p className="text-center text-xs text-muted-foreground">
          Local demo account: <strong>user@teste.com</strong> / <strong>senha123</strong>
        </p>
      </div>
    </main>
  );
};

export default SignInPage;
