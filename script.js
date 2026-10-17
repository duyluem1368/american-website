const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
menuButton.addEventListener('click', () => {
  const open = header.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});

document.querySelectorAll('#primary-nav a').forEach((link) => link.addEventListener('click', () => {
  header.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}));

const filterButtons = document.querySelectorAll('.filter button');
const productCards = document.querySelectorAll('.product-card');
filterButtons.forEach((button) => button.addEventListener('click', () => {
  filterButtons.forEach((item) => item.classList.remove('active'));
  button.classList.add('active');
  const filter = button.dataset.filter;
  productCards.forEach((card) => {
    card.hidden = filter !== 'all' && card.dataset.category !== filter;
  });
}));

function selectProductCategory(filter) {
  const button = document.querySelector(`.filter button[data-filter="${filter}"]`);
  if (button) button.click();
  document.querySelectorAll('[data-category-jump]').forEach(item => item.classList.toggle('active', item.dataset.categoryJump === filter));
}
document.querySelectorAll('[data-category-jump]').forEach(item => item.addEventListener('click', () => selectProductCategory(item.dataset.categoryJump)));
const requestedCategory = new URLSearchParams(location.search).get('category');
if (requestedCategory) selectProductCategory(requestedCategory);

const productSlugs = {
  'ASARASUPER 500SC': 'asarasuper', 'USATABON 17.5WP': 'usatabon',
  'ACTATOC 200WP': 'actatoc', 'TECHTIMEX 50WG': 'techtime',
  'SUPITOC 250EC': 'supitoc', 'FITEX X2 300EC': 'fitex', 'SECTOR 100WP': 'sector', 'SAMTAKO 20SC': 'samtako',
  'CYTOC 250WP': 'cytoc', 'ABUVA 36EC': 'abuva', 'CLORCET': 'clorcet',
  'NOMICET / NOMIRIUS': 'nomicet', 'ALPHADAX 250WP': 'alphadax',
  'ALYRICE 200WG': 'alyrice', 'SIRAFB 100WP': 'sirafb', 'SUPERMIL 40SL': 'supermil', 'GOLDVIL 50SC': 'goldvil',
  'ZIMVIL 720WP': 'zimvil'
};
document.querySelectorAll('.product-card').forEach((card) => {
  const name = card.querySelector('h3')?.textContent.trim();
  const slug = productSlugs[name];
  const link = card.querySelector('.product-info a');
  if (slug && link) {
    link.href = `product.html?id=${slug}`;
    link.childNodes[0].textContent = 'Xem chi tiết ';
    link.addEventListener('click', (event) => {
      if (!window.PRODUCTS?.[slug]) return;
      event.preventDefault();
      openProductModal(window.PRODUCTS[slug]);
    });
  }
});

function targetImage(target) {
  const value = target.toLowerCase();
  if (value.includes('nhện')) return 'assets/targets/spider-mite.webp';
  if (value.includes('sâu')) return 'assets/targets/leaf-caterpillar.webp';
  if (value.includes('cỏ lồng') || value.includes('hòa bản')) return 'assets/targets/barnyard-grass.webp';
  if (value.includes('cỏ ') || value.includes('chác') || value.includes('lác')) return 'assets/targets/broadleaf-sedge.webp';
  if (value.includes('bệnh') || value.includes('nấm') || value.includes('vi khuẩn')) return 'assets/targets/leaf-disease.webp';
  return 'assets/targets/sap-sucking.webp';
}

let modalGalleryImages = [];
let modalGalleryIndex = 0;
let modalGalleryTimer;
const modal = document.createElement('dialog');
modal.className = 'product-modal';
modal.setAttribute('aria-label', 'Thông tin chi tiết sản phẩm');
modal.innerHTML = '<div class="modal-shell"><button class="modal-close" type="button" aria-label="Đóng cửa sổ">×</button><div class="modal-top"><div class="modal-product-image"><img alt=""><div class="product-gallery-nav" data-modal-gallery hidden><button type="button" data-gallery-prev aria-label="Mẫu trước">←</button><span data-gallery-status></span><button type="button" data-gallery-next aria-label="Mẫu tiếp theo">→</button></div></div><div class="modal-summary"><small data-modal-category></small><h2 data-modal-name></h2><div class="modal-active"><span>Thành phần hoạt chất</span><strong data-modal-active></strong></div><a class="button button-primary" href="contact.html">Liên hệ tư vấn</a></div></div><div class="modal-analysis"><p class="eyebrow blue">Cơ chế & tác dụng</p><p data-modal-analysis></p></div><div class="modal-target-wrap"><p class="eyebrow blue">Đối tượng gây hại ưu tiên</p><div class="modal-targets" data-modal-targets></div></div><p class="modal-source" data-modal-source></p><p class="modal-note">Lưu ý: Đọc kỹ nhãn sản phẩm; chỉ sử dụng theo cây trồng, đối tượng, liều lượng và hướng dẫn đã được đăng ký.</p></div>';
document.body.appendChild(modal);
modal.querySelector('.modal-close').addEventListener('click', () => modal.close());
modal.addEventListener('click', (event) => { if (event.target === modal) modal.close(); });
modal.addEventListener('close', () => { document.body.classList.remove('modal-open'); clearInterval(modalGalleryTimer); });

function showModalGalleryImage(index) {
  if (!modalGalleryImages.length) return;
  modalGalleryIndex = (index + modalGalleryImages.length) % modalGalleryImages.length;
  modal.querySelector('.modal-product-image img').src = modalGalleryImages[modalGalleryIndex];
  modal.querySelector('[data-gallery-status]').textContent = `${modalGalleryIndex + 1} / ${modalGalleryImages.length}`;
}

function startModalGallery() {
  clearInterval(modalGalleryTimer);
  if (modalGalleryImages.length > 1) modalGalleryTimer = setInterval(() => showModalGalleryImage(modalGalleryIndex + 1), 3800);
}

modal.querySelector('[data-gallery-prev]').addEventListener('click', () => { showModalGalleryImage(modalGalleryIndex - 1); startModalGallery(); });
modal.querySelector('[data-gallery-next]').addEventListener('click', () => { showModalGalleryImage(modalGalleryIndex + 1); startModalGallery(); });

function openProductModal(product) {
  modalGalleryImages = product.images?.length ? product.images : [product.image];
  modalGalleryIndex = 0;
  showModalGalleryImage(0);
  modal.querySelector('[data-modal-gallery]').hidden = modalGalleryImages.length < 2;
  startModalGallery();
  modal.querySelector('.modal-product-image img').alt = `Bao bì ${product.name}`;
  modal.querySelector('[data-modal-category]').textContent = product.category;
  modal.querySelector('[data-modal-name]').textContent = product.name;
  modal.querySelector('[data-modal-active]').textContent = product.active;
  modal.querySelector('[data-modal-analysis]').textContent = product.analysis;
  const targets = modal.querySelector('[data-modal-targets]');
  targets.replaceChildren();
  product.targets.forEach((target, index) => {
    const targetName = typeof target === 'string' ? target : target.name;
    const targetPhoto = typeof target === 'string' ? targetImage(target) : target.image;
    const item = document.createElement('article');
    item.innerHTML = `<img src="${targetPhoto}" alt=""><div><span>${String(index + 1).padStart(2,'0')}</span><strong></strong><small></small></div>`;
    item.querySelector('img').alt = `Hình nhận diện ${targetName}`;
    item.querySelector('strong').textContent = targetName;
    item.querySelector('small').textContent = target.basis || '';
    targets.appendChild(item);
  });
  modal.querySelector('[data-modal-source]').innerHTML = `Nguồn đối chiếu kỹ thuật: ${product.source || 'Nhãn sản phẩm'}. <a href="sources.html">Xem nguồn dữ liệu và hình ảnh →</a>`;
  document.body.classList.add('modal-open');
  modal.showModal();
}

document.querySelectorAll('.product-card').forEach((card) => {
  const slug = productSlugs[card.querySelector('h3')?.textContent.trim()];
  const product = window.PRODUCTS?.[slug];
  const image = card.querySelector('.product-image img');
  if (!product?.images?.length || !image) return;
  if (!card.querySelector('.gallery-badge')) {
    const badge = document.createElement('span');
    badge.className = 'gallery-badge';
    badge.textContent = `${product.images.length} mẫu`;
    card.querySelector('.product-image').appendChild(badge);
  }
  let index = 0;
  setInterval(() => {
    index = (index + 1) % product.images.length;
    image.src = product.images[index];
    image.alt = `${product.name} mẫu ${index + 1}`;
  }, 3800);
});

document.querySelectorAll('.featured-slide[data-featured]').forEach((slide) => {
  const product = window.PRODUCTS?.[slide.dataset.featured];
  const image = slide.querySelector('.featured-image img');
  if (!product?.images?.length || !image) return;
  let index = 0;
  setInterval(() => {
    index = (index + 1) % product.images.length;
    image.src = product.images[index];
    image.alt = `${product.name} mẫu ${index + 1}`;
  }, 3800);
});

const requestedProduct = new URLSearchParams(location.search).get('product');
if (requestedProduct && window.PRODUCTS?.[requestedProduct]) {
  openProductModal(window.PRODUCTS[requestedProduct]);
}

document.querySelectorAll('[data-open-product]').forEach((link) => link.addEventListener('click', (event) => {
  const slug = link.dataset.openProduct;
  if (!window.PRODUCTS?.[slug]) return;
  event.preventDefault();
  openProductModal(window.PRODUCTS[slug]);
}));

const trustStrip = document.querySelector('.trust-strip');
const aboutSection = document.querySelector('.about');
if (trustStrip && aboutSection) trustStrip.after(aboutSection);

const featuredSlides = [...document.querySelectorAll('.featured-slide')];
if (featuredSlides.length) {
  const dots = document.querySelector('.featured-dots');
  let currentSlide = 0;
  let rotation;
  featuredSlides.forEach((slide, index) => {
    const dot = document.createElement('button');
    dot.type = 'button'; dot.setAttribute('aria-label', `Xem sản phẩm ${index + 1}`);
    dot.addEventListener('click', () => { showSlide(index); restartRotation(); });
    dots.appendChild(dot);
  });
  const showSlide = (index) => {
    currentSlide = (index + featuredSlides.length) % featuredSlides.length;
    featuredSlides.forEach((slide, i) => { slide.classList.toggle('active', i === currentSlide); slide.setAttribute('aria-hidden', String(i !== currentSlide)); });
    [...dots.children].forEach((dot, i) => dot.classList.toggle('active', i === currentSlide));
  };
  const restartRotation = () => { clearInterval(rotation); rotation = setInterval(() => showSlide(currentSlide + 1), 5500); };
  document.querySelector('[data-featured-prev]').addEventListener('click', () => { showSlide(currentSlide - 1); restartRotation(); });
  document.querySelector('[data-featured-next]').addEventListener('click', () => { showSlide(currentSlide + 1); restartRotation(); });
  const slider = document.querySelector('.featured-slider');
  slider.addEventListener('mouseenter', () => clearInterval(rotation));
  slider.addEventListener('mouseleave', restartRotation);
  showSlide(0); restartRotation();
}
