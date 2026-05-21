const greetingElement = document.getElementById('greeting');

function updateGreeting() {
  const now = new Date();
  const hour = now.getHours();
  let message = 'Hello!';

  if (hour < 12) {
    message = 'Good morning!';
  } else if (hour < 17) {
    message = 'Good afternoon!';
  } else {
    message = 'Good evening!';
  }

  if (greetingElement) {
    greetingElement.textContent = message;
  }
}

updateGreeting();
