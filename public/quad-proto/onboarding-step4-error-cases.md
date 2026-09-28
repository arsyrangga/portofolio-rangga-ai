# Onboarding Step 4 — Error Cases & Edge Case Documentation

**File:** `onboarding-step4-allowance.html`  
**Purpose:** Handoff reference for dev team + Paper documentation  
**Last updated:** 2026-05-22

---

## Overview

Step 4 manages allowances for the new employee. It is **HR Finance only** — HR Umum users are redirected on page load. The form contains a fixed **Laptop** entry (always present) and optional additional allowance rows added dynamically. Each entry has three sub-sections:

| Sub-section | Fields |
|---|---|
| Row | Allowance type (dropdown) + Amount (Rp.) |
| Validity | Start date — End date (or No time limit) |
| Delivery | Day of month dropdown |

---

## 1. Amount Field — Numeric-Only Enforcement

All amount fields use `type="text"` with an `Rp.` prefix and a thousands-separator formatter (dots, Indonesian convention). The formatter runs on every `input` event and strips non-numeric characters automatically. Validation uses event delegation on `document`, covering both static (Laptop) and dynamically added rows.

### Case 1A — User types a letter or symbol (`a`, `b`, `!`, `@`, `#`, etc.)

**Trigger:** Any non-digit key that is not a navigation key

**Behavior:**
- Keystroke is **blocked immediately** (`e.preventDefault()`) — character never appears
- Error appears below the amount field:

> *Amount must contain numbers only.*

**Allowed keys that are never blocked:** `Backspace`, `Delete`, `Tab`, `Enter`, `ArrowLeft`, `ArrowRight`, `Home`, `End`, and any `Ctrl/Cmd` combo

---

### Case 1B — User pastes content containing letters or symbols

**Trigger:** User pastes a string like `"Rp. 500.000"`, `"5,000"`, `"abc"`, or `"500k"`

**Behavior:**
- Non-digit characters are **stripped** from the pasted value (formatter runs on `input`)
- The field retains only the numeric portion — e.g. `"Rp. 500.000"` → `"500000"` → formatted as `"500.000"`
- Error appears:

> *Amount must contain numbers only.*

- Error clears on the next valid keystroke

---

### Case 1C — User types the minus sign (`-`)

**Trigger:** User presses `-` in any amount field

**Behavior:**
- Keystroke is **blocked immediately**
- Error message is specific to the negative case:

> *Allowance amount cannot be negative.*

---

### Case 1D — User pastes a negative value (e.g. `-500000`)

**Trigger:** User pastes a string beginning with `-`

**Behavior:**
- The `-` is stripped by the formatter — value becomes `500000` → `"500.000"`
- Error appears with the negative-specific message:

> *Allowance amount cannot be negative.*

**Why separate message from 1B:** A negative amount has a clear semantic meaning (allowance must add to salary) vs. generic non-numeric input. The message is more instructive for the user.

---

### Case 1E — Amount field left empty on submit

**Trigger:** User clicks **Next** with an amount field blank (and the allowance row has a type selected)

**Behavior:**
- Amount wrapper border turns red (`.amount-input-w.error`)
- Section-level banner appears:

> *"Please fill in all required fields before continuing."*

- Page scrolls to the banner

---

### Case 1F — Laptop: Office radio selected

**Trigger:** User selects **Office** on the Laptop radio button

**Behavior:**
- Amount field is set to `0` and **disabled** (gray background, not editable)
- No amount validation is applied while the field is disabled
- If user switches back to **Personal**, field clears to blank and re-enables

**Why:** An office-owned laptop has no personal cost to the employee — the amount is always 0.

---

## 2. Validity — Date Range Validation

Each allowance entry has a Start date and End date picker. Both use a three-view calendar (days → months → years) and store their values in `dataset.selectedValue` as `"D Month YYYY"` (e.g. `"10 May 2024"`).

### Case 2A — End date is before Start date

**Trigger:** User selects an End date that is earlier than or equal to the already-selected Start date

**Behavior:**
- Both date fields turn red (`.dur-date-w.error`)
- Error message appears between the Validity row and the Delivery row:

> *End date must be after start date.*

**Also triggered:** If user changes Start date to a date on or after an already-set End date

**Clears when:** User picks a valid End date (after Start date), or changes Start date to before End date

---

### Case 2B — Start or End date left empty on submit

**Trigger:** User clicks **Next** with one or both date fields empty (and "No time limit" is not checked)

**Behavior:**
- Empty date field(s) border turns red
- Section-level error banner appears

---

### Case 2C — "No time limit" checkbox checked

**Trigger:** User checks the **No time limit** checkbox on an allowance entry

**Behavior:**
- **Start date** is automatically populated with the employee's **Joining Date** from Step 3 (read from `localStorage.quadra_joining_date`)
  - Example: if Joining Date = *"15 June 2025"*, Start date becomes *"15 June 2025"*
  - Start date field becomes **disabled** (grayed, not editable)
- **End date** is cleared (reverts to "End date" placeholder) and **disabled**
- Any existing date range error and red borders are cleared
- Validity dates are **excluded from required-field validation** on submit

**Why Start date = Joining Date:** A no-limit allowance applies from the employee's first working day with no expiry.

**Edge case — Joining date not yet set** (navigating to Step 4 without completing Step 3): Start date field is disabled but shows "Start date" placeholder (no auto-fill). No crash or error.

---

### Case 2D — "No time limit" checkbox unchecked

**Trigger:** User unchecks **No time limit** after it was checked

**Behavior:**
- Both date pickers re-enable
- Start date **retains** the previously auto-filled Joining Date value — user can edit it
- End date returns to blank — user must pick one
- Date range validation resumes

---

## 3. Allowance Type Selection

### Case 3A — No allowance type selected on submit

**Trigger:** User clicks **Next** when a dynamically added row has no allowance type selected (dropdown still showing placeholder)

**Behavior:**
- That row is **skipped entirely** during validation — no error, no block
- Only rows with a type selected are validated

**Why:** A row with no type selected is treated as an incomplete addition that the user hasn't committed to yet. The row remains on screen.

---

### Case 3B — Duplicate allowance type prevention

**Trigger:** User opens the allowance type dropdown on a new row

**Behavior:**
- Any allowance type already selected in another row is **excluded** from the options list for this row
- If an existing row's type is changed, the old type is returned to the pool and available again

**Available allowance types (prototype data):**
Transport Allowance, Meal Allowance, Health Allowance, Communication Allowance, Housing Allowance, Position Allowance, Performance Allowance

**Dev note:** The deduplication uses a client-side `Set`. In production, enforce uniqueness server-side per employee per effective period.

---

## 4. Delivery Schedule

Each entry has a **Delivery** dropdown: *"Every [day] of month"*. Options range from 1st to 31st, plus "Last day".

- Default: 1st of month
- No validation — any selection is valid
- No error cases implemented (optional field in current scope)

**Dev note:** Day-of-month values > 28 may not exist in all months (e.g. 31st in February). In production, add server-side handling to clamp to the last valid day of the month.

---

## 5. Standard Submit Validation (`validateStep4`)

Runs on **Next** click. Checks all entries that have a type selected (plus the Laptop entry which is always checked).

**Validation order per entry:**
1. Amount — not empty (if not disabled)
2. Validity start date — not empty (if no-limit unchecked)
3. Validity end date — not empty (if no-limit unchecked)
4. Date range — end > start (if both are set and no-limit unchecked)

**On failure:**
- All invalid fields get red borders simultaneously
- Section-level banner appears: *"Please fill in all required fields before continuing."*
- Page scrolls to the banner
- Navigation to Step 5 is blocked

**On success:** Navigates to `onboarding-step5-deduction.html`

---

## 6. Cancel Flow — Unsaved Data Guard

Same pattern as Steps 2–3.

### Case 6A — Cancel with data entered

Confirmation modal:
> *"Cancel Onboarding? You have unsaved changes…"*
- **Keep Editing** → closes modal
- **Yes, Cancel** → navigates to `onboarding-employee-list.html`

`hasFormData()` checks: any non-empty text input, any `.select-w` or `.dur-date-w` with a selected value, or more than one allowance entry (the Laptop row is always present — if a second row was added, that counts as data).

### Case 6B — Cancel with no data

Navigates directly without modal.

---

## 7. Role-Based Access

Step 4 is **HR Finance only**:
```javascript
if (localStorage.getItem('quadra_role') === 'hr-umum') {
  window.location.replace('onboarding-employee-list.html');
}
```

**Dev note:** Move to server-side middleware. Do not rely on client-side redirects as a security boundary.

---

## Error UI Components

| Component | Class | Trigger | Color |
|---|---|---|---|
| Amount field error | `.amount-input-w.error` | Empty on submit | Red border `#EF4444` |
| Amount inline message | `.amount-err-msg.show` | Non-numeric / negative input | Red `#EF4444` text |
| Date field error | `.dur-date-w.error` | Empty or invalid range | Red border `#EF4444` |
| Date range message | `.date-range-err.show` | End ≤ Start | Red `#EF4444` text |
| Section banner | `.section-err.show` | Any submit failure | Red background banner |

---

## Validation Trigger Summary

| Field / Rule | On typing | On date pick | On submit |
|---|---|---|---|
| Amount — letters/symbols | Blocked + error | — | — |
| Amount — minus sign | Blocked + specific error | — | — |
| Amount — paste with invalid chars | Stripped + error | — | — |
| Amount — empty | — | — | Red border + banner |
| Date range — end ≤ start | — | Immediate error + red borders | Red borders + banner |
| Date — empty | — | — | Red border + banner |
| No time limit checked | — | — | Validity skipped entirely |

---

## Dev Implementation Notes

1. **Event delegation** — Both the `keydown` (block keys) and `input` (format + validate) handlers are attached to `document` and filter by `.amount-input-w input`. This means validation works automatically for dynamically added rows without re-registering handlers.

2. **Amount raw value for API** — Fields display `500.000` but API should receive `500000`. Strip dots before submission: `value.replace(/\./g, '')`.

3. **Date format** — Stored as `"D Month YYYY"` (e.g. `"10 May 2024"`). `parseDateStr()` converts this to a JS `Date` for range comparison. The API should receive ISO format (`YYYY-MM-DD`) — convert on submit.

4. **Joining Date handoff** — Step 3 writes `localStorage.setItem('quadra_joining_date', value)` when the user picks a joining date. Step 4 reads it via `localStorage.getItem('quadra_joining_date')` when "No time limit" is checked. In production, pass this via session state or the API response rather than localStorage.

5. **Duplicate allowance prevention** — Uses a client-side `Set` (`usedAllowances`). It is updated on allowance type `onChange` and on row removal. In production, enforce uniqueness server-side.

6. **Delivery day > 28** — The prototype allows selecting 29th, 30th, 31st without restriction. In production, either restrict options to 28 or add "last day of month" fallback logic server-side.

7. **Laptop row** — Always present and cannot be removed. The Office/Personal radio toggle is unique to this row. All other rows use a type dropdown.
