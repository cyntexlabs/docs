import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpenText,
  Bot,
  Braces,
  Cable,
  Database,
  GitBranch,
  Network,
  ShieldCheck,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'TapState Documentation',
  description:
    'Documentation for TapState connectors, resource authoring, product concepts, and release evidence.',
};

const entryPoints = [
  {
    title: 'Understand the product model',
    description: 'The operational-data problem, architecture, use cases, and decision boundaries.',
    href: '/docs/overview/what-is-tapstate',
    icon: Network,
  },
  {
    title: 'Author resources',
    description: 'The documented resource model, field rules, validation boundary, and examples.',
    href: '/docs/reference/dsl-grammar',
    icon: Braces,
  },
  {
    title: 'Prepare connectors',
    description: 'Connector IDs, roles, modes, prerequisites, limitations, and exact fields.',
    href: '/docs/connectors',
    icon: Cable,
  },
  {
    title: 'Use AI-readable docs',
    description: 'Use llms.txt, page Markdown, and deterministic product contracts with assistants.',
    href: '/docs/for-ai/llms',
    icon: Bot,
  },
];

const flow = [
  { label: 'Understand', text: 'Start with the product model and release-evidence boundary', icon: Database },
  { label: 'Prepare', text: 'Choose a connector, role, mode, and external-system setup', icon: GitBranch },
  { label: 'Author', text: 'Describe the intended path with reviewable resources', icon: ShieldCheck },
];

function PrimaryLink({
  href,
  children,
  variant = 'primary',
}: {
  href: string;
  children: string;
  variant?: 'primary' | 'secondary';
}) {
  return (
    <Link
      href={href}
      className={
        variant === 'primary'
          ? 'inline-flex h-11 items-center gap-2 rounded-md bg-fd-primary px-5 text-sm font-medium text-fd-primary-foreground no-underline shadow-sm transition-colors hover:bg-fd-primary/90'
          : 'inline-flex h-11 items-center gap-2 rounded-md border border-fd-border bg-fd-background px-5 text-sm font-medium text-fd-foreground no-underline transition-colors hover:bg-fd-muted'
      }
    >
      {children}
      <ArrowRight className="size-4" aria-hidden="true" />
    </Link>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-fd-background text-fd-foreground">
      <section className="relative overflow-hidden border-b border-fd-border">
        <div className="absolute inset-x-0 top-0 h-80 bg-[linear-gradient(180deg,hsl(var(--fd-primary)/0.10),transparent)]" />

        <div className="relative mx-auto max-w-6xl px-5 pb-14 pt-16 md:pb-20 md:pt-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-semibold tracking-normal text-fd-foreground md:text-6xl">
              TapState Documentation
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-fd-muted-foreground md:text-lg">
              Understand the product model, prepare external systems, author reviewable resources, and
              distinguish documented intent from runtime-verified behavior.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <PrimaryLink href="/docs">Open documentation</PrimaryLink>
              <PrimaryLink href="/docs/reference/dsl-grammar" variant="secondary">
                Reference
              </PrimaryLink>
            </div>
          </div>

          <div className="mt-12 grid gap-3 md:grid-cols-3">
            {flow.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="rounded-lg border border-fd-border bg-fd-card/70 p-4">
                  <div className="flex items-center gap-3">
                    <Icon className="size-5 text-fd-primary" aria-hidden="true" />
                    <p className="font-medium text-fd-foreground">{item.label}</p>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-fd-muted-foreground">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14 md:py-18">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <h2 className="text-2xl font-semibold tracking-normal md:text-3xl">Start where you are</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-fd-muted-foreground">
              Choose the path that matches the question in front of you: product orientation, resource
              authoring, connector preparation, or AI-readable context.
            </p>
          </div>
          <Link
            href="/docs"
            className="hidden items-center gap-2 text-sm font-medium text-fd-primary no-underline md:inline-flex"
          >
            Browse all docs
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {entryPoints.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-lg border border-fd-border bg-fd-card p-5 text-fd-card-foreground no-underline transition-colors hover:bg-fd-muted/60"
              >
                <div className="flex items-start gap-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-md border border-fd-border bg-fd-background text-fd-primary">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="flex items-center gap-2 font-medium">
                      {item.title}
                      <ArrowRight
                        className="size-4 opacity-0 transition-opacity group-hover:opacity-100"
                        aria-hidden="true"
                      />
                    </span>
                    <span className="mt-2 block text-sm leading-6 text-fd-muted-foreground">{item.description}</span>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="border-t border-fd-border bg-fd-muted/30">
        <div className="mx-auto max-w-6xl px-5 py-14 md:py-18">
          <div className="max-w-3xl">
            <BookOpenText className="mb-5 size-8 text-fd-primary" aria-hidden="true" />
            <h2 className="text-2xl font-semibold tracking-normal md:text-3xl">One source for readers and agents</h2>
            <p className="mt-4 text-sm leading-7 text-fd-muted-foreground">
              TapState publishes human-readable guides and LLM-oriented context from the same content tree.
              Connector metadata helps discovery, while the page body remains the canonical product explanation.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <PrimaryLink href="/llms.txt" variant="secondary">
                View llms.txt
              </PrimaryLink>
              <PrimaryLink href="/docs/overview/release-status" variant="secondary">
                Check release evidence
              </PrimaryLink>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
