document.addEventListener('DOMContentLoaded', () => {
    // 1. KHAI BÁO CÁC BIẾN VÀ PHẦN TỬ TRÊN GIAO DIỆN
    const bookingForm = document.getElementById('booking-form');
    const btnFind = document.getElementById('btn-find-table');
    const btnConfirm = document.getElementById('btn-confirm-final');
    const availableSection = document.getElementById('available-tables-section');
    const tableList = document.getElementById('table-list'); 
    
    const bookDate = document.getElementById('book-date');
    const bookTime = document.getElementById('book-time');
    const bookGuests = document.getElementById('book-guests');

    let selectedTableId = null;
    let selectedTableName = null; // Lưu tên bàn để hiển thị trên trang thanh toán

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
        bookingForm.addEventListener('submit', async (e) => {
            e.preventDefault(); 
            
            const fullReservationTime = `${bookDate.value}T${bookTime.value}:00`;

            const formData = {
                customerName: document.getElementById('cust-name').value,
                phone: document.getElementById('cust-phone').value,
                email: document.getElementById('cust-email').value,
                reservationTime: fullReservationTime,
                guestCount: parseInt(bookGuests.value),
                table: { 
                    tableId: selectedTableId
                }              
            };

            try {
                const response = await fetch('http://localhost:8080/api/reservations', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    // ============================================
                    // CHUYỂN HƯỚNG SANG TRANG THANH TOÁN
                    // Truyền thông tin qua URL params + localStorage
                    // ============================================
                    const name     = formData.customerName;
                    const phone    = formData.phone;
                    const guests   = formData.guestCount;
                    const table    = selectedTableName || `Bàn #${selectedTableId}`;

                    // Format ngày giờ hiển thị thân thiện
                    const dtObj    = new Date(fullReservationTime);
                    const datetime = dtObj.toLocaleString('vi-VN', {
                        day: '2-digit', month: '2-digit', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                    });

                    // Lưu vào localStorage làm backup
                    localStorage.setItem('bk_name',     name);
                    localStorage.setItem('bk_phone',    phone);
                    localStorage.setItem('bk_datetime', datetime);
                    localStorage.setItem('bk_guests',   guests);
                    localStorage.setItem('bk_table',    table);

                    // Redirect sang trang thanh toán kèm query params
                    const params = new URLSearchParams({
                        name, phone, datetime, guests, table
                    });
                    window.location.href = `./payment.html?${params.toString()}`;

                } else {
                    const errorData = await response.json();
                    alert("Lỗi server: " + (errorData.message || "Không thể lưu đặt chỗ."));
                }
            } catch (error) {
                alert("Không thể kết nối tới server để gửi thông tin.");
            }
        });
    }

    validateSearchInputs();
    if (btnConfirm) btnConfirm.disabled = true; 
});
