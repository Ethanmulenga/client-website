// login.js (update existing file)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCUCTY-wtfBM_vI8DYEHMEBhyfdTrP9GjY",
  authDomain: "login-6c546.firebaseapp.com",
  projectId: "login-6c546",
  storageBucket: "login-6c546.appspot.com",
  messagingSenderId: "705543890950",
  appId: "1:705543890950:web:dbf161182061c3ebdd3b87",
  measurementId: "G-SE9Y1KET8R"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Auto-redirect if already logged in
onAuthStateChanged(auth, (user) => {
  if (user) window.location.href = 'home.html';
});

document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('login-button');

    loginButton.addEventListener('click', function(event) {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        signInWithEmailAndPassword(auth, email, password)
            .then(() => window.location.href = "home.html")
            .catch((error) => alert("Login failed: " + error.message));
    });
});