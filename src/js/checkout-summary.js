// checkout-summary.js
// Handles checkout form validation and order summary rendering

import CheckoutProcess from './CheckoutProcess.js';

document.addEventListener('DOMContentLoaded', function() {
  // Simple form validation
  const form = document.getElementById('checkout-form');
  if (form) {
    form.addEventListener('submit', async function(e) {
      let valid = true;
      let errorMessages = [];
      Array.from(form.elements).forEach(el => {
        if (el.hasAttribute('required') && !el.value.trim()) {
          valid = false;
          el.classList.add('input-error');
          errorMessages.push(`${el.name || el.id} is required.`);
        } else {
          el.classList.remove('input-error');
        }
        // Additional validation for specific fields
        if (el.name === 'ccnum' && el.value && !/^\d{16}$/.test(el.value.replace(/\s|-/g, ''))) {
          valid = false;
          el.classList.add('input-error');
          errorMessages.push('Credit Card Number must be 16 digits.');
        }
        if (el.name === 'zip' && el.value && !/^\d{5}(-\d{4})?$/.test(el.value)) {
          valid = false;
          el.classList.add('input-error');
          errorMessages.push('Zip Code must be 5 digits or 5+4 format.');
        }
        if (el.name === 'cvv' && el.value && !/^\d{3,4}$/.test(el.value)) {
          valid = false;
          el.classList.add('input-error');
          errorMessages.push('Security Code must be 3 or 4 digits.');
        }
        if (el.name === 'exp' && el.value) {
          const today = new Date();
          const [year, month] = el.value.split('-').map(Number);
          if (year < today.getFullYear() || (year === today.getFullYear() && month < today.getMonth() + 1)) {
            valid = false;
            el.classList.add('input-error');
            errorMessages.push('Expiration date must be in the future.');
          }
        }
      });
      if (!valid) {
        e.preventDefault();
        showMessage(errorMessages.join('<br>'), 'error');
        return;
      }
      // --- SUBMIT ORDER LOGIC ---
      e.preventDefault();
      // Calculate order totals
      let cart = JSON.parse(localStorage.getItem('so-cart')) || [];
      if (cart.length === 0) {
        showMessage('Your cart is empty. Please add items before checking out.', 'error');
        return;
      }
      const grouped = {};
      cart.forEach(item => {
        if (!grouped[item.Id]) {
          grouped[item.Id] = { ...item, quantity: 1 };
        } else {
          grouped[item.Id].quantity += 1;
        }
      });
      const groupedItems = Object.values(grouped);
      let discountedTotal = 0;
      groupedItems.forEach(item => {
        const qty = item.quantity || 1;
        const disc = item.FinalPrice || item.ListPrice || 0;
        discountedTotal += disc * qty;
      });
      const tax = +(discountedTotal * 0.06).toFixed(2);
      const shipping = +(discountedTotal * 0.04).toFixed(2);
      const total = +(discountedTotal + tax + shipping).toFixed(2);
      // Submit order
      const checkout = new CheckoutProcess();
      try {
        showMessage('Submitting your order...', 'info');
        const response = await checkout.checkout(form, total, tax, shipping);
        showMessage('Order submitted successfully! Thank you for your purchase.', 'success');
        localStorage.removeItem('so-cart');
        setTimeout(() => { window.location.href = '/'; }, 2000);
      } catch (err) {
        showMessage('Order failed: ' + (err.message || 'Unknown error'), 'error');
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

  // Helper to show messages to user
  function showMessage(msg, type) {
    let msgDiv = document.getElementById('checkout-message');
    if (!msgDiv) {
      msgDiv = document.createElement('div');
      msgDiv.id = 'checkout-message';
      form.parentNode.insertBefore(msgDiv, form);
    }
    msgDiv.innerHTML = msg;
    msgDiv.className = 'checkout-message ' + (type || 'info');
    msgDiv.style.display = 'block';
    if (type === 'success') {
      msgDiv.style.background = '#d4edda';
      msgDiv.style.color = '#155724';
      msgDiv.style.border = '1px solid #c3e6cb';
      msgDiv.style.padding = '1em';
      msgDiv.style.marginBottom = '1em';
      msgDiv.style.borderRadius = '5px';
    } else if (type === 'error') {
      msgDiv.style.background = '#f8d7da';
      msgDiv.style.color = '#721c24';
      msgDiv.style.border = '1px solid #f5c6cb';
      msgDiv.style.padding = '1em';
      msgDiv.style.marginBottom = '1em';
      msgDiv.style.borderRadius = '5px';
    } else {
      msgDiv.style.background = '#fff3cd';
      msgDiv.style.color = '#856404';
      msgDiv.style.border = '1px solid #ffeeba';
      msgDiv.style.padding = '1em';
      msgDiv.style.marginBottom = '1em';
      msgDiv.style.borderRadius = '5px';
    }
  }
});
