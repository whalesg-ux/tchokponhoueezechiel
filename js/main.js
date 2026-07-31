// ============================
// MAIN.JS — Interactions générales
// ============================

document.addEventListener('DOMContentLoaded', () => {

  // --- Menu mobile (burger) ---
  // On ouvre/ferme la navbar entière (nav-links + nav-auth réutilisent
  // les MÊMES boutons déjà présents dans le HTML, rien n'est dupliqué).
  const burger = document.querySelector('.burger');
  const navbar = document.querySelector('.navbar');

  if (burger && navbar) {
    burger.addEventListener('click', () => {
      navbar.classList.toggle('open');
    });

    // Ferme le menu automatiquement quand on clique un lien ou un bouton
    navbar.querySelectorAll('.nav-links a, .nav-auth a').forEach(el => {
      el.addEventListener('click', () => {
        navbar.classList.remove('open');
      });
    });
  }

  // --- Marquer le lien actif dans le menu selon la page ---
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });

  // --- Filtres de la page projets ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      projectCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // --- Animation légère au scroll (apparition des sections) ---
  const revealEls = document.querySelectorAll('.project-card, .testimonial-card, .stat-card');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  revealEls.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity .6s ease, transform .6s ease';
    observer.observe(el);
  });

});