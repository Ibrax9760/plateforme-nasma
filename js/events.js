// Ce fichier gère toutes les interactions de l'utilisateur : les clics, les formulaires, etc.

import { db, doc, getDoc, updateDoc, addDoc, deleteDoc, collection, serverTimestamp } from './firebase.js';
import { elements } from './ui.js';

// --- LOGIQUE DES MODALS ---
async function openProfileModal() {
    const docRef = doc(db, 'data', 'profile');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        const data = docSnap.data();
        elements.profileModal.name.value = data.name;
        elements.profileModal.bio.value = data.bio;
        elements.profileModal.avatarInput.value = '';
        elements.profileModal.element.style.display = 'block';
    }
}

function saveProfile() {
    const modal = elements.profileModal;
    const dataToUpdate = { name: modal.name.value, bio: modal.bio.value };
    const file = modal.avatarInput.files[0];
    const docRef = doc(db, 'data', 'profile');
    if (file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
            dataToUpdate.avatar = e.target.result;
            await updateDoc(docRef, dataToUpdate);
            modal.element.style.display = 'none';
        };
        reader.readAsDataURL(file);
    } else {
        updateDoc(docRef, dataToUpdate);
        modal.element.style.display = 'none';
    }
}

async function openProjectModal(id = null) {
    const modal = elements.projectModal;
    if (id) {
        const docRef = doc(db, 'projects', id);
        const docSnap = await getDoc(docRef);
        const data = docSnap.data();
        modal.title.textContent = "Modifier le projet";
        modal.id.value = id;
        modal.titleInput.value = data.title;
        modal.urlInput.value = data.url;
    } else {
        modal.title.textContent = "Ajouter un projet";
        modal.id.value = '';
        modal.titleInput.value = '';
        modal.urlInput.value = '';
    }
    modal.element.style.display = 'block';
}

async function saveProject() {
    const modal = elements.projectModal;
    const id = modal.id.value;
    const data = { title: modal.titleInput.value, url: modal.urlInput.value };
    if (id) {
        await updateDoc(doc(db, 'projects', id), data);
    } else {
        data.createdAt = serverTimestamp();
        await addDoc(collection(db, 'projects'), data);
    }
    modal.element.style.display = 'none';
}

async function openPostModal(id = null) {
    const modal = elements.postModal;
    if (id) {
        const docRef = doc(db, 'blogPosts', id);
        const docSnap = await getDoc(docRef);
        const data = docSnap.data();
        modal.title.textContent = "Modifier l'article";
        modal.id.value = id;
        modal.titleInput.value = data.title;
        modal.contentInput.value = data.content;
    } else {
        modal.title.textContent = "Ajouter un article";
        modal.id.value = '';
        modal.titleInput.value = '';
        modal.contentInput.value = '';
    }
    modal.element.style.display = 'block';
}

async function savePost() {
    const modal = elements.postModal;
    const id = modal.id.value;
    const data = { title: modal.titleInput.value, content: modal.contentInput.value };
    if (id) {
        await updateDoc(doc(db, 'blogPosts', id), data);
    } else {
        data.createdAt = serverTimestamp();
        await addDoc(collection(db, 'blogPosts'), data);
    }
    modal.element.style.display = 'none';
}

function handleCardActions(e) {
    const target = e.target.closest('.action-btn');
    if (!target) return;
    const card = target.closest('[data-id]');
    const id = card.dataset.id;
    const isProject = card.classList.contains('gallery-item');
    if (target.classList.contains('edit-btn')) {
        isProject ? openProjectModal(id) : openPostModal(id);
    } else if (target.classList.contains('delete-btn')) {
        if (confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
            const collectionName = isProject ? 'projects' : 'blogPosts';
            deleteDoc(doc(db, collectionName, id));
        }
    }
}

// Fonction principale qui branche tous les "interrupteurs".
export function setupEventListeners() {
    elements.profileModal.editProfileBtn.addEventListener('click', openProfileModal);
    elements.projectModal.addProjectBtn.addEventListener('click', () => openProjectModal());
    elements.postModal.addPostBtn.addEventListener('click', () => openPostModal());
    elements.profileModal.saveBtn.addEventListener('click', saveProfile);
    elements.projectModal.saveBtn.addEventListener('click', saveProject);
    elements.postModal.saveBtn.addEventListener('click', savePost);
    elements.profileModal.closeBtn.addEventListener('click', () => elements.profileModal.element.style.display = 'none');
    elements.projectModal.closeBtn.addEventListener('click', () => elements.projectModal.element.style.display = 'none');
    elements.postModal.closeBtn.addEventListener('click', () => elements.postModal.element.style.display = 'none');
    elements.projectsGrid.addEventListener('click', handleCardActions);
    elements.blogPostsContainer.addEventListener('click', handleCardActions);
    elements.settings.toggle.addEventListener('click', () => elements.settings.panel.classList.toggle('open'));
    elements.settings.previewModeBtn.addEventListener('click', () => document.body.classList.add('preview-mode'));
    elements.settings.exitPreviewBtn.addEventListener('click', () => document.body.classList.remove('preview-mode'));
    
    elements.settings.themeSwitcher.addEventListener('click', () => {
        const currentIsLight = document.body.classList.contains('light-theme');
        localStorage.setItem('theme', currentIsLight ? 'dark' : 'light');
        document.dispatchEvent(new Event('themeChanged'));
    });

    elements.settings.fontSelector.addEventListener('change', (e) => {
        document.dispatchEvent(new CustomEvent('fontChanged', { detail: e.target.value }));
    });

    elements.settings.colorThemesContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('color-swatch')) {
            const color = e.target.dataset.color;
            localStorage.setItem('primaryColor', color);
            document.dispatchEvent(new Event('colorChanged'));
        }
    });
}
