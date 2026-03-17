// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Your config (PASTE YOURS HERE)
const firebaseConfig = {
  apiKey: "AIzaSyATDI89sphFyKNY7l7vG3VR8UO7e2nOfTQ",
  authDomain: "campuscare-28f5d.firebaseapp.com",
  projectId: "campuscare-28f5d",
};

// Initialize
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };