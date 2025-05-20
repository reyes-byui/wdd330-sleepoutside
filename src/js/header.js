// Dynamically load the header partial into the #header div
function getHeaderPath() {
  // If running from a subfolder, use relative path
  const path = window.location.pathname;
  if (path.includes('/cart/') || path.includes('/checkout/') || path.includes('/product_pages/')) {
    return '../partials/header.html';
  }
  return 'partials/header.html';
}

fetch(getHeaderPath())
  .then(response => response.text())
  .then(data => {
    document.getElementById('header').innerHTML = data;
    updateCartCount();
  });

function updateCartCount() {
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
