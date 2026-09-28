# List Employee — Error Cases & Edge Case Documentation

**File:** `employees-list.html`  
**Purpose:** Handoff reference for dev team + Paper documentation  
**Last updated:** 2026-05-22

---

## Overview

The List Employee page displays all registered employees in a paginated, filterable table. Key features covered in this document:

| Feature | Description |
|---|---|
| Search | Real-time name / badge ID search |
| Filter dropdowns | Project, Status, Contract — AND logic, combinable |
| Empty state | Dynamic message + Reset filters button |
| Pagination | Page navigation + rows-per-page selector |
| Row click | Click anywhere on a row to open employee detail |
| Checkbox selection | Select individual or all rows on current page |
| Selection bar | Count display + Export Selected when ≥1 row is checked |
| Export to .xlsx | Exports filtered list or selected rows via SheetJS |

---

## 1. Filter System

### 1.1 Filter Logic — AND (Intersection)

All active filters are applied simultaneously using AND logic. An employee is only shown if they satisfy **all** active filters at once.

**Example:** Status = *Inactive* + Contract = *PKWTT* → only employees who are both Inactive AND on PKWTT contract are shown. An employee who is Inactive but on PKWT is excluded.

**Dev note:** Enforce the same AND logic server-side. The client-side `Array.filter()` chain returns `false` as soon as any condition fails — replicate with `WHERE status = ? AND contract_type = ?` in the query.

---

### Case 1.1A — Single filter active

**Trigger:** User selects one filter (e.g. Status = *Active*)

**Behavior:**
- Table re-renders immediately showing only employees matching the selected value
- Filter button border turns red/orange (`.has-value` class) to indicate an active filter
- `currentPage` resets to 1
- "Showing X–Y of Z employees" updates accordingly

---

### Case 1.1B — Multiple filters active simultaneously

**Trigger:** User selects two or more filters (e.g. Project = *QuadraNG* + Contract = *PKWTT*)

**Behavior:**
- Only employees matching **all** active filters are shown
- Each active filter button shows the red/orange border independently
- Results update on every filter change — no Apply button needed

---

### Case 1.1C — Filter combination yields zero results

**Trigger:** Active filters together match no employee in the dataset

**Behavior:**
- All data rows are cleared from the DOM
- Empty state appears with a dynamic message:

  > *"No employees found for [Filter A] and [Filter B]."*

  - Example: *"No employees found for Inactive and PKWTT."*
  - If no named filter is active (search only): *"No employees match the selected filter combination."*
- **Reset filters** button appears below the message
- Table footer (pagination + rows-per-page) is hidden
- Clicking **Reset filters** clears all filters + search, restores dropdown labels to defaults, resets to page 1, and re-renders the full list

**Dev note:** The dynamic message is built from the `filters` object at render time. In production, map filter values to human-readable labels if the raw API value differs from the display label (e.g. `contract_type: "pkwtt"` → display *"PKWTT"*).

---

### Case 1.1D — Filter changed while on a non-first page

**Trigger:** User is on page 3, then changes a filter

**Behavior:**
- `currentPage` is reset to 1 before re-rendering
- Prevents showing an empty page when the new filtered result set has fewer pages

---

### Case 1.1E — Clicking outside an open filter dropdown

**Trigger:** Filter dropdown is open; user clicks anywhere else on the page

**Behavior:**
- All open `.filter-dropdown` panels close immediately via the `document` click listener
- No filter value is changed

---

## 2. Search

### Case 2A — Search by name (partial match)

**Trigger:** User types in the search box

**Behavior:**
- Matches against `name` (case-insensitive, substring match)
- Filters update on every keystroke — no Enter needed
- `currentPage` resets to 1 on each keystroke

---

### Case 2B — Search by Badge ID

**Trigger:** User types a numeric string matching a badge ID

**Behavior:**
- Matches against `badge` field (case-insensitive substring)
- Works simultaneously with active dropdown filters (AND logic)

---

### Case 2C — Search + filter combined

**Trigger:** User has a filter active and also types in search

**Behavior:**
- Both conditions apply: employee must match the search string AND all active dropdown filters
- Example: search = *"rin"* + Status = *Active* → shows only Active employees whose name contains "rin"

---

## 3. Empty State

### Case 3A — Empty state with named filters

**Dynamic message format:**
> *"No employees found for [value1] and [value2]."*

Values included in the message: search query (in quotes), project, status, contract — any that are currently active.

---

### Case 3B — Reset filters button

**Trigger:** User clicks **Reset filters** in the empty state

**Behavior:**
- `filters` object reset to `{ search: '', project: '', status: '', contract: '' }`
- Search input cleared
- All dropdown labels return to their defaults (*All Project*, *All Status*, *All Contract*)
- Active (`.has-value`) class removed from all filter buttons
- All dropdown option `.active` states reset to the "All" option
- `currentPage` reset to 1
- Table re-renders with all employees

---

## 4. Row Interaction

### Case 4A — Row click navigates to employee detail

**Trigger:** User clicks anywhere on a data row

**Behavior:**
- `window.location.href = 'employee-detail.html'` is triggered via `onclick` on `<tr>`
- Cursor is `pointer` on all `tbody tr` rows

**Dev note:** In production, pass the employee ID in the URL: `employee-detail.html?id=<badge>` or use a route like `/employees/<id>`. The current prototype uses a hardcoded destination.

---

### Case 4B — Checkbox click does not trigger row navigation

**Trigger:** User clicks the checkbox in the first column

**Behavior:**
- `event.stopPropagation()` prevents the row click from firing
- Only the checkbox toggles; no navigation occurs

---

### Case 4C — View button click does not double-navigate

**Trigger:** User clicks the eye icon in the Actions column

**Behavior:**
- `event.stopPropagation()` on the button prevents the row click
- Navigation fires once from the button handler only

---

## 5. Checkbox Selection

### Case 5A — Select individual row

**Trigger:** User checks a single row's checkbox

**Behavior:**
- Employee's `badge` is added to `selectedBadges` Set
- Selection bar appears at the top of the table: *"1 employee selected"*
- Header checkbox becomes `indeterminate` if not all rows on the page are selected

---

### Case 5B — Deselect individual row

**Trigger:** User unchecks a previously checked row

**Behavior:**
- Employee's `badge` is removed from `selectedBadges`
- Selection count decrements
- If count reaches 0, selection bar hides
- Header checkbox returns to unchecked (not indeterminate)

---

### Case 5C — Select all rows on current page

**Trigger:** User checks the header checkbox (`#check-all`)

**Behavior:**
- All visible rows on the current page are checked
- All their badges are added to `selectedBadges`
- Header checkbox `indeterminate` is cleared, `checked = true`
- Selection bar shows total selected count

**Note:** Check-all only affects the **current page** — not all filtered results across all pages. Employees selected on page 1 remain selected when navigating to page 2.

---

### Case 5D — Deselect all rows (header checkbox)

**Trigger:** User unchecks the header checkbox when all rows are checked

**Behavior:**
- All visible rows unchecked
- Their badges removed from `selectedBadges`
- If no other pages have selections, selection bar hides

---

### Case 5E — Clear selection button

**Trigger:** User clicks **Clear selection** in the selection bar

**Behavior:**
- `selectedBadges` Set is cleared entirely (across all pages)
- All visible checkboxes unchecked
- Header checkbox unchecked, `indeterminate` cleared
- Selection bar hides

---

### Case 5F — Page change preserves selections from other pages

**Trigger:** User checks rows on page 1, navigates to page 2

**Behavior:**
- Selections from page 1 are preserved in `selectedBadges` (in-memory Set)
- On re-render of page 2, each row checks `selectedBadges.has(badge)` to restore its checked state
- Selection bar count reflects total across all pages

**Dev note:** `selectedBadges` is a client-side Set that lives for the page session only. It is not persisted to `localStorage`. Refreshing the page clears all selections.

---

### Case 5G — Selection bar with count display

**Trigger:** `selectedBadges.size > 0`

**Behavior:**
- Bar appears between the filter bar and the table
- Background: `#FFF7F5`, border: `#FBBCAD` (warm orange tint)
- Count text: *"N employee(s) selected"* (singular/plural handled)
- **Export Selected to .xlsx** button appears on the right side of the bar

---

## 6. Export

### Case 6A — Export all filtered results (no selection)

**Trigger:** User clicks **Export to .xlsx** in the filter bar (no rows checked)

**Behavior:**
- All employees matching the current filters are exported (not just the current page)
- SheetJS generates and downloads `employees.xlsx`
- Columns: Name, Email, Badge ID, Project, Position, Contract, Join Date, Status

**Dev note:** The export reads from the `EMPLOYEES` array filtered by the current `filters` object — same logic as `renderTable()`. In production, trigger a server-side export endpoint to ensure fresh data (`GET /employees/export?project=...&status=...`). Client-side export from a local array is prototype-only.

---

### Case 6B — Export selected rows only

**Trigger:** User has ≥1 row checked and clicks **Export Selected to .xlsx** in the selection bar (or the filter bar Export button)

**Behavior:**
- Only employees whose `badge` is in `selectedBadges` are exported, regardless of current page or filter state
- Same column structure as Case 6A
- File name: `employees.xlsx`

**Priority logic:** If `selectedBadges.size > 0`, export uses selected badges. If 0, export uses current filter. Both the filter bar button and the selection bar button call the same `exportXlsx()` function.

---

### Case 6C — Export with no data (all filtered out)

**Trigger:** Filters produce zero results; user somehow triggers export

**Behavior (current prototype):** Export runs but generates a file with only the header row (no data rows). No error or block.

**Dev note:** In production, disable the Export button when `filtered.length === 0` and show a tooltip: *"No data to export."*

---

## 7. Pagination

### Case 7A — Rows per page change

**Trigger:** User selects a different value in the "Rows per page" dropdown (10 / 25 / 50 / 100)

**Behavior:**
- `PAGE_SIZE` updates to the selected value
- `currentPage` resets to 1
- Table re-renders with the new page size
- Pagination buttons recalculate accordingly

---

### Case 7B — Filter reduces total pages below current page

**Trigger:** User is on page 3; applies a filter that returns fewer than `(3 × PAGE_SIZE)` results

**Behavior:**
- `currentPage` is clamped: `if (currentPage > totalPages) currentPage = totalPages`
- User is automatically moved to the last valid page

---

### Case 7C — Smart ellipsis in pagination

**Trigger:** Total pages > 7

**Behavior:**
- Always shows page 1 and last page
- Shows current page ± 1 neighbor
- `…` appears between page 1 and the window, and between the window and the last page, when applicable
- Example (page 5 of 10): `1 … 4 5 6 … 10`

---

### Case 7D — Previous / Next arrow disabled states

| Condition | Prev arrow | Next arrow |
|---|---|---|
| On page 1 | `disabled` (opacity 0.35) | Enabled |
| On last page | Enabled | `disabled` |
| Only 1 page total | `disabled` | `disabled` |

---

## 8. UI Components

| Component | Class / ID | Trigger | Visual |
|---|---|---|---|
| Active filter button | `.filter-btn.has-value` | Filter value selected | Red/orange border |
| Empty state row | `#empty-state` | `filtered.length === 0` | Centered icon + title + sub + reset button |
| Empty state message | `#empty-sub` | Dynamic per active filters | Gray `#9CA3AF` text |
| Reset filters button | `.empty-reset` | Inside empty state | Red `#E04A2A` underline text |
| Selection bar | `#selection-bar.show` | `selectedBadges.size > 0` | Warm orange tint bar |
| Selection count | `#selection-count` | Any row checked | *"N employees selected"* |
| Header checkbox indeterminate | `#check-all` | Partial page selection | Native browser indeterminate state |
| Table footer | `#table-footer` | Results > 0 | Hidden when empty state shown |
| Row hover | `tbody tr:hover td` | Mouse over row | `#FAFAFA` background |

---

## Dev Implementation Notes

1. **Filter logic is client-side AND** — `EMPLOYEES.filter()` returns `false` on the first unmatched condition. In production, map to SQL `WHERE` clauses or query params. Never trust client-side filter state as the source of truth.

2. **`selectedBadges` is a `Set` of badge strings** — persists across page changes within the session but is lost on refresh. In production, use a server-side selection state or re-query with selected IDs for bulk actions.

3. **Check-all is per-page only** — the header checkbox selects/deselects visible rows on the current page only. A "Select all X results" affordance (like Gmail's) is not implemented in the prototype. Add this if bulk operations on all filtered results are required.

4. **Export uses SheetJS (`xlsx@0.18.5`)** — loaded from CDN (`cdnjs.cloudflare.com`). In production, use a server-side export endpoint to guarantee data freshness and avoid CORS/CDN dependency. Strip dots from IDR values before export if salary data is included in future columns.

5. **Row removal before empty state check** — `tbody.querySelectorAll('tr:not(#empty-state)')` is always called before the `filtered.length === 0` early return. This prevents stale rows from persisting when a filter combination yields zero results.

6. **`insertAdjacentHTML('beforeend', rowsHtml)`** — rows are appended inside `<tbody>` after the static `#empty-state` row. The empty-state row is never touched by innerHTML assignment, ensuring `getElementById('empty-state')` always returns a valid element.

7. **Row click navigation** — `onclick="window.location.href='employee-detail.html'"` is on the `<tr>`. Both the checkbox and the view button use `event.stopPropagation()` to prevent double-navigation. In production, use `data-id` on the `<tr>` and construct the URL from it.

8. **Rows per page selector** — updates `PAGE_SIZE` variable directly. In production, persist the user's preference to `localStorage` (key: `quadra_employees_page_size`) so it survives refresh.

9. **`total-label` subtitle** — currently hardcoded to `"47 employees total"`. In production, update this from the API response's total count, not from the filtered count (it should always show the full dataset size, not the filtered subset).
