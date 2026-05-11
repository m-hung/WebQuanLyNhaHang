// =============================================
// CELESTÉ HOUSE — payment-result.js
// File: client/script/payment-result.js
//
// VNPay redirect về URL dạng:
// /src/payment-result.html?vnp_ResponseCode=00&vnp_TxnRef=CH...&vnp_Amount=21000000&...
//
// Backend đã verify chữ ký HMAC và lưu reservation trước khi redirect về đây.
// File này chỉ đọc params URL và hiển thị kết quả cho user.
// =============================================

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);

    // ── Các params VNPay trả về ──
    const responseCode = params.get('vnp_ResponseCode');   // "00" = thành công
    const txnRef       = params.get('vnp_TxnRef');         // orderId ta đã gửi
    const amount       = params.get('vnp_Amount');         // x100 (VNPay nhân 100)
    const bankCode     = params.get('vnp_BankCode');       // VD: "MB", "VCB"
    const payDate      = params.get('vnp_PayDate');        // "20240510143022"
    const transactionNo= params.get('vnp_TransactionNo'); // Mã giao dịch VNPay

    // Đọc thông tin đặt bàn từ localStorage
    const name     = localStorage.getItem('bk_name')     || '—';
    const table    = localStorage.getItem('bk_table')    || '—';
    const datetime = localStorage.getItem('bk_datetime') || '—';

    // ── Format dữ liệu hiển thị ──
    const amountDisplay = amount
        ? parseInt(amount) / 100 : 0;
    const amountFormatted = amountDisplay.toLocaleString('vi-VN') + ' ₫';

    const payDateFormatted = payDate
        ? `${payDate.substring(6,8)}/${payDate.substring(4,6)}/${payDate.substring(0,4)} `
        + `${payDate.substring(8,10)}:${payDate.substring(10,12)}:${payDate.substring(12,14)}`
        : '—';

    // ── Render theo kết quả ──
    if (responseCode === '00') {
        renderSuccess({ txnRef, transactionNo, amountFormatted, bankCode, payDateFormatted, name, table });
    } else {
        renderFailure(responseCode, txnRef);
    }
});

// ─────────────────────────────────────────────
// THÀNH CÔNG
// ─────────────────────────────────────────────
function renderSuccess({ txnRef, transactionNo, amountFormatted, bankCode, payDateFormatted, name, table }) {
    // Progress: bước 4 thành công
    document.getElementById('step-4-num').innerHTML =
        '<span class="material-symbols-outlined" style="font-size:13px">check</span>';
    document.getElementById('step-4').className = 'step done';

    // Icon
    const iconEl = document.getElementById('result-icon-symbol');
    iconEl.textContent = 'check_circle';
    iconEl.parentElement.classList.add('success');

    document.getElementById('result-title').textContent    = 'Thanh Toán Thành Công!';
    document.getElementById('result-subtitle').innerHTML   =
        'Cảm ơn quý khách đã lựa chọn <strong style="color:var(--gold)">Celesté House</strong>.<br>'
      + 'Xác nhận đã được gửi qua email & SMS.';

    // Chi tiết giao dịch
    document.getElementById('r-txn-ref').textContent  = transactionNo || txnRef || '—';
    document.getElementById('r-order-id').textContent = txnRef         || '—';
    document.getElementById('r-amount').textContent   = amountFormatted;
    document.getElementById('r-bank').textContent     = bankCode        || '—';
    document.getElementById('r-time').textContent     = payDateFormatted;
    document.getElementById('r-name').textContent     = name;
    document.getElementById('r-table').textContent    = table;

    document.getElementById('result-details').style.display = 'grid';

    // Nút hành động
    const actionsEl = document.getElementById('result-actions');
    actionsEl.style.display = 'flex';
    actionsEl.innerHTML = `
        <button class="btn-payment-confirm"
                onclick="window.location.href='../index.html'">
            Về Trang Chủ
        </button>
        <button class="btn-back"
                onclick="window.print()">
            ⎙ In xác nhận
        </button>
    `;

    // Dọn localStorage
    ['bk_name','bk_phone','bk_email','bk_datetime','bk_guests',
     'bk_table','bk_tableId','bk_reservationTime','bk_order_id']
        .forEach(k => localStorage.removeItem(k));
}

// ─────────────────────────────────────────────
// THẤT BẠI / HUỶ
// ─────────────────────────────────────────────
function renderFailure(code, txnRef) {
    const isCancel = (code === '24'); // 24 = user huỷ

    const iconEl = document.getElementById('result-icon-symbol');
    iconEl.textContent = isCancel ? 'cancel' : 'error';
    iconEl.parentElement.classList.add('failure');

    document.getElementById('result-title').textContent  =
        isCancel ? 'Giao Dịch Đã Huỷ' : 'Thanh Toán Thất Bại';
    document.getElementById('result-subtitle').textContent =
        isCancel
            ? 'Bạn đã huỷ giao dịch. Đặt bàn chưa được xác nhận.'
            : `Giao dịch không thành công (mã lỗi: ${code}). Vui lòng thử lại.`;

    const actionsEl = document.getElementById('result-actions');
    actionsEl.style.display = 'flex';
    actionsEl.innerHTML = `
        <button class="btn-payment-confirm"
                onclick="window.location.href='./payment.html'">
            ↺ Thử Thanh Toán Lại
        </button>
        <button class="btn-back"
                onclick="window.location.href='./booking.html'">
            ← Quay lại đặt bàn
        </button>
    `;
}
