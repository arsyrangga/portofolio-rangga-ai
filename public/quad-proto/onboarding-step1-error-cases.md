# Onboarding Step 1 — Error Cases & Edge Case Documentation

**File:** `onboarding-step1.html`  
**Purpose:** Handoff reference for dev team + Paper documentation  
**Last updated:** 2026-05-22

---

> **Note — Edit Personal Info (`employee-personal-edit.html`)**
>
> All validation behavior, error cases, and edge cases documented in this file apply **identically** to the Edit Personal Info page. The only structural differences are:
>
> - Fields are **pre-filled** with the employee's existing data (no empty starting state).
> - The unsaved-changes guard uses a **`dirty` flag** (set on first edit) instead of `hasFormData()` — because all fields have values from the start, checking for content would always return true.
> - The cancel/discard modal title reads *"Discard Changes?"* instead of *"Cancel Onboarding?"*.
> - On successful save, the page navigates back to `employee-detail.html#personal` instead of advancing to Step 2.
> - The Email field is **read-only** (not editable) — no local-part input or domain suffix is shown, only the current value.
> - The Badge ID field is **read-only**.
>
> All other rules — NIK numeric-only enforcement, phone digit range (8–13), DOB 18-year minimum, marital × children cross-field warning, same-as-KTP address sync, and submit-time required-field validation — behave exactly as described below.

---

## Overview

Step 1 collects personal information for a new employee. Four fields have specific validation logic beyond simple "required" checks: **Email**, **Phone Number**, **Date of Birth**, and **Badge ID**.

---

## 1. Email Field

### Layout
The email input only accepts the **local part** (before the `@`). The domain `@steradian.co.id` is a fixed suffix rendered as `input-suffix` text next to the field — it is not editable.

```
[ firstname.lastname ]  @steradian.co.id
```

---

### Case 1A — User types a full email address

**Trigger:** User types any character that includes `@` in the input (e.g. `budi@steradian.co.id`, `budi@gmail.com`, `budi@`)

**Behavior:**
- On `input` event, the value is immediately split at `@` — only the local part before `@` is kept
- The field value is updated in-place (e.g. `budi@gmail.com` → `budi`)
- A **yellow warning** appears below the field:

> *"@gmail.com" was removed — the domain is added automatically.*

or if only `@` was typed:

> *"@" removed — domain is added automatically as @steradian.co.id*

**Why this matters:** Because the suffix `@steradian.co.id` is always appended in the UI, typing a full email would produce a broken address like `budi@gmail.com@steradian.co.id`.

**UI component:** `.field-warn` (yellow, with warning icon) — ID `email-strip-warn`

---

### Case 1B — Email already registered to another employee

**Trigger:** User enters a local part that matches an existing employee's email, then leaves the field (`blur`) or clicks **Next**

**Behavior:**
- On `blur`: field border turns red, error message appears below:

> *budi.santoso@steradian.co.id is already registered to another employee.*

- On **Next** click: form submit is blocked, same error shown, page scrolls to field

**Mock registered emails (prototype data):**
`budi.santoso`, `sari.dewi`, `hendra.w`, `ahmad.fauzi`, `dewi.lestari`, `rendi.pratama`, `nurul.hidayah`, `bagas.setiawan`, `fitri.anggraini`, `dimas.kurniawan`, `ayu.ratnasari`, `fajar.mahendra`, `rina.susanti`, `teguh.prabowo`, `maya.indrawati`

**Dev note:** Replace the `REGISTERED` array with an async API call against the employee directory. Debounce on `blur` or after ~500ms idle.

**UI component:** `.err-msg` (red) — ID `email-err`

---

### Case 1C — Field left empty

Handled by the standard required-field validation. Not specific to email.

---

## 2. Phone Number Fields

Two fields share identical validation logic:
- **Phone Number** — primary contact (`id="phone-main"`)
- **Contact Phone** — emergency contact (`id="phone-contact"`)

### Allowed characters
`0–9`, `+`, `-`, `(`, `)`, space

### Case 2A — User types letters or unsupported characters

**Trigger:** Any letter (`a–z`, `A–Z`) or symbol not in the allowed set

**Behavior:**
- On `keydown`: letter keys are blocked immediately, error appears:

> *Phone number cannot contain letters.*

- On `input` (e.g. via paste): unsupported characters are stripped from the value, error appears:

> *Phone number cannot contain letters or special characters.*

- Error clears automatically once the field contains only valid characters

---

### Case 2B — Number too short

**Trigger:** User enters fewer than **8 significant digits** and leaves the field (`blur`) or clicks **Next**

**Behavior:**
- On `blur`: red error below field:

> *Phone number is too short — enter at least 8 digits.*

- On **Next** click: form blocked, scroll to field, same error

**Digit count logic:** Spaces, `+`, `-`, `(`, `)` are ignored — only numeric characters `0–9` are counted. So `+62 812` = 5 digits → too short.

---

### Case 2C — Number too long

**Trigger:** User enters more than **13 digits** (Indonesian mobile max)

**Behavior:**
- On `input`, red error immediately:

> *Phone number is too long (max 13 digits).*

---

### Case 2D — Field left empty

Handled by standard required-field validation.

---

## 3. Date of Birth Field

A custom three-view calendar picker (days → months → years). The field stores its value in `dateW.dataset.selectedValue`.

**Constraint:** Employee must be **at least 18 years old** on the date the form is submitted (`maxDate = today − 18 years`).

---

### Case 3A — Selecting a date that makes the employee underage or in the future

**Trigger:** User navigates to a month/year where some or all days are ≤ 18 years ago from today

**Behavior in days view:**
- Days after `maxDate` are rendered **grayed out** (`color: #D1D5DB`) and have `disabled` attribute — they cannot be clicked
- Hovering over a disabled day shows tooltip: *"Employee must be at least 18 years old"*
- Valid days in the same month remain selectable normally

**Visual distinction:**

| State | Color | Clickable |
|---|---|---|
| Valid day | `#111827` (dark) | Yes |
| Disabled day (too recent) | `#D1D5DB` (light gray) | No |
| Selected day | White on `#E04A2A` red | — |

---

### Case 3B — Navigating to a month where all days are invalid

**Trigger:** User tries to navigate forward (→) to a month whose **first day** is already past `maxDate`

**Behavior:**
- The **→ (next) arrow** in the days view is disabled (opacity 25%, not clickable)
- User cannot navigate into the restricted range at all

---

### Case 3C — Selecting a month in month view that is fully invalid

**Trigger:** User is in months view and hovers over a month after `maxDate`'s month in `maxDate`'s year (or any month in a year after `maxDate`'s year)

**Behavior:**
- Disabled month buttons are grayed out and cannot be selected
- The **→ (next year)** arrow is disabled once `current year ≥ maxDate year`

---

### Case 3D — Selecting a year in year view that is invalid

**Trigger:** User is in years view and tries to select a year after `maxDate`'s year

**Behavior:**
- Disabled year buttons are grayed out and cannot be selected
- The **→ (next range)** arrow is disabled once the next 12-year range would contain no valid years

---

### Persistent age note

A static note is always shown at the bottom of the open calendar panel:

> *Minimum working age: 18 years old*

Styled as small gray text (`font-size: 11px`, `color: #9CA3AF`) separated by a top border.

---

### Case 3E — Field left empty (no date selected)

Handled by standard required-field validation on **Next** click.

---

## 4. Badge ID Field

### Case 4A — User types letters or non-numeric characters

**Trigger:** Any non-digit key

**Behavior:**
- Blocked at `keydown` — character never appears in the field
- On paste of mixed content: non-digit characters stripped, error appears:

> *Badge ID must contain numbers only*

---

### Case 4B — Badge ID too short

**Trigger:** User enters fewer than **9 digits** and leaves the field or clicks **Next**

**Behavior:**
- On `input` (while typing, if length > 0): error appears immediately:

> *Badge ID must be at least 9 digits*

- On `blur`: same error if still < 9 digits
- On **Next**: form blocked

---

### Case 4C — Badge ID too long

**Trigger:** User tries to type beyond 12 characters

**Behavior:**
- `maxLength = 12` is set on the input — characters beyond 12 are silently blocked by the browser
- No error message needed (input physically stops accepting input)

---

## Error UI Components

| Component | Class | Trigger | Color |
|---|---|---|---|
| Field required error | `.err-msg.show` | Empty on submit | Red `#EF4444` |
| Inline validation error | `.err-msg.show` | Invalid format/length | Red `#EF4444` |
| Warning (non-blocking) | `.field-warn.show` | Email domain stripped | Amber `#D97706` |
| Field border error state | `.affix-w.error` / `input.error` | Any error | Red border `#EF4444` |
| Disabled calendar day | `button[disabled]` in `.calendar-panel` | Age restriction | Gray `#D1D5DB` |
| Disabled nav arrow | `button.cal-nav-btn[disabled]` | At range boundary | Opacity 25% |

---

## Validation Trigger Summary

| Field | On typing | On blur | On Next click |
|---|---|---|---|
| Email — domain strip | Immediate (strip + warn) | — | — |
| Email — duplicate | — | Check + error | Check + error + scroll |
| Phone — letters | Blocked (keydown) | — | — |
| Phone — too short | — | Error | Error + scroll |
| Phone — too long | Immediate error | — | — |
| DOB — underage days | Days disabled (can't click) | — | Required check only |
| Badge ID — letters | Blocked (keydown) | — | — |
| Badge ID — too short | Error while typing | Error | Error + scroll |
| Badge ID — too long | Blocked (maxLength) | — | — |

---

## Dev Implementation Notes

1. **Email duplicate check** — currently uses a hardcoded `REGISTERED` array. In production, replace with `fetch('/api/employees/check-email?local=' + encodeURIComponent(local))` debounced on `blur`. Return `{ taken: true/false }`.

2. **Phone digit counting** — strip all non-digit characters before counting: `(val.match(/\d/g) || []).length`. The `+62` prefix counts toward the digit total in the current implementation (8 digits minimum includes country code digits).

3. **DOB maxDate** — computed at page load as `new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())`. Recompute server-side on submit for security.

4. **All errors use shared helpers** `setError(field, message)` / `clearError(field)` defined in the inline `<script>` block. These handle both plain `<input>` elements and `.affix-w` wrapper elements.

5. **validateForm()** is patched by each IIFE via closure wrapping — the email and phone IIFEs both extend it. Execution order matters: email IIFE runs last, so its duplicate check runs after all other validations.
