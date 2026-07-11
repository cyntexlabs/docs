import { defineConfig, defineDocs } from 'fumadocs-mdx/config';
import { metaSchema, pageSchema } from 'fumadocs-core/source/schema';
import { z } from 'zod';

/** Small, discovery-oriented metadata for agents and documentation tooling. */
const aiSchema = z.object({
  kind: z.enum(['connector', 'concept', 'reference', 'guide']),
  id: z.string().regex(/^[a-z0-9][a-z0-9_-]*$/),
  maturity: z.enum(['experimental', 'preview', 'ga', 'deprecated']),
  availability: z.enum(['available', 'catalog-pending']).optional(),
  useAs: z.array(z.enum(['source', 'target'])).min(1).optional(),
  modes: z.array(z.string().min(1)).optional(),
  aliases: z.array(z.string().min(1)).optional(),
});

const docsPageSchema = pageSchema.extend({
  ai: aiSchema.optional(),
});

export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: docsPageSchema,
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
});

export default defineConfig({
  mdxOptions: {
    // MDX options
  },
});
