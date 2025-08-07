document.addEventListener('DOMContentLoaded', () => {

    // --- SÉLECTION DES ÉLÉMENTS HTML ---
    const mainContent = {
        profile: { avatar: document.getElementById('profile-avatar'), name: document.getElementById('profile-name'), bio: document.getElementById('profile-bio') },
        projectsGrid: document.querySelector('.gallery-grid'),
        blogPostsContainer: document.querySelector('.blog-posts'),
        socialLinksContainer: document.querySelector('.social-links')
    };
    const forms = {
        contact: document.getElementById('contact-form'),
        addPost: { title: document.getElementById('new-post-title'), content: document.getElementById('new-post-content'), button: document.getElementById('add-post-btn') }
    };
    const modals = {
        profile: { element: document.getElementById('profile-modal'), name: document.getElementById('modal-name'), bio: document.getElementById('modal-bio'), avatar: document.getElementById('modal-avatar'), saveBtn: document.getElementById('save-profile-btn'), closeBtn: document.querySelector('#profile-modal .close-btn'), editProfileBtn: document.getElementById('edit-profile-btn') },
        project: { element: document.getElementById('project-modal'), title: document.getElementById('project-modal-title'), id: document.getElementById('project-id'), titleInput: document.getElementById('project-title'), category: document.getElementById('project-category'), type: document.getElementById('project-type'), urlField: document.getElementById('project-url-field'), urlInput: document.getElementById('project-url'), fileInput: document.getElementById('project-file'), youtubeIdField: document.getElementById('project-youtubeId-field'), youtubeIdInput: document.getElementById('project-youtubeId'), saveBtn: document.getElementById('save-project-btn'), closeBtn: document.querySelector('#project-modal .close-btn'), addProjectBtn: document.getElementById('add-project-btn') },
        blogEdit: { element: document.getElementById('blog-edit-modal'), id: document.getElementById('blog-edit-id'), title: document.getElementById('blog-edit-title'), content: document.getElementById('blog-edit-content'), saveBtn: document.getElementById('save-blog-edit-btn'), closeBtn: document.querySelector('#blog-edit-modal .close-btn') }
    };
    const settings = {
        panel: document.querySelector('.settings-panel'),
        toggle: document.querySelector('.settings-toggle'),
        themeSwitcher: document.getElementById('theme-switcher'),
        fontSelector: document.getElementById('font-selector'),
        colorThemesContainer: document.getElementById('color-themes'),
        previewModeBtn: document.getElementById('preview-mode-btn'),
        exitPreviewBtn: document.getElementById('exit-preview-btn')
    };

    // --- DONNÉES ET LOCALSTORAGE ---
    const STORAGE_KEYS = { profile: 'userProfile', blogPosts: 'userBlogPosts', projects: 'userProjects', theme: 'userTheme' };
    let userProfile = {}, blogPosts = [], projects = [];

    // --- INITIALISATION ---
    async function initializeApp() {
        await loadData();
        applyTheme();
        renderAll();
        setupEventListeners();
        setupScrollAnimations();
        setupColorThemes();
    }

    function renderAll() {
        renderProfile();
        renderSocialLinks();
        renderProjects();
        renderBlogPosts();
    }
    
    async function loadData() {
        try {
            const savedProfile = JSON.parse(localStorage.getItem(STORAGE_KEYS.profile));
            const savedPosts = JSON.parse(localStorage.getItem(STORAGE_KEYS.blogPosts));
            const savedProjects = JSON.parse(localStorage.getItem(STORAGE_KEYS.projects));

            if (savedProfile && savedPosts && savedProjects) {
                userProfile = savedProfile; blogPosts = savedPosts; projects = savedProjects;
                console.log("Données chargées depuis le localStorage.");
            } else {
                const response = await fetch('./data.json');
                const data = await response.json();
                userProfile = data.userProfile; blogPosts = data.blog; projects = data.projects;
                projects.forEach(p => p.id = p.id || Date.now() + Math.random());
                blogPosts.forEach(p => p.id = p.id || Date.now() + Math.random());
                saveAllData();
                console.log("Données initiales chargées depuis data.json.");
            }
        } catch (error) {
            console.error("Oups, impossible de charger les données :", error);
            showNotification("Erreur de chargement des données.", "error");
        }
    }

    function saveAllData() {
        saveToStorage(STORAGE_KEYS.profile, userProfile);
        saveToStorage(STORAGE_KEYS.blogPosts, blogPosts);
        saveToStorage(STORAGE_KEYS.projects, projects);
    }

    // --- FONCTIONS D'AFFICHAGE (RENDER) ---
    function renderProfile() { mainContent.profile.name.textContent = userProfile.name; mainContent.profile.bio.textContent = userProfile.bio; mainContent.profile.avatar.src = userProfile.avatar; }
    function renderSocialLinks() { const links = userProfile.social; mainContent.socialLinksContainer.innerHTML = `<a href="${links.instagram}" target="_blank"><i class='bx bxl-instagram-alt'></i></a><a href="${links.tiktok}" target="_blank"><i class='bx bxl-tiktok'></i></a><a href="${links.youtube}" target="_blank"><i class='bx bxl-youtube'></i></a><a href="${links.snapchat}" target="_blank"><i class='bx bxl-snapchat'></i></a>`; }

    function renderProjects(filter = 'all') {
        mainContent.projectsGrid.innerHTML = '';
        const filteredProjects = projects.filter(p => filter === 'all' || p.category === filter);
        filteredProjects.forEach(project => {
            const projectElement = document.createElement('div');
            projectElement.className = 'gallery-item animate-on-scroll';
            projectElement.dataset.id = project.id;
            const content = project.type === 'image' ? `<img src="${project.url}" alt="${project.title}">` : `<iframe src="https://www.youtube.com/embed/${project.youtubeId}" title="${project.title}" frameborder="0" allowfullscreen></iframe>`;
            projectElement.innerHTML = `
                ${content}
                <div class="overlay"><h3>${project.title}</h3></div>
                <div class="card-actions">
                    <button class="action-btn edit-btn"><i class='bx bxs-edit'></i></button>
                    <button class="action-btn delete-btn"><i class='bx bxs-trash'></i></button>
                </div>`;
            mainContent.projectsGrid.appendChild(projectElement);
        });
        setupScrollAnimations();
    }

    function renderBlogPosts() {
        mainContent.blogPostsContainer.innerHTML = '';
        blogPosts.forEach(post => {
            const postElement = document.createElement('article');
            postElement.className = 'blog-post animate-on-scroll';
            postElement.dataset.id = post.id;
            postElement.innerHTML = `
                <h3>${post.title}</h3>
                <p class="date">${post.date}</p>
                <p>${post.content}</p>
                <div class="card-actions">
                    <button class="action-btn edit-btn"><i class='bx bxs-edit'></i></button>
                    <button class="action-btn delete-btn"><i class='bx bxs-trash'></i></button>
                </div>`;
            mainContent.blogPostsContainer.prepend(postElement);
        });
        setupScrollAnimations();
    }

    // --- GESTION DES ÉVÉNEMENTS ---
    function setupEventListeners() {
        // Modals
        modals.profile.editProfileBtn.addEventListener('click', openProfileModal);
        modals.profile.closeBtn.addEventListener('click', () => modals.profile.element.style.display = 'none');
        modals.profile.saveBtn.addEventListener('click', saveProfile);
        
        modals.project.addProjectBtn.addEventListener('click', () => openProjectModal());
        modals.project.closeBtn.addEventListener('click', () => modals.project.element.style.display = 'none');
        modals.project.saveBtn.addEventListener('click', saveProject);
        modals.project.type.addEventListener('change', toggleProjectInputFields);

        modals.blogEdit.closeBtn.addEventListener('click', () => modals.blogEdit.element.style.display = 'none');
        modals.blogEdit.saveBtn.addEventListener('click', saveBlogEdit);

        // CRUD via délégation d'événements
        mainContent.projectsGrid.addEventListener('click', handleProjectActions);
        mainContent.blogPostsContainer.addEventListener('click', handleBlogActions);

        // Autres
        settings.toggle.addEventListener('click', () => settings.panel.classList.toggle('open'));
        settings.themeSwitcher.addEventListener('click', toggleTheme);
        settings.fontSelector.addEventListener('change', (e) => changeFont(e.target.value));
        forms.contact.addEventListener('submit', handleContactForm);
        forms.addPost.button.addEventListener('click', addBlogPost);
        document.querySelectorAll('.filter-btn').forEach(button => button.addEventListener('click', (e) => {
            document.querySelector('.filter-btn.active').classList.remove('active');
            e.target.classList.add('active');
            renderProjects(e.target.dataset.category);
        }));
        settings.previewModeBtn.addEventListener('click', () => document.body.classList.add('preview-mode'));
        settings.exitPreviewBtn.addEventListener('click', () => document.body.classList.remove('preview-mode'));
    }

    // --- LOGIQUE CRUD ---

    // Actions sur les Projets
    function handleProjectActions(e) {
        const target = e.target.closest('.action-btn');
        if (!target) return;
        const id = target.closest('.gallery-item').dataset.id;
        if (target.classList.contains('edit-btn')) openProjectModal(id);
        if (target.classList.contains('delete-btn')) deleteItem(id, 'project');
    }

    function openProjectModal(id = null) {
        const modal = modals.project;
        if (id) {
            const project = projects.find(p => p.id == id);
            modal.title.textContent = "Modifier le projet";
            modal.id.value = id;
            modal.titleInput.value = project.title;
            modal.category.value = project.category;
            modal.type.value = project.type;
            modal.urlInput.value = project.url || '';
            modal.youtubeIdInput.value = project.youtubeId || '';
        } else {
            modal.title.textContent = "Ajouter un projet";
            modal.id.value = '';
            modal.element.querySelector('form')?.reset(); // Reset form if it exists
        }
        toggleProjectInputFields();
        modal.element.style.display = 'block';
    }

    function saveProject() {
        const modal = modals.project;
        const id = modal.id.value;
        const newProjectData = {
            title: modal.titleInput.value,
            category: modal.category.value,
            type: modal.type.value,
            url: modal.urlInput.value,
            youtubeId: modal.youtubeIdInput.value
        };

        if (id) { // Modification
            const index = projects.findIndex(p => p.id == id);
            projects[index] = { ...projects[index], ...newProjectData };
        } else { // Ajout
            newProjectData.id = Date.now();
            projects.unshift(newProjectData);
        }
        
        saveAllData();
        renderProjects();
        modal.element.style.display = 'none';
        showNotification(id ? "Projet modifié !" : "Projet ajouté !");
    }
    
    // Actions sur le Journal
    function handleBlogActions(e) {
        const target = e.target.closest('.action-btn');
        if (!target) return;
        const id = target.closest('.blog-post').dataset.id;
        if (target.classList.contains('edit-btn')) openBlogEditModal(id);
        if (target.classList.contains('delete-btn')) deleteItem(id, 'blog');
    }

    function openBlogEditModal(id) {
        const post = blogPosts.find(p => p.id == id);
        const modal = modals.blogEdit;
        modal.id.value = id;
        modal.title.value = post.title;
        modal.content.value = post.content;
        modal.element.style.display = 'block';
    }

    function saveBlogEdit() {
        const modal = modals.blogEdit;
        const id = modal.id.value;
        const index = blogPosts.findIndex(p => p.id == id);
        blogPosts[index].title = modal.title.value;
        blogPosts[index].content = modal.content.value;
        saveAllData();
        renderBlogPosts();
        modal.element.style.display = 'none';
        showNotification("Article modifié !");
    }
    
    function addBlogPost() {
        const title = forms.addPost.title.value;
        const content = forms.addPost.content.value;
        if (!title || !content) return showNotification("Veuillez remplir tous les champs.", "error");
        blogPosts.unshift({
            id: Date.now(), title, content,
            date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
        });
        saveAllData();
        renderBlogPosts();
        forms.addPost.title.value = ''; forms.addPost.content.value = '';
        showNotification("Nouvelle pensée publiée !");
    }

    // Suppression générique
    function deleteItem(id, type) {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet élément ?")) return;
        if (type === 'project') projects = projects.filter(p => p.id != id);
        if (type === 'blog') blogPosts = blogPosts.filter(p => p.id != id);
        saveAllData();
        renderAll();
        showNotification("Élément supprimé.", "success");
    }

    // --- AUTRES FONCTIONS ---
    function saveProfile() {
        userProfile.name = modals.profile.name.value;
        userProfile.bio = modals.profile.bio.value;
        const file = modals.profile.avatar.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                userProfile.avatar = e.target.result;
                finishSaveProfile();
            };
            reader.readAsDataURL(file);
        } else {
            finishSaveProfile();
        }
    }
    function finishSaveProfile() {
        saveAllData();
        renderProfile();
        modals.profile.element.style.display = 'none';
        showNotification("Profil mis à jour !");
    }
    function openProfileModal() {
        modals.profile.name.value = userProfile.name;
        modals.profile.bio.value = userProfile.bio;
        modals.profile.avatar.value = ''; 
        modals.profile.element.style.display = 'block';
    }
    function toggleProjectInputFields() {
        const type = modals.project.type.value;
        modals.project.urlField.style.display = type === 'image' ? 'block' : 'none';
        modals.project.youtubeIdField.style.display = type === 'video' ? 'block' : 'none';
    }
    function handleContactForm(event) { event.preventDefault(); showNotification("Message envoyé ! (Simulation)"); forms.contact.reset(); }
    function toggleTheme() { const newTheme = document.body.classList.contains('light-theme') ? 'dark' : 'light'; localStorage.setItem(STORAGE_KEYS.theme, newTheme); applyTheme(); }
    function applyTheme() { const savedTheme = localStorage.getItem(STORAGE_KEYS.theme); document.body.classList.toggle('light-theme', savedTheme === 'light'); }
    function changeFont(font) { document.documentElement.style.setProperty('--font-family-base', font); }
    function setupColorThemes() { const themes = { purple: '#6c63ff', pink: '#ff7eb9', blue: '#3498db', green: '#2ecc71' }; for (const color in themes) { const swatch = document.createElement('div'); swatch.className = 'color-swatch'; swatch.style.backgroundColor = themes[color]; swatch.addEventListener('click', () => document.documentElement.style.setProperty('--color-primary', themes[color])); settings.colorThemesContainer.appendChild(swatch); } }
    function showNotification(message, type = 'success') { const container = document.getElementById('notification-container'); const notif = document.createElement('div'); notif.className = `notification ${type}`; notif.textContent = message; container.appendChild(notif); setTimeout(() => notif.remove(), 3000); }
    function setupScrollAnimations() { const observer = new IntersectionObserver((entries) => { entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }); }, { threshold: 0.1 }); document.querySelectorAll('.animate-on-scroll:not(.visible)').forEach(el => observer.observe(el)); }
    function saveToStorage(key, data) { localStorage.setItem(key, JSON.stringify(data)); }

    initializeApp();
});
