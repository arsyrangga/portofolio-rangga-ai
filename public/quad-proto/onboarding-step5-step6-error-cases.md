# Onboarding Step 5 & 6 — Error Cases & Edge Case Documentation

**Files:** `onboarding-step5-deduction.html`, `onboarding-step6-overtime.html`  
**Purpose:** Handoff reference for dev team + Paper documentation  
**Last updated:** 2026-05-22

---

## Part 1 — Step 5: Deduction

### Overview

Step 5 manages salary deductions. It is **HR Finance only**. The form is fully dynamic — there are no pre-existing rows. The user adds deduction entries via **+ Add Deduction**, each consisting of a deduction type dropdown and a **Paid By** radio button (Personal / Company / Spouse). There are **no amount fields** and **no submit-time validation** on this step — the Next button navigates directly to Step 6.

---

### 1.1 Deduction Type Selection

#### Case 1.1A — Duplicate deduction type prevention

**Trigger:** User opens the type dropdown on a new row

**Behavior:**
- Any deduction type already selected in another row is **excluded** from the options list for this row
- If a row's type is changed, the old type returns to the pool and becomes available again
- If a row is removed, its type returns to the pool

**Available deduction types (prototype data):**
BPJS Kesehatan, BPJS Ketenagakerjaan, PPh 21, Pinjaman Karyawan, Koperasi, Cicilan, Denda Keterlambatan, Asuransi Jiwa, Dana Pensiun

**Dev note:** Enforce uniqueness server-side per employee per payroll period.

---

#### Case 1.1B — Row added but no type selected on Next

**Trigger:** User clicks **+ Add Deduction**, leaves the dropdown at its placeholder, then clicks **Next**

**Behavior:**
- The incomplete row is **ignored entirely** — no error, no block
- Navigation to Step 6 proceeds normally
- The empty row remains on screen

**Why:** Consistent with Step 4 (Allowance) — uncommitted rows with no type selected are not validated.

---

### 1.2 Paid By Radio Buttons

Three options per row: **Personal**, **Company**, **Spouse**. Default: Personal.

- No validation — any selection is valid
- No error cases; the radio group always has a selected value (default: Personal)

---

### 1.3 No Submit Validation

Step 5 has **no `validateStep5()` function**. The Next button navigates directly to Step 6:
```html
<button class="btn btn-primary" onclick="window.location.href='onboarding-step6-overtime.html'">Next</button>
```

**Dev note:** In production, decide whether deduction entries require at least one row, or whether the step is truly optional. If required, add a `validateStep5()` that checks `#deduction-rows .allowance-row` count.

---

### 1.4 Cancel Flow

**Case 1.4A — Cancel with rows added:**
`hasFormData()` returns `true` if any `.allowance-row` exists inside `#deduction-rows`. Confirmation modal appears.

**Case 1.4B — Cancel with no rows:**
Navigates directly to `onboarding-employee-list.html`.

---

### 1.5 Role-Based Access

HR Finance only. HR Umum is redirected to `onboarding-employee-list.html` on page load.

---

### Step 5 — Error UI Components

| Component | Class | Trigger | Color |
|---|---|---|---|
| No per-field errors | — | Step has no submit validation | — |
| Cancel modal | `.modal-overlay.show` | Cancel with data present | Standard modal |

---

### Step 5 — Validation Trigger Summary

| Field / Rule | On interaction | On Next click |
|---|---|---|
| Deduction type | Duplicates filtered from options | Row ignored if no type |
| Paid By radio | Always has a default value | Never fails |
| Entire step | — | No validation — navigates directly |

---
---

## Part 2 — Step 6: Overtime

### Overview

Step 6 is the **final step** of the HR Finance onboarding flow. A successful submit sets `localStorage.quadra_onboarding_success = '1'` and navigates to `onboarding-employee-list.html`. The form has one required field (Overtime Type) that drives three conditional panels, each with its own set of fields and validation rules.

---

### 2.1 Overtime Type — Required Field

#### Case 2.1A — No overtime type selected on submit

**Trigger:** User clicks **Submit** without selecting an Overtime Type

**Behavior:**
- Overtime Type dropdown border turns red (`.select-w.error`)
- Error message appears below:

> *Overtime type is required.*

- Page scrolls to the error
- Navigation to employee list is blocked

---

### 2.2 Panel: Based on Grade / Level Range

**Trigger:** User selects *"Based on Grade/Level Range"*

**Behavior:**
- An informational blue note is shown:

> *"Overtime rate will be automatically calculated based on the employee's grade/level range and hours submitted. To configure grade-based overtime rates, go to Payroll → Level Range."*

- **No input fields, no validation required**
- Submit proceeds immediately if this panel is active

---

### 2.3 Panel: Specific Amount

**Trigger:** User selects *"Specific Amount"*

**Fields shown:** Overtime Rate (`IDR` prefix, `/hr` suffix)

#### Case 2.3A — Overtime Rate left empty on submit

**Trigger:** User selects Specific Amount but leaves the rate field blank

**Behavior:**
- Rate input wrapper border turns red (`.rate-input-w.error`)
- Error message appears below:

> *Overtime rate is required.*

---

#### Case 2.3B — Rate input formatting

The rate field uses `type="text"` with a thousands-separator formatter (Indonesian dot convention), identical to the salary field in Step 3.

- **Non-digit characters are stripped silently** on `input` event
- Raw value `5000000` displays as `5.000.000`
- Error (red border) clears as soon as the field has any value

**Dev note:** No explicit negative or non-numeric blocking is implemented on this rate field (unlike Step 3 and Step 4 amount fields). The formatter strips non-digits but does not show an error message. In production, consider adding the same `-` key block used in earlier steps.

**API note:** Strip dots before sending — `value.replace(/\./g, '')`.

---

### 2.4 Panel: No Overtime

**Trigger:** User selects *"No Overtime"*

**Behavior:**
- Amber warning note shown:

> *"This employee will not receive overtime pay even if overtime is submitted."*

- An **Overtime Override** section is shown below (toggle off by default)
- Submit proceeds with no additional validation if the override toggle is **off**

---

#### Case 2.4A — Override toggle OFF (default)

No additional fields are visible. Submit immediately succeeds if Overtime Type is selected.

---

#### Case 2.4B — Override toggle ON

**Trigger:** User enables the *"Enable overtime override for this employee"* checkbox

**Three new required field groups appear:**

1. **Override Rate** — IDR/hr amount input
2. **Override Period** — Start date and End date calendar pickers
3. **Overtime Hours** — From/To time range inputs (`type="time"`)

All three groups become **required** when the toggle is on.

---

#### Case 2.4C — Override Rate empty on submit

> *Override rate is required.*

Red border on `.rate-input-w#override-rate-w`.

---

#### Case 2.4D — Override Period dates empty on submit

**Trigger:** One or both date pickers have no value selected

**Behavior:**
- Empty date picker(s) get red border (`.dur-date-w.error`)
- A single shared error message appears below both pickers:

> *Override period dates are required.*

- Error clears on individual date picker when a date is selected

**Note:** No date range validation (end > start) is implemented for the Override Period in the current prototype. **Dev note:** Add the same `checkDateRange` logic used in Step 4 if needed.

---

#### Case 2.4E — Overtime Hours time range empty on submit

**Trigger:** One or both time inputs (`From` / `To`) have no value

**Behavior:**
- Empty time input(s) get red border (`.time-input-w.error`)
- Shared error message:

> *Overtime hours are required.*

- Error clears on individual time input when a time is selected

---

#### Case 2.4F — Overtime Hours calculation badge

**Trigger:** Both `From` and `To` time inputs have values

**Behavior:**
- A badge auto-calculates and displays the duration: e.g. *"2 hrs/day"* or *"1.5 hrs/day"*
- Badge text is `"— hrs/day"` when either field is empty
- Handles overnight ranges (e.g. 22:00 → 02:00 = 4 hrs) by adding 24 hours when `To < From`
- This is **informational only** — the badge never blocks submission

---

### 2.5 Conditional Validation Matrix

`validateStep6()` runs checks in this order:

| Check | Condition for check to run |
|---|---|
| Overtime type required | Always |
| Rate required | Only if type = Specific Amount |
| Override rate required | Only if type = No Overtime AND override toggle is ON |
| Override period dates required | Only if type = No Overtime AND override toggle is ON |
| Overtime hours required | Only if type = No Overtime AND override toggle is ON |

Fields in inactive panels (e.g. rate field when Grade/Level is selected) are **never validated** regardless of their state.

**On failure:**
- All failing fields are highlighted simultaneously
- Page scrolls to the first visible `.err-msg.show`
- Navigation to employee list is blocked

**On success:**
- `localStorage.setItem('quadra_onboarding_success', '1')` is written
- Navigates to `onboarding-employee-list.html`

---

### 2.6 Double Submission Prevention

#### Case 2.6A — User clicks Submit multiple times in rapid succession

**Trigger:** User clicks the **Submit** button more than once quickly (e.g. 3–5 clicks, common on slow connections)

**Behavior:**
- On the **first click**, the button is **immediately disabled** (`disabled` attribute set) and its label changes to a loading state with a spinner:

  > *[spinner] Submitting…*

- Any subsequent clicks are silently ignored (`if (submitBtn.disabled) return`)
- Button background turns muted (`#F3A594`) via `:disabled` CSS — visually signals it is inactive

**On validation failure:**
- The button is **re-enabled** and its label restored to *Submit*
- User can correct the errors and click again — a single retry cycle

**On validation success:**
- Button remains disabled for the duration of the navigation (no restore needed, page changes)
- `localStorage.quadra_onboarding_success = '1'` is written, then navigates to `onboarding-employee-list.html`

**Why:** Prevents duplicate employee records from being created when the API call takes a few seconds under a slow connection. The spinner also provides feedback that the action was registered.

**Dev note:** In production, the disable+spinner pattern must be matched server-side with an idempotency key (e.g. a UUID generated client-side on page load, sent as a request header). Client-side disable alone is not sufficient — a user can bypass it by refreshing or opening DevTools. The server must reject or deduplicate requests with the same key.

---

### 2.7 Cancel Flow

**Case 2.7A — Cancel with data entered:**
`hasFormData()` checks for any non-empty text input, any time input, or any dropdown/date with a selected value. Confirmation modal appears.

**Case 2.7B — Cancel with no data:**
Navigates directly to `onboarding-employee-list.html`.

---

### 2.8 Role-Based Access

HR Finance only. HR Umum is redirected on page load.

---

### Step 6 — Error UI Components

| Component | Class | Trigger | Color |
|---|---|---|---|
| Dropdown error | `.select-w.error` | Type not selected on submit | Red border `#EF4444` |
| Rate input error | `.rate-input-w.error` | Rate empty on submit | Red border `#EF4444` |
| Date picker error | `.dur-date-w.error` | Date empty on submit | Red border `#EF4444` |
| Time input error | `.time-input-w.error` | Time empty on submit | Red border `#EF4444` |
| Inline error message | `.err-msg.show` | Each failed field | Red `#EF4444` text |
| Duration badge | `.time-calc-badge.active` | Both time fields have values | Informational (no error) |
| Info note (blue) | `.info-box.info-box-blue` | Grade/Level panel active | Informational |
| Warning note (amber) | `.info-box.info-box-amber` | No Overtime panel active | Informational |
| Submit button — loading | `#submit-btn[disabled]` + `.btn-spinner` | First Submit click | Muted `#F3A594` bg + white spinner |

---

### Step 6 — Validation Trigger Summary

| Field / Rule | On typing/selection | On Submit click |
|---|---|---|
| Overtime Type | — | Required check + scroll |
| Overtime Rate (Specific) | Error clears on any value | Required check |
| Override Rate | Error clears on any value | Required if override ON |
| Override Period Start | Error clears on date pick | Required if override ON |
| Override Period End | Error clears on date pick | Required if override ON |
| Overtime Hours From | Error clears on time pick | Required if override ON |
| Overtime Hours To | Error clears on time pick | Required if override ON |
| Duration badge | Auto-calculates (informational) | Never blocks |

---

## Dev Implementation Notes

### Step 5

1. **No submit validation** — step is effectively optional in the prototype. Decide in production whether at least one deduction row is required.
2. **Deduction type pool** — uses a client-side `Set` (`usedDeductions`). Enforce uniqueness server-side per employee per payroll period.
3. **Paid By values** — `personal`, `company`, `spouse`. Map these to the appropriate payroll deduction source in the API.
4. **`rowCounter`** — increments per added row; used as the radio button `name` attribute to ensure each row's radios are independent. In production, use row IDs from the API response instead.

### Step 6

5. **Rate field missing negative/character block** — unlike Step 3 (Base Salary) and Step 4 (Allowance), the rate inputs in Step 6 only format on input (strip non-digits silently) without blocking `-` on keydown or showing an error. For consistency, add the same `keydown` guard used in earlier steps.
6. **Override Period — no date range check** — end date before start date is not caught. Add `parseDateStr` + `checkDateRange` (same logic as Step 4) if required.
7. **`quadra_onboarding_success` flag** — written to `localStorage` on successful submit. Used to trigger a success toast or state update on the employee list page. In production, replace with a server-side redirect or API response.
8. **Override toggle state** — the toggle is `type="checkbox"`. Override fields are shown/hidden via `.hidden` class toggle. Validation only runs when `overrideToggle.checked === true`. If the user fills in override fields, then unchecks the toggle, those fields are visually hidden but their DOM values persist — clear them server-side or on uncheck.
9. **`quadra_joining_date` from Step 3** — not used in Steps 5 or 6 directly, but remains in `localStorage` throughout the session.
10. **Double-submit guard** — `#submit-btn` is disabled on first click and its label replaced with a spinner + "Submitting…". Re-enabled only on validation failure. In production, pair this with a server-side idempotency key (generated on page load, sent as a request header) — client-side disable alone can be bypassed.

---

## Submit — Server-Side & Network Error Cases

> **Scope:** These cases are not implemented in the prototype. They are documented here as production requirements and UX expectations for the dev team.

---

### Case S1 — Backend Conflict: Email or NIK Already Registered (Race Condition)

**Trigger:** All 6 steps pass frontend validation. The API call is made. Between the user opening Step 1 and clicking Submit, another HR user registered the same email address or NIK (employee ID).

**Expected server response:** HTTP `409 Conflict` with a field-level error body, e.g.:
```json
{ "errors": { "email": "Email is already registered.", "nik": null } }
```

**Expected UI behavior:**
- Submit spinner stops; Submit button re-enables
- A **modal or inline banner** clearly names the conflicting field:
  > *"Email is already registered. Please go back to Step 1 to update it."*
- A **"Go to Step 1"** action button in the modal navigates to `onboarding-step1-personal-info.html`
- All other steps' data must **not** be cleared — only the conflicting field needs correction
- In production, step data should be stored in a server-side draft or a structured `localStorage` object (`quadra_draft`) keyed by step number. On returning to Step 1, the form should pre-fill from the draft.

**Why this matters:** Race conditions in HR systems are realistic — two HR officers may simultaneously onboard candidates with identical contact information. Crashing or clearing the form would force the HR user to re-enter all six steps from scratch.

---

### Case S2 — Network Timeout / Internet Disconnected

**Trigger:** User clicks Submit. The API request is sent but the connection drops or the server does not respond within the timeout window (recommended: 30 seconds).

**Expected UI behavior:**
- After timeout, Submit spinner stops; Submit button re-enables
- A non-blocking error notification (toast or banner) appears:
  > *"Connection failed. Please check your internet connection and try again."*
- Form data must remain fully intact — no fields cleared
- User can click Submit again once the connection is restored — no need to re-fill any step

**Dev note:** Set a `fetch` / `axios` timeout of 30 000 ms. On `AbortError` or network error, catch the exception and restore the submit button. Do NOT navigate away or clear `localStorage` draft on timeout.

---

### Case S3 — Session Expired (401 Unauthorized)

**Trigger:** User takes 45+ minutes filling Steps 1–6. By the time they click Submit, the auth token (JWT or session cookie) has expired. The API responds with HTTP `401 Unauthorized`.

**Expected UI behavior:**
1. Submit spinner stops
2. A modal appears:
   > *"Your session has expired. Please log in again — your progress has been saved."*
3. A **"Log In"** button in the modal navigates to the login page
4. Before navigating away, all form data from Steps 1–6 is **serialized and saved** to `localStorage` under a draft key (e.g. `quadra_draft_onboarding`)
5. After re-authentication, the onboarding flow should detect the draft and pre-fill all six steps automatically
6. On successful re-submit, the draft is cleared

**Dev note:** The draft save must happen *before* redirecting to login, not after. Token refresh (silent re-auth via refresh token) is the preferred approach if the auth system supports it — it avoids the UX interruption entirely. Handle `401` in the global API interceptor, not per-endpoint.

---

### Case S4 — Browser Refresh or Tab Closed During Submit

**Trigger:** User clicks Submit; the loading spinner is active (API call in flight). The user then:
- Presses **F5** (browser refresh), or
- Clicks the **× Close Tab** button

**Expected behavior and risk:**

| Scenario | Risk | Recommended backend behavior |
|---|---|---|
| Request reached server, not yet committed | Partial write (corrupted employee record) | Use a **database transaction** — all-or-nothing. Partial records must not persist. |
| Request reached server, fully committed | Data saved successfully; user just lost the success screen | Idempotency key prevents duplicate on re-submit |
| Request never reached server (dropped in transit) | No data written | Safe; user can re-submit |

**Dev note:** The prototype cannot control browser close events reliably. `beforeunload` can show a native browser prompt ("Leave site? Changes you made may not be saved.") during submission — set a flag when the spinner starts and clear it on success or failure. On production, the API must wrap the entire multi-step employee creation in a single database transaction. If any step (personal info, contract, allowance, deduction, overtime) fails, the entire record must be rolled back.

---

### Case S5 — Browser Back Button After Successful Submit

**Trigger:** Submit succeeds. User is on the Employee List page (`onboarding-employee-list.html`) with a success toast. User presses the browser's **← Back** button.

**Expected behavior:**
- The browser navigates back to `onboarding-step6-overtime.html` (last entry in history)
- The form **must not be re-submittable** — submitting again would create a duplicate employee record

**Required safeguards:**
1. **`localStorage.quadra_onboarding_success`** — already set to `'1'` on success. On `DOMContentLoaded` of Step 6, check this flag. If present, redirect immediately to `onboarding-employee-list.html` (or show a "This onboarding session is complete" state).
2. In production, use **`history.replaceState`** or a server-side redirect (HTTP `303 See Other`) after submit so the Step 6 URL is no longer in the browser history stack.
3. Alternatively, invalidate the onboarding session token server-side on success — any re-submit with the same token is rejected as `409 Already Completed`.

**Dev note:** The prototype currently has no back-navigation guard on Step 6. Add a page-load check:
```javascript
if (localStorage.getItem('quadra_onboarding_success') === '1') {
  window.location.replace('onboarding-employee-list.html');
}
```
This is a client-side safeguard only. The server must also reject re-submissions independently.
