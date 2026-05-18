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

// ── Đọc thông tin từ URL params + localStorage ──
function loadBookingInfo() {
    const params = new URLSearchParams(window.location.search);

    const name     = params.get('name')     || localStorage.getItem('bk_name')     || 'Quý khách';
    const phone    = params.get('phone')    || localStorage.getItem('bk_phone')    || '—';
    const datetime = params.get('datetime') || localStorage.getItem('bk_datetime') || '—';
    const guests   = params.get('guests')   || localStorage.getItem('bk_guests')   || '—';
    const table    = params.get('table')    || localStorage.getItem('bk_table')    || '—';

    document.getElementById('s-name').textContent     = name;
    document.getElementById('s-phone').textContent    = phone;
    document.getElementById('s-datetime').textContent = datetime;
    document.getElementById('s-guests').textContent   = guests + ' người';
    document.getElementById('s-table').textContent    = table;

    // Sinh orderId và lưu lại — backend dùng để map kết quả VNPay về đúng đơn
    const orderId = generateOrderId();
    localStorage.setItem('bk_order_id', orderId);
    document.getElementById('order-id-display').textContent = orderId;

    return orderId;
}

// ── Gọi backend tạo URL VNPay, sau đó redirect ──
async function initiateVNPay() {
    const btn      = document.getElementById('btn-vnpay');
    const errorBox = document.getElementById('error-box');
    const errorTxt = document.getElementById('error-text');

    errorBox.style.display = 'none';
    btn.disabled   = true;
    btn.innerHTML  = '<span class="btn-spinner"></span>Đang kết nối VNPay...';

    const orderId = localStorage.getItem('bk_order_id') || generateOrderId();

    // Payload gửi lên backend
    const payload = {
        orderId:         orderId,
        amount:          AMOUNT,
        orderInfo:       `Dat ban Celeste House - ${orderId}`,
        // Thông tin đặt bàn — backend lưu tạm để dùng lúc confirm
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
        // data.paymentUrl = URL cổng VNPay sandbox
        if (!data.paymentUrl) throw new Error('Không nhận được URL thanh toán từ server.');

        // Redirect sang VNPay
        window.location.href = data.paymentUrl;

    } catch (err) {
        console.error('[VNPay Init]', err);
        errorTxt.textContent   = err.message || 'Lỗi kết nối. Vui lòng thử lại.';
        errorBox.style.display = 'flex';
        btn.disabled   = false;
        btn.innerHTML  = 'Thanh Toán Ngay Với VNPay';
    }
}

// ── Init ──
document.addEventListener('DOMContentLoaded', () => {
    loadBookingInfo();
});
