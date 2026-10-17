const slug = new URLSearchParams(location.search).get('id') || 'asarasuper';
const product = window.PRODUCTS[slug];
if (!product) location.replace('products.html');
else {
  document.title = `${product.name} | American`;
  document.querySelector('[data-product-image]').src = product.image;
  document.querySelector('[data-product-image]').alt = `Bao bì sản phẩm ${product.name}`;
  document.querySelector('[data-product-category]').textContent = product.category;
  document.querySelector('[data-product-name]').textContent = product.name;
  document.querySelector('[data-product-active]').textContent = product.active;
  document.querySelector('[data-product-analysis]').textContent = product.analysis;
  const list = document.querySelector('[data-product-targets]');
  product.targets.forEach((target, index) => {
    const li = document.createElement('li');
    li.innerHTML = `<span>${String(index + 1).padStart(2,'0')}</span><strong></strong>`;
    li.querySelector('strong').textContent = target;
    list.appendChild(li);
  });
}
