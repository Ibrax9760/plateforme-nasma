// C'est le chef d'orchestre. Il importe les modules et lance l'application.

export let allProjects = [];

import { db, collection, doc, onSnapshot, orderBy, query, setDoc } from './firebase.js';
import { 
    renderProfile,
    renderSocialLinks,
    renderProjects, 
    renderBlogPosts,
    applyTheme, 
    changeFont, 
    setupColorThemes,
    applyPrimaryColor,
    setupNavHighlightOnScroll 
} from './ui.js';
import { setupEventListeners } from './events.js';


// --- ÉCOUTEURS TEMPS RÉEL ---
function setupRealtimeListeners() {
    onSnapshot(doc(db, 'data', 'profile'), (doc) => {
        if (doc.exists()) {
            const profileData = doc.data();
            renderProfile(profileData);
            renderSocialLinks(profileData.social);
        } else {
            setDoc(doc(db, 'data', 'profile'), { 
                name: "Nasma", 
                bio: "Bienvenue sur ma page !", 
                avatar: "https://placehold.co/150x150/6c63ff/FFFFFF?text=Profil" 
            });
        }
    });

    const projectsQuery = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
    onSnapshot(projectsQuery, (snapshot) => {
        allProjects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const initialProjects = allProjects.slice(0, 12);
        renderProjects(initialProjects);

        const seeMoreBtn = document.getElementById('see-more-projects-btn');
        if (seeMoreBtn) {
            if (allProjects.length > 12) {
                seeMoreBtn.style.display = 'inline-flex';
            } else {
                seeMoreBtn.style.display = 'none';
            }
        }
        
        // On met à jour le compteur de projets directement ici
        const projectCountElement = document.getElementById('project-count');
        if (projectCountElement) {
            projectCountElement.textContent = snapshot.size;
        }
    });

    const postsQuery = query(collection(db, 'blogPosts'), orderBy('createdAt', 'desc'));
    onSnapshot(postsQuery, (snapshot) => {
        const blogPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderBlogPosts(blogPosts);

        // On met à jour le compteur d'articles directement ici
        const postCountElement = document.getElementById('post-count');
        if (postCountElement) {
            postCountElement.textContent = snapshot.size;
        }
    });
}

// --- DÉMARRAGE DE L'APPLICATION ---
function initializeApp() {
    applyTheme();
    setupColorThemes();
    applyPrimaryColor();
    setupRealtimeListeners();
    setupEventListeners();
    setupNavHighlightOnScroll();

    // On écoute les événements personnalisés
    document.addEventListener('themeChanged', applyTheme);
    document.addEventListener('fontChanged', (e) => changeFont(e.detail));
    document.addEventListener('colorChanged', applyPrimaryColor);

    console.log("🚀 Application initialisée !");
}

// On lance tout !
initializeApp();