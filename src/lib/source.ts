import { docs } from 'collections/server';
import { loader } from 'fumadocs-core/source';
import { docsContentRoute, docsImageRoute, docsRoute } from './shared';

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  baseUrl: docsRoute,
  source: docs.toFumadocsSource(),
  plugins: [],
});

export const docsSource = loader({
  baseUrl: '/docs',
  source: docs.toFumadocsSource(),
  plugins: [],
});

export function getPageImage(page: (typeof source)['$inferPage']) {
  const segments = [...page.slugs, 'image.png'];

  return {
    segments,
    url: `${docsImageRoute}/${segments.join('/')}`,
  };
}

export function getPageMarkdownUrl(page: (typeof source)['$inferPage']) {
  const segments = [...page.slugs, 'content.md'];

  return {
    segments,
    url: `${docsContentRoute}/${segments.join('/')}`,
  };
}

function readAttribute(attrs: string, name: string) {
  return attrs.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];
}

function cleanMdxForLLM(markdown: string) {
  return markdown
    .replace(/<div[^>]*>\n?/g, '')
    .replace(/<\/div>\n?/g, '')
    .replace(/<CardGrid>\n?/g, '')
    .replace(/<\/CardGrid>\n?/g, '')
    .replace(/<Card\s+([^>]*)>\n?/g, (_match, attrs: string) => {
      const title = readAttribute(attrs, 'title');
      return title ? `\n### ${title}\n\n` : '\n';
    })
    .replace(/<\/Card>\n?/g, '\n')
    .replace(/<LinkCard\s+([\s\S]*?)\/>/g, (_match, attrs: string) => {
      const title = readAttribute(attrs, 'title') ?? 'Untitled';
      const href = readAttribute(attrs, 'href') ?? '#';
      const description = readAttribute(attrs, 'description');
      return `- [${title}](${href})${description ? `: ${description}` : ''}\n`;
    })
    .replace(/<Aside\s+([^>]*)>\n?/g, (_match, attrs: string) => {
      const title = readAttribute(attrs, 'title');
      return title ? `\n> **${title}**\n>\n` : '\n';
    })
    .replace(/<\/Aside>\n?/g, '\n')
    .replace(/<Badge\s+([^>]*)\/>/g, (_match, attrs: string) => {
      const text = readAttribute(attrs, 'text');
      return text ? `(${text})` : '';
    })
    .replace(/\n{4,}/g, '\n\n\n')
    .trim();
}

export async function getLLMText(page: (typeof source)['$inferPage']) {
  const processed = cleanMdxForLLM(await page.data.getText('processed'));

  return `# ${page.data.title} (${page.url})

${processed}`;
}
