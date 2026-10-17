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
  if (product.images?.length > 1) {
    let galleryIndex = 0;
    setInterval(() => {
      galleryIndex = (galleryIndex + 1) % product.images.length;
      document.querySelector('[data-product-image]').src = product.images[galleryIndex];
      document.querySelector('[data-product-image]').alt = `Bao bì ${product.name} mẫu ${galleryIndex + 1}`;
    }, 3800);
  }
  const list = document.querySelector('[data-product-targets]');
  product.targets.forEach((target, index) => {
    const li = document.createElement('li');
    li.innerHTML = `<img alt=""><span>${String(index + 1).padStart(2,'0')}</span><strong></strong><small></small>`;
    li.querySelector('img').src = target.image;
    li.querySelector('img').alt = `Hình nhận diện ${target.name}`;
    li.querySelector('strong').textContent = typeof target === 'string' ? target : target.name;
    li.querySelector('small').textContent = target.basis || '';
    list.appendChild(li);
  });
}
