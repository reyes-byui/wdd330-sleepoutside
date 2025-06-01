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

window.addEventListener('storage', function(e) {
  if (e.key === 'so-cart') {
    updateCartCount();
  }
});

export function triggerCartCountUpdate() {
  updateCartCount();
}

export function interceptCheckoutIfCartEmpty() {
  document.addEventListener('click', function(e) {
    if (e.target && e.target.classList.contains('checkout-link')) {
      let cart = JSON.parse(localStorage.getItem('so-cart')) || [];
      if (cart.length === 0) {
        e.preventDefault();
        window.alert('Cart is Empty.');
      }
    }
  }, true);
}

// Add search bar logic for all pages
function handleSearchBar() {
  // Wait for the header to be injected and the form to exist
  const waitForForm = setInterval(() => {
    const form = document.getElementById('product-search-form');
    const input = document.getElementById('product-search-input');
    if (form && input) {
      clearInterval(waitForForm);
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        const query = input.value.trim();
        if (query) {
          // Always use root-relative path for search page
          window.location.href = '/search.html?q=' + encodeURIComponent(query);
        }
      });
    }
  }, 50);
}

// Inject header.html into #header on every page
async function injectHeader() {
  const headerDiv = document.getElementById('header');
  if (headerDiv) {
    try {
      const res = await fetch('/public/partials/header.html');
      if (res.ok) {
        headerDiv.innerHTML = await res.text();
      }
    } catch (e) {
      // fail silently
    }
  }
}

injectHeader().then(() => {
  handleSearchBar();
  updateCartCount();
});
