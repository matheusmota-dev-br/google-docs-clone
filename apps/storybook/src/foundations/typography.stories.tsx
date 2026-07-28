import type { Meta, StoryObj } from "@storybook/react-vite";

/**
 * One typeface, driven by the `--font-sans` token. The app feeds it Inter via
 * `next/font`; Storybook falls back to the same stack declared in
 * `packages/ui/styles.css`.
 */
const meta = {
  title: "Foundations/Typography",
  parameters: { layout: "fullscreen", controls: { disable: true } },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const scale = [
  {
    className: "text-3xl font-semibold tracking-tight",
    label: "text-3xl / semibold",
    usage: "Page title",
  },
  {
    className: "text-2xl font-semibold",
    label: "text-2xl / semibold",
    usage: "Document heading",
  },
  {
    className: "text-xl font-medium",
    label: "text-xl / medium",
    usage: "Section heading, wordmark",
  },
  { className: "text-base", label: "text-base", usage: "Editor body copy" },
  {
    className: "text-sm",
    label: "text-sm",
    usage: "UI default — buttons, table cells, menus",
  },
  {
    className: "text-xs text-muted-foreground",
    label: "text-xs / muted",
    usage: "Metadata, captions",
  },
];

export const Scale: Story = {
  render: () => (
    <div className="space-y-8 p-8">
      {scale.map((step) => (
        <div key={step.label} className="space-y-1 border-b pb-6 last:border-b-0">
          <p className={step.className}>The quick brown fox jumps over the lazy dog</p>
          <p className="font-mono text-xs text-muted-foreground">
            {step.label} — {step.usage}
          </p>
        </div>
      ))}
    </div>
  ),
};

/** Elevation is the other half of hierarchy: three levels, no more. */
export const Elevation: Story = {
  render: () => (
    <div className="grid gap-6 bg-canvas p-8 sm:grid-cols-3">
      {[
        { className: "shadow-sm", label: "shadow-sm", usage: "Resting cards" },
        { className: "shadow-paper", label: "shadow-paper", usage: "The document page" },
        { className: "shadow-lg", label: "shadow-lg", usage: "Overlays, toasts, menus" },
      ].map((level) => (
        <div
          key={level.label}
          className={`space-y-1 rounded-lg border bg-card p-6 ${level.className}`}
        >
          <p className="font-mono text-xs">{level.label}</p>
          <p className="text-xs text-muted-foreground">{level.usage}</p>
        </div>
      ))}
    </div>
  ),
};
