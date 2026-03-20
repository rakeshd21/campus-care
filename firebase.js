// ── Firebase Configuration ──
// Get this from Firebase Console → Project Settings → Web App

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "api id",
  authDomain: "campuscare-28f5d.firebaseapp.com",
  projectId: "campuscare-28f5d",
  storageBucket: "campuscare-28f5d.firebasestorage.app",
  messagingSenderId: "1012511944489",
  appId: "1234",
  measurementId: "G-8EK3C4STF9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore DB
const db = getFirestore(app);

// Storage (for images/files)
const storage = getStorage(app);

// Export everything you need
export { db, storage };
