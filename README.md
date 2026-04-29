# Habit Tracker PWA

A mobile-first Progressive Web App for tracking daily habits. Built for HNG Internship Stage 3.

## Project Overview
Users can sign up, log in, create/edit/delete habits, mark habits complete each day, and see their streak. All data lives in localStorage. The app installs as a PWA and works offline after first load.

## Setup Instructions
- Node.js 18+ required
- Run: `npm install`
- Run: `npx playwright install chromium`

## Run Instructions
- Development: `npm run dev` then open http://localhost:3000
- Production: `npm run build` then `npm start`

## Test Instructions
- Unit tests: `npm run test:unit`
- Integration tests: `npm run test:integration`
- E2E tests: start dev server first, then `npm run test:e2e`
- All tests: `npm test`

## Local Persistence Structure
All data is stored in localStorage using three keys:
- `habit-tracker-users` — array of registered users
- `habit-tracker-session` — currently logged-in session
- `habit-tracker-habits` — all habits across all users

Each habit has: id, userId, name, description, frequency (daily), createdAt, completions (YYYY-MM-DD dates)

## PWA Support
- `public/manifest.json` — app name, icons, start_url, display mode
- `public/sw.js` — cache-first service worker, caches app shell on install
- `public/icons/icon-192.png` and `icon-512.png` — required PWA icons
- Service worker registered in `src/components/shared/ServiceWorkerRegistration.tsx`

## Trade-offs and Limitations
- Passwords stored in plain text (front-end only, no backend)
- No session expiry — persists until logout
- Data does not sync across devices
- Only daily frequency implemented (per spec)

## Test File Map
| File | Describe Block | What It Verifies |
|---|---|---|
| tests/unit/slug.test.ts | getHabitSlug | Slug generation from habit names |
| tests/unit/validators.test.ts | validateHabitName | Name validation rules |
| tests/unit/streaks.test.ts | calculateCurrentStreak | Streak calculation logic |
| tests/unit/habits.test.ts | toggleHabitCompletion | Completion toggle behavior |
| tests/integration/auth-flow.test.tsx | auth flow | Signup, login, error messages |
| tests/integration/habit-form.test.tsx | habit form | Create, edit, delete, complete |
| tests/e2e/app.spec.ts | Habit Tracker app | Full user journeys end-to-end |