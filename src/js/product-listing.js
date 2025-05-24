import ProductData from "./ProductData.mjs";

export function formatPrice(price) {
  return `$${price.toFixed(2)}`;
}

export function createDiscountBadge(percent) {
  const badge = document.createElement("span");
  badge.className = "discount-indicator";
  badge.textContent = `-${percent}% OFF`;
  return badge;
}

export function updateProductCards(products) {
  const cards = document.querySelectorAll(".product-card");
  cards.forEach((card) => {
    const name = card.querySelector(".card__name").textContent.trim();
    const brand = card.querySelector(".card__brand").textContent.trim();
    const product = products.find(
      (p) => p.NameWithoutBrand === name && p.Brand.Name === brand
    );
    if (!product) return;
    const priceElem = card.querySelector(".product-card__price");
    if (product.FinalPrice < product.SuggestedRetailPrice) {
      // Calculate discount percent
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
  });
}

function getCategoryFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('category') || 'tents';
}

function getCategoryTitle(category) {
  switch (category) {
    case 'tents': return 'Tents';
    case 'backpacks': return 'Backpacks';
    case 'sleeping-bags': return 'Sleeping Bags';
    case 'hammocks': return 'Hammocks';
    default: return 'Products';
  }
}

function getImage(product) {
  if (product.Images && product.Images.PrimaryLarge) return product.Images.PrimaryLarge;
  if (product.Image) return product.Image;
  return '';
}

function renderProductList(products, category) {
  const list = document.getElementById('product-list');
  list.innerHTML = '';
  products.forEach(product => {
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
    const id = product.Id;
    const li = document.createElement('li');
    li.className = 'product-card';
    li.innerHTML = `
      <a href="../product_pages/index.html?id=${id}&category=${category}">
        <img src="${image}" alt="${name}" />
        <h3 class="card__brand">${brand}</h3>
        <h2 class="card__name">${name}</h2>
        <p class="product-card__price">${discountHTML} ${priceHTML}</p>
      </a>
    `;
    list.appendChild(li);
  });
}

async function loadProductsForCategory() {
  const category = getCategoryFromUrl();
  document.getElementById('category-title').textContent = getCategoryTitle(category);
  const dataSource = new ProductData(category);
  let products = await dataSource.getData();
  if (products.Result) products = products.Result; // for backpacks
  renderProductList(products, category);
}

if (document.getElementById('product-list')) {
  loadProductsForCategory();
}

export function getTentsData() {
  return dataSource.getData();
}
