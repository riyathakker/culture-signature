# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # dev server on port 3001
npm run build        # prisma generate + next build
npm run lint         # eslint
npx prisma migrate dev --name <name>   # create + apply a migration
npx prisma generate  # regenerate client after schema changes
npx prisma studio    # visual DB browser
npx prisma db seed   # seed from prisma/seed.js
```

No test suite exists in this project.

## Architecture

**Next.js 16 App Router** with PostgreSQL + Prisma, NextAuth v5, Tailwind CSS v4, Zustand for client state, and Cloudinary for image uploads.

### API layer pattern
Every route file in `src/app/api/` re-exports from a separate handler file:
```
route.ts  →  export const GET = apiHandler(getHandler)   (from get.ts)
          →  export const POST = apiHandler(postHandler)  (from post.ts)
```
`src/lib/nextApiHandler.ts` wraps handlers: injects `req.userId` / `req.userEmail` from the NextAuth session and catches unhandled errors. Admin-only routes check `session.user.role === "ADMIN"` manually inside the handler.

Two API namespaces:
- `/api/products`, `/api/orders`, `/api/cart`, etc. — user-facing
- `/api/admin/products`, `/api/admin/orders`, etc. — admin panel, always guard with role check

### Data access
`src/services/*.ts` — thin wrappers that call the internal `api()` helper (`src/services/api.ts`), which prepends `/api` and handles JSON + error parsing. Used by Zustand stores, not called directly from components.

`src/store/*.ts` — one Zustand store per domain. Stores own loading state, cache timestamps, and mutation helpers. The standard caching pattern (used in `productStore`): check `lastFetched` + 5-minute TTL before re-fetching. Components call store actions, never fetch directly (exception: a few pages still use raw `fetch` for one-off calls — migrate these to stores when touching them).

### Auth
`src/auth.ts` (NextAuth v5). Session exposes `id` and `role` alongside standard fields via a JWT callback. The `LayoutWrapper` component bootstraps cart + wishlist on session change.

### PWA
`@ducanh2912/next-pwa` configured in `next.config.ts`. The app has two header modes:
- `PWAHomeHeader` — fixed header shown on the home page in standalone mode
- `PWAPageHeader` — fixed header for all other pages in standalone mode

`pwa-page-content` CSS class (in `globals.css`) adds `padding-top: calc(68px + env(safe-area-inset-top))` to push content below the fixed PWA header. Applied by `LayoutWrapper` to all non-admin, non-auth, non-home pages.

`pwa-hide` class hides elements in `display-mode: standalone`. Used to collapse desktop-only UI (sidebars, page headings, descriptions) in PWA.

The bottom nav (`PWABottomNav`) is only visible in standalone mode via the `pwa-bottom-nav` CSS class.

### Styling conventions
- Tailwind CSS v4 (no `tailwind.config.js` — config is in CSS via `@theme`)
- `[@media(display-mode:standalone)]:` prefix for PWA-specific overrides inline
- Custom utility classes defined in `globals.css`: `text-luxury`, `muted-italic`, `text-spaced-bold`, `btn-luxury`, `grid-gallery`, `pwa-*`
- `cn()` from `src/lib/utils.ts` for conditional class merging

### i18n
All user-visible strings go through `useTranslation()` → `t("dot.separated.key")`. Translations live in `src/locales/en.ts`. The `TranslationContext` currently only supports `en` but is structured for expansion.

### Database schema highlights
- `Product` has `images String[]`, `isFeatured`, `isLimitedDrop`, `discount Float` — no color/size variants yet
- `Order` stores denormalised shipping fields directly (no FK to Address); status enum: `PENDING → PAID → SHIPPED → DELIVERED → CANCELLED`
- `CartItem` has a `@@unique([userId, productId])` constraint — one row per product per user
- Soft deletes everywhere via `isDeleted Boolean @default(false)` — always filter `isDeleted: false` in queries

### Admin panel
Lives at `/admin/*`. Has its own sidebar layout and is completely hidden from the PWA bottom nav. Admin users see a stripped-down storefront (no cart/wishlist/bag tab).
