const journeyPhotos = [
  ['assets/company-activities/nha-trang-2024/trip-04.webp','Đại gia đình American tại Gala Dinner Nha Trang 2024','Nha Trang 2024'],
  ['assets/company-activities/activity-03.webp','Tập thể American và Quý đối tác tại lễ kỷ niệm 15 năm','Kỷ niệm 15 năm'],
  ['assets/company-activities/activity-02.webp','Tập thể cán bộ nhân viên American mừng dấu mốc 15 năm','Kỷ niệm 15 năm'],
  ['assets/company-activities/nha-trang-2024/trip-09.webp','Tập thể cán bộ American tại Nha Trang','Nha Trang 2024'],
  ['assets/company-activities/activity-04.webp','American tri ân những đóng góp đồng hành','Kỷ niệm 15 năm'],
  ['assets/company-activities/nha-trang-2024/trip-07.webp','Khoảnh khắc gắn kết trong chuyến đi Nha Trang','Nha Trang 2024'],
  ['assets/company-activities/nha-trang-2024/trip-10.webp','Tập thể nữ cán bộ American tại Nha Trang','Nha Trang 2024'],
  ['assets/company-activities/activity-12.webp','Cán bộ, nhân viên và đối tác American','Kỷ niệm 15 năm'],
  ['assets/company-activities/activity-11.webp','Khoảnh khắc gắn kết tại lễ kỷ niệm','Kỷ niệm 15 năm'],
  ...['11','05','12','13','06','08'].map((id) => [`assets/company-activities/nha-trang-2024/trip-${id}.webp`,'Khoảnh khắc gắn kết trong chuyến đi Nha Trang','Nha Trang 2024']),
  ['assets/company-activities/activity-13.webp','Khoảnh khắc tri ân tại lễ kỷ niệm','Kỷ niệm 15 năm'],
  ['assets/company-activities/activity-07.webp','Cán bộ American tại khu vực kỷ niệm','Kỷ niệm 15 năm'],
  ['assets/company-activities/activity-01.webp','Giao lưu văn nghệ trong đêm gala','Kỷ niệm 15 năm'],
  ['assets/company-activities/activity-09.webp','Đại diện American trên sân khấu sự kiện','Kỷ niệm 15 năm'],
  ['assets/company-activities/activity-10.webp','Nghi thức mừng sinh nhật American','Kỷ niệm 15 năm'],
  ['assets/company-activities/activity-05.webp','Không gian sự kiện kỷ niệm 15 năm American','Kỷ niệm 15 năm'],
  ['assets/company-activities/activity-06.webp','Không gian đón tiếp Quý đối tác và khách hàng','Kỷ niệm 15 năm'],
  ['assets/company-activities/activity-08.webp','Sân khấu đêm gala kỷ niệm 15 năm','Kỷ niệm 15 năm'],
  ['assets/company-activities/nha-trang-2024/trip-03.webp','Nghi thức khai mạc Gala Dinner American','Nha Trang 2024'],
  ['assets/company-activities/nha-trang-2024/trip-01.webp','Thông điệp Gala Dinner Nha Trang 2024','Nha Trang 2024'],
  ['assets/company-activities/nha-trang-2024/trip-02.webp','Tri ân kết nối – Mở lối thành công','Nha Trang 2024']
];
const gallery = document.querySelector('#full-gallery');
journeyPhotos.forEach(([src, caption, eventName]) => {
  const button = document.createElement('button');
  button.type = 'button'; button.dataset.src = src; button.dataset.caption = caption;
  button.innerHTML = `<img src="${src}" alt="${caption}" loading="lazy"><span>${eventName}</span>`;
  gallery.appendChild(button);
});
const buttons = [...gallery.querySelectorAll('button')];
const dialog = document.createElement('dialog');
dialog.className = 'activity-lightbox'; dialog.setAttribute('aria-label','Thư viện hình ảnh American');
dialog.innerHTML = '<button class="activity-close" type="button" aria-label="Đóng ảnh">×</button><button class="activity-arrow activity-prev" type="button" aria-label="Ảnh trước">←</button><figure><img alt=""><figcaption></figcaption></figure><button class="activity-arrow activity-next" type="button" aria-label="Ảnh tiếp theo">→</button><span class="activity-count"></span>';
document.body.appendChild(dialog);
let current = 0;
function show(index) { current = (index + buttons.length) % buttons.length; const source = buttons[current]; const photo = dialog.querySelector('img'); photo.src = source.dataset.src; photo.alt = source.dataset.caption; dialog.querySelector('figcaption').textContent = source.dataset.caption; dialog.querySelector('.activity-count').textContent = `${current + 1} / ${buttons.length}`; }
buttons.forEach((button,index) => button.addEventListener('click',() => { show(index); document.body.classList.add('modal-open'); dialog.showModal(); }));
dialog.querySelector('.activity-close').addEventListener('click',() => dialog.close());
dialog.querySelector('.activity-prev').addEventListener('click',() => show(current - 1));
dialog.querySelector('.activity-next').addEventListener('click',() => show(current + 1));
dialog.addEventListener('click',(event) => { if (event.target === dialog) dialog.close(); });
dialog.addEventListener('close',() => document.body.classList.remove('modal-open'));
dialog.addEventListener('keydown',(event) => { if (event.key === 'ArrowLeft') show(current - 1); if (event.key === 'ArrowRight') show(current + 1); });
