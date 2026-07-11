import { docs } from 'collections/server';
import { loader } from 'fumadocs-core/source';
import { llms } from 'fumadocs-core/source';
import {
  docsBaseUrl,
  docsContentRoute,
  docsImageRoute,
  docsRoute,
} from './shared';

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

function renderConnectorProfileForLLM(attrs: string) {
  const field = (name: string) => readAttribute(attrs, name) ?? 'Not specified';

  return `## Connector profile

| Signal | What it means |
|---|---|
| Maturity | ${field('maturity')} — ${field('maturityLabel')} |
| Works as | ${field('worksAs')} |
| Capabilities | ${field('capabilities')} |
| Compatibility | ${field('compatibility')} |`;
}

function cleanMdxForLLM(markdown: string) {
  return markdown
    .replace(/^import\s+.+?;\n?/gm, '')
    .replace(/<Tabs(?:\s[^>]*)?>([\s\S]*?)<\/Tabs>/g, (_match, body: string) => {
      return body.replace(/^ {4}/gm, '');
    })
    .replace(/<Tab\s+[^>]*value="([^"]+)"[^>]*>\n?/g, '\n### $1\n\n')
    .replace(/<\/Tab>\n?/g, '')
    .replace(/<SourceModeTabs>([\s\S]*?)<\/SourceModeTabs>/g, (_match, body: string) => {
      return body.replace(/^ {4}/gm, '');
    })
    .replace(/<SourceModeTab\s+value="([^"]+)">\n?/g, (_match, value: string) => {
      const label = value === 'snapshot' ? 'Snapshot preparation' : 'Snapshot + CDC preparation';
      return `\n\n#### ${label}\n\n`;
    })
    .replace(/<\/SourceModeTab>\n?/g, '\n\n')
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
    .replace(/<\/Aside>\n?/g, '\n\n')
    .replace(/<Badge\s+([^>]*)\/>/g, (_match, attrs: string) => {
      const text = readAttribute(attrs, 'text');
      return text ? `(${text})` : '';
    })
    .replace(/<ValidationStatusGuide\s*\/>/g, `### Interpret the result

- **Valid:** \`valid: 3 resources in tapstate-work\`. Exit code 0; workspace structure, references, and known mode/config rules passed.
- **Needs attention:** \`invalid: orders_source.cyn.yml:12:1 dsl.unknown-field\`. Exit code 1; the CLI prints the message and a suggested fix before you validate again.`)
    .replace(/<ConnectorProfile\s+([\s\S]*?)\/>/g, (_match, attrs: string) => {
      return renderConnectorProfileForLLM(attrs);
    })
    .replace(/^\s{2,}(#{1,6}\s.*)$/gm, '$1')
    .replace(/^\s{2,}(\|.*\|)$/gm, '$1')
    .replace(/([^\n])\n(#{2,6}\s)/g, '$1\n\n$2')
    .replace(/\n{4,}/g, '\n\n\n')
    .trim();
}

type AIPageMetadata = {
  kind: 'connector' | 'concept' | 'reference' | 'guide';
  id: string;
  maturity: 'experimental' | 'preview' | 'ga' | 'deprecated';
  useAs?: Array<'source' | 'target'>;
  modes?: string[];
  aliases?: string[];
};

function absoluteDocsUrl(path: string) {
  return new URL(path, docsBaseUrl).toString();
}

function makeDocumentLinksAbsolute(markdown: string) {
  return markdown.replace(/\]\((\/[^)\s]*)\)/g, (_match, path: string) => {
    return `](${absoluteDocsUrl(path)})`;
  });
}

function getAIPageMetadata(page: (typeof source)['$inferPage']) {
  return (page.data as typeof page.data & { ai?: AIPageMetadata }).ai;
}

function renderAgentMetadata(page: (typeof source)['$inferPage']) {
  const ai = getAIPageMetadata(page);
  if (!ai) return '';

  const fields = [
    ['Content type', ai.kind],
    ['Identifier', ai.id],
    ['Maturity', ai.maturity],
    ['Use as', ai.useAs?.join(', ')],
    ['Modes', ai.modes?.join(', ')],
    ['Aliases', ai.aliases?.join(', ')],
  ].filter((field): field is [string, string] => Boolean(field[1]));

  return `## Agent metadata

${fields.map(([label, value]) => `- ${label}: ${value}`).join('\n')}`;
}

export async function getLLMText(page: (typeof source)['$inferPage']) {
  const processed = makeDocumentLinksAbsolute(
    cleanMdxForLLM(await page.data.getText('processed')),
  );
  const metadata = renderAgentMetadata(page);

  return `# ${page.data.title} (${absoluteDocsUrl(page.url)})

${metadata ? `${metadata}\n\n` : ''}${processed}`;
}

export function getLLMIndex() {
  const index = makeDocumentLinksAbsolute(llms(source).index());
  const [title, ...content] = index.split('\n');

  return [
    title,
    '',
    '> TapState product documentation. Prefer page-level Markdown for implementation decisions.',
    '',
    '## Agent guidance',
    '- Connector frontmatter is a compact discovery index; the page body is the canonical reader and agent context.',
    '- Do not infer unavailable UI or runtime behavior from upstream connector documentation.',
    '',
    ...content,
  ].join('\n');
}

export async function getLLMFullText() {
  const scanned = await Promise.all(source.getPages().map(getLLMText));

  return [
    '# TapState Docs — complete agent context',
    '',
    '> Generated from the canonical documentation source.',
    '',
    scanned.join('\n\n'),
  ].join('\n');
}
