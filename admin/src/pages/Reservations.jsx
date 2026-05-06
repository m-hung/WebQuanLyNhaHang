import React, { useState, useEffect } from "react";
import { Calendar, Plus, Edit, Trash2, Eye, Filter, RotateCcw } from "lucide-react";
import CalendarView from "./CalendarView";

export default function Reservations() {
  const [showCalendar, setShowCalendar] = useState(false);
  const [reservations, setReservations] = useState([]);

  // 1. STATE: Quản lý dữ liệu sau khi lọc và giá trị 2 ô input ngày
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/reservations");
        const data = await response.json();
        setReservations(data);
        // 2. Gán dữ liệu cho bảng hiển thị lần đầu tải trang
        setFilteredReservations(data);
      } catch (error) {
        console.error("Lỗi:", error);
      }
    };

    fetchReservations().catch(console.error);
  }, []);

  // 3. Hàm xử lý khi bấm nút "Lọc"
  const handleFilter = () => {
    const filtered = reservations.filter((item) => {
      if (!item.reservationTime) return false;

      const resDate = new Date(item.reservationTime);
      resDate.setHours(0, 0, 0, 0); // Đưa về 0h để so sánh ngày cho chuẩn

      let isAfterStart = true;
      let isBeforeEnd = true;

      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        isAfterStart = resDate >= start;
      }

      if (endDate) {
        const end = new Date(endDate);
        end.setHours(0, 0, 0, 0);
        isBeforeEnd = resDate <= end;
      }

      return isAfterStart && isBeforeEnd;
    });

    setFilteredReservations(filtered);
  };

  // 4. Hàm xử lý khi bấm nút "Reset"
  const handleReset = () => {
    setStartDate("");
    setEndDate("");
    setFilteredReservations(reservations); // Trả bảng về lại toàn bộ dữ liệu gốc
  };

  if (showCalendar) {
    return <CalendarView onBack={() => setShowCalendar(false)} reservations={reservations} />;
  }

  return (
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-md w-full">
        <div className="mb-6 p-4 bg-linear-to-r from-blue-50/50 to-transparent rounded-lg shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-gray-200">
          <h2 className="text-xl font-bold text-blue-800">
            Liệt kê lịch đặt bàn
          </h2>
        </div>

        {/* Bộ lọc (Filters) */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex gap-4 flex-1">
            <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2.5 bg-linear-to-r from-blue-50/50 to-transparent rounded-lg shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all [&::-webkit-calendar-picker-indicator]:cursor-pointer"
            />
            <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-2.5 bg-linear-to-r from-blue-50/50 to-transparent rounded-lg shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all [&::-webkit-calendar-picker-indicator]:cursor-pointer"
            />
          </div>
          <div className="flex gap-2">
            <button
                onClick={handleFilter}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Filter size={18} /> Lọc
            </button>
            <button
                onClick={handleReset}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors cursor-pointer"
            >
              <RotateCcw size={18} /> Reset
            </button>
          </div>
        </div>

        {/* Các nút hành động (Actions) */}
        <div className="flex flex-wrap justify-end gap-3 mb-4">
          <button
              onClick={() => setShowCalendar(true)}
              className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors shadow-sm cursor-pointer"
          >
            <Calendar size={18} /> Xem trên lịch
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors shadow-sm cursor-pointer">
            <Plus size={18} /> Thêm lịch đặt bàn
          </button>
        </div>

        {/* Thanh công cụ bảng (Show entries & Search) */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 text-gray-600 text-sm gap-4">
          <div className="flex items-center gap-2">
            <span>Show</span>
            <select className="border border-gray-300 rounded p-1 focus:outline-none focus:border-blue-500 cursor-pointer">
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
            <span>entries</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Search:</span>
            <input
                type="text"
                className="border border-gray-300 rounded p-1.5 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Bảng dữ liệu */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border border-gray-200">
            <thead className="text-gray-700 bg-gray-50">
            <tr>
              <th className="border px-4 py-3 font-medium">Tên người đặt</th>
              <th className="border px-4 py-3 font-medium">Email người đặt</th>
              <th className="border px-4 py-3 font-medium">Số điện thoại</th>
              <th className="border px-4 py-3 font-medium">Thời gian</th>
              <th className="border px-4 py-3 font-medium">Bàn</th>
              <th className="border px-4 py-3 font-medium text-center">Số lượng người</th>
              <th className="border px-4 py-3 font-medium text-center">Quản lý</th>
            </tr>
            </thead>
            <tbody>
            {filteredReservations.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-gray-500">
                    Không tìm thấy lịch đặt bàn nào trong khoảng thời gian này.
                  </td>
                </tr>
            ) : (
                filteredReservations.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 border-b">
                      <td className="border px-4 py-3">{item.customerName}</td>
                      <td className="border px-4 py-3">{item.email}</td>
                      <td className="border px-4 py-3">{item.phone}</td>
                      <td className="border px-4 py-3">
                        {item.reservationTime ? item.reservationTime.replace('T', ' ') : ''}
                      </td>
                      <td className="border px-4 py-3">
                        {item.table ? `Bàn ${item.table.tableId}` : 'Chưa xếp'}
                      </td>
                      <td className="border px-4 py-3 text-center">
                        {item.guestCount}
                      </td>
                      <td className="border px-4 py-3">
                        <div className="flex justify-center items-center gap-3">
                          <button className="text-blue-600 hover:text-blue-800" title="Chỉnh sửa">
                            <Edit size={16} />
                          </button>
                          <span className="text-gray-300">|</span>
                          <button className="text-red-500 hover:text-red-700" title="Xóa">
                            <Trash2 size={16} />
                          </button>
                          <span className="text-gray-300">|</span>
                          <button className="text-red-600 hover:text-red-800" title="Xem chi tiết">
                            <Eye size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                ))
            )}
            </tbody>
          </table>
        </div>
      </div>
  );
}