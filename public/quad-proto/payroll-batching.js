/* payroll-batching.js — shared payroll batch derivation utility
 *
 * deriveBatches(salaryCutoff, employees) → Batch[]
 *
 * salaryCutoff : "YYYY-MM-DD" — transfer date for the salary batch
 * employees    : QUADRA_EMPLOYEES subset — used to collect allowance delivery days
 *
 * Returns an ordered array of batch objects:
 *   { id, type, transferDate, status }           — salary batch
 *   { id, type, deliveryDay, transferDate, status } — allowance batches
 *
 * Allowance batches are always in the month following the salary cutoff,
 * grouped by unique delivery day across all employees.
 */
function deriveBatches(salaryCutoff, employees) {
  var batches = [];

  /* ── 1. Salary batch ── */
  batches.push({
    id: 'salary',
    type: 'salary',
    transferDate: salaryCutoff,
    status: 'pending'
  });

  /* ── 2. Allowance batches — following month, one per unique delivery day ── */
  var parts  = (salaryCutoff || '').split('-');
  var yr     = parseInt(parts[0], 10);
  var mo     = parseInt(parts[1], 10);
  var nextMo = mo === 12 ? 1  : mo + 1;
  var nextYr = mo === 12 ? yr + 1 : yr;
  var lastDayOfNext = new Date(nextYr, nextMo, 0).getDate();

  var seen = {};
  (employees || []).forEach(function(emp) {
    (emp.allowances || []).forEach(function(a) {
      if (a.delivery && !seen[a.delivery]) seen[a.delivery] = true;
    });
  });

  var days = Object.keys(seen).sort(function(a, b) {
    return (a === 'last' ? 32 : parseInt(a, 10)) - (b === 'last' ? 32 : parseInt(b, 10));
  });

  days.forEach(function(day) {
    var d = day === 'last' ? lastDayOfNext : Math.min(parseInt(day, 10), lastDayOfNext);
    var transferDate = nextYr + '-'
      + String(nextMo).padStart(2, '0') + '-'
      + String(d).padStart(2, '0');
    batches.push({
      id: 'allowance-' + day,
      type: 'allowance',
      deliveryDay: day,
      transferDate: transferDate,
      status: 'pending'
    });
  });

  return batches;
}

/* fmtBatchDate("2026-07-01") → "1 Jul 2026" */
function fmtBatchDate(iso) {
  if (!iso) return '—';
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var p = iso.split('-');
  return parseInt(p[2], 10) + ' ' + months[parseInt(p[1], 10) - 1] + ' ' + p[0];
}
