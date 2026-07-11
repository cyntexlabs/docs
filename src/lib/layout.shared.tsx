import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { appName } from './shared';

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
      title: appName,
      url: '/docs',
    },
    links: [],
  };
}
