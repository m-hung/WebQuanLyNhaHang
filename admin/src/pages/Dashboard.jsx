import React from "react";
import { Plus } from "lucide-react"; // Import icon dấu cộng

export default function DashBoard({
  invoices = [],
  onEditInvoice,
  onCreateNew,
  onCheckout,
  onRefresh, // Thêm prop này (nếu có) để gọi cha load lại data sau khi hủy
}) {
  // =========================================================
  // HÀM XỬ LÝ HỦY ĐƠN & DỌN TRỐNG BÀN
  // =========================================================
  const handleCancelOrder = (invoice) => {
    // 1. Hỏi xác nhận tránh bấm nhầm
    if (
      !window.confirm(
        `Bạn có chắc chắn muốn HỦY đơn của ${invoice.tableName} không?`,
      )
    ) {
      return;
    }

    // 2. Bắn API cập nhật trạng thái Hóa đơn -> "Đã hủy"
    fetch(`http://localhost:8080/api/orders/${invoice.id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "Cancelled" }),
    })
      .then(() => {
        // 3. Bắn API cập nhật trạng thái Bàn -> "Trống"
        return fetch(
          `http://localhost:8080/api/tables/${invoice.tableId}/status`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "Available" }),
          },
        );
      })
      .then(() => {
        // 4. Cập nhật lại giao diện để xóa thẻ bàn này đi
        if (onRefresh) {
          onRefresh(); // Nếu component cha có truyền hàm load lại dữ liệu
        } else {
          window.location.reload(); // Chữa cháy: F5 load lại trang luôn cho lẹ
        }
      })
      .catch((err) => {
        console.error("Lỗi khi hủy đơn:", err);
        alert("Có lỗi xảy ra khi hủy đơn! Vui lòng kiểm tra console.");
      });
  };

  return (
    <div className="p-6">
      <div className="flex flex-wrap gap-4">
        {/* Ô 1: Thêm hóa đơn mới (Luôn hiển thị) */}
        <div
          className="w-72 h-36 bg-teal-100 border-2 border-teal-200 flex flex-col items-center justify-center cursor-pointer hover:bg-teal-200 transition-colors rounded"
          onClick={onCreateNew}
        >
          <Plus
            size={60}
            className="text-gray-500 font-bold mb-2"
            strokeWidth={3}
          />
          <span className="text-gray-500 font-medium text-lg">
            Thêm hóa đơn mới
          </span>
        </div>

        {/* Ô 2, 3...: Vòng lặp hiển thị các hóa đơn đã lưu */}
        {invoices.map((invoice) => (
          <div
            key={invoice.id}
            className="w-72 h-36 bg-teal-100 border-2 border-teal-200 relative flex flex-col justify-center p-4 rounded"
          >
            {/* ĐÃ SỬA CHỖ NÀY: Thay <span> bằng <button> Hủy */}
            <button
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded cursor-pointer shadow-sm transition"
              onClick={() => handleCancelOrder(invoice)}
            >
              Hủy
            </button>

            {/* Thông tin hóa đơn */}
            <div className="text-center mt-2">
              <p className="text-gray-500 font-medium text-base flex items-center justify-center gap-2">
                HD: Bàn {invoice.tableName}
                <button
                  className="bg-gray-600 text-white text-xs px-2 py-1 rounded hover:bg-gray-700"
                  onClick={() => onEditInvoice(invoice)}
                >
                  Đổi bàn
                </button>
              </p>
              <p className="text-gray-500 text-base mt-2">
                Tổng tiền: {invoice.totalPrice.toLocaleString()} VNĐ
              </p>
            </div>

            {/* Hai nút chức năng */}
            <div className="flex gap-3 mt-4">
              <button
                className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm py-2 rounded font-medium transition"
                onClick={() => onEditInvoice(invoice)}
              >
                Thêm món
              </button>
              <button
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white text-sm py-2 rounded font-medium transition"
                onClick={() => onCheckout(invoice)}
              >
                Thanh toán
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
