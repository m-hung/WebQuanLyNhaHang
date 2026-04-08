document.addEventListener('DOMContentLoaded', () => {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const menuCards = document.querySelectorAll('.menu-card');
    const searchInput = document.getElementById('menu-search');

    // Hàm xử lý hiển thị món ăn có kèm animation
    function showCardWithAnimation(card) {
        card.classList.remove('hide-animation');
        card.classList.add('show-animation');
    }

    // Hàm ẩn món ăn
    function hideCard(card) {
        card.classList.remove('show-animation');
        card.classList.add('hide-animation');
    }

    // Hàm xử lý chung để kết hợp cả Lọc và Tìm kiếm
    function filterMenu() {
        const searchText = searchInput.value.toLowerCase().trim();
        const activeFilterBtn = document.querySelector('.filter-btn.active');
        const activeFilter = activeFilterBtn ? activeFilterBtn.getAttribute('data-filter') : 'all';

        menuCards.forEach(card => {
            const cardTitle = card.querySelector('h3').textContent.toLowerCase();
            const cardCategory = card.getAttribute('data-category');

            const matchesSearch = cardTitle.includes(searchText);
            const matchesFilter = (activeFilter === 'all' || cardCategory === activeFilter);
            if (matchesSearch && matchesFilter) {
                showCardWithAnimation(card);
            } else {
                hideCard(card);
            }
        });
    }
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterMenu();
        });
    });

    // Sự kiện khi gõ tìm kiếm
    searchInput.addEventListener('input', filterMenu);
    filterMenu(); 
});