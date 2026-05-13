document.addEventListener('DOMContentLoaded', () => {


    const bookingForm = document.getElementById('booking-form');

    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault(); 
            
            const orderId = generateOrderId();
            const fullReservationTime = `${bookDate.value}T${bookTime.value}:00`;

            // Thu thập dữ liệu
            const name = document.getElementById('cust-name').value;
            const phone = document.getElementById('cust-phone').value;
            const email = document.getElementById('cust-email').value;
            const guests = parseInt(bookGuests.value);
            const table = selectedTableName || `Bàn #${selectedTableId}`;

            // 1. LƯU TẤT CẢ VÀO LOCALSTORAGE (Không gọi API /reservations ở đây)
            localStorage.setItem('bk_order_id', orderId);
            localStorage.setItem('bk_name', name);
            localStorage.setItem('bk_phone', phone);
            localStorage.setItem('bk_email', email);
            localStorage.setItem('bk_reservationTime', fullReservationTime); // Format ISO cho backend
            localStorage.setItem('bk_guests', guests);
            localStorage.setItem('bk_table', table);
            localStorage.setItem('bk_tableId', selectedTableId);

            // Format ngày giờ hiển thị thân thiện cho trang tiếp theo
            const dtObj = new Date(fullReservationTime);
            const datetimeDisplay = dtObj.toLocaleString('vi-VN', {
                day: '2-digit', month: '2-digit', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
            });
            localStorage.setItem('bk_datetime', datetimeDisplay);

            // 2. CHUYỂN HƯỚNG SANG TRANG THANH TOÁN
            const params = new URLSearchParams({
                name, phone, datetime: datetimeDisplay, guests, table
            });
            window.location.href = `./payment.html?${params.toString()}`;
        });
    }
});
    const btnFind = document.getElementById('btn-find-table');
    const btnConfirm = document.getElementById('btn-confirm-final');
    const availableSection = document.getElementById('available-tables-section');
    const tableList = document.getElementById('table-list'); 
    
    const bookDate = document.getElementById('book-date');
    const bookTime = document.getElementById('book-time');
    const bookGuests = document.getElementById('book-guests');

    let selectedTableId = null;
    let selectedTableName = null; // Lưu tên bàn để hiển thị trên trang thanh toán

    function generateOrderId() {
        return "CH" + Date.now().toString(36).toUpperCase();
    }
    
    function validateSearchInputs() {
        const isDateFilled = bookDate.value !== "";
        const isTimeFilled = bookTime.value !== "";
        const isGuestsSelected = bookGuests.value !== "";
        btnFind.disabled = !(isDateFilled && isTimeFilled && isGuestsSelected);
    }

    bookDate.addEventListener('input', validateSearchInputs);
    bookTime.addEventListener('input', validateSearchInputs);
    bookGuests.addEventListener('change', validateSearchInputs);

    /**
     * XỬ LÝ LẤY DỮ LIỆU BÀN TRỐNG
     */
    btnFind.addEventListener('click', async () => {
        if (btnFind.disabled) return;

        const requestedGuests = parseInt(bookGuests.value);
        btnFind.innerHTML = '<span class="loading-dots">Đang truy vấn SQL...</span>';
        
        try {
            const response = await fetch('http://localhost:8080/api/tables');
            if (!response.ok) throw new Error('Kết nối thất bại');
            
            const allTables = await response.json();
            tableList.innerHTML = '';

            const filteredTables = allTables.filter(table => {
                const capacity = parseInt(table.capacity || table.table_capacity || 0);
                if (requestedGuests <= 2) return capacity === 2;
                if (requestedGuests <= 4) return capacity === 4;
                return capacity >= 6;
            });

            if (filteredTables.length === 0) {
                tableList.innerHTML = '<p style="color: #888; width: 100%; text-align: center;">Rất tiếc, hiện tại không có loại bàn phù hợp.</p>';
            } else {
                filteredTables.forEach(table => {
                    const btn = document.createElement('button');
                    btn.type = 'button';
                    btn.className = 'table-select';
                    
                    const tableNum = table.tableNumber || table.table_number || "N/A";
                    const cap = table.capacity || table.table_capacity || 0;
                    const id = table.id || table.tableId || table.table_id;
                    const displayName = `Bàn ${tableNum} (Sức chứa: ${cap})`;

                    btn.innerText = displayName;
    
                    btn.onclick = () => {
                        document.querySelectorAll('.table-select').forEach(b => b.classList.remove('active'));
                        btn.classList.add('active');
                        selectedTableId = id;
                        selectedTableName = displayName;
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
            alert("Lỗi kết nối Backend.");
        } finally {
            btnFind.innerHTML = 'Tìm bàn';
        }
    });

    /**
     * XỬ LÝ GỬI THÔNG TIN ĐẶT BÀN → CHUYỂN SANG TRANG THANH TOÁN
     */
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault(); 
            
            const orderId = generateOrderId(); // Bạn đã có hàm này ở trên
            const fullReservationTime = `${bookDate.value}T${bookTime.value}:00`;

            // 1. Lưu tất cả thông tin vào localStorage để payment.js sử dụng
            localStorage.setItem('bk_order_id', orderId);
            localStorage.setItem('bk_name', document.getElementById('cust-name').value);
            localStorage.setItem('bk_phone', document.getElementById('cust-phone').value);
            localStorage.setItem('bk_email', document.getElementById('cust-email').value);
            localStorage.setItem('bk_reservationTime', fullReservationTime); // Cực kỳ quan trọng để backend parse
            localStorage.setItem('bk_guests', bookGuests.value);
            localStorage.setItem('bk_table', selectedTableName);
            localStorage.setItem('bk_tableId', selectedTableId);

            // Format hiển thị cho trang tóm tắt
            const dtObj = new Date(fullReservationTime);
            const datetimeDisplay = dtObj.toLocaleString('vi-VN');
            localStorage.setItem('bk_datetime', datetimeDisplay);

            // 2. Chuyển hướng thẳng sang payment.html, KHÔNG gọi fetch('/api/reservations')
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

    validateSearchInputs();
    if (btnConfirm) btnConfirm.disabled = true; 

