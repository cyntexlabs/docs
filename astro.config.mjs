import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://docs.cyntex.io',
  integrations: [
    starlight({
      title: 'Cyntex Docs',
      description: 'AI-native data integration platform — built for the agentic era',
      logo: {
        light: './src/assets/logo-light.svg',
        dark: './src/assets/logo-dark.svg',
        replacesTitle: false,
      },
      social: {
        github: 'https://github.com/cyntex/cyntex',
      },
      editLink: {
        baseUrl: 'https://github.com/cyntex/cyntex-docs/edit/main/',
      },
      customCss: ['./src/styles/custom.css'],
      sidebar: [
        {
          label: 'Overview',
          items: [
            { label: 'What is Cyntex?', slug: 'overview/what-is-cyntex' },
            { label: 'Architecture', slug: 'overview/architecture' },
            { label: 'Use Cases', slug: 'overview/use-cases' },
            { label: 'Cyntex vs. The Streaming Stack', slug: 'overview/vs-streaming-stack' },
            { label: 'Roadmap', slug: 'overview/roadmap' },
          ],
        },
        {
          label: 'Concepts',
          items: [
            { label: 'DSL & Pipelines', slug: 'concepts/dsl' },
            { label: 'Connectors', slug: 'concepts/connectors' },
            { label: 'AI Control Layer', slug: 'concepts/ai-control' },
            { label: 'Storage Model', slug: 'concepts/storage' },
          ],
        },
        {
          label: 'DSL Reference',
          items: [
            { label: 'Grammar Overview', slug: 'reference/dsl-grammar' },
            { label: 'source', slug: 'reference/source' },
            { label: 'pipeline', slug: 'reference/pipeline' },
            { label: 'transforms', slug: 'reference/transforms' },
            { label: 'serve', slug: 'reference/serve' },
          ],
        },
        {
          label: 'For AI / LLMs',
          items: [
            { label: 'llms.txt', slug: 'for-ai/llms' },
            { label: 'MCP Integration', slug: 'for-ai/mcp' },
            { label: 'Authoring with AI', slug: 'for-ai/authoring' },
          ],
        },
        {
          label: 'Connector Reference',
          items: [
            { label: 'All Connectors', slug: 'connectors' },
            { label: 'MySQL', slug: 'connectors/mysql' },
            { label: 'PostgreSQL', slug: 'connectors/postgresql' },
            { label: 'Oracle', slug: 'connectors/oracle' },
            { label: 'SQL Server', slug: 'connectors/sqlserver' },
            { label: 'MongoDB', slug: 'connectors/mongodb' },
            { label: 'MongoDB Atlas', slug: 'connectors/mongodb-atlas' },
            { label: 'Kafka', slug: 'connectors/kafka' },
          ],
          collapsed: false,
        },
        {
          label: 'Architecture Decisions',
          autogenerate: { directory: 'reference/adr' },
          collapsed: true,
        },
      ],
      // Syntax highlighting for .cyn.yml (treated as yaml)
      expressiveCode: {
        themes: ['github-dark', 'github-light'],
      },
    }),
  ],
});
