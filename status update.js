// admin.js
const db = firebase.database();
const productForm = document.getElementById("productForm");
const productList = document.getElementById("productList");
const orderList = document.getElementById("orderList");

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

// Edit Product
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

// Display Orders
function loadOrders() {
  db.ref("orders").on("value", (snapshot) => {
    orderList.innerHTML = "";
    snapshot.forEach((childSnapshot) => {
      const order = childSnapshot.val();
      const key = childSnapshot.key;

      const card = document.createElement("div");
      card.className = "p-4 bg-white rounded shadow";
      card.innerHTML = `
        <h4 class="font-bold">Order ID: ${key}</h4>
        <p class="text-sm">Customer: ${order.customerName || 'N/A'}</p>
        <p class="text-sm">Email: ${order.customerEmail || 'N/A'}</p>
        <p class="text-sm">Total: $${order.total}</p>
        <p class="text-sm">Status: ${order.status || 'Pending'}</p>
        <p class="text-sm mt-2">Items:</p>
        <ul class="list-disc list-inside">
          ${order.items ? order.items.map(item => `<li>${item.name} - $${item.price}</li>`).join('') : '<li>No items</li>'}
        </ul>
        <div class="mt-4">
          <label for="statusSelect-${key}" class="text-sm mr-2">Update Status:</label>
          <select id="statusSelect-${key}" class="border p-1 rounded">
            <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>Pending</option>
            <option value="Shipped" ${order.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
            <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
          </select>
          <button onclick="updateOrderStatus('${key}')" class="ml-2 px-3 py-1 bg-blue-500 text-white rounded">Update</button>
        </div>
      `;
      orderList.appendChild(card);
    });
  });
}

function updateOrderStatus(orderId) {
  const status = document.getElementById(`statusSelect-${orderId}`).value;
  db.ref(`orders/${orderId}/status`).set(status);
}

window.onload = () => {
  loadProducts();
  loadOrders();
};
