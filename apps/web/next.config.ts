import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * `@repo/ui` ships TypeScript rather than a build artefact, which keeps the
   * monorepo free of a compile step for the design system. Next transpiles it
   * like app code.
   *
   * `@repo/collab` is *not* listed on purpose: it ships a real dual ESM/CJS
   * build so the browser resolves it — and Yjs — through the `import`
   * condition, which is what keeps a single copy of Yjs in the bundle.
   */
  transpilePackages: ["@repo/ui"],
};

export default nextConfig;
