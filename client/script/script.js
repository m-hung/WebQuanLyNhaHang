const modal = document.getElementById("loginModal");
const openBtn = document.getElementById("openLoginBtn");
const closeBtn = document.getElementById("closeModalBtn");

// Chỉ chạy nếu các element tồn tại trên trang này
if (modal && openBtn && closeBtn) {
  openBtn.addEventListener("click", function (event) {
    event.preventDefault();
    modal.style.display = "flex";
  });

  closeBtn.addEventListener("click", function () {
    modal.style.display = "none";
  });

  window.addEventListener("click", function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
}

// Form login cũng wrap lại
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    alert("Bắt đầu xử lý đăng nhập...");
  });
}