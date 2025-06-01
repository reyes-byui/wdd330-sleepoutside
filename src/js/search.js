const productSources = [
  { category: 'tents', path: '../json/tents.json', type: 'array' },
  { category: 'sleeping-bags', path: '../json/sleeping-bags.json', type: 'object', resultKey: 'Result' },
  { category: 'hammocks', path: '../json/hammocks.json', type: 'array' },
  { category: 'backpacks', path: '../json/backpacks.json', type: 'object', resultKey: 'Result' }
];

function getSearchTerm() {
  const params = new URLSearchParams(window.location.search);
  return params.get('q') || '';
}

function normalize(str) {
  return str ? str.toLowerCase().replace(/[^a-z0-9 ]/gi, '') : '';
}

function getImage(product) {
  if (product.Images && product.Images.PrimaryLarge) return product.Images.PrimaryLarge;
  if (product.Image) return product.Image;
  return '';
}

function createProductCard(product, category) {
  const image = getImage(product);
  const brand = (product.Brand && product.Brand.Name) || product.Brand || '';
  const name = product.NameWithoutBrand || product.Name || '';
  const price = product.FinalPrice || product.ListPrice || product.SuggestedRetailPrice || 0;
  return `
    <div class="product-card" data-id="${product.Id}" data-category="${category}">
      <img src="${image}" alt="${name}" />
      <h3>${brand}</h3>
      <h2>${name}</h2>
      <p class="product-card__price">$${price.toFixed(2)}</p>
    </div>
  `;
}

async function fetchAllProducts() {
  let allProducts = [];
  for (const src of productSources) {
    try {
      const res = await fetch(src.path);
      const data = await res.json();
      let products = [];
      if (src.type === 'array') {
        products = data;
      } else if (src.type === 'object' && src.resultKey) {
        products = data[src.resultKey] || [];
      }
      products = products.map(p => ({ ...p, _category: src.category }));
      allProducts = allProducts.concat(products);
    } catch (e) {
      // ignore errors for missing files
    }
  }
  return allProducts;
}

function filterProducts(products, searchTerm) {
  const term = normalize(searchTerm);
  return products.filter(product => {
    const name = normalize(product.Name || product.NameWithoutBrand);
    const desc = normalize(product.DescriptionHtmlSimple || '');
    return name.includes(term) || desc.includes(term);
  });
}

function renderResults(products) {
  const resultsDiv = document.getElementById('search-results');
  if (!products.length) {
    resultsDiv.innerHTML = '<p>No products found.</p>';
    return;
  }
  resultsDiv.innerHTML = products.map(p => createProductCard(p, p._category)).join('');
  // Add click event to each card
  resultsDiv.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-id');
      const category = card.getAttribute('data-category');
      // Go to the product details page for the clicked product
      window.location.href = "/product_pages/index.html?id=" + id + "&category=" + category;
    });
  });
}

async function doSearch() {
  const searchTerm = getSearchTerm();
  if (!searchTerm) return;
  const allProducts = await fetchAllProducts();
  const filtered = filterProducts(allProducts, searchTerm);
  renderResults(filtered);
}

document.addEventListener('DOMContentLoaded', doSearch);
