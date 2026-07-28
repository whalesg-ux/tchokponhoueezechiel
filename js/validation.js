// ============================
// VALIDATION.JS — Envoi réel via EmailJS
// ============================

// 1. Charger la bibliothèque EmailJS depuis le CDN
(function() {
  if (typeof emailjs === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
    script.onload = function() {
      emailjs.init('72a7hfG4OdpTjHKjx');
    };
    document.head.appendChild(script);
  } else {
    emailjs.init('72a7hfG4OdpTjHKjx');
  }
})();

const contactForm = document.getElementById('contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const message = document.getElementById('contact-message').value.trim();
    const successBox = document.getElementById('contact-success');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // ---- VALIDATION ----
    if (!name || !email || !message) {
      alert("Merci de remplir tous les champs.");
      return;
    }
    if (!emailRegex.test(email)) {
      alert("Merci d'entrer une adresse email valide.");
      return;
    }

    // ---- PRÉPARATION DES DONNÉES POUR EMAILJS ----
    const templateParams = {
      from_name: name,
      from_email: email,
      message: message,
      // 
    };

    // ---- ENVOI VERS EMAILJS ----
    emailjs.send(
      'service_qrkjhop',      // ID du service (ex: service_abc123)
      'template_13zhy7l',     // ID du template (ex: template_xyz789)
      templateParams
    )
    .then(function(response) {
      console.log('✅ Email envoyé !', response.status, response.text);
      successBox.classList.add('show');
      contactForm.reset();
      setTimeout(() => successBox.classList.remove('show'), 6000);
    })
    .catch(function(error) {
      console.error('❌ Erreur d\'envoi :', error);
      alert("Une erreur est survenue. Veuillez réessayer plus tard.");
    });
  });
}