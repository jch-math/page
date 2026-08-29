import { getCollection, type CollectionEntry } from 'astro:content';

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

export type PublicEntry =
  | CollectionEntry<'posts'>
  | CollectionEntry<'projects'>
  | CollectionEntry<'links'>;

export function withBase(path: string) {
  if (/^https?:\/\//.test(path)) return path;
  const base = import.meta.env.BASE_URL ?? '/';
  const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}` || '/';
}

export function entrySlug(entry: { id: string; data: { slug?: string } }) {
  return entry.data.slug ?? entry.id.replace(/\.(md|mdx)$/i, '');
}

export function formatDate(value: Date | string) {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(value));
}

export function visiblePost(entry: CollectionEntry<'posts'>) {
  return entry.data.status === 'published';
}

export function visibleProject(entry: CollectionEntry<'projects'>) {
  return !['draft', 'archived'].includes(entry.data.status);
}

export function visibleLink(entry: CollectionEntry<'links'>) {
  return entry.data.status === 'published';
}

export function byEntryDateDesc(a: PublicEntry, b: PublicEntry) {
  const aDate = 'updated' in a.data && a.data.updated ? a.data.updated : a.data.date;
  const bDate = 'updated' in b.data && b.data.updated ? b.data.updated : b.data.date;
  return Number(bDate) - Number(aDate);
}

export function normalizeContent(entry: PublicEntry): ContentIndexItem {
  const date = 'updated' in entry.data && entry.data.updated ? entry.data.updated : entry.data.date;
  const common = {
    slug: entrySlug(entry),
    title: entry.data.title,
    summary: entry.data.summary,
    date: date.toISOString(),
    tags: entry.data.tags,
    featured: entry.data.featured,
  };

  if (entry.collection === 'posts') {
    return { ...common, type: 'post', href: withBase(`/posts/${common.slug}/`) };
  }
  if (entry.collection === 'projects') {
    return { ...common, type: 'project', href: withBase(`/projects/${common.slug}/`) };
  }
  return { ...common, type: 'link', href: entry.data.url };
}

export async function getPublicContent(): Promise<ContentIndexItem[]> {
  const [posts, projects, links] = await Promise.all([
    getCollection('posts', visiblePost),
    getCollection('projects', visibleProject),
    getCollection('links', visibleLink),
  ]);

  return [...posts, ...projects, ...links]
    .sort(byEntryDateDesc)
    .map((entry) => normalizeContent(entry));
}

export function typeLabel(type: ContentType) {
  return { post: '文章', project: '项目', link: '链接' }[type];
}

export function tagHref(tag: string) {
  return withBase(`/tags/${encodeURIComponent(tag)}/`);
}

export function uniqueTags(items: ContentIndexItem[]) {
  return Array.from(new Set(items.flatMap((item) => item.tags))).sort((a, b) => a.localeCompare(b, 'zh-CN'));
}

export function projectStatusLabel(status: CollectionEntry<'projects'>['data']['status']) {
  return {
    draft: '草稿',
    active: '进行中',
    paused: '已暂停',
    completed: '已完成',
    archived: '已归档',
  }[status];
}
