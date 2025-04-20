import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getDatabase, ref, push, set } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

// Firebase config from environment variables (example, adjust as needed)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// Event listener for all "Add to Cart" buttons
document.addEventListener('DOMContentLoaded', () => {
  const cartButtons = document.querySelectorAll('.add-to-cart');

  cartButtons.forEach((button) => {
    button.addEventListener('click', () => {
      // Get product details from data attributes
      const productId = button.getAttribute('data-product-id');
      const productName = button.getAttribute('data-product-name');
      const productPrice = parseFloat(button.getAttribute('data-product-price'));
      
      // Build the product object
      const cartItem = {
        productId,
        productName,
        productPrice,
        quantity: 1 // default to one, you can enhance this to allow changing the quantity
      };

      // Check if the user is signed in
      onAuthStateChanged(auth, (user) => {
        if (user) {
          // The user is signed in, use their unique user ID
          const userCartRef = ref(database, `carts/${user.uid}`);
          // Use push to add a new entry under the user's cart.
          const newCartItemRef = push(userCartRef);
          set(newCartItemRef, cartItem)
            .then(() => {
              alert(`"${productName}" was added to your cart!`);
            })
            .catch((error) => {
              alert("Error adding product to cart: " + error.message);
              console.error("Cart Error:", error);
            });
        } else {
          // If not signed in, tell the user to sign in first.
          alert("Please log in to add products to your cart.");
          // Optionally, redirect to the login page:
          // window.location.href = "login.html";
        }
      });
    });
  });
});
