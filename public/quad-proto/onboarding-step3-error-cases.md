# Onboarding Step 3 — Error Cases & Edge Case Documentation

**File:** `onboarding-step3-contract.html`  
**Purpose:** Handoff reference for dev team + Paper documentation  
**Last updated:** 2026-05-22

---

## Overview

Step 3 collects contract and compensation details. It is **accessible to HR Finance only** — HR Umum users are redirected away on page load. The form contains five input fields:

| Field | Type | Required | Special Behavior |
|---|---|---|---|
| Work Type | Dropdown | Yes | Drives Contract Duration enable/disable |
| Contract Duration | Number input | Conditional | Disabled for Karyawan Tetap; negative/zero blocked |
| Filling Status (PTKP) | Dropdown | Yes | Standard |
| Base Salary | Text input (IDR) | Yes | Negative blocked; auto-detects salary level |
| Joining Date | Calendar picker | Yes | Drives End Date calculation |
| End Date | Read-only display | — | Auto-calculated; never a user input |

---

## 1. Work Type & Contract Duration — Linked Fields

### Case 1A — Work Type: Karyawan Tetap selected

**Trigger:** User selects *"Karyawan Tetap"* from the Work Type dropdown

**Behavior:**
- Contract Duration field is **disabled** visually (`.duration-field.disabled`): grayed background, `cursor: not-allowed`
- The number input's `disabled` attribute is set — keyboard and click interaction is fully blocked
- Any previously entered duration value is **cleared**
- End Date display resets to **"—"**

**Why:** Karyawan Tetap (permanent employees) do not have a fixed-term contract end date.

---

### Case 1B — Switching from Karyawan Tetap to another work type

**Trigger:** User selects any work type other than *Karyawan Tetap* after having previously selected it

**Behavior:**
- Contract Duration field **re-enables** (`.disabled` class removed, `disabled` attribute removed)
- Input is blank — user must re-enter the duration
- End Date remains "—" until both duration and joining date are set

---

### Case 1C — Work Type left empty on submit

Handled by standard required-field validation. Error message: *"This field is required."*

---

## 2. Contract Duration Field

### Case 2A — User types a negative value (minus sign)

**Trigger:** User presses the `-` key in the Contract Duration input

**Behavior:**
- The keystroke is **blocked immediately** (`e.preventDefault()`) — the character never appears in the field
- Error appears below the field:

> *Contract duration cannot be negative.*

---

### Case 2B — Negative value via browser behavior

**Trigger:** On some browsers, `type="number"` fields allow the minus sign to be entered via other means (e.g., spin buttons going below 0 if `min` is not enforced natively, or certain IME inputs)

**Behavior:**
- On `input` event: if `parseInt(value) < 0`, the error is shown immediately:

> *Contract duration cannot be negative.*

- The field is not auto-corrected — user must manually fix the value

---

### Case 2C — User types zero

**Trigger:** User types `0` in the duration field

**Behavior:**
- On `input` event: immediate error:

> *Contract duration must be at least 1 month.*

---

### Case 2D — User types `e` or `+`

**Trigger:** `type="number"` natively accepts `e` (scientific notation, e.g. `1e3`) and `+` as valid characters

**Behavior:**
- Both `e` and `+` are **blocked at keydown** — they never appear in the field
- No error message shown (silent block, since these are clearly nonsensical for a duration field)

---

### Case 2E — Field left empty on submit

**Trigger:** User clicks **Next** without entering a duration (and Work Type is not Karyawan Tetap)

**Behavior:**
- Error border on the input wrapper
- Error message: *"This field is required."*
- Page scrolls to the field

---

### Case 2F — Duration is valid (≥ 1)

Error clears automatically once the user enters a value `≥ 1`.

---

### Dev note — Duration range

The prototype sets `min="1" max="36"` on the HTML input. HTML `min`/`max` on `type="number"` do not prevent typing out-of-range values — they only affect native browser form submit (not used here). In production, add explicit server-side validation. Consider whether the 36-month max should be configurable per work type (e.g. PKWT is legally capped at 24 months, renewable once).

---

## 3. Base Salary Field

The Base Salary field is `type="text"` with an IDR prefix. An `input` handler formats the value with thousands separators (dots) as the user types, e.g. `5000000` → `5.000.000`.

### Case 3A — User types the minus sign

**Trigger:** User presses `-` in the Base Salary field

**Behavior:**
- Keystroke is **blocked immediately** (`e.preventDefault()`)
- Error appears:

> *Base salary cannot be negative.*

---

### Case 3B — User pastes a negative or non-numeric string

**Trigger:** User pastes text like `"-5.000.000"`, `"five million"`, or `"5,000,000"` into the field

**Behavior:**
- The `input` formatter strips all non-digit characters (`.replace(/\D/g, '')`)
- The field retains only the numeric portion silently (e.g. `"-5000000"` → `"5.000.000"`)
- No error is shown — the value is silently corrected to a valid positive number
- If all characters are non-numeric and result in an empty string, the field clears

**Why no error for paste:** The formatter's stripping always yields a valid or empty result. Showing an error for paste that auto-corrects would be confusing UX.

---

### Case 3C — Typing valid digits after seeing the negative error

**Trigger:** Error from Case 3A is showing; user types a digit

**Behavior:**
- Error clears on the next `input` event as soon as any character is present in the field

---

### Case 3D — Salary level auto-detection

**Trigger:** User enters any numeric salary value

**Behavior:**
- A **level badge** appears below the field automatically, indicating the salary band:

| IDR Range | Level |
|---|---|
| < 5.000.000 | Level 1 — Staff |
| 5.000.000 – 7.999.999 | Level 2 — Senior Staff |
| 8.000.000 – 11.999.999 | Level 3 — Specialist / Supervisor |
| 12.000.000 – 19.999.999 | Level 4 — Manager |
| ≥ 20.000.000 | Level 5 — Senior Manager / Director |

- Badge is hidden when field is empty
- This is **informational only** — it does not block submission

---

### Case 3E — Field left empty on submit

Error message: *"This field is required."*

---

### Dev note — Salary format

The formatter uses `.` as the thousands separator (Indonesian convention). The raw numeric value for API submission must strip the dots before sending: `value.replace(/\./g, '')`. The field stores the formatted display value, not the raw integer.

---

## 4. Joining Date & End Date

### Case 4A — User selects a Joining Date

**Trigger:** User clicks a day in the calendar picker

**Behavior:**
- Joining Date label updates to the selected date (e.g. *"15 June 2025"*)
- End Date is **auto-calculated** immediately: Joining Date + Contract Duration months − 1 day
- Example: Joining Date = 1 June 2025, Duration = 12 → End Date = 31 May 2026
- End Date is a **read-only display** — it has no input and is never editable

---

### Case 4B — End Date shows "—"

End Date shows a dash whenever any of these conditions are true:
- Joining Date has not been selected yet
- Contract Duration is empty or < 1
- Work Type is *Karyawan Tetap* (duration is disabled)

---

### Case 4C — User changes Contract Duration after Joining Date is set

**Trigger:** Joining Date is already selected; user changes the duration value

**Behavior:**
- End Date **recalculates in real-time** on every keystroke in the duration field
- If duration becomes invalid (empty, 0, negative), End Date resets to "—"

---

### Case 4D — Joining Date left empty on submit

Error message: *"This field is required."*

---

### Calendar picker behavior

The Joining Date picker is a three-view calendar (days → months → years):
- Clicking the **month name** in the header switches to months view
- Clicking the **year** in the header switches to years view
- No date restrictions — any valid date can be selected (past, today, or future)

**Note:** Unlike the DOB picker in Step 1, Joining Date has **no disabled dates**. Future joining dates are valid.

---

## 5. Filling Status (PTKP) Field

Standard required dropdown. No special validation beyond the required check.

**Available options:** TK/0, TK/1, TK/2, TK/3, K/0, K/1, K/2, K/3, HB/0

**Dev note:** These are Indonesian tax status codes (PTKP = Penghasilan Tidak Kena Pajak). Definitions:
- `TK` = Tidak Kawin (unmarried), number = count of dependants
- `K` = Kawin (married), number = count of dependants
- `HB` = Hidup Berpisah (separated)

---

## 6. Standard Required-Field Validation (All Fields)

`validateStep3()` runs on **Next** click and checks all five required fields in order.

**On submit with empty fields:**
- Field border turns red
- Error message appears below
- Page **scrolls to the first invalid field**
- Navigation to Step 4 is blocked

Error clears on the next `input` / valid selection event.

---

## 7. Cancel Flow — Unsaved Data Guard

Same pattern as Step 2.

### Case 7A — Cancel with data entered

Confirmation modal appears:
> *"Cancel Onboarding? You have unsaved changes…"*
- **Keep Editing** → closes modal
- **Yes, Cancel** → navigates to `onboarding-employee-list.html`

### Case 7B — Cancel with no data

Navigates directly to `onboarding-employee-list.html` without a modal.

---

## 8. Role-Based Access

Step 3 is **HR Finance only**. On page load:
```javascript
if (localStorage.getItem('quadra_role') === 'hr-umum') {
  window.location.replace('onboarding-employee-list.html');
}
```
HR Umum users are redirected immediately — they never see this form.

**Dev note:** Replace `localStorage` role check with a server-side auth guard (middleware or JWT claim check). The redirect should happen server-side, not client-side, to prevent access by disabling JS.

---

## Error UI Components

| Component | Class | Trigger | Color |
|---|---|---|---|
| Field required error | `.err-msg.show` | Empty on submit | Red `#EF4444` |
| Inline validation error | `.err-msg.show` | Negative / zero value | Red `#EF4444` |
| Input wrapper error | `.duration-input-w.error` / `.salary-input-w.error` | Any error on that field | Red border `#EF4444` |
| Disabled duration field | `.duration-field.disabled` | Karyawan Tetap selected | Gray bg, no interaction |
| Salary level badge | `.level-badge.visible.level-N` | Any salary value entered | Colored badge (informational) |

---

## Validation Trigger Summary

| Field | On typing | On blur | On Next click |
|---|---|---|---|
| Work Type | — | — | Required check + scroll |
| Contract Duration — negative | Blocked (keydown) / error (input) | — | Error + scroll |
| Contract Duration — zero | Immediate error (input) | — | Error + scroll |
| Contract Duration — empty | — | — | Required check + scroll |
| Contract Duration — `e`/`+` | Blocked (keydown, silent) | — | — |
| Filling Status | — | — | Required check + scroll |
| Base Salary — minus | Blocked (keydown) + error | — | — |
| Base Salary — letters/paste | Stripped silently (input) | — | — |
| Base Salary — empty | — | — | Required check + scroll |
| Joining Date | — | — | Required check + scroll |

---

## Dev Implementation Notes

1. **Contract Duration range** — `min="1" max="36"` is set as HTML attributes but is only a hint. Enforce `1 ≤ duration ≤ 36` explicitly in both client JS and server-side validation. PKWT has a legal maximum of 24 months (renewable once); consider per-work-type max validation in production.

2. **End Date calculation** — `new Date(year, month + duration, day)` then subtract 1 day. JS `Date` handles month overflow automatically (e.g. month = 13 → rolls into next year). Verify this calculation server-side on submit.

3. **Base Salary raw value** — The field displays `5.000.000` but the API should receive `5000000`. Strip dots before submission: `salaryInput.value.replace(/\./g, '')`.

4. **Salary level tiers** — Currently hardcoded in `SALARY_LEVELS`. In production, these thresholds may be configurable. Consider driving them from a config endpoint.

5. **PTKP options** — Currently a static list. In production, verify against the current tax year's PTKP table from DJP (Direktorat Jenderal Pajak), as values change periodically.

6. **Role guard** — `localStorage.getItem('quadra_role')` is client-side only. Move the access check to server middleware. Never rely on client-side redirects as a security boundary.

7. **`validateStep3()`** — Checks fields in DOM order: Work Type → Duration → Filling Status → Salary → Joining Date. Scroll goes to the first failing field's `.form-col` ancestor.
