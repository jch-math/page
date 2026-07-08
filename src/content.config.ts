import { glob } from 'astro/loaders';
import { defineCollection, reference } from 'astro:content';
import { z } from 'astro/zod';

const localOrExternalUrl = z
  .string()
  .regex(/^(\/|https?:\/\/|mailto:)/, 'Use an absolute local path, external URL, or mailto link.');

const optionalUrl = localOrExternalUrl.optional();

const relatedSchema = z
  .object({
    posts: z.array(reference('posts')).default([]),
    events: z.array(reference('events')).default([]),
    resources: z.array(reference('resources')).default([]),
    projects: z.array(reference('projects')).default([]),
  })
  .default({
    posts: [],
    events: [],
    resources: [],
    projects: [],
  });

const attachmentSchema = z.object({
  title: z.string(),
  type: z.enum(['paper', 'pdf', 'slides', 'video', 'code', 'notes', 'dataset', 'image', 'link', 'other']),
  url: localOrExternalUrl,
  description: z.string().optional(),
});

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z
    .object({
      title: z.string(),
      slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
      date: z.coerce.date(),
      updated: z.coerce.date().optional(),
      summary: z.string().min(12),
      type: z.enum(['article', 'note', 'log', 'review', 'tutorial']).default('article'),
      status: z.enum(['draft', 'published', 'archived']).default('published'),
      language: z.enum(['zh', 'en', 'mixed']).default('zh'),
      tags: z.array(z.string()).default([]),
      series: z.string().optional(),
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
      cover: z
        .object({
          image: localOrExternalUrl,
          alt: z.string(),
        })
        .optional(),
      attachments: z.array(attachmentSchema).default([]),
      related: relatedSchema,
    })
    .refine((data) => !data.updated || data.updated >= data.date, {
      message: 'updated must not be earlier than date',
      path: ['updated'],
    }),
});

const events = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/events' }),
  schema: z
    .object({
      title: z.string(),
      slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
      date: z.coerce.date(),
      endDate: z.coerce.date().optional(),
      time: z.string().optional(),
      timezone: z.string().default('Asia/Shanghai'),
      location: z.string(),
      onlineUrl: optionalUrl,
      status: z.enum(['upcoming', 'completed', 'cancelled', 'postponed']).default('upcoming'),
      eventType: z.enum(['seminar', 'talk', 'reading-group', 'workshop', 'deadline', 'personal']),
      series: z.string().optional(),
      speakers: z
        .array(
          z.object({
            name: z.string(),
            affiliation: z.string().optional(),
            url: optionalUrl,
          }),
        )
        .default([]),
      organizers: z.array(z.string()).default([]),
      summary: z.string().min(8),
      materials: z.array(attachmentSchema).default([]),
      related: relatedSchema,
    })
    .refine((data) => !data.endDate || data.endDate >= data.date, {
      message: 'endDate must not be earlier than date',
      path: ['endDate'],
    }),
});

const resources = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/resources' }),
  schema: z
    .object({
      title: z.string(),
      slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
      date: z.coerce.date(),
      updated: z.coerce.date().optional(),
      type: z.enum(['pdf', 'video', 'code', 'dataset', 'slides', 'image', 'link', 'other']),
      status: z.enum(['published', 'archived', 'private-link']).default('published'),
      summary: z.string().min(8),
      url: localOrExternalUrl,
      sourceUrl: optionalUrl,
      size: z.string().optional(),
      format: z.string().optional(),
      tags: z.array(z.string()).default([]),
      license: z.string().optional(),
      citation: z.string().optional(),
      related: relatedSchema,
    })
    .refine((data) => !data.updated || data.updated >= data.date, {
      message: 'updated must not be earlier than date',
      path: ['updated'],
    }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z
    .object({
      title: z.string(),
      slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
      date: z.coerce.date(),
      updated: z.coerce.date().optional(),
      status: z.enum(['active', 'paused', 'completed', 'archived']).default('active'),
      summary: z.string().min(8),
      description: z.string().optional(),
      tags: z.array(z.string()).default([]),
      links: z
        .object({
          repository: optionalUrl,
          demo: optionalUrl,
          documentation: optionalUrl,
        })
        .default({}),
      featured: z.boolean().default(false),
      related: relatedSchema,
    })
    .refine((data) => !data.updated || data.updated >= data.date, {
      message: 'updated must not be earlier than date',
      path: ['updated'],
    }),
});

const profile = defineCollection({
  loader: glob({ pattern: '**/*.{yaml,yml,json}', base: './src/content/profile' }),
  schema: z.object({
    name: z.string(),
    siteTitle: z.string(),
    tagline: z.string(),
    role: z.string().optional(),
    affiliation: z.string().optional(),
    location: z.string().optional(),
    bio: z.string(),
    interests: z.array(z.string()).default([]),
    links: z
      .object({
        email: optionalUrl,
        github: optionalUrl,
        cv: optionalUrl,
        googleScholar: optionalUrl,
        orcid: optionalUrl,
      })
      .default({}),
    footer: z
      .object({
        copyrightName: z.string().optional(),
        license: z.string().optional(),
      })
      .default({}),
  }),
});

export const collections = { posts, events, resources, projects, profile };
