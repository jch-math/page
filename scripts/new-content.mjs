import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const kinds = ['post', 'project', 'link'];
const kind = process.argv[2];
const args = process.argv.slice(3);

if (!kinds.includes(kind)) {
  console.error('用法: pnpm new:post "标题" [--slug english-slug] | pnpm new:project ... | pnpm new:link ...');
  process.exit(1);
}

const slugFlag = args.indexOf('--slug');
const explicitSlug = slugFlag >= 0 ? args[slugFlag + 1] : undefined;
const titleParts = slugFlag >= 0 ? args.slice(0, slugFlag) : args;
const title = titleParts.join(' ').trim() || defaultTitle(kind);
const now = new Date();
const date = now.toISOString().slice(0, 10);
const slug = explicitSlug ?? slugify(title, now);

if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  console.error('slug 只能包含小写英文字母、数字和连字符。');
  process.exit(1);
}

const target = join('src', 'content', `${kind}s`, `${slug}.md`);
if (existsSync(target)) {
  console.error(`文件已存在，未覆盖: ${target}`);
  process.exit(1);
}

mkdirSync(dirname(target), { recursive: true });
writeFileSync(target, template(kind, title, slug, date), 'utf8');
console.log(`已创建 ${target}`);

function defaultTitle(contentKind) {
  return { post: '未命名文章', project: '未命名项目', link: '未命名链接' }[contentKind];
}

function slugify(value, valueDate) {
  const candidate = value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
  return candidate || `entry-${valueDate.toISOString().replace(/\D/g, '').slice(0, 14)}`;
}

function template(contentKind, contentTitle, contentSlug, contentDate) {
  const common = `title: "${escapeYaml(contentTitle)}"\nslug: "${contentSlug}"\ndate: "${contentDate}"\nsummary: "请用一两句话概括内容。"`;
  return {
    post: `---\n${common}\ntype: "article"\nstatus: "draft"\nlanguage: "zh"\ntags: []\nfeatured: false\nattachments: []\n---\n\n从这里开始写作。\n`,
    project: `---\n${common}\nstatus: "draft"\ntags: []\nfeatured: false\nlinks: {}\ndocuments: []\n---\n\n记录项目的背景、过程和结果。\n`,
    link: `---\n${common}\nstatus: "draft"\nurl: "https://example.com"\ncategory: "未分类"\ntags: []\nfeatured: false\n---\n\n写下收藏这条链接的原因。\n`,
  }[contentKind];
}

function escapeYaml(value) {
  return value.replaceAll('"', '\\"');
}
