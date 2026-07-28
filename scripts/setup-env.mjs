/**
 * Copies every `.env.example` in the workspace to the file the app actually
 * reads, skipping any that already exist. The defaults point at the services
 * in `infra/docker-compose.yml`, so a fresh clone works with no editing.
 */
import { copyFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/** [directory, name of the file that directory's tooling loads] */
const targets = [
  ["apps/web", ".env.local"],
  ["apps/api", ".env"],
  ["apps/collab", ".env"],
  ["packages/db", ".env"],
];

let created = 0;

for (const [directory, filename] of targets) {
  const example = join(root, directory, ".env.example");
  const destination = join(root, directory, filename);

  if (!existsSync(example)) continue;

  if (existsSync(destination)) {
    console.log(`· ${directory}/${filename} already exists, left alone`);
    continue;
  }

  copyFileSync(example, destination);
  console.log(`✓ ${directory}/${filename}`);
  created += 1;
}

console.log(
  created > 0
    ? `\nCreated ${created} env file(s) from their examples.`
    : "\nNothing to do — every env file was already in place.",
);
