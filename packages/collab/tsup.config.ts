import { defineConfig } from "tsup";

/**
 * Dual ESM + CJS output.
 *
 * This matters more than usual here: Yjs breaks its own `instanceof` checks if
 * two copies of the module end up in one process. Shipping both formats lets
 * the browser bundle resolve this package *and* Yjs through the `import`
 * condition, while the Node server resolves both through `require` — one copy
 * of Yjs on each side.
 */
export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  sourcemap: true,
  target: "es2022",
  external: ["yjs"],
});
