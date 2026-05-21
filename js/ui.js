const navToggle = document.getElementById('navToggle');
const navigation = document.getElementById('navigation');
const header = document.querySelector('.site-header');
const currentPath = window.location.pathname.split('/').pop();

if (navToggle && navigation) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navigation.classList.toggle('open');
  });
}

const navLinks = document.querySelectorAll('.nav-list a');
if (navLinks.length) {
  navLinks.forEach((link) => {
    if (link.getAttribute('href') === currentPath || (currentPath === '' && link.getAttribute('href') === 'index.html')) {
      link.classList.add('active-link');
    }

    link.addEventListener('click', () => {
      if (navigation.classList.contains('open')) {
        navigation.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

window.addEventListener('scroll', () => {
  if (header) {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }
});

const animatedSections = document.querySelectorAll('.animate-on-scroll');

function observeAnimatedElements(elements) {
  if (!elements || !elements.length) {
    return;
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
      }
    );

    elements.forEach((section) => observer.observe(section));
  } else {
    elements.forEach((section) => section.classList.add('is-visible'));
  }
}

observeAnimatedElements(animatedSections);
window.animateOnScroll = observeAnimatedElements;

// Add a back-to-top button to the page and show it after scrolling.
(function addBackToTopButton() {
  const button = document.createElement('button');
  button.type = 'button';
  button.id = 'backToTop';
  button.className = 'back-to-top';
  button.setAttribute('aria-label', 'Scroll back to top');
  button.textContent = '↑';
  document.body.appendChild(button);

  window.addEventListener('scroll', () => {
    const showButton = window.scrollY > 300;
    button.classList.toggle('visible', showButton);
  });

  button.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();
