# Personal Homepage Wireframes and Content Specification

## 1. Design Positioning

The site is a public personal archive for articles, events, resources, and projects. It should feel calm, precise, and durable: closer to a research notebook or personal knowledge base than to a marketing landing page.

Primary goals:

- Publish articles and notes with long-term discoverability.
- Maintain event schedules such as seminars and reading groups.
- Index files such as PDFs, videos, code archives, slides, and datasets.
- Keep updates easy to create from Markdown or structured data.
- Deploy automatically to GitHub Pages after pushing to GitHub.

Visual principles:

- Use restrained typography, generous whitespace, and compact information blocks.
- Prefer lists, timelines, tables, and filters over decorative sections.
- Keep the first screen information-rich: identity, latest updates, and upcoming events.
- Make every content item linkable with a stable URL.
- Avoid large ornamental hero areas, oversized cards, and purely decorative graphics.

## 2. Global Navigation

Desktop navigation:

```text
┌────────────────────────────────────────────────────────────────────────────┐
│ Name / Site Title        Articles   Events   Resources   Projects   About │
└────────────────────────────────────────────────────────────────────────────┘
```

Mobile navigation:

```text
┌──────────────────────────────┐
│ Name / Site Title        ☰   │
├──────────────────────────────┤
│ Articles                     │
│ Events                       │
│ Resources                    │
│ Projects                     │
│ About                        │
└──────────────────────────────┘
```

Required global elements:

- Site title linking to `/`.
- Primary navigation links.
- RSS link in footer.
- GitHub link in footer.
- Last built date in footer.
- Optional language switch if bilingual content is needed later.

## 3. Home Page

Route: `/`

Purpose: Give visitors a fast overview of who the owner is, what is active now, and what was recently published.

Desktop wireframe:

```text
┌────────────────────────────────────────────────────────────────────────────┐
│ Header                                                                     │
├───────────────────────────────┬────────────────────────────────────────────┤
│ Name                          │ Upcoming                                  │
│ Role / affiliation            │ ┌────────────────────────────────────────┐ │
│ Research / interests          │ │ 2026-08-01  Seminar title              │ │
│ Short intro                   │ │ 2026-08-15  Reading group              │ │
│ Links: GitHub / Email / CV    │ └────────────────────────────────────────┘ │
│                               │ Latest Updates                            │
│                               │ ┌────────────────────────────────────────┐ │
│                               │ │ Article / Event / Resource feed        │ │
│                               │ └────────────────────────────────────────┘ │
├───────────────────────────────┴────────────────────────────────────────────┤
│ Featured Writing                                                           │
│ ┌────────────────────┐ ┌────────────────────┐ ┌────────────────────┐       │
│ │ Post title         │ │ Post title         │ │ Post title         │       │
│ │ summary / tags     │ │ summary / tags     │ │ summary / tags     │       │
│ └────────────────────┘ └────────────────────┘ └────────────────────┘       │
├────────────────────────────────────────────────────────────────────────────┤
│ Resource Highlights / Project Highlights                                   │
├────────────────────────────────────────────────────────────────────────────┤
│ Footer                                                                     │
└────────────────────────────────────────────────────────────────────────────┘
```

Mobile wireframe:

```text
┌──────────────────────────────┐
│ Header                       │
├──────────────────────────────┤
│ Name                         │
│ Role / affiliation           │
│ Short intro                  │
│ GitHub / Email / CV          │
├──────────────────────────────┤
│ Upcoming                     │
│ - Event                      │
│ - Event                      │
├──────────────────────────────┤
│ Latest Updates               │
│ - Article                    │
│ - Resource                   │
│ - Event                      │
├──────────────────────────────┤
│ Featured Writing             │
│ [Post]                       │
│ [Post]                       │
├──────────────────────────────┤
│ Footer                       │
└──────────────────────────────┘
```

Home page content rules:

- Show 2 to 4 upcoming events.
- Show 5 to 8 latest updates across posts, events, resources, and projects.
- Show 3 featured articles or notes.
- If there are no upcoming events, show recent completed events instead.
- The owner profile should be editable from a single site profile file.

## 4. Articles Index

Route: `/posts`

Purpose: Browse writing by date, tag, and topic.

Wireframe:

```text
┌────────────────────────────────────────────────────────────────────────────┐
│ Header                                                                     │
├────────────────────────────────────────────────────────────────────────────┤
│ Articles                                                                   │
│ Short description                                                           │
├──────────────────────┬─────────────────────────────────────────────────────┤
│ Filters              │ Article List                                         │
│ Search               │ ┌─────────────────────────────────────────────────┐ │
│ Tags                 │ │ 2026-07-07  Article title                       │ │
│ Years                │ │ Summary, tags, reading time                     │ │
│ Types                │ └─────────────────────────────────────────────────┘ │
│                      │ ┌─────────────────────────────────────────────────┐ │
│                      │ │ 2026-06-18  Note title                          │ │
│                      │ └─────────────────────────────────────────────────┘ │
├──────────────────────┴─────────────────────────────────────────────────────┤
│ Footer                                                                     │
└────────────────────────────────────────────────────────────────────────────┘
```

Index behavior:

- Default sort: newest first.
- Support tag filtering through static tag pages, for example `/tags/ai`.
- Search can be client-side generated from a static JSON index.
- Each row shows title, date, summary, tags, and optional attachment count.

## 5. Article Detail

Route: `/posts/[slug]`

Purpose: Read one article with clear metadata and related files.

Wireframe:

```text
┌────────────────────────────────────────────────────────────────────────────┐
│ Header                                                                     │
├────────────────────────────────────────────────────────────────────────────┤
│ Article title                                                              │
│ Date · Updated · Tags · Reading time                                       │
│ Summary                                                                    │
├──────────────────────┬─────────────────────────────────────────────────────┤
│ Table of Contents    │ Article body                                         │
│ Related items        │ headings, text, math, code, figures, citations       │
│ Attachments          │                                                     │
├──────────────────────┴─────────────────────────────────────────────────────┤
│ Previous / Next article                                                     │
│ Footer                                                                      │
└────────────────────────────────────────────────────────────────────────────┘
```

Article detail rules:

- Use readable line length, approximately 68 to 78 characters for English prose.
- Chinese prose should use comfortable paragraph spacing and avoid dense full-width blocks.
- Show attachments near the top and again after the article if there are more than three.
- Support code highlighting, equations, footnotes, and images.
- Every heading should have an anchor link.

## 6. Events Index

Route: `/events`

Purpose: Publish seminar schedules, reading groups, talks, and personal milestones.

Wireframe:

```text
┌────────────────────────────────────────────────────────────────────────────┐
│ Header                                                                     │
├────────────────────────────────────────────────────────────────────────────┤
│ Events                                                                     │
│ View toggle: Upcoming / Archive / Calendar                                 │
├────────────────────────────────────────────────────────────────────────────┤
│ Upcoming                                                                   │
│ ┌─────────────┬──────────────────────────────────────────────────────────┐ │
│ │ 2026-08-01  │ Seminar title                                            │ │
│ │ 14:00       │ Speaker · Location · Materials                           │ │
│ └─────────────┴──────────────────────────────────────────────────────────┘ │
├────────────────────────────────────────────────────────────────────────────┤
│ Archive                                                                    │
│ Year groups with completed events                                          │
├────────────────────────────────────────────────────────────────────────────┤
│ Footer                                                                     │
└────────────────────────────────────────────────────────────────────────────┘
```

Event behavior:

- Upcoming events sort ascending by date.
- Past events sort descending by date.
- Each event can link to slides, paper, recording, notes, code, or external page.
- Generate an optional `.ics` calendar feed later.
- Support event series, for example a seminar with multiple sessions.

## 7. Event Detail

Route: `/events/[slug]`

Purpose: Provide full details for a single event.

Wireframe:

```text
┌────────────────────────────────────────────────────────────────────────────┐
│ Header                                                                     │
├────────────────────────────────────────────────────────────────────────────┤
│ Event title                                                                │
│ Date · Time · Location · Status                                            │
│ Speaker / organizer                                                        │
├──────────────────────┬─────────────────────────────────────────────────────┤
│ Event facts          │ Description                                         │
│ Materials            │ Abstract / agenda / notes                           │
│ Related events       │                                                     │
├──────────────────────┴─────────────────────────────────────────────────────┤
│ Footer                                                                     │
└────────────────────────────────────────────────────────────────────────────┘
```

Event detail rules:

- The date and location must be visible before the description.
- If the event is online, include the meeting link only if it is intended to be public.
- Materials should be grouped by type: slides, paper, video, code, notes.

## 8. Resources Index

Route: `/resources`

Purpose: Provide a structured file library for PDFs, videos, code, datasets, slides, and external assets.

Wireframe:

```text
┌────────────────────────────────────────────────────────────────────────────┐
│ Header                                                                     │
├────────────────────────────────────────────────────────────────────────────┤
│ Resources                                                                  │
│ Search · Type filter · Tag filter                                          │
├────────────────────────────────────────────────────────────────────────────┤
│ ┌────────────┬────────────────────────────┬────────────┬────────────────┐ │
│ │ Type       │ Title                      │ Date       │ Links          │ │
│ ├────────────┼────────────────────────────┼────────────┼────────────────┤ │
│ │ PDF        │ Paper notes                │ 2026-07-07 │ View / Source  │ │
│ │ Video      │ Talk recording             │ 2026-06-20 │ Watch          │ │
│ │ Code       │ Example repository         │ 2026-05-12 │ GitHub         │ │
│ └────────────┴────────────────────────────┴────────────┴────────────────┘ │
├────────────────────────────────────────────────────────────────────────────┤
│ Footer                                                                     │
└────────────────────────────────────────────────────────────────────────────┘
```

Resource behavior:

- Default sort: newest first.
- Large files should use external URLs or GitHub Releases.
- Local files should live under `public/files`.
- Each resource should have a canonical detail page only if it needs description, citation, or relations.

## 9. Projects Index

Route: `/projects`

Purpose: Show ongoing and completed projects without mixing them into regular articles.

Wireframe:

```text
┌────────────────────────────────────────────────────────────────────────────┐
│ Header                                                                     │
├────────────────────────────────────────────────────────────────────────────┤
│ Projects                                                                   │
│ Status filter: Active / Paused / Completed                                 │
├────────────────────────────────────────────────────────────────────────────┤
│ ┌────────────────────────────────────────────────────────────────────────┐ │
│ │ Project title                                                          │ │
│ │ Summary · status · tags · links                                        │ │
│ │ Latest related posts / resources                                       │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
├────────────────────────────────────────────────────────────────────────────┤
│ Footer                                                                     │
└────────────────────────────────────────────────────────────────────────────┘
```

Project behavior:

- Active projects appear first.
- Each project can link to posts, events, resources, and repositories.
- Project pages are optional for small projects and required for long-running work.

## 10. About Page

Route: `/about`

Purpose: Present a concise personal profile, CV-style background, and contact methods.

Wireframe:

```text
┌────────────────────────────────────────────────────────────────────────────┐
│ Header                                                                     │
├───────────────────────────────┬────────────────────────────────────────────┤
│ Portrait / simple identity    │ Bio                                        │
│ Contact links                 │ Interests                                  │
│ CV / GitHub / Email           │ Education / Experience                     │
│                               │ Selected publications or projects          │
├───────────────────────────────┴────────────────────────────────────────────┤
│ Footer                                                                     │
└────────────────────────────────────────────────────────────────────────────┘
```

About rules:

- Keep contact information easy to find.
- Make CV downloadable as a PDF if available.
- Keep long publication lists on a separate section or page if they grow.

## 11. Content Directory Proposal

```text
src/
  content/
    posts/
      example-post.md
    events/
      example-event.md
    resources/
      example-resource.md
    projects/
      example-project.md
    profile/
      site.yaml
public/
  files/
    papers/
    slides/
    videos/
    code/
  images/
    profile/
    posts/
```

Slug rules:

- Use lowercase ASCII slugs for URLs.
- Prefer `yyyy-mm-dd-short-title` for dated notes if title collisions are likely.
- Do not change slugs after publication unless redirects are added.

File rules:

- PDFs: `public/files/papers/` or `public/files/slides/`.
- Videos: use external hosting by default; only small clips go in `public/files/videos/`.
- Code: link to GitHub repositories by default; small examples can be zipped under `public/files/code/`.
- Images used in content: `public/images/posts/[slug]/`.

## 12. Content Field Specifications

### 12.1 Site Profile

Path: `src/content/profile/site.yaml`

```yaml
name: "Your Name"
siteTitle: "Your Name"
tagline: "Research notes, articles, events, and resources"
role: "Researcher / Developer / Student"
affiliation: "Institution or organization"
location: "City, Country"
bio: "Short public biography."
interests:
  - "Artificial Intelligence"
  - "Systems"
  - "Mathematics"
links:
  email: "mailto:name@example.com"
  github: "https://github.com/username"
  cv: "/files/cv.pdf"
  googleScholar: ""
  orcid: ""
footer:
  copyrightName: "Your Name"
  license: "CC BY 4.0"
```

Required fields:

- `name`
- `siteTitle`
- `tagline`
- `bio`
- `links.github` or `links.email`

### 12.2 Post

Path: `src/content/posts/[slug].md`

```yaml
---
title: "Article title"
slug: "article-title"
date: "2026-07-07"
updated: "2026-07-07"
summary: "One or two sentences describing the article."
type: "article"
status: "published"
language: "zh"
tags:
  - "AI"
  - "Reading"
series: ""
featured: false
draft: false
cover:
  image: ""
  alt: ""
attachments:
  - title: "Related PDF"
    type: "pdf"
    url: "/files/papers/example.pdf"
    description: "Optional short note."
related:
  posts: []
  events: []
  resources: []
  projects: []
---
```

Allowed values:

- `type`: `article`, `note`, `log`, `review`, `tutorial`
- `status`: `draft`, `published`, `archived`
- `language`: `zh`, `en`, `mixed`

Required fields:

- `title`
- `date`
- `summary`
- `type`
- `status`
- `tags`

Validation rules:

- `date` must use `YYYY-MM-DD`.
- `updated` must not be earlier than `date`.
- `summary` should be 40 to 180 Chinese characters or 20 to 60 English words.
- Draft posts must not be included in production builds unless explicitly enabled.

### 12.3 Event

Path: `src/content/events/[slug].md`

```yaml
---
title: "Seminar title"
slug: "seminar-title"
date: "2026-08-01"
endDate: ""
time: "14:00"
timezone: "Asia/Shanghai"
location: "Room 101 / Online"
onlineUrl: ""
status: "upcoming"
eventType: "seminar"
series: "Weekly Seminar"
speakers:
  - name: "Speaker Name"
    affiliation: "Institution"
    url: ""
organizers:
  - "Organizer Name"
summary: "Short event description."
materials:
  - title: "Slides"
    type: "slides"
    url: "/files/slides/example.pdf"
  - title: "Recording"
    type: "video"
    url: "https://example.com/video"
related:
  posts: []
  resources: []
  projects: []
---
```

Allowed values:

- `status`: `upcoming`, `completed`, `cancelled`, `postponed`
- `eventType`: `seminar`, `talk`, `reading-group`, `workshop`, `deadline`, `personal`
- `materials.type`: `paper`, `slides`, `video`, `code`, `notes`, `dataset`, `link`

Required fields:

- `title`
- `date`
- `timezone`
- `location`
- `status`
- `eventType`
- `summary`

Validation rules:

- Upcoming events must have a future or current `date`.
- Completed events should have at least one of: notes, slides, recording, summary, or related post.
- Public pages should not expose private meeting links unless `onlineUrl` is intentionally public.

### 12.4 Resource

Path: `src/content/resources/[slug].md`

```yaml
---
title: "Resource title"
slug: "resource-title"
date: "2026-07-07"
updated: ""
type: "pdf"
status: "published"
summary: "What this resource is and why it exists."
url: "/files/papers/resource.pdf"
sourceUrl: ""
size: ""
format: "pdf"
tags:
  - "Paper"
license: ""
citation: ""
related:
  posts: []
  events: []
  projects: []
---
```

Allowed values:

- `type`: `pdf`, `video`, `code`, `dataset`, `slides`, `image`, `link`, `other`
- `status`: `published`, `archived`, `private-link`

Required fields:

- `title`
- `date`
- `type`
- `summary`
- `url`
- `tags`

Validation rules:

- Local URLs must begin with `/files/` or `/images/`.
- External URLs must begin with `https://`.
- Large videos and datasets should use external links or GitHub Releases.
- A resource with `status: private-link` should not appear in global indexes.

### 12.5 Project

Path: `src/content/projects/[slug].md`

```yaml
---
title: "Project title"
slug: "project-title"
date: "2026-07-07"
updated: "2026-07-07"
status: "active"
summary: "Short project summary."
description: "Longer description for index cards and project pages."
tags:
  - "Web"
  - "Research"
links:
  repository: "https://github.com/username/repo"
  demo: ""
  documentation: ""
featured: false
related:
  posts: []
  events: []
  resources: []
---
```

Allowed values:

- `status`: `active`, `paused`, `completed`, `archived`

Required fields:

- `title`
- `date`
- `status`
- `summary`
- `tags`

Validation rules:

- Active projects should show before paused and completed projects.
- A project marked `featured: true` can appear on the home page.
- Related items should reference existing slugs.

## 13. Cross-Content Relationships

Use slug references to connect content:

```yaml
related:
  posts:
    - "article-title"
  events:
    - "seminar-title"
  resources:
    - "resource-title"
  projects:
    - "project-title"
```

Relationship rules:

- Content pages should show related items grouped by type.
- Broken related slugs should fail validation.
- Circular relationships are allowed but do not need to be shown twice on the same page.

## 14. Publishing Workflow

Recommended workflow:

```text
1. Create or edit Markdown/YAML content.
2. Add files under public/files or link to external assets.
3. Run local validation.
4. Preview locally.
5. Commit changes.
6. Push to GitHub.
7. GitHub Actions builds the site and publishes to GitHub Pages.
```

Suggested commands after implementation:

```bash
pnpm new:post
pnpm new:event
pnpm validate
pnpm dev
pnpm build
```

Automation goals:

- Generate new content files from templates.
- Validate dates, required fields, related slugs, and local file links.
- Generate RSS feed.
- Generate sitemap.
- Generate search index.
- Deploy through GitHub Actions.

## 15. Component Breakdown

Core layout components:

- `SiteHeader`
- `SiteFooter`
- `PageTitle`
- `ContentMeta`
- `TagList`
- `Timeline`
- `AttachmentList`
- `RelatedItems`
- `FilterBar`
- `SearchBox`
- `TableOfContents`

Page-specific components:

- `HomeIntro`
- `LatestUpdates`
- `UpcomingEvents`
- `PostList`
- `EventList`
- `ResourceTable`
- `ProjectList`
- `ProfilePanel`

## 16. Implementation Priority

Phase 1:

- Static shell, navigation, and base layout.
- Home page, articles, events, resources, projects, and about pages.
- Markdown content collections.
- GitHub Pages deployment.

Phase 2:

- Search index.
- RSS and sitemap.
- Content creation scripts.
- Content validation script.
- Event calendar export.

Phase 3:

- Bilingual content support if needed.
- Project detail pages.
- Advanced filtering.
- Analytics or privacy-friendly page view tracking.

