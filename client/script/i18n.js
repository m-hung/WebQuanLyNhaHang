// =============================================
// i18n.js — CELESTÉ HOUSE
// =============================================

// 1. Hàm xác định trang hiện tại để lấy đúng tên file JSON
function getCurrentPageName() {
    const path = window.location.pathname;
    const page = path.split("/").pop();
    
    if (!page || page === 'index.html') return 'index';
    return page.replace('.html', '');
}

// 2. Hàm lấy đường dẫn chính xác tới thư mục lang/
function getLangPath() {
    const isSubPage = window.location.pathname.includes('/src/');
    return isSubPage ? '../script/lang/' : 'script/lang/';
}

// 3. Hàm tải file JSON
async function fetchJson(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) return {};
        return await response.json();
    } catch (e) {
        return {};
    }
}

// 4. Hàm xử lý dịch chính
async function applyLanguage(lng) {
    const basePath = getLangPath();
    const pageName = getCurrentPageName();

    const [navbarRes, pageRes] = await Promise.all([
        fetchJson(`${basePath}${lng}/navbar.json`),
        fetchJson(`${basePath}${lng}/${pageName}.json`)
    ]);

    const translations = {
        navbar: navbarRes,
        page: pageRes
    };

    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const keyPath = element.getAttribute('data-i18n');
        const [prefix, key] = keyPath.split('.');

        // === DYNAMIC KEYS ===
        if (keyPath === 'page.dynamic_guests') {
            const guestsCount = localStorage.getItem('bk_guests');
            if (guestsCount) {
                element.innerHTML = lng === 'en'
                    ? `${guestsCount} People`
                    : `${guestsCount} người`;
            }
            return;
        }

        if (keyPath === 'page.dynamic_table') {
            const tNum = localStorage.getItem('bk_table_num');
            const tCap = localStorage.getItem('bk_table_cap');

            if (tNum && tCap) {
                element.innerHTML = lng === 'en'
                    ? `Table ${tNum} (Capacity: ${tCap})`
                    : `Bàn ${tNum} (Sức chứa: ${tCap})`;
            } else {
                const rawTable = localStorage.getItem('bk_table') || '';
                const match = rawTable.match(/(\d+)[^:]*:\s*(\d+)/);
                if (match) {
                    element.innerHTML = lng === 'en'
                        ? `Table ${match[1]} (Capacity: ${match[2]})`
                        : `Bàn ${match[1]} (Sức chứa: ${match[2]})`;
                } else {
                    const urlParams = new URLSearchParams(window.location.search);
                    element.innerHTML = urlParams.get('table') || rawTable || '—';
                }
            }
            return;
        }

        if (keyPath === 'page.lbl_datetime') {
            const datetimeValueEl = document.getElementById('s-datetime');
            const rawTime = localStorage.getItem('bk_reservationTime');

            if (datetimeValueEl && rawTime) {
                const dtObj = new Date(rawTime);
                const localeStr = lng === 'en' ? 'en-US' : 'vi-VN';
                datetimeValueEl.innerHTML = dtObj.toLocaleString(localeStr, {
                    day: '2-digit', month: '2-digit', year: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                });
            }
        }
        // ====================

        if (translations[prefix] && translations[prefix][key]) {
            const txt = translations[prefix][key];
            if (element.tagName === 'INPUT') {
                element.setAttribute('placeholder', txt);
            } else {
                element.innerHTML = txt;
            }
        }
    });

    // ── FIX: đồng bộ cả 2 key để tương thích toàn bộ dự án ──
    localStorage.setItem('selected_language', lng);
    localStorage.setItem('language', lng);             // ← thêm dòng này

    document.documentElement.lang = lng;

    // Cập nhật active state nút VI / EN
    document.querySelectorAll('.btn-lang').forEach(btn => btn.classList.remove('active-lang'));
    const activeBtn = document.getElementById('btn-' + lng);
    if (activeBtn) activeBtn.classList.add('active-lang');

    const dateInput = document.getElementById('book-date');
    if (dateInput) {
        dateInput.setAttribute('lang', lng === 'en' ? 'en-US' : 'vi-VN');
    }

    const dynamicTables = document.querySelectorAll('.table-select');
    dynamicTables.forEach(btn => {
        const tableNum = btn.getAttribute('data-table-num');
        const cap = btn.getAttribute('data-table-cap');
        if (tableNum && cap) {
            btn.innerText = lng === 'en'
                ? `Table ${tableNum} (Capacity: ${cap})`
                : `Bàn ${tableNum} (Sức chứa: ${cap})`;
        }
    });
}

function changeLanguage(lng) {
    applyLanguage(lng);
}

document.addEventListener('DOMContentLoaded', () => {
    // ── FIX: đọc từ cả 2 key, ưu tiên selected_language ──
    const savedLng = localStorage.getItem('selected_language')
                  || localStorage.getItem('language')
                  || 'vi';
    applyLanguage(savedLng);
});