// Dynamically load the header partial into the #header div
function getHeaderPath() {
  const path = window.location.pathname;
  const depth = path.replace(/^\/+|\/+$|index.html$/g, '').split('/').length - 1;
  let prefix = '';
  for (let i = 0; i < depth; i++) {
    prefix += '../';
  }
  return prefix + 'partials/header.html';
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
