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
  }
});
