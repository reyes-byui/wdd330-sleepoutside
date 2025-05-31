import ExternalServices from "./ExternalServices.mjs";
import { triggerCartCountUpdate } from "../js/header.js";

function getQueryParam(param) {
  const params = new URLSearchParams(window.location.search);
  return params.get(param);
}

function formatPrice(price) {
  return `$${price.toFixed(2)}`;
}

function createDiscountBadge(percent) {
  const badge = document.createElement("span");
  badge.className = "discount-indicator";
  badge.textContent = `-${percent}% OFF`;
  return badge;
}

function getImage(product) {
  if (product.Images && product.Images.PrimaryLarge) return product.Images.PrimaryLarge;
  if (product.Image) return product.Image;
  return '';
}

function renderProductDetail(product) {
  const main = document.querySelector('main.divider');
  if (!main) return;
  main.innerHTML = '';
  if (!product) {
    main.innerHTML = '<section class="product-detail"><h2>Product not found</h2></section>';
    return;
  }
  const image = getImage(product);
  const brand = (product.Brand && product.Brand.Name) || product.Brand || '';
  const name = product.NameWithoutBrand || product.Name || '';
  const price = product.FinalPrice || product.ListPrice || product.SuggestedRetailPrice || 0;
  const oldPrice = product.SuggestedRetailPrice || product.ListPrice || 0;
  let discountHTML = "";
  let priceHTML = `<span class='new-price'>${formatPrice(price)}</span>`;
  if (oldPrice > price) {
    const percent = Math.round(((oldPrice - price) / oldPrice) * 100);
    discountHTML = `<span class='discount-indicator'>-${percent}% OFF</span>`;
    priceHTML = `<span class='old-price'>${formatPrice(oldPrice)}</span> <span class='new-price'>${formatPrice(price)}</span>`;
  }
  const color = product.Colors && product.Colors[0] ? product.Colors[0].ColorName : '';
  main.innerHTML = `
    <section class="product-detail">
      <h3>${brand}</h3>
      <h2 class="divider">${name}</h2>
      <img class="divider" src="${image}" alt="${name}" />
      <p class="product-card__price">${discountHTML} ${priceHTML}</p>
      <p class="product__color">${color}</p>
      <p class="product__description">${product.DescriptionHtmlSimple || ''}</p>
      <div class="product-detail__add">
        <button id="addToCart" data-id="${product.Id}" data-category="${getQueryParam('category')}">Add to Cart</button>
      </div>
    </section>
  `;
  // Add to cart event
  document.getElementById('addToCart').addEventListener('click', async (e) => {
    let cart = JSON.parse(localStorage.getItem('so-cart')) || [];
    cart.push(product);
    localStorage.setItem('so-cart', JSON.stringify(cart));
    const messageDiv = document.createElement('div');
    messageDiv.textContent = 'Successfully added to cart!';
    messageDiv.style.color = 'green';
    messageDiv.style.marginTop = '10px';
    e.target.parentElement.appendChild(messageDiv);
    setTimeout(() => { messageDiv.remove(); }, 3000);
    triggerCartCountUpdate(); // Update cart count in header after add
  });
}

async function loadProductDetail() {
  const id = getQueryParam('id');
  const category = getQueryParam('category') || 'tents';
  if (!id) return;
  const dataSource = new ExternalServices(category);
  let products = await dataSource.getData();
  if (products.Result) products = products.Result;
  const product = products.find(item => String(item.Id).toLowerCase() === String(id).toLowerCase());
  renderProductDetail(product);
}

if (document.querySelector('main.divider')) {
  loadProductDetail();
}
