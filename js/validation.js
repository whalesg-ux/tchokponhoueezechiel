// ============================
// VALIDATION.JS — Formulaire de contact
// ============================

const contactForm = document.getElementById('contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const message = document.getElementById('contact-message').value.trim();
    const successBox = document.getElementById('contact-success');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !email || !message) {
      alert("Merci de remplir tous les champs.");
      return;
    }
    if (!emailRegex.test(email)) {
      alert("Merci d'entrer une adresse email valide.");
      return;
    }

    // ⚠️ DÉMO : ici il faudra brancher un vrai envoi (EmailJS, backend, Formspree...)
    successBox.classList.add('show');
    contactForm.reset();

    setTimeout(() => successBox.classList.remove('show'), 5000);
  });
}
