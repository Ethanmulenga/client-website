// js/search.js

// Initialize Firebase
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// UI References
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");

// Debounce function to limit requests
const debounce = (func, delay = 300) => {
let timeout;
return (...args) => {
  clearTimeout(timeout);
  timeout = setTimeout(() => func.apply(this, args), delay);
};
};

// Search function querying Firebase Realtime Database
const searchFirebase = async (searchTerm) => {
try {
  const sanitizedTerm = searchTerm.toLowerCase().trim();
  const query = db.ref('products').orderByChild('searchName');
  const snapshot = await query
    .startAt(sanitizedTerm)
    .endAt(sanitizedTerm + '\uf8ff')
    .once('value');
  const results = snapshot.exists() ? snapshot.val() : {};
  return results;
} catch (error) {
  console.error('Search error:', error);
  return {};
}
};

// Display results with clickable links
const displayResults = (products) => {
searchResults.innerHTML = '';
if (!Object.keys(products).length) {
  searchResults.innerHTML = '<li class="px-4 py-2 text-gray-500">No results found</li>';
  return;
}
Object.entries(products).forEach(([productId, product]) => {
  const li = document.createElement('li');
  li.className = 'px-4 py-2 hover:bg-gray-100 cursor-pointer';
  li.innerHTML = `
    <a href="products.html?id=${productId}" class="block text-gray-800">
      ${product.name} - $${product.price}
      <span class="text-sm text-gray-500">${product.category}</span>
    </a>
  `;
  searchResults.appendChild(li);
});
};

// Handle search input with debounce
searchInput.addEventListener('input', debounce(async (e) => {
const searchTerm = e.target.value.trim();
if (searchTerm.length === 0) {
  searchResults.classList.add('hidden');
  searchResults.innerHTML = '';
  return;
}
searchResults.classList.remove('hidden');
const results = await searchFirebase(searchTerm);
displayResults(results);
}));

// Close results when clicking outside
document.addEventListener('click', (e) => {
if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
  searchResults.classList.add('hidden');
}
});
