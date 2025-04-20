// logout.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Show user email when logged in
onAuthStateChanged(auth, (user) => {
  if (user) {
    document.getElementById('welcome-message').textContent = `Welcome, ${user.email}`;
  } else {
    window.location.href = 'index.html';
  }
});

// Logout handler
document.getElementById('logout-btn').addEventListener('click', () => {
  signOut(auth).then(() => {
    window.location.href = 'index.html';
  }).catch((error) => {
    alert("Error logging out: " + error.message);
  });
});