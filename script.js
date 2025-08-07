// On utilise 'DOMContentLoaded' pour être sûr que tout le code HTML et CSS
// est bien chargé avant d'essayer de le manipuler. C'est une bonne pratique !
document.addEventListener('DOMContentLoaded', () => {

    // --- C'est ici qu'on sélectionne tous les éléments HTML dont on aura besoin ---
    // Un peu comme si on préparait nos outils avant de bricoler.
    const galleryGrid = document.querySelector('.gallery-grid');
    const blogPostsContainer = document.querySelector('.blog-posts');
    const playlistContainer = document.querySelector('.playlist-container');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    // Pour la personnalisation
    const themeSwitcher = document.getElementById('theme-switcher');
    const bgColorPicker = document.getElementById('bg-color-picker');
    const fontSelector = document.getElementById('font-selector');
    const settingsPanel = document.querySelector('.settings-panel');
    const settingsToggle = document.querySelector('.settings-toggle');


    // --- FONCTION PRINCIPALE : CHARGER LE CONTENU DEPUIS data.json ---
    // fetch, c'est comme envoyer un coursier chercher le contenu du fichier data.json.
    // C'est asynchrone, ça veut dire que le site continue de tourner en attendant la réponse.
    async function loadContent() {
        try {
            const response = await fetch('data.json'); // Le coursier part chercher...
            const data = await response.json(); // Il revient avec le colis (les données) et on l'ouvre.

            // Une fois qu'on a les données, on appelle les fonctions pour afficher chaque partie.
            displayGallery(data.gallery);
            displayBlog(data.blog);
            displayPlaylist(data.playlist);

        } catch (error) {
            // Si le coursier se perd (erreur de chargement), on affiche un message.
            console.error('Oups, impossible de charger le contenu :', error);
        }
    }


    // --- FONCTIONS D'AFFICHAGE (elles créent le HTML) ---

    // Fonction pour afficher la galerie
    function displayGallery(items) {
        galleryGrid.innerHTML = ''; // On vide la galerie avant de la remplir (pour le filtrage)
        items.forEach(item => {
            // Pour chaque item dans nos données, on crée une "carte" HTML.
            const galleryItem = document.createElement('div');
            galleryItem.classList.add('gallery-item', 'animate-on-scroll');
            galleryItem.setAttribute('data-category', item.category);

            // On remplit la carte avec le contenu de l'item.
            galleryItem.innerHTML = `
                <img src="${item.url}" alt="${item.title}">
                <div class="overlay">
                    <h3>${item.title}</h3>
                </div>
                <button class="like-button" data-id="${item.id}">
                    <i class='bx bx-heart'></i>
                    <span class="like-count">0</span>
                </button>
            `;
            // Et on l'ajoute à la grille dans la page.
            galleryGrid.appendChild(galleryItem);
        });
        
        // Une fois la galerie créée, on active les animations et les boutons "like".
        setupScrollAnimations();
        addLikeFunctionality();
    }
    
    // Fonction pour afficher les articles du blog
    function displayBlog(posts) {
        posts.forEach(post => {
            const postElement = document.createElement('article');
            postElement.classList.add('blog-post', 'animate-on-scroll');
            postElement.innerHTML = `
                <h3>${post.title}</h3>
                <p class="date">${post.date}</p>
                <p>${post.content}</p>
            `;
            blogPostsContainer.appendChild(postElement);
        });
    }
    
    // Fonction pour afficher la playlist vidéo
    function displayPlaylist(videos) {
        // On crée d'abord le lecteur principal
        const videoPlayer = document.createElement('div');
        videoPlayer.classList.add('video-player');
        // On met la première vidéo de la liste par défaut
        videoPlayer.innerHTML = `<iframe src="https://www.youtube.com/embed/${videos[0].youtubeId}" frameborder="0" allowfullscreen></iframe>`;
        
        // On crée ensuite les miniatures pour changer de vidéo
        const thumbnails = document.createElement('div');
        thumbnails.classList.add('video-thumbnails');
        
        videos.forEach(video => {
            // A FAIRE : Ajouter la logique pour les miniatures si tu le souhaites.
            // Pour l'instant on affiche juste le premier lecteur.
        });
        
        playlistContainer.appendChild(videoPlayer);
    }
    

    // --- FONCTIONS POUR L'INTERACTIVITÉ ---

    // Système de filtres pour la galerie
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // D'abord, on enlève le style "actif" de tous les boutons.
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Puis on l'ajoute seulement à celui sur lequel on a cliqué.
            button.classList.add('active');

            const category = button.dataset.category; // On récupère la catégorie (ex: "voyage")
            const galleryItems = document.querySelectorAll('.gallery-item');

            galleryItems.forEach(item => {
                // On cache ou on montre l'item en fonction de sa catégorie.
                if (category === 'all' || item.dataset.category === category) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // Faux système de "like"
    function addLikeFunctionality() {
        const likeButtons = document.querySelectorAll('.like-button');
        likeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation(); // Empêche l'ouverture de l'image quand on clique sur le coeur.
                
                button.classList.toggle('liked'); // Ajoute ou enlève la classe "liked" (pour changer la couleur)
                
                const likeCountSpan = button.querySelector('.like-count');
                let currentLikes = parseInt(likeCountSpan.textContent);
                
                if (button.classList.contains('liked')) {
                    likeCountSpan.textContent = currentLikes + 1;
                } else {
                    likeCountSpan.textContent = currentLikes - 1;
                }
            });
        });
    }


    // --- FONCTIONS POUR LA PERSONNALISATION ---

    // 1. Changer le thème (Clair / Sombre)
    themeSwitcher.addEventListener('click', () => {
        // 'toggle' c'est super pratique : si la classe est là, il l'enlève. Sinon, il l'ajoute.
        document.body.classList.toggle('light-theme');
    });
    
    // 2. Changer la couleur de fond
    bgColorPicker.addEventListener('input', (event) => {
        // On change la variable CSS '--color-bg' en direct. Magique !
        document.documentElement.style.setProperty('--color-bg', event.target.value);
    });
    
    // 3. Changer la police
    fontSelector.addEventListener('change', (event) => {
        document.documentElement.style.setProperty('--font-family-base', event.target.value);
    });

    // 4. Ouvrir/fermer le panneau de personnalisation
    settingsToggle.addEventListener('click', () => {
        settingsPanel.classList.toggle('open');
    });


    // --- ANIMATIONS AU SCROLL ---
    function setupScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            // IntersectionObserver, c'est le moyen moderne et efficace de savoir
            // si un élément est visible à l'écran.
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // On arrête de l'observer une fois qu'il est visible.
                }
            });
        }, { threshold: 0.1 }); // Se déclenche quand 10% de l'élément est visible

        const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
        elementsToAnimate.forEach(el => observer.observe(el));
    }


    // --- Allez, c'est parti ! On lance le chargement du contenu. ---
    loadContent();

});