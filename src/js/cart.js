import { getLocalStorage } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];

  if (cartItems.length === 0) {
    document.querySelector(".product-list").innerHTML =
      "<p>Your cart is empty.</p>";
    return;
  }

  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");

  // Add event listeners to all remove buttons
  document.querySelectorAll('.remove-from-cart').forEach(btn => {
    btn.addEventListener('click', removeFromCartHandler);
  });
}

function cartItemTemplate(item) {
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
    <p class="cart-card__quantity">qty: 1</p>
    <p class="cart-card__price">$${item.FinalPrice}</p>
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
