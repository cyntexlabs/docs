import defaultMdxComponents from 'fumadocs-ui/mdx';
import Link from 'next/link';
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

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    Aside,
    Card,
    CardGrid,
    LinkCard,
    Badge,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
