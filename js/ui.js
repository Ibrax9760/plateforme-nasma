// On sélectionne tous les éléments HTML dont on aura besoin une seule fois.
const elements = {
    profile: { name: document.getElementById('profile-name'), bio: document.getElementById('profile-bio'), avatar: document.getElementById('profile-avatar') },
    projectsGrid: document.querySelector('.gallery-grid'),
    blogPostsContainer: document.querySelector('.blog-posts'),
    profileModal: { element: document.getElementById('profile-modal'), name: document.getElementById('modal-name'), bio: document.getElementById('modal-bio'), avatarInput: document.getElementById('modal-avatar-input'), saveBtn: document.getElementById('save-profile-btn'), closeBtn: document.querySelector('#profile-modal .close-btn'), editProfileBtn: document.getElementById('edit-profile-btn') },
    projectModal: { element: document.getElementById('project-modal'), title: document.getElementById('project-modal-title'), id: document.getElementById('project-id'), titleInput: document.getElementById('project-title-input'), urlInput: document.getElementById('project-url-input'), saveBtn: document.getElementById('save-project-btn'), closeBtn: document.querySelector('#project-modal .close-btn'), addProjectBtn: document.getElementById('add-project-btn') },
    postModal: { element: document.getElementById('post-modal'), title: document.getElementById('post-modal-title'), id: document.getElementById('post-id'), titleInput: document.getElementById('post-title-input'), contentInput: document.getElementById('post-content-input'), saveBtn: document.getElementById('save-post-btn'), closeBtn: document.querySelector('#post-modal .close-btn'), addPostBtn: document.getElementById('add-post-btn') },
    settings: { panel: document.querySelector('.settings-panel'), toggle: document.querySelector('.settings-toggle'), themeSwitcher: document.getElementById('theme-switcher'), fontSelector: document.getElementById('font-selector'), previewModeBtn: document.getElementById('preview-mode-btn'), exitPreviewBtn: document.getElementById('exit-preview-btn') },
};

// Affiche les données du profil.
function renderProfile(data) {
    elements.profile.name.textContent = data.name;
    elements.profile.bio.textContent = data.bio;
    elements.profile.avatar.src = data.avatar;
}

// Affiche les projets dans la galerie.
function renderProjects(items) {
    const grid = elements.projectsGrid;
    grid.innerHTML = '';
    items.forEach(item => {
        const el = document.createElement('div');
        el.className = 'gallery-item';
        el.dataset.id = item.id;
        el.innerHTML = `
            <img src="${item.url || 'https://placehold.co/600x400'}" alt="${item.title}">
            <div class="card-actions">
                <button class="action-btn edit-btn"><i class='bx bxs-edit'></i></button>
                <button class="action-btn delete-btn"><i class='bx bxs-trash'></i></button>
            </div>`;
        grid.appendChild(el);
    });
}

// Affiche les articles du journal.
function renderBlogPosts(items) {
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
function applyTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.classList.toggle('light-theme', savedTheme === 'light');
}

// Change la police d'écriture.
function changeFont(font) {
    document.documentElement.style.setProperty('--font-family-base', font);
}

// Met en surbrillance le lien du menu correspondant à la section visible.
function setupNavHighlightOnScroll() {
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
