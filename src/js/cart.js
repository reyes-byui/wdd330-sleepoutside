import { getLocalStorage } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];

  // Group items by Id and count quantity
  const grouped = {};
  cartItems.forEach((item) => {
    if (!grouped[item.Id]) {
      grouped[item.Id] = { ...item, quantity: 1 };
    } else {
      grouped[item.Id].quantity += 1;
    }
  });
  const groupedItems = Object.values(grouped);

  if (groupedItems.length === 0) {
    document.querySelector(".product-list").innerHTML =
      "<p>Your cart is empty.</p>";
    return;
  }

  const htmlItems = groupedItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");

  // Add event listeners to all remove buttons
  document.querySelectorAll('.remove-from-cart').forEach(btn => {
    btn.addEventListener('click', removeFromCartHandler);
  });
}

function formatPrice(price) {
  return `$${price.toFixed(2)}`;
}

function cartItemTemplate(item) {
  let priceHtml = '';
  if (item.FinalPrice < item.SuggestedRetailPrice) {
    const percent = Math.round(
      ((item.SuggestedRetailPrice - item.FinalPrice) / item.SuggestedRetailPrice) * 100
    );
    priceHtml = `<span class="discount-indicator">-${percent}% OFF</span> <span class="old-price">${formatPrice(item.SuggestedRetailPrice)}</span> <span class="new-price">${formatPrice(item.FinalPrice)}</span>`;
  } else {
    priceHtml = formatPrice(item.FinalPrice);
  }
  
const newItem = `
  <li class="cart-card divider">
    <span class="remove-from-cart" data-id="${item.Id}" style="cursor:pointer; color:red; float:right; font-weight:bold;">&times;</span>
    <a href="#" class="cart-card__image">
      <img
        src="${item.Image}"
        alt="${item.Name}"
      />
    </a>
    <a href="#">
      <h2 class="card__name">${item.Name}</h2>
    </a>
    <p class="cart-card__color">${item.Colors[0].ColorName}</p>
    <p class="cart-card__quantity">qty: ${item.quantity || 1}</p>
    <p class="cart-card__price">${priceHtml}</p>
  </li>`;

  return newItem;
}

function removeFromCartHandler(e) {
  const idToRemove = e.target.dataset.id;
  let cart = getLocalStorage("so-cart") || [];
  // Remove the desired item
  const index = cart.findIndex(item => String(item.Id) === String(idToRemove));
  if (index !== -1) {
    cart.splice(index, 1);
    localStorage.setItem("so-cart", JSON.stringify(cart));
    renderCartContents();
  }
}

// handle emptying the cart
function emptyCartHandler() {
  localStorage.removeItem("so-cart");
  renderCartContents();
}
// event listener for emptying the cart
const emptyCartBtn = document.getElementById("emptyCart");
if (emptyCartBtn) {
  emptyCartBtn.addEventListener("click", emptyCartHandler);
}

renderCartContents();
