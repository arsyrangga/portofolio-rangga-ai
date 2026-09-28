# Onboarding Step 2 — Error Cases & Edge Case Documentation

**File:** `onboarding-step2-work-info.html`  
**Purpose:** Handoff reference for dev team + Paper documentation  
**Last updated:** 2026-05-22

---

## Overview

Step 2 collects work information and bank details for a new employee. The form has two sections:

- **Work Details** — Department, Position, Direct Supervisor, Shift
- **Bank Information** — Bank Name, Account Number, Account Name

Two fields have specific validation logic beyond simple "required" checks: **Account Number** (numeric-only enforcement) and **Position** (dependent on Department selection). The **Bank Name** field uses a searchable combobox pattern. All other fields use standard required-field validation.

---

## Form Fields Summary

| Field | Type | Required | Special Behavior |
|---|---|---|---|
| Department | Dropdown | Yes | Drives Position options |
| Position | Dropdown | Yes | Disabled until Department selected; options filtered by Dept |
| Direct Supervisor | Dropdown | Yes | Standard |
| Shift | Dropdown | Yes | Standard |
| Bank Name | Searchable dropdown (combobox) | Yes | Type-to-filter in trigger |
| Account Number | Text input (numeric) | Yes | Letters/symbols blocked |
| Account Name | Text input | Yes | Standard |

---

## 1. Department & Position — Linked Dropdowns

### Case 1A — Position dropdown before Department is selected

**Trigger:** Page loads; no department has been selected yet

**Behavior:**
- Position dropdown is **disabled** — visually grayed out (`background: #F9FAFB`, `cursor: not-allowed`, `pointer-events: none`)
- Trigger label shows: *"Select department first"*
- Clicking the position dropdown does nothing

**UI state:** `.select-w.is-disabled` on `#position-sel`

---

### Case 1B — User selects a Department

**Trigger:** User picks any department from the Department dropdown

**Behavior:**
- Position dropdown **enables immediately**
- Trigger label resets to: *"Select position"*
- Options list is populated with positions belonging to that department only

**Department → Position mapping (prototype data):**

| Department | Available Positions |
|---|---|
| IT Department | Front End Developer, Quality Assurance, Back End Developer, Technical Writer |
| HR and GA | HR Umum, HR Finance |
| Finance | Finance Analyst, Payroll Staff, Tax Staff |
| Marketing | Brand Manager, Content Strategist, Digital Marketer |
| Operations | Logistics Coordinator, Fleet Coordinator, Warehouse Supervisor |
| Product | Product Manager, Product Designer, Business Analyst |
| Sales | Sales Executive, Account Manager, Sales Admin |

**Dev note:** Replace the `DEPT_POSITIONS` map with an API call:
`GET /api/departments/{deptId}/positions` returning `[{ id, name }]`.
Call on every `onChange` of the Department dropdown.

---

### Case 1C — User changes Department after Position was already selected

**Trigger:** User has already picked a position, then changes the department

**Behavior:**
- Position dropdown **resets** — selected value is cleared
- Trigger label returns to: *"Select position"*
- Options list is replaced with the new department's positions
- Previously selected position is discarded (no carry-over)

---

### Case 1D — Department and/or Position left empty on submit

Handled by standard required-field validation. Both fields carry `data-required="true"`. On **Submit/Next** click:
- Empty field border turns red
- Generic *"This field is required"* error appears below the field
- Page scrolls to the first invalid field

---

## 2. Bank Name — Searchable Combobox

The Bank Name field uses the **combobox pattern**: the trigger itself is a text `<input>` that doubles as both the display label and the live search box. There is no separate search input inside the dropdown panel.

### Case 2A — User types directly in the trigger to search

**Trigger:** User clicks the Bank Name trigger and types characters

**Behavior:**
- Dropdown panel opens
- Options are filtered in real-time as the user types (case-insensitive substring match)
- Non-matching options are hidden; matching ones remain visible
- If no options match, a *"No results found"* message appears in the panel

**Example:** Typing `"man"` → shows only *Bank Mandiri*

---

### Case 2B — User types but does not select an option, then clicks away

**Trigger:** User types in the search field but clicks outside without picking an option

**Behavior:**
- After a 150 ms delay (to allow option clicks to register first), the input value **reverts** to the previously selected label
- If nothing was previously selected, the field restores the placeholder text
- All filtered options are reset to visible
- Dropdown closes

**Why:** Prevents a half-typed search string from appearing as the "selected" value.

---

### Case 2C — User presses Escape while searching

**Trigger:** `Escape` key is pressed while the dropdown is open

**Behavior:**
- Input value reverts immediately to the previously selected label (or placeholder)
- All filtered options are reset to visible
- Dropdown closes

---

### Case 2D — Field left empty on submit

Handled by standard required-field validation (`data-required="true"`).

---

### Available bank options (prototype data)

BCA, Bank Mandiri, BNI, BRI, CIMB Niaga, Danamon, BSI

**Dev note:** Replace the static list with `GET /api/banks` (or a static config file if the list is fixed). The `searchable: true` option in `QuadraDropdown.init` enables the combobox pattern — no changes to dropdown logic needed when swapping data source.

---

## 3. Account Number Field

### Case 3A — User types letters or symbols

**Trigger:** Any non-digit key is pressed in the Account Number field

**Behavior:**
- On `keydown`: key is blocked immediately — character never appears in the field
- Error appears below the field:

> *Account number must contain numbers only.*

- Allowed keys that are not blocked: `Backspace`, `Delete`, `Tab`, `Enter`, `ArrowLeft`, `ArrowRight`, `Home`, `End`, and any `Ctrl/Cmd` key combo (to allow copy-paste operations)

---

### Case 3B — User pastes mixed content

**Trigger:** User pastes a string containing letters, spaces, or symbols (e.g. `"1234-5678"` or `"ABC123"`)

**Behavior:**
- On `input` event: non-digit characters are **stripped** from the pasted value
- The field retains only the numeric portion (e.g. `"1234-5678"` → `"12345678"`)
- Error appears:

> *Account number must contain numbers only.*

- Error clears as soon as the field contains only digits

---

### Case 3C — Field left empty on submit

Handled by standard required-field validation.

---

### Dev note — Account Number format

There is currently **no minimum or maximum length** validation on Account Number in the prototype. Indonesian bank account numbers vary by bank (8–16 digits typically). In production, consider adding per-bank length validation or a general range check (e.g. min 8, max 16 digits). Use `inputmode="numeric"` (already set) to show the numeric keyboard on mobile.

---

## 4. Standard Required-Field Validation (All Fields)

All seven fields carry `data-required="true"`. The shared `validateForm()` function checks them on **Submit** (HR Umum role) or **Next** (HR Finance role) click.

### Behavior on submit with empty fields

- Every empty field:
  - Input/textarea: `value.trim() === ''`
  - Dropdown/date picker: no `dataset.selectedValue` present
- For each empty field:
  - Border turns red (`.error` class)
  - *"This field is required"* message appears below
- Page **scrolls to the first invalid field** (`scrollIntoView({ behavior: 'smooth', block: 'center' })`)
- Form navigation is **blocked** (no page change occurs)
- Error clears on the next `input` event for text fields, or on valid selection for dropdowns

---

## 5. Cancel Flow — Unsaved Data Guard

### Case 5A — User clicks Cancel with data entered

**Trigger:** User clicks the **Cancel** button after entering any value in any field

**Behavior:**
- A **confirmation modal** appears:

  > *"Cancel Onboarding?"*
  > *"You have unsaved changes. Canceling now will discard all entered data for this employee."*

  - **Keep Editing** → closes modal, stays on page
  - **Yes, Cancel** → navigates to `onboarding-employee-list.html` (all data lost)

---

### Case 5B — User clicks Cancel with no data entered

**Trigger:** User clicks **Cancel** before filling in any field

**Behavior:**
- No modal appears
- Navigates directly to `onboarding-employee-list.html`

**Detection logic:** `hasFormData()` checks for any non-empty text input and any dropdown/date with a selected value. If all are empty, skip the confirmation.

---

## 6. Role-Based Form Behavior

The primary action button and wizard steps change based on the logged-in user's role (read from `localStorage.getItem('quadra_role')`).

| Role | Button label | On valid submit | Wizard shows |
|---|---|---|---|
| `hr-umum` | Submit | → `onboarding-employee-list.html` | Steps 1–2 only |
| `hr-finance` | Next | → `onboarding-step3-contract.html` | All 6 steps |

**Dev note:** Replace `localStorage` role check with a session/JWT claim. The wizard step visibility (`wiz-finance` class) should be driven server-side or from the auth context.

---

## Error UI Components

| Component | Class | Trigger | Color |
|---|---|---|---|
| Field required error | `.err-msg.show` | Empty on submit | Red `#EF4444` |
| Inline validation error | `.err-msg.show` | Non-numeric input | Red `#EF4444` |
| Field border error state | `input.error` / `.select-w.error` | Any error | Red border `#EF4444` |
| Disabled dropdown | `.select-w.is-disabled` | Position before dept | Gray bg, no pointer events |
| No-results state | `.select-no-results` | Search with no match | Gray `#9CA3AF` centered |

---

## Validation Trigger Summary

| Field | On typing | On blur | On Submit/Next click |
|---|---|---|---|
| Department | — | — | Required check + scroll |
| Position | Disabled until dept | — | Required check + scroll |
| Direct Supervisor | — | — | Required check + scroll |
| Shift | — | — | Required check + scroll |
| Bank Name | Live search filter | Restore prev label | Required check + scroll |
| Account Number — letters | Blocked (keydown) / stripped (paste) + error | — | Required check + scroll |
| Account Name | — | — | Required check + scroll |

---

## Dev Implementation Notes

1. **Department→Position linking** — Currently uses a client-side `DEPT_POSITIONS` map. In production, fire `GET /api/departments/{id}/positions` on each department `onChange`. The position dropdown uses direct panel DOM manipulation (not QuadraDropdown re-init) — replace the `updatePositionOptions` body with the API response mapped to option elements.

2. **Bank Name searchable combobox** — Uses `QuadraDropdown.init(el, options, { searchable: true })`. The combobox pattern (trigger = search input) is built into `dropdown.js`. No additional library needed. Swap static array for API/config as needed.

3. **Account Number** — `inputmode="numeric"` is set for mobile UX. Validation is purely client-side. No server-side format check is implemented in the prototype.

4. **Role-based routing** — `localStorage.getItem('quadra_role')` returns `'hr-umum'` or `'hr-finance'`. Replace with a real auth mechanism. The `wiz-finance` class hides steps 3–6 from HR Umum users.

5. **`setError(field, message)`** — accepts an optional `message` parameter; falls back to `'This field is required'` if omitted. Works on both plain `<input>` and `.select-w` wrapper elements.

6. **`validateForm()`** — single pass over all `[data-required]` elements. Scroll target is the first `.form-col` ancestor of the first failing field.
