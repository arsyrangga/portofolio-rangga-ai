/* QuadraNG — Clock In / Clock Out Widget
 * Include this script on every page that has <div id="clockWidget">.
 * State persists across page navigation via sessionStorage.
 * Fires custom events: 'quadra-clockin' and 'quadra-clockout' on window.
 */
(function () {
  var KEY_IN = 'QUADRA_CLOCKED_IN';
  var KEY_TS = 'QUADRA_CLOCK_IN_TIME';

  var isClockedIn = sessionStorage.getItem(KEY_IN) === 'true';
  var clockInTime  = isClockedIn ? new Date(sessionStorage.getItem(KEY_TS)) : null;
  var timerInterval = null;

  /* ── Icons ── */
  var ICON_ENTER = '<path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3" stroke="#22C55E" stroke-width="1.4" stroke-linecap="round"/>'
                 + '<path d="M10 11l3-3-3-3" stroke="#22C55E" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>'
                 + '<path d="M13 8H6" stroke="#22C55E" stroke-width="1.4" stroke-linecap="round"/>';
  var ICON_EXIT  = '<path d="M8 2h3a1 1 0 011 1v10a1 1 0 01-1 1H8" stroke="#fff" stroke-width="1.4" stroke-linecap="round"/>'
                 + '<path d="M4 11l-3-3 3-3" stroke="#fff" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>'
                 + '<path d="M1 8h7" stroke="#fff" stroke-width="1.4" stroke-linecap="round"/>';

  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function fmtHMS(ms) {
    var s = Math.floor(ms / 1000);
    return pad(Math.floor(s / 3600)) + ':' + pad(Math.floor((s % 3600) / 60)) + ':' + pad(s % 60);
  }
  function fmtTime(d) { return pad(d.getHours()) + ':' + pad(d.getMinutes()); }

  /* ── Inject CSS ── */
  var style = document.createElement('style');
  style.textContent = [
    /* Widget hover micro-interactions */
    '#clockWidget{transition:background 0.15s,border-color 0.15s;}',
    '#clockWidget:not(.cw-active):hover{background:rgba(34,197,94,0.08);}',
    '#clockWidget:not(.cw-active):active{background:rgba(34,197,94,0.16);}',
    '#clockWidget.cw-active{background:#059669;border-color:#059669;}',
    '#clockWidget.cw-active span{color:#fff;}',
    '#clockWidget.cw-active:hover{background:#047857;border-color:#047857;}',
    '#clockWidget.cw-active:active{background:#065f46;border-color:#065f46;}',
    /* Modals */
    '.cw-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.35);z-index:900;align-items:center;justify-content:center;}',
    '.cw-overlay.open{display:flex;}',
    '.cw-modal{background:#fff;width:480px;max-width:calc(100vw - 40px);border:1px solid #E5E7EB;}',
    '.cw-modal-hd{padding:16px 20px;border-bottom:1px solid #E5E7EB;display:flex;align-items:center;justify-content:space-between;}',
    '.cw-modal-title{font-size:16px;font-weight:700;color:#111827;font-family:Inter,sans-serif;}',
    '.cw-close{width:28px;height:28px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#9CA3AF;background:none;border:none;font-size:16px;line-height:1;}',
    '.cw-close:hover{color:#374151;}',
    '.cw-modal-bd{padding:24px 20px;display:flex;flex-direction:column;gap:20px;}',
    '.cw-modal-bd p{font-size:14px;color:#374151;line-height:1.6;font-family:Inter,sans-serif;}',
    '.cw-btn{height:36px;padding:0 16px;border:none;cursor:pointer;font-size:13px;font-weight:500;font-family:Inter,sans-serif;display:inline-flex;align-items:center;gap:6px;transition:background 0.15s;}',
    '.cw-btn-green{background:#059669;color:#fff;}.cw-btn-green:hover{background:#047857;}',
    '.cw-btn-outline{background:#fff;border:1px solid #D1D5DB;color:#374151;}.cw-btn-outline:hover{background:#F9FAFB;}',
  ].join('');
  document.head.appendChild(style);

  /* ── Inject modal HTML ── */
  var wrap = document.createElement('div');
  wrap.innerHTML =
    '<div class="cw-overlay" id="cwModalIn">' +
      '<div class="cw-modal">' +
        '<div class="cw-modal-hd">' +
          '<div class="cw-modal-title">Clock In Confirmation</div>' +
          '<button class="cw-close" id="cwCloseIn">&#x2715;</button>' +
        '</div>' +
        '<div class="cw-modal-bd">' +
          '<p>Are you sure you want to clock in?</p>' +
          '<div><button class="cw-btn cw-btn-green" id="cwConfirmIn">Confirm Clock In</button></div>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<div class="cw-overlay" id="cwModalOut">' +
      '<div class="cw-modal">' +
        '<div class="cw-modal-hd">' +
          '<div class="cw-modal-title">Clock Out Confirmation</div>' +
          '<button class="cw-close" id="cwCloseOut">&#x2715;</button>' +
        '</div>' +
        '<div class="cw-modal-bd">' +
          '<p>Are you sure you want to clock out?</p>' +
          '<div><button class="cw-btn cw-btn-outline" id="cwConfirmOut">Confirm Clock Out</button></div>' +
        '</div>' +
      '</div>' +
    '</div>';
  document.body.appendChild(wrap);

  /* ── Modal helpers ── */
  function openModal(id)  { document.getElementById(id).classList.add('open'); }
  function closeModal(id) { document.getElementById(id).classList.remove('open'); }

  document.getElementById('cwCloseIn').addEventListener('click',  function() { closeModal('cwModalIn'); });
  document.getElementById('cwCloseOut').addEventListener('click', function() { closeModal('cwModalOut'); });
  document.getElementById('cwModalIn').addEventListener('click',  function(e) { if (e.target === this) closeModal('cwModalIn'); });
  document.getElementById('cwModalOut').addEventListener('click', function(e) { if (e.target === this) closeModal('cwModalOut'); });

  /* ── Widget DOM helpers ── */
  function getWidget() { return document.getElementById('clockWidget'); }

  function updateWidget() {
    var el = getWidget();
    if (!el) return;
    if (isClockedIn) {
      el.classList.add('cw-active');
      el.title = 'Clock Out';
      el.innerHTML =
        '<svg width="16" height="16" viewBox="0 0 16 16" fill="none">' + ICON_EXIT + '</svg>' +
        '<span id="cwTimerEl" style="font-variant-numeric:tabular-nums;white-space:nowrap;">' +
          fmtHMS(Date.now() - clockInTime.getTime()) +
        '</span>';
    } else {
      el.classList.remove('cw-active');
      el.title = 'Clock In';
      el.innerHTML =
        '<svg width="16" height="16" viewBox="0 0 16 16" fill="none">' + ICON_ENTER + '</svg>' +
        '<span style="color:#22C55E;white-space:nowrap;">Clock In</span>';
    }
  }

  function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(function () {
      var el = document.getElementById('cwTimerEl');
      if (el && clockInTime) el.textContent = fmtHMS(Date.now() - clockInTime.getTime());
    }, 1000);
  }

  /* ── Actions ── */
  function confirmClockIn() {
    isClockedIn = true;
    clockInTime = new Date();
    sessionStorage.setItem(KEY_IN, 'true');
    sessionStorage.setItem(KEY_TS, clockInTime.toISOString());
    closeModal('cwModalIn');
    updateWidget();
    startTimer();
    if (window.QuadraToast) QuadraToast.show('Clocked in at ' + fmtTime(clockInTime), 'success');
    window.dispatchEvent(new CustomEvent('quadra-clockin', { detail: { time: clockInTime } }));
  }

  function confirmClockOut() {
    var outTime  = new Date();
    var duration = outTime - clockInTime;
    isClockedIn  = false;
    clockInTime  = null;
    sessionStorage.removeItem(KEY_IN);
    sessionStorage.removeItem(KEY_TS);
    clearInterval(timerInterval);
    timerInterval = null;
    closeModal('cwModalOut');
    updateWidget();
    if (window.QuadraToast) QuadraToast.show('Clocked out at ' + fmtTime(outTime), 'success');
    window.dispatchEvent(new CustomEvent('quadra-clockout', { detail: { time: outTime, duration: duration } }));
  }

  document.getElementById('cwConfirmIn').addEventListener('click',  confirmClockIn);
  document.getElementById('cwConfirmOut').addEventListener('click', confirmClockOut);

  /* ── Init ── */
  function init() {
    var el = getWidget();
    if (!el) return;
    el.style.cursor = 'pointer';
    el.addEventListener('click', function () {
      if (!isClockedIn) openModal('cwModalIn');
      else              openModal('cwModalOut');
    });
    updateWidget();
    if (isClockedIn && clockInTime) startTimer();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
