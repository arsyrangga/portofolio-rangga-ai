# Articles Section & Blogyra API Integration Design Specification

**Date**: 2026-08-04  
**Topic**: Blogyra Articles API integration & Articles Section UI  

---

## 1. Overview

This specification details the addition of an **Articles** section to the portfolio website, fetching live articles from `https://blogyra.site/api/blog/articles` via a Next.js API route proxy. The section is styled according to Linear and Stripe minimalist design principles and placed between the Certificates and Contact sections.

---

## 2. Technical Architecture

### 2.1 API Route Proxy (`src/app/api/articles/route.ts`)
- Server-side handler forwarding GET requests to `https://blogyra.site/api/blog/articles`.
- Passes the Authorization header: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJibG9neXJhIiwiZXhwIjoxNzg1Mzc0MzA0fQ.H4Zt7uCQbyAb7sT60cZGKwuSoNGL0RtU04U1DKYRC5k`.
- Implements 60-second caching for fast load times.

### 2.2 UI Data Contract
Articles returned by the proxy:
```ts
interface Article {
  title: string;
  slug: string;
  description: string;
  category: string;
  date: string;
  thumbnail: string;
  tags: string[];
  views: number;
}
```

### 2.3 UI & Design System (`src/app/page.tsx`)
- **Placement**: Between Certificates section (`#certificates`) and Contact section (`#contact`).
- **Navbar Update**: Navigation item list updated to `["home", "about", "projects", "certificates", "articles", "contact"]`.
- **Card Design**:
  - Border: 1px subtle `border border-border`.
  - Card background: `bg-card text-card-foreground shadow-xs rounded-xl`.
  - Thumbnail: Image src `https://blogyra.site${article.thumbnail}` with fallback error handler.
  - Metadata: Date, Category badge (`bg-secondary text-secondary-foreground`), Views counter (`Eye` icon).
  - Target URL: External link to `https://blogyra.site/blog/${article.slug}`.
- **CTA Button**: "View All Articles on Blogyra" linking to `https://blogyra.site`.

---

## 3. Verification & Testing

1. Test API Proxy: `curl http://localhost:3000/api/articles` returns 200 with JSON array of articles.
2. Verify UI layout: Articles section renders 6 articles with thumbnails, categories, dates, and read links.
3. Test Navigation: Clicking "Articles" in header smooth-scrolls to the Articles section.
4. Run `npm run build` to verify clean build.
