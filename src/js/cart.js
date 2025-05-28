import { getLocalStorage } from "./utils.mjs";
import { triggerCartCountUpdate } from "./header.js";

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
    // Also clear the cart-totals div when cart is empty
    const totalsDiv = document.getElementById('cart-totals');
    if (totalsDiv) {
      totalsDiv.innerHTML = '';
    }
    return;
  }

  const htmlItems = groupedItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");

  // Add event listeners to all remove buttons
  document.querySelectorAll('.remove-from-cart').forEach(btn => {
    btn.addEventListener('click', removeFromCartHandler);
  });

  // Calculate totals
  let originalTotal = 0;
  let discountedTotal = 0;
  groupedItems.forEach(item => {
    const qty = item.quantity || 1;
    const orig = item.SuggestedRetailPrice || item.ListPrice || item.FinalPrice || 0;
    const disc = item.FinalPrice || item.ListPrice || 0;
    originalTotal += orig * qty;
    discountedTotal += disc * qty;
  });
  const discountAmount = originalTotal - discountedTotal;

  // Display totals
  const totalsDiv = document.getElementById('cart-totals');
  if (totalsDiv) {
    // Calculate total number of items in the cart
    const totalItems = groupedItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
    totalsDiv.innerHTML = `
      <div class="cart-footer">
        <p class="cart-total">Total items: <span class="cart-items-count">${totalItems}</span></p>
        <p class="cart-total">Total: <span class="old-price">${formatPrice(originalTotal)}</span></p>
        <p class="cart-total">Discount: <span class="discount-indicator">-${formatPrice(discountAmount)}</span></p>
        <p class="cart-total">To Pay: <span class="new-price">${formatPrice(discountedTotal)}</span></p>
      </div>
    `;
  }

  // At the end of renderCartContents, update the cart count in the header
  triggerCartCountUpdate();
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
    triggerCartCountUpdate(); // Ensure header updates after remove
  }
}

// handle emptying the cart
function emptyCartHandler() {
  localStorage.removeItem("so-cart");
  renderCartContents();
  triggerCartCountUpdate(); // Ensure header updates after empty
}
// event listener for emptying the cart
const emptyCartBtn = document.getElementById("emptyCart");
if (emptyCartBtn) {
  emptyCartBtn.addEventListener("click", emptyCartHandler);
}

renderCartContents();
