/* Loan / Advance Salary seed data.
   empBadge references QUADRA_EMPLOYEES[].badge from employees-data.js.
   deductionSource: 'salary' | 'allowance' | 'salary+allowance'
   status: 'active' | 'overdue' | 'completed'
*/
var LOANS_SEED_VERSION = 1;

var QUADRA_LOANS_SEED = [];

var QUADRA_LOANS = (function() {
  try {
    var v = parseInt(localStorage.getItem('QUADRA_LOANS_V') || '0');
    if (v === LOANS_SEED_VERSION) {
      var raw = localStorage.getItem('QUADRA_LOANS');
      if (raw) return JSON.parse(raw);
    }
    /* Migrate from old lowercase key (payroll-loan.html used 'quadra_loans') */
    var legacy = localStorage.getItem('quadra_loans');
    if (legacy) {
      var parsed = JSON.parse(legacy);
      if (Array.isArray(parsed) && parsed.length) {
        localStorage.removeItem('quadra_loans');
        return parsed;
      }
    }
  } catch(e) {}
  return QUADRA_LOANS_SEED.map(function(l) { return Object.assign({}, l); });
})();

function saveLoans() {
  try {
    localStorage.setItem('QUADRA_LOANS', JSON.stringify(QUADRA_LOANS));
    localStorage.setItem('QUADRA_LOANS_V', String(LOANS_SEED_VERSION));
  } catch(e) {}
}

/* Auto-flag overdue loans based on current date. Runs on every page load. */
(function() {
  var now = new Date();
  var nowY = now.getFullYear(), nowM = now.getMonth();
  var changed = false;
  QUADRA_LOANS.forEach(function(loan) {
    if (loan.status !== 'active') return;
    var parts = loan.startDate.split(' ');
    var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    var startM = months.indexOf(parts[0]);
    var startY = parseInt(parts[2]);
    if (isNaN(startM) || isNaN(startY)) return;
    var elapsed = (nowY - startY) * 12 + (nowM - startM);
    var due = Math.min(loan.tenor, elapsed);
    if (due <= 0) return;
    var ded = loan.tenor > 0 ? Math.ceil(loan.total / loan.tenor) : 0;
    if (ded > 0 && Math.floor(loan.paid / ded) < due) {
      loan.status = 'overdue';
      changed = true;
    }
  });
  if (changed) saveLoans();
})();
