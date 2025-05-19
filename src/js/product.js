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
