# Light Mode & shadcn/ui Theme Toggle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate a light mode default with shadcn/ui neutral color palette design tokens and a theme toggle component in the desktop navbar and mobile navigation menu.

**Architecture:** Install `next-themes`, `clsx`, `tailwind-merge`. Configure CSS variables for shadcn neutral theme (Light default, Dark option) in `globals.css`. Wrap `layout.tsx` in a `ThemeProvider` client component, and insert a `ThemeToggle` button into the navbar and mobile drawer in `page.tsx`.

**Tech Stack:** Next.js 15, React 19, `next-themes`, Tailwind CSS v4, Lucide React icons.

## Global Constraints

- **Default Theme**: Light mode (`defaultTheme="light"`).
- **Style**: shadcn/ui Neutral color scale (`#ffffff` light, `#0a0a0a` dark).
- **Hydration**: `suppressHydrationWarning` on `<html>` to avoid React hydration mismatches.

---

### Task 1: Install Dependencies and Add `cn` Utility

**Files:**
- Modify: `package.json`
- Create: `src/lib/utils.ts`

- [ ] **Step 1: Install `next-themes`, `clsx`, and `tailwind-merge`**

Run: `npm install next-themes clsx tailwind-merge`
Expected: Success with updated `package.json`.

- [ ] **Step 2: Create utility file `src/lib/utils.ts`**

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 3: Commit Task 1**

```bash
git add package.json package-lock.json src/lib/utils.ts
git commit -m "feat: install next-themes, clsx, tailwind-merge and add cn utility"
```

---

### Task 2: Configure shadcn/ui Neutral CSS Tokens in `globals.css`

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Update `src/app/globals.css` with neutral palette variables**

Update `src/app/globals.css` to define shadcn neutral palette variables for `:root` and `.dark`:

```css
@import "tailwindcss";

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 9%;
    --card: 0 0% 100%;
    --card-foreground: 0 0% 9%;
    --popover: 0 0% 100%;
    --popover-foreground: 0 0% 9%;
    --primary: 0 0% 9%;
    --primary-foreground: 0 0% 98%;
    --secondary: 0 0% 96.1%;
    --secondary-foreground: 0 0% 9%;
    --muted: 0 0% 96.1%;
    --muted-foreground: 0 0% 45.1%;
    --accent: 0 0% 96.1%;
    --accent-foreground: 0 0% 9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 89.8%;
    --input: 0 0% 89.8%;
    --ring: 0 0% 9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 0 0% 3.9%;
    --foreground: 0 0% 98%;
    --card: 0 0% 3.9%;
    --card-foreground: 0 0% 98%;
    --popover: 0 0% 3.9%;
    --popover-foreground: 0 0% 98%;
    --primary: 0 0% 98%;
    --primary-foreground: 0 0% 9%;
    --secondary: 0 0% 14.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 0 0% 14.9%;
    --muted-foreground: 0 0% 63.9%;
    --accent: 0 0% 14.9%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 14.9%;
    --input: 0 0% 14.9%;
    --ring: 0 0% 83.1%;
  }
}

@theme inline {
  --color-background: hsl(var(--background));
  --color-foreground: hsl(var(--foreground));
  --color-card: hsl(var(--card));
  --color-card-foreground: hsl(var(--card-foreground));
  --color-popover: hsl(var(--popover));
  --color-popover-foreground: hsl(var(--popover-foreground));
  --color-primary: hsl(var(--primary));
  --color-primary-foreground: hsl(var(--primary-foreground));
  --color-secondary: hsl(var(--secondary));
  --color-secondary-foreground: hsl(var(--secondary-foreground));
  --color-muted: hsl(var(--muted));
  --color-muted-foreground: hsl(var(--muted-foreground));
  --color-accent: hsl(var(--accent));
  --color-accent-foreground: hsl(var(--accent-foreground));
  --color-destructive: hsl(var(--destructive));
  --color-destructive-foreground: hsl(var(--destructive-foreground));
  --color-border: hsl(var(--border));
  --color-input: hsl(var(--input));
  --color-ring: hsl(var(--ring));
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

body {
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
  font-family: var(--font-geist-sans), Arial, sans-serif;
}
```

- [ ] **Step 2: Commit Task 2**

```bash
git add src/app/globals.css
git commit -m "style: add shadcn neutral design tokens to globals.css"
```

---

### Task 3: Create `ThemeProvider` and `ThemeToggle` Components

**Files:**
- Create: `src/components/theme-provider.tsx`
- Create: `src/components/theme-toggle.tsx`

- [ ] **Step 1: Create `src/components/theme-provider.tsx`**

```tsx
"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
```

- [ ] **Step 2: Create `src/components/theme-toggle.tsx`**

```tsx
"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        type="button"
        className={`relative p-2 rounded-lg border border-border bg-background hover:bg-muted text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring ${
          className || ""
        }`}
        aria-label="Toggle theme"
      >
        <div className="w-5 h-5" />
      </button>
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`relative p-2 rounded-lg border border-border bg-background hover:bg-muted text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring ${
        className || ""
      }`}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-amber-500 transition-transform duration-300 rotate-0 scale-100" />
      ) : (
        <Moon className="w-5 h-5 text-slate-700 transition-transform duration-300 rotate-0 scale-100" />
      )}
    </button>
  );
}
```

- [ ] **Step 3: Commit Task 3**

```bash
git add src/components/theme-provider.tsx src/components/theme-toggle.tsx
git commit -m "feat: add ThemeProvider and enterprise ThemeToggle component"
```

---

### Task 4: Integrate ThemeProvider into Layout and ThemeToggle into Navigation

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Update `src/app/layout.tsx` to include `ThemeProvider`**

Add `suppressHydrationWarning` to `<html>` tag and wrap `children` inside `<ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>`.

- [ ] **Step 2: Integrate `ThemeToggle` into `src/app/page.tsx` desktop navbar and mobile drawer**

Import `ThemeToggle` from `@/components/theme-toggle` and place it in the navigation header bar and mobile menu drawer.

- [ ] **Step 3: Test build & compile**

Run: `npm run build`
Expected: Build passes cleanly with zero errors.

- [ ] **Step 4: Commit Task 4**

```bash
git add src/app/layout.tsx src/app/page.tsx
git commit -m "feat: integrate ThemeProvider in layout and ThemeToggle in navbar"
```
