import React, { useState } from "react";

export default function Categories() {
  // Dữ liệu mẫu ban đầu
  const [categories, setCategories] = useState([
    { id: 1, name: "Món chính", active: true },
    { id: 2, name: "Đồ uống", active: false },
  ]);

  // Quản lý trạng thái Modal và Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", active: true });

  // Hàm bật/tắt trạng thái Hiển thị trực tiếp trên bảng
  const toggleStatus = (id) => {
    setCategories(categories.map(cat => 
      cat.id === id ? { ...cat, active: !cat.active } : cat
    ));
  };

  // Mở modal để thêm mới
  const handleOpenModal = () => {
    setFormData({ name: "", active: true });
    setIsModalOpen(true);
  };

  // Lưu danh mục mới
  const handleSave = () => {
    if (!formData.name.trim()) {
      alert("Vui lòng nhập tên danh mục");
      return;
    }
    const newCategory = {
      id: Date.now(),
      name: formData.name,
      active: formData.active,
    };
    setCategories([...categories, newCategory]);
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      {/* Header Quản lý */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-gray-800">Quản lý danh mục</h1>
        <button
          onClick={handleOpenModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2 shadow-sm"
        >
          <span className="text-xl">+</span> Thêm danh mục
        </button>
      </div>

      {/* Bảng danh sách danh mục */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-4 font-semibold text-gray-600">Tên danh mục</th>
              <th className="p-4 font-semibold text-gray-600 text-center">Hiển thị</th>
              <th className="p-4 font-semibold text-gray-600 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                <td className="p-4 text-gray-700 font-medium">{cat.name}</td>
                <td className="p-4 text-center">
                  {/* Nút Toggle Hiển thị (Đã sửa: Thêm onClick và chuyển thành button) */}
                  <button
                    onClick={() => toggleStatus(cat.id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${cat.active ? 'bg-blue-600' : 'bg-gray-300'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${cat.active ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </td>
                <td className="p-4 text-right">
                  <button className="text-blue-600 hover:text-blue-800 mr-4 font-medium text-sm">Sửa</button>
                  <button className="text-red-500 hover:text-red-700 font-medium text-sm">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {categories.length === 0 && (
          <div className="p-10 text-center text-gray-400">Không có dữ liệu danh mục.</div>
        )}
      </div>

      {/* MODAL THÊM DANH MỤC */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          
          {/* LỚP NỀN TRONG SUỐT (Overlay) */}
          <div 
            className="absolute inset-0 transition-opacity"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.45)' }} 
            onClick={() => setIsModalOpen(false)}
          ></div>

          {/* NỘI DUNG MODAL */}
          <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden transform transition-all duration-200 scale-100">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-bold text-gray-800">Thêm danh mục</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl font-light leading-none"
              >
                &times;
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tên danh mục <span className="text-red-500">*</span>
                </label>
                <input
                  autoFocus
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nhập tên danh mục..."
                  className="w-full border border-gray-300 rounded-md p-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">Hiển thị</span>
                {/* Toggle Switch trong Modal */}
                <button 
                  onClick={() => setFormData({ ...formData, active: !formData.active })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${formData.active ? 'bg-blue-600' : 'bg-gray-200'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${formData.active ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 p-4 bg-gray-50 border-t">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2 border border-gray-300 rounded text-gray-600 hover:bg-white font-medium transition-all active:bg-gray-100"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium shadow-sm transition-all active:scale-95"
              >
                Cập nhật
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}