import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

const owner = process.env.GITHUB_REPOSITORY_OWNER;
const repo = process.env.GITHUB_REPOSITORY?.split('/')[1];
const isUserOrOrgPage = repo?.endsWith('.github.io') ?? false;

const site = process.env.SITE_URL ?? (owner ? `https://${owner}.github.io` : 'https://example.com');
const base = process.env.BASE_PATH ?? (repo && !isUserOrOrgPage ? `/${repo}` : '/');

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  integrations: [mdx(), sitemap()],
  markdown: {
    shikiConfig: {
      theme: 'github-light',
    },
  },
});
