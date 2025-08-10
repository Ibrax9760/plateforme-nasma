// Ce fichier gère toutes les interactions de l'utilisateur : les clics, les formulaires, etc.

import { db, storage, ref, uploadBytes, getDownloadURL, doc, getDoc, updateDoc, addDoc, deleteDoc, collection, serverTimestamp } from './firebase.js';
import { elements } from './ui.js';
import { allProjects } from './main.js';
import { renderProjects } from './ui.js';

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
    
    // On collecte TOUTES les données du modal
    const dataToUpdate = {
        name: modal.name.value,
        bio: modal.bio.value,
        slogan: modal.slogan.value,
        profileBackground: modal.profileBg.value,
        isBgBlurred: modal.bgBlur.checked,
        isBgGradient: modal.bgGradient.checked,
        layoutStyle: modal.layoutStyle.value
    };

    const file = modal.avatarInput.files[0];
    const docRef = doc(db, 'data', 'profile');

    // La logique de l'image de profil ne change pas
    if (file) {
        const storageRef = ref(storage, `profile-avatars/${docRef.id}`);
        uploadBytes(storageRef, file).then(snapshot => {
            getDownloadURL(snapshot.ref).then(downloadURL => {
                dataToUpdate.avatar = downloadURL;
                updateDoc(docRef, dataToUpdate);
            });
        });
    } else {
        // Si pas de nouvelle image, on met juste à jour le reste
        updateDoc(docRef, dataToUpdate);
    }
    
    modal.element.style.display = 'none';
}

async function openProjectModal(id = null) {
    const modal = elements.projectModal;
    modal.title.textContent = "Ajouter un projet";
    modal.id.value = '';
    modal.titleInput.value = '';
    modal.fileInput.value = '';

    if (id) {
        modal.title.textContent = "Modifier le projet";
        const docRef = doc(db, 'projects', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            modal.id.value = id;
            modal.titleInput.value = data.title;
        }
    }
    
    modal.element.style.display = 'block';
}

async function saveProject() {
    const modal = elements.projectModal;
    const id = modal.id.value;
    const title = modal.titleInput.value;
    const file = modal.fileInput.files[0];

    let fileType = null;
    if (file) {
        if (file.type.startsWith('image/')) {
            fileType = 'image';
        } else if (file.type.startsWith('video/')) {
            fileType = 'video';
        }
    }

    if (!title) {
        alert("Veuillez entrer un titre.");
        return;
    }

    modal.saveBtn.disabled = true;
    modal.saveBtn.textContent = 'Enregistrement...';

    try {
        let fileUrl = null;

        if (file) {
            const storageRef = ref(storage, `projects/${Date.now()}_${file.name}`);
            const uploadResult = await uploadBytes(storageRef, file);
            fileUrl = await getDownloadURL(uploadResult.ref);
        }

        const dataToSave = { title: title };
        // On n'écrase le type que si un nouveau fichier est envoyé
        if (fileType) {
            dataToSave.type = fileType;
        }
        if (fileUrl) {
            dataToSave.url = fileUrl;
        }

        if (id) {
            await updateDoc(doc(db, 'projects', id), dataToSave);
        } else {
            if (!fileUrl) {
                alert("Veuillez sélectionner un fichier pour un nouveau projet.");
                throw new Error("Fichier manquant pour un nouveau projet.");
            }
            dataToSave.createdAt = serverTimestamp();
            await addDoc(collection(db, 'projects'), dataToSave);
        }

        modal.element.style.display = 'none';
    } catch (error) {
        console.error("Erreur lors de la sauvegarde du projet :", error);
        alert("Une erreur est survenue. Veuillez réessayer.");
    } finally {
        modal.saveBtn.disabled = false;
        modal.saveBtn.textContent = 'Enregistrer';
    }
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

// --- LOGIQUE DE LA LIGHTBOX ---
const lightbox = document.getElementById('lightbox');
const lightboxContent = document.querySelector('.lightbox-content');
let currentProjectIndex = 0;

function showLightboxItem(index) {
    currentProjectIndex = index;
    const item = allProjects[index];
    lightboxContent.innerHTML = '';

    if (item.type === 'video') {
        const video = document.createElement('video');
        video.src = item.url;
        video.controls = true;
        video.autoplay = true;
        lightboxContent.appendChild(video);
    } else {
        const img = document.createElement('img');
        img.src = item.url;
        lightboxContent.appendChild(img);
    }
}

function openLightbox(index) {
    showLightboxItem(index);
    lightbox.classList.remove('hidden');
}

function closeLightbox() {
    lightbox.classList.add('hidden');
    lightboxContent.innerHTML = '';
}

function showNextProject() {
    const newIndex = (currentProjectIndex + 1) % allProjects.length;
    showLightboxItem(newIndex);
}

function showPrevProject() {
    const newIndex = (currentProjectIndex - 1 + allProjects.length) % allProjects.length;
    showLightboxItem(newIndex);
}


// --- FONCTION PRINCIPALE QUI BRANCHE TOUS LES "INTERRUPTEURS" ---
export function setupEventListeners() {
    elements.profileModal.editProfileBtn.addEventListener('click', openProfileModal);
    elements.projectModal.addProjectBtn.addEventListener('click', () => openProjectModal(null));
    elements.postModal.addPostBtn.addEventListener('click', () => openPostModal());

    elements.profileModal.saveBtn.addEventListener('click', saveProfile);
    elements.projectModal.saveBtn.addEventListener('click', saveProject);
    elements.postModal.saveBtn.addEventListener('click', savePost);

    elements.profileModal.closeBtn.addEventListener('click', () => elements.profileModal.element.style.display = 'none');
    elements.projectModal.closeBtn.addEventListener('click', () => elements.projectModal.element.style.display = 'none');
    elements.postModal.closeBtn.addEventListener('click', () => elements.postModal.element.style.display = 'none');

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
    
    const seeMoreBtn = document.getElementById('see-more-projects-btn');
    if (seeMoreBtn) {
        seeMoreBtn.addEventListener('click', () => {
            renderProjects(allProjects);
            seeMoreBtn.style.display = 'none';
        });
    }

    elements.projectsGrid.addEventListener('click', (e) => {
        const actionButton = e.target.closest('.action-btn');
        const galleryItem = e.target.closest('.gallery-item');

        if (actionButton) {
            handleCardActions(e);
        } else if (galleryItem) {
            const id = galleryItem.dataset.id;
            const index = allProjects.findIndex(p => p.id === id);
            if (index > -1) {
                openLightbox(index);
            }
        }
    });

    document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    document.querySelector('.lightbox-next').addEventListener('click', showNextProject);
    document.querySelector('.lightbox-prev').addEventListener('click', showPrevProject);

    window.addEventListener('keydown', (e) => {
        if (lightbox && !lightbox.classList.contains('hidden')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') showNextProject();
            if (e.key === 'ArrowLeft') showPrevProject();
        }
    });
}