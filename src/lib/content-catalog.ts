import type { CollectionEntry } from 'astro:content';
import { withBase } from './site.ts';

export type ContentType = 'post' | 'project' | 'link';

export interface ContentIndexItem {
  type: ContentType;
  slug: string;
  title: string;
  summary: string;
  date: string;
  tags: string[];
  href: string;
  featured: boolean;
}

export type PublishedPostEntry = CollectionEntry<'posts'> & {
  data: CollectionEntry<'posts'>['data'] & { status: 'published'; date: Date; summary: string };
};

export type PublicProjectEntry = CollectionEntry<'projects'> & {
  data: CollectionEntry<'projects'>['data'] & {
    status: 'active' | 'paused' | 'completed';
    date: Date;
    summary: string;
  };
};

export type PublishedLinkEntry = CollectionEntry<'links'> & {
  data: CollectionEntry<'links'>['data'] & {
    status: 'published';
    date: Date;
    summary: string;
    url: string;
    category: string;
  };
};

export interface ContentRecord<Entry> {
  readonly entry: Entry;
  readonly item: ContentIndexItem;
}

export interface PublicCatalog {
  readonly items: readonly ContentIndexItem[];
  readonly posts: readonly ContentRecord<PublishedPostEntry>[];
  readonly projects: readonly ContentRecord<PublicProjectEntry>[];
  readonly links: readonly ContentRecord<PublishedLinkEntry>[];
  readonly featuredPost: ContentRecord<PublishedPostEntry> | undefined;
  readonly tags: readonly string[];
}

export interface ContentSources {
  readonly posts: readonly CollectionEntry<'posts'>[];
  readonly projects: readonly CollectionEntry<'projects'>[];
  readonly links: readonly CollectionEntry<'links'>[];
}

type PublicEntry = PublishedPostEntry | PublicProjectEntry | PublishedLinkEntry;

export function buildPublicCatalog(sources: ContentSources): PublicCatalog {
  const posts = sources.posts.filter(isPublishedPost).map(toRecord).sort(byRecordDateDesc);
  const projects = sources.projects.filter(isPublicProject).map(toRecord).sort(byRecordDateDesc);
  const links = sources.links.filter(isPublishedLink).map(toRecord).sort(byRecordDateDesc);
  const items = [...posts, ...projects, ...links].sort(byRecordDateDesc).map(({ item }) => item);
  const featuredPost = [...posts]
    .filter(({ item }) => item.featured)
    .sort((a, b) => Number(b.entry.data.date) - Number(a.entry.data.date))[0];
  const tags = Array.from(new Set(items.flatMap((item) => item.tags))).sort((a, b) =>
    a.localeCompare(b, 'zh-CN'),
  );

  return { items, posts, projects, links, featuredPost, tags };
}

function isPublishedPost(entry: CollectionEntry<'posts'>): entry is PublishedPostEntry {
  return entry.data.status === 'published';
}

function isPublicProject(entry: CollectionEntry<'projects'>): entry is PublicProjectEntry {
  return ['active', 'paused', 'completed'].includes(entry.data.status);
}

function isPublishedLink(entry: CollectionEntry<'links'>): entry is PublishedLinkEntry {
  return entry.data.status === 'published';
}

function toRecord<Entry extends PublicEntry>(entry: Entry): ContentRecord<Entry> {
  return { entry, item: normalizeContent(entry) };
}

function normalizeContent(entry: PublicEntry): ContentIndexItem {
  const date = entry.data.updated ?? entry.data.date;
  const slug = entry.data.slug ?? entry.id.replace(/\.(md|mdx)$/i, '');
  const common = {
    slug,
    title: entry.data.title,
    summary: entry.data.summary,
    date: date.toISOString(),
    tags: entry.data.tags,
    featured: entry.data.featured,
  };

  if (entry.collection === 'posts') {
    return { ...common, type: 'post', href: withBase(`/posts/${slug}/`) };
  }
  if (entry.collection === 'projects') {
    return { ...common, type: 'project', href: withBase(`/projects/${slug}/`) };
  }
  return { ...common, type: 'link', href: entry.data.url };
}

function byRecordDateDesc(a: ContentRecord<PublicEntry>, b: ContentRecord<PublicEntry>) {
  return Number(new Date(b.item.date)) - Number(new Date(a.item.date));
}
