// Dynamically load the header partial into the #header div
fetch('/partials/header.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('header').innerHTML = data;
    updateCartCount();
  });

function updateCartCount() {
  // Example: cart stored as array in localStorage under 'so-cart'
  let cart = [];
  try {
    cart = JSON.parse(localStorage.getItem('so-cart')) || [];
  } catch (e) {
    cart = [];
  }
  const count = cart.length;
  const countElem = document.getElementById('cart-count');
  if (countElem) {
    countElem.textContent = count > 0 ? count : '';
  }
}
