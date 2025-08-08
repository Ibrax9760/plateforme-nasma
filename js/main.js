// C'est le chef d'orchestre. Il importe les modules et lance l'application.

import { db, collection, doc, onSnapshot, orderBy, query, setDoc } from './firebase.js';
import { 
    renderProfile, 
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
            renderProfile(doc.data());
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
        const projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderProjects(projects);
    });

    const postsQuery = query(collection(db, 'blogPosts'), orderBy('createdAt', 'desc'));
    onSnapshot(postsQuery, (snapshot) => {
        const blogPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderBlogPosts(blogPosts);
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
