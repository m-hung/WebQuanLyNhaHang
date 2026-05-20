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
}

function changeLanguage(lng) {
    applyLanguage(lng);
}

document.addEventListener('DOMContentLoaded', () => {
    const savedLng = localStorage.getItem('selected_language') || 'vi';
    applyLanguage(savedLng);
});