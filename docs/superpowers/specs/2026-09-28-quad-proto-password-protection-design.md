# QuadraNG Prototype Password Protection Design Specification

**Date**: 2026-09-28  
**Topic**: Password Protection for `/quad-proto` Prototype & Static Assets (`Quadrang123!`)  
**Target Route**: `/quad-proto` and all sub-paths / assets  

---

## 1. Overview & Objectives

The directory `/public/quad-proto` hosts the static HTML/CSS/JS prototype for QuadraNG. To prevent unauthorized public access, all requests to `/quad-proto` (including index and sub-pages like `employee-detail.html`, `attendance.html`, as well as static assets within that directory) must require authentication with the password:
```
Quadrang123!
```

Once the user provides the correct password, a browser session cookie (`quad_proto_auth`) is issued, allowing uninterrupted access to the entire prototype until the browser is closed.

---

## 2. Architecture & Flow

```mermaid
sequenceDiagram
    autonumber
    actor User as Browser / User
    participant MW as Next.js Middleware
    participant Page as /quad-proto-access
    participant API as /api/quad-proto-auth
    participant Proto as /public/quad-proto

    User->>MW: GET /quad-proto/ (or sub-page)
    alt quad_proto_auth cookie is valid
        MW-->>User: Allow access -> Serve /quad-proto content
    else Cookie missing or invalid
        MW-->>User: 307 Redirect to /quad-proto-access?from=<original_path>
        User->>Page: Renders QuadraNG Access Page
        User->>API: POST /api/quad-proto-auth { password }
        alt Password == "Quadrang123!"
            API-->>User: Set-Cookie: quad_proto_auth=<token>; HttpOnly; SameSite=Lax
            User->>MW: Redirect to original_path (with cookie)
            MW-->>User: Allow access -> Serve prototype
        else Password incorrect
            API-->>User: 401 Unauthorized { error: "Password salah" }
            Page-->>User: Show red alert in card
        end
    end
```

---

## 3. Middleware Configuration (`src/middleware.ts`)

1. **Target Route Interception**:
   - Check if `pathname.startsWith("/quad-proto")`.
   - Exclude the login page `/quad-proto-access` and API route `/api/quad-proto-auth`.
2. **Static Asset Matching**:
   - Update `config.matcher` in `middleware.ts` so requests to `/quad-proto/*` are not bypassed by the generic static asset regex.
   - For `/quad-proto` requests, intercept before the `pathname.includes(".")` bypass.
3. **Session Verification**:
   - Read cookie `quad_proto_auth`.
   - Validate token against server-side signature/hash: `sha256("Quadrang123!" + SECRET)`.
   - If invalid/absent, redirect to `/quad-proto-access?from=${encodeURIComponent(pathname + search)}`.

---

## 4. UI Specification (`src/app/quad-proto-access/page.tsx`)

Following the exact visual aesthetic of the QuadraNG prototype (`public/quad-proto/login.html`):
- **Background**: `#F7F7F7` full screen, centered layout.
- **Card**: Clean white `#FFFFFF`, width `440px`, padding `48px 40px 40px`, `box-shadow: 0 2px 12px rgba(0,0,0,0.08)`.
- **Typography**: Inter font, dark headings `#111827`, subtle subtexts `#6B7280`.
- **Header**:
  - Globe vector icon (QuadraNG branding).
  - Title: **QuadraNG Prototype Access**.
  - Subtitle: *"Akses prototipe ini diproteksi. Masukkan password otorisasi untuk membuka."*
- **Form Controls**:
  - Label: *"Password Prototipe"*
  - Password input with toggle visibility eye icon.
  - Primary button: Solid QuadraNG orange-red (`#E04A2A`, hover `#c93d21`), with lock icon and loading spinner.
  - Error banner: Clean red inline notification when password fails.
- **Footer**:
  - Link to return to main portfolio: *"← Kembali ke Portfolio"*.

---

## 5. API Route Specification (`src/app/api/quad-proto-auth/route.ts`)

- **Method**: `POST`
- **Payload**: `{ password: string }`
- **Validation**:
  - Compare `password.trim()` strictly with `"Quadrang123!"`.
  - On match:
    - Generate secure auth token: `sha256("Quadrang123!:" + AUTH_SECRET)`.
    - Set cookie `quad_proto_auth`:
      - `httpOnly: true`
      - `sameSite: "lax"`
      - `secure: process.env.NODE_ENV === "production"`
      - `path: "/"`
      - **No `maxAge` or `expires`** (Session cookie, cleared upon browser close).
    - Return `NextResponse.json({ success: true })`.
  - On mismatch:
    - Return `NextResponse.json({ success: false, message: "Password salah. Silakan coba lagi." }, { status: 401 })`.

---

## 6. Security & Edge Cases

1. **Open Redirect Defense**:
   - The `from` query parameter is sanitized to ensure it starts with `/quad-proto`. External domains (e.g. `//evil.com`) are rejected and default to `/quad-proto`.
2. **Direct File URL Protection**:
   - Access to `/quad-proto/base.css`, `/quad-proto/dropdown.js`, or sub-pages like `/quad-proto/employee-detail.html` cannot be fetched without the valid session cookie.
3. **Session Lifetime**:
   - Strictly tied to the user's browser session. Closing the browser clears the cookie, ensuring clean security after demo sessions.

---

## 7. Verification Plan

1. **Initial Access Blocked**:
   - Open `/quad-proto` directly in a fresh incognito/private session -> Must redirect to `/quad-proto-access?from=%2Fquad-proto`.
2. **Sub-page Direct Access Blocked**:
   - Open `/quad-proto/employee-detail.html` -> Must redirect to `/quad-proto-access?from=%2Fquad-proto%2Femployee-detail.html`.
3. **Incorrect Password Rejection**:
   - Submit `WrongPassword` -> Error message displayed, form stays, cookie not set.
4. **Correct Password Authorization**:
   - Submit `Quadrang123!` -> Success response, cookie set, redirected to intended target URL.
5. **Session Expiry**:
   - Close browser or delete `quad_proto_auth` cookie -> Accessing `/quad-proto` triggers access block again.
6. **Lint & Build Check**:
   - Run `npm run build` to confirm zero TypeScript and Next.js compiler errors.
