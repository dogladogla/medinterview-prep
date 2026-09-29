# MedInterview Prep

UK medical school interview practice: question bank, frameworks, timed mock stations and an AI interviewer.

## Stack
Next.js 15 (App Router) · TypeScript (strict) · Tailwind v4 · shadcn/ui · Supabase (Postgres + Auth) · Vercel

## Database
This app shares the Supabase project `aqa-bio-mastery` with other apps. **All tables live in the
`interview` schema**, which keeps them separate from `public` and `chem`. Auth users are shared,
so there is no signup trigger: a profile row is created on first sign-in (`lib/profile.ts`).

Migrations are in `supabase/migrations/` and are applied in order.

## Run locally
```bash
cp .env.example .env.local   # fill in the two Supabase values
npm install
npm run dev                  # http://localhost:3000
```

Checks: `npm run typecheck`, `npm run lint`, `npm run build`.

## Routes
- Public: `/`, `/questions`, `/frameworks`, `/universities`, `/reading`, `/login`
- Signed-in only: `/dashboard`, `/mock`, `/interviewer`, `/settings` (enforced in `middleware.ts` and `app/(app)/layout.tsx`)

## Milestones
- [x] M1 Foundation: scaffold, auth, profiles, RLS, layout
- [ ] M2 Content schema + seed
- [ ] M3 Question bank + frameworks
- [ ] M4 AI feedback
- [ ] M5 Mock station
- [ ] M6 AI interviewer
- [ ] M7 Progress tracking
- [ ] M8 Universities + reading
- [ ] M9 Tiers / feature flags UI
- [ ] M10 Polish + deploy
