import { loadHeaderFooter } from "./utils.mjs";
import { updateCartCount, interceptCheckoutIfCartEmpty } from "./header.js";
import { updateProductCards } from "./product-listing.js";

loadHeaderFooter().then(() => {
  updateCartCount();
  interceptCheckoutIfCartEmpty();
  window.addEventListener('storage', function(e) {
    if (e.key === 'so-cart') {
      updateCartCount();
    }
  });
});

// Render discounts for homepage products
updateProductCards();
