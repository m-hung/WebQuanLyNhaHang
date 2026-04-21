import React from "react";
import { Plus } from "lucide-react"; // Import icon dấu cộng

export default function Dashboard({
  setPage,
  invoices = [],
  onEditInvoice,
  onCreateNew,
  onCheckout,
}) {
  return (
    <div className="p-6">
      {/* flex-wrap giúp các ô tự động xuống dòng nếu màn hình hẹp, gap-4 tạo khoảng cách */}
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
            {/* Nhãn Hoàn tất ở góc phải trên */}
            <span className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded">
              Hoàn tất
            </span>

            {/* Thông tin hóa đơn */}
            <div className="text-center mt-2">
              <p className="text-gray-500 font-medium text-base flex items-center justify-center gap-2">
                HD: {invoice.tableName}
                <button
                  className="bg-gray-600 text-white text-xs px-2 py-1 rounded hover:bg-gray-700"
                  onClick={() => onEditInvoice(invoice)}
                >
                  Đổi bàn
                </button>
              </p>
              <p className="text-gray-500 text-base mt-2">
                Tổng tiền:{invoice.totalPrice} VNĐ
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
