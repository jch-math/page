import { glob } from 'astro/loaders';
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';

const contentSlug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional();
const localOrExternalUrl = z
  .string()
  .regex(/^(\/|https?:\/\/)/, '请使用站内绝对路径或 http(s) 链接。');

const datedContent = {
  title: z.string().min(1),
  slug: contentSlug,
  date: z.coerce.date(),
  updated: z.coerce.date().optional(),
  summary: z.string().min(8),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
};

const attachmentSchema = z.object({
  title: z.string(),
  type: z.enum(['pdf', 'slides', 'video', 'code', 'dataset', 'image', 'link', 'other']),
  url: localOrExternalUrl,
  description: z.string().optional(),
});

const coverSchema = z.object({
  image: localOrExternalUrl,
  alt: z.string().min(1),
});

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z
    .object({
      ...datedContent,
      type: z.enum(['article', 'note']).default('article'),
      status: z.enum(['draft', 'published', 'archived']).default('draft'),
      language: z.enum(['zh', 'en', 'mixed']).default('zh'),
      cover: coverSchema.optional(),
      attachments: z.array(attachmentSchema).default([]),
    })
    .refine((data) => !data.updated || data.updated >= data.date, {
      message: 'updated 不能早于 date',
      path: ['updated'],
    })
    .refine((data) => data.status === 'published' || !data.featured, {
      message: '只有已发布文章可以设为精选',
      path: ['featured'],
    }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z
    .object({
      ...datedContent,
      status: z.enum(['draft', 'active', 'paused', 'completed', 'archived']).default('draft'),
      description: z.string().optional(),
      cover: coverSchema.optional(),
      links: z
        .object({
          repository: localOrExternalUrl.optional(),
          demo: localOrExternalUrl.optional(),
          documentation: localOrExternalUrl.optional(),
        })
        .default({}),
      documents: z.array(attachmentSchema).default([]),
    })
    .refine((data) => !data.updated || data.updated >= data.date, {
      message: 'updated 不能早于 date',
      path: ['updated'],
    }),
});

const links = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/links' }),
  schema: z.object({
    ...datedContent,
    status: z.enum(['draft', 'published', 'archived']).default('draft'),
    url: z.url(),
    category: z.string().min(1),
  }),
});

const profile = defineCollection({
  loader: glob({ pattern: '**/*.{yaml,yml,json}', base: './src/content/profile' }),
  schema: z.object({
    name: z.string(),
    siteTitle: z.string(),
    tagline: z.string(),
    role: z.string().optional(),
    bio: z.string(),
    currentFocus: z.string().optional(),
    currentFocusUpdated: z.string().optional(),
    interests: z.array(z.string()).default([]),
    avatar: coverSchema.optional(),
    links: z.object({ github: z.url().optional() }).default({}),
    footer: z
      .object({
        copyrightName: z.string().optional(),
        license: z.string().optional(),
      })
      .default({}),
  }),
});

export const collections = { posts, projects, links, profile };
