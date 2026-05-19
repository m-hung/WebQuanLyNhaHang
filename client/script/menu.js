const API_URL = 'http://localhost:8080/api/menu-items';
const CAT_URL = 'http://localhost:8080/api/categories';

document.addEventListener('DOMContentLoaded', async () => {
    const menuGrid = document.getElementById('main-menu-grid');
    const filterTabsContainer = document.querySelector('.filter-tabs');
    const searchInput = document.getElementById('menu-search');

    let allFoods = [];
    let allCategories = [];
    let activeFilter = 'all';

    async function fetchCategories() {
        try {
            const res = await fetch(CAT_URL);
            const data = await res.json();
            allCategories = data.filter(function(c) { return c.active; });
            renderFilterTabs();
        } catch (e) {
            console.error('Loi load danh muc:', e);
        }
    }

    async function fetchFoods() {
        try {
            const res = await fetch(API_URL);
            const data = await res.json();
            allFoods = data.filter(function(f) { return f.isAvailable; });
            renderMenu();
        } catch (e) {
            console.error('Loi load mon an:', e);
        }
    }

    function renderFilterTabs() {
        filterTabsContainer.innerHTML = '';
        var allBtn = document.createElement('button');
        allBtn.className = 'filter-btn active';
        allBtn.dataset.filter = 'all';
        allBtn.textContent = 'T\u1ea5t C\u1ea3';
        filterTabsContainer.appendChild(allBtn);

        allCategories.forEach(function(cat) {
            var btn = document.createElement('button');
            btn.className = 'filter-btn';
            btn.dataset.filter = String(cat.categoryId);
            btn.textContent = cat.name;
            filterTabsContainer.appendChild(btn);
        });

        filterTabsContainer.querySelectorAll('.filter-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                filterTabsContainer.querySelectorAll('.filter-btn').forEach(function(b) {
                    b.classList.remove('active');
                });
                btn.classList.add('active');
                activeFilter = btn.dataset.filter;
                renderMenu();
            });
        });
    }

    function formatPrice(price) {
        if (!price) return '';
        return Number(price).toLocaleString('vi-VN') + ' VND';
    }

    function renderMenu() {
        var searchText = searchInput.value.toLowerCase().trim();
        var filtered = allFoods.filter(function(food) {
            var matchSearch = food.name.toLowerCase().includes(searchText);
            var catId = food.category ? String(food.category.categoryId) : '';
            var matchFilter = activeFilter === 'all' || catId === activeFilter;
            return matchSearch && matchFilter;
        });

        menuGrid.innerHTML = '';

        if (filtered.length === 0) {
            var msg = document.createElement('p');
            msg.style.cssText = 'text-align:center;padding:40px;color:#999;grid-column:1/-1;';
            msg.textContent = 'Kh\u00f4ng t\u00ecm th\u1ea5y m\u00f3n \u0103n ph\u00f9 h\u1ee3p.';
            menuGrid.appendChild(msg);
            return;
        }

        filtered.forEach(function(food) {
            var hasDiscount = food.discount && Number(food.discount) > 0;
            var finalPrice = hasDiscount
                ? Number(food.price) - Number(food.discount)
                : Number(food.price);

            // Card
            var card = document.createElement('div');
            card.className = 'menu-card show-animation';
            card.dataset.category = food.category ? food.category.categoryId : '';

            // Image div
            var imgDiv = document.createElement('div');
            imgDiv.className = 'menu-img';

            if (food.imageUrl) {
                var img = document.createElement('img');
                img.alt = food.name;
                img.style.cssText = 'width:100%;height:100%;object-fit:cover;';
                img.src = food.imageUrl;
                img.addEventListener('error', function() {
                    imgDiv.innerHTML = '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:3rem;">&#127869;</div>';
                });
                imgDiv.appendChild(img);
            } else {
                imgDiv.innerHTML = '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:3rem;">&#127869;</div>';
            }

            // Info div
            var infoDiv = document.createElement('div');
            infoDiv.className = 'card-info';

            var h3 = document.createElement('h3');
            h3.textContent = food.name;
            infoDiv.appendChild(h3);

            var p = document.createElement('p');
            p.textContent = food.description || '';
            infoDiv.appendChild(p);

            if (hasDiscount) {
                var oldPrice = document.createElement('span');
                oldPrice.className = 'price';
                oldPrice.style.cssText = 'text-decoration:line-through;opacity:0.5;font-size:0.85em;display:block;';
                oldPrice.textContent = formatPrice(food.price);
                infoDiv.appendChild(oldPrice);

                var newPrice = document.createElement('span');
                newPrice.className = 'price';
                newPrice.textContent = formatPrice(finalPrice);
                infoDiv.appendChild(newPrice);
            } else {
                var priceEl = document.createElement('span');
                priceEl.className = 'price';
                priceEl.textContent = formatPrice(food.price);
                infoDiv.appendChild(priceEl);
            }

            card.appendChild(imgDiv);
            card.appendChild(infoDiv);
            menuGrid.appendChild(card);
        });
    }

    searchInput.addEventListener('input', renderMenu);

    await fetchCategories();
    await fetchFoods();
});
