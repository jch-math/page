# Neko

Neko 的个人研究手帐，用于发布文章、项目文档和链接收藏。站点由 Astro 静态生成，并通过 GitHub Actions 部署到 GitHub Pages。

## 本地开发

```bash
pnpm install
pnpm dev
pnpm check
pnpm build
```

## 新增内容

内容保存在 `src/content/`，支持 Markdown 和 MDX。

```bash
pnpm new:post "文章标题" --slug article-slug
pnpm new:project "项目名称" --slug project-slug
pnpm new:link "链接名称" --slug link-slug
```

新建内容默认是草稿。将 frontmatter 中的 `status` 改为公开状态后，它才会进入页面、RSS、Sitemap 和 `/api/content.json`。

- 文章：`draft`、`published`、`archived`
- 项目：`draft`、`active`、`paused`、`completed`、`archived`
- 链接：`draft`、`published`、`archived`

个人资料集中保存在 `src/content/profile/site.yaml`。图片放入 `public/images/`，附件放入 `public/files/`，正文中使用以 `/` 开头的站内路径。

## 部署

仓库已经包含 GitHub Pages 工作流。GitHub 仓库的 Pages 来源设置为 **GitHub Actions** 后，推送到 `main` 会自动检查、构建并发布站点。

构建会根据 `GITHUB_REPOSITORY_OWNER` 和 `GITHUB_REPOSITORY` 自动设置 GitHub Pages 的站点地址与子路径，因此当前仓库会发布到 `https://jch-math.github.io/page/`。

## 扩展接口

`/api/content.json` 提供版本化的公开内容索引。首页、列表页、RSS 与 JSON 使用同一套内容筛选和规范化逻辑，方便以后增加搜索、订阅或独立小工具。
