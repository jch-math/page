import mdx from '@astrojs/mdx';
import { unified } from '@astrojs/markdown-remark';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';

const owner = process.env.GITHUB_REPOSITORY_OWNER;
const repo = process.env.GITHUB_REPOSITORY?.split('/')[1];
const isUserOrOrgPage = repo?.endsWith('.github.io') ?? false;

const site = process.env.SITE_URL ?? (owner ? `https://${owner}.github.io` : 'https://example.com');
const base = process.env.BASE_PATH ?? (repo && !isUserOrOrgPage ? `/${repo}` : '/');

function rehypeBasePaths() {
  const normalizedBase = base === '/' ? '' : base.replace(/\/$/, '');
  return (tree) => {
    const visit = (node) => {
      if (node?.type === 'element' && node.properties) {
        for (const property of ['href', 'src']) {
          const value = node.properties[property];
          if (typeof value === 'string' && value.startsWith('/') && !value.startsWith(`${normalizedBase}/`)) {
            node.properties[property] = `${normalizedBase}${value}`;
          }
        }
      }
      node?.children?.forEach(visit);
    };
    visit(tree);
  };
}

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  integrations: [mdx(), sitemap()],
  markdown: {
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex, rehypeBasePaths],
    }),
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      defaultColor: false,
    },
  },
});
