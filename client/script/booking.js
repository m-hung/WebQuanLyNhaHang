document.addEventListener('DOMContentLoaded', () => {
    // 1. KHAI BÁO CÁC BIẾN VÀ PHẦN TỬ TRÊN GIAO DIỆN
    const bookingForm = document.getElementById('booking-form');
    const btnFind = document.getElementById('btn-find-table');
    const btnConfirm = document.getElementById('btn-confirm-final');
    const availableSection = document.getElementById('available-tables-section');
    const tableList = document.getElementById('table-list'); // Container chứa danh sách bàn
    
    // Các ô nhập liệu để kiểm tra điều kiện nút Tìm bàn
    const bookDate = document.getElementById('book-date');
    const bookTime = document.getElementById('book-time');
    const bookGuests = document.getElementById('book-guests');

    // Các phần tử của Modal thành công
    const successModal = document.getElementById('success-modal');
    const btnCloseModal = document.getElementById('btn-close-modal');

    let selectedTableId = null; // Lưu ID bàn mà khách đã chọn từ database

    /**
     * HÀM KIỂM TRA ĐIỀU KIỆN ĐỂ BẬT NÚT TÌM BÀN
     * Nút chỉ sáng lên khi điền đủ: Ngày + Giờ + Số người
     */
    function validateSearchInputs() {
        const isDateFilled = bookDate.value !== "";
        const isTimeFilled = bookTime.value !== "";
        const isGuestsSelected = bookGuests.value !== "";

        // Thuộc tính disabled sẽ ngăn chặn hành động click nếu chưa đủ thông tin
        btnFind.disabled = !(isDateFilled && isTimeFilled && isGuestsSelected);
    }

    // Lắng nghe sự kiện thay đổi trên các ô nhập liệu
    bookDate.addEventListener('input', validateSearchInputs);
    bookTime.addEventListener('input', validateSearchInputs);
    bookGuests.addEventListener('change', validateSearchInputs);

    /**
     * XỬ LÝ LẤY DỮ LIỆU BÀN TRỐNG TỪ BACKEND (SPRING BOOT CỔNG 8080)
     */
    btnFind.addEventListener('click', async () => {
        if (btnFind.disabled) return;

        btnFind.innerHTML = '<span class="loading-dots">Đang truy vấn SQL...</span>';
        
        try {
            // Gọi API lấy danh sách bàn trống
            const response = await fetch('http://localhost:8080/api/tables');
            if (!response.ok) throw new Error('Kết nối thất bại');
            
            const tables = await response.json();

            // XÓA SẠCH DỮ LIỆU BÀN MẪU CŨ TRONG HTML
            tableList.innerHTML = '';

            if (tables.length === 0) {
                tableList.innerHTML = '<p style="color: #888; width: 100%;">Rất tiếc, hiện tại không còn bàn nào trống.</p>';
            } else {
                // ĐỔ DỮ LIỆU THỰC TẾ TỪ SQL VÀO GIAO DIỆN
                tables.forEach(table => {
                    const btn = document.createElement('button');
                    btn.type = 'button';
                    btn.className = 'table-select';

                    // LƯU Ý: Khớp tên trường từ Java (thường tự đổi chữ đầu thành chữ thường)
                    const name = table.tenBan || table.TenBan || `Bàn ${table.table_number}`;
                    const type = table.loaiBan || table.LoaiBan || table.capacity;
                    const id = table.maBan || table.MaBan || table.id;

                    btn.innerText = `${name} (${type})`;
                    
                    btn.onclick = () => {
                        // Xử lý hiệu ứng chọn bàn
                        document.querySelectorAll('.table-select').forEach(b => b.classList.remove('active'));
                        btn.classList.add('active');
                        selectedTableId = id; // Lưu ID để gửi form xác nhận
                        
                        // Mở khóa nút xác nhận đặt bàn
                        btnConfirm.disabled = false;
                        btnConfirm.classList.remove('disabled');
                        btnConfirm.style.boxShadow = '0 0 20px rgba(197, 160, 89, 0.4)';
                    };
                    tableList.appendChild(btn);
                });
            }

            // Hiển thị khu vực chọn bàn và cuộn trang xuống nhẹ nhàng
            availableSection.style.display = 'block';
            window.scrollTo({
                top: availableSection.offsetTop - 100,
                behavior: 'smooth'
            });

        } catch (error) {
            console.error("Lỗi kết nối Server Docker:", error);
            alert("Lỗi: Không thể lấy dữ liệu từ Backend 8080. Hãy kiểm tra @CrossOrigin trong Java.");
        } finally {
            btnFind.innerHTML = 'Tìm bàn';
        }
    });

    /**
     * XỬ LÝ GỬI THÔNG TIN ĐẶT BÀN VỀ BACKEND
     */
    if (bookingForm) {
        bookingForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Ngăn trình duyệt tải lại trang
            
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
                const response = await fetch('http://localhost:8080/api/bookings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    // Hiển thị Modal thông báo đặt bàn thành công
                    successModal.style.display = 'flex';
                    document.body.style.overflow = 'hidden'; // Khóa cuộn trang
                } else {
                    alert("Có lỗi xảy ra khi gửi yêu cầu. Vui lòng kiểm tra lại dữ liệu.");
                }
            } catch (error) {
                alert("Không thể kết nối tới server để gửi thông tin.");
            }
        });
    }

    /**
     * ĐÓNG MODAL VÀ QUAY VỀ TRANG CHỦ
     */
    if (btnCloseModal) {
        btnCloseModal.addEventListener('click', () => {
            document.body.style.overflow = 'auto'; // Mở lại cuộn trang
            window.location.href = "../index.html"; 
        });
    }

    // KHỞI TẠO TRẠNG THÁI BAN ĐẦU
    validateSearchInputs();
    if (btnConfirm) btnConfirm.disabled = true; // Mặc định khóa nút xác nhận
});