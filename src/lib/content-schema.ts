import { z } from 'astro/zod';

const contentSlug = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug 只能包含小写英文字母、数字和连字符。')
  .optional();

const localOrExternalUrl = z
  .string()
  .regex(/^(\/|https?:\/\/)/, '请使用站内绝对路径或 http(s) 链接。');

const title = z.string().min(1, '标题不能为空。');
const summary = z.string().min(8, '公开内容必须填写至少 8 个字符的摘要。');
const tags = z.array(z.string().min(1, '标签不能为空。')).default([]);

const draftDatedFields = {
  title,
  slug: contentSlug,
  date: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),
  summary: z.string().optional(),
  tags,
  featured: z.literal(false, { error: '草稿不能设为精选。' }).default(false),
};

const completeDatedFields = {
  title,
  slug: contentSlug,
  date: z.coerce.date(),
  updated: z.coerce.date().optional(),
  summary,
  tags,
  featured: z.boolean().default(false),
};

export const attachmentSchema = z.object({
  title: z.string().min(1, '附件标题不能为空。'),
  type: z.enum(['pdf', 'slides', 'video', 'code', 'dataset', 'image', 'link', 'other']),
  url: localOrExternalUrl,
  description: z.string().optional(),
});

export const coverSchema = z.object({
  image: localOrExternalUrl,
  alt: z.string().min(1, '封面图片必须填写替代文本。'),
});

const draftPostSchema = z.object({
  ...draftDatedFields,
  type: z.enum(['article', 'note']).default('article'),
  status: z.literal('draft'),
  language: z.enum(['zh', 'en', 'mixed']).default('zh'),
  cover: coverSchema.optional(),
  attachments: z.array(attachmentSchema).default([]),
});

const publishedPostSchema = z.object({
  ...completeDatedFields,
  type: z.enum(['article', 'note']).default('article'),
  status: z.literal('published'),
  language: z.enum(['zh', 'en', 'mixed']).default('zh'),
  cover: coverSchema.optional(),
  attachments: z.array(attachmentSchema).default([]),
});

const archivedPostSchema = publishedPostSchema.extend({
  status: z.literal('archived'),
  featured: z.literal(false, { error: '归档文章不能设为精选。' }).default(false),
});

export const postSchema = z
  .discriminatedUnion('status', [draftPostSchema, publishedPostSchema, archivedPostSchema])
  .superRefine(validateDateOrder);

const projectFields = {
  description: z.string().optional(),
  cover: coverSchema.optional(),
  links: z
    .object({
      repository: localOrExternalUrl.optional(),
      demo: localOrExternalUrl.optional(),
      documentation: localOrExternalUrl.optional(),
    })
    .default({}),
  documents: z.array(attachmentSchema).default([]),
};

const draftProjectSchema = z.object({
  ...draftDatedFields,
  ...projectFields,
  status: z.literal('draft'),
});

const completeProjectSchema = z.object({
  ...completeDatedFields,
  ...projectFields,
  status: z.enum(['active', 'paused', 'completed', 'archived']),
});

export const projectSchema = z
  .discriminatedUnion('status', [draftProjectSchema, completeProjectSchema])
  .superRefine(validateDateOrder);

const draftLinkSchema = z.object({
  ...draftDatedFields,
  status: z.literal('draft'),
  url: z.url('链接草稿中的 URL 必须是有效的绝对地址。').optional(),
  category: z.string().min(1, '分类不能为空。').optional(),
});

const completeLinkSchema = z.object({
  ...completeDatedFields,
  status: z.enum(['published', 'archived']),
  url: z.url('公开链接必须使用有效的绝对地址。'),
  category: z.string().min(1, '公开链接必须填写分类。'),
});

export const linkSchema = z
  .discriminatedUnion('status', [draftLinkSchema, completeLinkSchema])
  .superRefine(validateDateOrder);

export const profileSchema = z.object({
  name: z.string().min(1, '个人名称不能为空。'),
  siteTitle: z.string().min(1, '站点标题不能为空。'),
  tagline: z.string().min(1, '站点说明不能为空。'),
  role: z.string().optional(),
  bio: z.string().min(1, '个人简介不能为空。'),
  currentFocus: z.string().optional(),
  currentFocusUpdated: z.string().optional(),
  interests: z.array(z.string()).default([]),
  avatar: coverSchema.optional(),
  links: z.object({ github: z.url().optional() }).default({}),
  footer: z
    .object({
      copyrightName: z.string().optional(),
      license: z.string().optional(),
    })
    .default({}),
});

function validateDateOrder(
  data: { date?: Date; updated?: Date },
  context: z.RefinementCtx,
) {
  if (data.date && data.updated && data.updated < data.date) {
    context.addIssue({
      code: 'custom',
      message: '更新时间不能早于发布日期。',
      path: ['updated'],
    });
  }
}
