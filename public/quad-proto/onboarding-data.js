var ONBOARDING_SEED_VERSION = 2;

var PREP_CHECKLIST_ITEMS = [
  'Company Culture Introduction (SDO / Client)',
  'Employment Contract Signed',
  'NDA Signed',
  'ID Card',
  'Laptop',
  'SDO Office Environment Introduction',
  'SDO-to-Client Accompaniment',
  'Client Office Environment Introduction',
  'Client Orientation',
  'QuadraNG Attendance Setup',
  'Laptop & Tools Setup',
  'Jira/Tempo Access Request'
];

var HR_CHECKLIST_TOTAL = 21;
var PREP_CHECKLIST_TOTAL = PREP_CHECKLIST_ITEMS.length;

/* Only one seeded employee (the most recently hired of the 11 real badges)
   is mid-onboarding; the rest joined a year-plus ago and seed as fully done. */
var ONBOARDING_PARTIAL_BADGE = '001228';
var ONBOARDING_HR_MISSING_FOR_PARTIAL = [19, 20];
var ONBOARDING_PREP_MISSING_FOR_PARTIAL = [7, 8, 11];
var ONBOARDING_PARTIAL_COMMENT = 'Still waiting on the client to schedule the office orientation session and grant Jira/Tempo access.';

var OB_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function obFmtDate(d) {
  return d.getDate() + ' ' + OB_MONTHS[d.getMonth()] + ' ' + d.getFullYear();
}

function obJoinPlusDays(joinStr, days) {
  var d = new Date(joinStr);
  d.setDate(d.getDate() + days);
  return obFmtDate(d);
}

function buildOnboardingSeedForEmployee(emp) {
  var isPartial = emp.badge === ONBOARDING_PARTIAL_BADGE;
  var hrMissing = isPartial ? ONBOARDING_HR_MISSING_FOR_PARTIAL : [];
  var prepMissing = isPartial ? ONBOARDING_PREP_MISSING_FOR_PARTIAL : [];

  var hrChecklist = {};
  for (var i = 0; i < HR_CHECKLIST_TOTAL; i++) {
    if (hrMissing.indexOf(i) !== -1) continue;
    hrChecklist[i] = { done: true, date: obJoinPlusDays(emp.join, i + 1) };
  }

  var prepChecklist = {};
  for (var j = 0; j < PREP_CHECKLIST_TOTAL; j++) {
    if (prepMissing.indexOf(j) !== -1) continue;
    prepChecklist[j] = { done: true, date: obJoinPlusDays(emp.join, j + 1) };
  }

  return {
    hrChecklist: hrChecklist,
    prepChecklist: prepChecklist,
    prepComment: isPartial ? ONBOARDING_PARTIAL_COMMENT : ''
  };
}

function ensureOnboardingSeed() {
  if (localStorage.getItem('quadra_ob_seed_v') === String(ONBOARDING_SEED_VERSION)) return;
  QUADRA_EMPLOYEES.forEach(function (emp) {
    var seed = buildOnboardingSeedForEmployee(emp);
    localStorage.setItem('quadra_ob_checklist_' + emp.badge, JSON.stringify(seed.hrChecklist));
    if (Object.keys(seed.hrChecklist).length >= HR_CHECKLIST_TOTAL) {
      localStorage.setItem('quadra_ob_checklist_done_' + emp.badge, '1');
    }
    localStorage.setItem('quadra_ob_prep_' + emp.badge, JSON.stringify(seed.prepChecklist));
    localStorage.setItem('quadra_ob_prep_comment_' + emp.badge, seed.prepComment);
  });
  localStorage.setItem('quadra_ob_seed_v', String(ONBOARDING_SEED_VERSION));
}

function getPrepChecklistState(badge) {
  ensureOnboardingSeed();
  try { return JSON.parse(localStorage.getItem('quadra_ob_prep_' + badge)) || {}; } catch (e) { return {}; }
}

function savePrepChecklistState(badge, state) {
  localStorage.setItem('quadra_ob_prep_' + badge, JSON.stringify(state));
}

function getPrepComment(badge) {
  ensureOnboardingSeed();
  return localStorage.getItem('quadra_ob_prep_comment_' + badge) || '';
}

function savePrepComment(badge, text) {
  localStorage.setItem('quadra_ob_prep_comment_' + badge, text);
}

function getHrChecklistState(badge) {
  ensureOnboardingSeed();
  try { return JSON.parse(localStorage.getItem('quadra_ob_checklist_' + badge)) || {}; } catch (e) { return {}; }
}
