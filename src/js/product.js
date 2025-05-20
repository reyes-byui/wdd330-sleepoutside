import { setLocalStorage } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

const dataSource = new ProductData("tents");

function addProductToCart(product) {
  // Retrieve the existing cart from localStorage
  const cart = JSON.parse(localStorage.getItem("so-cart")) || [];

  // Add the new product to the cart
  cart.push(product);

  // Save the updated cart back to localStorage
  setLocalStorage("so-cart", cart);
}

// add to cart button event handler
async function addToCartHandler(e) {
  try {
    console.log("Add to Cart button clicked", e.target.dataset.id);
    const product = await dataSource.findProductById(e.target.dataset.id);

    if (!product) {
      console.error("Product not found for ID:", e.target.dataset.id);
      return;
    }

    console.log("Product found:", product);
    addProductToCart(product);

    // Display success message
    const messageDiv = document.createElement("div");
    messageDiv.textContent = "Successfully added to cart!";
    messageDiv.style.color = "green";
    messageDiv.style.marginTop = "10px";
    e.target.parentElement.appendChild(messageDiv);

    // Remove the message after 3 seconds
    setTimeout(() => {
      messageDiv.remove();
    }, 3000);
  } catch (error) {
    console.error("Error adding product to cart:", error);
  }
}

// add listener to Add to Cart button
document
  .getElementById("addToCart")
  .addEventListener("click", addToCartHandler);

function formatPrice(price) {
  return `$${price.toFixed(2)}`;
}

function createDiscountBadge(percent) {
  const badge = document.createElement("span");
  badge.className = "discount-indicator";
  badge.textContent = `-${percent}% OFF`;
  return badge;
}

function updateProductDetail(product) {
  const priceElem = document.querySelector(".product-card__price");
  if (!priceElem || !product) return;
  if (product.FinalPrice < product.SuggestedRetailPrice) {
    const percent = Math.round(
      ((product.SuggestedRetailPrice - product.FinalPrice) /
        product.SuggestedRetailPrice) *
        100
    );
    // Add badge
    priceElem.parentElement.insertBefore(
      createDiscountBadge(percent),
      priceElem
    );
    // Show old price with strikethrough
    const oldPrice = document.createElement("span");
    oldPrice.className = "old-price";
    oldPrice.textContent = formatPrice(product.SuggestedRetailPrice);
    priceElem.innerHTML = `<span class="new-price">${formatPrice(
      product.FinalPrice
    )}</span>`;
    priceElem.insertBefore(oldPrice, priceElem.firstChild);
  } else {
    priceElem.textContent = formatPrice(product.FinalPrice);
  }
}

// If on a product detail page, try to get product data and update price display
if (document.querySelector('.product-detail')) {
  // Extract product id from button or data attribute
  const addToCartBtn = document.getElementById('addToCart');
  let productId = addToCartBtn ? addToCartBtn.dataset.id : null;
  if (productId) {
    import('./ProductData.mjs').then(({ default: ProductData }) => {
      const dataSource = new ProductData('tents');
      dataSource.getData().then(products => {
        const product = products.find(p => p.Id === productId || p.Id === productId.toLowerCase());
        updateProductDetail(product);
      });
    });
  }
}
