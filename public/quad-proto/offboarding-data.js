var QUADRA_RESIGN_REQUESTS_KEY = 'quadra_resign_requests';

/* Seed: 2 example rows so offboarding-requests.html isn't empty on first load.
   000000009 (Hendra Wijaya) is already seeded as status:'Inactive' in
   employees-data.js — a completed offboarding is the natural explanation. */
var OFFBOARDING_SEED = {
  '000000009': {
    status: 'completed',
    submittedDate: '02 Jun 2026',
    letterFileName: 'surat-resign-hendra.pdf',
    resignReason: 'Resign',
    handoverFileName: 'handover-hendra.pdf',
    handoverDate: '10 Jun 2026'
  },
  '000000004': {
    status: 'pending',
    submittedDate: '15 Jul 2026',
    letterFileName: 'surat-resign-siti.pdf',
    handoverFileName: null,
    handoverDate: null
  }
};

function ensureOffboardingSeed() {
  if (localStorage.getItem(QUADRA_RESIGN_REQUESTS_KEY)) return;
  localStorage.setItem(QUADRA_RESIGN_REQUESTS_KEY, JSON.stringify(OFFBOARDING_SEED));
}

function getAllResignRequests() {
  ensureOffboardingSeed();
  try { return JSON.parse(localStorage.getItem(QUADRA_RESIGN_REQUESTS_KEY)) || {}; } catch (e) { return {}; }
}

function getResignRequest(badge) {
  return getAllResignRequests()[badge] || null;
}

function saveResignRequest(badge, request) {
  var all = getAllResignRequests();
  all[badge] = request;
  localStorage.setItem(QUADRA_RESIGN_REQUESTS_KEY, JSON.stringify(all));
}

function deleteResignRequest(badge) {
  var all = getAllResignRequests();
  delete all[badge];
  localStorage.setItem(QUADRA_RESIGN_REQUESTS_KEY, JSON.stringify(all));
}

var RESIGN_REASON_OPTIONS_KEY = 'quadra_resign_reason_options';
var DEFAULT_RESIGN_REASONS = ['Resign', 'Habis Kontrak', 'Pensiun', 'PHK'];

function getResignReasonOptions() {
  var stored;
  try { stored = JSON.parse(localStorage.getItem(RESIGN_REASON_OPTIONS_KEY)); } catch (e) { stored = null; }
  if (!stored || !stored.length) {
    stored = DEFAULT_RESIGN_REASONS.slice();
    localStorage.setItem(RESIGN_REASON_OPTIONS_KEY, JSON.stringify(stored));
  }
  return stored;
}

function addResignReasonOption(newReason) {
  var options = getResignReasonOptions();
  if (options.indexOf(newReason) === -1) {
    options.push(newReason);
    localStorage.setItem(RESIGN_REASON_OPTIONS_KEY, JSON.stringify(options));
  }
  return options;
}
