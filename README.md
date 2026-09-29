# MedInterview Prep

UK medical school interview practice: question bank, frameworks, timed mock stations and an AI interviewer.

## Stack
Next.js 15 (App Router) · TypeScript (strict) · Tailwind v4 · shadcn/ui · Supabase (Postgres + Auth) · Vercel

## Database
This app shares the Supabase project `aqa-bio-mastery` with other apps. **All tables live in the
`interview` schema**, which keeps them separate from `public` and `chem`. Auth users are shared,
so there is no signup trigger: a profile row is created on first sign-in (`lib/profile.ts`).

Migrations are in `supabase/migrations/` and are applied in order.

## Content
All interview content lives as typed TypeScript in `content/` — the single source of truth:

| File | What it holds |
|---|---|
| `content/categories.ts` | The 10 question categories |
| `content/frameworks.ts` | 13 frameworks (steps, worked example, common mistakes) |
| `content/reading.ts` | 21 reading-library summaries (original wording, with `lastVerified` dates) |
| `content/universities.ts` | Oxford, Cambridge, Imperial, Manchester profiles |
| `content/personas.ts` | AI interviewer personas (prompts live in `lib/ai/prompts`) |
| `content/questions/*.ts` | 64 questions with scaffold, annotated exemplar, follow-ups, key points, pitfalls |

To change content:
1. Edit the relevant file in `content/`.
2. Run `npm run seed:build`. It validates every field and cross-link, then regenerates `supabase/seed/*.sql`.
3. Apply the regenerated files in number order (Supabase SQL editor, or ask Claude). Re-running is safe: rows upsert by slug.

Time-sensitive facts (interview formats, legislation, NHS reorganisation) carry a `lastVerified` date — re-check them each admissions cycle.

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
- [x] M2 Content schema + seed
- [ ] M3 Question bank + frameworks
- [ ] M4 AI feedback
- [ ] M5 Mock station
- [ ] M6 AI interviewer
- [ ] M7 Progress tracking
- [ ] M8 Universities + reading
- [ ] M9 Tiers / feature flags UI
- [ ] M10 Polish + deploy
