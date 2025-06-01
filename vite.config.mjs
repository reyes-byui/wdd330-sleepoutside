import { resolve } from "path";
import { defineConfig } from "vite";
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  root: "src/",
  plugins: [
    viteStaticCopy({
      targets: [
        { src: 'json', dest: '.' },
        { src: 'js/*.{js,mjs}', dest: 'js' },
        { src: 'images', dest: '.' },
        { src: 'product_pages/*.html', dest: 'product_pages' }, 
        { src: 'public/partials/*', dest: 'partials' },
        { src: 'css/style.css', dest: 'css' },
        { src: 'index.html', dest: '.' }, // Ensure index.html is copied to dist/
        { src: 'cart/index.html', dest: 'cart' }, // Ensure cart/index.html is copied to dist/
        { src: 'search.html', dest: '.' }, // Ensure search.html is copied to dist/
      ]
    })
  ],
  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        cart: resolve(__dirname, "src/cart/index.html"),
        checkout: resolve(__dirname, "src/checkout/index.html"),
        product_pages: resolve(__dirname, "src/product_pages/index.html"),
        product_listing: resolve(__dirname, "src/product_listing/index.html"),
        search: resolve(__dirname, "src/search.html"), // Add search.html as entry point
      },
    },
  },
});
