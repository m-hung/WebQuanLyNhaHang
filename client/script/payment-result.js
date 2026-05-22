// =============================================
// CELESTÉ HOUSE — payment-result.js
// File: client/script/payment-result.js
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

    // Lấy ngôn ngữ hiện tại chính xác từ hệ thống i18n
    const currentLang = localStorage.getItem('selected_language') || localStorage.getItem('language') || 'vi';

    // Đọc thông tin đặt bàn từ localStorage
    const name     = localStorage.getItem('bk_name')     || '—';
    const datetime = localStorage.getItem('bk_datetime') || '—';

    // Format tên bàn theo ngôn ngữ hiện tại
    const tNum = localStorage.getItem('bk_table_num');
    const tCap = localStorage.getItem('bk_table_cap');
    let table;
    if (tNum && tCap) {
        table = currentLang === 'en'
            ? `Table ${tNum} (Capacity: ${tCap})`
            : `Bàn ${tNum} (Sức chứa: ${tCap})`;
    } else {
        // Fallback: parse từ bk_table nếu có dạng 'Table X (Capacity: Y)'
        const rawTable = localStorage.getItem('bk_table') || '—';
        const match = rawTable.match(/(\d+)[^:]*:\s*(\d+)/);
        if (match) {
            table = currentLang === 'en'
                ? `Table ${match[1]} (Capacity: ${match[2]})`
                : `Bàn ${match[1]} (Sức chứa: ${match[2]})`;
        } else {
            table = rawTable;
        }
    }

    // ── Format dữ liệu hiển thị ──
    const amountDisplay = amount ? parseInt(amount) / 100 : 0;
    // Giữ định dạng gốc VND cho cả 2 ngôn ngữ theo logic ban đầu của bạn
    const finalAmount = amountDisplay.toLocaleString('vi-VN') + ' ₫';

    const payDateFormatted = payDate
        ? `${payDate.substring(6,8)}/${payDate.substring(4,6)}/${payDate.substring(0,4)} `
        + `${payDate.substring(8,10)}:${payDate.substring(10,12)}:${payDate.substring(12,14)}`
        : '—';

    // ── Render theo kết quả ──
    if (responseCode === '00') {
        renderSuccess({ txnRef, transactionNo, amountFormatted: finalAmount, bankCode, payDateFormatted, name, table, currentLang });
    } else {
        renderFailure(responseCode, txnRef, currentLang);
    }
});

// ─────────────────────────────────────────────
// THÀNH CÔNG
// ─────────────────────────────────────────────
function renderSuccess({ txnRef, transactionNo, amountFormatted, bankCode, payDateFormatted, name, table, currentLang }) {
    // Progress: bước 4 thành công
    const step4Num = document.getElementById('step-4-num');
    if (step4Num) step4Num.innerHTML = '<span class="material-symbols-outlined" style="font-size:13px">check</span>';
    
    const step4 = document.getElementById('step-4');
    if (step4) step4.className = 'step done';

    // Icon thành công
    const iconEl = document.getElementById('result-icon-symbol');
    if (iconEl) {
        iconEl.textContent = 'check_circle';
        iconEl.parentElement.classList.remove('failure');
        iconEl.parentElement.classList.add('success');
    }

    // Xóa bỏ thuộc tính data-i18n tạm thời trên Tiêu đề để tránh bị i18n.js ghi đè lại thành "Đang xử lý"
    const titleEl = document.getElementById('result-title');
    const subtitleEl = document.getElementById('result-subtitle');
    if (titleEl) titleEl.removeAttribute('data-i18n');
    if (subtitleEl) subtitleEl.removeAttribute('data-i18n');

    // Cập nhật nội dung Text dựa theo ngôn ngữ đang chọn
    if (currentLang === 'en') {
        if (titleEl) titleEl.textContent = 'Payment Successful!';
        if (subtitleEl) subtitleEl.innerHTML = 'Thank you for choosing <strong style="color:var(--gold)">Celesté House</strong>.<br>A confirmation has been sent via email & SMS.';
    } else {
        if (titleEl) titleEl.textContent = 'Thanh Toán Thành Công!';
        if (subtitleEl) subtitleEl.innerHTML = 'Cảm ơn quý khách đã lựa chọn <strong style="color:var(--gold)">Celesté House</strong>.<br>Xác nhận đã được gửi qua email & SMS.';
    }

    // Gán dữ liệu vào bảng chi tiết
    if (document.getElementById('r-txn-ref')) document.getElementById('r-txn-ref').textContent   = transactionNo || txnRef || '—';
    if (document.getElementById('r-order-id')) document.getElementById('r-order-id').textContent  = txnRef         || '—';
    if (document.getElementById('r-amount')) document.getElementById('r-amount').textContent    = amountFormatted;
    if (document.getElementById('r-bank')) document.getElementById('r-bank').textContent      = bankCode        || '—';
    if (document.getElementById('r-time')) document.getElementById('r-time').textContent      = payDateFormatted;
    if (document.getElementById('r-name')) document.getElementById('r-name').textContent      = name;
    if (document.getElementById('r-table')) document.getElementById('r-table').textContent     = table;

    const detailsEl = document.getElementById('result-details');
    if (detailsEl) detailsEl.style.display = 'grid';

    // Gửi email xác nhận cho khách
    sendConfirmationEmail({
        customer_name:  name,
        customer_email: localStorage.getItem('bk_email') || '',
        table:          table,
        datetime:       localStorage.getItem('bk_datetime') || '—',
        guests:         localStorage.getItem('bk_guests') || '—',
        transaction_no: transactionNo || txnRef || '—',
        amount:         amountFormatted,
    });

    // Tạo các nút chức năng đồng bộ theo ngôn ngữ
    const actionsEl = document.getElementById('result-actions');
    if (actionsEl) {
        actionsEl.style.display = 'flex';

        window.finishBooking = function() {
            ['bk_name','bk_phone','bk_email','bk_datetime','bk_guests',
            'bk_table','bk_tableId','bk_reservationTime','bk_order_id', 'bk_table_num', 'bk_table_cap']
                .forEach(k => localStorage.removeItem(k));
            window.location.href = '../index.html';
        };

        const homeText = currentLang === 'en' ? 'Back to Homepage' : 'Về Trang Chủ';
        const printText = currentLang === 'en' ? 'Print Confirmation' : 'In phiếu xác nhận';

        actionsEl.innerHTML = `
            <button class="btn-payment-confirm" onclick="finishBooking()">
                ${homeText}
            </button>
            <button class="btn-back" onclick="window.print()">
                ⎙ ${printText}
            </button>
        `;
    }
}

// ─────────────────────────────────────────────
// THẤT BẠI / HUỶ
// ─────────────────────────────────────────────
function renderFailure(code, txnRef, currentLang) {
    const isCancel = (code === '24'); // 24 = user huỷ

    const iconEl = document.getElementById('result-icon-symbol');
    if (iconEl) {
        iconEl.textContent = isCancel ? 'cancel' : 'error';
        iconEl.parentElement.classList.remove('success');
        iconEl.parentElement.classList.add('failure');
    }

    const titleEl = document.getElementById('result-title');
    const subtitleEl = document.getElementById('result-subtitle');
    if (titleEl) titleEl.removeAttribute('data-i18n');
    if (subtitleEl) subtitleEl.removeAttribute('data-i18n');

    if (currentLang === 'en') {
        if (titleEl) titleEl.textContent = isCancel ? 'Transaction Cancelled' : 'Payment Failed';
        if (subtitleEl) subtitleEl.textContent = isCancel
            ? 'You cancelled the transaction. Your table booking has not been confirmed.'
            : `Transaction was unsuccessful (Error code: ${code}). Please try again.`;
    } else {
        if (titleEl) titleEl.textContent = isCancel ? 'Giao Dịch Đã Huỷ' : 'Thanh Toán Thất Bại';
        if (subtitleEl) subtitleEl.textContent = isCancel
            ? 'Bạn đã huỷ giao dịch. Đặt bàn chưa được xác nhận.'
            : `Giao dịch không thành công (mã lỗi: ${code}). Vui lòng thử lại.`;
    }

    const actionsEl = document.getElementById('result-actions');
    if (actionsEl) {
        actionsEl.style.display = 'flex';

        const retryText = currentLang === 'en' ? '↺ Retry Payment' : '↺ Thử Thanh Toán Lại';
        const backText = currentLang === 'en' ? '← Back to Booking' : '← Quay lại đặt bàn';

        actionsEl.innerHTML = `
            <button class="btn-payment-confirm" onclick="window.location.href='./payment.html'">
                ${retryText}
            </button>
            <button class="btn-back" onclick="window.location.href='./booking.html'">
                ${backText}
            </button>
        `;
    }
}

function sendConfirmationEmail(params) {
    if (!params.customer_email) {
        console.warn('[EmailJS] Không có email khách hàng, bỏ qua.');
        return;
    }
    emailjs.send('service_70nli69', 'template_ef816li', params)
        .then(() => console.log('[EmailJS] Đã gửi email xác nhận cho khách.'))
        .catch(err => console.error('[EmailJS] Lỗi gửi email:', err));
}