// Moves product rendering logic to a new file
import { loadHeaderFooter } from "./utils.mjs";
import { updateProductCards, getTentsData } from "./product-listing.js";

loadHeaderFooter();

// Render discounts for homepage products
getTentsData().then(updateProductCards);
