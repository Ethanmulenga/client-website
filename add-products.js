// add-products.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase, ref, push, set } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

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
const database = getDatabase(app);

function updateStatus(message, isError = false) {
    const statusDiv = document.getElementById('status');
    statusDiv.textContent = message;
    statusDiv.style.color = isError ? 'red' : 'green';
}

function addProduct(product) {
    const productsRef = ref(database, "products");
    const newProductRef = push(productsRef);

    set(newProductRef, product)
        .then(() => {
            updateStatus("Product added successfully!");
            console.log("Database reference:", newProductRef.key);
        })
        .catch((error) => {
            let errorMessage = "An unexpected error occurred.";
            if (error.code === "permission-denied") {
                errorMessage = "You do not have permission to add products.";
            } else if (error.code === "network-request-failed") {
                errorMessage = "Network error. Please check your internet connection.";
            }
            updateStatus(`Error: ${errorMessage}`, true);
            console.error("Full error:", error);
        });
}

document.getElementById('productForm').addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const price = parseFloat(document.getElementById('price').value);
    const category = document.getElementById('category').value.trim();
    const image = document.getElementById('image').value.trim();
    const description = document.getElementById('description').value.trim();

    const searchName = name.toLowerCase();

    const product = {
        name,
        price,
        category,
        image,
        description,
        searchName,
        createdAt: Date.now()
    };

    if (!name || !price || !category || !image || !description) {
        updateStatus("All fields are required.", true);
        return;
    }

    if (isNaN(price) || price <= 0) {
        updateStatus("Price must be a positive number.", true);
        return;
    }

    addProduct(product);
});
