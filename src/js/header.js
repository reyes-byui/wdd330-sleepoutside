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

fetch('/partials/footer.html')
  .then(response => {
    if (!response.ok) {
      throw new Error('Footer partial not found: ' + response.status);
    }
    return response.text();
  })
  .then(data => {
    document.getElementById('footer').innerHTML = data;
    updateCartCount();
  })
  .catch(error => {
    console.error('Error loading footer:', error);
  });

function updateCartCount() {
  let cart = [];
  try {
    cart = JSON.parse(localStorage.getItem('so-cart')) || [];
  } catch (e) {
    cart = [];
  }
  // Always count the number of items in the cart (flat array)
  const count = Array.isArray(cart) ? cart.length : 0;
  const countElem = document.getElementById('cart-count');
  if (countElem) {
    countElem.textContent = count > 0 ? count : '';
    countElem.style.display = 'inline'; // Always show the element
  } else {
    // Try again after a short delay in case the header is loaded asynchronously
    setTimeout(updateCartCount, 100);
  }
}
