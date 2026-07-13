import { access, readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const upstreamDir = process.env.DOCS_EN_CONNECTORS_DIR;

if (!upstreamDir) {
  console.error('Set DOCS_EN_CONNECTORS_DIR to the docs-en/docs/connectors directory before running this check.');
  process.exit(2);
}

const directoryFile = new URL('../src/lib/connector-directory.ts', import.meta.url);
const guidesDir = new URL('../content/docs/connectors/', import.meta.url);
const source = await readFile(directoryFile, 'utf8');

function arrayBody(exportName) {
  const start = source.indexOf(`export const ${exportName}`);
  if (start === -1) throw new Error(`Could not read ${exportName} from connector-directory.ts.`);
  const assignment = source.indexOf('= [', start);
  const end = source.indexOf('\n];', assignment);
  if (assignment === -1 || end === -1) throw new Error(`Could not read ${exportName} from connector-directory.ts.`);
  return source.slice(assignment + 3, end);
}

function mappedEntries(exportName) {
  return [...arrayBody(exportName).matchAll(/source:\s*'([^']+)'[\s\S]*?guide:\s*'([^']+)'/g)]
    .map((match) => ({ source: match[1], guide: match[2] }));
}

function sourceEntries(exportName) {
  return [...arrayBody(exportName).matchAll(/source:\s*'([^']+)'/g)].map((match) => match[1]);
}

async function connectorPages(dir, prefix = '') {
  const entries = await readdir(dir, { withFileTypes: true });
  const pages = [];
  for (const entry of entries) {
    const relative = path.posix.join(prefix, entry.name);
    if (entry.isDirectory()) {
      pages.push(...await connectorPages(path.join(dir, entry.name), relative));
    } else if (entry.name.endsWith('.md') && entry.name !== 'README.md' && prefix) {
      pages.push(relative);
    }
  }
  return pages.sort();
}

function duplicates(values) {
  return [...new Set(values.filter((value, index) => values.indexOf(value) !== index))];
}

const upstreamPages = await connectorPages(upstreamDir);
const migrated = mappedEntries('migratedUpstreamConnectorPages');
const covered = mappedEntries('coveredUpstreamConnectorPages');
const deferred = sourceEntries('deferredUpstreamConnectorPages');
const classified = [...migrated.map((entry) => entry.source), ...covered.map((entry) => entry.source), ...deferred];
const errors = [
  ...duplicates(classified).map((page) => `upstream page classified more than once: ${page}`),
  ...upstreamPages.filter((page) => !classified.includes(page)).map((page) => `unclassified upstream page: ${page}`),
  ...classified.filter((page) => !upstreamPages.includes(page)).map((page) => `classified page absent from docs-en baseline: ${page}`),
];

for (const { source: upstreamPage, guide } of [...migrated, ...covered]) {
  try {
    await access(new URL(`${guide}.mdx`, guidesDir));
  } catch {
    errors.push(`${upstreamPage}: mapped guide does not exist: ${guide}.mdx`);
  }
}

if (errors.length > 0) {
  console.error(`Upstream connector closure failed (${errors.length} issue${errors.length === 1 ? '' : 's'}):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Upstream connector closure complete: ${upstreamPages.length} independent docs-en pages (${migrated.length} migrated, ${covered.length} covered by consolidated guides, ${deferred.length} deferred, 0 unclassified).`);
