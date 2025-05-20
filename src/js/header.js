// Dynamically load the header partial into the #header div
fetch('/partials/header.html')
  .then(response => {
    if (!response.ok) {
      throw new Error('Header partial not found: ' + response.status);
    }
    return response.text();
  })
  .then(data => {
    document.getElementById('header').innerHTML = data;
    updateCartCount();
  })
  .catch(error => {
    console.error('Error loading header:', error);
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
