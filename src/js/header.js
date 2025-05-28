// Only export updateCartCount, no fetch logic
export function updateCartCount() {
  let cart = JSON.parse(localStorage.getItem('so-cart')) || [];
  const grouped = {};
  for (const item of cart) {
    if (!grouped[item.Id]) {
      grouped[item.Id] = { ...item, quantity: 1 };
    } else {
      grouped[item.Id].quantity += 1;
    }
  }
  const groupedItems = Object.values(grouped);
  const totalItems = groupedItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const header = document.getElementById('header');
  if (header) {
    const cartLink = header.querySelector('.cart-link');
    if (cartLink) {
      let countSpan = cartLink.querySelector('.cart-count');
      if (!countSpan) {
        countSpan = document.createElement('span');
        countSpan.className = 'cart-count';
        countSpan.style.marginLeft = '8px';
        cartLink.appendChild(countSpan);
      }
      countSpan.textContent = totalItems;
      const cartDiv = cartLink.parentNode;
      if (cartDiv) {
        const oldText = cartDiv.querySelector('.cart-items-text');
        if (oldText) oldText.remove();
      }
    }
  }
}

// Listen for cart changes in this tab
window.addEventListener('storage', function(e) {
  if (e.key === 'so-cart') {
    updateCartCount();
  }
});

// Listen for cart changes in this tab (after add/remove)
export function triggerCartCountUpdate() {
  updateCartCount();
}

// Intercept Checkout button click if cart is empty (after header loads)
export function interceptCheckoutIfCartEmpty() {
  document.addEventListener('click', function(e) {
    // Only handle left click, not keyboard or right click
    if (e.target && e.target.classList.contains('checkout-link')) {
      let cart = JSON.parse(localStorage.getItem('so-cart')) || [];
      if (cart.length === 0) {
        e.preventDefault();
        window.alert('Cart is Empty.');
      }
    }
  }, true);
}
