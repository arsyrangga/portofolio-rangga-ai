/* QuadraNG Toast Component
 * Usage: QuadraToast.show(message, type)
 * type: 'success' (default) | 'error' | 'warning' | 'info'
 */
(function() {
  var CSS = [
    '.q-toast{',
      'position:fixed;top:28px;right:28px;z-index:2000;',
      'display:flex;align-items:flex-start;gap:12px;',
      'background:#fff;border:1px solid #E5E7EB;',
      'box-shadow:0 8px 24px rgba(0,0,0,0.12);',
      'padding:14px 16px;min-width:300px;max-width:400px;',
      'transform:translateX(calc(100% + 28px));',
      'transition:transform 0.4s cubic-bezier(0.16,1,0.3,1);',
      'pointer-events:none;',
    '}',
    '.q-toast.q-toast--show{transform:translateX(0);pointer-events:auto;}',
    '.q-toast__icon{width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px;}',
    '.q-toast__body{flex:1;min-width:0;}',
    '.q-toast__title{font-size:14px;font-weight:600;color:#111827;font-family:Inter,sans-serif;}',
    '.q-toast__close{background:none;border:none;cursor:pointer;color:#9CA3AF;padding:0;flex-shrink:0;display:flex;align-items:center;}',
    '.q-toast__close:hover{color:#374151;}'
  ].join('');

  var TYPES = {
    success: {
      bg:   '#DCFCE7',
      icon: '<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l2.5 2.5 5.5-5" stroke="#16A34A" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    },
    error: {
      bg:   '#FEE2E2',
      icon: '<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 3l6 6M9 3l-6 6" stroke="#DC2626" stroke-width="1.6" stroke-linecap="round"/></svg>'
    },
    warning: {
      bg:   '#FEF9C3',
      icon: '<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 4v3M6 8.5v.5" stroke="#CA8A04" stroke-width="1.6" stroke-linecap="round"/></svg>'
    },
    info: {
      bg:   '#DBEAFE',
      icon: '<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 5.5v3M6 3.5v.5" stroke="#2563EB" stroke-width="1.6" stroke-linecap="round"/></svg>'
    }
  };

  var CLOSE_SVG = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="#9CA3AF" stroke-width="1.5" stroke-linecap="round"/></svg>';

  var _el, _timer;

  function _inject() {
    if (document.getElementById('q-toast-style')) return;
    var style = document.createElement('style');
    style.id = 'q-toast-style';
    style.textContent = CSS;
    document.head.appendChild(style);

    _el = document.createElement('div');
    _el.className = 'q-toast';
    _el.setAttribute('role', 'alert');
    _el.setAttribute('aria-live', 'assertive');
    _el.innerHTML =
      '<div class="q-toast__icon"></div>' +
      '<div class="q-toast__body"><div class="q-toast__title"></div></div>' +
      '<button class="q-toast__close" aria-label="Dismiss">' + CLOSE_SVG + '</button>';

    _el.querySelector('.q-toast__close').addEventListener('click', function() {
      dismiss();
    });

    document.body.appendChild(_el);
  }

  function show(message, type) {
    _inject();
    clearTimeout(_timer);

    var t = TYPES[type] || TYPES.success;
    var iconEl = _el.querySelector('.q-toast__icon');
    iconEl.style.background = t.bg;
    iconEl.innerHTML = t.icon;

    _el.querySelector('.q-toast__title').textContent = message || '';
    _el.classList.remove('q-toast--show');
    _el.style.transition = '';
    void _el.offsetWidth;
    _el.style.transition = 'transform 0.4s cubic-bezier(0.16,1,0.3,1)';
    _el.classList.add('q-toast--show');
    _timer = setTimeout(dismiss, 4000);
  }

  function dismiss() {
    if (!_el) return;
    clearTimeout(_timer);
    _el.style.transition = 'transform 0.4s cubic-bezier(0.4,0,1,1)';
    _el.classList.remove('q-toast--show');
    _el.addEventListener('transitionend', function _reset() {
      _el.removeEventListener('transitionend', _reset);
      _el.style.transition = '';
    });
  }

  window.QuadraToast = { show: show, dismiss: dismiss };

  /* Auto-show after onboarding submit */
  document.addEventListener('DOMContentLoaded', function() {
    if (!localStorage.getItem('quadra_onboarding_success')) return;
    localStorage.removeItem('quadra_onboarding_success');
    show('Employee data has been saved successfully.', 'success');
  });
})();
