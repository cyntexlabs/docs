import defaultMdxComponents from 'fumadocs-ui/mdx';
import Link from 'next/link';
import { BadgeCheck, CircleAlert, CircleCheck, Database } from 'lucide-react';
import type { ReactNode } from 'react';
import type { MDXComponents } from 'mdx/types';

type AsideType = 'note' | 'tip' | 'caution' | 'danger';

const asideClassName: Record<AsideType, string> = {
  note: 'border-blue-200 bg-blue-50 text-blue-950 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-100',
  tip: 'border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-100',
  caution:
    'border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-100',
  danger: 'border-red-200 bg-red-50 text-red-950 dark:border-red-900 dark:bg-red-950/30 dark:text-red-100',
};

export function Aside({
  children,
  title,
  type = 'note',
}: {
  children: ReactNode;
  title?: ReactNode;
  type?: AsideType;
}) {
  return (
    <aside className={`my-6 rounded-lg border p-4 ${asideClassName[type] ?? asideClassName.note}`}>
      {title ? <p className="mb-2 font-semibold">{title}</p> : null}
      <div className="[&>*:first-child]:mt-0 [&>*:last-child]:mb-0">{children}</div>
    </aside>
  );
}

export function Card({
  children,
  title,
  href,
}: {
  children?: ReactNode;
  title: ReactNode;
  href?: string;
  icon?: string;
}) {
  const body = (
    <div className="h-full rounded-lg border bg-card p-4 text-card-foreground transition-colors hover:bg-accent/40">
      <p className="mb-2 font-semibold">{title}</p>
      {children ? <div className="text-sm text-muted-foreground [&>*:first-child]:mt-0">{children}</div> : null}
    </div>
  );

  return href ? <Link href={href}>{body}</Link> : body;
}

export function LinkCard({
  title,
  description,
  href,
}: {
  title: ReactNode;
  description?: ReactNode;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="block rounded-lg border bg-card p-4 text-card-foreground no-underline transition-colors hover:bg-accent/40"
    >
      <p className="mb-2 font-semibold">{title}</p>
      {description ? <p className="m-0 text-sm text-muted-foreground">{description}</p> : null}
    </Link>
  );
}

export function CardGrid({ children }: { children: ReactNode }) {
  return <div className="my-6 grid gap-4 sm:grid-cols-2">{children}</div>;
}

export function Badge({ text, children }: { text?: ReactNode; children?: ReactNode; variant?: string }) {
  return (
    <span className="inline-flex rounded-md border bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
      {text ?? children}
    </span>
  );
}

type ConnectorProfileProps = {
  maturity: string;
  maturityLabel: string;
  worksAs: string;
  capabilities: string;
  compatibility: string;
};

function ConnectorProfileRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-1.5 py-2.5 sm:grid-cols-[8rem_minmax(0,1fr)] sm:items-center sm:gap-4">
      <dt className="text-sm font-medium text-fd-muted-foreground">{label}</dt>
      <dd className="m-0 min-w-0 text-sm font-medium text-fd-card-foreground">{children}</dd>
    </div>
  );
}

function ConnectorProfileTags({ value }: { value: string }) {
  const tone = (item: string) => {
    const key = item.trim().toLowerCase();

    if (key === 'source' || key === 'snapshot') {
      return 'border-sky-200 bg-sky-50 text-sky-800 dark:border-sky-800 dark:bg-sky-950/45 dark:text-sky-200';
    }
    if (key === 'target' || key === 'schema discovery') {
      return 'border-violet-200 bg-violet-50 text-violet-800 dark:border-violet-800 dark:bg-violet-950/45 dark:text-violet-200';
    }
    if (key === 'cdc') {
      return 'border-cyan-200 bg-cyan-50 text-cyan-800 dark:border-cyan-800 dark:bg-cyan-950/45 dark:text-cyan-200';
    }
    if (key === 'ddl capture') {
      return 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950/45 dark:text-amber-200';
    }
    if (key === 'ddl apply') {
      return 'border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-800 dark:bg-rose-950/45 dark:text-rose-200';
    }

    return 'border-fd-border bg-fd-muted/55 text-fd-foreground';
  };

  return (
    <span className="flex flex-wrap gap-1.5">
      {value.split(',').map((item) => (
        <span
          key={item}
          className={`inline-flex rounded-md border px-2 py-0.5 text-xs font-medium leading-5 ${tone(item)}`}
        >
          {item.trim()}
        </span>
      ))}
    </span>
  );
}

/** A compact connector summary that remains a structured definition list in LLM output. */
export function ConnectorProfile({
  maturity,
  maturityLabel,
  worksAs,
  capabilities,
  compatibility,
}: ConnectorProfileProps) {
  return (
    <section
      aria-label="Connector profile"
      className="not-prose my-7 rounded-xl border border-fd-border bg-fd-card px-4 shadow-sm shadow-black/[0.025] sm:px-5 dark:shadow-none"
    >
      <h2 className="sr-only">Connector profile</h2>
      <dl className="divide-y divide-fd-border">
        <ConnectorProfileRow label="Maturity">
          <span className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-300 bg-emerald-50 px-2 py-0.5 text-xs font-semibold leading-5 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/45 dark:text-emerald-300">
              <BadgeCheck aria-hidden="true" className="size-3.5" strokeWidth={2.25} />
              {maturity}
            </span>
            <span className="text-emerald-800/80 dark:text-emerald-200/80">{maturityLabel}</span>
          </span>
        </ConnectorProfileRow>
        <ConnectorProfileRow label="Works as">
          <ConnectorProfileTags value={worksAs} />
        </ConnectorProfileRow>
        <ConnectorProfileRow label="Capabilities">
          <ConnectorProfileTags value={capabilities} />
        </ConnectorProfileRow>
        <ConnectorProfileRow label="Compatibility">
          <span className="inline-flex items-center gap-1.5 text-fd-card-foreground">
            <Database aria-hidden="true" className="size-3.5 text-indigo-500" strokeWidth={2} />
            {compatibility}
          </span>
        </ConnectorProfileRow>
      </dl>
    </section>
  );
}

/** Code-backed guidance for interpreting CLI validation without simulating a live connection test. */
export function ValidationStatusGuide() {
  return (
    <div className="not-prose my-5 grid gap-3 sm:grid-cols-2">
      <section className="rounded-xl border border-emerald-200 bg-emerald-50/65 p-4 dark:border-emerald-900 dark:bg-emerald-950/25">
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-800 dark:text-emerald-200">
          <CircleCheck aria-hidden="true" className="size-4" strokeWidth={2.25} />
          Valid
        </div>
        <code className="block rounded-md border border-emerald-200/80 bg-white/70 px-2.5 py-2 text-xs text-emerald-950 dark:border-emerald-900 dark:bg-black/15 dark:text-emerald-100">
          valid: 3 resources in tapstate-work
        </code>
        <p className="mb-0 mt-2 text-sm text-emerald-950/80 dark:text-emerald-100/80">
          Exit code 0. The workspace passed structure, reference, and known mode/config checks.
        </p>
      </section>
      <section className="rounded-xl border border-amber-200 bg-amber-50/65 p-4 dark:border-amber-900 dark:bg-amber-950/25">
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-amber-900 dark:text-amber-200">
          <CircleAlert aria-hidden="true" className="size-4" strokeWidth={2.25} />
          Needs attention
        </div>
        <code className="block whitespace-pre-wrap rounded-md border border-amber-200/80 bg-white/70 px-2.5 py-2 text-xs leading-5 text-amber-950 dark:border-amber-900 dark:bg-black/15 dark:text-amber-100">
          {`invalid: orders_source.cyn.yml:12:1  dsl.unknown-field
Unknown field 'unexpected' at unexpected.`}
        </code>
        <p className="mb-0 mt-2 text-sm text-amber-950/80 dark:text-amber-100/80">
          Exit code 1. The CLI also prints a suggested fix; apply it and validate again.
        </p>
      </section>
    </div>
  );
}

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    Aside,
    Card,
    CardGrid,
    LinkCard,
    Badge,
    ConnectorProfile,
    ValidationStatusGuide,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
