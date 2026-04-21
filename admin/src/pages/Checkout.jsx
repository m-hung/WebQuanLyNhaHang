import React from "react";

export default function Checkout({ setPage, invoice, onPaymentSuccess }) {
  return (
    <div className="bg-white p-6 md:p-10 rounded shadow-md max-w-5xl mx-auto mt-4">
      <h2 className="text-xl font-bold text-blue-800 mb-6 border-b pb-4">
        Thanh toán hóa đơn
      </h2>

      {/* Thông tin chung */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
        <div>
          {/* Lấy ID tạm thời của hóa đơn, nếu chưa có thì để trống */}
          <h3 className="text-2xl font-medium text-gray-700 mb-2">
            Mã hóa đơn: {invoice?.id || "..."}
          </h3>
          <p className="text-gray-500 mb-2">Thời gian: ...</p>
          <p className="text-gray-500">Hóa đơn nhập bởi: ...</p>
        </div>
        <div>
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            Invoice to:
          </h3>
          <p className="text-gray-500 mb-2">Họ và tên: ...</p>
          <p className="text-gray-500 mb-2">Địa chỉ: ...</p>
          <p className="text-gray-500">Số điện thoại: ...</p>
        </div>
      </div>

      {/* Bảng sản phẩm */}
      <div className="mb-8 border rounded overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white border-b">
            <tr>
              <th className="p-3 font-semibold text-gray-600">Tên sản phẩm</th>
              <th className="p-3 font-semibold text-gray-600">Giá</th>
              <th className="p-3 font-semibold text-gray-600">Số lượng</th>
              <th className="p-3 font-semibold text-gray-600">Tổng cộng</th>
            </tr>
          </thead>
          <tbody>
            {/* Dữ liệu trống theo ý bạn */}
            <tr className="border-b bg-white">
              <td className="p-3 text-gray-500">...</td>
              <td className="p-3 text-gray-500">...</td>
              <td className="p-3 text-gray-500">...</td>
              <td className="p-3 text-gray-500">...</td>
            </tr>
            <tr className="bg-white">
              <td
                colSpan="3"
                className="p-3 text-right font-medium text-gray-500 border-r"
              >
                Tổng tiền:
              </td>
              {/* Vẫn giữ tổng tiền để bạn biết là đang thanh toán cho hóa đơn nào */}
              <td className="p-3 font-medium text-gray-600">
                {invoice?.totalPrice || "0"} VNĐ
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Hình thức thanh toán */}
      <div className="mb-8">
        <h3 className="text-xl font-medium text-gray-700 mb-4">
          Hình thức thanh toán:
        </h3>
        <div className="flex flex-wrap items-center gap-6 text-gray-600">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="payment"
              defaultChecked
              className="form-radio text-emerald-500 focus:ring-emerald-500"
            />
            <span>💵 Tiền mặt</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="payment"
              className="form-radio text-emerald-500 focus:ring-emerald-500"
            />
            <span>💳 Thẻ tín dụng</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="payment"
              className="form-radio text-emerald-500 focus:ring-emerald-500"
            />
            <span>🟣 Chuyển khoản (Ví Momo)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="payment"
              className="form-radio text-emerald-500 focus:ring-emerald-500"
            />
            <span>🔵 Chuyển khoản (Ví VNPAY)</span>
          </label>
        </div>
      </div>

      {/* Nút hành động */}
      <div className="flex flex-wrap gap-3">
        <button
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded shadow-sm transition"
          onClick={() => {
            if (onPaymentSuccess) {
              onPaymentSuccess(invoice?.id); // Gửi ID của hóa đơn về App.jsx để xóa
            }
          }}
        >
          Thanh toán
        </button>
        <button className="bg-yellow-400 hover:bg-yellow-500 text-white px-6 py-2 rounded shadow-sm transition">
          In ra
        </button>
        <button
          className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded shadow-sm transition"
          onClick={() => setPage("main_dashboard")} // Bấm trở lại sẽ về trang chính
        >
          Trở lại
        </button>
        <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded shadow-sm transition">
          Giảm giá
        </button>
      </div>
    </div>
  );
}
