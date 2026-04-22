import React, { useState } from "react";
import { Search } from "lucide-react";

export default function Pos({ setPage, onSaveInvoice, editingInvoice }) {
  const cashiers = [
    "Nguyễn Thanh Huy",
    "Nguyễn Thành Huy",
    "Bùi Hữu Hùng",
    "Trần Minh Huấn",
  ];
  const tables = Array.from({ length: 10 }, (_, i) => `Bàn ${i + 1}`);
  const [selectedTable, setSelectedTable] = useState(
    editingInvoice ? editingInvoice.tableName : tables[0],
  );
  const [totalPrice, setTotalPrice] = useState(
    editingInvoice ? editingInvoice.totalPrice : 0,
  );
  return (
    <div className="bg-white p-4 min-h-full rounded-lg shadow">
      <h2 className="text-xl font-bold text-blue-800 mb-4">
        {editingInvoice ? "Cập nhật Hóa Đơn" : "Pos"}
      </h2>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* === CỘT TRÁI: DANH SÁCH MÓN ĂN === */}
        <div className="lg:w-2/3">
          {/* Thanh lọc & Tìm kiếm */}
          <div className="flex flex-wrap items-center justify-between mb-6 gap-2">
            <div className="flex gap-2">
              <button className="bg-blue-600 text-white px-4 py-2 rounded">
                Tất cả
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded">
                Cơm
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded">
                Phở
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded">
                Bún
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded">
                Nước uống
              </button>
            </div>
            <div className="flex">
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="border border-gray-300 px-3 py-2 rounded-l outline-none"
              />
              <button className="bg-blue-600 text-white px-3 py-2 rounded-r">
                <Search size={20} />
              </button>
            </div>
          </div>

          {/* Lưới sản phẩm (Ví dụ demo vài món) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Item 1 */}
            <div className="border p-2 rounded text-center cursor-pointer hover:shadow-md transition">
              <div className="h-24 bg-gray-200 rounded mb-2 flex items-center justify-center text-gray-400">
                Ảnh Cơm Gà
              </div>
              <p className="font-semibold text-sm">Cơm gà</p>
              <p className="text-blue-600 text-sm">25,000 VNĐ</p>
            </div>
            {/* Item 2 */}
            <div className="border p-2 rounded text-center cursor-pointer hover:shadow-md transition">
              <div className="h-24 bg-gray-200 rounded mb-2 flex items-center justify-center text-gray-400">
                Ảnh Phở Bò
              </div>
              <p className="font-semibold text-sm">Phở bò</p>
              <p className="text-blue-600 text-sm">35,000 VNĐ</p>
            </div>
            {/* Item 3 */}
            <div className="border p-2 rounded text-center cursor-pointer hover:shadow-md transition">
              <div className="h-24 bg-gray-200 rounded mb-2 flex items-center justify-center text-gray-400">
                Ảnh Coca
              </div>
              <p className="font-semibold text-sm">CoCa</p>
              <p className="text-blue-600 text-sm">15,000 VNĐ</p>
            </div>
          </div>
        </div>

        {/* === CỘT PHẢI: HÓA ĐƠN TẠM TÍNH === */}
        <div className="lg:w-1/3 border-t lg:border-t-0 lg:border-l lg:pl-6 pt-4 lg:pt-0 flex flex-col">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Hóa đơn tạm tính
          </h3>

          {/* Bảng chi tiết */}
          <div className="flex-1 border rounded min-h-[200px] mb-4 overflow-hidden text-sm">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-2 font-medium text-gray-600">Tên món ăn</th>
                  <th className="p-2 font-medium text-gray-600">Số lượng</th>
                  <th className="p-2 font-medium text-gray-600">Giá</th>
                  <th className="p-2 font-medium text-gray-600">Tổng</th>
                </tr>
              </thead>
              <tbody>
                {/* Dữ liệu giỏ hàng trống */}
                <tr>
                  <td colSpan="4" className="p-4 text-center text-gray-400">
                    Chưa có món nào
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Tổng tiền */}
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600 text-lg">Tổng tiền:</span>
            <span className="text-2xl font-bold">
              {totalPrice.toLocaleString()} VNĐ
            </span>
          </div>

          {/* Thu ngân & Bàn */}
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1 font-medium">
                Thu ngân:
              </label>
              <select className="w-full border p-2 rounded outline-none bg-white focus:ring-2 focus:ring-blue-500">
                {/* Dùng map để tạo 10 lựa chọn thu ngân */}
                {cashiers.map((name, index) => (
                  <option key={index} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-1/3">
              <label className="block text-sm text-gray-600 mb-1 font-medium">
                Bàn:
              </label>
              <select
                className="w-full border p-2 rounded outline-none bg-white focus:ring-2 focus:ring-blue-500"
                value={selectedTable}
                onChange={(e) => setSelectedTable(e.target.value)}
              >
                {tables.map((table, index) => (
                  <option key={index} value={table}>
                    {table}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Ghi chú */}
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">Ghi chú:</label>
            <input
              type="text"
              className="w-full border p-2 rounded outline-none"
            />
          </div>

          {/* Nút thao tác */}
          <div className="flex gap-4 mt-auto">
            <button
              className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded font-semibold transition"
              onClick={() => {
                const invoiceData = {
                  // QUAN TRỌNG: Nếu đang sửa thì giữ ID cũ để ghi đè, nếu tạo mới thì tạo ID mới
                  id: editingInvoice ? editingInvoice.id : Date.now(),
                  tableName: selectedTable,
                  totalPrice: totalPrice,
                };
                if (onSaveInvoice) onSaveInvoice(invoiceData);
              }}
            >
              Lưu
            </button>
            <button
              className="flex-1 bg-emerald-400 hover:bg-emerald-500 text-white py-3 rounded font-semibold transition"
              onClick={() => setPage("main_dashboard")} // Ấn thoát sẽ quay lại trang Dashboard
            >
              Thoát
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
