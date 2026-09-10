# Wisnu Akbar Aridho — Portfolio

A premium dark-blue/cyan personal portfolio with a full content management area.

## Public pages

| Path | Content |
| --- | --- |
| `/` | Hero, about, featured projects, skills, experience, services, contact |
| `/about` | Full bio, stats, portrait, resume link |
| `/projects` | All published projects with filtering |
| `/projects/$slug` | Case study, gallery lightbox, next project |
| `/skills`, `/experience`, `/services`, `/contact` | Dedicated pages |
| `/sitemap.xml`, `/robots.txt` | SEO |

## Admin

1. Sign in at `/login` (email + password, or Google).
2. The first registered account becomes the administrator.
3. Manage everything at `/admin`: dashboard, projects (drafts, featured, gallery),
   about/profile, skills, experience, services, social links, media library, password.

Changes save straight to the database and appear on the public site immediately.
Only published projects are visible to visitors.

## Content and assets

- Portrait placeholder: `public/images/profile.jpg` (replaceable from the About screen).
- Logo: `public/images/logo.png`.
- Uploads: images and PDFs up to 5MB, stored in a private bucket and served through
  `/api/public/media/*`.

## Stack

TanStack Start (React 19, Vite 7), Tailwind CSS v4, motion, TanStack Query,
Lovable Cloud (Postgres + Auth + Storage) with row-level security on every table.

## Local development

```sh
npm i
npm run dev
```
