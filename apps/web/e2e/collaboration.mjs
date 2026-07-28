/**
 * End-to-end smoke test for the whole stack, driven through a real browser.
 *
 * Signs two people in through Keycloak and checks the things that are only
 * true when every service is actually talking to the others: documents from
 * the API, text and comments replicating over Yjs between two sessions,
 * presence, and notifications written by the collaboration server.
 *
 * Assumes everything is already running:
 *
 *   pnpm services:up && pnpm dev
 *   pnpm test:e2e
 */
import { chromium } from "playwright-core";

const BASE = process.env.E2E_BASE_URL ?? "http://localhost:3000";
const PASSWORD = process.env.E2E_PASSWORD ?? "senha123";
const results = [];

const record = (name, ok, extra = "") =>
  results.push({ ok, line: `${ok ? "✓" : "✗"} ${name}${extra ? ` — ${extra}` : ""}` });

const signIn = async (context, email) => {
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(String(error)));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });

  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: /continue with keycloak/i }).click();
  await page.waitForURL(/realms\/docs/, { timeout: 20_000 });
  await page.fill("#username", email);
  await page.fill("#password", PASSWORD);
  await page.click("#kc-login");
  await page.waitForURL((url) => url.origin === BASE, { timeout: 30_000 });

  return { page, errors };
};

const browser = await chromium.launch({ channel: "chrome", headless: true });

try {
  const anaContext = await browser.newContext();
  const { page: ana, errors: anaErrors } = await signIn(anaContext, "user@teste.com");
  record("sign in through Keycloak", ana.url().startsWith(BASE));

  await ana.waitForSelector("text=Start a new document", { timeout: 20_000 });

  // The whole system keys identity on the Keycloak subject, not on Auth.js's
  // own session id. If these ever diverge, comments get attributed to nobody.
  const identity = await ana.evaluate(async () => {
    const session = await fetch("/api/auth/session").then((response) => response.json());
    const [, payload] = session.accessToken.split(".");
    const claims = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));

    return { sessionId: session.user.id, keycloakSub: claims.sub };
  });
  record(
    "session id matches the Keycloak subject",
    identity.sessionId === identity.keycloakSub,
  );

  // Work in the shared workspace so the second user can reach the document.
  await ana
    .getByRole("button", { name: /Personal/ })
    .first()
    .click();
  await ana.getByRole("menuitem", { name: /Acme/ }).click();
  await ana.waitForTimeout(1_500);
  record(
    "switch workspace via Keycloak groups",
    await ana.getByRole("button", { name: /Acme/ }).first().isVisible(),
  );

  await ana.waitForFunction(
    () => !document.body.innerText.includes("Loading documents"),
    {
      timeout: 20_000,
    },
  );
  record("documents load from the API", true);

  await ana.getByRole("button", { name: /Software Proposal template/i }).click();
  await ana.waitForURL(/\/documents\//, { timeout: 30_000 });
  const documentUrl = ana.url();

  await ana.waitForSelector(".tiptap", { timeout: 30_000 });
  record("editor connects to the Yjs server", true);
  await ana.waitForTimeout(2_500);

  const seeded = await ana
    .waitForFunction(
      () => document.querySelector(".tiptap")?.textContent?.includes("software proposal"),
      { timeout: 15_000 },
    )
    .then(() => true)
    .catch(() => false);
  record("template content seeded into the Y.Doc", seeded);

  await ana.locator(".tiptap").click();
  await ana.keyboard.type("Arquitetura sem SaaS.");
  await ana.waitForTimeout(1_200);

  const mariaContext = await browser.newContext();
  const { page: maria } = await signIn(mariaContext, "maria@teste.com");
  await maria.goto(documentUrl, { waitUntil: "domcontentloaded" });
  await maria.waitForSelector(".tiptap", { timeout: 30_000 });

  await maria.waitForFunction(
    () => document.querySelector(".tiptap")?.textContent?.includes("sem SaaS"),
    { timeout: 20_000 },
  );
  record("second user sees the first user's text", true);

  await maria.locator(".tiptap").click();
  await maria.keyboard.press("End");
  await maria.keyboard.type(" Concordo!");
  await ana.waitForFunction(
    () => document.querySelector(".tiptap")?.textContent?.includes("Concordo!"),
    { timeout: 20_000 },
  );
  record("edits replicate in both directions", true);
  record("presence avatars render", (await ana.locator(".rounded-full").count()) > 0);

  // `Home` does not move the caret on macOS Chrome — select backwards instead.
  await ana.locator(".tiptap").click();
  await ana.keyboard.press("End");
  for (let index = 0; index < 9; index += 1) await ana.keyboard.press("Shift+ArrowLeft");
  await ana.getByRole("button", { name: "Comment", exact: true }).first().click();

  const composer = ana.getByPlaceholder("Add a comment…");
  await composer.waitFor({ timeout: 10_000 });
  await composer.fill("@Maria Lima pode revisar isto?");
  await ana.getByRole("button", { name: "Comment", exact: true }).last().click();

  await ana.waitForSelector("article[data-thread-id]", { timeout: 15_000 });
  record("anchored comment thread created", true);
  record(
    "comment anchor marks the text",
    (await ana.locator(".tiptap [data-thread-id]").count()) > 0,
  );

  await maria.waitForSelector("article[data-thread-id]", { timeout: 20_000 });
  record("thread replicates over Yjs", true);

  await maria.getByRole("button", { name: "Reply" }).first().click();
  const reply = maria.getByPlaceholder("Reply…");
  await reply.waitFor({ timeout: 10_000 });
  await reply.fill("Reviso ainda hoje.");
  await maria.getByRole("button", { name: "Reply", exact: true }).last().click();

  await ana.waitForFunction(
    () => document.body.innerText.includes("Reviso ainda hoje."),
    {
      timeout: 20_000,
    },
  );
  record("reply replicates back", true);

  // The collaboration server mirrors comments into Postgres on a debounce.
  await ana.waitForTimeout(4_000);
  await ana.reload({ waitUntil: "domcontentloaded" });
  await ana.waitForSelector(".tiptap", { timeout: 30_000 });
  await ana
    .getByRole("button", { name: /Notifications/i })
    .first()
    .click();
  const inbox = await ana
    .locator("text=commented on")
    .first()
    .innerText()
    .catch(() => "");
  record(
    "notification inbox filled by the collaboration server",
    inbox.length > 0,
    inbox,
  );

  record(
    "no uncaught client errors",
    anaErrors.length === 0,
    anaErrors.slice(0, 2).join(" | "),
  );
} catch (error) {
  record(`threw: ${error.message.split("\n")[0]}`, false);
} finally {
  await browser.close();
}

console.log(`\n${results.map((result) => result.line).join("\n")}\n`);
process.exit(results.every((result) => result.ok) ? 0 : 1);
