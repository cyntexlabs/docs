'use client';

import { RefreshCw, Rows3 } from 'lucide-react';
import type { ReactNode } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from 'fumadocs-ui/components/tabs';

export function SourceModeTabs({
  children,
  label = 'Choose the source read mode',
}: {
  children: ReactNode;
  label?: string;
}) {
  return (
    <Tabs
      defaultValue="snapshot"
      className="not-prose my-5 gap-0 overflow-hidden rounded-xl border border-fd-border bg-fd-card"
    >
      <TabsList
        aria-label={label}
        className="grid w-full grid-cols-2 gap-1 border-b border-fd-border bg-fd-muted/35 p-1.5"
      >
        <TabsTrigger
          value="snapshot"
          className="cursor-pointer justify-start rounded-lg border border-transparent px-3 py-2.5 text-left transition-colors duration-200 hover:bg-fd-background/70 data-[state=active]:border-sky-200 data-[state=active]:bg-fd-card data-[state=active]:text-sky-800 data-[state=active]:shadow-sm dark:data-[state=active]:border-sky-900 dark:data-[state=active]:text-sky-200"
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
            <Rows3 aria-hidden="true" className="size-4" strokeWidth={2} />
          </span>
          <span className="min-w-0">
            <span className="block font-semibold text-fd-foreground">Snapshot</span>
            <span className="hidden text-xs font-normal text-fd-muted-foreground sm:block">Copy existing rows once</span>
          </span>
        </TabsTrigger>
        <TabsTrigger
          value="snapshot-cdc"
          className="cursor-pointer justify-start rounded-lg border border-transparent px-3 py-2.5 text-left transition-colors duration-200 hover:bg-fd-background/70 data-[state=active]:border-cyan-200 data-[state=active]:bg-fd-card data-[state=active]:text-cyan-800 data-[state=active]:shadow-sm dark:data-[state=active]:border-cyan-900 dark:data-[state=active]:text-cyan-200"
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300">
            <RefreshCw aria-hidden="true" className="size-4" strokeWidth={2} />
          </span>
          <span className="min-w-0">
            <span className="block font-semibold text-fd-foreground">Snapshot + CDC</span>
            <span className="hidden text-xs font-normal text-fd-muted-foreground sm:block">Copy existing rows, then stay in sync</span>
          </span>
        </TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  );
}

export function SourceModeTab({
  value,
  children,
}: {
  value: 'snapshot' | 'snapshot-cdc';
  children: ReactNode;
}) {
  return (
    <TabsContent value={value} className="rounded-none bg-transparent p-4 sm:p-5">
      {children}
    </TabsContent>
  );
}
