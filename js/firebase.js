// Ta configuration personnelle.
const firebaseConfig = {
  apiKey: "AIzaSyCw7i-klFl5jEiMM65cG6eNJPMuC5f-Xwg",
  authDomain: "plateforme-nasma-e97c2.firebaseapp.com",
  projectId: "plateforme-nasma-e97c2",
  storageBucket: "plateforme-nasma-e97c2.appspot.com",
  messagingSenderId: "1083857488448",
  appId: "1:1083857488448:web:6d011487c911fd80786da5",
  measurementId: "G-75PSWL3CSK"
};

// On initialise Firebase s'il ne l'est pas déjà.
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// On crée une référence à la base de données Firestore.
const db = firebase.firestore();
