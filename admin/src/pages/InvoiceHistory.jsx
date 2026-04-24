import React, { useState } from "react";

export default function InvoiceHistory() {
  const [invoices] = useState([
    {
        id: 1,
        invoiceCode: "46",
        table: "Bàn 5",
        customerName: "Nguyễn A",
        customerPhone: "0111111111",
        paymentStatus: "Đang chờ xử lý",
        paymentMethod: "Tiền mặt",
        total: "107.001 đ",
      },
      {
        id: 2,
        invoiceCode: "39",
        table: "Bàn 12",
        customerName: "Trần A",
        customerPhone: "0222222222",
        paymentStatus: "Đã thanh toán",
        paymentMethod: "Chuyển khoản",
        total: "76.001 đ",
      },
      {
        id: 3,
        invoiceCode: "38",
        table: "Bàn 2",
        customerName: "Lê A",
        customerPhone: "0333333333",
        paymentStatus: "Đã thanh toán",
        paymentMethod: "Tiền mặt",
        total: "21.003 đ",
      },
      {
        id: 4,
        invoiceCode: "34",
        table: "Bàn 1",
        customerName: "Phạm A",
        customerPhone: "0444444444",
        paymentStatus: "Chưa cập nhật",
        paymentMethod: "Chuyển khoản",
        total: "150.000 đ",
      },
      {
        id: 5,
        invoiceCode: "33",
        table: "Bàn 8",
        customerName: "Võ A",
        customerPhone: "0555555555",
        paymentStatus: "Đang chờ xử lý",
        paymentMethod: "Tiền mặt",
        total: "151.201 đ",
      },
      {
          id: 6,
          invoiceCode: "36",
          table: "Bàn 10",
          customerName: "Vũ A",
          customerPhone: "0666666666",
          paymentStatus: "Đang chờ xử lý",
          paymentMethod: "Tiền mặt",
          total: "173.501 đ",
        },
  ]);

  // --- LOGIC PHÂN TRANG ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; 
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentInvoices = invoices.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(invoices.length / itemsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm w-full min-h-screen flex flex-col">
      <div className="border border-gray-200 rounded-md p-4 mb-6">
        <h2 className="text-xl font-bold text-blue-800">Lịch sử hóa đơn</h2>
      </div>

      <div className="flex justify-end items-center mb-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <span>Search:</span>
          <input 
            type="text" 
            className="border border-gray-300 rounded-sm p-1.5 focus:outline-none focus:border-blue-500 w-48 md:w-64"
          />
        </div>
      </div>

      <div className="overflow-x-auto pb-2">
        <table className="w-full text-sm text-left border-collapse border border2-gray-600">
          <thead className="bg-white text-gray-800">
            <tr>
              <th className="border border2-gray-600 px-4 py-3 font-medium">STT</th>
              <th className="border border2-gray-600 px-4 py-3 font-medium">Mã HĐ</th>
              <th className="border border2-gray-600 px-4 py-3 font-medium">Bàn số</th>
              <th className="border border2-gray-600 px-4 py-3 font-medium">Thông tin KH</th>
              <th className="border border2-gray-600 px-4 py-3 font-medium">Trạng thái TT</th>
              <th className="border border2-gray-600 px-4 py-3 font-medium">Phương thức TT</th>
              <th className="border border2-gray-600 px-4 py-3 font-medium">Tổng tiền</th>
              <th className="border border2-gray-600 px-4 py-3 font-medium text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {currentInvoices.map((item, index) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="border border2-gray-600 px-4 py-3 text-gray-800">
                  {indexOfFirstItem + index + 1}
                </td>
                <td className="border border2-gray-600 px-4 py-3 text-gray-800">{item.invoiceCode}</td>
                <td className="border border2-gray-600 px-4 py-3 text-gray-800">{item.table}</td>
                <td className="border border2-gray-600 px-4 py-3 text-gray-800">
                  <div className="flex flex-col">
                    <span>{item.customerName}</span>
                    <span className="text-gray-500 text-xs mt-0.5">{item.customerPhone}</span>
                  </div>
                </td>
                <td className="border border2-gray-600 px-4 py-3 text-gray-800">{item.paymentStatus}</td>
                <td className="border border2-gray-600 px-4 py-3 text-gray-800">{item.paymentMethod}</td>
                <td className="border border2-gray-600 px-4 py-3 text-gray-800">{item.total}</td>
                <td className="border border2-gray-600 px-4 py-3 text-center">
                  <div className="flex justify-center items-center gap-2">
                    <button className="text-blue-600 hover:text-blue-800 transition-colors">Xem chi tiết</button>
                    <span className="text-gray-300">|</span>
                    <button className="text-blue-600 hover:text-blue-800 transition-colors">In hóa đơn</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* GIAO DIỆN PHÂN TRANG ĐỘNG */}
      {totalPages > 0 && (
        <div className="flex justify-end items-center mt-6 text-lg font-semibold text-gray-600 gap-4">
          <span>
            Hiển thị {indexOfFirstItem + 1} đến {Math.min(indexOfLastItem, invoices.length)} trên tổng {invoices.length} đơn hàng
          </span>
          
          <div className="flex border rounded overflow-hidden">
            <button 
              onClick={prevPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 border-r ${currentPage === 1 ? 'bg-gray-50 text-gray-300 cursor-not-allowed' : 'bg-white hover:bg-gray-100 text-gray-600'}`}
            >
              &lt;
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={`px-4 py-2 border-r transition-colors ${
                  currentPage === number 
                    ? "bg-blue-50 text-blue-600 font-bold" 
                    : "bg-white hover:bg-gray-100 text-gray-600"
                }`}
              >
                {number}
              </button>
            ))}
            <button 
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 ${currentPage === totalPages ? 'bg-gray-50 text-gray-300 cursor-not-allowed' : 'bg-white hover:bg-gray-100 text-gray-600'}`}
            >
              &gt;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}