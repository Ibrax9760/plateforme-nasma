// Ce fichier gère tout ce qui est visuel : l'affichage des données et les interactions de l'interface.

// On sélectionne tous les éléments HTML dont on aura besoin une seule fois.
  export const elements = {
    profile: {
        header: document.querySelector('.profile-header'),
        name: document.getElementById('profile-name'),
        bio: document.getElementById('profile-bio'),
        avatar: document.getElementById('profile-avatar'),
        slogan: document.getElementById('profile-slogan')
    },
    socialLinksContainer: document.querySelector('.social-links'), // <-- C'EST CETTE LIGNE QUI MANQUAIT
    projectsGrid: document.querySelector('.gallery-grid'),
    blogPostsContainer: document.querySelector('.blog-posts'),
    profileModal: { element: document.getElementById('profile-modal'), name: document.getElementById('modal-name'), bio: document.getElementById('modal-bio'), avatarInput: document.getElementById('modal-avatar-input'), slogan: document.getElementById('modal-slogan'), profileBg: document.getElementById('modal-profile-bg'), bgBlur: document.getElementById('modal-bg-blur'), bgGradient: document.getElementById('modal-bg-gradient'), layoutStyle: document.getElementById('modal-layout-style'), saveBtn: document.getElementById('save-profile-btn'), closeBtn: document.querySelector('#profile-modal .close-btn'), editProfileBtn: document.getElementById('edit-profile-btn') },
    projectModal: { element: document.getElementById('project-modal'), title: document.getElementById('project-modal-title'), id: document.getElementById('project-id'), titleInput: document.getElementById('project-title-input'), fileInput: document.getElementById('project-file-input'), saveBtn: document.getElementById('save-project-btn'), closeBtn: document.querySelector('#project-modal .close-btn'), addProjectBtn: document.getElementById('add-project-btn') },
    postModal: { element: document.getElementById('post-modal'), title: document.getElementById('post-modal-title'), id: document.getElementById('post-id'), titleInput: document.getElementById('post-title-input'), contentInput: document.getElementById('post-content-input'), saveBtn: document.getElementById('save-post-btn'), closeBtn: document.querySelector('#post-modal .close-btn'), addPostBtn: document.getElementById('add-post-btn') },
    settings: { panel: document.querySelector('.settings-panel'), toggle: document.querySelector('.settings-toggle'), themeSwitcher: document.getElementById('theme-switcher'), fontSelector: document.getElementById('font-selector'), colorThemesContainer: document.getElementById('color-themes'), previewModeBtn: document.getElementById('preview-mode-btn'), exitPreviewBtn: document.getElementById('exit-preview-btn') },
};

// Affiche les données du profil.
  export function renderProfile(data) {
    // Rendu des textes et de l'avatar (comme avant)
    elements.profile.name.textContent = data.name;
    elements.profile.bio.textContent = data.bio;
    elements.profile.avatar.src = data.avatar;

    // --- NOUVEAU ---
    // Rendu du slogan (s'il existe)
    if (elements.profile.slogan) {
        elements.profile.slogan.textContent = data.slogan || '';
    }

    const header = elements.profile.header;
    if (!header) return;

    // Rendu du fond
    const bg = data.profileBackground || 'transparent';
    if (bg.startsWith('http')) {
        header.style.setProperty('--bg-image', `url(${bg})`);
        header.style.backgroundColor = 'transparent';
    } else {
        header.style.setProperty('--bg-image', 'none');
        header.style.backgroundColor = bg;
    }
    // Application directe du style sur le pseudo-élément
    header.style.setProperty('--bg-pseudo-image', header.style.getPropertyValue('--bg-image'));


    // Rendu des effets visuels (flou, dégradé)
    header.classList.toggle('has-blur', !!data.isBgBlurred);
    header.classList.toggle('has-gradient', !!data.isBgGradient);

    // Rendu de la disposition
    header.classList.remove('layout-grid'); // On nettoie d'abord
    if (data.layoutStyle === 'grid') {
        header.classList.add('layout-grid');
    }
}

// Affiche les projets dans la galerie.
  export function renderProjects(items) {
    const grid = elements.projectsGrid;
    grid.innerHTML = '';
    items.forEach(item => {
        const el = document.createElement('div');
        el.className = 'gallery-item';
        el.dataset.id = item.id;

        // On affiche une balise <video> ou <img> selon le type
        if (item.type === 'video') {
            el.innerHTML = `
                <video src="${item.url}" muted loop playsinline preload="metadata"></video>
                <div class="media-overlay"><i class='bx bx-play'></i></div>
                <div class="card-actions">
                    <button class="action-btn edit-btn"><i class='bx bxs-edit'></i></button>
                    <button class="action-btn delete-btn"><i class='bx bxs-trash'></i></button>
                </div>`;
        } else { // Par défaut, on considère que c'est une image
            el.innerHTML = `
                <img src="${item.url || 'https://placehold.co/600x400'}" alt="${item.title}">
                <div class="card-actions">
                    <button class="action-btn edit-btn"><i class='bx bxs-edit'></i></button>
                    <button class="action-btn delete-btn"><i class='bx bxs-trash'></i></button>
                </div>`;
        }
        grid.appendChild(el);
    });
}

// Affiche les articles du journal.
  export function renderBlogPosts(items) {
    const container = elements.blogPostsContainer;
    container.innerHTML = '';
    items.forEach(item => {
        const el = document.createElement('div');
        el.className = 'blog-post';
        el.dataset.id = item.id;
        el.innerHTML = `
            <h3>${item.title}</h3>
            <p>${item.content}</p>
            <div class="card-actions">
                <button class="action-btn edit-btn"><i class='bx bxs-edit'></i></button>
                <button class="action-btn delete-btn"><i class='bx bxs-trash'></i></button>
            </div>`;
        container.appendChild(el);
    });
}

// Applique le thème (clair/sombre) sauvegardé.
  export function applyTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.classList.toggle('light-theme', savedTheme === 'light');
}

// Change la police d'écriture.
  export function changeFont(font) {
    document.documentElement.style.setProperty('--font-family-base', font);
}

// Applique la couleur principale sauvegardée.
  export function applyPrimaryColor() {
    const savedColor = localStorage.getItem('primaryColor') || '#6c63ff'; // Couleur par défaut
    document.documentElement.style.setProperty('--color-primary', savedColor);
    
    document.querySelectorAll('.color-swatch').forEach(swatch => {
        swatch.classList.toggle('active', swatch.dataset.color === savedColor);
    });
}

// Crée les pastilles de couleur dans le panneau de paramètres.
  export function setupColorThemes() {
    const themes = {
        purple: '#6c63ff',
        pink: '#ff7eb9',
        blue: '#3498db',
        green: '#2ecc71',
        orange: '#e67e22',
        red: '#e74c3c',
        teal: '#1abc9c'
    };
    const container = elements.settings.colorThemesContainer;
    container.innerHTML = '';
    for (const colorName in themes) {
        const swatch = document.createElement('div');
        swatch.className = 'color-swatch';
        swatch.style.backgroundColor = themes[colorName];
        swatch.dataset.color = themes[colorName];
        container.appendChild(swatch);
    }
}

// Met en surbrillance le lien du menu correspondant à la section visible.
  export function setupNavHighlightOnScroll() {
    const sections = document.querySelectorAll('.page-section');
    const navLinks = document.querySelectorAll('.nav-link');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                });
                document.querySelector(`.nav-link[href="#${id}"]`).classList.add('active');
            }
        });
    }, { threshold: 0.5 });
    sections.forEach(sec => observer.observe(sec));
}

    export function renderProjectStat(count) {
    if (elements.profile.projectCount) {
        elements.profile.projectCount.textContent = count;
    }
}

  export function renderPostStat(count) {
    if (elements.profile.postCount) {
        elements.profile.postCount.textContent = count;
    }
  }

export function renderSocialLinks(socialData) {
    const container = elements.socialLinksContainer;
    if (!container) return; // Sécurité si le conteneur n'est pas trouvé

    container.innerHTML = ''; // On vide pour éviter les doublons
    if (!socialData) return; // On s'arrête si l'objet social est vide

    const iconMap = {
        instagram: 'bxl-instagram-alt',
        tiktok: 'bxl-tiktok',
        youtube: 'bxl-youtube',
        snapchat: 'bxl-snapchat'
    };

    for (const network in socialData) {
        // La correction est ici : on convertit le nom du réseau en minuscules
        const networkKey = network.toLowerCase();

        // On vérifie que le lien n'est pas vide et que la clé en minuscules existe dans notre map
        if (socialData[network] && iconMap[networkKey]) {
            const link = document.createElement('a');
            link.href = socialData[network];
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.setAttribute('aria-label', network);
            // On utilise la clé en minuscules pour récupérer la bonne classe d'icône
            link.innerHTML = `<i class='bx ${iconMap[networkKey]}'></i>`;
            container.appendChild(link);
        }
    }
}