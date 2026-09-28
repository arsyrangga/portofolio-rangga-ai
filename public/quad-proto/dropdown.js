/* QuadraNG Dropdown Component
 * Usage: QuadraDropdown.init(el, options, config)
 * Follows the sidebar.js / toast.js IIFE convention.
 *
 * Options array shapes:
 *   ['Male', 'Female']                                  — string list
 *   [{ value:'m', label:'Male' }]                       — value/label pairs
 *   [{ value:'aw', label:'Andi Wijaya', meta:'Eng',
 *      avatar:{ initials:'AW', color:'#E04A2A' } }]     — with avatar
 *
 * Config:
 *   placeholder  {string}   — shown when nothing selected (default: 'Select option')
 *   value        {string}   — pre-selected value
 *   searchable   {boolean}  — enables search input inside the panel (default: false)
 *   searchPlaceholder {string} — placeholder for search input (default: 'Search…')
 *   onChange     {function} — called as onChange(value, optionObject)
 *
 * API:
 *   QuadraDropdown.init(el, options, config)
 *   QuadraDropdown.getValue(el)      → current selectedValue or null
 *   QuadraDropdown.setValue(el, val) → set programmatically
 *   QuadraDropdown.closeAll()        → close all open dropdowns
 */
(function () {

  /* ── CSS ─────────────────────────────────────────────── */
  var CSS = [
    /* Wrapper */
    '.select-w{',
      'position:relative;width:100%;height:40px;',
      'border:1px solid #D1D5DB;background:#fff;',
      'cursor:pointer;user-select:none;',
      'transition:border-color 0.15s;box-sizing:border-box;',
    '}',
    /* States */
    '.select-w:hover:not(.open):not(.is-disabled):not(.is-error){border-color:#9CA3AF;}',
    '.select-w.open{border-color:#E04A2A;}',
    '.select-w.is-error,.select-w.error{border-color:#EF4444;}',
    '.select-w.is-disabled{background:#F9FAFB;cursor:not-allowed;pointer-events:none;border-color:#E5E7EB;}',
    /* Trigger */
    '.select-trigger{display:flex;align-items:center;justify-content:space-between;',
      'padding:0 12px;height:100%;gap:8px;pointer-events:none;}',
    /* Value span */
    '.select-val{font-size:14px;color:#111827;font-family:\'Inter\',sans-serif;',
      'flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}',
    '.select-val.placeholder{color:#9CA3AF;}',
    /* Chevron */
    '.select-chevron{flex-shrink:0;transition:transform 0.15s;}',
    '.select-w.open .select-chevron{transform:rotate(180deg);}',
    /* Options panel */
    '.select-options{',
      'display:none;position:absolute;',
      'top:calc(100% + 2px);left:-1px;width:calc(100% + 2px);',
      'background:#fff;border:1px solid #E5E7EB;',
      'box-shadow:0 4px 12px rgba(0,0,0,0.08);',
      'max-height:240px;overflow-y:auto;z-index:300;',
    '}',
    '.select-w.open .select-options{display:block;}',
    /* Searchable combobox — trigger becomes an input */
    '.select-w.searchable .select-trigger{pointer-events:auto;}',
    '.select-w.searchable .select-val-input{',
      'flex:1;min-width:0;border:none;outline:none;background:transparent;',
      'font-size:14px;color:#111827;font-family:\'Inter\',sans-serif;',
      'cursor:text;padding:0;height:100%;',
    '}',
    '.select-w.searchable .select-val-input::placeholder{color:#9CA3AF;}',
    /* No-results state */
    '.select-no-results{',
      'padding:20px 12px;font-size:13px;color:#9CA3AF;',
      'text-align:center;font-family:\'Inter\',sans-serif;',
    '}',
    /* Standard option */
    '.select-option{',
      'padding:10px 12px;font-size:14px;color:#374151;',
      'cursor:pointer;font-family:\'Inter\',sans-serif;',
    '}',
    '.select-option:hover{background:#F9FAFB;color:#111827;}',
    '.select-option.selected{color:#E04A2A;font-weight:500;background:rgba(224,74,42,0.04);}',
    /* Avatar option */
    '.select-option-emp{display:flex;align-items:center;gap:10px;padding:8px 12px;cursor:pointer;}',
    '.select-option-emp:hover{background:#F9FAFB;}',
    '.select-option-emp.selected{background:rgba(224,74,42,0.04);}',
    '.opt-avatar{width:28px;height:28px;border-radius:50%;flex-shrink:0;',
      'display:flex;align-items:center;justify-content:center;',
      'font-size:10px;font-weight:700;color:#fff;letter-spacing:-0.3px;}',
    '.opt-name{font-size:14px;font-weight:500;color:#111827;',
      'white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}',
    '.opt-meta{font-size:11px;color:#9CA3AF;margin-top:1px;}',
    '.select-option-emp.selected .opt-name{color:#E04A2A;}',
  ].join('');

  var CHEVRON = '<svg class="select-chevron" width="12" height="12" viewBox="0 0 12 12" fill="none">'
    + '<path d="M2 4l4 4 4-4" stroke="#6B7280" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>'
    + '</svg>';

  /* ── CSS injection (once) ────────────────────────────── */
  function _injectCSS() {
    if (document.getElementById('q-dropdown-style')) return;
    var s = document.createElement('style');
    s.id = 'q-dropdown-style';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  /* ── Global close-on-outside (one listener for all pages) */
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.select-w')) closeAll();
  });

  /* ── closeAll ────────────────────────────────────────── */
  function closeAll() {
    document.querySelectorAll('.select-w.open').forEach(function (el) {
      el.classList.remove('open');
    });
  }

  /* ── Normalize options ───────────────────────────────── */
  function _normalize(opts) {
    return opts.map(function (o) {
      return (typeof o === 'string') ? { value: o, label: o } : o;
    });
  }

  /* ── Build option element ────────────────────────────── */
  function _buildOptionEl(opt, selectedValue, onPick) {
    var el;
    if (opt.avatar) {
      el = document.createElement('div');
      el.className = 'select-option-emp' + (String(opt.value) === selectedValue ? ' selected' : '');
      el.dataset.value = opt.value;
      el.innerHTML =
        '<div class="opt-avatar" style="background:' + opt.avatar.color + '">' + opt.avatar.initials + '</div>'
        + '<div>'
        + '<div class="opt-name">' + opt.label + '</div>'
        + (opt.meta ? '<div class="opt-meta">' + opt.meta + '</div>' : '')
        + '</div>';
    } else {
      el = document.createElement('div');
      el.className = 'select-option' + (String(opt.value) === selectedValue ? ' selected' : '');
      el.dataset.value = opt.value;
      el.textContent = opt.label;
    }
    el.addEventListener('click', function (e) {
      e.stopPropagation();
      onPick(opt);
    });
    return el;
  }

  /* ── init ────────────────────────────────────────────── */
  function init(el, options, config) {
    if (typeof el === 'string') el = document.querySelector(el);
    if (!el) return;
    _injectCSS();

    config = config || {};
    var placeholder       = config.placeholder || 'Select option';
    var initialValue      = (config.value !== undefined && config.value !== null) ? String(config.value) : null;
    var onChange          = config.onChange || null;
    var searchable        = config.searchable === true;
    var searchPlaceholder = config.searchPlaceholder || 'Search…';

    var opts = _normalize(options);

    /* Build inner HTML */
    el.innerHTML = '';

    var initialLabel = initialValue
      ? (opts.find(function (o) { return String(o.value) === initialValue; }) || { label: initialValue }).label
      : '';

    var trigger = document.createElement('div');
    trigger.className = 'select-trigger';

    /* ── Searchable: trigger input acts as both display + search ── */
    var valInput  = null; // used when searchable
    var valSpan   = null; // used when not searchable
    var noResults = null;
    var optionEls = [];

    if (searchable) {
      el.classList.add('searchable');
      valInput = document.createElement('input');
      valInput.type = 'text';
      valInput.className = 'select-val-input';
      valInput.placeholder = placeholder;
      valInput.value = initialLabel;
      valInput.setAttribute('autocomplete', 'off');
      valInput.setAttribute('autocorrect', 'off');
      valInput.setAttribute('spellcheck', 'false');
      trigger.appendChild(valInput);
    } else {
      valSpan = document.createElement('span');
      valSpan.className = 'select-val' + (initialValue ? '' : ' placeholder');
      valSpan.textContent = initialLabel || placeholder;
      trigger.appendChild(valSpan);
    }

    trigger.insertAdjacentHTML('beforeend', CHEVRON);
    el.appendChild(trigger);

    var panel = document.createElement('div');
    panel.className = 'select-options';

    /* ── Pick handler ────────────────────────────────── */
    function _pick(opt) {
      if (searchable) {
        valInput.value = opt.label;
        /* Reset filter */
        optionEls.forEach(function (o) { o.style.display = ''; });
        if (noResults) noResults.style.display = 'none';
      } else {
        valSpan.textContent = opt.label;
        valSpan.classList.remove('placeholder');
      }
      panel.querySelectorAll('[data-value]').forEach(function (item) {
        item.classList.toggle('selected', item.dataset.value === String(opt.value));
      });
      el.dataset.selectedValue = opt.value;
      el.classList.remove('is-error', 'error');
      closeAll();
      if (onChange) onChange(opt.value, opt);
    }

    /* ── Build option elements ───────────────────────── */
    opts.forEach(function (opt) {
      var optEl = _buildOptionEl(opt, initialValue, _pick);
      if (searchable) optionEls.push(optEl);
      panel.appendChild(optEl);
    });

    if (searchable) {
      noResults = document.createElement('div');
      noResults.className = 'select-no-results';
      noResults.textContent = 'No results found';
      noResults.style.display = 'none';
      panel.appendChild(noResults);
    }

    el.appendChild(panel);

    /* Set initial selectedValue without firing onChange */
    if (initialValue !== null) el.dataset.selectedValue = initialValue;

    /* ── Searchable: wire up input events ────────────── */
    if (searchable) {
      var _prevLabel = initialLabel; // restore on Escape / blur without pick

      valInput.addEventListener('mousedown', function (e) { e.stopPropagation(); });
      valInput.addEventListener('click', function (e) {
        e.stopPropagation();
        if (!el.classList.contains('open')) {
          closeAll();
          el.classList.add('open');
          _prevLabel = valInput.value;
          valInput.select();
        }
      });

      valInput.addEventListener('input', function () {
        if (!el.classList.contains('open')) {
          closeAll();
          el.classList.add('open');
        }
        var q = this.value.trim().toLowerCase();
        var hasMatch = false;
        optionEls.forEach(function (item) {
          var text = (item.dataset.label || item.textContent).toLowerCase();
          var show = !q || text.indexOf(q) !== -1;
          item.style.display = show ? '' : 'none';
          if (show) hasMatch = true;
        });
        noResults.style.display = hasMatch ? 'none' : 'block';
      });

      valInput.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
          valInput.value = _prevLabel;
          optionEls.forEach(function (o) { o.style.display = ''; });
          noResults.style.display = 'none';
          closeAll();
        }
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          var first = optionEls.find(function (o) { return o.style.display !== 'none'; });
          if (first) first.focus();
        }
      });

      valInput.addEventListener('blur', function () {
        /* Restore previous label if user typed something but didn't pick */
        setTimeout(function () {
          if (!el.classList.contains('open')) return;
          valInput.value = _prevLabel;
          optionEls.forEach(function (o) { o.style.display = ''; });
          noResults.style.display = 'none';
        }, 150);
      });
    }

    /* ── Toggle on click ────────────────────────────────
       valInput's own click handler (searchable path, above) stops
       propagation for clicks landing directly on the text input, so this
       only ever fires for clicks elsewhere in the trigger — e.g. the
       chevron — which needs its own open behavior once searchable, or it
       silently does nothing after a value is already filled in. */
    el.onclick = function (e) {
      e.stopPropagation();
      if (el.classList.contains('is-disabled')) return;
      if (searchable) {
        var wasOpenSearchable = el.classList.contains('open');
        closeAll();
        if (!wasOpenSearchable) {
          el.classList.add('open');
          valInput.focus();
          valInput.select();
        }
        return;
      }
      var wasOpen = el.classList.contains('open');
      closeAll();
      if (!wasOpen) el.classList.add('open');
    };

    el._qdInit = true;
  }

  /* ── getValue ────────────────────────────────────────── */
  function getValue(el) {
    if (typeof el === 'string') el = document.querySelector(el);
    return el ? (el.dataset.selectedValue || null) : null;
  }

  /* ── setValue ────────────────────────────────────────── */
  function setValue(el, value) {
    if (typeof el === 'string') el = document.querySelector(el);
    if (!el || !el._qdInit) return;
    var panel = el.querySelector('.select-options');
    var item  = panel && panel.querySelector('[data-value="' + value + '"]');
    if (!item) return;
    var label = item.querySelector('.opt-name')
      ? item.querySelector('.opt-name').textContent
      : item.textContent;
    var valInput = el.querySelector('.select-val-input');
    var valSpan  = el.querySelector('.select-val');
    if (valInput) {
      valInput.value = label;
    } else if (valSpan) {
      valSpan.textContent = label;
      valSpan.classList.remove('placeholder');
    }
    panel.querySelectorAll('[data-value]').forEach(function (i) {
      i.classList.toggle('selected', i.dataset.value === String(value));
    });
    el.dataset.selectedValue = value;
  }

  window.QuadraDropdown = { init: init, getValue: getValue, setValue: setValue, closeAll: closeAll };

})();
