// Shared by payroll-create-single.html, payroll-create-bulk.html, payroll-summary.html.
// Gates payroll creation on the employee's Timesheet being Approved for the matching period.
// Does NOT seed timesheet data — a period/badge with no timesheet record simply reads as
// not-approved (blocked), which is the correct default: no timesheet means nothing to approve yet.

var PAYROLL_TS_MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function payrollPeriodToTimesheetKeySuffix(periodLabel) {
  var parts = periodLabel.split(' ');
  var monthIdx = PAYROLL_TS_MONTHS.indexOf(parts[0]);
  var year = parts[1];
  var mm = (monthIdx + 1) < 10 ? '0' + (monthIdx + 1) : String(monthIdx + 1);
  return year + '-' + mm;
}

function getTimesheetStatusForPeriod(badge, periodLabel) {
  try {
    var key = 'quadra_timesheet_' + badge + '_' + payrollPeriodToTimesheetKeySuffix(periodLabel);
    var raw = localStorage.getItem(key);
    if (!raw) return null;
    var parsed = JSON.parse(raw);
    return parsed.status || null;
  } catch (e) { return null; }
}

function isTimesheetApprovedForPeriod(badge, periodLabel) {
  return getTimesheetStatusForPeriod(badge, periodLabel) === 'Approved';
}

function isPastTimesheetCutoff(periodLabel) {
  var parts = periodLabel.split(' ');
  var monthIdx = PAYROLL_TS_MONTHS.indexOf(parts[0]);
  var year = parseInt(parts[1], 10);
  var cutoff = new Date(year, monthIdx, 20, 23, 59, 59);
  return new Date() > cutoff;
}
