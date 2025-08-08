// --- ÉCOUTEURS TEMPS RÉEL ---
function setupRealtimeListeners() {
    db.collection('data').doc('profile').onSnapshot(doc => {
        if (doc.exists) {
            renderProfile(doc.data());
        } else {
            db.collection('data').doc('profile').set({ 
                name: "Nasma", 
                bio: "Bienvenue sur ma page !", 
                avatar: "https://placehold.co/150x150/6c63ff/FFFFFF?text=Profil" 
            });
        }
    });
    db.collection('projects').orderBy('createdAt', 'desc').onSnapshot(snapshot => {
        const projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderProjects(projects);
    });
    db.collection('blogPosts').orderBy('createdAt', 'desc').onSnapshot(snapshot => {
        const blogPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderBlogPosts(blogPosts);
    });
}

// --- DÉMARRAGE DE L'APPLICATION ---
function initializeApp() {
    applyTheme();
    setupRealtimeListeners();
    setupEventListeners();
    setupNavHighlightOnScroll();
    console.log("🚀 Application initialisée !");
}

// On lance tout !
initializeApp();
