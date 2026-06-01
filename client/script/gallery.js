(function () {
 
  /* ── DỮ LIỆU GALLERY ─────────────────────────────────── */
  const galleryData = [
    {
      src: 'img/gallery/phong-an-chinh.jpg',
      tag: 'Không Gian · Interior',
      title: 'Phòng Ăn Chính',
      desc: 'Không gian dining room sang trọng với vòm cung cổ điển, đèn chùm pha lê và ánh nến lung linh. Sức chứa 80 khách, phù hợp từ bữa tối lãng mạn đến tiệc doanh nghiệp.',
    },
    {
      src: 'img/gallery/ham-ruou.jpg',
      tag: 'Bar · Cave à Vins',
      title: 'Hầm Rượu',
      desc: 'Bộ sưu tập hơn 400 chai từ Burgundy, Bordeaux và Tuscany. Sommelier tuyển chọn kỹ lưỡng để đồng hành hoàn hảo cùng từng thực đơn.',
    },
    {
      src: 'img/menu/wayguA5.jpg',
      tag: 'Signature · Wagyu',
      title: 'Wagyu Beef A5',
      desc: 'Bò Wagyu A5 nhập khẩu trực tiếp từ Kobe, Nhật Bản. Vân mỡ cẩm thạch BMS 10–12, nướng trên than binchotan ngay trước mặt thực khách.',
    },
    {
      src: 'img/gallery/phong-rieng.jpg',
      tag: 'Không Gian · Private Dining',
      title: 'Phòng Riêng Tư',
      desc: 'Không gian riêng tư cho 6–12 khách. Lý tưởng cho tiệc sinh nhật, kỷ niệm và họp doanh nghiệp thân mật. Đặt trước tối thiểu 48 giờ.',
    },
    {
      src: 'img/gallery/quay-bar.jpg',
      tag: 'Bar · Cocktail',
      title: 'Quầy Bar',
      desc: 'Hơn 60 loại spirits hiếm, cocktail signature và rượu vang theo ly. Bartender tư vấn và pha chế theo sở thích của quý khách.',
    },
  ];
 
  /* ── DỮ LIỆU TIMELINE ────────────────────────────────── */
  const timelineData = [
    {
      num: '01',
      title: 'Đặt Bàn Trước',
      desc: 'Đặt bàn qua hotline hoặc website chính thức. Đội ngũ tư vấn xác nhận và ghi chú yêu cầu đặc biệt — dị ứng thực phẩm, sở thích rượu vang, decor sinh nhật hay kỷ niệm ngày đặc biệt.',
      time: "15'",
      timeLabel: 'xác nhận',
    },
    {
      num: '02',
      title: 'Đón Khách & Dẫn Bàn',
      desc: "Maître d' hỗ trợ gửi đồ và dẫn quý khách đến bàn được bài trí sẵn với tên và hoa tươi. Sommelier giới thiệu wine list và gợi ý kết hợp phù hợp.",
      time: "5'",
      timeLabel: 'đón tiếp',
    },
    {
      num: '03',
      title: 'Khai Vị & Amuse-Bouche',
      desc: 'Bắt đầu với champagne Billecart-Salmon hoặc aperitivo theo mùa. Tiếp theo là amuse-bouche hai miếng — tartare cá hồi Nauy hoặc foie gras torchon.',
      time: "30'",
      timeLabel: 'khai vị',
    },
    {
      num: '04',
      title: 'Món Chính Fine Dining',
      desc: 'Đỉnh cao của bữa tối — Wagyu nướng binchotan, Duck Confit 8 giờ kiểu Gascogne, hoặc Lobster Thermidor Paris thế kỷ XIX. Mỗi món được plating bởi bếp trưởng.',
      time: "60'",
      timeLabel: 'thưởng thức',
    },
    {
      num: '05',
      title: 'Tráng Miệng & Cà Phê',
      desc: 'Grand Dessert — soufflé chocolate nóng, sorbet yuzu tươi và petits fours. Cà phê Arabica Ethiopia single-origin pha pour-over tại bàn cùng mignardises tự làm.',
      time: "45'",
      timeLabel: 'dessert',
    },
  ];
 
  /* ══════════════════════════════════════════════════════
     LIGHTBOX
  ══════════════════════════════════════════════════════ */
  const lightbox   = document.getElementById('lightbox');
  const lbClose    = document.getElementById('lb-close');
  const lbPrev     = document.getElementById('lb-prev');
  const lbNext     = document.getElementById('lb-next');
  const lbImg      = document.getElementById('lb-img');
  const lbTag      = document.getElementById('lb-tag');
  const lbTitle    = document.getElementById('lb-title');
  const lbDesc     = document.getElementById('lb-desc');
  const lbDots     = document.getElementById('lb-dots');
 
  let currentIdx = 0;
 
  function buildDots() {
    lbDots.innerHTML = '';
    galleryData.forEach(function (_, i) {
      const dot = document.createElement('button');
      dot.className = 'lb-dot' + (i === currentIdx ? ' active' : '');
      dot.setAttribute('aria-label', 'Ảnh ' + (i + 1));
      dot.addEventListener('click', function () { openLightbox(i); });
      lbDots.appendChild(dot);
    });
  }
 
  function openLightbox(idx) {
    currentIdx = idx;
    const d = galleryData[idx];
    lbImg.src   = d.src;
    lbImg.alt   = d.title;
    lbTag.textContent   = d.tag;
    lbTitle.textContent = d.title;
    lbDesc.textContent  = d.desc;
    buildDots();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
 
  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }
 
  // Gắn sự kiện click vào từng ảnh masonry
  document.querySelectorAll('.masonry-item').forEach(function (item) {
    item.addEventListener('click', function () {
      openLightbox(parseInt(item.getAttribute('data-idx'), 10));
    });
  });
 
  lbClose.addEventListener('click', closeLightbox);
 
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });
 
  lbPrev.addEventListener('click', function (e) {
    e.stopPropagation();
    openLightbox((currentIdx - 1 + galleryData.length) % galleryData.length);
  });
 
  lbNext.addEventListener('click', function (e) {
    e.stopPropagation();
    openLightbox((currentIdx + 1) % galleryData.length);
  });
 
  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   openLightbox((currentIdx - 1 + galleryData.length) % galleryData.length);
    if (e.key === 'ArrowRight')  openLightbox((currentIdx + 1) % galleryData.length);
  });
 
  /* ══════════════════════════════════════════════════════
     TIMELINE
  ══════════════════════════════════════════════════════ */
  const tlSteps      = document.querySelectorAll('.tl-step');
  const dpIcon       = document.getElementById('dp-icon');
  const dpTitle      = document.getElementById('dp-title');
  const dpDesc       = document.getElementById('dp-desc');
  const dpTime       = document.getElementById('dp-time');
  const dpTimeLabel  = document.getElementById('dp-time-label');
  const detailPanel  = document.getElementById('tl-detail');
 
  function updateDetail(idx) {
    const d = timelineData[idx];
 
    // Animate out
    detailPanel.style.opacity = '0';
    detailPanel.style.transform = 'translateY(8px)';
 
    setTimeout(function () {
      dpIcon.textContent      = d.num;
      dpTitle.textContent     = d.title;
      dpDesc.textContent      = d.desc;
      dpTime.textContent      = d.time;
      dpTimeLabel.textContent = d.timeLabel;
 
      // Animate in
      detailPanel.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      detailPanel.style.opacity    = '1';
      detailPanel.style.transform  = 'translateY(0)';
    }, 80);
 
    tlSteps.forEach(function (s, i) {
      s.classList.toggle('active', i === idx);
    });
  }
 
  tlSteps.forEach(function (step, i) {
    step.addEventListener('click',      function () { updateDetail(i); });
    step.addEventListener('mouseenter', function () { updateDetail(i); });
  });
 
})();