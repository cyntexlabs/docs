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
        text: 'Docs',
        url: '/docs',
        active: 'nested-url',
      },
      {
        text: 'Architecture',
        url: '/docs/overview/architecture',
        active: 'url',
      },
      {
        text: 'Reference',
        url: '/docs/reference/dsl-grammar',
        active: 'nested-url',
      },
      {
        text: 'AI',
        url: '/docs/for-ai/llms',
        active: 'nested-url',
      },
    ],
  };
}
