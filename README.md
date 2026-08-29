# Neko

Neko 的个人研究手帐，用于发布文章、项目文档和链接收藏。站点由 Astro 静态生成，并通过 GitHub Actions 部署到 GitHub Pages。

## 本地开发

```bash
pnpm install
pnpm dev
pnpm verify
```

## 新增内容

内容保存在 `src/content/`，支持 Markdown 和 MDX。

```bash
pnpm new:post "文章标题" --slug article-slug
pnpm new:project "项目名称" --slug project-slug
pnpm new:link "链接名称" --slug link-slug
```

新建内容默认是草稿，摘要等发布字段可以暂时留空。草稿不会进入页面、RSS、Sitemap 或 `/api/content.json`，也不会因为尚未填写摘要而阻断线上部署。

推荐的发布流程：

1. 使用 `new:*` 命令创建草稿并完成正文。
2. 补全日期、摘要、链接和标签等发布字段。
3. 将 frontmatter 中的 `status` 改为公开状态。
4. 运行 `pnpm verify`，确认测试、类型检查、生产构建和产物检查全部通过。
5. 提交并推送。

公开或归档内容会执行严格校验。摘要少于 8 个字符、链接无效、更新时间早于发布日期或草稿被设为精选时，验证会指出对应字段并阻止发布。

- 文章：`draft`、`published`、`archived`
- 项目：`draft`、`active`、`paused`、`completed`、`archived`
- 链接：`draft`、`published`、`archived`

个人资料集中保存在 `src/content/profile/site.yaml`。图片放入 `public/images/`，附件放入 `public/files/`，正文中使用以 `/` 开头的站内路径。

## 部署

仓库已经包含 GitHub Pages 工作流。GitHub 仓库的 Pages 来源设置为 **GitHub Actions** 后，Pull Request 会运行完整验证但不会部署；推送到 `main` 只有在测试、检查、构建和产物验证全部成功后才会发布站点。

构建会根据 `GITHUB_REPOSITORY_OWNER` 和 `GITHUB_REPOSITORY` 自动设置 GitHub Pages 的站点地址与子路径，因此当前仓库会发布到 `https://jch-math.github.io/page/`。

## 扩展接口

`/api/content.json` 提供版本化的公开内容索引。首页、列表页、详情路由、标签、RSS 与 JSON 使用同一个公开内容目录，统一处理状态筛选、日期排序、精选文章、标签与基础路径，方便以后增加搜索、订阅或独立小工具。
