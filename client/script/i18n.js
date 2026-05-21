// 1. Hàm xác định trang hiện tại để lấy đúng tên file JSON
function getCurrentPageName() {
    const path = window.location.pathname;
    const page = path.split("/").pop(); // Lấy phần cuối cùng của URL (ví dụ: index.html hoặc menu.html)
    
    if (!page || page === 'index.html') return 'index';
    return page.replace('.html', ''); // Trả về 'menu', 'booking', 'contact'...
}

// 2. Hàm lấy đường dẫn chính xác tới thư mục lang/
function getLangPath() {
    const isSubPage = window.location.pathname.includes('/src/');
    return isSubPage ? '../script/lang/' : 'script/lang/';
}

// 3. Hàm tải file JSON (Hỗ trợ tải nhiều file cùng lúc)
async function fetchJson(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) return {}; // Nếu không tìm thấy file, trả về object rỗng để tránh lỗi
        return await response.json();
    } catch (e) {
        return {};
    }
}

// 4. Hàm xử lý dịch chính
async function applyLanguage(lng) {
    const basePath = getLangPath();
    const pageName = getCurrentPageName();

    // Tải song song file dùng chung (navbar) và file riêng của trang đó
    const [navbarRes, pageRes] = await Promise.all([
        fetchJson(`${basePath}${lng}/navbar.json`),
        fetchJson(`${basePath}${lng}/${pageName}.json`)
    ]);

    // Gộp dữ liệu dịch lại thành một kho duy nhất cho trang hiện tại
    const translations = {
        navbar: navbarRes,
        page: pageRes
    };

    // Tìm và dịch các phần tử HTML
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const keyPath = element.getAttribute('data-i18n'); 
        const [prefix, key] = keyPath.split('.'); 

        // === ĐOẠN XỬ LÝ FIX LỖI DỊCH ĐỘNG CHO TRANG PAYMENT ===
        if (keyPath === 'page.dynamic_guests') {
            const guestsCount = localStorage.getItem('bk_guests');
            if (guestsCount) {
                element.innerHTML = lng === 'en' 
                    ? `${guestsCount} People` 
                    : `${guestsCount} người`;
            }
            return; // Bỏ qua xử lý mặc định
        }

        if (keyPath === 'page.dynamic_table') {
            const tNum = localStorage.getItem('bk_table_num');
            const tCap = localStorage.getItem('bk_table_cap');
                
            if (tNum && tCap) {
                element.innerHTML = lng === 'en' 
                    ? `Table ${tNum} (Capacity: ${tCap})` 
                    : `Bàn ${tNum} (Sức chứa: ${tCap})`;
            } else {
                // Parse từ bk_table nếu có dạng "Bàn 3 (Sức chứa: 4)"
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

        // BỔ SUNG THÊM: Tự động dịch định dạng Ngày & Giờ ở trang payment khi switch ngôn ngữ
        if (keyPath === 'page.lbl_datetime') {
            // Tìm thẻ kế tiếp (hoặc thẻ chứa giá trị hiển thị thời gian)
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
            // Không return ở đây để thẻ label "Ngày & Giờ" vẫn được dịch bình thường từ file JSON
        }
        // ======================================================

        if (translations[prefix] && translations[prefix][key]) {
            const txt = translations[prefix][key];
            // Kiểm tra nếu là thẻ input thì dịch placeholder, ngược lại dịch textContent
            if (element.tagName === 'INPUT') {
                element.setAttribute('placeholder', txt);
            } else {
                element.innerHTML = txt; // Dùng innerHTML để giữ lại các ký tự đặc biệt như &rsaquo; ở nút Tìm hiểu thêm
            }
        }
    });

    localStorage.setItem('selected_language', lng);
    document.documentElement.lang = lng;

    const dateInput = document.getElementById('book-date');
    if (dateInput) {
        // Nếu chọn tiếng Anh thì set là 'en-US', tiếng Việt set là 'vi-VN' giúp ép trình duyệt hiển thị lịch chuẩn ngôn ngữ
        dateInput.setAttribute('lang', lng === 'en' ? 'en-US' : 'vi-VN');
    }

    // Tìm toàn bộ các nút chọn bàn đang được hiển thị trên giao diện
    const dynamicTables = document.querySelectorAll('.table-select');
    dynamicTables.forEach(btn => {
        const tableNum = btn.getAttribute('data-table-num');
        const cap = btn.getAttribute('data-table-cap');
        
        // Nếu nút bấm này có chứa dữ liệu bàn động, tiến hành đổi ngôn ngữ chữ hiển thị bên trong
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
    const savedLng = localStorage.getItem('selected_language') || 'vi';
    applyLanguage(savedLng);
});