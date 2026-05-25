import React, { useState } from "react";

export default function Checkout({ setPage, invoice, onPaymentSuccess }) {
  // Quản lý State cho các ô input
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("Cash");

  // Lấy thời gian hiện tại gộp thẳng vào useState, không dùng useEffect nữa
  const [currentTime] = useState(() => {
    const now = new Date();
    // Format thời gian theo kiểu Việt Nam: HH:MM - DD/MM/YYYY
    return (
      now.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) +
      " - " +
      now.toLocaleDateString("vi-VN")
    );
  });

  // Điều kiện để mở khóa nút thanh toán (Phải nhập đủ tên và sđt)
  const isFormValid = customerName.trim() !== "" && customerPhone.trim() !== "";

  return (
    <div className="bg-white p-6 md:p-10 rounded shadow-md max-w-5xl mx-auto mt-4">
      <h2 className="text-xl font-bold text-blue-800 mb-6 border-b pb-4">
        Thanh toán hóa đơn
      </h2>

      {/* Thông tin chung */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
        <div>
          <h3 className="text-2xl font-medium text-gray-700 mb-2">
            Mã hóa đơn: {invoice?.id || "N/A"}
          </h3>
          <p className="text-gray-500 mb-2">
            Thời gian:{" "}
            <span className="font-medium text-gray-700">{currentTime}</span>
          </p>
          <p className="text-gray-500">
            Hóa đơn nhập bởi:{" "}
            <span className="font-medium text-gray-700">
              {invoice?.cashierName || "Thu ngân"}
            </span>
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded border border-gray-100">
          <h3 className="text-lg font-medium text-gray-700 mb-3 border-b pb-2">
            Thông tin khách hàng (Invoice to):
          </h3>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <label className="text-gray-500 w-24">Họ và tên:</label>
              <input
                type="text"
                placeholder="Nhập tên khách hàng..."
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="flex-1 border border-gray-300 rounded px-3 py-1.5 outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-gray-500 w-24">Số điện thoại:</label>
              <input
                type="tel"
                placeholder="Nhập số điện thoại..."
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="flex-1 border border-gray-300 rounded px-3 py-1.5 outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bảng sản phẩm */}
      <div className="mb-8 border rounded overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-3 font-semibold text-gray-600">Tên sản phẩm</th>
              <th className="p-3 font-semibold text-gray-600">Giá</th>
              <th className="p-3 font-semibold text-gray-600 text-center">
                Số lượng
              </th>
              <th className="p-3 font-semibold text-gray-600 text-right">
                Tổng cộng
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Render danh sách món ăn từ giỏ hàng */}
            {invoice?.cart && invoice.cart.length > 0 ? (
              invoice.cart.map((item, index) => (
                <tr
                  key={index}
                  className="border-b bg-white hover:bg-gray-50 transition"
                >
                  <td className="p-3 text-gray-700 font-medium">{item.name}</td>
                  <td className="p-3 text-gray-600">
                    {item.price?.toLocaleString()} đ
                  </td>
                  <td className="p-3 text-gray-700 text-center font-semibold">
                    {item.qty}
                  </td>
                  <td className="p-3 text-blue-600 font-bold text-right">
                    {(item.price * item.qty).toLocaleString()} đ
                  </td>
                </tr>
              ))
            ) : (
              <tr className="border-b bg-white">
                <td colSpan="4" className="p-4 text-center text-gray-400">
                  Không có món ăn nào trong hóa đơn
                </td>
              </tr>
            )}

            {/* Dòng tổng tiền */}
            <tr className="bg-blue-50">
              <td
                colSpan="3"
                className="p-4 text-right font-bold text-gray-700 border-r border-blue-100 uppercase"
              >
                Tổng tiền thanh toán:
              </td>
              <td className="p-4 font-bold text-xl text-blue-700 text-right">
                {invoice?.totalPrice?.toLocaleString() || "0"} VNĐ
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Hình thức thanh toán (ĐÃ SỬA onChange VÀ value) */}
      <div className="mb-8 bg-gray-50 p-4 rounded border border-gray-100">
        <h3 className="text-lg font-medium text-gray-700 mb-4">
          Hình thức thanh toán:
        </h3>
        <div className="flex flex-wrap items-center gap-8 text-gray-600">
          <label className="flex items-center gap-2 cursor-pointer hover:text-emerald-600 transition">
            <input
              type="radio"
              name="payment"
              value="Cash"
              checked={paymentMethod === "Cash"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="form-radio w-4 h-4 text-emerald-500 focus:ring-emerald-500"
            />
            <span className="font-medium">💵 Tiền mặt</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition">
            <input
              type="radio"
              name="payment"
              value="VNPAY"
              checked={paymentMethod === "VNPAY"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="form-radio w-4 h-4 text-blue-500 focus:ring-blue-500"
            />
            <span className="font-medium">🔵 Chuyển khoản (Ví VNPAY)</span>
          </label>
        </div>
      </div>

      {/* Nút hành động */}
      <div className="flex flex-wrap gap-4 justify-end">
        <button
          className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-2.5 rounded font-medium shadow-sm transition"
          onClick={() => setPage("main_dashboard")}
        >
          Trở lại
        </button>

        <button
          className={`px-8 py-2.5 rounded font-bold shadow-sm transition ${
            isFormValid
              ? "bg-emerald-500 hover:bg-emerald-600 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          disabled={!isFormValid}
          onClick={() => {
            // LƯU VÀO BẢNG PAYMENTS
            const now = new Date();
            const pad = (n) => String(n).padStart(2, "0");
            const localDateTime = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

            const paymentPayload = {
              order: { orderId: invoice?.id },
              amountPaid: invoice?.totalPrice,
              paymentMethod: paymentMethod,
              paymentTime: localDateTime,
              customerName: customerName,
              phone: customerPhone,
            };

            fetch("http://localhost:8080/api/payments", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(paymentPayload),
            })
              .then(() => {
                // ==========================================
                // BƯỚC 2: ĐỔI TRẠNG THÁI HÓA ĐƠN -> ĐÃ THANH TOÁN
                // ==========================================
                return fetch(
                  `http://localhost:8080/api/orders/${invoice?.id}/status`,
                  {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ status: "Paid" }),
                  },
                );
              })
              .then(() => {
                // ==========================================
                // BƯỚC 3: DỌN BÀN -> TRỐNG
                // ==========================================
                return fetch(
                  `http://localhost:8080/api/tables/${invoice?.tableId}/status`,
                  {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ status: "Available" }),
                  },
                );
              })
              .then(() => {
                // ==========================================
                // BƯỚC 4: BÁO CHO REACT ẨN HÓA ĐƠN ĐI
                // ==========================================
                if (onPaymentSuccess) {
                  onPaymentSuccess(invoice?.id);
                }
              })
              .catch((err) => {
                console.error("Lỗi khi thanh toán:", err);
                alert(
                  "Có lỗi xảy ra khi lưu thanh toán! Vui lòng kiểm tra F12.",
                );
              });
          }}
          title={
            !isFormValid ? "Vui lòng nhập Họ tên và SĐT để thanh toán" : ""
          }
        >
          Thanh toán
        </button>
      </div>
    </div>
  );
}
