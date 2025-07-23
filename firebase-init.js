// firebase-init.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBdubicFblwJc6a9hwIcFVYQgF5sJmCZVs",
  authDomain: "fun-facts-site.firebaseapp.com",
  projectId: "fun-facts-site",
  storageBucket: "fun-facts-site.appspot.com",
  messagingSenderId: "727488515661",
  appId: "1:727488515661:web:4e4c464012bd5901245604",
  measurementId: "G-L6KRL4C2XT"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
