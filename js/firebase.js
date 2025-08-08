// On importe les fonctions nécessaires directement depuis les serveurs de Firebase.
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js";
import { getFirestore, collection, doc, onSnapshot, orderBy, query, setDoc, addDoc, updateDoc, deleteDoc, serverTimestamp, getDoc } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-firestore.js";

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

// On initialise Firebase et on exporte la référence à la base de données.
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, doc, onSnapshot, orderBy, query, setDoc, addDoc, updateDoc, deleteDoc, serverTimestamp, getDoc };
