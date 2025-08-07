# Mon Espace Perso ✨

Bienvenue sur le projet "Mon Espace Perso", une plateforme web conçue pour être un mini réseau social personnel, entièrement personnalisable et interactif. Ce projet est développé avec des technologies web de base (HTML, CSS, JavaScript) et ne nécessite aucune base de données, rendant son déploiement et sa maintenance très simples.

![Aperçu du site](https://placehold.co/800x400/1a1a2e/e0e0e0?text=Aperçu+de+la+Plateforme)
*(Astuce : Remplacez le lien ci-dessus par une capture d'écran de votre site !)*

---

## 🚀 Fonctionnalités Clés

Ce projet intègre de nombreuses fonctionnalités pour créer une expérience riche et immersive :

* **Gestion de Profil Complète (CRUD)** : Modifiez votre nom, biographie et photo de profil directement depuis l'interface.
* **Gestion de Projets (CRUD)** : Ajoutez, modifiez ou supprimez des projets (images ou vidéos YouTube) dans une galerie dynamique.
* **Journal Personnel (CRUD)** : Tenez un journal intime en ajoutant, modifiant ou supprimant des articles.
* **Personnalisation en Direct** :
    * **Thème Clair / Sombre** avec sauvegarde dans le navigateur.
    * Choix de la **couleur d'accentuation** parmi une palette prédéfinie.
    * Sélection de la **police d'écriture** (via Google Fonts).
* **Mode Aperçu Visiteur** : Cachez tous les outils d'édition pour voir le site comme le verrait un simple visiteur.
* **Interface Responsive** : Le site est entièrement adapté pour une navigation fluide sur ordinateur, tablette et mobile.
* **Formulaire de Contact** : Une section simple pour envoyer un message (simulation).
* **Animations Modernes** : Des transitions douces et des apparitions au défilement pour une expérience utilisateur agréable.
* **Sauvegarde Locale** : Toutes vos modifications (profil, articles, projets, thème) sont sauvegardées dans le `localStorage` de votre navigateur.

---

## 🛠️ Technologies Utilisées

Ce projet est volontairement simple et repose sur les fondamentaux du développement web :

* **HTML5** : Pour la structure sémantique du contenu.
* **CSS3** : Pour le style, le design responsive et les animations. Utilisation des variables CSS pour une thématisation facile.
* **JavaScript (ES6+)** : Pour toute la logique interactive, la manipulation du DOM, la gestion des événements et l'interaction avec le `localStorage`.

Aucun framework ou librairie complexe n'est nécessaire. Les icônes sont fournies par [Boxicons](https://boxicons.com/).

---

## ⚙️ Installation et Lancement

Pour lancer ce projet sur votre machine locale, suivez ces étapes simples :

1.  **Clonez le dépôt** (ou téléchargez les fichiers) :
    ```bash
    git clone [https://github.com/VOTRE_PSEUDO/VOTRE_DEPOT.git](https://github.com/VOTRE_PSEUDO/VOTRE_DEPOT.git)
    ```

2.  **Naviguez dans le dossier du projet** :
    ```bash
    cd nom-du-dossier
    ```

3.  **Ouvrez le fichier `index.html`** dans votre navigateur web.
    * Pour une meilleure expérience de développement (avec rechargement automatique), il est recommandé d'utiliser une extension comme **"Live Server"** sur Visual Studio Code.

---

## 📁 Structure des Fichiers

Le projet est organisé de manière simple et intuitive :


.
├── 📄 index.html      # Fichier principal, la structure de la page
├── 🎨 style.css       # Tous les styles CSS
├── 🧠 script.js       # Toute la logique JavaScript
├── 📦 data.json       # Contenu initial (profil, projets, articles) pour le premier lancement
└── 🖼️ assets/          # Dossier pour stocker vos images (non suivi par git par défaut)


---

## 🎨 Personnalisation du Contenu Initial

Pour modifier le contenu qui s'affiche lors du premier chargement du site (avant toute modification dans l'interface), vous pouvez éditer le fichier `data.json`. C'est ici que vous définissez le profil, les projets et les articles de blog par défaut.

---

## 👤 Auteur

Ce projet a été développé par **[Votre Nom]**. N'hésitez pas à me contacter ou à contribuer !
