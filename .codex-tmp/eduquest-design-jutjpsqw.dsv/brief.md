# EduQuest Frontend Polish Brief

## Objective
Improve the active Next.js application frontend, not a standalone mockup. Focus only on the shared Navbar and Home page so the work is scoped and low-risk.

## Target Users
Indian Class 9-12 students, engineering learners, teachers, organizers, and parents. The UI must feel professional, minimal, fast, and easy to scan.

## Files Owned By This Task
- `src/components/layout/Navbar/Navbar.tsx`
- `src/components/layout/Navbar/Navbar.module.css`
- `src/app/page.tsx`
- `src/app/HomePage.module.css`

Do not edit other files. Do not revert unrelated user or agent changes.

## Existing Constraints
- Use the existing Next.js App Router and CSS modules.
- Keep page-specific CSS separate.
- Use existing `lucide-react` icons.
- Keep comments in simple English where logic is not obvious.
- Preserve current working routes and auth/session behavior.
- Do not add external image URLs. Use existing images from `public/images`.
- Avoid cards inside cards, decorative orb backgrounds, and heavy gradient-only design.

## Aesthetic Direction
Clean education product with a polished SaaS dashboard feel: calmer typography, better navigation hierarchy, clearer CTAs, and responsive spacing. Keep the palette balanced with blue, teal, amber, green, and neutral surfaces instead of one dominant hue.

## Required Improvements
- Make the Navbar easier to use on desktop and mobile, especially when there are many links.
- Keep active route state clear.
- Keep text inside buttons from overflowing on small devices.
- Improve Home page hero readability, stats hierarchy, and section scanning.
- Add professional icons where helpful, but avoid clutter.
- Keep performance-friendly CSS and do not introduce large client code.

## Verification
Run `npm run lint`, `npm run typecheck`, and `npm run build` if time allows. Report changed file paths and any commands run.
