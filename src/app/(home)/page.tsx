import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Bot,
  Braces,
  Cable,
  Database,
  GitBranch,
  Layers3,
  RadioTower,
  Sparkles,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'TapState Documentation',
  description:
    'Learn how TapState captures operational changes, transforms data in flight, and serves current state to applications and agents.',
};

const entryPoints = [
  {
    eyebrow: 'Start here',
    title: 'Understand TapState',
    description: 'See the problem TapState solves and how Capture, Transform, and Serve fit together.',
    href: '/docs/overview/what-is-tapstate',
    icon: Layers3,
  },
  {
    eyebrow: 'Connect data',
    title: 'Prepare a connector',
    description: 'Choose a source or target, then follow its permissions and setup guide.',
    href: '/docs/connectors',
    icon: Cable,
  },
  {
    eyebrow: 'Build a path',
    title: 'Create your first pipeline',
    description: 'Connect a source and target with reviewable TapState resources.',
    href: '/docs/overview/quickstart',
    icon: GitBranch,
  },
  {
    eyebrow: 'Look it up',
    title: 'Use the resource reference',
    description: 'Find resource shapes, fields, modes, and pipeline syntax.',
    href: '/docs/reference/dsl-grammar',
    icon: Braces,
  },
];

function ActionLink({
  href,
  children,
  variant = 'primary',
}: {
  href: string;
  children: string;
  variant?: 'primary' | 'secondary';
}) {
  const className = variant === 'primary'
    ? 'border-fd-primary bg-fd-primary text-fd-primary-foreground shadow-sm hover:bg-fd-primary/90'
    : 'border-fd-border bg-fd-background/80 text-fd-foreground hover:border-fd-primary/35 hover:bg-fd-muted/70';

  return (
    <Link
      href={href}
      className={`inline-flex h-11 items-center justify-center gap-2 rounded-lg border px-5 text-sm font-semibold no-underline transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring focus-visible:ring-offset-2 ${className}`}
    >
      {children}
      <ArrowRight className="size-4" aria-hidden="true" />
    </Link>
  );
}

function FlowNode({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border border-fd-border bg-fd-background/90 px-4 py-3 shadow-sm">
      <p className="m-0 text-sm font-semibold text-fd-foreground">{children}</p>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-fd-background text-fd-foreground">
      <section className="relative border-b border-fd-border">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_18%_5%,color-mix(in_oklab,var(--color-fd-primary)_14%,transparent),transparent_35%),radial-gradient(circle_at_82%_16%,color-mix(in_oklab,#38bdf8_10%,transparent),transparent_32%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] [background-size:32px_32px]"
        />

        <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-16 md:px-8 md:py-24 lg:grid-cols-[minmax(0,1.05fr)_minmax(25rem,0.95fr)] lg:items-center lg:gap-16 lg:py-28">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-fd-primary/20 bg-fd-primary/5 px-3 py-1.5 text-xs font-semibold tracking-wide text-fd-primary">
              <Sparkles className="size-3.5" aria-hidden="true" />
              Capture · Transform · Serve
            </div>
            <h1 className="max-w-4xl text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.045em] text-fd-foreground sm:text-5xl md:text-6xl lg:text-7xl">
              Turn database truth into live operational state.
            </h1>
            <p className="mt-6 max-w-2xl text-pretty text-base leading-8 text-fd-muted-foreground md:text-lg">
              TapState brings change capture, in-flight transformation, and current-state delivery into one governed data path for applications, APIs, and AI agents.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ActionLink href="/docs/overview/what-is-tapstate">Explore TapState</ActionLink>
              <ActionLink href="/docs/connectors" variant="secondary">Browse connectors</ActionLink>
            </div>
          </div>

          <div className="relative">
            <div aria-hidden="true" className="absolute -inset-6 rounded-[2rem] bg-fd-primary/5 blur-2xl" />
            <div className="relative rounded-2xl border border-fd-border bg-fd-card/90 p-4 shadow-xl shadow-black/[0.06] backdrop-blur-sm dark:shadow-black/25 sm:p-6">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="m-0 text-xs font-semibold uppercase tracking-[0.14em] text-fd-primary">One governed path</p>
                  <p className="mb-0 mt-1 text-sm text-fd-muted-foreground">From source changes to useful state</p>
                </div>
                <RadioTower className="size-5 text-fd-primary" aria-hidden="true" />
              </div>

              <div className="grid gap-3">
                <FlowNode>Source systems</FlowNode>
                <div className="flex justify-center" aria-hidden="true"><span className="h-5 w-px bg-fd-border" /></div>
                <div className="rounded-2xl border border-fd-primary/25 bg-fd-primary/[0.06] p-4">
                  <div className="flex items-center gap-3">
                    <span className="flex size-9 items-center justify-center rounded-lg bg-fd-primary text-fd-primary-foreground">
                      <Database className="size-4.5" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="m-0 text-sm font-semibold text-fd-foreground">TapState</p>
                      <p className="m-0 text-xs text-fd-muted-foreground">Capture · Transform · Serve</p>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs font-medium text-fd-foreground">
                    <span className="rounded-lg border border-fd-border/80 bg-fd-background/75 px-2 py-2">Capture</span>
                    <span className="rounded-lg border border-fd-border/80 bg-fd-background/75 px-2 py-2">Transform</span>
                    <span className="rounded-lg border border-fd-border/80 bg-fd-background/75 px-2 py-2">Serve</span>
                  </div>
                </div>
                <div className="flex justify-center" aria-hidden="true"><span className="h-5 w-px bg-fd-border" /></div>
                <FlowNode>Applications · APIs · AI agents</FlowNode>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-fd-primary">Documentation paths</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] md:text-4xl">Start with the outcome you need.</h2>
          <p className="mt-4 text-base leading-7 text-fd-muted-foreground">
            Learn the product model, prepare an external system, build a pipeline, or look up exact resource syntax.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {entryPoints.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-2xl border border-fd-border bg-fd-card p-6 text-fd-card-foreground no-underline transition-colors duration-200 hover:border-fd-primary/30 hover:bg-fd-muted/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring"
              >
                <div className="flex items-start gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-fd-primary/15 bg-fd-primary/[0.07] text-fd-primary">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-fd-primary">{item.eyebrow}</span>
                    <span className="mt-1.5 flex items-center gap-2 text-lg font-semibold tracking-tight text-fd-foreground">
                      {item.title}
                      <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
                    </span>
                    <span className="mt-2 block text-sm leading-6 text-fd-muted-foreground">{item.description}</span>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="border-y border-fd-border bg-fd-muted/25">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 md:px-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="flex items-start gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-fd-border bg-fd-background text-fd-primary">
              <Bot className="size-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="m-0 text-2xl font-semibold tracking-tight">The same docs for people and agents</h2>
              <p className="mb-0 mt-2 max-w-2xl text-sm leading-7 text-fd-muted-foreground">
                Use the documentation in your browser, discover pages through llms.txt, or give an assistant the page-level Markdown for exact connector and resource context.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <ActionLink href="/docs/for-ai/llms" variant="secondary">AI-ready docs</ActionLink>
            <ActionLink href="/llms.txt" variant="secondary">View llms.txt</ActionLink>
          </div>
        </div>
      </section>

      <footer className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-8 text-sm text-fd-muted-foreground md:flex-row md:items-center md:justify-between md:px-8">
        <p className="m-0">TapState documentation</p>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          <Link href="/docs" className="text-fd-muted-foreground no-underline hover:text-fd-foreground">All docs</Link>
          <Link href="/docs/connectors" className="text-fd-muted-foreground no-underline hover:text-fd-foreground">Connectors</Link>
          <Link href="/docs/reference/dsl-grammar" className="text-fd-muted-foreground no-underline hover:text-fd-foreground">Reference</Link>
        </div>
      </footer>
    </main>
  );
}
