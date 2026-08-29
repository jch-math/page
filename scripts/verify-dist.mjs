import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import process from 'node:process';

const outputDirectory = join(process.cwd(), 'dist');
const repository = process.env.GITHUB_REPOSITORY ?? 'jch-math/page';
const [owner, repositoryName] = repository.split('/');
const configuredBase = process.env.BASE_PATH;
const base = normalizeBase(configuredBase ?? (repositoryName?.endsWith('.github.io') ? '/' : `/${repositoryName}`));
const siteOrigin = process.env.SITE_URL ?? `https://${owner}.github.io`;
const siteRoot = `${siteOrigin}${base === '/' ? '' : base}/`;

const requiredFiles = [
  'index.html',
  'posts/index.html',
  'projects/index.html',
  'links/index.html',
  '404.html',
  'api/content.json',
  'rss.xml',
  'sitemap-index.xml',
  'sitemap-0.xml',
];

for (const file of requiredFiles) assertFile(file);

const contentPayload = JSON.parse(read('api/content.json'));
assert(contentPayload.version === 1, '/api/content.json 的 version 必须保持为 1。');
assert(Array.isArray(contentPayload.items), '/api/content.json 的 items 必须是数组。');
assert(
  Object.keys(contentPayload).sort().join(',') === 'items,version',
  '/api/content.json 的顶层结构发生了不兼容变化。',
);

let previousDate = Number.POSITIVE_INFINITY;
const tags = new Set();
for (const item of contentPayload.items) {
  const expectedKeys = ['date', 'featured', 'href', 'slug', 'summary', 'tags', 'title', 'type'];
  assert(Object.keys(item).sort().join(',') === expectedKeys.join(','), `内容 ${item.slug} 的 JSON 字段发生了变化。`);
  assert(['post', 'project', 'link'].includes(item.type), `内容 ${item.slug} 具有未知类型。`);
  assert(typeof item.summary === 'string' && item.summary.length >= 8, `内容 ${item.slug} 缺少有效摘要。`);
  assert(Array.isArray(item.tags), `内容 ${item.slug} 的 tags 必须是数组。`);

  const timestamp = Number(new Date(item.date));
  assert(Number.isFinite(timestamp), `内容 ${item.slug} 的日期无效。`);
  assert(timestamp <= previousDate, '公开内容索引没有按日期降序排列。');
  previousDate = timestamp;

  for (const tag of item.tags) tags.add(tag);
  if (/^https?:\/\//.test(item.href)) continue;

  assert(hasBase(item.href), `内部链接缺少基础路径 ${base}: ${item.href}`);
  const pagePath = stripBase(item.href);
  assertFile(join(pagePath, 'index.html'));
}

for (const tag of tags) assertFile(join('tags', String(tag), 'index.html'));

for (const file of walk(outputDirectory).filter((path) => path.endsWith('.html'))) {
  const html = readFileSync(file, 'utf8');
  for (const match of html.matchAll(/\b(?:href|src)="(\/[^"#?]*)/g)) {
    assert(hasBase(match[1]), `${relative(outputDirectory, file)} 含有未加基础路径的资源: ${match[1]}`);
  }
}

const textualOutput = walk(outputDirectory)
  .filter((path) => /\.(?:html|json|xml)$/.test(path))
  .map((path) => readFileSync(path, 'utf8'))
  .join('\n');
assert(!textualOutput.includes('article-slug'), '未完成草稿 article-slug 出现在构建产物中。');
assert(read('index.html').includes(`<link rel="canonical" href="${siteRoot}"`), '首页 canonical 地址不正确。');
assert(read('rss.xml').includes(`${siteRoot}posts/`), 'RSS 没有使用 GitHub Pages 基础路径。');
assert(read('sitemap-0.xml').includes(siteRoot), 'Sitemap 没有使用 GitHub Pages 站点地址。');

console.log(`构建产物检查通过：${contentPayload.items.length} 条公开内容，基础路径 ${base}`);

function normalizeBase(value) {
  if (!value || value === '/') return '/';
  return `/${value.replace(/^\/+|\/+$/g, '')}`;
}

function hasBase(path) {
  return base === '/' ? path.startsWith('/') : path === base || path.startsWith(`${base}/`);
}

function stripBase(path) {
  const withoutBase = base === '/' ? path : path.slice(base.length);
  return withoutBase.replace(/^\/+|\/+$/g, '');
}

function assertFile(path) {
  assert(existsSync(join(outputDirectory, path)), `缺少构建产物: dist/${path}`);
}

function read(path) {
  return readFileSync(join(outputDirectory, path), 'utf8');
}

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
