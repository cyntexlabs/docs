import { access, readFile } from 'node:fs/promises';
import path from 'node:path';

const repositoryRoot = path.resolve(import.meta.dirname, '..');
const docsEnRoot = process.env.TAPSTATE_DOCS_EN_DIR
  ? path.resolve(process.env.TAPSTATE_DOCS_EN_DIR)
  : path.resolve(repositoryRoot, '../docs-en/docs/connectors');

try {
  await access(docsEnRoot);
} catch {
  console.error(`docs-en connector directory not found: ${docsEnRoot}`);
  console.error('Set TAPSTATE_DOCS_EN_DIR to the docs-en docs/connectors directory.');
  process.exit(2);
}

const directorySource = await readFile(path.join(repositoryRoot, 'src/lib/connector-directory.ts'), 'utf8');
const mappingBlock = directorySource.match(
  /export const migratedUpstreamConnectorPages[\s\S]*?= \[([\s\S]*?)\n\];/,
)?.[1];

if (!mappingBlock) {
  console.error('Unable to read migratedUpstreamConnectorPages.');
  process.exit(1);
}

const mappings = [...mappingBlock.matchAll(/source: '([^']+)', guide: '([^']+)'/g)].map((match) => ({
  source: match[1],
  guide: match[2],
}));

const retainedImages = new Map([
  ['azure_cosmosdb_keys.png', 'azure-cosmosdb-keys.png'],
  ['create_server_account_en.png', 'bigquery-service-account.png'],
  ['create_account_key_en.png', 'bigquery-service-account-key.png'],
  ['grant_bigquery_role_en.png', 'bigquery-service-account-role.png'],
  ['zoho_desk_org_id.png', 'zoho-desk-organization-id.png'],
  ['obtain_zoho_secret.png', 'zoho-self-client-credentials.png'],
  ['obtain_zoho_code.png', 'zoho-authorization-code.png'],
]);

function upstreamImages(markdown) {
  return [...markdown.matchAll(/!\[[^\]]*\]\(([^)]+)\)|<img[\s\S]*?src=["']([^"']+)["'][^>]*>/g)]
    .map((match) => match[1] ?? match[2])
    .filter(Boolean);
}

function isReviewedOmission(source) {
  const basename = path.basename(source.split('?')[0]);
  return (
    /(?:connection|connect_|_setting|_settings|advanced|setting_icon|demo)/i.test(basename)
    || /^atlas_(?:add_ip_address|create_user|obtain_connection)\.png$/i.test(basename)
    || /^TAP_(?:TABLE|LOGIN)/i.test(basename)
    || basename === 'create_zoho_desk_webhook.png'
  );
}

const checks = [
  {
    label: 'versions',
    upstream: /^##\s+Supported Versions?/im,
    local: /compatibility="[^"]*(?:\d|all (?:documented|[^"\n]*(?:versions?|releases?|JDBC)))/i,
  },
  {
    label: 'architecture',
    upstream: /^##\s+Supported Versions?[^\n]*Architectures?/im,
    local: /(architecture|single node|standalone|stand-alone|cluster|all deployment)/i,
  },
  {
    label: 'data types',
    upstream: /^##\s+Supported Data Types?/im,
    local: /(?:^###\s+(?:Message )?Data compatibility|^###\s+Data types|input supports)/im,
  },
  {
    label: 'DML and DDL operations',
    upstream: /^##\s+(?:SQL Operations for Sync|Supported (?:Sync )?Operations)/im,
    local: /(DML|DDL|Supported operations)/i,
  },
  {
    label: 'preparation',
    upstream: /^##\s+(?:Prerequisites?|Preparations?|Preparation|Before you begin)/im,
    local: /^##\s+Before you begin/im,
  },
  {
    label: 'limitations and considerations',
    upstream: /^##\s+(?:Limitations?|Considerations?|Precautions|Notes|FAQs?)/im,
    local: /^##\s+Limitations/im,
  },
];

const failures = [];
let upstreamImageCount = 0;
let retainedImageCount = 0;
let omittedImageCount = 0;

for (const mapping of mappings) {
  const upstreamPath = path.join(docsEnRoot, mapping.source);
  const localPath = path.join(repositoryRoot, 'content/docs/connectors', `${mapping.guide}.mdx`);
  const [upstream, local] = await Promise.all([
    readFile(upstreamPath, 'utf8'),
    readFile(localPath, 'utf8'),
  ]);

  for (const check of checks) {
    if (check.upstream.test(upstream) && !check.local.test(local)) {
      failures.push(`${mapping.guide}: upstream ${check.label} has no reader-facing counterpart`);
    }
  }

  for (const imageSource of upstreamImages(upstream)) {
    upstreamImageCount += 1;
    const basename = path.basename(imageSource.split('?')[0]);
    const retained = retainedImages.get(basename);

    if (retained) {
      retainedImageCount += 1;
      if (!local.includes(`/images/connectors/${retained}`)) {
        failures.push(`${mapping.guide}: required provider screenshot ${basename} is not referenced`);
      }
      continue;
    }

    if (isReviewedOmission(imageSource)) {
      omittedImageCount += 1;
      continue;
    }

    failures.push(`${mapping.guide}: upstream screenshot ${imageSource} has no migration disposition`);
  }
}

if (failures.length > 0) {
  console.error(`Upstream technical coverage failed (${failures.length} issue${failures.length === 1 ? '' : 's'}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  `Upstream technical coverage passed for ${mappings.length} migrated pages. `
    + `${upstreamImageCount} screenshots reviewed: ${retainedImageCount} retained provider steps, `
    + `${omittedImageCount} product-UI, advanced-setting, stale-provider, or unsupported-flow screenshots omitted.`,
);
