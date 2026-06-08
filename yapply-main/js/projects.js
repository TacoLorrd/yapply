// Feature 2 — Projects filter with category buttons (CSE2210 Outcomes 4, 5, 6, 7).

var ICON_BASE = new URL('images/icons/', window.location.href).href;

var LANG_ICONS = {
  html:       { file: 'icon-html.svg',       label: 'HTML' },
  css:        { file: 'icon-css.svg',        label: 'CSS' },
  javascript: { file: 'icon-javascript.svg', label: 'JavaScript' },
  python:     { file: 'icon-python.svg',     label: 'Python' },
};

// Return the absolute URL for an icon filename.
function iconSrc(file) {
  return new URL(file, ICON_BASE).href;
}

// Parse a tech string and return an HTML span with matching language icon images.
function renderTechBadges(techString) {
  var keys = [];
  if (/html/i.test(techString))                      keys.push('html');
  if (/css/i.test(techString))                       keys.push('css');
  if (/javascript|\bjs\b|json/i.test(techString))    keys.push('javascript');
  if (/python/i.test(techString))                    keys.push('python');

  if (!keys.length) return '<span>' + techString + '</span>';

  var icons = keys.map(function (key) {
    var icon = LANG_ICONS[key];
    return '<img src="' + iconSrc(icon.file) + '" alt="' + icon.label + '" width="18" height="18" />';
  }).join('');

  return '<span class="tech-badges" aria-label="' + techString + '">' + icons + '</span>';
}

var initProjects = function () {
  var projectCards  = document.getElementById('projectCards');
  var filterButtons = document.querySelectorAll('.filter-button');

  var projects = [
    {
      title: 'Maze Runner',
      category: 'interactive',
      description: 'A retro pixel-art maze game with 999 procedurally generated levels. Collect coins, spend them in a skin shop, use teleport portals, and save progress — all in one fast, dependency-free web page.',
      tech: 'HTML • CSS • JavaScript',
      image: 'images/mazelogo.png',
      url: 'https://mazeerunner.vercel.app/',
      codeLink: 'https://github.com/NebulaNoord',
    },
    {
      title: 'NebulaStudy',
      category: 'web',
      description: 'A free, privacy-first student productivity app — tasks, notes, a study planner, and Pomodoro timer with no sign-up or tracking. Everything stays on your device.',
      tech: 'HTML • CSS • JSON • JavaScript • Python',
      image: 'images/nebulastudy-1.webp',
      url: 'https://nebulaastudy.vercel.app/',
      codeLink: 'https://github.com/NebulaNoord/NebulaStudy',
    },
    {
      title: 'ShiftSync',
      category: 'web',
      description: 'A live app for tracking work shifts week by week. Log hours per day, view pay-period totals, and see gross pay, deductions, and net pay in one clear dashboard.',
      tech: 'HTML • CSS • JavaScript',
      image: 'images/logo.jpg',
      url: 'https://shiftsyncyt.vercel.app/',
      codeLink: 'https://github.com/NebulaNoord/shiftsync',
    },
  ];

  // Render project cards filtered by the given category string.
  function renderProjects(filter) {
    if (!projectCards) return;
    var active   = filter || 'all';
    var filtered = active === 'all'
      ? projects
      : projects.filter(function (p) { return p.category === active; });

    projectCards.innerHTML = filtered.map(function (project) {
      return (
        '<article class="project-card animate-on-scroll">' +
          '<img src="' + project.image + '" alt="Screenshot for ' + project.title + '" />' +
          '<div>' +
            '<h3>' + project.title + '</h3>' +
            '<p>' + project.description + '</p>' +
            '<div class="project-meta">' +
              '<span>' + project.category + '</span>' +
              renderTechBadges(project.tech) +
            '</div>' +
            '<div class="card-buttons">' +
              '<a class="button button-secondary" href="' + project.url + '" target="_blank" rel="noopener">View Project</a>' +
              '<a class="button button-secondary" href="' + project.codeLink + '" target="_blank" rel="noopener">GitHub</a>' +
            '</div>' +
          '</div>' +
        '</article>'
      );
    }).join('');

    // Trigger scroll-reveal animations on the newly rendered cards.
    if (typeof window.animateOnScroll === 'function') {
      window.animateOnScroll(projectCards.querySelectorAll('.animate-on-scroll'));
    }
  }

  // Move the 'active' class to the clicked filter button.
  function setActiveFilter(button) {
    filterButtons.forEach(function (btn) { btn.classList.remove('active'); });
    button.classList.add('active');
  }

  // Attach click listeners to each category filter button.
  if (filterButtons.length) {
    filterButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        setActiveFilter(button);
        renderProjects(button.dataset.filter);
      });
    });
  }

  renderProjects('all');
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initProjects);
} else {
  initProjects();
}
