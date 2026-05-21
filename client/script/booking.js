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
    let selectedTableNum = null; // <-- THÊM DÒNG NÀY
    let selectedTableCap = null; // <-- THÊM DÒNG NÀY

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
     * XỬ LÝ LẤY DỮ LIỆU BÀN TRỐNG (Đã tích hợp đa ngôn ngữ)
     */
    btnFind.addEventListener('click', async () => {
        if (btnFind.disabled) return;

        // Lấy ngôn ngữ hiện tại từ localStorage (mặc định là 'vi' nếu chưa lưu)
        const currentLng = localStorage.getItem('selected_language') || 'vi';

        const requestedGuests = parseInt(bookGuests.value);
        
        // Hiển thị trạng thái loading theo ngôn ngữ
        btnFind.innerHTML = currentLng === 'en' 
            ? '<span class="loading-dots">Querying SQL...</span>' 
            : '<span class="loading-dots">Đang truy vấn SQL...</span>';
        
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
                tableList.innerHTML = currentLng === 'en'
                    ? '<p style="color: #888; width: 100%; text-align: center;">Sorry, no suitable table available at the moment.</p>'
                    : '<p style="color: #888; width: 100%; text-align: center;">Rất tiếc, hiện tại không có loại bàn phù hợp.</p>';
            } else {
                filteredTables.forEach(table => {
                    const btn = document.createElement('button');
                    btn.type = 'button';
                    btn.className = 'table-select';
                    
                    const tableNum = table.tableNumber || table.table_number || "N/A";
                    const cap = table.capacity || table.table_capacity || 0;
                    const id = table.id || table.tableId || table.table_id;
                    
                    // --- THAY THẾ VÀ BỔ SUNG TỪ ĐÂY ---
                    // Lưu cấu trúc dữ liệu thô vào các thuộc tính data- để dùng cho việc dịch động sau này
                    btn.setAttribute('data-table-num', tableNum);
                    btn.setAttribute('data-table-cap', cap);
                    
                    // Gọi hàm định dạng chữ hiển thị dựa theo ngôn ngữ hiện tại
                    btn.innerText = currentLng === 'en'
                        ? `Table ${tableNum} (Capacity: ${cap})`
                        : `Bàn ${tableNum} (Sức chứa: ${cap})`;
                    // ----------------------------------
    
                    btn.onclick = () => {
                        document.querySelectorAll('.table-select').forEach(b => b.classList.remove('active'));
                        btn.classList.add('active');
                        selectedTableId = id; //

                        // Lưu lại dữ liệu số thô để sử dụng đa ngôn ngữ
                        selectedTableNum = tableNum;
                        selectedTableCap = cap;

                        const freshLng = localStorage.getItem('selected_language') || 'vi';
                        selectedTableName = freshLng === 'en' ? `Table ${tableNum} (Capacity: ${cap})` : `Bàn ${tableNum} (Sức chứa: ${cap})`;

                        btnConfirm.disabled = false; //
                        btnConfirm.classList.remove('disabled'); //
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
            // Trả lại text cho nút Tìm bàn đúng theo ngôn ngữ sau khi tải xong
            btnFind.innerText = currentLng === 'en' ? 'Find Table' : 'Tìm bàn';
        }
    });

    /**
     * XỬ LÝ GỬI THÔNG TIN ĐẶT BÀN → CHUYỂN SANG TRANG THANH TOÁN (Đã đồng bộ chuẩn hóa)
     */
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault(); 
            
            const currentLng = localStorage.getItem('selected_language') || 'vi';
            const orderId = generateOrderId(); 
            const fullReservationTime = `${bookDate.value}T${bookTime.value}:00`;

            // 1. Lưu tất cả thông tin (Bao gồm cả dữ liệu thô phục vụ dịch thuật động) vào localStorage
            localStorage.setItem('bk_order_id', orderId);
            localStorage.setItem('bk_name', document.getElementById('cust-name').value);
            localStorage.setItem('bk_phone', document.getElementById('cust-phone').value);
            localStorage.setItem('bk_email', document.getElementById('cust-email').value);
            localStorage.setItem('bk_reservationTime', fullReservationTime); 
            localStorage.setItem('bk_guests', bookGuests.value);
            localStorage.setItem('bk_table', selectedTableName);
            localStorage.setItem('bk_tableId', selectedTableId);

            // Lưu trữ dữ liệu thô của bàn để trang payment.html tự dịch động khi bấm nút chuyển đổi ngôn ngữ
            localStorage.setItem('bk_table_num', selectedTableNum || "");
            localStorage.setItem('bk_table_cap', selectedTableCap || "");

            // 2. Định dạng ngày giờ hiển thị theo ngôn ngữ hiện tại của trang đặt bàn
            const dtObj = new Date(fullReservationTime);
            const localeStr = currentLng === 'en' ? 'en-US' : 'vi-VN';
            const datetimeDisplay = dtObj.toLocaleString(localeStr, {
                day: '2-digit', month: '2-digit', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
            });
            localStorage.setItem('bk_datetime', datetimeDisplay);

            // 3. Chuyển hướng thẳng sang payment.html kèm các tham số URL mã hóa sạch sẽ
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

    /**
     * KIỂM TRA ĐIỀU KIỆN ĐỂ MỞ KHÓA NÚT TÌM BÀN
     */
    function validateSearchInputs() {
        const date = document.getElementById('book-date')?.value;
        const time = document.getElementById('book-time')?.value;
        // FIX LỖI 1: Đổi từ 'guests' thành 'book-guests' cho đúng với ID trong HTML
        const guests = document.getElementById('book-guests')?.value; 

        // Nếu cả 3 trường đều đã được chọn/nhập giá trị
        if (date && time && guests) {
            // FIX LỖI 2: Mở khóa nút Tìm bàn (disabled = false)
            btnFind.disabled = false;
            btnFind.classList.remove('disabled');
        } else {
            // Khóa nút Tìm bàn nếu thiếu thông tin
            btnFind.disabled = true;
            btnFind.classList.add('disabled');
        }
    }

    // Lắng nghe sự kiện thay đổi để tự động mở khóa nút Tìm bàn
    document.getElementById('book-date')?.addEventListener('change', validateSearchInputs);
    document.getElementById('book-time')?.addEventListener('change', validateSearchInputs);
    document.getElementById('book-guests')?.addEventListener('change', validateSearchInputs);
    if (btnConfirm) btnConfirm.disabled = true; 

