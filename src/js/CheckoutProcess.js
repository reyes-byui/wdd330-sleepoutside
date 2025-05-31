import ExternalServices from "./ExternalServices.mjs";
import { alertMessage } from "./utils.mjs";

export default class CheckoutProcess {
  constructor() {
    this.cartKey = "so-cart";
  }

  // Convert cart items to the format required by the server
  packageItems(items) {
    return items.map(item => ({
      id: item.Id,
      name: item.Name || item.NameWithoutBrand || "Item",
      price: item.FinalPrice || item.ListPrice || item.SuggestedRetailPrice || 0,
      quantity: item.quantity || 1
    }));
  }

  // Convert form data to JSON object with correct keys
  formDataToJSON(form) {
    const formData = new FormData(form);
    const obj = {};
    for (const [key, value] of formData.entries()) {
      obj[key] = value;
    }
    return obj;
  }

  // Main checkout function
  async checkout(form, orderTotal, tax, shipping) {
    // Get cart items
    let cart = JSON.parse(localStorage.getItem(this.cartKey)) || [];
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
    // Prepare order object
    const order = this.formDataToJSON(form);
    order.orderDate = new Date().toISOString();
    order.items = this.packageItems(groupedItems);
    order.orderTotal = orderTotal;
    order.shipping = shipping;
    order.tax = tax;
    // Send to server
    const service = new ExternalServices();
    try {
      await service.checkout(order);
      // Success: clear cart and redirect
      localStorage.removeItem(this.cartKey);
      window.location.href = '/src/checkout/success.html';
    } catch (err) {
      // Failure: show error with alertMessage
      if (err.name === 'servicesError' && err.message) {
        alertMessage(typeof err.message === 'object' && err.message.message ? err.message.message : JSON.stringify(err.message));
      } else {
        alertMessage('Order failed. Please try again.');
      }
    }
  }
}
