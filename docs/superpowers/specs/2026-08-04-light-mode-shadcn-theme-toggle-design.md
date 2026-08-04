# Light Mode & shadcn/ui Theme Toggle Design Specification

**Date**: 2026-08-04  
**Topic**: Light Mode default with shadcn/ui Neutral Palette & Enterprise Theme Toggle  

---

## 1. Executive Summary

This specification defines the architectural design and visual styling to integrate standard **shadcn/ui Neutral Palette** design tokens into the project with **Light Mode as the default mode**. It includes a `next-themes` setup and an enterprise-grade `ThemeToggle` component integrated into the desktop header navigation bar and mobile drawer menu.

---

## 2. Requirements & Intent

- **Default Theme**: Light mode (`defaultTheme="light"`).
- **Design Aesthetic**: Professional enterprise UI, neutral monochrome tone (shadcn/ui neutral color scale).
- **Toggle Location**: Desktop Navbar & Mobile drawer menu.
- **Persistence**: `localStorage` persistence managed seamlessly via `next-themes` with zero layout shift / hydration flicker (`suppressHydrationWarning`).

---

## 3. Architecture & Components

### 3.1 Design System Tokens (`src/app/globals.css`)
Configure official shadcn/ui Neutral HSL tokens:
- Light Mode (`:root`):
  - `--background`: `0 0% 100%`
  - `--foreground`: `0 0% 9%`
  - `--card`: `0 0% 100%`
  - `--popover`: `0 0% 100%`
  - `--primary`: `0 0% 9%`
  - `--primary-foreground`: `0 0% 98%`
  - `--secondary`: `0 0% 96.1%`
  - `--muted`: `0 0% 96.1%`
  - `--muted-foreground`: `0 0% 45.1%`
  - `--accent`: `0 0% 96.1%`
  - `--border`: `0 0% 89.8%`
- Dark Mode (`.dark`):
  - `--background`: `0 0% 3.9%`
  - `--foreground`: `0 0% 98%`
  - `--card`: `0 0% 3.9%`
  - `--popover`: `0 0% 3.9%`
  - `--primary`: `0 0% 98%`
  - `--primary-foreground`: `0 0% 9%`
  - `--muted`: `0 0% 14.9%`
  - `--muted-foreground`: `0 0% 63.9%`
  - `--border`: `0 0% 14.9%`

### 3.2 Component Utility & Provider
- `src/lib/utils.ts`: Standard `cn` helper (`clsx` + `tailwind-merge`).
- `src/components/theme-provider.tsx`: Client-side wrapper for `next-themes` provider.

### 3.3 Theme Toggle Component (`src/components/theme-toggle.tsx`)
- Client component using `useTheme()` hook from `next-themes`.
- Renders a clean icon button with `Sun` (light mode indicator) and `Moon` (dark mode indicator) with smooth transition animation.
- Embedded in desktop header and mobile menu in `src/app/page.tsx`.

---

## 4. Verification & Testing

1. Check initial page load: Ensure default renders in Light mode with neutral enterprise colors.
2. Toggle test: Click toggle button in desktop header & mobile drawer, verifying smooth transition to dark mode and back to light mode.
3. Refresh persistence test: Reload browser to ensure chosen mode persists without hydration flickering.
