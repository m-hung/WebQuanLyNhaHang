const modal = document.getElementById("loginModal");
const openBtn = document.getElementById("openLoginBtn");
const closeBtn = document.getElementById("closeModalBtn");

// Mở Modal
openBtn.addEventListener("click", function (event) {
  event.preventDefault(); // Ngăn việc bị giật trang lên đầu
  modal.style.display = "flex";
});

// Đóng Modal khi bấm X
closeBtn.addEventListener("click", function () {
  modal.style.display = "none";
});

// Đóng Modal khi bấm ra ngoài form
window.addEventListener("click", function (event) {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

// Xử lý form submit mẫu
document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    alert("Bắt đầu xử lý đăng nhập...");
  });
