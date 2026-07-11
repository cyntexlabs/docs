import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import Link from 'next/link';
import type { ComponentProps } from 'react';
import { appName } from './shared';

function MobileDocsTitle({ className, href, ...props }: ComponentProps<'a'>) {
  return (
    <Link href={href ?? '/'} className={`${className ?? ''} md:hidden`} {...props}>
      TapState
    </Link>
  );
}

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: appName,
      url: '/',
    },
    links: [
      {
        text: 'Getting started',
        url: '/docs/overview/quickstart',
        active: 'url',
      },
      {
        text: 'Connectors',
        url: '/docs/connectors',
        active: 'nested-url',
      },
      {
        text: 'Reference',
        url: '/docs/reference/dsl-grammar',
        active: 'nested-url',
      },
      {
        text: 'AI & agents',
        url: '/docs/for-ai/llms',
        active: 'nested-url',
      },
    ],
  };
}

export function docsOptions(): BaseLayoutProps {
  return {
    ...baseOptions(),
    nav: {
      title: MobileDocsTitle,
      url: '/',
    },
    links: [],
  };
}
