(function () {
 
  /* ── DỮ LIỆU GALLERY (Hỗ trợ 2 ngôn ngữ) ─────────────────────────────────── */
  const galleryData = [
    {
      src: 'img/gallery/phong-an-chinh.jpg',
      vi: {
        tag: 'Không Gian · Interior',
        title: 'Phòng Ăn Chính',
        desc: 'Không gian dining room sang trọng với vòm cung cổ điển, đèn chùm pha lê và ánh nến lung linh. Sức chứa 80 khách, phù hợp từ bữa tối lãng mạn đến tiệc doanh nghiệp.',
      },
      en: {
        tag: 'Space · Interior',
        title: 'Main Dining Room',
        desc: 'Luxurious dining room space with classic arches, crystal chandeliers, and flickering candlelight. Capacity of 80 guests, perfect for romantic dinners to corporate events.',
      }
    },
    {
      src: 'img/gallery/ham-ruou.jpg',
      vi: {
        tag: 'Bar · Cave à Vins',
        title: 'Hầm Rượu',
        desc: 'Bộ sưu tập hơn 400 chai từ Burgundy, Bordeaux và Tuscany. Sommelier tuyển chọn kỹ lưỡng để đồng hành hoàn hảo cùng từng thực đơn.',
      },
      en: {
        tag: 'Bar · Wine Cellar',
        title: 'Wine Cellar',
        desc: 'A collection of over 400 bottles from Burgundy, Bordeaux, and Tuscany. Carefully selected by our Sommelier to perfectly accompany each menu.',
      }
    },
    {
      src: 'img/menu/wayguA5.jpg',
      vi: {
        tag: 'Signature · Wagyu',
        title: 'Wagyu Beef A5',
        desc: 'Bò Wagyu A5 nhập khẩu trực tiếp từ Kobe, Nhật Bản. Vân mỡ cẩm thạch BMS 10–12, nướng trên than binchotan ngay trước mặt thực khách.',
      },
      en: {
        tag: 'Signature · Wagyu',
        title: 'Wagyu Beef A5',
        desc: 'A5 Wagyu beef imported directly from Kobe, Japan. BMS 10–12 marbling, grilled over binchotan charcoal right in front of the guests.',
      }
    },
    {
      src: 'img/gallery/phong-rieng.jpg',
      vi: {
        tag: 'Không Gian · Private Dining',
        title: 'Phòng Riêng Tư',
        desc: 'Không gian riêng tư cho 6–12 khách. Lý tưởng cho tiệc sinh nhật, kỷ niệm và họp doanh nghiệp thân mật. Đặt trước tối thiểu 48 giờ.',
      },
      en: {
        tag: 'Space · Private Dining',
        title: 'Private Dining Room',
        desc: 'Private space for 6–12 guests. Ideal for birthday parties, anniversaries, and intimate business meetings. Minimum 48-hour advance booking required.',
      }
    },
    {
      src: 'img/gallery/quay-bar.jpg',
      vi: {
        tag: 'Bar · Cocktail',
        title: 'Quầy Bar',
        desc: 'Hơn 60 loại spirits hiếm, cocktail signature và rượu vang theo ly. Bartender tư vấn và pha chế theo sở thích của quý khách.',
      },
      en: {
        tag: 'Bar · Cocktail',
        title: 'The Bar',
        desc: 'Over 60 rare spirits, signature cocktails, and wines by the glass. Bartenders consult and mix according to your preferences.',
      }
    },
  ];
 
  /* ── DỮ LIỆU TIMELINE (Hỗ trợ 2 ngôn ngữ) ────────────────────────────────── */
  const timelineData = [
    {
      num: '01',
      time: "15'",
      vi: {
        title: 'Đặt Bàn Trước',
        desc: 'Đặt bàn qua hotline hoặc website chính thức. Đội ngũ tư vấn xác nhận và ghi chú yêu cầu đặc biệt — dị ứng thực phẩm, sở thích rượu vang, decor sinh nhật hay kỷ niệm ngày đặc biệt.',
        timeLabel: 'xác nhận',
      },
      en: {
        title: 'Advance Booking',
        desc: 'Reserve your table via our hotline or official website. Our consultants will confirm and note any special requirements — food allergies, wine preferences, birthday setups, or anniversary decors.',
        timeLabel: 'confirmation',
      }
    },
    {
      num: '02',
      time: "5'",
      vi: {
        title: 'Đón Khách & Dẫn Bàn',
        desc: "Maître d' hỗ trợ gửi đồ và dẫn quý khách đến bàn được bài trí sẵn với tên và hoa tươi. Sommelier giới thiệu wine list và gợi ý kết hợp phù hợp.",
        timeLabel: 'đón tiếp',
      },
      en: {
        title: 'Welcome & Seating',
        desc: "Maître d' assists with cloakroom services and guides you to a pre-arranged table decorated with your name and fresh flowers. Sommelier introduces the wine list and suggests pairings.",
        timeLabel: 'reception',
      }
    },
    {
      num: '03',
      time: "30'",
      vi: {
        title: 'Khai Vị & Amuse-Bouche',
        desc: 'Bắt đầu với champagne Billecart-Salmon hoặc aperitivo theo mùa. Tiếp theo là amuse-bouche hai miếng — tartare cá hồi Nauy hoặc foie gras torchon.',
        timeLabel: 'khai vị',
      },
      en: {
        title: 'Appetizer & Amuse-Bouche',
        desc: 'Begin with Billecart-Salmon champagne or seasonal aperitivo. Followed by a two-piece amuse-bouche — Norwegian salmon tartare or foie gras torchon.',
        timeLabel: 'appetizer',
      }
    },
    {
      num: '04',
      time: "60'",
      vi: {
        title: 'Món Chính Fine Dining',
        desc: 'Đỉnh cao của bữa tối — Wagyu nướng binchotan, Duck Confit 8 giờ kiểu Gascogne, hoặc Lobster Thermidor Paris thế kỷ XIX. Mỗi món được plating bởi bếp trưởng.',
        timeLabel: 'thưởng thức',
      },
      en: {
        title: 'Fine Dining Main Course',
        desc: 'The pinnacle of dinner — binchotan-grilled Wagyu, 8-hour Gascogne-style Duck Confit, or 19th-century Paris Lobster Thermidor. Each dish is plated by the head chef.',
        timeLabel: 'enjoyment',
      }
    },
    {
      num: '05',
      time: "45'",
      vi: {
        title: 'Tráng Miệng & Cà Phê',
        desc: 'Grand Dessert — soufflé chocolate nóng, sorbet yuzu tươi và petits fours. Cà phê Arabica Ethiopia single-origin pha pour-over tại bàn cùng mignardises tự làm.',
        timeLabel: 'dessert',
      },
      en: {
        title: 'Dessert & Coffee',
        desc: 'Grand Dessert — hot chocolate soufflé, fresh yuzu sorbet, and petits fours. Single-origin Ethiopia Arabica coffee brewed pour-over at your table along with homemade mignardises.',
        timeLabel: 'dessert',
      }
    },
  ];
 
  /* ── HÀM KIỂM TRA NGÔN NGỮ HIỆN TẠI ────────────────────────────────── */
  function getCurrentLang() {
    // Cách 1: Kiểm tra xem nút bấm tiếng Anh có đang chứa class active-lang hay không
    const btnEn = document.getElementById('btn-en');
    if (btnEn && btnEn.classList.contains('active-lang')) {
      return 'en';
    }
    // Cách 2: Dự phòng nếu bạn thay đổi bằng cách đặt thuộc tính lang của thẻ html (<html lang="en">)
    const htmlLang = document.documentElement.getAttribute('lang');
    if (htmlLang === 'en') return 'en';
    
    return 'vi'; // Mặc định trả về tiếng Việt
  }

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
    const lang = getCurrentLang(); // Lấy ngôn ngữ hiện tại ('vi' hoặc 'en')
    const localizedData = d[lang]; // Lấy cụm dữ liệu tương ứng theo ngôn ngữ
    
    lbImg.src   = d.src;
    lbImg.alt   = localizedData.title;
    lbTag.textContent   = localizedData.tag;
    lbTitle.textContent = localizedData.title;
    lbDesc.textContent  = localizedData.desc;
    
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
    const lang = getCurrentLang(); // Lấy ngôn ngữ hiện tại ('vi' hoặc 'en')
    const localizedData = d[lang]; // Lấy cụm dữ liệu tương ứng theo ngôn ngữ
 
    // Animate out
    detailPanel.style.opacity = '0';
    detailPanel.style.transform = 'translateY(8px)';
 
    setTimeout(function () {
      dpIcon.textContent      = d.num;
      dpTitle.textContent     = localizedData.title;
      dpDesc.textContent      = localizedData.desc;
      dpTime.textContent      = d.time;
      dpTimeLabel.textContent = localizedData.timeLabel;
 
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