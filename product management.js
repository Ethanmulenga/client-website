// admin.js
const db = firebase.database();
const productForm = document.getElementById("productForm");
const productList = document.getElementById("productList");

// Add Product
productForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("productName").value;
  const price = document.getElementById("productPrice").value;
  const category = document.getElementById("productCategory").value;
  const image = document.getElementById("productImage").value;

  const newProductRef = db.ref("products").push();
  newProductRef.set({ name, price, category, image });

  productForm.reset();
});

// Display Products
function loadProducts() {
  db.ref("products").on("value", (snapshot) => {
    productList.innerHTML = "";
    snapshot.forEach((childSnapshot) => {
      const product = childSnapshot.val();
      const key = childSnapshot.key;

      const card = document.createElement("div");
      card.className = "p-4 bg-white rounded shadow flex items-center justify-between";
      card.innerHTML = `
        <div>
          <h4 class="font-bold text-lg">${product.name}</h4>
          <p>$${product.price}</p>
          <p class="text-sm text-gray-500">${product.category}</p>
        </div>
        <div class="space-x-2">
          <button onclick="editProduct('${key}')" class="px-3 py-1 bg-yellow-400 rounded">Edit</button>
          <button onclick="deleteProduct('${key}')" class="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
        </div>
      `;
      productList.appendChild(card);
    });
  });
}

// Delete Product
function deleteProduct(id) {
  db.ref("products/" + id).remove();
}

// Edit Product (basic prompt version)
function editProduct(id) {
  const productRef = db.ref("products/" + id);
  productRef.once("value").then((snapshot) => {
    const product = snapshot.val();
    const name = prompt("Edit Name", product.name);
    const price = prompt("Edit Price", product.price);
    const category = prompt("Edit Category", product.category);
    const image = prompt("Edit Image URL", product.image);
    if (name && price && category && image) {
      productRef.set({ name, price, category, image });
    }
  });
}

window.onload = loadProducts;
