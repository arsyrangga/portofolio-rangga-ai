(function () {
  var aside = document.getElementById('sidebar');
  if (!aside) return;

  var activeMenu = aside.getAttribute('data-active-menu') || '';
  var activeSub  = aside.getAttribute('data-active-sub')  || '';

  /* ── Icon paths (ICON_COLOR placeholder replaced at render time) ── */
  var ICONS = {
    'dashboard':      '<rect x="1" y="1" width="6" height="6" rx="1" stroke="ICON_COLOR" stroke-width="1.4"/><rect x="9" y="1" width="6" height="6" rx="1" stroke="ICON_COLOR" stroke-width="1.4"/><rect x="1" y="9" width="6" height="6" rx="1" stroke="ICON_COLOR" stroke-width="1.4"/><rect x="9" y="9" width="6" height="6" rx="1" stroke="ICON_COLOR" stroke-width="1.4"/>',
    'recruitments':   '<circle cx="6" cy="5" r="3" stroke="ICON_COLOR" stroke-width="1.4"/><path d="M1 13c0-2.761 2.239-5 5-5" stroke="ICON_COLOR" stroke-width="1.4" stroke-linecap="round"/><path d="M11 9v6M8 12h6" stroke="ICON_COLOR" stroke-width="1.4" stroke-linecap="round"/>',
    'onboarding':     '<path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h10a1 1 0 001-1v-3" stroke="ICON_COLOR" stroke-width="1.4" stroke-linecap="round"/><path d="M9 1h6v6" stroke="ICON_COLOR" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M15 1L8 8" stroke="ICON_COLOR" stroke-width="1.4" stroke-linecap="round"/>',
    'offboarding':    '<rect x="2" y="1" width="8" height="14" rx="1" stroke="ICON_COLOR" stroke-width="1.4"/><path d="M9 8h6" stroke="ICON_COLOR" stroke-width="1.4" stroke-linecap="round"/><path d="M12 5l3 3-3 3" stroke="ICON_COLOR" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>',
    'employees':      '<circle cx="6" cy="5" r="3" stroke="ICON_COLOR" stroke-width="1.4"/><path d="M1 13c0-2.761 2.239-5 5-5h2" stroke="ICON_COLOR" stroke-width="1.4" stroke-linecap="round"/><circle cx="12" cy="11" r="3" stroke="ICON_COLOR" stroke-width="1.4"/>',
    'payroll':        '<rect x="1" y="3" width="14" height="10" rx="1" stroke="ICON_COLOR" stroke-width="1.4"/><path d="M1 6h14" stroke="ICON_COLOR" stroke-width="1.4"/><path d="M5 10h2M9 10h2" stroke="ICON_COLOR" stroke-width="1.4" stroke-linecap="round"/>',
    'attendances':    '<circle cx="8" cy="8" r="6" stroke="ICON_COLOR" stroke-width="1.4"/><path d="M8 5v3.5l2.5 1.5" stroke="ICON_COLOR" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>',
    'leave':          '<rect x="1" y="2" width="14" height="13" rx="1" stroke="ICON_COLOR" stroke-width="1.4"/><path d="M1 6h14" stroke="ICON_COLOR" stroke-width="1.4"/><path d="M5 1v2M11 1v2" stroke="ICON_COLOR" stroke-width="1.4" stroke-linecap="round"/>',
    'digital-sppd':   '<path d="M2 11l4-4 3 3 5-6" stroke="ICON_COLOR" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>',
    'performance':    '<path d="M2 12l3-4 3 2 3-5 3 4" stroke="ICON_COLOR" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>',
    'assets':         '<rect x="1" y="5" width="14" height="9" rx="1" stroke="ICON_COLOR" stroke-width="1.4"/><path d="M5 5V4a3 3 0 016 0v1" stroke="ICON_COLOR" stroke-width="1.4" stroke-linecap="round"/>',
    'help-desk':      '<circle cx="8" cy="8" r="6" stroke="ICON_COLOR" stroke-width="1.4"/><path d="M8 7v4M8 5.5v.5" stroke="ICON_COLOR" stroke-width="1.4" stroke-linecap="round"/>',
    'configuration':  '<circle cx="8" cy="8" r="2.5" stroke="ICON_COLOR" stroke-width="1.4"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41" stroke="ICON_COLOR" stroke-width="1.4" stroke-linecap="round"/>',
    'org-structure':  '<rect x="5" y="1" width="6" height="4" rx="1" stroke="ICON_COLOR" stroke-width="1.4"/><rect x="1" y="11" width="4" height="4" rx="1" stroke="ICON_COLOR" stroke-width="1.4"/><rect x="6" y="11" width="4" height="4" rx="1" stroke="ICON_COLOR" stroke-width="1.4"/><rect x="11" y="11" width="4" height="4" rx="1" stroke="ICON_COLOR" stroke-width="1.4"/><path d="M8 5v3M3 11V9h10v2" stroke="ICON_COLOR" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>',
    'my-profile':     '<circle cx="8" cy="5" r="3" stroke="ICON_COLOR" stroke-width="1.4"/><path d="M2 14c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="ICON_COLOR" stroke-width="1.4" stroke-linecap="round"/>',
    'my-payslip':     '<rect x="1" y="3" width="14" height="10" rx="1" stroke="ICON_COLOR" stroke-width="1.4"/><path d="M1 6h14" stroke="ICON_COLOR" stroke-width="1.4"/><path d="M5 10h2M9 10h2" stroke="ICON_COLOR" stroke-width="1.4" stroke-linecap="round"/>',
    'my-attendance':  '<circle cx="8" cy="8" r="6" stroke="ICON_COLOR" stroke-width="1.4"/><path d="M8 5v3.5l2.5 1.5" stroke="ICON_COLOR" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>',
    'my-timesheet':   '<rect x="3" y="2" width="10" height="12" rx="1" stroke="ICON_COLOR" stroke-width="1.4"/><path d="M6 1.5h4v2H6z" stroke="ICON_COLOR" stroke-width="1.2"/><path d="M8 8V6M8 8l1.3 0.9" stroke="ICON_COLOR" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>'
  };

  /* ── Role ── */
  var ROLE = localStorage.getItem('quadra_role') || 'hr-finance';

  /* ── Nav data ── */
  /* --- pre-2026-07-23 flat NAV (HR-admin/hr-umum), kept for rollback ---
  var NAV_OLD_FLAT = [
    { key: 'dashboard',     label: 'Dashboard',              href: '#' },
    { key: 'recruitments',  label: 'Recruitments',           href: '#' },
    { key: 'onboarding',    label: 'Onboarding',             href: '#', subs: [
      { key: 'onboarding-dashboard', label: 'Dashboard',           href: '#' },
      { key: 'employee-onboarding',  label: 'Employee Onboarding', href: 'onboarding-employee-list.html' }
    ]},
    { key: 'offboarding',   label: 'Offboarding',            href: '#', subs: [
      { key: 'offboarding-requests', label: 'Offboarding Requests', href: 'offboarding-requests.html' }
    ]},
    { key: 'employees',     label: 'Employees',              href: '#', subs: [
      { key: 'list-employee',   label: 'Employee List',              href: 'employees-list.html' },
      { key: 'shift-request',   label: 'Shift Request',              href: '#' },
      { key: 'work-type-request', label: 'Work Type Request',        href: '#' },
      { key: 'rotating-shift',  label: 'Rotating Shift Assign',      href: '#' },
      { key: 'rotating-wt',     label: 'Rotating Work Type Assign',  href: '#' },
      { key: 'policies',        label: 'Policies',                   href: '#' },
      { key: 'resume',          label: 'Resume',                     href: '#' },
      { key: 'feedback',        label: 'Feedback',                   href: '#' }
    ]},
    { key: 'payroll',       label: 'Payroll',                href: '#', subs: [
      { key: 'payroll-dashboard', label: 'Dashboard',                href: '#' },
      { key: 'level-range',       label: 'Level Range',              href: 'payroll-level-range.html' },
      { key: 'allowance',         label: 'Allowance',                href: 'payroll-allowance.html' },
      { key: 'deduction',         label: 'Deduction',                href: 'payroll-deduction.html' },
      { key: 'payroll-summary',   label: 'Payroll Summary',          href: 'payroll-summary.html' },
      { key: 'loan',              label: 'Loan / Advance Salary',    href: 'payroll-loan.html' },
      { key: 'encashments',       label: 'Encashments &amp; Reimbursements', href: '#' },
      { key: 'income-tax',        label: 'Income Tax',               href: '#' }
    ]},
    { key: 'attendances',   label: 'Attendances',            href: 'attendance.html' },
    { key: 'leave',         label: 'Leave',                  href: '#' },
    { key: 'digital-sppd', label: 'Digital SPPD',           href: '#' },
    { key: 'performance',   label: 'Performance',            href: '#' },
    { key: 'assets',        label: 'Assets',                 href: '#' },
    { key: 'help-desk',     label: 'Help Desk',              href: '#' },
    { key: 'configuration', label: 'Configuration',          href: '#' },
    { key: 'org-structure', label: 'Organization Structure', href: '#' }
  ];
  --- end rollback block --- */

  var CATEGORY_LABELS = { people: 'People', time: 'Time Management', company: 'Company' };

  var NAV = [
    { key: 'dashboard',     label: 'Dashboard',              href: '#' },

    { key: 'recruitments',  label: 'Recruitments',           href: '#', category: 'people' }, // external redirect to HireFlow — real URL not yet known, do not guess it
    { key: 'onboarding',    label: 'Onboarding',             href: 'onboarding-employee-list.html', category: 'people' },
    { key: 'offboarding',   label: 'Offboarding',            href: 'offboarding-requests.html', category: 'people' },
    { key: 'employees',     label: 'Employee Directory',     href: 'employees-list.html', category: 'people' },

    { key: 'attendances',   label: 'Attendances',            href: '#', category: 'time', subs: [
      { key: 'attendance-my-activity',      label: 'My Activity',        href: '#' },
      { key: 'attendance-approval-request', label: 'Approval &amp; Request', href: 'attendance.html' },
      { key: 'attendance-reports',          label: 'Reports',            href: '#' }
    ]},
    { key: 'my-timesheet', label: 'Timesheet',              href: '#', category: 'time', subs: [
      { key: 'my-timesheet-my-activity', label: 'My Activity',          href: 'my-timesheet.html' },
      { key: 'my-timesheet-approval',    label: 'Approval &amp; Request', href: 'timesheet-approval.html' }
    ]},
    { key: 'leave',         label: 'Leave',                  href: '#', category: 'time', subs: [
      { key: 'leave-my-activity', label: 'My Activity', href: '#' },
      { key: 'leave-approvals',   label: 'Approvals',   href: '#' },
      { key: 'leave-settings',    label: 'Settings',     href: '#' }
    ]},
    { key: 'digital-sppd', label: 'Digital SPPD',           href: '#', category: 'time' },

    { key: 'payroll',       label: 'Payroll',                href: '#', subs: [
      { key: 'payroll-dashboard', label: 'Dashboard',                href: '#' },
      { key: 'level-range',       label: 'Level Range',              href: 'payroll-level-range.html' },
      { key: 'allowance',         label: 'Allowance',                href: 'payroll-allowance.html' },
      { key: 'deduction',         label: 'Deduction',                href: 'payroll-deduction.html' },
      { key: 'payroll-summary',   label: 'Payroll Summary',          href: 'payroll-summary.html' },
      { key: 'loan',              label: 'Loan / Advance Salary',    href: 'payroll-loan.html' },
      { key: 'encashments',       label: 'Encashments &amp; Reimbursements', href: '#' },
      { key: 'income-tax',        label: 'Income Tax',               href: '#' }
    ]},

    { key: 'performance',   label: 'Performance',            href: '#', category: 'company' },
    { key: 'assets',        label: 'Assets',                 href: '#', category: 'company' },
    { key: 'help-desk',     label: 'Help Desk',              href: '#', category: 'company' },
    { key: 'configuration', label: 'Configuration',          href: '#', category: 'company' },
    { key: 'org-structure', label: 'Organization Structure', href: '#', category: 'company' }
  ];

  if (ROLE === 'hr-umum') {
    NAV = NAV.filter(function(item) { return item.key !== 'payroll'; });
  }

  /* --- pre-2026-07-23 flat NAV (Karyawan), kept for rollback ---
  var NAV_OLD_FLAT_KARYAWAN = [
    { key: 'dashboard',     label: 'Dashboard',              href: '#' },
    { key: 'onboarding',    label: 'Onboarding',             href: 'my-onboarding-preparation.html' },
    { key: 'offboarding',   label: 'Offboarding',            href: 'my-resignation.html' },
    { key: 'my-profile',    label: 'My Profile',             href: 'my-profile.html' },
    { key: 'my-payslip',    label: 'Payroll',                href: 'my-payslip.html' },
    { key: 'my-attendance', label: 'Attendances',            href: 'my-attendance.html' },
    { key: 'leave',         label: 'Leave',                  href: 'my-leave.html' },
    { key: 'assets',        label: 'Assets',                 href: '#' },
    { key: 'org-structure', label: 'Organization Structure', href: '#' }
  ];
  --- end rollback block --- */

  if (ROLE === 'karyawan') {
    NAV = [
      { key: 'dashboard',     label: 'Dashboard',              href: '#' },

      { key: 'onboarding',    label: 'Onboarding',             href: 'my-onboarding-preparation.html', category: 'people' },
      { key: 'offboarding',   label: 'Offboarding',            href: 'my-resignation.html', category: 'people' },
      { key: 'my-profile',    label: 'My Profile',             href: 'my-profile.html', category: 'people' },

      { key: 'my-attendance', label: 'Attendances',            href: 'my-attendance.html', category: 'time' },
      { key: 'my-timesheet',  label: 'Timesheet',              href: 'my-timesheet.html', category: 'time' },
      { key: 'leave',         label: 'Leave',                  href: 'my-leave.html', category: 'time' },

      { key: 'my-payslip',    label: 'Payroll',                href: 'my-payslip.html' },

      { key: 'assets',        label: 'Assets',                 href: '#', category: 'company' },
      { key: 'org-structure', label: 'Organization Structure', href: '#', category: 'company' }
    ];

    var activeBadge = localStorage.getItem('quadra_active_badge');
    var resignStatus = null;
    try {
      var allResignRequests = JSON.parse(localStorage.getItem('quadra_resign_requests') || '{}');
      resignStatus = allResignRequests[activeBadge] ? allResignRequests[activeBadge].status : null;
    } catch (e) {}
    if (resignStatus !== 'approved' && resignStatus !== 'completed') {
      NAV = NAV.filter(function (item) { return item.key !== 'offboarding'; });
    }
  }

  function roleLabel(r) {
    if (r === 'hr-umum')  return 'HR Umum';
    if (r === 'karyawan') return 'Karyawan';
    return 'HR Finance';
  }

  var CHEVRON = '<svg class="nav-chevron" width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="#6B7280" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function icon(key, color) {
    var path = ICONS[key] || '';
    return '<svg width="16" height="16" viewBox="0 0 16 16" fill="none">' + path.replace(/ICON_COLOR/g, color) + '</svg>';
  }

  /* ── Build HTML ── */
  var html = '';

  /* Company selector */
  html += '<div class="company-selector">' +
    '<div class="company-avatar">ST</div>' +
    '<div class="company-info">' +
      '<div class="company-name">Steradian</div>' +
      '<div class="company-sub">All companies</div>' +
    '</div>' +
    '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" style="flex-shrink:0">' +
      '<path d="M2 4l4 4 4-4" stroke="#6B7280" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
    '</svg>' +
  '</div>';

  /* Nav */
  html += '<nav class="sidebar-nav">';

  var prevCategory = null;
  for (var i = 0; i < NAV.length; i++) {
    var item = NAV[i];

    if (item.category && item.category !== prevCategory) {
      html += '<div class="nav-group-label">' + CATEGORY_LABELS[item.category] + '</div>';
    }
    var cameFromGroup = !item.category && prevCategory;
    prevCategory = item.category || null;
    var isActive = item.key === activeMenu;
    var iconColor = isActive ? '#E04A2A' : '#9CA3AF';
    var itemCls = 'nav-item' + (isActive ? ' active' : '') + (item.subs ? ' js-parent' : '') + (cameFromGroup ? ' nav-item-gap' : '');

    if (item.subs) {
      /* parent with sub-menu: use <a> but we handle click in JS */
      html += '<a class="' + itemCls + '" href="#" data-sub-id="sub-' + item.key + '">' +
        icon(item.key, iconColor) +
        '<span class="nav-label">' + item.label + '</span>' +
        CHEVRON +
      '</a>';

      /* sub-menu */
      var subOpen = isActive ? ' open' : '';
      html += '<div class="nav-sub' + subOpen + '" id="sub-' + item.key + '">';
      for (var j = 0; j < item.subs.length; j++) {
        var sub = item.subs[j];
        var subActive = (sub.key === activeSub) ? ' active' : '';
        html += '<a class="nav-sub-item' + subActive + '" href="' + sub.href + '"><span>' + sub.label + '</span></a>';
      }
      html += '</div>';
    } else {
      html += '<a class="' + itemCls + '" href="' + item.href + '">' +
        icon(item.key, iconColor) +
        '<span class="nav-label">' + item.label + '</span>' +
      '</a>';
    }
  }

  html += '</nav>';
  html += '<a href="demo-reset.html" style="display:flex;align-items:center;gap:6px;padding:10px 16px;margin:auto 0 0;border-top:1px solid rgba(255,255,255,0.06);text-decoration:none;opacity:0.45;" onmouseover="this.style.opacity=\'0.8\'" onmouseout="this.style.opacity=\'0.45\'">'
        + '<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1v3l1.5 1.5" stroke="#9CA3AF" stroke-width="1.2" stroke-linecap="round"/><path d="M2.5 3.5A4.5 4.5 0 1 0 6 1.5" stroke="#9CA3AF" stroke-width="1.2" stroke-linecap="round"/></svg>'
        + '<span style="font-size:11px;color:#6B7280;font-family:inherit">Demo Reset</span>'
        + '</a>';

  aside.innerHTML = html;

  /* ── Mark open parent (chevron + open class) ── */
  var openParent = aside.querySelector('.nav-item.active.js-parent');
  if (openParent) openParent.classList.add('open');

  /* ── Click handlers ── */
  var parents = aside.querySelectorAll('.nav-item[data-sub-id]');
  for (var k = 0; k < parents.length; k++) {
    (function (parentEl) {
      parentEl.addEventListener('click', function (e) {
        e.preventDefault();
        var subId = parentEl.getAttribute('data-sub-id');
        var sub = document.getElementById(subId);
        if (!sub) return;

        var wasOpen = sub.classList.contains('open');

        /* collapse all */
        var allSubs = aside.querySelectorAll('.nav-sub.open');
        for (var s = 0; s < allSubs.length; s++) allSubs[s].classList.remove('open');
        var allOpen = aside.querySelectorAll('.nav-item.open');
        for (var o = 0; o < allOpen.length; o++) allOpen[o].classList.remove('open');

        /* expand this one if it was closed */
        if (!wasOpen) {
          sub.classList.add('open');
          parentEl.classList.add('open');
        }
      });
    })(parents[k]);
  }

  /* ── Role badge in navbar ── */
  var userNameEl = document.querySelector('.user-name');
  if (userNameEl) {
    var roleLabelText = roleLabel(ROLE);
    var wrapper = document.createElement('div');
    wrapper.style.cssText = 'display:flex;flex-direction:column;gap:1px;';
    var nameSpan = document.createElement('span');
    nameSpan.style.cssText = 'font-size:13px;font-weight:500;color:#111827;white-space:nowrap;';
    nameSpan.textContent = userNameEl.textContent;
    var roleSpan = document.createElement('span');
    roleSpan.style.cssText = 'font-size:11px;color:#9CA3AF;white-space:nowrap;';
    roleSpan.textContent = roleLabelText;
    wrapper.appendChild(nameSpan);
    wrapper.appendChild(roleSpan);
    userNameEl.parentNode.replaceChild(wrapper, userNameEl);
  }

  /* ── Global cursor rules ── */
  var globalStyle = document.createElement('style');
  globalStyle.textContent = 'a[href], button:not(:disabled) { cursor: pointer; } .breadcrumb a { cursor: pointer; }';
  document.head.appendChild(globalStyle);

  /* ── User dropdown CSS ── */
  var style = document.createElement('style');
  style.textContent = [
    '.nav-user { position:relative; cursor:pointer; user-select:none; }',
    '.user-dropdown { display:none; position:absolute; top:calc(100% + 8px); right:0; background:#fff; border:1px solid #E5E7EB; box-shadow:0 8px 24px rgba(0,0,0,0.10); min-width:180px; z-index:500; }',
    '.user-dropdown.open { display:block; }',
    '.user-dropdown-header { padding:12px 14px 10px; border-bottom:1px solid #F3F4F6; }',
    '.user-dropdown-name { font-size:13px; font-weight:600; color:#111827; }',
    '.user-dropdown-role { font-size:11px; color:#9CA3AF; margin-top:2px; }',
    '.user-dropdown-item { display:flex; align-items:center; gap:9px; padding:9px 14px; font-size:13px; color:#374151; cursor:pointer; background:none; border:none; width:100%; text-align:left; font-family:\'Inter\',sans-serif; }',
    '.user-dropdown-item:hover { background:#F9FAFB; color:#111827; }',
    '.user-dropdown-item.logout { color:#EF4444; }',
    '.user-dropdown-item.logout:hover { background:#FEF2F2; color:#DC2626; }'
  ].join('');
  document.head.appendChild(style);

  /* ── User dropdown HTML ── */
  var navUser = document.querySelector('.nav-user');
  if (navUser) {
    var roleDisplay = roleLabel(ROLE);
    var dropdown = document.createElement('div');
    dropdown.className = 'user-dropdown';
    dropdown.innerHTML =
      '<div class="user-dropdown-header">' +
        '<div class="user-dropdown-name">Steradian</div>' +
        '<div class="user-dropdown-role">' + roleDisplay + '</div>' +
      '</div>' +
      '<button class="user-dropdown-item logout" id="logout-btn">' +
        '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 2H2a1 1 0 00-1 1v8a1 1 0 001 1h3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M9.5 9.5L13 7l-3.5-2.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M13 7H5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>' +
        'Logout' +
      '</button>';
    navUser.appendChild(dropdown);

    navUser.addEventListener('click', function(e) {
      dropdown.classList.toggle('open');
      e.stopPropagation();
    });

    document.getElementById('logout-btn').addEventListener('click', function(e) {
      e.stopPropagation();
      localStorage.removeItem('quadra_role');
      window.location.href = 'login.html';
    });

    document.addEventListener('click', function() {
      dropdown.classList.remove('open');
    });
  }
})();

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape')
    document.querySelectorAll('.modal-overlay.show, .modal-backdrop.open')
      .forEach(function(m) { m.classList.remove('show', 'open'); });
});

/* ── Gear icon → Settings page ── */
(function() {
  /* The gear SVG uses viewBox="0 0 24 24"; all other navbar SVGs use "0 0 18 18" */
  document.querySelectorAll('.nav-action').forEach(function(el) {
    if (el.querySelector('svg[viewBox="0 0 24 24"]')) {
      el.style.cursor = 'pointer';
      el.title = 'Settings';
      el.addEventListener('click', function() {
        window.location.href = 'settings.html';
      });
    }
  });
})();
