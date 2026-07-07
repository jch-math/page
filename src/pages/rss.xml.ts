import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection, getEntry } from 'astro:content';
import { entrySlug, visiblePost } from '@lib/site';

export async function GET(context: APIContext) {
  const profile = (await getEntry('profile', 'site'))?.data;
  const posts = (await getCollection('posts')).filter(visiblePost).sort((a, b) => Number(b.data.date) - Number(a.data.date));

  return rss({
    title: profile?.siteTitle ?? 'Self Page',
    description: profile?.tagline ?? 'A personal homepage and public archive.',
    site: context.site ?? 'https://example.com',
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.summary,
      link: `/posts/${entrySlug(post)}/`,
    })),
  });
}
