// Feature 1 — Dynamic greeting based on the time of day (CSE2210 Outcomes 2, 4, 5).

// Read the current hour and update the greeting element with the appropriate message.
function updateGreeting() {
  var greetingElement = document.getElementById('greeting');
  if (!greetingElement) return;

  var hour = new Date().getHours();
  var message;

  if (hour >= 5 && hour < 12) {
    message = 'Good morning!';
  } else if (hour >= 12 && hour < 17) {
    message = 'Good afternoon!';
  } else {
    message = 'Good evening!';
  }

  greetingElement.textContent = message;
}

updateGreeting();
