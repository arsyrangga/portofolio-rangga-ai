/* QuadraNG Date Picker Component
 * Usage: QuadraDatePicker.init(el, config)
 * Follows the sidebar.js / toast.js / dropdown.js IIFE convention.
 *
 * Config:
 *   placeholder  {string}   — shown when nothing selected (default: 'Select date')
 *   value        {object}   — pre-selected date: { d, m, y }  (m is 0-based)
 *   markFuture   {boolean}  — tints future dates blue (#3B82F6), default: false
 *   onChange     {function} — called as onChange({ d, m, y, label, isFuture })
 *                             label = "31 May 2026", isFuture = true/false
 *
 * API:
 *   QuadraDatePicker.init(el, config)
 *   QuadraDatePicker.getValue(el)        → "YYYY-MM-DD" | null
 *   QuadraDatePicker.setValue(el, {d,m,y}) → set programmatically (no onChange)
 *   QuadraDatePicker.closeAll()          → close all open date pickers
 */
(function () {

  var MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  /* ── CSS ─────────────────────────────────────────────── */
  var CSS = [
    /* Wrapper */
    '.date-select-w{',
      'position:relative;width:100%;height:40px;',
      'border:1px solid #D1D5DB;background:#fff;',
      'display:flex;align-items:center;justify-content:space-between;',
      'padding:0 12px;cursor:pointer;user-select:none;',
      'transition:border-color 0.15s;box-sizing:border-box;',
    '}',
    /* States */
    '.date-select-w:hover:not(.open):not(.is-disabled):not(.is-error){border-color:#9CA3AF;}',
    '.date-select-w.open{border-color:#E04A2A;}',
    '.date-select-w.is-error,.date-select-w.error{border-color:#EF4444;}',
    '.date-select-w.is-disabled{background:#F9FAFB;cursor:not-allowed;pointer-events:none;border-color:#E5E7EB;}',
    /* Label */
    '.dp-label{',
      'font-size:14px;font-weight:400;color:#111827;',
      'font-family:\'Inter\',sans-serif;',
      'flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;',
    '}',
    '.dp-label.placeholder{color:#9CA3AF;}',
    /* Calendar panel */
    '.calendar-panel{',
      'position:absolute;top:calc(100% + 2px);left:0;width:260px;',
      'background:#fff;border:1px solid #D1D5DB;',
      'z-index:300;box-shadow:0 4px 12px rgba(0,0,0,0.08);',
      'display:none;padding:14px;box-sizing:border-box;',
    '}',
    '.calendar-panel.open{display:block;}',
    /* Calendar controls */
    '.cal-nav-btn{background:none;border:none;cursor:pointer;font-size:20px;color:#374151;padding:0 4px;line-height:1;font-family:\'Inter\',sans-serif;}',
    '.cal-nav-btn:hover{color:#111827;}',
    '.cal-row{display:flex;}',
    '.cal-cell{flex:0 0 calc(100% / 7);text-align:center;}',
    '.cal-header{font-size:11px;color:#9CA3AF;padding:4px 0 6px;font-family:\'Inter\',sans-serif;}',
    '.cal-day{background:none;border:none;cursor:pointer;width:100%;color:#111827;padding:5px 0;font-family:\'Inter\',sans-serif;font-size:13px;}',
    '.cal-day:hover{background:#F9FAFB;}',
    '.cal-day.cal-today{color:#E04A2A;font-weight:600;}',
    '.cal-day.cal-selected{background:#E04A2A;color:#fff;border-radius:50%;}',
    '.cal-day.cal-future{color:#3B82F6;}',
    '.cal-day.cal-selected.cal-future{background:#3B82F6;color:#fff;}',
    /* Clickable month / year title labels */
    '.cal-title-btn{background:none;border:none;border-bottom:1px dotted #9CA3AF;cursor:pointer;',
      'font-size:13px;font-weight:600;color:#111827;font-family:\'Inter\',sans-serif;',
      'padding:0 2px;line-height:1.3;}',
    '.cal-title-btn:hover{color:#E04A2A;border-bottom-color:#E04A2A;}',
    /* Month / year grid */
    '.cal-grid{display:flex;flex-wrap:wrap;gap:4px;padding-top:4px;}',
    '.cal-grid-cell{width:calc(33.33% - 3px);}',
    '.cal-grid-btn{padding:7px 0;font-size:12px;font-family:\'Inter\',sans-serif;border:none;',
      'cursor:pointer;border-radius:2px;width:100%;background:none;color:#111827;}',
    '.cal-grid-btn:hover{background:#F9FAFB;}',
    '.cal-grid-btn.cal-grid-sel{background:#E04A2A;color:#fff;}',
  ].join('');

  var CALENDAR_ICON = '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" style="flex-shrink:0">'
    + '<rect x="1" y="2" width="14" height="13" rx="1" stroke="#9CA3AF" stroke-width="1.4"/>'
    + '<path d="M1 6h14" stroke="#9CA3AF" stroke-width="1.4"/>'
    + '<path d="M5 1v2M11 1v2" stroke="#9CA3AF" stroke-width="1.4" stroke-linecap="round"/>'
    + '</svg>';

  /* ── CSS injection (once) ────────────────────────────── */
  function _injectCSS() {
    if (document.getElementById('q-datepicker-style')) return;
    var s = document.createElement('style');
    s.id = 'q-datepicker-style';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  /* ── Global close-on-outside (one listener for all pages) */
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.date-select-w')) closeAll();
  });

  /* ── closeAll ────────────────────────────────────────── */
  function closeAll() {
    document.querySelectorAll('.date-select-w.open').forEach(function (el) {
      el.classList.remove('open');
    });
    document.querySelectorAll('.calendar-panel.open').forEach(function (p) {
      p.classList.remove('open');
    });
  }

  /* ── Helpers ─────────────────────────────────────────── */
  function _pad(n) { return n < 10 ? '0' + n : String(n); }

  function _toISO(d, m, y) {
    return y + '-' + _pad(m + 1) + '-' + _pad(d);
  }

  function _formatLabel(d, m, y) {
    return d + ' ' + MONTHS[m] + ' ' + y;
  }

  /* ── init ────────────────────────────────────────────── */
  function init(el, config) {
    if (typeof el === 'string') el = document.querySelector(el);
    if (!el) return;
    _injectCSS();

    config = config || {};
    var placeholder  = config.placeholder || 'Select date';
    var markFuture   = !!config.markFuture;
    var onChange     = config.onChange || null;
    var initialVal   = config.value || null;

    /* Build trigger */
    el.innerHTML = '';

    var labelSpan = document.createElement('span');
    labelSpan.className = 'dp-label' + (initialVal ? '' : ' placeholder');
    labelSpan.textContent = initialVal
      ? _formatLabel(initialVal.d, initialVal.m, initialVal.y)
      : placeholder;
    el.appendChild(labelSpan);
    el.insertAdjacentHTML('beforeend', CALENDAR_ICON);

    var panel = document.createElement('div');
    panel.className = 'calendar-panel';
    el.appendChild(panel);

    var now = new Date();
    var initY = initialVal ? initialVal.y : now.getFullYear();
    var cal = {
      view:           'days',
      month:          initialVal ? initialVal.m    : now.getMonth(),
      year:           initY,
      yearRangeStart: Math.floor(initY / 12) * 12,
      selected:       initialVal ? { d: initialVal.d, m: initialVal.m, y: initialVal.y } : null
    };

    if (initialVal) {
      el.dataset.selectedValue = _toISO(initialVal.d, initialVal.m, initialVal.y);
    } else {
      delete el.dataset.selectedValue;
    }

    /* ── Inner builder helpers ── */

    function makeNav(prevFn, titleEl, nextFn) {
      var nav = document.createElement('div');
      nav.style.cssText = 'display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;';
      var prev = document.createElement('button');
      prev.type = 'button'; prev.className = 'cal-nav-btn'; prev.innerHTML = '&#8249;';
      prev.addEventListener('click', function (e) { e.stopPropagation(); prevFn(); render(); });
      var next = document.createElement('button');
      next.type = 'button'; next.className = 'cal-nav-btn'; next.innerHTML = '&#8250;';
      next.addEventListener('click', function (e) { e.stopPropagation(); nextFn(); render(); });
      nav.appendChild(prev);
      nav.appendChild(titleEl);
      nav.appendChild(next);
      return nav;
    }

    function titleBtn(text, onClick) {
      var btn = document.createElement('button');
      btn.type = 'button'; btn.className = 'cal-title-btn'; btn.textContent = text;
      btn.addEventListener('click', function (e) { e.stopPropagation(); onClick(); render(); });
      return btn;
    }

    function gridBtn(label, selected, onClick) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'cal-grid-btn' + (selected ? ' cal-grid-sel' : '');
      btn.textContent = label;
      btn.addEventListener('click', function (e) { e.stopPropagation(); onClick(); render(); });
      return btn;
    }

    /* ── View renderers ── */

    function renderDays() {
      var titleWrap = document.createElement('div');
      titleWrap.style.cssText = 'display:flex;align-items:center;gap:4px;';
      titleWrap.appendChild(titleBtn(MONTHS[cal.month], function () { cal.view = 'months'; }));
      titleWrap.appendChild(titleBtn(String(cal.year),  function () { cal.view = 'years';  }));

      panel.appendChild(makeNav(
        function () { if (--cal.month < 0)  { cal.month = 11; cal.year--; } },
        titleWrap,
        function () { if (++cal.month > 11) { cal.month = 0;  cal.year++; } }
      ));

      /* Day headers */
      var hRow = document.createElement('div'); hRow.className = 'cal-row';
      ['Su','Mo','Tu','We','Th','Fr','Sa'].forEach(function (d) {
        var c = document.createElement('div'); c.className = 'cal-cell cal-header'; c.textContent = d;
        hRow.appendChild(c);
      });
      panel.appendChild(hRow);

      /* Day grid */
      var firstDay = new Date(cal.year, cal.month, 1).getDay();
      var total    = new Date(cal.year, cal.month + 1, 0).getDate();
      var today    = new Date();
      var row = document.createElement('div'); row.className = 'cal-row';
      var col = 0;

      for (var b = 0; b < firstDay; b++) {
        row.appendChild(Object.assign(document.createElement('div'), { className: 'cal-cell' }));
        col++;
      }

      for (var dd = 1; dd <= total; dd++) {
        if (col > 0 && col % 7 === 0) {
          panel.appendChild(row);
          row = document.createElement('div'); row.className = 'cal-row';
        }
        var btn = document.createElement('button');
        btn.type = 'button'; btn.className = 'cal-cell cal-day'; btn.textContent = dd;

        var cellDate = new Date(cal.year, cal.month, dd);
        var isSel = cal.selected
          && cal.selected.d === dd
          && cal.selected.m === cal.month
          && cal.selected.y === cal.year;
        var isTdy = dd === today.getDate()
          && cal.month === today.getMonth()
          && cal.year  === today.getFullYear();
        var isFut = cellDate > today && !isTdy;

        if (markFuture && isFut) btn.classList.add('cal-future');
        if (isSel)      btn.classList.add('cal-selected');
        else if (isTdy) btn.classList.add('cal-today');

        (function (day, future) {
          btn.addEventListener('click', function (e) {
            e.stopPropagation();
            cal.selected = { d: day, m: cal.month, y: cal.year };
            var lbl = _formatLabel(day, cal.month, cal.year);
            labelSpan.textContent = lbl;
            labelSpan.classList.remove('placeholder');
            el.dataset.selectedValue = _toISO(day, cal.month, cal.year);
            el.classList.remove('is-error', 'error');
            closeAll();
            if (onChange) onChange({ d: day, m: cal.month, y: cal.year, label: lbl, isFuture: future });
          });
        })(dd, isFut);

        row.appendChild(btn); col++;
      }
      panel.appendChild(row);
    }

    function renderMonths() {
      panel.appendChild(makeNav(
        function () { cal.year--; },
        titleBtn(String(cal.year), function () { cal.view = 'years'; }),
        function () { cal.year++; }
      ));
      var grid = document.createElement('div'); grid.className = 'cal-grid';
      MONTHS.forEach(function (m, i) {
        var cell = document.createElement('div'); cell.className = 'cal-grid-cell';
        cell.appendChild(gridBtn(m.slice(0, 3), i === cal.month, function (idx) {
          return function () { cal.month = idx; cal.view = 'days'; };
        }(i)));
        grid.appendChild(cell);
      });
      panel.appendChild(grid);
    }

    function renderYears() {
      var rangeEnd = cal.yearRangeStart + 11;
      var rangeLabel = document.createElement('span');
      rangeLabel.style.cssText = 'font-size:13px;font-weight:600;color:#111827;font-family:Inter,sans-serif;';
      rangeLabel.textContent = cal.yearRangeStart + ' – ' + rangeEnd;
      panel.appendChild(makeNav(
        function () { cal.yearRangeStart -= 12; },
        rangeLabel,
        function () { cal.yearRangeStart += 12; }
      ));
      var grid = document.createElement('div'); grid.className = 'cal-grid';
      for (var y = cal.yearRangeStart; y <= rangeEnd; y++) {
        var cell = document.createElement('div'); cell.className = 'cal-grid-cell';
        cell.appendChild(gridBtn(String(y), y === cal.year, function (yr) {
          return function () { cal.year = yr; cal.view = 'months'; };
        }(y)));
        grid.appendChild(cell);
      }
      panel.appendChild(grid);
    }

    function render() {
      panel.innerHTML = '';
      if (cal.view === 'months') { renderMonths(); return; }
      if (cal.view === 'years')  { renderYears();  return; }
      renderDays();
    }

    /* Toggle on click */
    el.addEventListener('click', function (e) {
      e.stopPropagation();
      if (el.classList.contains('is-disabled')) return;
      var wasOpen = panel.classList.contains('open');
      closeAll();
      if (!wasOpen) { cal.view = 'days'; render(); panel.classList.add('open'); el.classList.add('open'); }
    });

    el._qdpInit  = true;
    el._qdpState = cal;
  }

  /* ── getValue ────────────────────────────────────────── */
  function getValue(el) {
    if (typeof el === 'string') el = document.querySelector(el);
    return el ? (el.dataset.selectedValue || null) : null;
  }

  /* ── setValue ────────────────────────────────────────── */
  function setValue(el, val) {
    if (typeof el === 'string') el = document.querySelector(el);
    if (!el || !el._qdpInit || !val) return;
    var labelSpan = el.querySelector('.dp-label');
    if (!labelSpan) return;
    var lbl = _formatLabel(val.d, val.m, val.y);
    labelSpan.textContent = lbl;
    labelSpan.classList.remove('placeholder');
    el.dataset.selectedValue = _toISO(val.d, val.m, val.y);
    if (el._qdpState) {
      el._qdpState.selected = { d: val.d, m: val.m, y: val.y };
      el._qdpState.month = val.m;
      el._qdpState.year  = val.y;
    }
  }

  window.QuadraDatePicker = { init: init, getValue: getValue, setValue: setValue, closeAll: closeAll };

})();
