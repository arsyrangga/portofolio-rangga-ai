# QuadraNG Prototype Password Protection Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement password protection requiring "Quadrang123!" to access `/quad-proto` prototype files and sub-routes, secured via Next.js Middleware and browser session cookies with a QuadraNG-themed access gate.

**Architecture:** Next.js middleware intercepts all `/quad-proto` requests (including static assets and sub-pages). If the `quad_proto_auth` session cookie is missing or invalid, the request is redirected to `/quad-proto-access`. A Next.js API route (`/api/quad-proto-auth`) validates the password `"Quadrang123!"` and issues an `HttpOnly` browser session cookie.

**Tech Stack:** Next.js 15 (App Router), TypeScript, Web Crypto / Node crypto, React 19, Tailwind CSS.

## Global Constraints
- Target password is strictly `"Quadrang123!"` (case-sensitive).
- Target path to protect is `/quad-proto` and all sub-paths (including `.html`, `.js`, `.css`, `.pdf`).
- Cookie name is `quad_proto_auth`.
- Cookie must be a browser session cookie (no `Max-Age` / `Expires`).
- Cookie flags: `HttpOnly`, `SameSite=Lax`, `Path=/`, `Secure` in production.
- UI theme: QuadraNG original style (`#F7F7F7` page, `#FFFFFF` card, `#E04A2A` action color, Inter font).
- Excluded paths from middleware redirect: `/quad-proto-access` and `/api/quad-proto-auth`.

---

### Task 1: Core Quadra Auth Utilities & Unit Tests

**Files:**
- Create: `src/lib/quad-auth.ts`
- Create: `src/lib/quad-auth.test.mjs`

**Interfaces:**
- Produces:
  - `QUAD_PROTO_PASSWORD: string`
  - `QUAD_AUTH_COOKIE_NAME: string`
  - `generateQuadAuthToken(): Promise<string>`
  - `verifyQuadAuthToken(token?: string | null): Promise<boolean>`

- [ ] **Step 1: Write the failing unit test**

Create `src/lib/quad-auth.test.mjs`:
```javascript
import test from "node:test";
import assert from "node:assert/strict";
import {
  QUAD_PROTO_PASSWORD,
  QUAD_AUTH_COOKIE_NAME,
  generateQuadAuthToken,
  verifyQuadAuthToken,
} from "./quad-auth.js";

test("QUAD_PROTO_PASSWORD matches specification", () => {
  assert.equal(QUAD_PROTO_PASSWORD, "Quadrang123!");
});

test("QUAD_AUTH_COOKIE_NAME is quad_proto_auth", () => {
  assert.equal(QUAD_AUTH_COOKIE_NAME, "quad_proto_auth");
});

test("generateQuadAuthToken generates valid signature", async () => {
  const token = await generateQuadAuthToken();
  assert.ok(typeof token === "string" && token.length > 20);

  const isValid = await verifyQuadAuthToken(token);
  assert.equal(isValid, true);
});

test("verifyQuadAuthToken rejects invalid tokens", async () => {
  assert.equal(await verifyQuadAuthToken(""), false);
  assert.equal(await verifyQuadAuthToken(null), false);
  assert.equal(await verifyQuadAuthToken("invalid-token-12345"), false);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test src/lib/quad-auth.test.mjs`
Expected: FAIL (module `./quad-auth.js` not found).

- [ ] **Step 3: Implement `src/lib/quad-auth.ts`**

Create `src/lib/quad-auth.ts`:
```typescript
export const QUAD_PROTO_PASSWORD = "Quadrang123!";
export const QUAD_AUTH_COOKIE_NAME = "quad_proto_auth";

const AUTH_SALT = "quad_proto_salt_98234_secure";

// Web Crypto compatible SHA-256 hash generator
export async function generateQuadAuthToken(): Promise<string> {
  const data = new TextEncoder().encode(`${QUAD_PROTO_PASSWORD}:${AUTH_SALT}`);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function verifyQuadAuthToken(token?: string | null): Promise<boolean> {
  if (!token || typeof token !== "string") {
    return false;
  }
  const expectedToken = await generateQuadAuthToken();
  return token === expectedToken;
}
```

- [ ] **Step 4: Transpile or run test with Node test runner to verify it passes**

Run: `node --experimental-strip-types --test src/lib/quad-auth.test.mjs` or verify via node test script.
Expected: PASS with 4 tests passed.

- [ ] **Step 5: Commit changes**

```bash
git add src/lib/quad-auth.ts src/lib/quad-auth.test.mjs
git commit -m "feat: add quad-auth utility and unit tests"
```

---

### Task 2: API Route for Authentication & Session Cookie

**Files:**
- Create: `src/app/api/quad-proto-auth/route.ts`

**Interfaces:**
- Consumes:
  - `QUAD_PROTO_PASSWORD`, `QUAD_AUTH_COOKIE_NAME`, `generateQuadAuthToken` from `src/lib/quad-auth`
- Produces:
  - `POST(request: Request): Promise<Response>`

- [ ] **Step 1: Implement `src/app/api/quad-proto-auth/route.ts`**

```typescript
import { NextResponse } from "next/server";
import {
  QUAD_PROTO_PASSWORD,
  QUAD_AUTH_COOKIE_NAME,
  generateQuadAuthToken,
} from "@/lib/quad-auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { success: false, message: "Password harus diisi." },
        { status: 400 }
      );
    }

    if (password.trim() !== QUAD_PROTO_PASSWORD) {
      return NextResponse.json(
        { success: false, message: "Password salah. Silakan coba lagi." },
        { status: 401 }
      );
    }

    const token = await generateQuadAuthToken();
    const response = NextResponse.json({ success: true });

    // Set browser session cookie (no maxAge / expires so it clears on browser close)
    response.cookies.set({
      name: QUAD_AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal." },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 2: Verify API route compilation**

Run: `npx tsc --noEmit`
Expected: 0 errors.

- [ ] **Step 3: Commit changes**

```bash
git add src/app/api/quad-proto-auth/route.ts
git commit -m "feat: add quad-proto auth API route with session cookie"
```

---

### Task 3: Middleware Interceptor for `/quad-proto` Routes & Assets

**Files:**
- Modify: `src/middleware.ts`

**Interfaces:**
- Consumes:
  - `QUAD_AUTH_COOKIE_NAME`, `verifyQuadAuthToken` from `src/lib/quad-auth`
- Produces:
  - Updated `middleware(req: NextRequest)` and `config.matcher`

- [ ] **Step 1: Update `src/middleware.ts`**

Update `src/middleware.ts` to:
1. Intercept any request where `pathname.startsWith("/quad-proto")`.
2. Check `quad_proto_auth` cookie via `verifyQuadAuthToken`.
3. If unauthenticated, redirect to `/quad-proto-access?from=${encodeURIComponent(target)}`.
4. Ensure matcher captures `/quad-proto` subpaths including static assets.

```typescript
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { QUAD_AUTH_COOKIE_NAME, verifyQuadAuthToken } from "@/lib/quad-auth";

export async function middleware(req: NextRequest) {
  const host = req.headers.get("host");
  const { pathname, search } = req.nextUrl;

  // 1. Quadra Prototype Protection
  if (pathname.startsWith("/quad-proto")) {
    const token = req.cookies.get(QUAD_AUTH_COOKIE_NAME)?.value;
    const isAuthenticated = await verifyQuadAuthToken(token);

    if (!isAuthenticated) {
      const fromUrl = pathname + search;
      const accessUrl = new URL("/quad-proto-access", req.url);
      accessUrl.searchParams.set("from", fromUrl);
      return NextResponse.redirect(accessUrl);
    }
  }

  // 2. Skip internal Next.js assets, static files, public assets, and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/assets") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // 3. Domain rewrites
  if (host === "siti-chan.rangga.click") {
    if (pathname === "/") {
      return NextResponse.rewrite(new URL("/siti-chan", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Include /quad-proto and everything under it (even with extensions)
    "/quad-proto/:path*",
    // Existing general matcher
    "/((?!_next/static|_next/image|assets|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|vrm|ico|css|js)$).*)",
  ],
};
```

- [ ] **Step 2: Verify type check**

Run: `npx tsc --noEmit`
Expected: 0 errors.

- [ ] **Step 3: Commit changes**

```bash
git add src/middleware.ts
git commit -m "feat: protect /quad-proto routes and assets in middleware"
```

---

### Task 4: QuadraNG Access Page UI (`/quad-proto-access`)

**Files:**
- Create: `src/app/quad-proto-access/page.tsx`

**Interfaces:**
- Calls: `POST /api/quad-proto-auth`
- Handles redirect to `from` param (validated to ensure starts with `/quad-proto`).

- [ ] **Step 1: Implement `src/app/quad-proto-access/page.tsx`**

Create `src/app/quad-proto-access/page.tsx` with:
- QuadraNG authentic design (`#F7F7F7` page, `#FFFFFF` card, `#E04A2A` button, globe icon).
- Show/hide password eye icon toggle.
- Error banner when incorrect password submitted.
- Auto-redirect upon success to `from` destination.
- Return to portfolio button.
- Wrapped in `React.Suspense` for Next.js App Router query parameter handling.

```tsx
"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Lock, AlertCircle, ArrowLeft } from "lucide-react";

function AccessForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const rawFrom = searchParams.get("from");
  
  // Prevent open-redirect vulnerabilities
  const destination = rawFrom && rawFrom.startsWith("/quad-proto") ? rawFrom : "/quad-proto";

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!password) {
      setError("Silakan masukkan password.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/quad-proto-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Redirect to intended prototype path
        window.location.href = destination;
      } else {
        setError(data.message || "Password salah. Silakan coba lagi.");
        setLoading(false);
      }
    } catch (err) {
      setError("Gagal menghubungi server. Silakan coba lagi.");
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-[440px] bg-white rounded-[6px] shadow-[0_2px_12px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.04)] px-10 pt-12 pb-10">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-3 text-neutral-900">
          <svg width="32" height="32" viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="14" r="11.5" stroke="currentColor" strokeWidth="1.5" />
            <ellipse cx="14" cy="14" rx="5.5" ry="11.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M2.5 10h23M2.5 18h23" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        <h1 className="text-[22px] font-bold text-neutral-900 mb-2">QuadraNG Prototype</h1>
        <p className="text-[13px] text-neutral-500 leading-relaxed max-w-[280px] mx-auto">
          Akses prototipe ini diproteksi. Masukkan password otorisasi untuk membuka.
        </p>
      </div>

      {/* Error alert */}
      {error && (
        <div className="mb-5 p-3 rounded bg-red-50 border border-red-200 flex items-center gap-2.5 text-[13px] text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="password" className="block text-[13px] font-medium text-neutral-700 mb-2">
            Password Prototipe
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              autoFocus
              className="w-full h-10 px-3 pr-10 border border-neutral-300 text-neutral-900 text-[13px] outline-none focus:border-[#E04A2A] transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 transition-colors"
              aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 bg-[#E04A2A] hover:bg-[#c93d21] text-white text-[14px] font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-70 cursor-pointer"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Lock className="w-4 h-4" />
              <span>Buka Prototipe</span>
            </>
          )}
        </button>
      </form>

      {/* Back to portfolio */}
      <div className="mt-6 pt-5 border-t border-neutral-100 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[13px] text-neutral-500 hover:text-[#E04A2A] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Portfolio</span>
        </Link>
      </div>
    </div>
  );
}

export default function QuadProtoAccessPage() {
  return (
    <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center p-4 font-sans text-neutral-900">
      <Suspense fallback={<div className="text-neutral-500 text-sm">Loading...</div>}>
        <AccessForm />
      </Suspense>
    </div>
  );
}
```

- [ ] **Step 2: Verify type check**

Run: `npx tsc --noEmit`
Expected: 0 errors.

- [ ] **Step 3: Commit changes**

```bash
git add src/app/quad-proto-access/page.tsx
git commit -m "feat: add QuadraNG themed prototype access page"
```

---

### Task 5: End-to-End Verification & Build Check

**Files:**
- Test all components across the pipeline

- [ ] **Step 1: Run production build check**

Run: `npm run build`
Expected: Successful build with `/quad-proto-access` and `/api/quad-proto-auth` statically/dynamically generated without errors.

- [ ] **Step 2: Start dev or test server and verify protection using curl**

Run test requests:
1. `curl -I http://localhost:3000/quad-proto` (without cookie)
   - Expected: `307 Temporary Redirect` to `/quad-proto-access?from=%2Fquad-proto`.
2. `curl -I http://localhost:3000/quad-proto/employees-list.html` (without cookie)
   - Expected: `307 Temporary Redirect` to `/quad-proto-access?from=%2Fquad-proto%2Femployees-list.html`.
3. `curl -X POST http://localhost:3000/api/quad-proto-auth -H "Content-Type: application/json" -d '{"password":"wrong"}'`
   - Expected: HTTP 401 Unauthorized.
4. `curl -i -X POST http://localhost:3000/api/quad-proto-auth -H "Content-Type: application/json" -d '{"password":"Quadrang123!"}'`
   - Expected: HTTP 200 OK with `Set-Cookie: quad_proto_auth=...; Path=/; HttpOnly; SameSite=Lax`.
5. `curl -I http://localhost:3000/quad-proto --cookie "quad_proto_auth=<token>"`
   - Expected: HTTP 200 OK.

- [ ] **Step 3: Commit final updates (if any) and clean up test fixtures**

```bash
git status
```
