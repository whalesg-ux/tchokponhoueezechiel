// ============================
// DASHBOARD.JS — Projets & Visions
// ⚠️ DÉMO : données stockées en localStorage.
// À remplacer par une vraie base de données (Firestore / MongoDB).
// ============================

const defaultProjects = [
  { name: "Logo Neekle", client: "Neekle Studio", status: "Terminé", date: "12/06/2026" },
  { name: "Identité visuelle Findle Client", client: "Findle", status: "En cours", date: "02/07/2026" },
  { name: "Charte graphique Neetale", client: "Neetale", status: "Terminé", date: "18/05/2026" },
];

const defaultVisions = [
  "Lancer une gamme de templates de branding à vendre en ligne.",
  "Créer une série de tutoriels design sur YouTube.",
  "Collaborer avec 3 nouvelles marques locales d'ici fin d'année.",
];

function loadProjects() {
  let projects = JSON.parse(localStorage.getItem('ez_projects'));
  if (!projects) {
    projects = defaultProjects;
    localStorage.setItem('ez_projects', JSON.stringify(projects));
  }
  return projects;
}

function loadVisions() {
  let visions = JSON.parse(localStorage.getItem('ez_visions'));
  if (!visions) {
    visions = defaultVisions;
    localStorage.setItem('ez_visions', JSON.stringify(visions));
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
        <button class="icon-btn" onclick="deleteProject(${i})" title="Supprimer">🗑️</button>
      </td>
    </tr>
  `).join('');

  document.getElementById('stat-projects').textContent = projects.length;
}

function renderVisions() {
  const container = document.getElementById('visions-list');
  if (!container) return;
  const visions = loadVisions();

  container.innerHTML = visions.map((v, i) => `
    <div class="vision-item">
      <p>${v}</p>
      <button class="icon-btn" onclick="deleteVision(${i})" title="Supprimer">🗑️ Supprimer</button>
    </div>
  `).join('');
}

function deleteProject(index) {
  const projects = loadProjects();
  projects.splice(index, 1);
  localStorage.setItem('ez_projects', JSON.stringify(projects));
  renderProjects();
}

function deleteVision(index) {
  const visions = loadVisions();
  visions.splice(index, 1);
  localStorage.setItem('ez_visions', JSON.stringify(visions));
  renderVisions();
}

// --- Ajout d'un nouveau projet ---
const addProjectForm = document.getElementById('add-project-form');
if (addProjectForm) {
  addProjectForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('new-project-name').value.trim();
    const client = document.getElementById('new-project-client').value.trim();
    const status = document.getElementById('new-project-status').value;
    if (!name || !client) return;

    const projects = loadProjects();
    projects.unshift({ name, client, status, date: new Date().toLocaleDateString('fr-FR') });
    localStorage.setItem('ez_projects', JSON.stringify(projects));
    renderProjects();
    addProjectForm.reset();
    document.getElementById('add-project-modal').style.display = 'none';
  });
}

// --- Ajout d'une nouvelle vision ---
const addVisionForm = document.getElementById('add-vision-form');
if (addVisionForm) {
  addVisionForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = document.getElementById('new-vision-text').value.trim();
    if (!text) return;

    const visions = loadVisions();
    visions.unshift(text);
    localStorage.setItem('ez_visions', JSON.stringify(visions));
    renderVisions();
    addVisionForm.reset();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderProjects();
  renderVisions();

  // Afficher le nom de l'utilisateur connecté
  const user = JSON.parse(localStorage.getItem('ez_portfolio_user') || 'null');
  const userNameEl = document.getElementById('dash-user-name');
  if (user && userNameEl) userNameEl.textContent = user.name;
});
