// On importe les fonctions nécessaires directement depuis les serveurs de Firebase.
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js";
import { getFirestore, collection, doc, onSnapshot, orderBy, query, setDoc, addDoc, updateDoc, deleteDoc, serverTimestamp, getDoc } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-storage.js";

// Ta configuration personnelle.
const firebaseConfig = {
  apiKey: "AIzaSyCw7i-klFl5jEiMM65cG6eNJPMuC5f-Xwg",
  authDomain: "plateforme-nasma-e97c2.firebaseapp.com",
  projectId: "plateforme-nasma-e97c2",
  storageBucket: "plateforme-nasma-e97c2.firebasestorage.app",
  messagingSenderId: "1083857488448",
  appId: "1:1083857488448:web:6d011487c911fd80786da5",
  measurementId: "G-75PSWL3CSK"
};

// On initialise Firebase
const app = initializeApp(firebaseConfig);

// On initialise les services et on les prépare pour l'export
const db = getFirestore(app);
const storage = getStorage(app);

// On exporte tout ce dont nos autres fichiers auront besoin
export {
  db,
  storage,
  ref,
  uploadBytes,
  getDownloadURL,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  getDoc
};