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

const productSlugs = {
  'ASARASUPER 500SC': 'asarasuper', 'USATABON 17.5WP': 'usatabon',
  'ACTATOC 200WP': 'actatoc', 'TECHTIME 50WG': 'techtime',
  'SUPITOC 250EC': 'supitoc', 'SAMTAKO 25SC': 'samtako',
  'CYTOC 250WP': 'cytoc', 'ABUVA 36EC': 'abuva', 'CLORCET': 'clorcet',
  'NOMICET / NOMIRIUS': 'nomicet', 'ALPHADAX 250WP': 'alphadax',
  'ALYRICE 200WG': 'alyrice', 'SUPERMIL 40SL': 'supermil'
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

const modal = document.createElement('dialog');
modal.className = 'product-modal';
modal.setAttribute('aria-label', 'Thông tin chi tiết sản phẩm');
modal.innerHTML = '<div class="modal-shell"><button class="modal-close" type="button" aria-label="Đóng cửa sổ">×</button><div class="modal-top"><div class="modal-product-image"><img alt=""></div><div class="modal-summary"><small data-modal-category></small><h2 data-modal-name></h2><div class="modal-active"><span>Thành phần hoạt chất</span><strong data-modal-active></strong></div><a class="button button-primary" href="contact.html">Liên hệ tư vấn</a></div></div><div class="modal-analysis"><p class="eyebrow blue">Cơ chế & tác dụng</p><p data-modal-analysis></p></div><div class="modal-target-wrap"><p class="eyebrow blue">Đối tượng gây hại ưu tiên</p><div class="modal-targets" data-modal-targets></div></div><p class="modal-note">Lưu ý: Đọc kỹ nhãn sản phẩm; chỉ sử dụng theo cây trồng, đối tượng, liều lượng và hướng dẫn đã được đăng ký.</p></div>';
document.body.appendChild(modal);
modal.querySelector('.modal-close').addEventListener('click', () => modal.close());
modal.addEventListener('click', (event) => { if (event.target === modal) modal.close(); });
modal.addEventListener('close', () => document.body.classList.remove('modal-open'));

function openProductModal(product) {
  modal.querySelector('.modal-product-image img').src = product.image;
  modal.querySelector('.modal-product-image img').alt = `Bao bì ${product.name}`;
  modal.querySelector('[data-modal-category]').textContent = product.category;
  modal.querySelector('[data-modal-name]').textContent = product.name;
  modal.querySelector('[data-modal-active]').textContent = product.active;
  modal.querySelector('[data-modal-analysis]').textContent = product.analysis;
  const targets = modal.querySelector('[data-modal-targets]');
  targets.replaceChildren();
  product.targets.forEach((target, index) => {
    const item = document.createElement('article');
    item.innerHTML = `<img src="${targetImage(target)}" alt=""><div><span>${String(index + 1).padStart(2,'0')}</span><strong></strong></div>`;
    item.querySelector('img').alt = `Hình minh họa ${target}`;
    item.querySelector('strong').textContent = target;
    targets.appendChild(item);
  });
  document.body.classList.add('modal-open');
  modal.showModal();
}

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
