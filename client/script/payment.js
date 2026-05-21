// =============================================
// CELESTÉ HOUSE — payment.js
// File: client/script/payment.js
// Nhiệm vụ: đọc thông tin đặt bàn, gọi backend
// lấy URL thanh toán VNPay, redirect sang cổng
// =============================================

const API_BASE = 'http://localhost:8080/api';
const AMOUNT   = 210000; // VNĐ — khớp với giá hiển thị trong HTML

// ── Sinh orderId duy nhất cho mỗi lần đặt ──
function generateOrderId() {
    const ts   = Date.now().toString(36).toUpperCase();
    const rand = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `CH${ts}${rand}`;
}

// ── Đọc thông tin từ URL params + localStorage và nạp lên giao diện ──
function loadBookingInfo() {
    const params = new URLSearchParams(window.location.search);

    // Đọc các thông tin cơ bản
    const name  = params.get('name')  || localStorage.getItem('bk_name')  || 'Quý khách';
    const phone = params.get('phone') || localStorage.getItem('bk_phone') || '—';

    // Đổ dữ liệu Tên & SĐT trực tiếp (vì không cần dịch đa ngôn ngữ)
    if (document.getElementById('s-name')) document.getElementById('s-name').textContent = name;
    if (document.getElementById('s-phone')) document.getElementById('s-phone').textContent = phone;

    // Sinh orderId cố định cho phiên thanh toán này và lưu lại
    let orderId = localStorage.getItem('bk_order_id');
    if (!orderId) {
        orderId = generateOrderId();
        localStorage.setItem('bk_order_id', orderId);
    }
    if (document.getElementById('order-id-display')) {
        document.getElementById('order-id-display').textContent = orderId;
    }

    // LƯU Ý: Không dùng ép chữ .textContent = ... cho Bàn, Số khách, Ngày giờ ở đây nữa.
    // Vì các thẻ này trên HTML đã cài thuộc tính `data-i18n`, file `i18n.js` 
    // khi chạy lên sẽ tự động đọc localStorage thô để dịch chuẩn theo ngôn ngữ hiện tại.
}

// ── Gọi backend tạo URL VNPay, sau đó redirect ──
async function initiateVNPay() {
    const btn      = document.getElementById('btn-vnpay');
    const errorBox = document.getElementById('error-box');
    const errorTxt = document.getElementById('error-text');

    if (errorBox) errorBox.style.display = 'none';
    btn.disabled   = true;
    btn.innerHTML  = '<span class="btn-spinner"></span>Đang kết nối VNPay...';

    const orderId = localStorage.getItem('bk_order_id') || generateOrderId();

    // Payload gửi lên backend
    const payload = {
        orderId:         orderId,
        amount:          AMOUNT,
        orderInfo:       `Dat ban Celeste House - ${orderId}`,
        customerName:    localStorage.getItem('bk_name')            || '',
        phone:           localStorage.getItem('bk_phone')           || '',
        email:           localStorage.getItem('bk_email')           || '',
        reservationTime: localStorage.getItem('bk_reservationTime') || '',
        guestCount:      parseInt(localStorage.getItem('bk_guests') || 0),
        tableId:         localStorage.getItem('bk_tableId')         || null,
    };

    try {
        const res = await fetch(`${API_BASE}/payment/vnpay-create`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify(payload),
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || `Server error ${res.status}`);
        }

        const data = await res.json();
        if (!data.paymentUrl) throw new Error('Không nhận được URL thanh toán từ server.');

        // Redirect sang VNPay
        window.location.href = data.paymentUrl;

    } catch (err) {
        console.error('[VNPay Init]', err);
        if (errorTxt) errorTxt.textContent = err.message || 'Lỗi kết nối. Vui lòng thử lại.';
        if (errorBox) errorBox.style.display = 'flex';
        btn.disabled   = false;
        btn.innerHTML  = 'Thanh Toán Ngay Với VNPay';
    }
}

// ── Khởi chạy khi trang payment tải xong ──
document.addEventListener('DOMContentLoaded', () => {
    loadBookingInfo();
    
    // Ép file i18n.js quét và dịch động lại một lần nữa cho chắc chắn sau khi data được load
    if (typeof applyLanguage === 'function') {
        const savedLng = localStorage.getItem('selected_language') || 'vi';
        applyLanguage(savedLng);
    }
});