const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');
const messageError = document.getElementById('messageError');

function showStatus(message, isError = false) {
  if (!formStatus) return;
  formStatus.textContent = message;
  formStatus.style.color = isError ? '#c53d3d' : '#2b6ef0';
}

function validateEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function clearFieldErrors() {
  [nameError, emailError, messageError].forEach((fieldError) => {
    if (fieldError) {
      fieldError.textContent = '';
    }
  });

  ['name', 'email', 'message'].forEach((fieldId) => {
    const field = document.getElementById(fieldId);
    if (field) {
      field.classList.remove('input-error');
    }
  });
}

function setError(fieldId, element, message) {
  const field = document.getElementById(fieldId);
  if (field) {
    field.classList.add('input-error');
  }
  if (element) {
    element.textContent = message;
  }
}

if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    clearFieldErrors();
    showStatus('', false);

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');

    let valid = true;

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

    showStatus('Thanks! Your message is ready to be sent. I will respond soon.');
    contactForm.reset();
  });
}
