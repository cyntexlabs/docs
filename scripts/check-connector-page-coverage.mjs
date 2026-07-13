import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const catalogDir = process.env.TAPSTATE_CATALOG_DIR;

if (!catalogDir) {
  console.error('Set TAPSTATE_CATALOG_DIR to the product catalog directory before running this check.');
  process.exit(2);
}

const docsDir = new URL('../content/docs/connectors/', import.meta.url);
const pageNames = (await readdir(docsDir)).filter((name) => name.endsWith('.mdx') && name !== 'index.mdx');
const coreSections = {
  profile: /<ConnectorProfile\b/,
  capabilities: /<ConnectorCapabilities\b/,
  beforeYouBegin: /^## Before you begin/m,
  createConnection: /^## Create a connection/m,
  validateConfiguration: /^## Validate the configuration/m,
  limitations: /^## Limitations/m,
  reference: /^## Reference/m,
  validationBoundary: /(?:Local validation boundary|validation checks|Local validation|does not (?:test|connect|prove))/i,
};

function frontmatterValue(page, key) {
  return page.match(new RegExp(`^\\s*${key}:\\s*([^\\s]+)\\s*$`, 'm'))?.[1];
}

function frontmatterList(page, key) {
  return (page.match(new RegExp(`^\\s*${key}:\\s*\\[([^\\]]*)\\]`, 'm'))?.[1] ?? '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
}

const failures = [];
let catalogBacked = 0;
let serverContract = 0;

for (const name of pageNames) {
  const page = await readFile(new URL(name, docsDir), 'utf8');
  const id = frontmatterValue(page, 'id');
  if (!id) {
    failures.push(`${name}: missing ai.id`);
    continue;
  }

  let catalog;
  try {
    catalog = JSON.parse(await readFile(path.join(catalogDir, `${id}.json`), 'utf8'));
  } catch {
    serverContract += 1;
    continue;
  }

  catalogBacked += 1;
  const missing = Object.entries(coreSections)
    .filter(([, pattern]) => !pattern.test(page))
    .map(([name]) => name);
  const roles = frontmatterList(page, 'useAs');

  if (roles.includes('source') && !/^### Source\b/m.test(page)) missing.push('source section');
  if (roles.includes('target') && !/^### Target\b/m.test(page)) missing.push('target section');
  if ((catalog.modes ?? []).includes('cdc') && (!/<SourceModeTabs\b/.test(page) || !/value="snapshot-cdc"/.test(page))) {
    missing.push('snapshot + CDC mode path');
  }

  if (missing.length > 0) failures.push(`${name}: ${missing.join(', ')}`);
}

if (failures.length > 0) {
  console.error(`Connector page coverage check failed (${failures.length} page${failures.length === 1 ? '' : 's'}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Connector page coverage passed: ${catalogBacked} catalog-backed guides and ${serverContract} server-contract guides use the canonical structure.`);
