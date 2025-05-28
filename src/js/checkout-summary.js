// checkout-summary.js
// Handles checkout form validation and order summary rendering

document.addEventListener('DOMContentLoaded', function() {
  // Simple form validation
  const form = document.getElementById('checkout-form');
  if (form) {
    form.addEventListener('submit', function(e) {
      let valid = true;
      Array.from(form.elements).forEach(el => {
        if (el.hasAttribute('required') && !el.value.trim()) {
          valid = false;
          el.classList.add('input-error');
        } else {
          el.classList.remove('input-error');
        }
      });
      if (!valid) {
        e.preventDefault();
        alert('Please fill out all required fields.');
      }
    });
  }

  // Order summary logic
  function updateOrderSummary() {
    let cart = JSON.parse(localStorage.getItem('so-cart')) || [];
    console.log('Cart data on checkout page:', cart);
    // Group items by Id and count quantity
    const grouped = {};
    cart.forEach(item => {
      if (!grouped[item.Id]) {
        grouped[item.Id] = { ...item, quantity: 1 };
      } else {
        grouped[item.Id].quantity += 1;
      }
    });
    const groupedItems = Object.values(grouped);
    // Render item rows
    const itemsTbody = document.getElementById('summary-items');
    if (itemsTbody) {
      itemsTbody.innerHTML = groupedItems.map(item => {
        const unitPrice = item.FinalPrice || item.ListPrice || item.SuggestedRetailPrice || 0;
        const total = unitPrice * (item.quantity || 1);
        return `<tr><td>${item.Name || item.NameWithoutBrand || 'Item'}</td><td>${item.quantity || 1}</td><td>$${unitPrice.toFixed(2)}</td><td>$${total.toFixed(2)}</td></tr>`;
      }).join('');
    }
    // Subtotal, discountedTotal, discountAmount (copy logic from cart-totals)
    let originalTotal = 0;
    let discountedTotal = 0;
    groupedItems.forEach(item => {
      const qty = item.quantity || 1;
      const orig = item.SuggestedRetailPrice || item.ListPrice || item.FinalPrice || 0;
      const disc = item.FinalPrice || item.ListPrice || 0;
      originalTotal += orig * qty;
      discountedTotal += disc * qty;
    });
    const discountAmount = originalTotal - discountedTotal;
    // Tax and shipping
    const tax = +(discountedTotal * 0.06).toFixed(2); // 6% tax
    const shipping = +(discountedTotal * 0.04).toFixed(2);
    const total = +(discountedTotal + tax + shipping).toFixed(2);
    if (document.getElementById('summary-subtotal'))
      document.getElementById('summary-subtotal').textContent = `$${originalTotal.toFixed(2)}`;
    if (document.getElementById('summary-tax'))
      document.getElementById('summary-tax').textContent = `$${tax.toFixed(2)}`;
    if (document.getElementById('summary-shipping'))
      document.getElementById('summary-shipping').textContent = `$${shipping.toFixed(2)}`;
    if (document.getElementById('summary-discount'))
      document.getElementById('summary-discount').textContent = `-$${discountAmount.toFixed(2)}`;
    if (document.getElementById('summary-total'))
      document.getElementById('summary-total').textContent = `$${total.toFixed(2)}`;
  }
  updateOrderSummary();
});
