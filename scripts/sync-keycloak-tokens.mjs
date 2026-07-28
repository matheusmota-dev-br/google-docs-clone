/**
 * Copies the design tokens into the Keycloak login theme.
 *
 * Keycloak serves its own pages, so it cannot import `@repo/ui/styles.css`
 * the way the apps do. Rather than let a second palette drift out of sync,
 * the `:root` block is generated from the same file the product uses.
 *
 * Run `pnpm theme:sync` after changing a token; `--check` fails instead of
 * writing, which is what CI uses.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = resolve(root, "packages/ui/styles.css");
const target = resolve(root, "infra/keycloak/themes/docs/login/resources/css/tokens.css");

const css = readFileSync(source, "utf8");
const rootBlock = /:root\s*\{([\s\S]*?)\n\}/.exec(css);

if (!rootBlock) {
  console.error(`Could not find a :root block in ${source}`);
  process.exit(1);
}

const generated = `/**
 * GENERATED FILE — do not edit.
 *
 * Produced from packages/ui/styles.css by scripts/sync-keycloak-tokens.mjs so
 * the login page and the product cannot drift apart. Run \`pnpm theme:sync\`.
 *
 * Light only, matching the app.
 */

:root {${rootBlock[1]}
}
`;

const check = process.argv.includes("--check");
const current = (() => {
  try {
    return readFileSync(target, "utf8");
  } catch {
    return null;
  }
})();

if (current === generated) {
  console.log("✓ Keycloak theme tokens are up to date");
} else if (check) {
  console.error(
    "✗ Keycloak theme tokens are stale. Run `pnpm theme:sync` and commit the result.",
  );
  process.exit(1);
} else {
  writeFileSync(target, generated);
  console.log(`✓ Wrote ${target.replace(`${root}/`, "")}`);
}
