# EduQuest Frontend Production Pass Brief

## Objective

Improve the existing EduQuest Next.js application UI so it feels calmer, more professional, faster, and easier to navigate on mobile and desktop. This is a real app integration task, not a standalone mockup.

## Target Audience

Class 9-12 students, engineering learners, parents, teachers, and college event organizers in India. The UI must be simple enough for a student to understand quickly while still feeling credible for schools and colleges.

## Existing App Structure

- App Router pages live in `src/app`.
- Shared layout components live in `src/components/layout`.
- Shared UI components live in `src/components/ui`.
- Each major page already has its own route folder and its own CSS module. Preserve that pattern.
- Do not create a standalone `index.html`.

## Required Design Direction

- Minimalist, trust-first education product.
- Use the existing self-hosted font packages. Body should stay highly readable, headings should feel modern but not decorative.
- Use a balanced palette: blue for trust, teal/green for learning, amber only for achievements. Avoid a one-color purple/blue look.
- Keep cards at 8px radius when reasonable; avoid nested card-heavy layouts.
- Use `lucide-react` icons where a symbol helps scanning.
- Use existing raster images from `public/images` where appropriate. Do not add external image URLs.
- Keep all layouts responsive down to very small phones and up to wide desktop.
- Do not add visible tutorial text explaining how to use the UI unless it is actual product copy.

## Implementation Scope

Own only these files unless a tiny related change is required:

- `src/styles/globals.css`
- `src/components/layout/Navbar/Navbar.tsx`
- `src/components/layout/Navbar/Navbar.module.css`
- `src/app/page.tsx`
- `src/app/HomePage.module.css`

## Requirements

- Keep clear beginner-friendly file purpose comments.
- Improve navbar information architecture for many pages: desktop should not feel crowded, mobile drawer should be easy to scan, active states should be clear.
- Improve home page sections using the existing data and pages. Make the first viewport professional and avoid lag-heavy effects.
- Add or preserve lazy/dynamic loading strategy; do not move heavy client logic into the home page.
- Avoid adding dependencies.
- Keep TypeScript, ESLint, and Next build compatibility.

## Output

Edit the project files directly and report:

- Files changed.
- Key UI decisions.
- Any remaining risk.
