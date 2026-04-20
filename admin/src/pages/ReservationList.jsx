import React, { useState } from "react";
import { Calendar, Plus, Edit, Trash2, Eye, Filter, RotateCcw } from "lucide-react";
import CalendarView from "./CalendarView";

export default function Reservations() {
  const [showCalendar, setShowCalendar] = useState(false);

  const [reservations, setReservations] = useState([
    {
      id: 1,
      name: "Nguyễn Khánh Hưng",
      email: "abc@gmai.com",
      phone: "0123456789",
      time: "2026-04-19 20:30:00",
      table: "Bàn 20",
      guests: 4,
    },
  ]);
  if (showCalendar) {
    return <CalendarView onBack={() => setShowCalendar(false)} />;
  }

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-md w-full">
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50/50 to-transparent rounded-lg shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-gray-200">
        <h2 className="text-xl font-bold text-blue-800">
          Liệt kê lịch đặt bàn
        </h2>
      </div>

      {/* Bộ lọc (Filters) */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex gap-4 flex-1"> 
          <input 
            type="date" 
            className="w-full p-2.5 bg-gradient-to-r from-blue-50/50 to-transparent rounded-lg shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
          />
          <input 
            type="date" 
            className="w-full p-2.5 bg-gradient-to-r from-blue-50/50 to-transparent rounded-lg shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
          />
        </div>
        <div className="flex gap-2">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors">
            <Filter size={18} /> Lọc
          </button>
          <button className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors">
            <RotateCcw size={18} /> Reset
          </button>
        </div>
      </div>

      {/* Các nút hành động (Actions) */}
      <div className="flex flex-wrap justify-end gap-3 mb-4">
        <button 
          onClick={() => setShowCalendar(true)}
          className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors shadow-sm"
        > 
          <Calendar size={18} /> Xem trên lịch
        </button>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors shadow-sm">
          <Plus size={18} /> Thêm lịch đặt bàn
        </button>
      </div>

      {/* Thanh công cụ bảng (Show entries & Search) */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 text-gray-600 text-sm gap-4">
        <div className="flex items-center gap-2">
          <span>Show</span>
          <select className="border border-gray-300 rounded p-1 focus:outline-none focus:border-blue-500">
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
            {reservations.map((item, index) => (
              <tr key={item.id} className="hover:bg-gray-50 border-b">
                <td className="border px-4 py-3">{item.name}</td>
                <td className="border px-4 py-3">{item.email}</td>
                <td className="border px-4 py-3">{item.phone}</td>
                <td className="border px-4 py-3">{item.time}</td>
                <td className="border px-4 py-3">{item.table}</td>
                <td className="border px-4 py-3 text-center">{item.guests}</td>
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}