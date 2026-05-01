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

    const successModal = document.getElementById('success-modal');
    const btnCloseModal = document.getElementById('btn-close-modal');

    let selectedTableId = null; 

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
                    
                    // Khớp biến từ Backend (thường là camelCase từ cột table_number)
                    const tableNum = table.tableNumber || table.table_number || "N/A";
                    const cap = table.capacity || table.table_capacity || 0;
                    const id = table.id || table.tableId || table.table_id;

                    btn.innerText = `Bàn ${tableNum} (Sức chứa: ${cap})`;
    
                    btn.onclick = () => {
                        document.querySelectorAll('.table-select').forEach(b => b.classList.remove('active'));
                        btn.classList.add('active');
                        selectedTableId = id; 
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
     * XỬ LÝ GỬI THÔNG TIN ĐẶT BÀN (ĐÃ SỬA BIẾN KHỚP VỚI DATABASE)
     */
    if (bookingForm) {
        bookingForm.addEventListener('submit', async (e) => {
            e.preventDefault(); 
            
            // KẾT HỢP NGÀY VÀ GIỜ THÀNH ĐỊNH DẠNG DATETIME CHO MYSQL
            const fullReservationTime = `${bookDate.value}T${bookTime.value}:00`;

            const formData = {
                customerName: document.getElementById('cust-name').value, // Khớp customer_name
                phone: document.getElementById('cust-phone').value,        // Khớp phone
                email: document.getElementById('cust-email').value,        // Khớp email
                reservationTime: fullReservationTime,                      // Khớp reservation_time[cite: 2]
                guestCount: parseInt(bookGuests.value),                    // Khớp guest_count[cite: 2]
                table: { 
                    tableId: selectedTableId // Phải là tableId khớp với TableEntity.java
                }              
            };

            try {
                const response = await fetch('http://localhost:8080/api/reservations', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    successModal.style.display = 'flex';
                    document.body.style.overflow = 'hidden'; 
                } else {
                    const errorData = await response.json();
                    alert("Lỗi server: " + (errorData.message || "Không thể lưu đặt chỗ."));
                }
            } catch (error) {
                alert("Không thể kết nối tới server để gửi thông tin.");
            }
        });
    }

    if (btnCloseModal) {
        btnCloseModal.addEventListener('click', () => {
            document.body.style.overflow = 'auto'; 
            window.location.href = "../index.html"; 
        });
    }

    validateSearchInputs();
    if (btnConfirm) btnConfirm.disabled = true; 
});