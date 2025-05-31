// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

// Render a single template into a parent element, with optional callback
export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  if (callback) {
    callback(data);
  }
}

// Load an HTML template from a path asynchronously
export async function loadTemplate(path) {
  const res = await fetch(path);
  const template = await res.text();
  return template;
}

// Load header and footer partials into #header and #footer
export async function loadHeaderFooter() {
  const header = document.getElementById('header');
  const footer = document.getElementById('footer');
  if (header) {
    const headerTemplate = await loadTemplate('/partials/header.html');
    renderWithTemplate(headerTemplate, header);
  }
  if (footer) {
    const footerTemplate = await loadTemplate('/partials/footer.html');
    renderWithTemplate(footerTemplate, footer);
  }
}

// Custom alert message utility
export function alertMessage(message, scroll = true) {
  const alert = document.createElement('div');
  alert.classList.add('alert');
  alert.innerHTML = `
    <span>${message}</span>
    <button class="alert-close" aria-label="Close">&times;</button>
  `;
  alert.addEventListener('click', function(e) {
    if (e.target.classList.contains('alert-close')) {
      alert.remove();
    }
  });
  const main = document.querySelector('main');
  if (main) {
    main.prepend(alert);
    if (scroll) window.scrollTo(0, 0);
  }
}
