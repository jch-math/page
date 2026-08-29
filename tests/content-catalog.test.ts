import assert from 'node:assert/strict';
import test from 'node:test';
import { buildPublicCatalog } from '../src/lib/content-catalog.ts';

process.env.BASE_PATH = '/page';

function post(id: string, data: Record<string, unknown> = {}): any {
  return {
    id: `${id}.md`,
    collection: 'posts',
    data: {
      title: id,
      date: new Date('2026-08-20'),
      summary: `${id} 的完整摘要内容。`,
      status: 'published',
      type: 'article',
      language: 'zh',
      tags: [],
      featured: false,
      attachments: [],
      ...data,
    },
  };
}

function project(id: string, data: Record<string, unknown> = {}): any {
  return {
    id: `${id}.md`,
    collection: 'projects',
    data: {
      title: id,
      date: new Date('2026-08-20'),
      summary: `${id} 的完整摘要内容。`,
      status: 'active',
      tags: [],
      featured: false,
      links: {},
      documents: [],
      ...data,
    },
  };
}

function link(id: string, data: Record<string, unknown> = {}): any {
  return {
    id: `${id}.md`,
    collection: 'links',
    data: {
      title: id,
      date: new Date('2026-08-20'),
      summary: `${id} 的完整摘要内容。`,
      status: 'published',
      url: `https://example.com/${id}`,
      category: '参考资料',
      tags: [],
      featured: false,
      ...data,
    },
  };
}

test('目录排除草稿和归档内容，并按 updated 或 date 降序排列', () => {
  const catalog = buildPublicCatalog({
    posts: [
      post('older', { date: new Date('2026-08-20') }),
      post('updated', { date: new Date('2026-08-10'), updated: new Date('2026-08-29') }),
      post('draft', { status: 'draft', summary: '' }),
      post('archived', { status: 'archived' }),
    ],
    projects: [project('project', { date: new Date('2026-08-25') })],
    links: [link('link', { date: new Date('2026-08-24') }), link('hidden-link', { status: 'archived' })],
  });

  assert.deepEqual(catalog.items.map((item) => item.slug), ['updated', 'project', 'link', 'older']);
  assert.deepEqual(catalog.posts.map(({ item }) => item.slug), ['updated', 'older']);
  assert.equal(catalog.items.some((item) => ['draft', 'archived', 'hidden-link'].includes(item.slug)), false);
});

test('目录选择发布日期最新的精选文章，并保持最近索引包含该文章', () => {
  const catalog = buildPublicCatalog({
    posts: [
      post('featured-old', { date: new Date('2026-08-20'), featured: true }),
      post('featured-new', { date: new Date('2026-08-29'), featured: true }),
    ],
    projects: [],
    links: [],
  });

  assert.equal(catalog.featuredPost?.item.slug, 'featured-new');
  assert.equal(catalog.items[0]?.slug, 'featured-new');
});

test('目录生成稳定的基础路径、类型和去重标签', () => {
  const catalog = buildPublicCatalog({
    posts: [post('article', { tags: ['Astro', '共同标签'] })],
    projects: [project('site', { tags: ['共同标签'] })],
    links: [link('reference', { tags: ['链接'] })],
  });

  assert.deepEqual(catalog.items.map((item) => item.type), ['post', 'project', 'link']);
  assert.equal(catalog.posts[0]?.item.href, '/page/posts/article/');
  assert.equal(catalog.projects[0]?.item.href, '/page/projects/site/');
  assert.equal(catalog.links[0]?.item.href, 'https://example.com/reference');
  assert.deepEqual(catalog.tags, ['Astro', '共同标签', '链接'].sort((a, b) => a.localeCompare(b, 'zh-CN')));
});
