const menuItems = [
  {
    id: "m1",
    name: "Paneer Tikka",
    description: "Char-grilled cottage cheese cubes with mint chutney.",
    price: "₹280",
    type: "veg",
    image:
      "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "m2",
    name: "Margherita Pizza",
    description: "Stone-baked pizza with mozzarella, basil, and tomato sauce.",
    price: "₹340",
    type: "veg",
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "m3",
    name: "Veg Hakka Noodles",
    description: "Wok-tossed noodles with fresh vegetables and Asian sauces.",
    price: "₹260",
    type: "veg",
    image:
      "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "m4",
    name: "Chicken Tandoori",
    description: "Classic marinated chicken roasted in traditional tandoor.",
    price: "₹420",
    type: "non-veg",
    image:
      "https://images.unsplash.com/photo-1598515214211-89d3c737e9f5?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "m5",
    name: "Butter Chicken",
    description: "Creamy tomato gravy with tender chicken pieces and spices.",
    price: "₹390",
    type: "non-veg",
    image:
      "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "m6",
    name: "Fish Curry",
    description: "Lightly spiced coconut fish curry served with aromatic herbs.",
    price: "₹450",
    type: "non-veg",
    image:
      "https://images.unsplash.com/photo-1625943553852-781c6dd46faa?auto=format&fit=crop&w=500&q=80",
  },
];

const menuList = document.getElementById("menu-list");
const menuCount = document.getElementById("menu-count");
const tableNumber = document.getElementById("table-number");
const demoTableBtn = document.getElementById("demo-table-btn");
const categoryButtons = document.querySelectorAll(".category-btn");

let activeCategory = "all";

const getTableParam = () => {
  const params = new URLSearchParams(window.location.search);
  const table = params.get("table");
  if (!table || !table.trim()) {
    return null;
  }
  return table.trim();
};

const updateTableView = () => {
  const table = getTableParam();
  if (!table) {
    tableNumber.textContent = "Not detected";
    demoTableBtn.style.display = "inline-flex";
    return;
  }

  tableNumber.textContent = `Table ${table}`;
  demoTableBtn.style.display = "none";
};

const renderMenu = () => {
  const visibleItems =
    activeCategory === "all"
      ? menuItems
      : menuItems.filter((item) => item.type === activeCategory);

  menuCount.textContent = `${visibleItems.length} item${visibleItems.length === 1 ? "" : "s"}`;

  if (visibleItems.length === 0) {
    menuList.innerHTML =
      '<p class="empty-state" data-testid="menu-empty-state">No items available in this category.</p>';
    return;
  }

  menuList.innerHTML = visibleItems
    .map(
      (item) => `
      <article class="menu-card" data-testid="menu-item-card-${item.id}">
        <div class="menu-card-meta" data-testid="menu-item-meta-${item.id}">
          <div class="menu-card-top" data-testid="menu-item-top-${item.id}">
            <h3 class="menu-title" data-testid="menu-item-name-${item.id}">${item.name}</h3>
            <span class="menu-type-badge ${item.type}" data-testid="menu-item-type-${item.id}">
              ${item.type === "veg" ? "Veg" : "Non-Veg"}
            </span>
          </div>
          <p class="menu-description" data-testid="menu-item-description-${item.id}">${item.description}</p>
          <p class="menu-price">${item.price}</p>

<div class="quantity-controls">
  <button onclick="decreaseItem('${item.id}')">−</button>
  <span id="qty-${item.id}">0</span>
  <button onclick="addItem('${item.id}')">+</button>
</div>
        </div>
        <div class="menu-image-wrap" data-testid="menu-item-image-wrap-${item.id}">
          <img src="${item.image}" alt="${item.name}" class="menu-image" data-testid="menu-item-image-${item.id}" loading="lazy" />
        </div>
      </article>
    `,
    )
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

categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setCategory(button.dataset.category);
  });
});

demoTableBtn.addEventListener("click", () => {
  const currentUrl = new URL(window.location.href);
  currentUrl.searchParams.set("table", "12");
  window.location.href = currentUrl.toString();
});

updateTableView();
setCategory("all");

let cart = {};

const cartItemsContainer = document.getElementById("cart-items");
const cartSubtotal = document.getElementById("cart-subtotal");
const cartGST = document.getElementById("cart-gst");
const cartTotal = document.getElementById("cart-total");
const cartTableText = document.getElementById("cart-table-number");

function addItem(id) {
  const item = menuItems.find(i => i.id === id);

  if (!cart[id]) {
    cart[id] = { ...item, quantity: 1 };
  } else {
    cart[id].quantity++;
  }

  updateCart();
}

function decreaseItem(id) {
  if (!cart[id]) return;

  cart[id].quantity--;
  if (cart[id].quantity <= 0) delete cart[id];

  updateCart();
}

function updateCart() {
  let subtotal = 0;

  if (Object.keys(cart).length === 0) {
    cartItemsContainer.innerHTML =
      '<p class="cart-empty">Your cart is empty</p>';
    cartSubtotal.textContent = "₹0";
    cartGST.textContent = "₹0";
    cartTotal.textContent = "₹0";
  } else {
    cartItemsContainer.innerHTML = Object.values(cart).map(item => {
      const price = parseInt(item.price.replace("₹", ""));
      const itemTotal = price * item.quantity;
      subtotal += itemTotal;

      return `
        <div class="cart-item">
          <img src="${item.image}" class="cart-img"/>
          <div class="cart-item-info">
            <div>${item.name}</div>
            <div>Qty: ${item.quantity}</div>
            <strong>₹${itemTotal}</strong>
          </div>
          <button onclick="removeItem('${item.id}')" class="remove-btn">✕</button>
        </div>
      `;
    }).join("");

    const gst = subtotal * 0.05;
    const total = subtotal + gst;

    cartSubtotal.textContent = `₹${subtotal}`;
    cartGST.textContent = `₹${gst.toFixed(0)}`;
    cartTotal.textContent = `₹${total.toFixed(0)}`;
  }

  menuItems.forEach(item => {
    const qty = document.getElementById(`qty-${item.id}`);
    if (qty) qty.textContent = cart[item.id]?.quantity || 0;
  });

  const table = getTableParam();
  cartTableText.textContent = table ? `Table ${table}` : "";
}

function removeItem(id) {
  delete cart[id];
  updateCart();
}

document.getElementById("clear-cart-btn")
  .addEventListener("click", () => {
    cart = {};
    updateCart();
  });

document.getElementById("place-order-btn")
  .addEventListener("click", () => {
    if (Object.keys(cart).length === 0) {
      alert("Your cart is empty!");
      return;
    }
    alert("Order placed successfully! 🎉");
    cart = {};
    updateCart();
  });