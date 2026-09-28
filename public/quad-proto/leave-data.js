/* Shared Leave module data — leave types, per-badge balances, and the
   versioned request-history seed. Loaded via <script src="leave-data.js">
   by any page that needs Leave data (my-leave.html, my-profile.html,
   employee-detail.html) — matches the existing employees-data.js /
   loans-data.js pattern of factoring shared SEED DATA into its own file,
   while each page still owns its own rendering/computation logic. */

var LEAVE_TYPES = [
  { id: 'annual',      name: 'Annual Leave',      avatarBg: '#2563EB', initials: 'AL' },
  { id: 'bereavement', name: 'Bereavement Leave', avatarBg: '#78350F', initials: 'BL' },
  { id: 'marriage',    name: 'Marriage Leave',    avatarBg: '#B91C1C', initials: 'ML' }
];
function getLeaveType(id) { return LEAVE_TYPES.find(function(t) { return t.id === id; }); }

/* ── Per-badge leave balances (prototype demo data, all 11 real badges).
   Every badge has all 3 types — Annual varies per employee (tenure-based),
   Bereavement/Marriage are the same fixed one-time entitlement (2 / 3 days)
   for everyone, matching common Indonesian company policy. ── */
var QUADRA_LEAVE_BALANCES = {
  '001228':    [ { typeId: 'annual', available: 4, carryforward: 2, total: 6 },  { typeId: 'bereavement', available: 2, carryforward: 0, total: 2 }, { typeId: 'marriage', available: 3, carryforward: 0, total: 3 } ],
  '000000001': [ { typeId: 'annual', available: 6, carryforward: 4, total: 10 }, { typeId: 'bereavement', available: 2, carryforward: 0, total: 2 }, { typeId: 'marriage', available: 3, carryforward: 0, total: 3 } ],
  '000000002': [ { typeId: 'annual', available: 5, carryforward: 1, total: 6 },  { typeId: 'bereavement', available: 2, carryforward: 0, total: 2 }, { typeId: 'marriage', available: 3, carryforward: 0, total: 3 } ],
  '000000003': [ { typeId: 'annual', available: 8, carryforward: 3, total: 11 }, { typeId: 'bereavement', available: 2, carryforward: 0, total: 2 }, { typeId: 'marriage', available: 3, carryforward: 0, total: 3 } ],
  '000000004': [ { typeId: 'annual', available: 3, carryforward: 0, total: 3 },  { typeId: 'bereavement', available: 2, carryforward: 0, total: 2 }, { typeId: 'marriage', available: 3, carryforward: 0, total: 3 } ],
  '000000005': [ { typeId: 'annual', available: 7, carryforward: 5, total: 12 }, { typeId: 'bereavement', available: 2, carryforward: 0, total: 2 }, { typeId: 'marriage', available: 3, carryforward: 0, total: 3 } ],
  '000000006': [ { typeId: 'annual', available: 4, carryforward: 2, total: 6 },  { typeId: 'bereavement', available: 2, carryforward: 0, total: 2 }, { typeId: 'marriage', available: 3, carryforward: 0, total: 3 } ],
  '000000007': [ { typeId: 'annual', available: 2, carryforward: 0, total: 2 },  { typeId: 'bereavement', available: 2, carryforward: 0, total: 2 }, { typeId: 'marriage', available: 3, carryforward: 0, total: 3 } ],
  '000000008': [ { typeId: 'annual', available: 5, carryforward: 3, total: 8 },  { typeId: 'bereavement', available: 2, carryforward: 0, total: 2 }, { typeId: 'marriage', available: 3, carryforward: 0, total: 3 } ],
  '000000009': [ { typeId: 'annual', available: 1, carryforward: 0, total: 1 },  { typeId: 'bereavement', available: 2, carryforward: 0, total: 2 }, { typeId: 'marriage', available: 3, carryforward: 0, total: 3 } ],
  '000000010': [ { typeId: 'annual', available: 6, carryforward: 2, total: 8 },  { typeId: 'bereavement', available: 2, carryforward: 0, total: 2 }, { typeId: 'marriage', available: 3, carryforward: 0, total: 3 } ]
};

/* ── Per-badge leave request history (versioned localStorage seed,
   same pattern as QUADRA_PAYROLL_PERIODS) ── */
var LEAVE_SEED_VERSION = 1;
var DEMO_LEAVE_REQUESTS = [
  { id: 'LV1001', empBadge: '001228',    typeId: 'annual',      startDate: '2026-01-12', endDate: '2026-01-12', startBreakdown: 'Full Day', endBreakdown: 'Full Day', requestedDays: 1,   description: 'Family event', status: 'approved', createdDate: '2026-01-05' },
  { id: 'LV1002', empBadge: '001228',    typeId: 'annual',      startDate: '2026-03-02', endDate: '2026-03-03', startBreakdown: 'Full Day', endBreakdown: 'Full Day', requestedDays: 2,   description: 'Personal trip', status: 'approved', createdDate: '2026-02-20' },
  { id: 'LV1003', empBadge: '000000001', typeId: 'annual',      startDate: '2026-02-10', endDate: '2026-02-10', startBreakdown: 'Full Day', endBreakdown: 'Full Day', requestedDays: 1,   description: 'Personal matter', status: 'approved', createdDate: '2026-02-01' },
  { id: 'LV1004', empBadge: '000000001', typeId: 'marriage',    startDate: '2026-09-14', endDate: '2026-09-16', startBreakdown: 'Full Day', endBreakdown: 'Full Day', requestedDays: 3,   description: 'Wedding', status: 'approved', createdDate: '2026-07-01' },
  { id: 'LV1005', empBadge: '000000001', typeId: 'annual',      startDate: '2026-08-03', endDate: '2026-08-03', startBreakdown: 'Full Day', endBreakdown: 'Full Day', requestedDays: 1,   description: 'Doctor appointment', status: 'requested', createdDate: '2026-07-15' },
  { id: 'LV1006', empBadge: '000000002', typeId: 'annual',      startDate: '2026-01-20', endDate: '2026-01-21', startBreakdown: 'Full Day', endBreakdown: 'Full Day', requestedDays: 2,   description: 'Family visit', status: 'approved', createdDate: '2026-01-10' },
  { id: 'LV1007', empBadge: '000000002', typeId: 'bereavement', startDate: '2026-04-05', endDate: '2026-04-06', startBreakdown: 'Full Day', endBreakdown: 'Full Day', requestedDays: 2,   description: 'Family bereavement', status: 'rejected', createdDate: '2026-04-01' },
  { id: 'LV1008', empBadge: '000000003', typeId: 'annual',      startDate: '2026-02-14', endDate: '2026-02-14', startBreakdown: 'First Half', endBreakdown: 'First Half', requestedDays: 0.5, description: 'Morning appointment', status: 'approved', createdDate: '2026-02-05' },
  { id: 'LV1009', empBadge: '000000003', typeId: 'marriage',    startDate: '2026-06-01', endDate: '2026-06-05', startBreakdown: 'Full Day', endBreakdown: 'Full Day', requestedDays: 5,   description: 'Wedding preparation', status: 'cancelled', createdDate: '2026-05-01' },
  { id: 'LV1010', empBadge: '000000004', typeId: 'annual',      startDate: '2026-03-10', endDate: '2026-03-10', startBreakdown: 'Full Day', endBreakdown: 'Full Day', requestedDays: 1,   description: 'Personal', status: 'approved', createdDate: '2026-03-01' },
  { id: 'LV1011', empBadge: '000000004', typeId: 'annual',      startDate: '2026-05-22', endDate: '2026-05-22', startBreakdown: 'Full Day', endBreakdown: 'Full Day', requestedDays: 1,   description: 'Personal', status: 'approved', createdDate: '2026-05-10' },
  { id: 'LV1012', empBadge: '000000005', typeId: 'annual',      startDate: '2026-01-05', endDate: '2026-01-06', startBreakdown: 'Full Day', endBreakdown: 'Full Day', requestedDays: 2,   description: 'New Year break', status: 'approved', createdDate: '2025-12-20' },
  { id: 'LV1013', empBadge: '000000005', typeId: 'marriage',    startDate: '2026-04-10', endDate: '2026-04-12', startBreakdown: 'Full Day', endBreakdown: 'Full Day', requestedDays: 3,   description: 'Wedding', status: 'approved', createdDate: '2026-03-15' },
  { id: 'LV1014', empBadge: '000000006', typeId: 'annual',      startDate: '2026-02-01', endDate: '2026-02-01', startBreakdown: 'Full Day', endBreakdown: 'Full Day', requestedDays: 1,   description: 'Personal', status: 'approved', createdDate: '2026-01-20' },
  { id: 'LV1015', empBadge: '000000006', typeId: 'bereavement', startDate: '2026-08-20', endDate: '2026-08-20', startBreakdown: 'Full Day', endBreakdown: 'Full Day', requestedDays: 1,   description: 'Family bereavement', status: 'requested', createdDate: '2026-07-10' },
  { id: 'LV1016', empBadge: '000000007', typeId: 'annual',      startDate: '2026-03-15', endDate: '2026-03-15', startBreakdown: 'Full Day', endBreakdown: 'Full Day', requestedDays: 1,   description: 'Personal', status: 'approved', createdDate: '2026-03-05' },
  { id: 'LV1017', empBadge: '000000008', typeId: 'annual',      startDate: '2026-02-18', endDate: '2026-02-19', startBreakdown: 'Full Day', endBreakdown: 'Full Day', requestedDays: 2,   description: 'Personal', status: 'approved', createdDate: '2026-02-10' },
  { id: 'LV1018', empBadge: '000000009', typeId: 'annual',      startDate: '2026-01-08', endDate: '2026-01-08', startBreakdown: 'Full Day', endBreakdown: 'Full Day', requestedDays: 1,   description: 'Personal', status: 'approved', createdDate: '2026-01-02' },
  { id: 'LV1019', empBadge: '000000010', typeId: 'annual',      startDate: '2026-04-20', endDate: '2026-04-21', startBreakdown: 'Full Day', endBreakdown: 'Full Day', requestedDays: 2,   description: 'Personal', status: 'approved', createdDate: '2026-04-10' }
];

function saveLeaveRequests(requests) {
  try {
    localStorage.setItem('QUADRA_LEAVE_REQUESTS', JSON.stringify(requests));
    localStorage.setItem('QUADRA_LEAVE_REQUESTS_V', LEAVE_SEED_VERSION);
  } catch(e) {}
}

function getStoredLeaveRequests() {
  try {
    var storedV = parseInt(localStorage.getItem('QUADRA_LEAVE_REQUESTS_V') || '0');
    if (storedV !== LEAVE_SEED_VERSION) throw new Error('stale');
    var raw = localStorage.getItem('QUADRA_LEAVE_REQUESTS');
    if (raw) {
      var stored = JSON.parse(raw);
      if (stored.length) return stored;
    }
  } catch (e) {
    localStorage.removeItem('QUADRA_LEAVE_REQUESTS');
    localStorage.removeItem('QUADRA_LEAVE_REQUESTS_V');
  }
  var seeded = DEMO_LEAVE_REQUESTS.map(function(r) { return Object.assign({}, r); });
  saveLeaveRequests(seeded);
  return seeded;
}
