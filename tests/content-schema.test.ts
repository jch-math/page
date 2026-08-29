import assert from 'node:assert/strict';
import test from 'node:test';
import { linkSchema, postSchema, projectSchema } from '../src/lib/content-schema.ts';

const validPost = {
  title: '一篇完整文章',
  date: '2026-08-29',
  summary: '这是一段满足发布要求的文章摘要。',
  status: 'published',
};

test('不完整文章草稿不会阻断内容同步', () => {
  const result = postSchema.safeParse({
    title: '尚未完成的文章',
    status: 'draft',
    summary: '',
  });

  assert.equal(result.success, true);
});

test('公开文章必须具有完整摘要和日期', () => {
  const result = postSchema.safeParse({
    title: '尚未完成的文章',
    status: 'published',
    summary: '',
  });

  assert.equal(result.success, false);
  if (!result.success) {
    assert.ok(result.error.issues.some((issue) => issue.path.join('.') === 'summary'));
    assert.ok(result.error.issues.some((issue) => issue.path.join('.') === 'date'));
  }
});

test('只有已发布文章可以设为精选', () => {
  assert.equal(postSchema.safeParse({ title: '草稿', status: 'draft', featured: true }).success, false);
  assert.equal(postSchema.safeParse({ ...validPost, status: 'archived', featured: true }).success, false);
  assert.equal(postSchema.safeParse({ ...validPost, featured: true }).success, true);
});

test('更新时间不能早于发布日期', () => {
  const result = postSchema.safeParse({
    ...validPost,
    updated: '2026-08-28',
  });

  assert.equal(result.success, false);
  if (!result.success) {
    assert.ok(result.error.issues.some((issue) => issue.path.join('.') === 'updated'));
  }
});

test('项目草稿可以不完整，公开和归档项目必须完整', () => {
  assert.equal(projectSchema.safeParse({ title: '项目草稿', status: 'draft', summary: '' }).success, true);

  for (const status of ['active', 'paused', 'completed', 'archived']) {
    assert.equal(projectSchema.safeParse({ title: '项目', status }).success, false);
    assert.equal(
      projectSchema.safeParse({
        title: '项目',
        status,
        date: '2026-08-29',
        summary: '这是一段满足公开要求的项目摘要。',
      }).success,
      true,
    );
  }
});

test('链接草稿可以省略 URL，公开和归档链接必须使用有效 URL', () => {
  assert.equal(linkSchema.safeParse({ title: '链接草稿', status: 'draft', summary: '' }).success, true);

  for (const status of ['published', 'archived']) {
    assert.equal(
      linkSchema.safeParse({
        title: '链接',
        status,
        date: '2026-08-29',
        summary: '这是一段满足公开要求的链接摘要。',
        category: '参考资料',
        url: 'not-a-url',
      }).success,
      false,
    );
  }
});
