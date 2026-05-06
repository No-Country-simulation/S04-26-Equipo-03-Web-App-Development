<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

## Project

Next.js 16.2.4 app with React 19, TypeScript, Tailwind CSS v4, and shadcn/ui (new-york preset, Lucide icons). Package manager: **pnpm**.

## Commands

```
pnpm dev          # Start dev server
pnpm build        # Production build
pnpm start        # Start production server
pnpm lint         # Run ESLint (includes eslint-config-prettier)
pnpm skills:install  # Install agent skills via npx autoskills
```

Verify order: `lint` → `build` (no test suite yet).

## Architecture

- **Monorepo root**: `S04-26-Equipo-03-Web-App-Development/` (parent of `frontend/`)
- **App**: `frontend/src/app/` — Next.js App Router, `page.tsx` is `'use client'`
- **Components**:
  - `src/components/ui/` — shadcn/ui components (do not hand-edit; add via `npx shadcn@latest add`)
  - `src/components/landing/` — landing page sections (Header, HeroSection, HowItWorks, StatsSection, FeaturesSection, CrutySection, CtaSection, Footer)
- **Path alias**: `@/*` → `./src/*`
- **Font**: Inter (loaded via `next/font/google`), CSS var `--font-inter`
- **Language**: Spanish (locale `es`)

## Branches

- `main` — production
- `Testing` — testing branch
- `feature/landing-page` — landing page development

## Conventions

- **Tailwind CSS v4**: No `tailwind.config.js`. Config is CSS-first via `@theme` in `globals.css`. Use `@tailwindcss/postcss` (not `tailwindcss` CLI).
- **ESLint**: Flat config (`eslint.config.mjs`) with `next/core-web-vitals`, `next/typescript`, and `prettier`. Prettier runs via ESLint (`lint` script), not as a separate command.
- **shadcn/ui**: Components live in `@/components/ui/`. When adding new UI components, use the CLI — don't copy manually.
- **Landing page structure**: Currently all sections imported in `page.tsx`. Sections are in `@/components/landing/`. Future pages may reuse Header and Footer.
- **Responsive design**: Mobile-first with `sm:` (640px), `md:` (768px), `lg:` (1024px). Header uses hamburger menu on mobile.

## Quirks

- `.agents/` directory is gitignored (agent skills cache)
- `pnpm-workspace.yaml` only contains `onlyBuiltDependencies` for `sharp` and `unrs-resolver`
- Vercel Analytics is commented out in `layout.tsx` — re-enable when deploying
- ESLint flat config format — don't use `.eslintrc.*` or override files
