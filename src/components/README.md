# Components

## What This Folder Is

This folder contains all **shared React components** for EduQuest. Components are organized by responsibility, not by page. Every component has its own `.module.css` file for scoped styles and a detailed header comment block.

## Folder Structure

```
src/components/
  gamification/       # XP bars, streak counters, level badges, modals, toasts
  layout/
    Navbar/           # Top navigation bar (sticky, glass, dropdowns, mobile drawer)
    Footer/           # Page footer (links, legal, social)
  learning/           # LearningPlanPage — shared chapter/module renderer
  providers/          # Root providers (QueryClient, Toast, LevelUpModal, Theme)
  ui/                 # Generic UI primitives (buttons, inputs, cards, skeletons)
```

## Gamification Components

| Component | Purpose |
|-----------|---------|
| `XPBar` | Animated XP progress bar — fills toward next level |
| `StreakCounter` | Daily streak display with flame icon and tier colours |
| `LevelBadge` | Tier-coloured level number pill badge |
| `LevelUpModal` | Full-screen celebration with confetti on level-up |
| `XPToast` | Utility functions for toast-based XP/streak/battle notifications |

## Layout Components

| Component | Purpose |
|-----------|---------|
| `Navbar` | Sticky top navigation with dropdown menus and mobile drawer |
| `Footer` | Standard page footer |

## Learning Components

| Component | Purpose |
|-----------|---------|
| `LearningPlanPage` | Shared renderer for all class subject and engineering plan pages |

## Providers

| Component | Purpose |
|-----------|---------|
| `Providers` | Root wrapper — QueryClientProvider, LevelUpModal, Toaster, ThemeInitializer |

## Conventions

1. Every component must have its own CSS module file — no inline styles or global classes
2. Every file must start with a detailed header comment block (FILE, LOCATION, PURPOSE, USED BY)
3. Client components start with `"use client";` as the first non-comment line
4. Server components (no hooks, no browser APIs) can omit `"use client"`
5. Use `dynamic()` for heavy components that should not block the initial render
6. Never import server-side code (DB pool, auth helpers) into client components
7. Props interfaces must be typed — no `any` in component signatures
