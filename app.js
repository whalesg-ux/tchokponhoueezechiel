// ============================================================
// APP.JS — BACKEND COMPLET
// Gestion : Inscriptions, Connexions, Messages, Dashboard
// EmailJS : Public Key = 72a7hfG4OdpTjHKjx
// ============================================================

(function() {
  'use strict';

  // ============================================================
  // 0. INITIALISATION EMAILJS
  // ============================================================

  // Charger EmailJS si non présent
  if (typeof emailjs === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
    script.onload = function() {
      emailjs.init('72a7hfG4OdpTjHKjx');
      console.log('✅ EmailJS initialisé avec la clé : 72a7hfG4OdpTjHKjx');
    };
    document.head.appendChild(script);
  } else {
    emailjs.init('72a7hfG4OdpTjHKjx');
    console.log('✅ EmailJS déjà chargé, clé : 72a7hfG4OdpTjHKjx');
  }

  // ============================================================
  // 1. GESTION DES UTILISATEURS (Inscription / Connexion)
  // ============================================================

  const USERS_KEY = 'ez_users';
  const SESSION_KEY = 'ez_session';

  function getUsers() {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  }

  function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  function getCurrentUser() {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
    if (!session) return null;
    const users = getUsers();
    return users.find(u => u.id === session.userId) || null;
  }

  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }

  // ---- INSCRIPTION ----
  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const name = document.getElementById('signup-name').value.trim();
      const email = document.getElementById('signup-email').value.trim();
      const password = document.getElementById('signup-password').value;
      const errorBox = document.getElementById('signup-error');

      // Validation
      if (!name || !email || !password) {
        errorBox.textContent = "⚠️ Merci de remplir tous les champs.";
        errorBox.classList.add('show');
        return;
      }
      if (password.length < 6) {
        errorBox.textContent = "⚠️ Le mot de passe doit contenir au moins 6 caractères.";
        errorBox.classList.add('show');
        return;
      }

      const users = getUsers();

      // Vérifier si l'email existe déjà
      if (users.some(u => u.email === email)) {
        errorBox.textContent = "⚠️ Cet email est déjà utilisé.";
        errorBox.classList.add('show');
        return;
      }

      // Créer l'utilisateur
      const newUser = {
        id: generateId(),
        name: name,
        email: email,
        password: password,
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      saveUsers(users);

      // Connecter automatiquement
      localStorage.setItem(SESSION_KEY, JSON.stringify({ userId: newUser.id, email: newUser.email }));

      // Envoyer un email de bienvenue
      sendWelcomeEmail(name, email);

      // Rediriger vers le tableau de bord
      window.location.href = 'dashboard.html';
    });
  }

  // ---- CONNEXION ----
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value;
      const errorBox = document.getElementById('login-error');

      const users = getUsers();
      const user = users.find(u => u.email === email && u.password === password);

      if (user) {
        localStorage.setItem(SESSION_KEY, JSON.stringify({ userId: user.id, email: user.email }));
        window.location.href = 'dashboard.html';
      } else {
        errorBox.textContent = "❌ Email ou mot de passe incorrect.";
        errorBox.classList.add('show');
      }
    });
  }

  // ---- DÉCONNEXION ----
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      localStorage.removeItem(SESSION_KEY);
      window.location.href = 'login.html';
    });
  }

  // ---- PROTECTION DU DASHBOARD ----
  function checkAuth() {
    const session = localStorage.getItem(SESSION_KEY);
    const currentPath = window.location.pathname;

    if (!session && currentPath.includes('dashboard.html')) {
      window.location.href = 'login.html';
    }
    if (session && currentPath.includes('login.html')) {
      window.location.href = 'dashboard.html';
    }
    if (session && currentPath.includes('signup.html')) {
      window.location.href = 'dashboard.html';
    }
  }
  checkAuth();

  // Afficher le nom de l'utilisateur connecté
  const userNameEl = document.getElementById('dash-user-name');
  if (userNameEl) {
    const user = getCurrentUser();
    if (user) userNameEl.textContent = user.name;
  }

  // ============================================================
  // 2. GESTION DES MESSAGES (Contact)
  // ============================================================

  const MESSAGES_KEY = 'ez_messages';

  function getMessages() {
    return JSON.parse(localStorage.getItem(MESSAGES_KEY) || '[]');
  }

  function saveMessages(messages) {
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
  }

  // ---- ENVOI DU FORMULAIRE DE CONTACT ----
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const subject = document.getElementById('contact-subject').value.trim() || 'Sans objet';
      const message = document.getElementById('contact-message').value.trim();
      const successBox = document.getElementById('contact-success');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      // Validations
      if (!name || !email || !message) {
        alert('⚠️ Merci de remplir tous les champs obligatoires (*).');
        return;
      }
      if (!emailRegex.test(email)) {
        alert('⚠️ Merci d\'entrer une adresse email valide.');
        return;
      }

      // Enregistrer le message dans localStorage
      const messages = getMessages();
      const newMessage = {
        id: generateId(),
        name: name,
        email: email,
        subject: subject,
        message: message,
        date: new Date().toISOString(),
        read: false
      };
      messages.unshift(newMessage);
      saveMessages(messages);

      // Afficher le message de succès
      if (successBox) {
        successBox.classList.add('show');
        setTimeout(() => successBox.classList.remove('show'), 5000);
      }

      // ---- ENVOI VIA EMAILJS ----
      sendContactEmail(name, email, subject, message);

      // Réinitialiser le formulaire
      contactForm.reset();

      console.log('📩 Message enregistré :', newMessage);
    });
  }

  // ---- ENVOI D'EMAIL DE CONTACT (EmailJS) ----
  function sendContactEmail(name, email, subject, message) {
    // Attendre que EmailJS soit chargé
    function send() {
      if (typeof emailjs !== 'undefined') {
        const templateParams = {
          from_name: name,
          from_email: email,
          subject: subject,
          message: message,
          to_email: 'tchokponhoueezechiel@gmail.com'
        };

        emailjs.send(
          'service_qrkjhop',
          'template_13zhy7l',
          templateParams
        )
        .then(function(response) {
          console.log('✅ Email de contact envoyé !', response.status);
        })
        .catch(function(error) {
          console.error('❌ Erreur EmailJS (contact) :', error);
        });
      } else {
        console.log('⏳ EmailJS pas encore chargé, réessai dans 500ms...');
        setTimeout(send, 500);
      }
    }
    send();
  }

  // ---- ENVOI D'EMAIL DE BIENVENUE (EmailJS) ----
  function sendWelcomeEmail(name, email) {
    function send() {
      if (typeof emailjs !== 'undefined') {
        const templateParams = {
          to_name: name,
          to_email: email,
          subject: 'Bienvenue sur Ezechiel Design !'
        };

        emailjs.send(
          'service_qrkjhop',
          'template_welcome',
          templateParams
        )
        .then(function(response) {
          console.log('✅ Email de bienvenue envoyé !', response.status);
        })
        .catch(function(error) {
          console.error('❌ Erreur EmailJS (bienvenue) :', error);
        });
      } else {
        console.log('⏳ EmailJS pas encore chargé, réessai dans 500ms...');
        setTimeout(send, 500);
      }
    }
    send();
  }

  // ============================================================
  // 3. DASHBOARD — PROJETS & VISIONS
  // ============================================================

  const PROJECTS_KEY = 'ez_projects';
  const VISIONS_KEY = 'ez_visions';

  // Données par défaut
  const defaultProjects = [
    { id: generateId(), name: 'Logo Neekle', client: 'Neekle Studio', status: 'Terminé', date: '12/06/2026' },
    { id: generateId(), name: 'Identité visuelle Findle Client', client: 'Findle', status: 'En cours', date: '02/07/2026' },
    { id: generateId(), name: 'Charte graphique Neetale', client: 'Neetale', status: 'Terminé', date: '18/05/2026' },
  ];

  const defaultVisions = [
    'Lancer une gamme de templates de branding à vendre en ligne.',
    'Créer une série de tutoriels design sur YouTube.',
    'Collaborer avec 3 nouvelles marques locales d\'ici fin d\'année.',
  ];

  function loadProjects() {
    let projects = JSON.parse(localStorage.getItem(PROJECTS_KEY));
    if (!projects || projects.length === 0) {
      projects = defaultProjects;
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
    }
    return projects;
  }

  function loadVisions() {
    let visions = JSON.parse(localStorage.getItem(VISIONS_KEY));
    if (!visions || visions.length === 0) {
      visions = defaultVisions;
      localStorage.setItem(VISIONS_KEY, JSON.stringify(visions));
    }
    return visions;
  }

  function renderProjects() {
    const tbody = document.getElementById('projects-tbody');
    if (!tbody) return;
    const projects = loadProjects();

    tbody.innerHTML = projects.map((p, i) => `
      <tr>
        <td>${p.name}</td>
        <td>${p.client}</td>
        <td><span class="badge ${p.status === 'Terminé' ? 'badge-active' : 'badge-progress'}">${p.status}</span></td>
        <td>${p.date}</td>
        <td>
          <button class="icon-btn" onclick="window.deleteProject(${i})" title="Supprimer">🗑️</button>
        </td>
      </tr>
    `).join('');

    const statEl = document.getElementById('stat-projects');
    if (statEl) statEl.textContent = projects.length;
  }

  function renderVisions() {
    const container = document.getElementById('visions-list');
    if (!container) return;
    const visions = loadVisions();

    container.innerHTML = visions.map((v, i) => `
      <div class="vision-item">
        <p>${v}</p>
        <button class="icon-btn" onclick="window.deleteVision(${i})" title="Supprimer">🗑️ Supprimer</button>
      </div>
    `).join('');
  }

  // ---- SUPPRESSION PROJET ----
  window.deleteProject = function(index) {
    if (!confirm('Supprimer ce projet ?')) return;
    const projects = loadProjects();
    projects.splice(index, 1);
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
    renderProjects();
  };

  // ---- SUPPRESSION VISION ----
  window.deleteVision = function(index) {
    if (!confirm('Supprimer cette vision ?')) return;
    const visions = loadVisions();
    visions.splice(index, 1);
    localStorage.setItem(VISIONS_KEY, JSON.stringify(visions));
    renderVisions();
  };

  // ---- AJOUT PROJET ----
  const addProjectForm = document.getElementById('add-project-form');
  if (addProjectForm) {
    addProjectForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const name = document.getElementById('new-project-name').value.trim();
      const client = document.getElementById('new-project-client').value.trim();
      const status = document.getElementById('new-project-status').value;

      if (!name || !client) {
        alert('⚠️ Veuillez remplir tous les champs.');
        return;
      }

      const projects = loadProjects();
      projects.unshift({
        id: generateId(),
        name: name,
        client: client,
        status: status,
        date: new Date().toLocaleDateString('fr-FR')
      });
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
      renderProjects();
      addProjectForm.reset();
      const modal = document.getElementById('add-project-modal');
      if (modal) modal.style.display = 'none';
    });
  }

  // ---- AJOUT VISION ----
  const addVisionForm = document.getElementById('add-vision-form');
  if (addVisionForm) {
    addVisionForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const text = document.getElementById('new-vision-text').value.trim();

      if (!text) {
        alert('⚠️ Veuillez écrire une vision.');
        return;
      }

      const visions = loadVisions();
      visions.unshift(text);
      localStorage.setItem(VISIONS_KEY, JSON.stringify(visions));
      renderVisions();
      addVisionForm.reset();
    });
  }

  // ---- INIT DASHBOARD ----
  if (document.getElementById('projects-tbody')) {
    renderProjects();
    renderVisions();

    // Afficher le nombre de messages non lus
    const messages = getMessages();
    const unreadCount = messages.filter(m => !m.read).length;
    const notifEl = document.getElementById('notif-count');
    if (notifEl) {
      if (unreadCount > 0) {
        notifEl.textContent = unreadCount;
        notifEl.style.display = 'inline-block';
      } else {
        notifEl.style.display = 'none';
      }
    }
  }

  // ============================================================
  // 4. ADMIN — GESTION DES MESSAGES
  // ============================================================

  function renderMessages() {
    const container = document.getElementById('messages-list');
    if (!container) return;
    const messages = getMessages();

    if (messages.length === 0) {
      container.innerHTML = '<p style="color:var(--gray-400);">📭 Aucun message reçu pour le moment.</p>';
      return;
    }

    container.innerHTML = messages.map((msg, i) => `
      <div class="message-item ${msg.read ? 'read' : 'unread'}">
        <div class="msg-header">
          <strong>${msg.name}</strong>
          <span class="msg-email">${msg.email}</span>
          <span class="msg-date">${new Date(msg.date).toLocaleDateString('fr-FR')}</span>
        </div>
        <div class="msg-subject"><strong>Sujet :</strong> ${msg.subject}</div>
        <div class="msg-body">${msg.message}</div>
        <div class="msg-actions">
          <button class="btn-small" onclick="window.markAsRead(${i})">${msg.read ? '✅ Lu' : '📩 Marquer comme lu'}</button>
          <button class="btn-small btn-danger" onclick="window.deleteMessage(${i})">🗑️ Supprimer</button>
        </div>
      </div>
    `).join('');
  }

  window.markAsRead = function(index) {
    const messages = getMessages();
    if (messages[index]) {
      messages[index].read = true;
      saveMessages(messages);
      renderMessages();
      // Mettre à jour le compteur de notifications
      const unreadCount = messages.filter(m => !m.read).length;
      const notifEl = document.getElementById('notif-count');
      if (notifEl) {
        if (unreadCount > 0) {
          notifEl.textContent = unreadCount;
          notifEl.style.display = 'inline-block';
        } else {
          notifEl.style.display = 'none';
        }
      }
    }
  };

  window.deleteMessage = function(index) {
    if (!confirm('Supprimer ce message ?')) return;
    const messages = getMessages();
    messages.splice(index, 1);
    saveMessages(messages);
    renderMessages();
  };

  // ---- INIT ADMIN MESSAGES ----
  if (document.getElementById('messages-list')) {
    renderMessages();
  }

  // ============================================================
  // 5. UTILITAIRES — MENU BURGER, FILTRES, ANIMATIONS
  // ============================================================

  // --- Menu burger ---
  const burger = document.querySelector('.burger');
  const navbar = document.querySelector('.navbar');
  if (burger && navbar) {
    burger.addEventListener('click', function() {
      navbar.classList.toggle('open');
    });
    navbar.querySelectorAll('.nav-links a, .nav-auth a').forEach(el => {
      el.addEventListener('click', function() {
        navbar.classList.remove('open');
      });
    });
  }

  // --- Lien actif ---
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });

  // --- Filtres projets ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      const filter = this.dataset.filter;
      projectCards.forEach(card => {
        card.style.display = (filter === 'all' || card.dataset.category === filter) ? 'block' : 'none';
      });
    });
  });

  // --- Animation au scroll ---
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

  console.log('🚀 Application prête !');
  console.log('📧 EmailJS Public Key : 72a7hfG4OdpTjHKjx');
  console.log('📊 Données stockées dans localStorage');

})();