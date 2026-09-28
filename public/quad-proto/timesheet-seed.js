// Shared seed data for demo timesheet periods (August + July + June 2026).
// Loaded by my-timesheet.html, timesheet-approval.html,
// timesheet-approval-detail.html and the 3 Payroll pages that gate on it.
// Self-contained: does not depend on my-timesheet.html's Holiday-aware
// generateDefaultDays() (that function isn't available on the HR-only pages),
// so June/July 2026 days here are NOT holiday-aware — safe, since the only
// seeded holidays (Hari Kemerdekaan / Cuti Bersama HUT RI) fall in August
// 2026, outside that range. The August 2026 batch DOES apply them, via
// seedHolidayIsoDates() below.

function timesheetNormalizeDay(day) {
  if (day.workStart === undefined) day.workStart = '';
  if (day.workEnd === undefined) day.workEnd = '';

  if (!day.entries) {
    // Oldest shape: flat projectId/activity directly on the day, no entries array.
    day.entries = (day.dayStatus === 'Kerja')
      ? [{ projectId: day.projectId != null ? day.projectId : null, activity: day.activity || '' }]
      : [];
    return day;
  }

  // Prior multi-entry shape had its own workStart/workEnd per entry — collapse
  // to a single day-level range (best effort: use the first entry's hours)
  // and strip hours back out of each entry, keeping only projectId/activity.
  if (day.entries.length && day.entries[0].workStart !== undefined) {
    if (!day.workStart && !day.workEnd) {
      day.workStart = day.entries[0].workStart || '';
      day.workEnd = day.entries[0].workEnd || '';
    }
    day.entries = day.entries.map(function(e) {
      return { projectId: e.projectId != null ? e.projectId : null, activity: e.activity || '' };
    });
  }

  return day;
}

function timesheetEscHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function seedPad2(n) { return n < 10 ? '0' + n : String(n); }

function seedIsoDate(year, month, day) {
  return year + '-' + seedPad2(month + 1) + '-' + seedPad2(day);
}

function seedGenerateWorkDays(year, month) {
  var count = new Date(year, month + 1, 0).getDate();
  var days = [];
  for (var day = 1; day <= count; day++) {
    var dow = new Date(year, month, day).getDay();
    var isWeekend = (dow === 0 || dow === 6);
    var dayStatus = isWeekend ? 'Weekend' : 'Kerja';
    days.push({
      date: seedIsoDate(year, month, day),
      dayStatus: dayStatus,
      holidayName: null,
      workStart: dayStatus === 'Kerja' ? '08:00' : '',
      workEnd: dayStatus === 'Kerja' ? '17:00' : '',
      entries: dayStatus === 'Kerja' ? [{ projectId: null, activity: '' }] : []
    });
  }
  return days;
}

var SEED_ACTIVITIES = [
  'Sprint planning and backlog grooming',
  'Code review and bug fixes',
  'Feature development',
  'Client requirement discussion',
  'Testing and QA verification',
  'Documentation update',
  'Team stand-up and sync',
  'Design review session'
];

// July 2026 — every entry ends up 'Submitted' (unapproved), one per Active
// employee. projectId always points at a real Settings > Project id
// (1=NDS, 2=CRM, 3=Ops Console); employees whose legacy `project` field
// doesn't match one of those three are just round-robined across them for
// variety, since that field isn't actually wired to Project master data.
// `projects` lists every project id this badge logs time against in July
// 2026. `mode` controls how a multi-project badge's days split across them
// — 'alternate' switches project day-to-day (triggers Export Report's
// project-picker), 'same-day' additionally puts 2 entries on some individual
// days. Badges with a single project ignore `mode`.
var JULY2026_SEED_PROJECTS = {
  '001228':     { projects: [3] },
  '000000001':  { projects: [1, 3], mode: 'alternate' },
  '000000002':  { projects: [2] },
  '000000003':  { projects: [3] },
  '000000004':  { projects: [1, 2], mode: 'alternate' },
  '000000005':  { projects: [2] },
  '000000006':  { projects: [1] },
  '000000007':  { projects: [1] },
  '000000008':  { projects: [2, 1], mode: 'same-day' },
  '000000010':  { projects: [2] },
  '000000011':  { projects: [2] }
};

// weekdayIndex = position (0-based) among that month's Kerja weekdays —
// avoids hand-computing real July 2026 calendar dates.
var JULY2026_SEED_ABSENCES = {
  '001228':     [{ weekdayIndex: 3,  status: 'Sakit' }],
  '000000001':  [{ weekdayIndex: 7,  status: 'Cuti' }, { weekdayIndex: 8, status: 'Cuti' }],
  '000000002':  [{ weekdayIndex: 12, status: 'Ijin' }],
  '000000003':  [{ weekdayIndex: 5,  status: 'Sakit' }],
  '000000004':  [{ weekdayIndex: 10, status: 'Ijin' }, { weekdayIndex: 18, status: 'Cuti' }],
  '000000005':  [{ weekdayIndex: 2,  status: 'Cuti' }],
  '000000006':  [{ weekdayIndex: 15, status: 'Sakit' }],
  '000000007':  [{ weekdayIndex: 9,  status: 'Ijin' }],
  '000000008':  [{ weekdayIndex: 20, status: 'Cuti' }, { weekdayIndex: 21, status: 'Cuti' }],
  '000000010':  [{ weekdayIndex: 4,  status: 'Ijin' }],
  '000000011':  [{ weekdayIndex: 6,  status: 'Ijin' }]
};

function buildJuly2026Seed(badge) {
  var seedConfig = JULY2026_SEED_PROJECTS[badge];
  if (seedConfig === undefined) return null;
  var projects = seedConfig.projects;

  var absences = JULY2026_SEED_ABSENCES[badge] || [];
  var days = seedGenerateWorkDays(2026, 6);
  var weekdayIndex = 0;

  days.forEach(function (d) {
    if (d.dayStatus !== 'Kerja') return;
    var absence = absences.filter(function (a) { return a.weekdayIndex === weekdayIndex; })[0];
    if (absence) {
      d.dayStatus = absence.status;
      d.entries = [];
    } else {
      d.workStart = '09:00';
      d.workEnd = '17:00';
      var activity = SEED_ACTIVITIES[weekdayIndex % SEED_ACTIVITIES.length];
      if (seedConfig.mode === 'same-day' && projects.length > 1 && weekdayIndex % 5 === 4) {
        d.entries = projects.map(function (pid, idx) {
          return { projectId: pid, activity: SEED_ACTIVITIES[(weekdayIndex + idx) % SEED_ACTIVITIES.length] };
        });
      } else if (seedConfig.mode === 'alternate' && projects.length > 1) {
        d.entries = [{ projectId: projects[weekdayIndex % projects.length], activity: activity }];
      } else {
        d.entries = [{ projectId: projects[0], activity: activity }];
      }
    }
    weekdayIndex++;
  });

  return { status: 'Submitted', submittedAt: '2026-08-01T09:15:00.000Z', days: days };
}

// June 2026 — every Active employee gets a fully-filled month (every
// weekday Kerja, no absences), resolved as either Approved or Rejected by
// HR. approvedBy/rejectedBy point at HR Umum's badge (001228) — this field
// isn't displayed anywhere in the UI today, so who exactly it credits
// doesn't affect what's visible.
var JUNE2026_SEED_CONFIG = {
  '001228':     { projectId: 3, resolution: 'Approved' },
  '000000001':  { projectId: 1, resolution: 'Approved' },
  '000000002':  { projectId: 2, resolution: 'Approved' },
  '000000003':  { projectId: 3, resolution: 'Approved' },
  '000000004':  { projectId: 1, resolution: 'Rejected', reason: 'Overtime hours not documented for the last week of June — please add detail before resubmitting.' },
  '000000005':  { projectId: 2, resolution: 'Approved' },
  '000000006':  { projectId: 1, resolution: 'Approved' },
  '000000007':  { projectId: 1, resolution: 'Rejected', reason: 'Project allocation looks duplicated across several entries — please review and resubmit.' },
  '000000008':  { projectId: 2, resolution: 'Approved' },
  '000000010':  { projectId: 3, resolution: 'Approved' },
  '000000011':  { projectId: 2, resolution: 'Approved' }
};

function buildJune2026Seed(badge) {
  var config = JUNE2026_SEED_CONFIG[badge];
  if (config === undefined) return null;

  var days = seedGenerateWorkDays(2026, 5);
  var weekdayIndex = 0;
  days.forEach(function (d) {
    if (d.dayStatus !== 'Kerja') return;
    d.workStart = '09:00';
    d.workEnd = '17:00';
    d.entries = [{ projectId: config.projectId, activity: SEED_ACTIVITIES[weekdayIndex % SEED_ACTIVITIES.length] }];
    weekdayIndex++;
  });

  var base = { status: config.resolution, submittedAt: '2026-07-01T09:00:00.000Z', days: days };
  if (config.resolution === 'Approved') {
    base.approvedAt = '2026-07-02T10:00:00.000Z';
    base.approvedBy = '001228';
  } else {
    base.rejectedAt = '2026-07-02T10:00:00.000Z';
    base.rejectedBy = '001228';
    base.rejectionReason = config.reason;
  }
  return base;
}

// August 2026 — the current demo month. Mostly Approved so Payroll create
// (which defaults to the current month) actually has eligible employees;
// two Submitted + one Rejected keep the Timesheet-approval gate visible and
// demonstrable on the Payroll pages.
var AUG2026_SEED_CONFIG = {
  '001228':     { projectId: 3, resolution: 'Approved' },
  '000000001':  { projectId: 1, resolution: 'Approved' },
  '000000002':  { projectId: 2, resolution: 'Approved' },
  '000000003':  { projectId: 3, resolution: 'Approved' },
  '000000004':  { projectId: 1, resolution: 'Submitted' },
  '000000005':  { projectId: 2, resolution: 'Approved' },
  '000000006':  { projectId: 1, resolution: 'Approved' },
  '000000007':  { projectId: 1, resolution: 'Rejected', reason: 'Several days are missing a project assignment — please complete them and resubmit.' },
  '000000008':  { projectId: 2, resolution: 'Approved' },
  '000000011':  { projectId: 2, resolution: 'Submitted' }
  // 000000010 (Maya Sari) is deliberately left unseeded for August so the
  // "blank month -> fill in -> submit" self-service demo has a real subject,
  // and so the Payroll gate's "not submitted yet" branch has a nonzero count
  // in the default seeded state.
};

// Mirrors settings.html's HOLIDAY_SEED — used only when Settings has never
// been opened, so QUADRA_HOLIDAYS isn't in localStorage yet.
var SEED_HOLIDAY_FALLBACK = [
  { name: 'Hari Kemerdekaan RI', startDate: '2026-08-17', endDate: '2026-08-17' },
  { name: 'Cuti Bersama HUT RI', startDate: '2026-08-18', endDate: '2026-08-18' }
];

// { '2026-08-17': 'Hari Kemerdekaan RI', ... } for the given month.
function seedHolidayIsoDates(year, month) {
  var holidays;
  try { holidays = JSON.parse(localStorage.getItem('QUADRA_HOLIDAYS')); } catch (e) { holidays = null; }
  if (!holidays || !holidays.length) holidays = SEED_HOLIDAY_FALLBACK;

  var map = {};
  var count = new Date(year, month + 1, 0).getDate();
  for (var day = 1; day <= count; day++) {
    var iso = seedIsoDate(year, month, day);
    for (var i = 0; i < holidays.length; i++) {
      var h = holidays[i];
      if (!h || !h.startDate) continue;
      if (iso >= h.startDate && iso <= (h.endDate || h.startDate)) { map[iso] = h.name || 'Holiday'; break; }
    }
  }
  return map;
}

function buildAugust2026Seed(badge) {
  var config = AUG2026_SEED_CONFIG[badge];
  if (config === undefined) return null;

  var holidayMap = seedHolidayIsoDates(2026, 7);
  var days = seedGenerateWorkDays(2026, 7);
  var weekdayIndex = 0;
  days.forEach(function (d) {
    if (d.dayStatus !== 'Kerja') return;
    if (holidayMap[d.date]) {
      d.dayStatus = 'Holiday';
      d.holidayName = holidayMap[d.date];
      d.workStart = '';
      d.workEnd = '';
      d.entries = [];
      return;
    }
    d.workStart = '09:00';
    d.workEnd = '17:00';
    d.entries = [{ projectId: config.projectId, activity: SEED_ACTIVITIES[weekdayIndex % SEED_ACTIVITIES.length] }];
    weekdayIndex++;
  });

  var base = { status: config.resolution, submittedAt: '2026-08-16T09:00:00.000Z', days: days };
  if (config.resolution === 'Approved') {
    base.approvedAt = '2026-08-17T08:30:00.000Z';
    base.approvedBy = '001228';
  } else if (config.resolution === 'Rejected') {
    base.rejectedAt = '2026-08-17T08:30:00.000Z';
    base.rejectedBy = '001228';
    base.rejectionReason = config.reason;
  }
  return base;
}

function seedActiveBadges() {
  return QUADRA_EMPLOYEES.filter(function (e) { return e.status === 'Active'; }).map(function (e) { return e.badge; });
}

// Bump SEED_VERSION whenever a new period batch is added below, so browsers
// that already ran an older seed pick the new periods up. Existing per-badge
// keys are never overwritten — only missing ones get filled in.
var TIMESHEET_SEED_VERSION = '2';

function seedAllTimesheetsIfNeeded() {
  if (localStorage.getItem('quadra_timesheet_seed_v') === TIMESHEET_SEED_VERSION) return;

  seedActiveBadges().forEach(function (badge) {
    var augKey = 'quadra_timesheet_' + badge + '_2026-08';
    if (!localStorage.getItem(augKey)) {
      var aug = buildAugust2026Seed(badge);
      if (aug) localStorage.setItem(augKey, JSON.stringify(aug));
    }

    var julyKey = 'quadra_timesheet_' + badge + '_2026-07';
    if (!localStorage.getItem(julyKey)) {
      var july = buildJuly2026Seed(badge);
      if (july) localStorage.setItem(julyKey, JSON.stringify(july));
    }

    var juneKey = 'quadra_timesheet_' + badge + '_2026-06';
    if (!localStorage.getItem(juneKey)) {
      var june = buildJune2026Seed(badge);
      if (june) localStorage.setItem(juneKey, JSON.stringify(june));
    }
  });

  localStorage.setItem('quadra_timesheet_seed_v', TIMESHEET_SEED_VERSION);
}
