import rss from '@astrojs/rss';
import { loadPublicCatalog } from '@lib/content';
import { withBase } from '@lib/site';

export async function GET(context: { site?: URL }) {
  const { posts } = await loadPublicCatalog();
  const site = new URL(withBase('/'), context.site ?? 'https://jch-math.github.io');
  return rss({
    title: 'Neko 的文章',
    description: '关于人工智能、微分几何与日常思考的文章和短笔记。',
    site,
    items: posts.map(({ entry, item }) => ({
      title: entry.data.title,
      description: entry.data.summary,
      pubDate: entry.data.date,
      link: item.href,
    })),
  });
}
