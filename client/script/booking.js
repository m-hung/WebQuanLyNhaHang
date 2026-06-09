document.addEventListener("DOMContentLoaded", () => {
  // === CÁC BIẾN CỦA BẠN ===
  const bookingForm = document.getElementById("booking-form");
  const btnFind = document.getElementById("btn-find-table");
  const btnConfirm = document.getElementById("btn-confirm-final");
  const availableSection = document.getElementById("available-tables-section");
  const tableList = document.getElementById("table-list");

  const bookDate = document.getElementById("book-date");

  let datePicker = null;

  function initDatePicker(lang = "vi") {
    if (datePicker) {
      datePicker.destroy();
    }

    datePicker = flatpickr(bookDate, {
      dateFormat: "Y-m-d",
      minDate: "today",
      locale: lang === "en" ? "default" : "vn",
    });
  }

  window.initDatePicker = initDatePicker;

  const bookTime = document.getElementById("book-time");
  const bookGuests = document.getElementById("book-guests");

  const custName = document.getElementById("cust-name");
  const custPhone = document.getElementById("cust-phone");
  const custEmail = document.getElementById("cust-email");

  let selectedTableId = null;
  let selectedTableName = null;
  let selectedTableNum = null;
  let selectedTableCap = null;

  // === 1. RÀNG BUỘC NGÀY GIỜ (CHẶN QUÁ KHỨ) ===
  const today = new Date().toISOString().split("T")[0];
  bookDate.setAttribute("min", today); // Chặn chọn ngày cũ trên lịch

  const currentLang = localStorage.getItem("selected_language") || "vi";
  initDatePicker(currentLang);

  const checkTimeValidity = () => {
    const now = new Date();
    if (bookDate.value && bookTime.value) {
      const selectedDateTime = new Date(
        `${bookDate.value}T${bookTime.value}:00`,
      );
      if (selectedDateTime < now) {
        alert("Bạn không thể chọn thời gian trong quá khứ!");
        bookTime.value = "";
      }
    }
  };

  bookDate.addEventListener("change", checkTimeValidity);
  bookTime.addEventListener("change", checkTimeValidity);

  // === 2. RÀNG BUỘC NHẬP LIỆU (CHẶN NGAY KHI GÕ) ===

  // Tên: Không số, không ký tự đặc biệt
  custName.addEventListener("input", (e) => {
    const regex = /[0-9!@#$%^&*()_+=\[\]{};':"\\|,.<>\/?`~]/g;
    e.target.value = e.target.value.replace(regex, "");
  });

  // SĐT: Chỉ số và dấu +, dài 8-15
  custPhone.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/(?!^\+)[^\d]/g, "");
    if (e.target.value.length > 15)
      e.target.value = e.target.value.slice(0, 15);
  });

  // Email: Kiểm tra đuôi @gmail.com khi rời ô nhập
  custEmail.addEventListener("blur", (e) => {
    const val = e.target.value.trim();
    if (val !== "" && !val.toLowerCase().endsWith("@gmail.com")) {
      alert("Email bắt buộc phải có đuôi @gmail.com");
      e.target.value = "";
    }
  });
  custEmail.addEventListener("change", (e) => {
  const val = e.target.value.trim();
  if (val) localStorage.setItem("bk_email", val);
});

  // === 3. LOGIC XỬ LÝ GỐC CỦA BẠN ===

  function generateOrderId() {
    return "CH" + Date.now().toString(36).toUpperCase();
  }

  function validateSearchInputs() {
    if (bookDate?.value && bookTime?.value && bookGuests?.value) {
      btnFind.disabled = false;
      btnFind.classList.remove("disabled");
    } else {
      btnFind.disabled = true;
      btnFind.classList.add("disabled");
    }
  }

  [bookDate, bookTime, bookGuests].forEach((el) =>
    el?.addEventListener("change", validateSearchInputs),
  );

  if (btnConfirm) btnConfirm.disabled = true;

  btnFind?.addEventListener("click", async () => {
    if (btnFind.disabled) return;

    // Kiểm tra độ dài SĐT trước khi truy vấn
    if (custPhone.value.length < 8) {
      alert("Số điện thoại phải từ 8 đến 15 số.");
      return;
    }

    const currentLng = localStorage.getItem("selected_language") || "vi";
    selectedTableId = null;
    if (btnConfirm) btnConfirm.disabled = true;

    const requestedGuests = parseInt(bookGuests.value);
    const datetimeParam = `${bookDate.value}T${bookTime.value}:00`;

    btnFind.innerHTML =
      currentLng === "en" ? "Querying..." : "Đang truy vấn SQL...";

    try {
      const url = `http://localhost:8080/api/tables/available?datetime=${encodeURIComponent(datetimeParam)}&guests=${requestedGuests}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Kết nối thất bại");

      const availableTables = await response.json();
      tableList.innerHTML = "";

      if (availableTables.length === 0) {
        tableList.innerHTML = `<p style="width: 100%; text-align: center; color: #888;">${currentLng === "en" ? "No table available." : "Không còn bàn trống."}</p>`;
      } else {
        availableTables.forEach((table) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "table-select";
          const tableNum = table.tableNumber || table.table_number || "N/A";
          const cap = table.capacity || table.table_capacity || 0;

          btn.innerText =
            currentLng === "en"
              ? `Table ${tableNum} (Cap: ${cap})`
              : `Bàn ${tableNum} (Sức chứa: ${cap})`;

          btn.onclick = () => {
            document
              .querySelectorAll(".table-select")
              .forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
            selectedTableId = table.tableId;
            selectedTableNum = tableNum;
            selectedTableCap = cap;
            selectedTableName = btn.innerText;
            btnConfirm.disabled = false;
            btnConfirm.classList.remove("disabled");
          };
          tableList.appendChild(btn);
        });
      }
      availableSection.style.display = "block";
      window.scrollTo({
        top: availableSection.offsetTop - 100,
        behavior: "smooth",
      });
    } catch (error) {
      alert("Lỗi kết nối Backend.");
    } finally {
      btnFind.innerText = currentLng === "en" ? "Find Table" : "Tìm bàn";
    }
  });

  if (bookingForm) {
    bookingForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const currentLng = localStorage.getItem("selected_language") || "vi";
      const orderId = generateOrderId();
      const fullReservationTime = `${bookDate.value}T${bookTime.value}:00`;

      // Lưu dữ liệu vào LocalStorage để sang trang payment
      localStorage.setItem("bk_order_id", orderId);
      localStorage.setItem("bk_name", custName.value);
      localStorage.setItem("bk_phone", custPhone.value);
      localStorage.setItem("bk_email", custEmail.value);
      localStorage.setItem("bk_reservationTime", fullReservationTime);
      localStorage.setItem("bk_guests", bookGuests.value);
      localStorage.setItem("bk_table", selectedTableName);
      localStorage.setItem("bk_tableId", selectedTableId);
      localStorage.setItem("bk_table_num", selectedTableNum || "");
      localStorage.setItem("bk_table_cap", selectedTableCap || "");

      // SessionStorage: backup de tranh Tracking Prevention chan localStorage
      sessionStorage.setItem("bk_email", custEmail.value);
      sessionStorage.setItem("bk_name", custName.value);

      const dtObj = new Date(fullReservationTime);
      const localeStr = currentLng === "en" ? "en-US" : "vi-VN";
      const datetimeDisplay = dtObj.toLocaleString(localeStr, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      localStorage.setItem("bk_datetime", datetimeDisplay);

      const params = new URLSearchParams({
        name: custName.value,
        phone: custPhone.value,
        email: custEmail.value,
        datetime: datetimeDisplay,
        guests: bookGuests.value,
        table: selectedTableName,
        tableNum: selectedTableNum || "",
        tableCap: selectedTableCap || "",
        orderId: orderId,
      });
      window.location.href = `./payment.html?${params.toString()}`;
    });
  }
});