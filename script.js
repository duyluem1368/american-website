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
