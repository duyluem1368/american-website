const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const primaryNav = document.querySelector('#primary-nav');
if (primaryNav) {
  const path = location.pathname.split('/').pop() || 'index.html';
  const activeKey = path === 'about.html' ? 'about' : path === 'products.html' || path === 'product.html' ? 'products' : path === 'journey.html' ? 'journey' : path === 'news.html' ? 'knowledge' : path === 'contact.html' ? 'contact' : 'home';
  const navItems = [
    ['home','index.html','Trang chủ'], ['about','about.html','Về American'],
    ['products','products.html','Sản phẩm'], ['journey','journey.html','Hành trình American'],
    ['knowledge','news.html','Sâu bệnh cây trồng'], ['contact','contact.html','Liên hệ']
  ];
  primaryNav.innerHTML = navItems.map(([key, href, label]) => `<a${key === activeKey ? ' class="active" aria-current="page"' : ''} href="${href}">${label}</a>`).join('');
}
menuButton.addEventListener('click', () => {
  const open = header.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});

document.querySelectorAll('#primary-nav a').forEach((link) => link.addEventListener('click', () => {
  header.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}));

const catalogProductCards = document.querySelectorAll('.catalog .product-card');
const categoryMeta = {
  insect: ['Thuốc trừ sâu', 'Các sản phẩm quản lý sâu ăn lá, sâu đục thân, rầy, rệp và côn trùng chích hút.'],
  disease: ['Thuốc trừ bệnh', 'Các sản phẩm phòng và quản lý bệnh do nấm, vi khuẩn trên cây trồng.'],
  weed: ['Thuốc trừ cỏ', 'Các giải pháp quản lý cỏ hòa bản, cỏ lá rộng và nhóm chác lác trên đồng ruộng.']
};

document.querySelectorAll('[data-category-count]').forEach((counter) => {
  const category = counter.dataset.categoryCount;
  const count = document.querySelectorAll(`.catalog .product-card[data-category="${category}"]`).length;
  counter.textContent = `${count} sản phẩm`;
});

function selectProductCategory(filter, updateUrl = true) {
  if (!categoryMeta[filter] || !catalogProductCards.length) return;
  catalogProductCards.forEach((card) => {
    card.hidden = card.dataset.category !== filter;
  });
  document.querySelectorAll('[data-category-jump]').forEach((item) => {
    const isActive = item.dataset.categoryJump === filter;
    item.classList.toggle('active', isActive);
    item.setAttribute('aria-pressed', String(isActive));
  });
  const count = document.querySelectorAll(`.catalog .product-card[data-category="${filter}"]`).length;
  const title = document.querySelector('[data-category-title]');
  const summary = document.querySelector('[data-category-summary]');
  if (title) title.textContent = categoryMeta[filter][0];
  if (summary) summary.textContent = `${count} sản phẩm • ${categoryMeta[filter][1]}`;
  if (updateUrl) {
    const url = new URL(location.href);
    url.searchParams.set('category', filter);
    history.replaceState({ category: filter }, '', url);
  }
}
document.querySelectorAll('[data-category-jump]').forEach(item => item.addEventListener('click', () => selectProductCategory(item.dataset.categoryJump)));
const requestedCategory = new URLSearchParams(location.search).get('category');
if (catalogProductCards.length) selectProductCategory(categoryMeta[requestedCategory] ? requestedCategory : 'insect', false);

const featuredProductCards = document.querySelectorAll('#products .product-card');
document.querySelectorAll('#products [data-filter]').forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    featuredProductCards.forEach((card) => {
      card.hidden = filter !== 'all' && card.dataset.category !== filter;
    });
    document.querySelectorAll('#products [data-filter]').forEach((item) => {
      item.classList.toggle('active', item === button);
      item.setAttribute('aria-pressed', String(item === button));
    });
  });
});

const productSlugs = {
  'ASARASUPER 500SC': 'asarasuper', 'USATABON 17.5WP': 'usatabon',
  'ACTATOC 200WP': 'actatoc', 'TECHTIMEX 50WG': 'techtime',
  'SUPITOC 250EC': 'supitoc', 'FITEX X2 300EC': 'fitex', 'SECTOR 100WP': 'sector', 'SAMTAKO 20SC': 'samtako',
  'CYTOC 250WP': 'cytoc', 'ABUVA 36EC': 'abuva', 'CLORCET': 'clorcet',
  'NOMICET / NOMIRIUS': 'nomicet', 'CỎ CẶP NOMICET / NOMIRIUS': 'nomicet', 'ALPHADAX 250WP': 'alphadax',
  'ALYRICE 200WG': 'alyrice', 'SIRAFB 100WP': 'sirafb', 'SUPERMIL 40SL': 'supermil', 'GOLDVIL 50SC': 'goldvil',
  'ZIMVIL 720WP': 'zimvil', 'BEMGREEN 750WP': 'bemgreen'
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
const journeySection = document.querySelector('.company-journey');
if (trustStrip && aboutSection) {
  trustStrip.after(aboutSection);
  if (journeySection) aboutSection.after(journeySection);
}

const activityPriority = [
  'activity-03.webp', 'trip-04.webp', 'activity-02.webp', 'trip-09.webp',
  'activity-04.webp', 'trip-07.webp', 'trip-10.webp', 'activity-12.webp',
  'activity-11.webp', 'trip-11.webp', 'trip-05.webp', 'trip-12.webp',
  'trip-13.webp', 'trip-06.webp', 'trip-08.webp',
  'activity-13.webp', 'activity-07.webp', 'activity-01.webp', 'activity-09.webp',
  'activity-10.webp', 'activity-05.webp', 'activity-06.webp',
  'activity-08.webp', 'trip-03.webp', 'trip-01.webp', 'trip-02.webp'
];
let activityButtons = [...document.querySelectorAll('[data-activity-image]')];
if (journeySection && activityButtons.length) {
  activityButtons.sort((left, right) => {
    const leftName = left.dataset.activityImage.split('/').pop();
    const rightName = right.dataset.activityImage.split('/').pop();
    return activityPriority.indexOf(leftName) - activityPriority.indexOf(rightName);
  });
  const gallery = document.createElement('div');
  gallery.className = 'journey-unified-gallery';
  gallery.setAttribute('aria-label', 'Hình ảnh hành trình American theo quy mô tập thể giảm dần');
  const featuredActivityButtons = activityButtons.slice(0, 5);
  featuredActivityButtons.forEach((button, index) => {
    button.className = `journey-gallery-item${index === 0 ? ' gallery-lead' : index < 3 ? ' gallery-wide' : ''}`;
    button.dataset.eventLabel = button.dataset.activityGallery === 'nha-trang' ? 'Nha Trang 2024' : 'Kỷ niệm 15 năm';
    gallery.appendChild(button);
  });
  journeySection.querySelector('.journey-head').after(gallery);
  journeySection.querySelectorAll('.journey-strip,.journey-hint,.journey-album-head').forEach((element) => element.remove());
  activityButtons.slice(5).forEach((button) => button.remove());
  const galleryLink = document.createElement('a');
  galleryLink.className = 'button button-primary journey-view-all';
  galleryLink.href = 'journey.html';
  galleryLink.innerHTML = 'Xem toàn bộ thư viện ảnh <span>→</span>';
  gallery.after(galleryLink);
  activityButtons = featuredActivityButtons;
}
if (activityButtons.length) {
  const activityDialog = document.createElement('dialog');
  activityDialog.className = 'activity-lightbox';
  activityDialog.setAttribute('aria-label', 'Ảnh hoạt động của American');
  activityDialog.innerHTML = '<button class="activity-close" type="button" aria-label="Đóng ảnh">×</button><button class="activity-arrow activity-prev" type="button" aria-label="Ảnh trước">←</button><figure><img alt=""><figcaption></figcaption></figure><button class="activity-arrow activity-next" type="button" aria-label="Ảnh tiếp theo">→</button><span class="activity-count"></span>';
  document.body.appendChild(activityDialog);
  let activityIndex = 0;
  const showActivity = (index) => {
    activityIndex = (index + activityButtons.length) % activityButtons.length;
    const source = activityButtons[activityIndex];
    const photo = activityDialog.querySelector('img');
    photo.src = source.dataset.activityImage;
    photo.alt = source.dataset.caption;
    activityDialog.querySelector('figcaption').textContent = source.dataset.caption;
    activityDialog.querySelector('.activity-count').textContent = `${activityIndex + 1} / ${activityButtons.length}`;
  };
  activityButtons.forEach((button) => button.addEventListener('click', () => {
    showActivity(activityButtons.indexOf(button));
    document.body.classList.add('modal-open');
    activityDialog.showModal();
  }));
  activityDialog.querySelector('.activity-close').addEventListener('click', () => activityDialog.close());
  activityDialog.querySelector('.activity-prev').addEventListener('click', () => showActivity(activityIndex - 1));
  activityDialog.querySelector('.activity-next').addEventListener('click', () => showActivity(activityIndex + 1));
  activityDialog.addEventListener('click', (event) => { if (event.target === activityDialog) activityDialog.close(); });
  activityDialog.addEventListener('close', () => document.body.classList.remove('modal-open'));
  activityDialog.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') showActivity(activityIndex - 1);
    if (event.key === 'ArrowRight') showActivity(activityIndex + 1);
  });
}

document.body.classList.add('content-protected');
const protectImages = (root = document) => {
  root.querySelectorAll?.('img').forEach((image) => {
    image.draggable = false;
    image.setAttribute('draggable', 'false');
  });
};
protectImages();
new MutationObserver((mutations) => {
  mutations.forEach((mutation) => mutation.addedNodes.forEach((node) => {
    if (!(node instanceof Element)) return;
    if (node.matches('img')) {
      node.draggable = false;
      node.setAttribute('draggable', 'false');
    }
    protectImages(node);
  }));
}).observe(document.body, { childList: true, subtree: true });
document.addEventListener('contextmenu', (event) => {
  if (!event.target.closest('input,textarea,select')) event.preventDefault();
});
document.addEventListener('dragstart', (event) => {
  if (event.target instanceof HTMLImageElement) event.preventDefault();
});
document.addEventListener('copy', (event) => {
  if (!event.target.closest('input,textarea')) event.preventDefault();
});
document.addEventListener('selectstart', (event) => {
  if (!event.target.closest('input,textarea,select')) event.preventDefault();
});
document.addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase();
  const protectedShortcut = (event.ctrlKey || event.metaKey) && ['s', 'u', 'p'].includes(key);
  const developerShortcut = event.key === 'F12' || ((event.ctrlKey || event.metaKey) && event.shiftKey && ['i', 'j', 'c'].includes(key));
  if (protectedShortcut || developerShortcut) event.preventDefault();
});

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
