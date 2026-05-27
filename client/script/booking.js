document.addEventListener('DOMContentLoaded', () => {

    const bookingForm = document.getElementById('booking-form');
    const btnFind = document.getElementById('btn-find-table');
    const btnConfirm = document.getElementById('btn-confirm-final');
    const availableSection = document.getElementById('available-tables-section');
    const tableList = document.getElementById('table-list');

    const bookDate = document.getElementById('book-date');
    const bookTime = document.getElementById('book-time');
    const bookGuests = document.getElementById('book-guests');

    let selectedTableId = null;
    let selectedTableName = null;
    let selectedTableNum = null;
    let selectedTableCap = null;

    function generateOrderId() {
        return "CH" + Date.now().toString(36).toUpperCase();
    }

    function validateSearchInputs() {
        const date = bookDate?.value;
        const time = bookTime?.value;
        const guests = bookGuests?.value;

        if (date && time && guests) {
            btnFind.disabled = false;
            btnFind.classList.remove('disabled');
        } else {
            btnFind.disabled = true;
            btnFind.classList.add('disabled');
        }
    }

    bookDate?.addEventListener('change', validateSearchInputs);
    bookTime?.addEventListener('change', validateSearchInputs);
    bookGuests?.addEventListener('change', validateSearchInputs);

    if (btnConfirm) btnConfirm.disabled = true;

    /**
     * TÌM BÀN TRỐNG — gọi API mới /api/tables/available?datetime=...&guests=...
     * Thay vì GET /api/tables (lấy tất cả, không lọc lịch)
     */
    btnFind?.addEventListener('click', async () => {
        if (btnFind.disabled) return;

        const currentLng = localStorage.getItem('selected_language') || 'vi';

        // Reset lựa chọn bàn cũ mỗi lần tìm lại
        selectedTableId = null;
        selectedTableName = null;
        selectedTableNum = null;
        selectedTableCap = null;
        if (btnConfirm) {
            btnConfirm.disabled = true;
            btnConfirm.classList.add('disabled');
        }

        const requestedGuests = parseInt(bookGuests.value);

        // === SỬA: Build datetime đúng format ISO để gửi lên backend ===
        const datetimeParam = `${bookDate.value}T${bookTime.value}:00`; // "2025-07-20T19:00:00"

        btnFind.innerHTML = currentLng === 'en'
            ? '<span class="loading-dots">Querying SQL...</span>'
            : '<span class="loading-dots">Đang truy vấn SQL...</span>';

        try {
            // === THAY ĐỔI CHÍNH: Gọi /api/tables/available thay vì /api/tables ===
            const url = `http://localhost:8080/api/tables/available?datetime=${encodeURIComponent(datetimeParam)}&guests=${requestedGuests}`;
            const response = await fetch(url);

            if (!response.ok) throw new Error('Kết nối thất bại');

            const availableTables = await response.json(); // Backend đã lọc sẵn — chỉ bàn trống
            tableList.innerHTML = '';

            if (availableTables.length === 0) {
                tableList.innerHTML = currentLng === 'en'
                    ? '<p style="color: #888; width: 100%; text-align: center;">Sorry, no suitable table available at this time.</p>'
                    : '<p style="color: #888; width: 100%; text-align: center;">Rất tiếc, không còn bàn trống phù hợp vào khung giờ này.</p>';
            } else {
                availableTables.forEach(table => {
                    const btn = document.createElement('button');
                    btn.type = 'button';
                    btn.className = 'table-select';

                    const tableNum = table.tableNumber || table.table_number || "N/A";
                    const cap = table.capacity || table.table_capacity || 0;
                    const id = table.tableId;  // TableEntity dùng field "tableId"

                    btn.setAttribute('data-table-num', tableNum);
                    btn.setAttribute('data-table-cap', cap);

                    btn.innerText = currentLng === 'en'
                        ? `Table ${tableNum} (Capacity: ${cap})`
                        : `Bàn ${tableNum} (Sức chứa: ${cap})`;

                    btn.onclick = () => {
                        document.querySelectorAll('.table-select').forEach(b => b.classList.remove('active'));
                        btn.classList.add('active');

                        selectedTableId = id;
                        selectedTableNum = tableNum;
                        selectedTableCap = cap;

                        const freshLng = localStorage.getItem('selected_language') || 'vi';
                        selectedTableName = freshLng === 'en'
                            ? `Table ${tableNum} (Capacity: ${cap})`
                            : `Bàn ${tableNum} (Sức chứa: ${cap})`;

                        btnConfirm.disabled = false;
                        btnConfirm.classList.remove('disabled');
                    };

                    tableList.appendChild(btn);
                });
            }

            availableSection.style.display = 'block';
            window.scrollTo({ top: availableSection.offsetTop - 100, behavior: 'smooth' });

        } catch (error) {
            console.error("Lỗi:", error);
            alert(currentLng === 'en' ? "Backend connection error." : "Lỗi kết nối Backend.");
        } finally {
            btnFind.innerText = currentLng === 'en' ? 'Find Table' : 'Tìm bàn';
        }
    });

    /**
     * XÁC NHẬN ĐẶT BÀN → chuyển sang trang thanh toán
     */
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const currentLng = localStorage.getItem('selected_language') || 'vi';
            const orderId = generateOrderId();
            const fullReservationTime = `${bookDate.value}T${bookTime.value}:00`;

            localStorage.setItem('bk_order_id', orderId);
            localStorage.setItem('bk_name', document.getElementById('cust-name').value);
            localStorage.setItem('bk_phone', document.getElementById('cust-phone').value);
            localStorage.setItem('bk_email', document.getElementById('cust-email').value);
            localStorage.setItem('bk_reservationTime', fullReservationTime);
            localStorage.setItem('bk_guests', bookGuests.value);
            localStorage.setItem('bk_table', selectedTableName);
            localStorage.setItem('bk_tableId', selectedTableId);
            localStorage.setItem('bk_table_num', selectedTableNum || "");
            localStorage.setItem('bk_table_cap', selectedTableCap || "");

            const dtObj = new Date(fullReservationTime);
            const localeStr = currentLng === 'en' ? 'en-US' : 'vi-VN';
            const datetimeDisplay = dtObj.toLocaleString(localeStr, {
                day: '2-digit', month: '2-digit', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
            });
            localStorage.setItem('bk_datetime', datetimeDisplay);

            const params = new URLSearchParams({
                name: document.getElementById('cust-name').value,
                phone: document.getElementById('cust-phone').value,
                datetime: datetimeDisplay,
                guests: bookGuests.value,
                table: selectedTableName
            });
            window.location.href = `./payment.html?${params.toString()}`;
        });
    }
});