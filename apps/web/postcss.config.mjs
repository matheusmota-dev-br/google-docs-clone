/** @type {import("postcss-load-config").Config} */
export default {
  plugins: {
    // Inlines `@import "@repo/ui/styles.css"` before Tailwind runs.
    "postcss-import": {},
    tailwindcss: {},
    autoprefixer: {},
  },
};
