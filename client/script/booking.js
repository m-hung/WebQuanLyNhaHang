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

    /**
     * HÀM KIỂM TRA ĐIỀU KIỆN ĐỂ BẬT NÚT TÌM BÀN
     */
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
     * XỬ LÝ LẤY DỮ LIỆU BÀN TRỐNG VÀ LỌC THEO SỐ KHÁCH
     * Dựa trên capacity: 2 người -> bàn 1,2 | 4 người -> bàn 3,4 | 6+ người -> bàn 5,6
     */
    btnFind.addEventListener('click', async () => {
        if (btnFind.disabled) return;

        const requestedGuests = parseInt(bookGuests.value); // Lấy số khách từ dropdown
        btnFind.innerHTML = '<span class="loading-dots">Đang truy vấn SQL...</span>';
        
        try {
            // Gọi API lấy danh sách bàn trống từ Backend
            const response = await fetch('http://localhost:8080/api/retaurant_tables');
            if (!response.ok) throw new Error('Kết nối thất bại');
            
            const allTables = await response.json();

            // Xóa sạch danh sách bàn hiển thị cũ
            tableList.innerHTML = '';

            // --- LOGIC LỌC BÀN THEO YÊU CẦU ---
            const filteredTables = allTables.filter(table => {
                const capacity = parseInt(table.capacity || table.Capacity || 0);
                
                if (requestedGuests <= 2) {
                    return capacity === 2; // Hiện bàn 1, 2 (sức chứa 2)
                } else if (requestedGuests <= 4) {
                    return capacity === 4; // Hiện bàn 3, 4 (sức chứa 4)
                } else {
                    return capacity >= 6;  // Hiện bàn 5, 6 (sức chứa 10)
                }
            });

            if (filteredTables.length === 0) {
                tableList.innerHTML = '<p style="color: #888; width: 100%; text-align: center;">Rất tiếc, hiện tại không có loại bàn phù hợp.</p>';
            } else {
                // Hiển thị danh sách bàn đã lọc
                filteredTables.forEach(table => {
                    const btn = document.createElement('button');
                    btn.type = 'button';
                    btn.className = 'table-select';

                    const name = table.tenBan || table.TenBan || `Bàn ${table.table_number}`;
                    const type = table.loaiBan || table.LoaiBan || `Sức chứa: ${table.capacity}`;
                    const id = table.maBan || table.MaBan || table.id;

                    btn.innerText = `${name} (${type})`;
                    
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
            console.error("Lỗi kết nối Server:", error);
            alert("Lỗi: Không thể kết nối với Backend 8080. Hãy kiểm tra CORS trong Java.");
        } finally {
            btnFind.innerHTML = 'Tìm bàn';
        }
    });

    /**
     * XỬ LÝ GỬI THÔNG TIN ĐẶT BÀN VỀ BACKEND
     */
    if (bookingForm) {
        bookingForm.addEventListener('submit', async (e) => {
            e.preventDefault(); 
            
            const formData = {
                tenKhach: document.getElementById('cust-name').value,
                sdt: document.getElementById('cust-phone').value,
                email: document.getElementById('cust-email').value,
                ngayDat: bookDate.value,
                gioDat: bookTime.value,
                soKhach: bookGuests.value,
                maBan: selectedTableId
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
                    alert("Có lỗi xảy ra khi lưu thông tin. Hãy kiểm tra log server.");
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