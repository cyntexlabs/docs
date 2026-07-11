import { readdir, readFile } from 'node:fs/promises';
import { extname, join, relative } from 'node:path';

const roots = ['content', 'docs', 'public', 'scripts', 'src'];
const rootFiles = ['AGENTS.md', 'README.md', 'package.json', 'package-lock.json', 'source.config.ts'];
const textExtensions = new Set(['.css', '.js', '.json', '.md', '.mdx', '.mjs', '.svg', '.ts', '.tsx']);
const forbidden = [
  { label: 'legacy product name', pattern: /cyntex/gi },
  { label: 'legacy documentation domain', pattern: /docs\.cyntex\.io/gi },
  { label: 'legacy overview slug', pattern: /what-is-cyntex/gi },
  { label: 'legacy package name', pattern: /cyntex-docs/gi },
  { label: 'legacy resource extension', pattern: /\.cyn\.yml/gi },
  { label: 'legacy resource version', pattern: /cyntex\/v1/gi },
  { label: 'legacy workspace variable', pattern: /CYNTEX_WORKDIR/g },
];

async function collect(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (path === 'scripts/check-brand.mjs') continue;
    if (entry.isDirectory()) files.push(...(await collect(path)));
    else if (textExtensions.has(extname(entry.name))) files.push(path);
  }

  return files;
}

const files = [...rootFiles];
for (const root of roots) files.push(...(await collect(root)));

const failures = [];
for (const file of files) {
  const value = await readFile(file, 'utf8');
  const lines = value.split('\n');

  for (const { label, pattern } of forbidden) {
    for (let index = 0; index < lines.length; index += 1) {
      pattern.lastIndex = 0;
      if (pattern.test(lines[index])) failures.push(`${relative('.', file)}:${index + 1}: ${label}`);
    }
  }
}

if (failures.length > 0) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log('Brand check passed: no legacy reader-facing names, domains, slugs, or package names.');
}
