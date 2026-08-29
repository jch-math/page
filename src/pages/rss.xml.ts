import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { entrySlug, visiblePost, withBase } from '@lib/site';

export async function GET(context: { site?: URL }) {
  const posts = (await getCollection('posts', visiblePost)).sort((a, b) => Number(b.data.date) - Number(a.data.date));
  const site = new URL(withBase('/'), context.site ?? 'https://jch-math.github.io');
  return rss({
    title: 'Neko 的文章',
    description: '关于人工智能、微分几何与日常思考的文章和短笔记。',
    site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.summary,
      pubDate: post.data.date,
      link: withBase(`/posts/${entrySlug(post)}/`),
    })),
  });
}
