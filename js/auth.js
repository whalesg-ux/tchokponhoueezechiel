// ============================
// AUTH.JS — Inscription / Connexion
// ⚠️ DÉMO : utilise localStorage pour simuler un compte.
// À remplacer par une vraie authentification (Firebase Auth, ou API backend).
// ============================

// --- INSCRIPTION ---
const signupForm = document.getElementById('signup-form');
if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    const errorBox = document.getElementById('signup-error');

    if (!name || !email || !password) {
      errorBox.textContent = "Merci de remplir tous les champs.";
      errorBox.classList.add('show');
      return;
    }
    if (password.length < 6) {
      errorBox.textContent = "Le mot de passe doit contenir au moins 6 caractères.";
      errorBox.classList.add('show');
      return;
    }

    // Simule la création du compte (À REMPLACER par Firebase createUserWithEmailAndPassword)
    const user = { name, email, password };
    localStorage.setItem('ez_portfolio_user', JSON.stringify(user));

    window.location.href = 'login.html';
  });
}

// --- CONNEXION ---
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const errorBox = document.getElementById('login-error');

    const saved = JSON.parse(localStorage.getItem('ez_portfolio_user') || 'null');

    // Simule la vérification (À REMPLACER par Firebase signInWithEmailAndPassword)
    if (saved && saved.email === email && saved.password === password) {
      localStorage.setItem('ez_portfolio_session', 'true');
      window.location.href = 'dashboard.html';
    } else {
      errorBox.textContent = "Email ou mot de passe incorrect.";
      errorBox.classList.add('show');
    }
  });
}

// --- PROTECTION DU DASHBOARD ---
function checkAuth() {
  const session = localStorage.getItem('ez_portfolio_session');
  if (!session && window.location.pathname.includes('dashboard.html')) {
    window.location.href = 'login.html';
  }
}
checkAuth();

// --- DÉCONNEXION ---
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('ez_portfolio_session');
    window.location.href = 'login.html';
  });
}
