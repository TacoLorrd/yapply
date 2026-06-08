// ui.js — Shared UI behaviour: nav toggle, active links, scroll animations, smooth anchors, back-to-top.

var mobileMenuBtn  = document.getElementById('mobileMenuBtn');
var mobileDropdown = document.getElementById('mobileDropdown');
var currentPath    = window.location.pathname.split('/').pop() || 'index.html';

// Mobile nav toggle
if (mobileMenuBtn && mobileDropdown) {
  mobileMenuBtn.addEventListener('click', function (event) {
    event.stopPropagation();
    var isOpen = mobileDropdown.classList.contains('open');
    mobileDropdown.classList.toggle('open', !isOpen);
    mobileMenuBtn.setAttribute('aria-expanded', String(!isOpen));
    document.body.style.overflow = isOpen ? '' : 'hidden';
  });

  document.addEventListener('click', function (event) {
    if (!mobileMenuBtn.contains(event.target) && !mobileDropdown.contains(event.target)) {
      if (mobileDropdown.classList.contains('open')) {
        mobileDropdown.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && mobileDropdown.classList.contains('open')) {
      mobileDropdown.classList.remove('open');
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      mobileMenuBtn.focus();
    }
  });
}

// Mark active nav link and close mobile menu on link click.
var allNavLinks = document.querySelectorAll('.desktop-nav a, .mobile-dropdown a');
allNavLinks.forEach(function (link) {
  var href = link.getAttribute('href');
  if (href === currentPath || (currentPath === '' && href === 'index.html')) {
    link.classList.add('active-link');
  }
  link.addEventListener('click', function () {
    if (mobileDropdown && mobileDropdown.classList.contains('open')) {
      mobileDropdown.classList.remove('open');
      if (mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
});

// Fade-in elements that carry the animate-on-scroll class.
function observeAnimatedElements(elements) {
  if (!elements || !elements.length) return;

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    elements.forEach(function (el) { observer.observe(el); });
  } else {
    elements.forEach(function (el) { el.classList.add('is-visible'); });
  }
}

window.animateOnScroll = observeAnimatedElements;
observeAnimatedElements(document.querySelectorAll('.animate-on-scroll'));

// Smooth-scroll for in-page anchor links; respects prefers-reduced-motion.
document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
  anchor.addEventListener('click', function (event) {
    var targetId = anchor.getAttribute('href');
    if (!targetId || targetId === '#') return;
    var target = document.querySelector(targetId);
    if (!target) return;
    event.preventDefault();
    var noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: noMotion ? 'auto' : 'smooth', block: 'start' });
  });
});

// Back-to-top button — Feature 4 (CSE2210 Outcomes 4, 5, 6, 7).
(function addBackToTopButton() {
  var button = document.createElement('button');
  button.type = 'button';
  button.id = 'backToTop';
  button.className = 'back-to-top';
  button.setAttribute('aria-label', 'Scroll back to top');
  button.textContent = '↑';
  document.body.appendChild(button);

  window.addEventListener('scroll', function () {
    button.classList.toggle('visible', window.scrollY > 300);
  });

  button.addEventListener('click', function () {
    var noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: noMotion ? 'auto' : 'smooth' });
  });
})();
