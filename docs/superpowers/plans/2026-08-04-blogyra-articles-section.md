# Blogyra Articles Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fetch articles from `https://blogyra.site/api/blog/articles` via a Next.js server proxy route `/api/articles` and render a minimalist Articles section between Certificates and Contact on `src/app/page.tsx`.

**Architecture:** Create Next.js App Router API proxy at `src/app/api/articles/route.ts` with Authorization header. Update `src/app/page.tsx` to fetch `/api/articles`, display a 6-article grid with Linear/Stripe styling, and add "Articles" to top navbar navigation.

**Tech Stack:** Next.js 15 App Router, React 19, Lucide React icons, Tailwind CSS v4.

## Global Constraints

- **API Token Security**: Authorization token handled inside `/api/articles/route.ts`.
- **Design System**: Linear/Stripe minimal aesthetic (`bg-card`, `border border-border`, `shadow-xs`, `rounded-xl`).
- **Article Link**: `https://blogyra.site/blog/${article.slug}`.

---

### Task 1: Create API Proxy Route `src/app/api/articles/route.ts`

**Files:**
- Create: `src/app/api/articles/route.ts`

- [ ] **Step 1: Create Next.js API proxy route**

```ts
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("https://blogyra.site/api/blog/articles", {
      headers: {
        Accept: "application/json, text/plain, */*",
        Authorization:
          "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJibG9neXJhIiwiZXhwIjoxNzg1Mzc0MzA0fQ.H4Zt7uCQbyAb7sT60cZGKwuSoNGL0RtU04U1DKYRC5k",
        "User-Agent":
          "Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36",
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch articles from Blogyra" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error fetching articles" },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 2: Commit Task 1**

```bash
git add src/app/api/articles/route.ts
git commit -m "feat: add API proxy route for Blogyra articles"
```

---

### Task 2: Integrate Articles Section and Navbar Links in `src/app/page.tsx`

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Update Navbar items to include `"articles"`**

Change navigation list from `["home", "about", "projects", "certificates", "contact"]` to `["home", "about", "projects", "certificates", "articles", "contact"]`.

- [ ] **Step 2: Add Articles state, fetch effect, and section component in `src/app/page.tsx`**

Add `articles` state, fetch from `/api/articles`, and render Articles section between Certificates and Contact:

```tsx
{/* Articles Section */}
<section id="articles" className="py-20 bg-background">
  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <div
      className={`text-center mb-16 transition-all duration-700 ${
        visibleSections.has("articles")
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-6"
      }`}
    >
      <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-3">
        Latest Articles
      </h2>
      <p className="text-muted-foreground max-w-2xl mx-auto text-base">
        Insights, technical guides, and thought leadership published on Blogyra.
      </p>
    </div>

    {/* Articles Grid */}
    ...
  </div>
</section>
```

- [ ] **Step 3: Test build**

Run: `npm run build`
Expected: Build passes with zero errors.

- [ ] **Step 4: Commit Task 2**

```bash
git add src/app/page.tsx
git commit -m "feat: add Articles section fetching from Blogyra API"
```
