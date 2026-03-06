const menuItems = [
  {
id: "m1",
name: "Paneer Tikka",
description: "Char-grilled cottage cheese cubes with mint chutney.",
price: 280,
type: "veg",
image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=500&q=80",
  },
  {
id: "m2",
name: "Margherita Pizza",
description: "Stone-baked pizza with mozzarella, basil, and tomato sauce.",
price: 340,
type: "veg",
image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=500&q=80",
  },
  {
id: "m3",
name: "Veg Hakka Noodles",
description: "Wok-tossed noodles with fresh vegetables and Asian sauces.",
price: 260,
type: "veg",
image: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=500&q=80",
  },
  {
id: "m4",
name: "Chicken Tandoori",
description: "Classic marinated chicken roasted in traditional tandoor.",
price: 420,
type: "non-veg",
image: "https://images.unsplash.com/photo-1598515214211-89d3c737e9f5?auto=format&fit=crop&w=500&q=80",
  },
  {
id: "m5",
name: "Butter Chicken",
description: "Creamy tomato gravy with tender chicken pieces and spices.",
price: 390,
type: "non-veg",
image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=500&q=80",
  },
  {
id: "m6",
name: "Fish Curry",
description: "Lightly spiced coconut fish curry served with aromatic herbs.",
price: 450,
type: "non-veg",
image: "https://images.unsplash.com/photo-1625943553852-781c6dd46faa?auto=format&fit=crop&w=500&q=80",
  },
];

// DOM Elements
const menuList = document.getElementById("menu-list");
const menuCount = document.getElementById("menu-count");
const tableNumber = document.getElementById("table-number");
const demoTableBtn = document.getElementById("demo-table-btn");
const categoryButtons = document.querySelectorAll(".category-btn");
const cartSidebar = document.getElementById("cart-sidebar");
const cartOverlay = document.getElementById("cart-overlay");
const cartToggleBtn = document.getElementById("cart-toggle-btn");
const cartCloseBtn = document.getElementById("cart-close-btn");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartBadge = document.getElementById("cart-badge");
const cartTableInfo = document.getElementById("cart-table-info");
const orderBtn = document.getElementById("order-btn");
const tableEntryScreen = document.getElementById("table-entry-screen");
const tableEntryForm = document.getElementById("table-entry-form");
const tableEntryInput = document.getElementById("table-entry-input");
const tableEntryError = document.getElementById("table-entry-error");

let activeCategory = "all";
let cart = {}; // { itemId: quantity }

// Utility Functions
const getTableParam = () => {
  const params = new URLSearchParams(window.location.search);
  const table = params.get("table");
  return table && table.trim() ? table.trim() : null;
};

const isValidTable = (value) => /^[A-Za-z0-9-]{1,10}$/.test(value);

const setTableInUrl = (table) => {
  const currentUrl = new URL(window.location.href);
  currentUrl.searchParams.set("table", table);
  window.history.replaceState({}, "", currentUrl.toString());
};

const hideTableEntryScreen = () => {
  tableEntryScreen.classList.add("hidden");
  tableEntryError.classList.add("hidden");
  tableEntryError.textContent = "";
  document.body.classList.remove("no-scroll");
};

const showTableEntryScreen = () => {
  tableEntryScreen.classList.remove("hidden");
  document.body.classList.add("no-scroll");
  tableEntryInput.focus();
};

const initializeTableEntry = () => {
  const table = getTableParam();
  if (table) {
    hideTableEntryScreen();
    return;
  }
  showTableEntryScreen();
};

const updateTableView = () => {
  const table = getTableParam();
  if (!table) {
tableNumber.textContent = "Not detected";
demoTableBtn.style.display = "inline-flex";
cartTableInfo.classList.add("hidden");
  } else {
tableNumber.textContent = `Table ${table}`;
demoTableBtn.style.display = "none";
cartTableInfo.textContent = `Table ${table}`;
cartTableInfo.classList.remove("hidden");
  }
};

const getCartTotal = () => {
  return Object.entries(cart).reduce((sum, [id, qty]) => {
const item = menuItems.find((m) => m.id === id);
return sum + (item ? item.price * qty : 0);
  }, 0);
};

const getCartItemCount = () => {
  return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
};

const updateCartBadge = () => {
  const count = getCartItemCount();
  cartBadge.textContent = count;
  cartBadge.classList.toggle("hidden", count === 0);
};

const renderCart = () => {
  const total = getCartTotal();
  const count = getCartItemCount();

  cartTotal.textContent = `₹${total}`;
  updateCartBadge();

  if (count === 0) {
orderBtn.textContent = "Add items to order";
orderBtn.classList.add("disabled");
cartItems.innerHTML = `
  <div class="cart-empty">
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
    <p>Your cart is empty</p>
    <small>Add items from the menu</small>
  </div>
`;
return;
  }

  orderBtn.textContent = `Place Order (${count} items)`;
  orderBtn.classList.remove("disabled");

  cartItems.innerHTML = Object.entries(cart)
.filter(([_, qty]) => qty > 0)
.map(([id, qty]) => {
  const item = menuItems.find((m) => m.id === id);
  return `
    <div class="cart-item">
      <div class="cart-item-img">
        <img src="${item.image}" alt="${item.name}" />
      </div>
      <div class="cart-item-details">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">₹${item.price}</div>
        <div class="cart-item-row">
          <div class="cart-item-qty">
            <button onclick="removeFromCart('${item.id}')" aria-label="Remove one">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/></svg>
            </button>
            <span>${qty}</span>
            <button onclick="addToCart('${item.id}')" aria-label="Add one more">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
            </button>
          </div>
          <span class="cart-item-subtotal">₹${item.price * qty}</span>
        </div>
      </div>
    </div>
  `;
})
.join("");
};

const addToCart = (itemId) => {
  cart[itemId] = (cart[itemId] || 0) + 1;
  renderCart();
  renderMenu();
};

const removeFromCart = (itemId) => {
  if (cart[itemId]) {
cart[itemId]--;
if (cart[itemId] <= 0) delete cart[itemId];
  }
  renderCart();
  renderMenu();
};

// Make functions globally available
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;

const renderMenu = () => {
  const visibleItems =
activeCategory === "all"
  ? menuItems
  : menuItems.filter((item) => item.type === activeCategory);

  menuCount.textContent = `${visibleItems.length} item${visibleItems.length === 1 ? "" : "s"}`;

  if (visibleItems.length === 0) {
menuList.innerHTML = '<p class="empty-state">No items available in this category.</p>';
return;
  }

  menuList.innerHTML = visibleItems
.map((item) => {
  const qty = cart[item.id] || 0;
  return `
    <article class="menu-card">
      <div class="menu-card-meta">
        <div class="menu-card-top">
          <h3 class="menu-title">${item.name}</h3>
          <span class="menu-type-badge ${item.type}">${item.type === "veg" ? "Veg" : "Non-Veg"}</span>
        </div>
        <p class="menu-description">${item.description}</p>
        <p class="menu-price">₹${item.price}</p>
        <div class="menu-controls">
          ${
            qty === 0
              ? `<button class="add-btn" onclick="addToCart('${item.id}')">
                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                   Add
                 </button>`
              : `<div class="qty-controls">
                   <button class="qty-btn" onclick="removeFromCart('${item.id}')" aria-label="Remove one">
                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/></svg>
                   </button>
                   <span class="qty-value">${qty}</span>
                   <button class="qty-btn" onclick="addToCart('${item.id}')" aria-label="Add one more">
                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                   </button>
                 </div>`
          }
        </div>
      </div>
      <div class="menu-image-wrap">
        <img src="${item.image}" alt="${item.name}" class="menu-image" loading="lazy" />
      </div>
    </article>
  `;
})
.join("");
};

const setCategory = (nextCategory) => {
  activeCategory = nextCategory;
  categoryButtons.forEach((button) => {
const isActive = button.dataset.category === nextCategory;
button.classList.toggle("active", isActive);
button.setAttribute("aria-pressed", String(isActive));
  });
  renderMenu();
};

const openCart = () => {
  cartSidebar.classList.add("open");
  cartOverlay.classList.remove("hidden");
};

const closeCart = () => {
  cartSidebar.classList.remove("open");
  cartOverlay.classList.add("hidden");
};

const placeOrder = () => {
  const count = getCartItemCount();
  const total = getCartTotal();
  const table = getTableParam();
  
  if (count === 0) return;
  
  alert(`Order placed for Table ${table || "Demo"}!\n\nItems: ${count}\nTotal: ₹${total}\n\nThank you for ordering!`);
};

// Event Listeners
categoryButtons.forEach((button) => {
  button.addEventListener("click", () => setCategory(button.dataset.category));
});

demoTableBtn.addEventListener("click", () => {
  setTableInUrl("12");
  updateTableView();
});

tableEntryForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const table = tableEntryInput.value.trim();

  if (!table) {
    tableEntryError.textContent = "Table number is required.";
    tableEntryError.classList.remove("hidden");
    return;
  }

  if (!isValidTable(table)) {
    tableEntryError.textContent = "Use letters, numbers, or - (max 10 chars).";
    tableEntryError.classList.remove("hidden");
    return;
  }

  setTableInUrl(table);
  hideTableEntryScreen();
  updateTableView();
});

tableEntryInput.addEventListener("input", () => {
  tableEntryError.classList.add("hidden");
  tableEntryError.textContent = "";
});

cartToggleBtn.addEventListener("click", () => {
  if (cartSidebar.classList.contains("open")) {
    closeCart();
  } else {
    openCart();
  }
});
cartCloseBtn.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);
orderBtn.addEventListener("click", placeOrder);

// Initialize
initializeTableEntry();
updateTableView();
setCategory("all");
renderCart();
