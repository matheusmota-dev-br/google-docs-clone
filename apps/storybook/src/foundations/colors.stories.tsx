import type { Meta, StoryObj } from "@storybook/react-vite";

/**
 * Every colour in the system is a CSS custom property declared in
 * `packages/ui/styles.css` and mapped onto Tailwind by
 * `@repo/tailwind-config`. Components reference the *role* (`bg-primary`),
 * never the value — which is why the dark theme is a single class swap.
 *
 * Use the theme toggle in the toolbar to inspect both palettes.
 */
const meta = {
  title: "Foundations/Colours",
  parameters: { layout: "fullscreen", controls: { disable: true } },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

interface Token {
  name: string;
  className: string;
  textClassName?: string;
  usage: string;
}

const surfaces: Token[] = [
  {
    name: "background",
    className: "bg-background",
    usage: "App canvas behind everything",
  },
  { name: "card", className: "bg-card", usage: "The document paper, cards, popovers" },
  { name: "canvas", className: "bg-canvas", usage: "The desk the paper sits on" },
  { name: "muted", className: "bg-muted", usage: "Toolbars, search field, subtle fills" },
  { name: "accent", className: "bg-accent", usage: "Hover and focus states in menus" },
];

const intents: Token[] = [
  {
    name: "primary",
    className: "bg-primary",
    textClassName: "text-primary-foreground",
    usage: "Primary actions, links, active state",
  },
  {
    name: "secondary",
    className: "bg-secondary",
    textClassName: "text-secondary-foreground",
    usage: "Secondary buttons",
  },
  {
    name: "destructive",
    className: "bg-destructive",
    textClassName: "text-destructive-foreground",
    usage: "Delete and other irreversible actions",
  },
  {
    name: "success",
    className: "bg-success",
    textClassName: "text-success-foreground",
    usage: "Confirmations, saved state",
  },
];

const lines: Token[] = [
  { name: "border", className: "bg-border", usage: "Dividers and component outlines" },
  { name: "input", className: "bg-input", usage: "Form control borders" },
  { name: "ring", className: "bg-ring", usage: "Keyboard focus ring" },
];

const Swatch = ({ token }: { token: Token }) => (
  <div className="overflow-hidden rounded-lg border">
    <div
      className={`flex h-20 items-end p-3 text-xs font-medium ${token.className} ${
        token.textClassName ?? "text-foreground"
      }`}
    >
      --{token.name}
    </div>
    <div className="space-y-0.5 border-t p-3">
      <p className="font-mono text-xs">{token.className}</p>
      <p className="text-xs text-muted-foreground">{token.usage}</p>
    </div>
  </div>
);

const Section = ({ title, tokens }: { title: string; tokens: Token[] }) => (
  <section className="space-y-3">
    <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
      {title}
    </h2>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {tokens.map((token) => (
        <Swatch key={token.name} token={token} />
      ))}
    </div>
  </section>
);

export const Palette: Story = {
  render: () => (
    <div className="space-y-10 p-8">
      <Section title="Surfaces" tokens={surfaces} />
      <Section title="Intents" tokens={intents} />
      <Section title="Lines & focus" tokens={lines} />
    </div>
  ),
};

/** The five-step categorical scale used by any chart in the product. */
export const Chart: Story = {
  render: () => (
    <div className="p-8">
      <div className="flex h-32 items-end gap-2">
        {[1, 2, 3, 4, 5].map((step, index) => (
          <div key={step} className="flex flex-1 flex-col items-center gap-2">
            <div
              className="w-full rounded-t-md"
              style={{
                height: `${40 + index * 18}px`,
                backgroundColor: `hsl(var(--chart-${step}))`,
              }}
            />
            <span className="font-mono text-xs text-muted-foreground">
              --chart-{step}
            </span>
          </div>
        ))}
      </div>
    </div>
  ),
};
