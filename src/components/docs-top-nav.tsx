'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

const sections = [
  { label: 'Overview', href: '/docs/overview/what-is-tapstate', prefix: '/docs/overview/' },
  { label: 'Concepts', href: '/docs/concepts/dsl', prefix: '/docs/concepts/' },
  { label: 'Connectors', href: '/docs/connectors', prefix: '/docs/connectors' },
  { label: 'Reference', href: '/docs/reference/dsl-grammar', prefix: '/docs/reference/' },
  { label: 'AI & agents', href: '/docs/for-ai/llms', prefix: '/docs/for-ai/' },
];

export function DocsTopNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 hidden h-14 border-b border-fd-border bg-fd-background/95 backdrop-blur md:block">
      <div className="mx-auto grid h-full max-w-[97rem] grid-cols-[1fr_auto_1fr] items-center px-6 xl:px-8">
        <Link href="/" className="w-fit text-[0.9375rem] font-semibold tracking-tight text-fd-foreground no-underline">
          TapState
        </Link>

        <nav aria-label="Documentation sections" className="flex h-full items-center gap-7">
          {sections.map((section) => {
            const active = pathname === section.href || pathname.startsWith(section.prefix);

            return (
              <Link
                key={section.href}
                href={section.href}
                aria-current={active ? 'page' : undefined}
                className={`relative inline-flex h-full items-center text-sm font-medium no-underline transition-colors duration-200 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:transition-colors ${
                  active
                    ? 'text-fd-foreground after:bg-fd-primary'
                    : 'text-fd-muted-foreground after:bg-transparent hover:text-fd-foreground'
                }`}
              >
                {section.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex justify-end">
          <Link
            href="/docs/overview/quickstart"
            className="inline-flex h-9 items-center gap-2 rounded-md bg-fd-primary px-3.5 text-sm font-medium text-fd-primary-foreground no-underline transition-colors duration-200 hover:bg-fd-primary/90"
          >
            Get started
            <ArrowRight aria-hidden="true" className="size-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
