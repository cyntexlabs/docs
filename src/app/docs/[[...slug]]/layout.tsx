import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { docsOptions } from '@/lib/layout.shared';
import type { ReactNode } from 'react';
import { DocsTopNav } from '@/components/docs-top-nav';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="tapstate-docs-shell">
      <DocsTopNav />
      <DocsLayout
        tree={source.getPageTree()}
        tabs={false}
        containerProps={{ className: 'tapstate-docs-layout' }}
        {...docsOptions()}
      >
        {children}
      </DocsLayout>
    </div>
  );
}
