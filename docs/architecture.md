# Islamic Scholar Knowledge Platform Architecture

## Product Positioning

This is the official Malayalam-first knowledge platform for an individual Islamic scholar. It is designed as a content preservation and publishing system, not a blog or marketing site.

## Design System

- Colors: calm emerald primary, off-white background, warm gold accent, semantic destructive states, dark mode token parity.
- Typography: Anek Malayalam for UI and content, Geist Mono only for technical counters and identifiers.
- Scale: compact 4/8px spacing rhythm, 8px cards/buttons by default, larger radii only for major framed surfaces.
- Components: shadcn-style variants for buttons, cards, badges, inputs, containers, headers, footers, content cards, page heroes.
- Motion: subtle entrance and state transitions only; disabled through reduced-motion media query.
- Accessibility: Malayalam `lang`, visible focus, sufficient contrast, semantic landmarks, RTL-ready Arabic quote class.
- Responsiveness: mobile-first layouts, `container` max width 1180px, `xs/sm/md/lg/xl` Tailwind breakpoints.

## Application Architecture

- Next.js App Router with Server Components by default.
- Supabase Auth for admins/editors and RLS enforcement.
- PostgreSQL normalized schema for content, taxonomy, media, SEO, menus, settings, revisions, activity logs.
- Supabase Storage buckets for public images, public downloads, protected documents, and gallery media.
- Vercel hosting with ISR for public content and dynamic OG generation.

## SEO Architecture

- Central metadata factory.
- Canonical URLs under `mueenudeenbaqavi.com`.
- OpenGraph/Twitter cards.
- `/sitemap.xml`, `/robots.txt`, `/api/rss`.
- Schema.org Person and Organization globally; Article, FAQ, Course, Book, Breadcrumb should be emitted on dynamic detail pages.
- Automatic slug uniqueness enforced at database level.

## Admin Architecture

- Admin and editor roles.
- Draft, scheduled, published, archived statuses.
- Revision history and audit log.
- Rich text and markdown content body.
- Reading time, views, SEO score, autosave, preview, and publish workflow.
- `/admin` is protected by Supabase Auth middleware when Supabase environment variables are configured.
- Local development without Supabase variables leaves admin routes accessible so UI work can continue before credentials are provisioned.
- `/login` supports Supabase password login and magic-link email login.
- Article, Fatwa, and Ahlu Sunnah public pages read from Supabase when configured and fall back to seed content during local setup.

## Supabase Setup Flow

1. Create a Supabase project and run `supabase/schema.sql`.
2. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from `.env.example`.
3. Create an auth user, then insert a matching `profiles` row with role `admin`.
4. Sign in at `/login`, create content in `/admin`, and publish it to make it visible publicly.
