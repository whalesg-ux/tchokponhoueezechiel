# Portfolio — Tchokponhoue Ezechiel

## 📁 Images à remplacer (dossier `/images`)

Tous les liens d'images sont des **liens factices** (`images/nom-fichier.jpg`).
Place tes vraies photos dans le dossier `images/` avec **exactement les mêmes noms**
ci-dessous, ou modifie le `src=""` dans chaque fichier HTML.

| Nom de fichier attendu | Utilisé dans | Description |
|---|---|---|
| `logo-ezechiel.png` | toutes les pages | Ton logo (carré, fond transparent conseillé) |
| `hero-background-city.jpg` | style.css (fond du hero) | Photo de fond ville/nuit |
| `hero-portrait.jpg` | index.html | Ta photo portrait pro (grand format) |
| `narroq-team.jpg` | style.css (`.narroq-track`) | Image équipe/produit Narroq, animée en va-et-vient |
| `project-neekle.jpg` | index.html, projects.html | Visuel du projet Neekle |
| `project-findle.jpg` | index.html, projects.html | Visuel du projet Findle |
| `project-neetale.jpg` | index.html, projects.html | Visuel du projet Neetale |
| `project-swiftlogic.jpg` | projects.html | Visuel projet SwiftLogic |
| `project-urbanfit.jpg` | projects.html | Visuel projet UrbanFit |
| `project-marketpro.jpg` | projects.html | Visuel projet MarketPro |
| `client-kati.jpg` | index.html, testimonials.html | Photo client Kati |
| `client-keunimen.jpg` | index.html, testimonials.html | Photo client Keunimen |
| `client-aviin.jpg` | index.html, testimonials.html | Photo client Aviin |
| `client-melissa.jpg` | testimonials.html | Photo cliente Melissa |
| `client-ronald.jpg` | testimonials.html | Photo client Ronald |
| `client-sophia.jpg` | testimonials.html | Photo cliente Sophia |
| `about-portrait.jpg` | about.html | Ta photo pour la page À propos |
| `dashboard-avatar.jpg` | dashboard.html | Ta photo de profil (petit format rond) |

## ⚠️ Important — Authentification & Dashboard

Le système de connexion/inscription actuel utilise **localStorage** (stockage
du navigateur) uniquement pour la démonstration. Cela veut dire :
- Ce n'est **pas sécurisé** pour un vrai lancement public
- Les données sont perdues si le cache du navigateur est vidé
- Chaque visiteur aurait son propre "compte" local, pas un vrai compte partagé

**Pour la version finale**, remplace `js/auth.js` et `js/dashboard.js` par une vraie
connexion à **Firebase Auth + Firestore** (ou ton propre backend). Je peux t'aider
à faire cette étape quand tu seras prêt.

## 🔤 Polices personnalisées (dossier `/fonts`)

Place tes fichiers de police dans `fonts/` avec ces noms exacts :
- `Qalinka.woff2` (ou `.otf`) → utilisée pour le grand titre du hero
- `Javinra.woff2` (ou `.otf`) → utilisée pour tous les titres de section
- `Panigale.woff2` (ou `.otf`) → utilisée pour les sous-titres, citations, badges
- **Poppins Bold** est chargée automatiquement via Google Fonts → utilisée pour les boutons, le menu, et en secours si les 3 polices ci-dessus sont absentes

Tant que tes fichiers ne sont pas ajoutés, le site reste fonctionnel grâce au fallback Poppins.

## 🎬 Image animée Narroq (va-et-vient)

Une bannière avec animation "aller-retour" a été ajoutée sur `index.html` juste après le hero.
Remplace `images/narroq-team.jpg` par ta photo d'équipe/produit Narroq (dans `css/style.css`,
cherche la classe `.narroq-track`). L'animation (glissement doux gauche/droite en boucle) est
déjà codée et fonctionne automatiquement dès que l'image est en place — aucune autre modification requise.

## 🎨 Couleurs utilisées (dans `css/style.css`, variables `:root`)

- Orange principal : `#FF6B00`
- Orange foncé : `#EA580C`
- Orange clair : `#FFB877`
- Blanc : `#FFFFFF`

## 📂 Structure des fichiers

```
portfolio/
├── index.html          → Accueil
├── projects.html        → Tous les projets
├── testimonials.html     → Tous les témoignages
├── about.html            → À propos
├── contact.html          → Contact
├── signup.html           → Inscription
├── login.html            → Connexion
├── dashboard.html         → Tableau de bord privé
├── 404.html               → Page d'erreur
├── css/style.css
├── js/main.js
├── js/auth.js
├── js/dashboard.js
├── js/validation.js
└── images/  (à remplir avec tes vraies images)
```
