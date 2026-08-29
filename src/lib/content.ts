import { getCollection, getEntry } from 'astro:content';
import { buildPublicCatalog, type PublicCatalog } from './content-catalog';

export type {
  ContentIndexItem,
  ContentRecord,
  ContentType,
  PublishedLinkEntry,
  PublishedPostEntry,
  PublicProjectEntry,
} from './content-catalog';

export async function loadPublicCatalog(): Promise<PublicCatalog> {
  const [posts, projects, links] = await Promise.all([
    getCollection('posts'),
    getCollection('projects'),
    getCollection('links'),
  ]);

  return buildPublicCatalog({ posts, projects, links });
}

export async function loadSiteProfile() {
  const profile = await getEntry('profile', 'site');

  if (!profile) {
    throw new Error('缺少站点资料：请创建 src/content/profile/site.yaml。');
  }

  return profile.data;
}
