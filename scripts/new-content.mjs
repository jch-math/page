import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const kind = process.argv[2];
const rawTitle = process.argv.slice(3).join(' ') || defaultTitle(kind);

if (!['post', 'event', 'resource', 'project'].includes(kind)) {
  console.error('Usage: pnpm new:post "Title" | pnpm new:event "Title" | pnpm new:resource "Title" | pnpm new:project "Title"');
  process.exit(1);
}

const today = new Date().toISOString().slice(0, 10);
const slug = slugify(rawTitle);
const target = targetPath(kind, slug);

if (existsSync(target)) {
  console.error(`Refusing to overwrite existing file: ${target}`);
  process.exit(1);
}

mkdirSync(dirname(target), { recursive: true });
writeFileSync(target, template(kind, rawTitle, slug, today), 'utf8');
console.log(`Created ${target}`);

function defaultTitle(contentKind) {
  const labels = {
    post: 'Untitled Post',
    event: 'Untitled Event',
    resource: 'Untitled Resource',
    project: 'Untitled Project',
  };
  return labels[contentKind] ?? 'Untitled';
}

function slugify(value) {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
    || `entry-${Date.now()}`;
}

function targetPath(contentKind, contentSlug) {
  const folders = {
    post: 'posts',
    event: 'events',
    resource: 'resources',
    project: 'projects',
  };
  return join('src', 'content', folders[contentKind], `${contentSlug}.md`);
}

function template(contentKind, title, contentSlug, date) {
  const templates = {
    post: `---
title: "${escapeYaml(title)}"
slug: "${contentSlug}"
date: "${date}"
summary: "Replace this summary with one or two sentences."
type: "article"
status: "draft"
language: "zh"
tags: []
featured: false
attachments: []
related:
  posts: []
  events: []
  resources: []
  projects: []
---

Write the article here.
`,
    event: `---
title: "${escapeYaml(title)}"
slug: "${contentSlug}"
date: "${date}"
time: "14:00"
timezone: "Asia/Shanghai"
location: "TBD"
status: "upcoming"
eventType: "seminar"
speakers: []
organizers: []
summary: "Replace this summary with a short event description."
materials: []
related:
  posts: []
  resources: []
  projects: []
---

Write the event abstract, agenda, or notes here.
`,
    resource: `---
title: "${escapeYaml(title)}"
slug: "${contentSlug}"
date: "${date}"
type: "pdf"
status: "published"
summary: "Replace this summary with a short resource description."
url: "/files/papers/example.pdf"
tags: []
related:
  posts: []
  events: []
  projects: []
---

Describe the resource here.
`,
    project: `---
title: "${escapeYaml(title)}"
slug: "${contentSlug}"
date: "${date}"
status: "active"
summary: "Replace this summary with a short project description."
description: "Replace this description with project context."
tags: []
links: {}
featured: false
related:
  posts: []
  events: []
  resources: []
---

Write project notes here.
`,
  };

  return templates[contentKind];
}

function escapeYaml(value) {
  return value.replaceAll('"', '\\"');
}
