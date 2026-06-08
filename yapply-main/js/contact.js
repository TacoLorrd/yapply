// Feature 3 — Contact form validation (CSE2210 Outcomes 7, 8).

var contactForm = document.getElementById('contactForm');
var formStatus = document.getElementById('formStatus');
var nameError = document.getElementById('nameError');
var emailError = document.getElementById('emailError');
var messageError = document.getElementById('messageError');

// Display a status message below the form; use success or error styling.
function showStatus(message, isError) {
  if (!formStatus) return;
  formStatus.textContent = message;
  formStatus.classList.toggle('form-status--error', !!isError);
  formStatus.classList.toggle('form-status--success', !isError && message !== '');
}

// Return true if the email contains both @ and a dot after the @.
function validateEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

// Clear all inline error messages and remove error styling from inputs.
function clearFieldErrors() {
  [nameError, emailError, messageError].forEach(function (el) {
    if (el) el.textContent = '';
  });
  ['name', 'email', 'message'].forEach(function (id) {
    var field = document.getElementById(id);
    if (field) field.classList.remove('input-error');
  });
}

// Mark a specific field as invalid and show its error message.
function setError(fieldId, errorElement, message) {
  var field = document.getElementById(fieldId);
  if (field) field.classList.add('input-error');
  if (errorElement) errorElement.textContent = message;
}

// Handle form submission: validate all fields and show success or error feedback.
if (contactForm) {
  contactForm.addEventListener('submit', function (event) {
    event.preventDefault();
    clearFieldErrors();
    showStatus('', false);

    var nameInput = document.getElementById('name');
    var emailInput = document.getElementById('email');
    var messageInput = document.getElementById('message');
    var valid = true;

    if (!nameInput.value.trim()) {
      setError('name', nameError, 'Please enter your name.');
      valid = false;
    }

    if (!emailInput.value.trim()) {
      setError('email', emailError, 'Please enter your email.');
      valid = false;
    } else if (!validateEmail(emailInput.value.trim())) {
      setError('email', emailError, 'Enter a valid email address.');
      valid = false;
    }

    if (!messageInput.value.trim()) {
      setError('message', messageError, 'Please write a message.');
      valid = false;
    } else if (messageInput.value.trim().length < 10) {
      setError('message', messageError, 'Message must be at least 10 characters.');
      valid = false;
    }

    if (!valid) {
      showStatus('Please fix the highlighted fields and try again.', true);
      return;
    }

    showStatus('Thanks! Your message is ready to send. I will reply soon.', false);
    contactForm.reset();

    // Reset the char counter if present.
    var counter = document.getElementById('charCounter');
    if (counter) counter.textContent = '0 / 500';
  });
}
