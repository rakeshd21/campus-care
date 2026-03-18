// ── Firebase Configuration ──
// Replace the values below with your own Firebase project config
// Get it from: Firebase Console → Project Settings → Your Apps → Web App

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore  } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage    } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

const firebaseConfig = {
<<<<<<< HEAD
  apiKey: "your api key",
  authDomain: "campuscare-28f5d.firebaseapp.com",
  projectId: "campuscare-28f5d",
=======
  apiKey:            "AIzaSyATDI89sphFyKNY7l7vG3VR8UO7e2nOfTQ",
  authDomain:        "campuscare-28f5d.firebaseapp.com",
  projectId:         "campuscare-28f5d",
  storageBucket:     "campuscare-28f5d.appspot.com",  // ← add this for image uploads
  messagingSenderId: "",                               // ← add from your Firebase console
  appId:             ""                               // ← add from your Firebase console
>>>>>>> 0e030e5 (newversion)
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

export { db };
