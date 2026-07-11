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
    'The Operational Data Hub for the Agentic AI era — real-time CDC, YAML pipelines, and AI-native control.',
};

const entryPoints = [
  {
    title: 'Understand TapState',
    description: 'Operational Data Hub concepts, runtime architecture, and where TapState fits.',
    href: '/docs/overview/what-is-tapstate',
    icon: Network,
  },
  {
    title: 'Write DSL',
    description: 'The .cyn.yml resource model, field rules, validation flow, and examples.',
    href: '/docs/reference/dsl-grammar',
    icon: Braces,
  },
  {
    title: 'Connect Sources',
    description: 'Connector IDs, supported modes, prerequisites, and configuration references.',
    href: '/docs/connectors',
    icon: Cable,
  },
  {
    title: 'Operate with AI',
    description: 'llms.txt, MCP, and BYO-agent workflows for controlling TapState safely.',
    href: '/docs/for-ai/llms',
    icon: Bot,
  },
];

const flow = [
  { label: 'Capture', text: 'Log-based CDC and full snapshot ingestion', icon: Database },
  { label: 'Model', text: 'Versioned YAML pipelines and deterministic validation', icon: GitBranch },
  { label: 'Serve', text: 'Materialized views, event output, and AI control surfaces', icon: ShieldCheck },
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
        <div
          className="pointer-events-none absolute right-[-120px] top-10 hidden w-[620px] opacity-[0.10] md:block"
          aria-hidden="true"
        >
          <img src="/assets/architecture-diagram.svg" alt="" className="w-full" />
        </div>

        <div className="relative mx-auto max-w-6xl px-5 pb-14 pt-16 md:pb-20 md:pt-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-semibold tracking-normal text-fd-foreground md:text-6xl">
              TapState Documentation
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-fd-muted-foreground md:text-lg">
              Build real-time operational data flows with CDC, YAML pipelines, connector catalogs, and
              AI-native control surfaces designed for human review and agent-assisted operation.
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
            <h2 className="text-2xl font-semibold tracking-normal md:text-3xl">Start Where You Are</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-fd-muted-foreground">
              Pick the path that matches the job in front of you: product orientation, schema work,
              connector setup, or AI operation.
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
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-14 md:grid-cols-[0.9fr_1.1fr] md:items-center md:py-18">
          <div>
            <BookOpenText className="mb-5 size-8 text-fd-primary" aria-hidden="true" />
            <h2 className="text-2xl font-semibold tracking-normal md:text-3xl">Reference That Agents Can Read</h2>
            <p className="mt-4 text-sm leading-7 text-fd-muted-foreground">
              TapState docs expose human-readable guides and LLM-oriented context files from the same content tree,
              so product knowledge can support IDEs, assistants, and runtime control workflows without drifting.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <PrimaryLink href="/llms.txt" variant="secondary">
                View llms.txt
              </PrimaryLink>
              <PrimaryLink href="/docs/for-ai/mcp" variant="secondary">
                MCP Guide
              </PrimaryLink>
            </div>
          </div>
          <div className="rounded-lg border border-fd-border bg-fd-background p-4">
            <img
              src="/assets/architecture-diagram.svg"
              alt="TapState runtime architecture diagram"
              className="w-full rounded-md"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
