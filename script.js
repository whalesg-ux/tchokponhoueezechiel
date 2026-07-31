document.addEventListener('DOMContentLoaded', () => {
  const burger = document.querySelector('.burger');
  const navLinks = document.querySelector('.nav-links');
  const navAuth = document.querySelector('.nav-auth'); // Optionnel si vous voulez aussi inclure les boutons

  burger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    if (navAuth) {
      navAuth.classList.toggle('active');
    }
  });
});