import ProductData from './ProductData.mjs';

function formatPrice(price) {
  return `$${price.toFixed(2)}`;
}

async function getAllProducts() {
  const categories = ['tents', 'backpacks', 'sleeping-bags', 'hammocks'];
  let all = [];
  for (const cat of categories) {
    const data = await new ProductData(cat).getData();
    const items = (Array.isArray(data) ? data : data.Result || []).map(item => ({ ...item, _category: cat }));
    all = all.concat(items);
  }
  return all;
}

function renderTopProducts(products) {
  const top = products
    .filter(p => (p.FinalPrice || p.ListPrice || p.SuggestedRetailPrice) && p.Id && typeof p.Id === 'string' && p.Id.trim() !== "")
    .sort((a, b) => (a.FinalPrice || a.ListPrice || a.SuggestedRetailPrice) - (b.FinalPrice || b.ListPrice || b.SuggestedRetailPrice))
    .slice(0, 4);
  const list = document.getElementById('top-products-list');
  if (!list) return;
  list.innerHTML = '';
  top.forEach(product => {
    const image = (product.Images && product.Images.PrimaryLarge) || product.Image || '';
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
    const category = product._category || 'tents';
    const li = document.createElement('li');
    li.className = 'product-card';
    li.innerHTML = `
      <a href="product_pages/index.html?id=${id}&category=${category}">
        <img src="${image}" alt="${name}" />
        <h3 class="card__brand">${brand}</h3>
        <h2 class="card__name">${name}</h2>
        <p class="product-card__price">${discountHTML} ${priceHTML}</p>
      </a>
    `;
    list.appendChild(li);
  });
}

if (document.getElementById('top-products-list')) {
  getAllProducts().then(renderTopProducts);
}
