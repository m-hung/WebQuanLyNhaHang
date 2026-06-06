import React, { useState, useEffect } from "react";
import { FolderPlus, Layers, Globe, Eye, Edit2, Trash2, Sparkles, X } from "lucide-react";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ nameVi: "", nameEn: "", active: true });
  const [editingId, setEditingId] = useState(null);
  const [langTab, setLangTab] = useState("vi"); // "vi" | "en"

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
          nameVi: cat.nameVi,
          nameEn: cat.nameEn,
          active: !cat.active,
        }),
      });
      fetchCategories();
    } catch (error) {
      console.error("Loi cap nhat trang thai:", error);
    }
  };

  const handleEdit = (cat) => {
    setFormData({ nameVi: cat.nameVi || "", nameEn: cat.nameEn || "", active: cat.active });
    setEditingId(cat.categoryId);
    setLangTab("vi");
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Ban co chac chan muon xoa?")) {
      try {
        const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
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
    if (!formData.nameVi.trim()) return alert("Vui lòng nhập tên danh mục (Tiếng Việt)");
    if (!formData.nameEn.trim()) return alert("Vui lòng nhập tên danh mục (Tiếng Anh)");

    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;
    const payload = editingId
      ? { categoryId: editingId, ...formData }
      : formData;

    try {
      const response = await fetch(url, {
        method,
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
    setFormData({ nameVi: "", nameEn: "", active: true });
    setEditingId(null);
    setLangTab("vi");
    setIsModalOpen(true);
  };

  return (
    <div className="p-8 bg-[#FAF8F5] min-h-screen text-[#332A21] font-sans antialiased flex-1">
      
      {/* TÍCH HỢP HIỆU ỨNG CHUYỂN ĐỘNG LUXURY CHO DANH MỤC */}
      <style>{`
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleBlur {
          from { opacity: 0; transform: scale(0.97); filter: blur(4px); }
          to { opacity: 1; transform: scale(1); filter: blur(0); }
        }
        .animate-fade-up {
          animation: slideInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .animate-modal-scale {
          animation: scaleBlur 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
        .premium-shadow {
          box-shadow: 0 12px 24px -10px rgba(84, 61, 39, 0.05);
        }
        .premium-shadow:hover {
          box-shadow: 0 20px 32px -10px rgba(84, 61, 39, 0.1);
        }
      `}</style>

      {/* --- PHẦN 1: BANNER TIÊU ĐỀ THƯỢNG LƯU --- */}
      <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pb-6 border-b border-[#EFEBE4]">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#C49A6C] flex items-center gap-1.5">
            <Sparkles size={12} className="text-[#C49A6C]" /> Phân loại thực đơn nhà hàng
          </span>
          {/* Thay thế thành font-medium và text-3xl, tracking-wide thanh thoát hơn hẳn */}
          <h1 className="text-3xl font-medium text-[#1A130E] tracking-wide mt-1.5">Quản lý danh mục</h1>
        </div>

        <button
          onClick={handleOpenModal}
          className="bg-gradient-to-r from-[#1A130E] to-[#332A21] hover:from-[#332A21] hover:to-[#4A3E33] text-white px-5 py-3 rounded-2xl transition-all duration-300 flex items-center gap-2 text-xs font-bold uppercase tracking-wider shadow-md shadow-black/10 active:scale-95"
        >
          <FolderPlus size={16} />
          <span>Thêm danh mục mới</span>
        </button>
      </div>

      {/* --- PHẦN 2: THIẾT KẾ DANH SÁCH DẠNG THẺ HÀNG NGANG --- */}
      <div className="space-y-4">
        <div className="hidden lg:flex items-center px-8 py-3 text-[10px] font-black text-[#A39688] uppercase tracking-[0.15em] border-b border-[#EFEBE4]">
          <div className="w-5/12 flex items-center gap-2"><Layers size={12} /> Tên danh mục (Tiếng Việt)</div>
          <div className="w-4/12 flex items-center gap-2"><Globe size={12} /> Tên phiên dịch (English)</div>
          <div className="w-[15%] text-center flex items-center justify-center gap-1"><Eye size={12} /> Trạng thái</div>
          <div className="w-[15%] text-right">Hành động</div>
        </div>

        {categories.length > 0 ? (
          categories.map((cat, index) => (
            <div
              key={cat.categoryId}
              style={{ animationDelay: `${index * 45}ms` }}
              className="animate-fade-up premium-shadow bg-white rounded-2xl border border-[#EFEBE4] px-6 lg:px-8 py-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="lg:w-5/12">
                <span className="lg:hidden text-[9px] font-bold text-[#C49A6C] block uppercase mb-1">Tiếng Việt</span>
                {/* Thay thế thành font-medium và tracking-wide nhã nhặn */}
                <span className="text-base font-medium text-[#1A130E] tracking-wide">{cat.nameVi}</span>
              </div>

              <div className="lg:w-4/12">
                <span className="lg:hidden text-[9px] font-bold text-[#C49A6C] block uppercase mb-1">English</span>
                <span className="text-sm text-[#726456] font-semibold">{cat.nameEn}</span>
              </div>

              <div className="lg:w-[15%] flex lg:justify-center items-center gap-3 lg:gap-0">
                <span className="lg:hidden text-[9px] font-bold text-[#C49A6C] uppercase">Hiển thị:</span>
                <button
                  onClick={() => toggleStatus(cat)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none border
                    ${cat.active 
                      ? "bg-[#E07A5F] border-[#E07A5F]" 
                      : "bg-[#EFEBE4] border-[#E8E3DA]"
                    }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-all duration-300 shadow-sm
                      ${cat.active ? "translate-x-6" : "translate-x-1"}`}
                  />
                </button>
              </div>

              <div className="lg:w-[15%] flex items-center justify-end gap-2 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
                <button
                  onClick={() => handleEdit(cat)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF8F5] hover:bg-[#FCEEEB] text-[#726456] hover:text-[#E07A5F] border border-[#EFEBE4] hover:border-[#FADCD5] text-xs font-bold uppercase tracking-wider transition-all duration-300"
                >
                  <Edit2 size={12} /> Sửa
                </button>
                <button
                  onClick={() => handleDelete(cat.categoryId)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#FFF8F6] text-[#A39688] hover:text-rose-600 border border-transparent hover:border-rose-100 text-xs font-bold uppercase tracking-wider transition-all duration-300"
                >
                  <Trash2 size={12} /> Xóa
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-16 text-center bg-white border border-dashed border-[#ECE7E0] rounded-[32px] text-[#A39688] text-sm font-light">
            Chưa ghi nhận dữ liệu phân mục thực đơn khả dụng.
          </div>
        )}
      </div>

      {/* --- PHẦN 3: MODAL THÊM/SỬA PHONG CÁCH BISTRO BOUTIQUE --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#1A130E]/40 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
          
          <div className="relative bg-white rounded-[40px] shadow-2xl w-full max-w-md overflow-hidden border border-[#ECE7E0] animate-modal-scale">
            <div className="flex justify-between items-center px-6 py-5 border-b border-[#EFEBE4]">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#E07A5F]" />
                {/* Thay thế thành font-semibold và tracking-wide mảnh mai sạch sẽ */}
                <h2 className="text-xl text-[#1A130E] font-semibold tracking-wide">
                  {editingId ? "Cập nhật danh mục" : "Khởi tạo danh mục"}
                </h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#B5A89A] hover:text-[#1A130E] p-1.5 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-xs font-bold text-[#726456] uppercase tracking-widest mb-3">
                  Tên phân mục thực đơn <span className="text-rose-500">*</span>
                </label>
                
                <div className="flex bg-[#FAF8F5] p-1 rounded-2xl border border-[#EFEBE4] mb-4">
                  <button
                    onClick={() => setLangTab("vi")}
                    className={`flex-1 py-2 text-xs font-bold uppercase tracking-wide flex items-center justify-center gap-2 rounded-xl transition-all duration-300
                      ${langTab === "vi" 
                        ? "bg-white text-[#E07A5F] shadow-sm border border-[#FADCD5]" 
                        : "text-[#A39688] hover:text-[#1A130E]"
                      }`}
                  >
                    <span>🇲🇳 Tiếng Việt</span>
                  </button>
                  <button
                    onClick={() => setLangTab("en")}
                    className={`flex-1 py-2 text-xs font-bold uppercase tracking-wide flex items-center justify-center gap-2 rounded-xl transition-all duration-300
                      ${langTab === "en" 
                        ? "bg-white text-[#E07A5F] shadow-sm border border-[#FADCD5]" 
                        : "text-[#A39688] hover:text-[#1A130E]"
                      }`}
                  >
                    <span>🇬🇧 English</span>
                  </button>
                </div>

                {langTab === "vi" ? (
                  <input
                    type="text"
                    value={formData.nameVi}
                    onChange={(e) => setFormData({ ...formData, nameVi: e.target.value })}
                    placeholder="Ví dụ: Món Khai Vị, Rượu Vang Đỏ..."
                    className="w-full bg-[#FAF8F5] border border-[#EFEBE4] rounded-2xl p-3.5 outline-none font-semibold text-sm text-[#1A130E] focus:bg-white focus:border-[#E07A5F] focus:ring-4 focus:ring-[#E07A5F]/5 transition-all placeholder:font-medium"
                  />
                ) : (
                  <input
                    type="text"
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                    placeholder="E.g., Appetizers, Red Wine, Desserts..."
                    className="w-full bg-[#FAF8F5] border border-[#EFEBE4] rounded-2xl p-3.5 outline-none font-semibold text-sm text-[#1A130E] focus:bg-white focus:border-[#E07A5F] focus:ring-4 focus:ring-[#E07A5F]/5 transition-all placeholder:font-medium"
                  />
                )}

                {(formData.nameVi || formData.nameEn) && (
                  <div className="mt-3 flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-wide">
                    {formData.nameVi && <span className="bg-[#FCEEEB] text-[#E07A5F] border border-[#F7D2C9] px-2 py-1 rounded-lg">🇲🇳 {formData.nameVi}</span>}
                    {formData.nameEn && <span className="bg-[#FAF8F5] text-[#726456] border border-[#EFEBE4] px-2 py-1 rounded-lg">🇬🇧 {formData.nameEn}</span>}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between p-4 bg-[#FAF8F5] rounded-2xl border border-[#EFEBE4]">
                <div>
                  <span className="text-xs font-bold text-[#1A130E] uppercase tracking-wider block">Kích hoạt hiển thị</span>
                  <span className="text-[10px] text-[#A39688] font-semibold block mt-0.5">Cho phép hiển thị trên thực đơn của khách</span>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, active: !formData.active })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none border
                    ${formData.active 
                      ? "bg-[#E07A5F] border-[#E07A5F]" 
                      : "bg-[#EFEBE4] border-[#E8E3DA]"
                    }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-all duration-300 ${formData.active ? "translate-x-6" : "translate-x-1"}`} />
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 bg-[#FAF8F5] border-t border-[#EFEBE4]">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 bg-white border border-[#EFEBE4] rounded-xl text-xs font-bold text-[#726456] uppercase tracking-wider hover:bg-[#FAF8F5] transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-6 py-2.5 bg-gradient-to-r from-[#1A130E] to-[#332A21] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:opacity-95 shadow-md shadow-black/10 transition-all active:scale-95"
              >
                {editingId ? "Cập nhật ngay" : "Thêm vào thực đơn"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}