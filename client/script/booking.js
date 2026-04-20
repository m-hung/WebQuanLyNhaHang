document.addEventListener('DOMContentLoaded', () => {
    // 1. KHAI BÁO CÁC PHẦN TỬ
    const bookingForm = document.getElementById('booking-form');
    const btnFind = document.getElementById('btn-find-table');
    const btnConfirm = document.getElementById('btn-confirm-final');
    const availableSection = document.getElementById('available-tables-section');
    const tableBtns = document.querySelectorAll('.table-select');
    
    // Các ô nhập liệu cần kiểm tra để mở nút "Tìm bàn"
    const bookDate = document.getElementById('book-date');
    const bookTime = document.getElementById('book-time');
    const bookGuests = document.getElementById('book-guests');

    // Các phần tử của Modal thành công
    const successModal = document.getElementById('success-modal');
    const btnCloseModal = document.getElementById('btn-close-modal');

    /**
     * HÀM KIỂM TRA ĐIỀU KIỆN NÚT TÌM BÀN
     * Nút tìm bàn chỉ hoạt động khi điền đủ: Ngày + Giờ + Số người
     */
    function validateSearchInputs() {
        const isDateFilled = bookDate.value !== "";
        const isTimeFilled = bookTime.value !== "";
        const isGuestsSelected = bookGuests.value !== "";

        if (isDateFilled && isTimeFilled && isGuestsSelected) {
            btnFind.disabled = false;
        } else {
            btnFind.disabled = true;
        }
    }

    // Lắng nghe sự kiện thay đổi trên các ô nhập liệu của thanh tìm kiếm
    bookDate.addEventListener('input', validateSearchInputs);
    bookTime.addEventListener('input', validateSearchInputs);
    bookGuests.addEventListener('change', validateSearchInputs);

    /**
     * XỬ LÝ KHI NHẤN NÚT "TÌM BÀN"
     */
    btnFind.addEventListener('click', () => {
        if (btnFind.disabled) return;

        // Hiệu ứng giả lập đang tải cho chuyên nghiệp
        btnFind.innerHTML = '<span class="loading-dots">Đang kiểm tra...</span>';
        
        setTimeout(() => {
            // Hiển thị phần danh sách bàn trống
            availableSection.style.display = 'block';
            btnFind.innerHTML = 'Tìm bàn';
            
            // Cuộn xuống phần chọn bàn một cách mượt mà
            window.scrollTo({
                top: availableSection.offsetTop - 100,
                behavior: 'smooth'
            });
        }, 800);
    });

    /**
     * XỬ LÝ KHI CHỌN MỘT BÀN CỤ THỂ
     */
    tableBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Xóa trạng thái active của các bàn khác
            tableBtns.forEach(b => b.classList.remove('active'));
            
            // Thêm trạng thái active cho bàn vừa chọn
            this.classList.add('active');

            // MỞ KHÓA NÚT XÁC NHẬN CUỐI CÙNG
            if (btnConfirm) {
                btnConfirm.disabled = false;
                btnConfirm.classList.remove('disabled'); // Xóa class mờ (nếu có)
                btnConfirm.style.boxShadow = '0 0 20px rgba(197, 160, 89, 0.4)';
            }
        });
    });

    /**
     * XỬ LÝ KHI NHẤN "XÁC NHẬN ĐẶT BÀN" (HIỆN MODAL)
     */
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Ngăn trang tải lại
            
            // Hiển thị Modal thành công thay vì alert
            if (successModal) {
                successModal.style.display = 'flex';
                // Ngăn cuộn trang khi đang hiện modal
                document.body.style.overflow = 'hidden'; 
            }
        });
    }

    /**
     * ĐÓNG MODAL VÀ QUAY VỀ TRANG CHỦ
     */
    if (btnCloseModal) {
        btnCloseModal.addEventListener('click', () => {
            // Cho phép cuộn lại
            document.body.style.overflow = 'auto'; 
            // Chuyển hướng về trang chủ
            window.location.href = "../index.html"; 
        });
    }

    // --- KHỞI TẠO TRẠNG THÁI BAN ĐẦU ---
    // Kiểm tra ngay khi load để nút luôn đúng trạng thái khóa/mở
    validateSearchInputs();
    
    // Nút xác nhận luôn khóa cho đến khi chọn bàn
    if (btnConfirm) {
        btnConfirm.disabled = true;
        btnConfirm.classList.add('disabled');
    }
});