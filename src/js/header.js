// Dynamically load the header partial into the #header div
fetch('/partials/header.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('header').innerHTML = data;
  });
