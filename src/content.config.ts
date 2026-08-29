import { glob } from 'astro/loaders';
import { defineCollection } from 'astro:content';
import { linkSchema, postSchema, profileSchema, projectSchema } from './lib/content-schema';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: postSchema,
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: projectSchema,
});

const links = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/links' }),
  schema: linkSchema,
});

const profile = defineCollection({
  loader: glob({ pattern: '**/*.{yaml,yml,json}', base: './src/content/profile' }),
  schema: profileSchema,
});

export const collections = { posts, projects, links, profile };
