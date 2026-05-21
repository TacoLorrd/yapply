const initProjects = () => {
  const projectCards = document.getElementById('projectCards');
  const filterButtons = document.querySelectorAll('.filter-button');

  const projects = [
    {
      title: 'School Club Landing Page',
      category: 'design',
      description: 'A clean, responsive landing page created for a community club using semantic HTML and CSS Grid.',
      tech: 'HTML • CSS • Responsive',
      image: 'images/project-brand.svg',
      url: 'https://example.com',
      codeLink: 'https://github.com/',
    },
    {
      title: 'Study Planner App UI',
      category: 'interactive',
      description: 'A mockup of a study planner with interactive tabs and a polished layout.',
      tech: 'HTML • CSS • JavaScript',
      image: 'images/project-app.svg',
      url: 'https://example.com',
      codeLink: 'https://github.com/',
    },
    {
      title: 'Portfolio Website',
      category: 'web',
      description: 'A portfolio page built from scratch with organized sections and accessible navigation.',
      tech: 'HTML • CSS • JavaScript',
      image: 'images/project-web.svg',
      url: 'https://example.com',
      codeLink: 'https://github.com/',
    },
  ];

  function renderProjects(filter = 'all') {
    if (!projectCards) {
      return;
    }

    const filtered = filter === 'all' ? projects : projects.filter((item) => item.category === filter);
    projectCards.innerHTML = filtered
      .map(
        (project) => `
          <article class="project-card animate-on-scroll">
            <img src="${project.image}" alt="Thumbnail for ${project.title}" />
            <div>
              <h3>${project.title}</h3>
              <p>${project.description}</p>
              <div class="project-meta">
                <span>${project.category}</span>
                <span>${project.tech}</span>
              </div>
              <div class="card-buttons">
                <a class="button button-secondary" href="${project.url}" target="_blank" rel="noopener">View Project</a>
                <a class="button button-secondary" href="${project.codeLink}" target="_blank" rel="noopener">GitHub</a>
              </div>
            </div>
          </article>
        `
      )
      .join('');
  }

  function setActiveFilter(button) {
    filterButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');
  }

  if (filterButtons.length) {
    filterButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const filter = button.dataset.filter;
        setActiveFilter(button);
        renderProjects(filter);
      });
    });
  }

  renderProjects();
  if (window.animateOnScroll) {
    window.animateOnScroll(document.querySelectorAll('.animate-on-scroll'));
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initProjects);
} else {
  initProjects();
}
