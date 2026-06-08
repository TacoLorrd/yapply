// Feature 4 — Real-time character counter for the contact form message field.
// DOM methods used: getElementById, createElement, insertAdjacentElement, addEventListener, textContent, classList.toggle.

(function () {
  'use strict';

  var MESSAGE_MAX = 500;

  // Create and insert a live character counter below the message textarea.
  function initCharCounter() {
    var textarea = document.getElementById('message');
    if (!textarea) return;

    var counter = document.createElement('span');
    counter.id = 'charCounter';
    counter.className = 'char-counter';
    counter.setAttribute('aria-live', 'polite');
    counter.setAttribute('aria-atomic', 'true');
    counter.textContent = '0 / ' + MESSAGE_MAX;

    textarea.insertAdjacentElement('afterend', counter);

    // Update the counter text on every keystroke.
    textarea.addEventListener('input', function () {
      var len = textarea.value.length;
      counter.textContent = len + ' / ' + MESSAGE_MAX;
      counter.classList.toggle('warn', len >= MESSAGE_MAX * 0.8);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCharCounter);
  } else {
    initCharCounter();
  }
})();
