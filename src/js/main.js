import { loadHeaderFooter } from "./utils.mjs";
import { updateCartCount } from "./header.js";
import { updateProductCards } from "./product-listing.js";

loadHeaderFooter().then(() => {
  updateCartCount();
  window.addEventListener('storage', function(e) {
    if (e.key === 'so-cart') {
      updateCartCount();
    }
  });
});

// Render discounts for homepage products
updateProductCards();
