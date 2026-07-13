import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const catalogDir = process.env.TAPSTATE_CATALOG_DIR;

if (!catalogDir) {
  console.error('Set TAPSTATE_CATALOG_DIR to the product catalog directory before running this check.');
  process.exit(2);
}

const directoryFile = new URL('../src/lib/connector-directory.ts', import.meta.url);
const source = await readFile(directoryFile, 'utf8');

function entriesFor(exportName) {
  const start = source.indexOf(`export const ${exportName}`);
  if (start === -1) throw new Error(`Could not read ${exportName} from connector-directory.ts.`);

  const assignment = source.indexOf('= [', start);
  const arrayStart = assignment + 2;
  if (assignment === -1) throw new Error(`Could not read ${exportName} from connector-directory.ts.`);
  if (source.slice(arrayStart, arrayStart + 2) === '[]') return [];

  const end = source.indexOf('\n];', arrayStart);
  if (end === -1) throw new Error(`Could not read ${exportName} from connector-directory.ts.`);
  return [...source.slice(arrayStart, end).matchAll(/\bid:\s*'([^']+)'/g)].map((match) => match[1]);
}

function duplicateValues(values) {
  return [...new Set(values.filter((value, index) => values.indexOf(value) !== index))];
}

const catalogFiles = (await readdir(catalogDir)).filter((name) => name.endsWith('.json'));
const catalogIds = [];
for (const file of catalogFiles) {
  const parsed = JSON.parse(await readFile(path.join(catalogDir, file), 'utf8'));
  if (typeof parsed.id === 'string') catalogIds.push(parsed.id);
}

const published = entriesFor('connectorDirectory');
const deferred = entriesFor('deferredCatalogConnectors');
const covered = entriesFor('coveredCatalogConnectors');
const nonCatalog = entriesFor('nonCatalogPublishedConnectors');
const classified = [...published, ...deferred, ...covered];

const errors = [
  ...duplicateValues(catalogIds).map((id) => `duplicate catalog ID: ${id}`),
  ...duplicateValues(classified).map((id) => `connector classified more than once: ${id}`),
  ...catalogIds.filter((id) => !classified.includes(id)).map((id) => `unclassified catalog ID: ${id}`),
  ...published.filter((id) => !catalogIds.includes(id) && !nonCatalog.includes(id)).map((id) => `published ID absent from catalog and non-catalog allowlist: ${id}`),
  ...nonCatalog.filter((id) => !published.includes(id)).map((id) => `non-catalog allowlist ID is not published: ${id}`),
];

if (errors.length > 0) {
  console.error(`Connector inventory check failed (${errors.length} issue${errors.length === 1 ? '' : 's'}):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Connector inventory complete: ${catalogIds.length} catalog IDs (${published.length} published, ${covered.length} covered, ${deferred.length} deferred); ${nonCatalog.length} published server-side guides outside the catalog.`);
