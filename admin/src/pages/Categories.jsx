import React, { useState, useEffect } from "react";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", active: true });
  const [editingId, setEditingId] = useState(null);

  const API_URL = "http://localhost:8080/api/categories";

  const fetchCategories = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Loi ket noi API:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const toggleStatus = async (cat) => {
    try {
      await fetch(`${API_URL}/${cat.categoryId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryId: cat.categoryId,
          name: cat.name,
          active: !cat.active,
        }),
      });
      fetchCategories();
    } catch (error) {
      console.error("Loi cap nhat trang thai:", error);
    }
  };

  const handleEdit = (cat) => {
    setFormData({ name: cat.name, active: cat.active });
    setEditingId(cat.categoryId);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Ban co chac chan muon xoa?")) {
      try {
        const response = await fetch(`${API_URL}/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          fetchCategories();
        } else {
          alert("Xoa that bai! Status: " + response.status);
        }
      } catch (error) {
        console.error("Loi xoa:", error);
      }
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim()) return alert("Vui long nhap ten");

    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;
    const payload = editingId
      ? { categoryId: editingId, ...formData }
      : formData;

    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setIsModalOpen(false);
        setEditingId(null);
        fetchCategories();
      } else {
        alert("Luu that bai! Status: " + response.status);
      }
    } catch (error) {
      alert("Loi luu du lieu: " + error.message);
    }
  };

  const handleOpenModal = () => {
    setFormData({ name: "", active: true });
    setEditingId(null);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-gray-800">Quản lý danh mục</h1>
        <button
          onClick={handleOpenModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2 shadow-sm"
        >
          <span className="text-xl">+</span> Thêm danh mục
        </button>
      </div>

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
              <tr key={cat.categoryId} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                <td className="p-4 text-gray-700 font-medium">{cat.name}</td>
                <td className="p-4 text-center">
                  <button
                    onClick={() => toggleStatus(cat)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${cat.active ? "bg-blue-600" : "bg-gray-300"}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${cat.active ? "translate-x-6" : "translate-x-1"}`}
                    />
                  </button>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => handleEdit(cat)}
                    className="text-blue-600 hover:text-blue-800 mr-4 font-medium text-sm"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(cat.categoryId)}
                    className="text-red-500 hover:text-red-700 font-medium text-sm"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {categories.length === 0 && (
          <div className="p-10 text-center text-gray-400">Không có dữ liệu danh mục.</div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/45"
            onClick={() => setIsModalOpen(false)}
          ></div>
          <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-bold text-gray-800">
                {editingId ? "Sửa danh mục" : "Thêm danh mục"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                &times;
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tên danh mục <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nhập tên danh mục..."
                  className="w-full border border-gray-300 rounded-md p-2.5 outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">Hiển thị</span>
                <button
                  onClick={() => setFormData({ ...formData, active: !formData.active })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.active ? "bg-blue-600" : "bg-gray-200"}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.active ? "translate-x-6" : "translate-x-1"}`}
                  />
                </button>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-4 bg-gray-50 border-t">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2 border rounded text-gray-600 hover:bg-white"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {editingId ? "Cập nhật" : "Thêm mới"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
