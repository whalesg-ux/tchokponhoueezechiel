// ============================
// VALIDATION.JS — Envoi via EmailJS
// ============================

// Charger la bibliothèque EmailJS (si pas encore chargée)
(function() {
  if (typeof emailjs === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
    script.onload = function() {
      // 🔑 REMPLACE PAR TA CLÉ PUBLIQUE (ex: user_abc123)
      emailjs.init('VOTRE_CLE_PUBLIQUE_EMAILJS');
    };
    document.head.appendChild(script);
  } else {
    emailjs.init('VOTRE_CLE_PUBLIQUE_EMAILJS');
  }
})();

const contactForm = document.getElementById('contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // Récupérer les champs
    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const subject = document.getElementById('contact-subject').value.trim();
    const message = document.getElementById('contact-message').value.trim();
    const successBox = document.getElementById('contact-success');

    // Regex email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validations
    if (!name || !email || !message) {
      alert("Merci de remplir tous les champs obligatoires (*).");
      return;
    }
    if (!emailRegex.test(email)) {
      alert("Merci d'entrer une adresse email valide.");
      return;
    }

    // Préparer les données pour EmailJS
    const templateParams = {
      from_name: name,
      from_email: email,
      subject: subject || "Sans objet",
      message: message
    };

    // ---- ENVOI VERS EMAILJS ----
    emailjs.send(
      'service_qrkjhop',      // ID du service (ex: service_abc123)
      'template_13zhy7l',     // ID du template (ex: template_xyz789)
      templateParams
    )
    .then(function(response) {
      console.log('✅ Email envoyé !', response.status);
      successBox.classList.add('show');
      contactForm.reset();
      setTimeout(() => successBox.classList.remove('show'), 6000);
    })
    .catch(function(error) {
      console.error('❌ Erreur EmailJS :', error);
      alert("Une erreur est survenue. Veuillez réessayer plus tard.");
    });
  });
}