// admin.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

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
const database = getDatabase(app);

window.showSection = function(sectionId) {
    const sections = document.querySelectorAll("main section");
    sections.forEach(sec => sec.classList.add("hidden"));
    document.getElementById(sectionId).classList.remove("hidden");
};

window.logout = function() {
    signOut(auth).then(() => {
        window.location.href = "/login.html";
    });
};

onAuthStateChanged(auth, (user) => {
    if (!user || user.email !== "admin@example.com") {
        alert("Access denied.");
        window.location.href = "/login.html";
    } else {
        loadProducts();
        loadOrders();
        loadUsers();
        loadAnalytics();
    }
});

function loadProducts() {
    const productList = document.getElementById("productList");
    const productsRef = ref(database, "products");
    onValue(productsRef, (snapshot) => {
        const products = snapshot.val() || {};
        productList.innerHTML = "";
        Object.entries(products).forEach(([id, product]) => {
            const div = document.createElement("div");
            div.className = "border p-2 rounded mb-2";
            div.textContent = `${product.name} - $${product.price} (${product.category})`;
            productList.appendChild(div);
        });
    });
}

function loadOrders() {
    const orderList = document.getElementById("orderList");
    const ordersRef = ref(database, "orders");
    onValue(ordersRef, (snapshot) => {
        const orders = snapshot.val() || {};
        orderList.innerHTML = "";
        Object.entries(orders).forEach(([id, order]) => {
            const div = document.createElement("div");
            div.className = "border p-2 rounded mb-2";
            div.textContent = `Order ${id} - User: ${order.userId} - Total: $${order.total || 0}`;
            orderList.appendChild(div);
        });
    });
}

function loadUsers() {
    const userList = document.getElementById("userList");
    const usersRef = ref(database, "users");
    onValue(usersRef, (snapshot) => {
        const users = snapshot.val() || {};
        userList.innerHTML = "";
        Object.entries(users).forEach(([id, user]) => {
            const div = document.createElement("div");
            div.className = "border p-2 rounded mb-2";
            div.textContent = `${user.name} - ${user.email}`;
            userList.appendChild(div);
        });
    });
}

function loadAnalytics() {
    const totalSalesElem = document.getElementById("totalSales");
    const totalUsersElem = document.getElementById("totalUsers");

    const ordersRef = ref(database, "orders");
    onValue(ordersRef, (snapshot) => {
        const orders = snapshot.val() || {};
        let totalSales = 0;
        Object.values(orders).forEach(order => {
            totalSales += order.total || 0;
        });
        totalSalesElem.textContent = `$${totalSales.toFixed(2)}`;
    });

    const usersRef = ref(database, "users");
    onValue(usersRef, (snapshot) => {
        const users = snapshot.val() || {};
        totalUsersElem.textContent = Object.keys(users).length;
    });
}
