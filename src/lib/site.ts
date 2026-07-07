import type { CollectionEntry } from 'astro:content';

type DatedEntry =
  | CollectionEntry<'posts'>
  | CollectionEntry<'events'>
  | CollectionEntry<'resources'>
  | CollectionEntry<'projects'>;

export function withBase(path: string) {
  if (/^(https?:\/\/|mailto:)/.test(path)) {
    return path;
  }

  const base = import.meta.env.BASE_URL ?? '/';
  const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  return `${normalizedBase}${normalizedPath}` || '/';
}

export function entrySlug(entry: { id: string; data: { slug?: string } }) {
  return entry.data.slug ?? entry.id;
}

export function formatDate(value: Date | string) {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(value));
}

export function formatDateTime(value: Date | string, time?: string) {
  return time ? `${formatDate(value)} ${time}` : formatDate(value);
}

export function byDateDesc(a: DatedEntry, b: DatedEntry) {
  return Number(b.data.date) - Number(a.data.date);
}

export function byDateAsc(a: DatedEntry, b: DatedEntry) {
  return Number(a.data.date) - Number(b.data.date);
}

export function visiblePost(entry: CollectionEntry<'posts'>) {
  return entry.data.status === 'published' && !entry.data.draft;
}

export function visibleResource(entry: CollectionEntry<'resources'>) {
  return entry.data.status === 'published';
}

export function publicProject(entry: CollectionEntry<'projects'>) {
  return entry.data.status !== 'archived';
}

export function isUpcomingEvent(entry: CollectionEntry<'events'>) {
  return entry.data.status === 'upcoming' && entry.data.date >= startOfToday();
}

export function isPastEvent(entry: CollectionEntry<'events'>) {
  return entry.data.status !== 'upcoming' || entry.data.date < startOfToday();
}

export function uniqueTags(entries: Array<{ data: { tags?: string[] } }>) {
  return Array.from(new Set(entries.flatMap((entry) => entry.data.tags ?? []))).sort((a, b) =>
    a.localeCompare(b),
  );
}

function startOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}
