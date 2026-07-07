# Self Page

A personal homepage for articles, events, resources, and projects, built with Astro content collections and designed for GitHub Pages.

## Commands

```bash
pnpm install
pnpm dev
pnpm check
pnpm build
```

## Content

- `src/content/posts/`: articles, notes, logs, reviews, and tutorials.
- `src/content/events/`: seminars, talks, reading groups, workshops, deadlines, and personal events.
- `src/content/resources/`: PDFs, videos, code, datasets, slides, images, and external links.
- `src/content/projects/`: active, paused, completed, or archived projects.
- `src/content/profile/site.yaml`: site identity and contact information.

File IDs are used as stable relationship keys. Keep filenames lowercase and URL-safe.

## Deployment

Push to GitHub and enable GitHub Pages with "GitHub Actions" as the source. The workflow in `.github/workflows/deploy.yml` builds and publishes `dist/`.
