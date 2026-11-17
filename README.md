# Bradley Charles: portfolio

A Next.js (App Router) portfolio with two modes, Developer and Artist, plus project pages for RO Dev Suite, BARD, Project Maki, a CP2077 checklist and an Elite Dangerous colonization tracker.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm run start
```

`/?mode=artist` opens the Artist view directly.

## How this site is built

- **Next.js 15 + React 19 + TypeScript**, CSS Modules, no UI framework.
- **Fonts:** `next/font`. Only Geist Sans loads globally; each project's fonts live in that route's `layout.tsx`, and navbar-brand fonts load on demand.
- **Images:** `next/image` everywhere, so the Artist page serves resized AVIF/WebP (22.7 MB to 0.41 MB on that page).
- **Security headers:** baseline headers and an enforced Content Security Policy in `next.config.ts`; `poweredByHeader` is off.
- **Accessibility:** keyboard-operable nav and dialogs (Escape closes, focus returns to the opener), reduced-motion support in the hero animation and role ticker.
- **SEO:** per-route metadata, `sitemap.xml`, `robots.txt`, Open Graph image and Person JSON-LD. Set `NEXT_PUBLIC_SITE_URL` to the production origin.
- **CI:** lint, typecheck, build and a dependency audit on every push and PR (`.github/workflows/ci.yml`); Dependabot keeps dependencies current.

See [SECURITY.md](SECURITY.md) for reporting issues.
