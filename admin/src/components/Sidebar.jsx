import React from "react";
import { Menu, X, LayoutDashboard, List, Calendar, Home } from "lucide-react"; // Cài đặt bằng: npm install lucide-react

export default function Sidebar({ setPage }) {
  const [isOpen, setIsOpen] = React.useState(false); // Trạng thái đóng/mở menu trên mobile

  // Cấu trúc các mục menu để dễ quản lý
  const menuItems = [
    { id: "main_dashboard", label: "Dashboard", icon: <Home size={20} /> },
    {
      id: "statistics",
      label: "Thống kê",
      icon: <LayoutDashboard size={20} />,
    },
    { id: "categories", label: "Danh mục món", icon: <List size={20} /> },
    { id: "reservations", label: "Lịch đặt bàn", icon: <Calendar size={20} /> },
  ];

  // Hàm xử lý chuyển trang và tự động đóng menu trên mobile
  const handleNav = (id) => {
    setPage(id);
    setIsOpen(false);
  };

  return (
    <>
      {/* 1. Header cho Mobile (Chỉ hiện khi màn hình nhỏ hơn 768px) */}
      <div className="md:hidden bg-gray-800 text-white p-4 flex justify-between items-center sticky top-0 z-50">
        <h2 className="font-bold text-lg">Admin Panel</h2>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 hover:bg-gray-700 rounded transition-colors"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* 2. Lớp phủ (Overlay) khi mở menu trên mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* 3. Nội dung Sidebar chính */}
      <aside
        className={`
        fixed md:static inset-y-0 left-0 z-50
        w-64 bg-gray-800 text-white transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:flex md:flex-col min-h-screen shadow-xl
      `}
      >
        {/* Tiêu đề Sidebar (Chỉ hiện trên Desktop) */}
        <div className="p-6 text-2xl font-bold border-b border-gray-700 hidden md:block">
          Admin
        </div>

        {/* Danh sách các mục điều hướng */}
        <nav className="flex-1 mt-4 px-3">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleNav(item.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-700 transition-all duration-200 group"
                >
                  <span className="text-gray-400 group-hover:text-white">
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Chân trang Sidebar (Tùy chọn) */}
        <div className="p-4 border-t border-gray-700 text-xs text-gray-400 text-center">
          © 2024 Management System
        </div>
      </aside>
    </>
  );
}
