// Dynamically load the header partial into the #header div
fetch('/partials/header.html')
  .then(response => {
    if (!response.ok) {
      throw new Error('Header partial not found: ' + response.status);
    }
    return response.text();
  })
  .then(data => {
    document.getElementById('header').innerHTML = data;
    // cart-count removed
  })
  .catch(error => {
    console.error('Error loading header:', error);
  });

fetch('/partials/footer.html')
  .then(response => {
    if (!response.ok) {
      throw new Error('Footer partial not found: ' + response.status);
    }
    return response.text();
  })
  .then(data => {
    document.getElementById('footer').innerHTML = data;
    // cart-count removed
  })
  .catch(error => {
    console.error('Error loading footer:', error);
  });

// cart-count related code removed
