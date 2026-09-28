/* QuadraFileUpload Component
 * Usage: QuadraFileUpload.init(el, config)
 * config: { onChange: function(file|null) }
 * Follows the sidebar.js / toast.js / dropdown.js IIFE convention.
 *
 * API (returned by init):
 *   getFile()          → currently selected File, or null
 *   clear()            → clears selection, resets to empty state
 *   setError(bool)      → toggles the .is-error border
 */
(function () {

  function init(el, config) {
    config = config || {};
    var input = el.querySelector('.file-upload-input');
    var nameEl = el.querySelector('.file-upload-name');
    var removeBtn = el.querySelector('.file-upload-remove');

    function setFile(file) {
      if (file) {
        el.classList.add('has-file');
        el.classList.remove('is-error');
        nameEl.textContent = file.name;
      } else {
        el.classList.remove('has-file');
        nameEl.textContent = '';
      }
      if (config.onChange) config.onChange(file);
    }

    input.addEventListener('change', function () {
      setFile(input.files && input.files[0] ? input.files[0] : null);
    });

    removeBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      input.value = '';
      setFile(null);
    });

    el.addEventListener('dragover', function (e) {
      if (el.classList.contains('has-file')) return;
      e.preventDefault();
      el.classList.add('is-dragging');
    });
    el.addEventListener('dragleave', function () {
      el.classList.remove('is-dragging');
    });
    el.addEventListener('drop', function (e) {
      if (el.classList.contains('has-file')) return;
      e.preventDefault();
      el.classList.remove('is-dragging');
      var file = e.dataTransfer.files && e.dataTransfer.files[0];
      if (file) {
        input.files = e.dataTransfer.files;
        setFile(file);
      }
    });

    return {
      getFile: function () { return input.files && input.files[0] ? input.files[0] : null; },
      clear: function () { input.value = ''; setFile(null); },
      setError: function (hasError) { el.classList.toggle('is-error', !!hasError); }
    };
  }

  window.QuadraFileUpload = { init: init };

})();
