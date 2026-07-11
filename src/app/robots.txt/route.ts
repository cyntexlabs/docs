import { docsBaseUrl } from '@/lib/shared';

export const revalidate = false;

export function GET() {
  return new Response(
    ['User-agent: *', 'Allow: /', '', `Sitemap: ${new URL('/sitemap.xml', docsBaseUrl)}`, ''].join('\n'),
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
}
