import React, { useState, useRef, useEffect } from "react";
import { FolderPlus, Layers, Globe, Eye, Edit2, Trash2, Sparkles, X, Utensils, Tag, Image, EyeOff } from "lucide-react";

const API_URL = "http://localhost:8080/api/menu-items";
const CAT_URL = "http://localhost:8080/api/categories";

const emptyForm = {
  nameVi: "", nameEn: "",
  descriptionVi: "", descriptionEn: "",
  isAvailable: true, category: null,
  price: "", discount: "", imageUrl: ""
};

export default function Foods() {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [langTab, setLangTab] = useState("vi"); // "vi" | "en"
  const fileInputRef = useRef(null);

  const fetchFoods = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setFoods(data);
    } catch (e) {
      console.error("Lỗi load món ăn:", e);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(CAT_URL);
      const data = await res.json();
      setCategories(data.filter(c => c.active));
    } catch (e) {
      console.error("Lỗi load danh mục:", e);
    }
  };

  useEffect(() => {
    fetchFoods();
    fetchCategories();
  }, []);

  const handleOpenModal = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setLangTab("vi");
    setIsModalOpen(true);
  };

  const handleEdit = (food) => {
    setFormData({
      nameVi: food.nameVi || "",
      nameEn: food.nameEn || "",
      descriptionVi: food.descriptionVi || "",
      descriptionEn: food.descriptionEn || "",
      isAvailable: food.isAvailable !== false,
      category: food.category || null,
      price: food.price ? String(food.price) : "",
      discount: food.discount ? String(food.discount) : "",
      imageUrl: food.imageUrl || ""
    });
    setEditingId(food.itemId);
    setLangTab("vi");
    setIsModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Kích thước ảnh quá lớn! Vui lòng chọn ảnh dưới 2MB.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setFormData(prev => ({ ...prev, imageUrl: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const blockInvalidChar = (e) => ['e', 'E', '-', '+'].includes(e.key) && e.preventDefault();

  const handleSave = async () => {
    if (!formData.nameVi.trim()) { alert("Vui lòng nhập tên món ăn (Tiếng Việt)"); return; }
    if (!formData.nameEn.trim()) { alert("Please enter item name (English)"); return; }
    if (!formData.price) { alert("Vui lòng nhập giá món ăn"); return; }

    const priceNum = parseFloat(formData.price) || 0;
    const discountNum = parseFloat(formData.discount) || 0;

    if (priceNum < 0 || discountNum < 0) { alert("Giá tiền không được để số âm!"); return; }
    if (discountNum > priceNum) { alert("Giá giảm không được lớn hơn giá niêm yết!"); return; }

    const payload = {
      nameVi: formData.nameVi.trim(),
      nameEn: formData.nameEn.trim(),
      descriptionVi: formData.descriptionVi,
      descriptionEn: formData.descriptionEn,
      price: priceNum,
      discount: discountNum,
      imageUrl: formData.imageUrl,
      isAvailable: formData.isAvailable,
      category: formData.category ? { categoryId: formData.category.categoryId } : null
    };

    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setIsModalOpen(false);
        setEditingId(null);
        fetchFoods();
      } else {
        alert("Lưu thất bại! Status: " + res.status);
      }
    } catch (e) {
      alert("Lỗi kết nối: " + e.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa món ăn này?")) {
      try {
        const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (res.ok) fetchFoods();
        else alert("Xóa thất bại! Status: " + res.status);
      } catch (e) {
        console.error("Lỗi xóa:", e);
      }
    }
  };

  const toggleAvailable = async (food) => {
    const payload = {
      nameVi: food.nameVi,
      nameEn: food.nameEn,
      descriptionVi: food.descriptionVi,
      descriptionEn: food.descriptionEn,
      price: food.price,
      discount: food.discount,
      imageUrl: food.imageUrl,
      isAvailable: !food.isAvailable,
      category: food.category ? { categoryId: food.category.categoryId } : null
    };
    try {
      await fetch(`${API_URL}/${food.itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      fetchFoods();
    } catch (e) {
      console.error("Lỗi cập nhật:", e);
    }
  };

  return (
    <div className="p-8 bg-[#FAF8F5] min-h-screen text-[#332A21] font-sans antialiased flex-1">
      
      {/* TÍCH HỢP HIỆU ỨNG ĐỘNG CHO THẺ MÓN ĂN */}
      <style>{`
        @keyframes foodSlideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes modalScale {
          from { opacity: 0; transform: scale(0.97); filter: blur(4px); }
          to { opacity: 1; transform: scale(1); filter: blur(0); }
        }
        .animate-food-card {
          animation: foodSlideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .animate-modal-scale {
          animation: modalScale 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
        .food-premium-shadow {
          box-shadow: 0 12px 32px -12px rgba(84, 61, 39, 0.06);
        }
        .food-premium-shadow:hover {
          box-shadow: 0 24px 48px -12px rgba(84, 61, 39, 0.14);
        }
      `}</style>

      {/* --- PHẦN 1: BANNER TIÊU ĐỀ SANG TRỌNG --- */}
      <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pb-6 border-b border-[#EFEBE4]">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#C49A6C] flex items-center gap-1.5">
            <Sparkles size={12} className="text-[#C49A6C]" /> Tinh hoa ẩm thực thượng hạng
          </span>
          {/* font-medium kết hợp với tracking-wide chống thô chữ tiếng Việt */}
          <h1 className="text-3xl font-medium text-[#1A130E] tracking-wide mt-1.5">Quản lý món ăn</h1>
        </div>

        <button
          onClick={handleOpenModal}
          className="bg-gradient-to-r from-[#1A130E] to-[#332A21] hover:from-[#332A21] hover:to-[#4A3E33] text-white px-5 py-3 rounded-2xl transition-all duration-300 flex items-center gap-2 text-xs font-bold uppercase tracking-wider shadow-md shadow-black/10 active:scale-95"
        >
          <FolderPlus size={16} />
          <span>Thêm món ăn mới</span>
        </button>
      </div>

      {/* --- PHẦN 2: THIẾT KẾ CÁC MÓN ĂN DẠNG CARD KHỐI 3D SANG TRỌNG --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {foods.length > 0 ? (
          foods.map((food, index) => (
            <div
              key={food.itemId}
              style={{ animationDelay: `${index * 40}ms` }}
              className={`animate-food-card food-premium-shadow bg-white rounded-[32px] border border-[#EFEBE4] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 relative
                ${!food.isAvailable ? 'opacity-60 grayscale bg-slate-50' : ''}`}
            >
              {/* Ảnh bìa món ăn với tỉ lệ vàng cao cấp */}
              <div className="w-full h-48 bg-[#FAF8F5] relative overflow-hidden border-b border-[#EFEBE4]">
                {food.imageUrl ? (
                  <img src={food.imageUrl} alt={food.nameVi} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-[#B5A89A] gap-1">
                    <Image size={28} className="stroke-1" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Chưa gắn ảnh</span>
                  </div>
                )}

                {/* Badge Danh mục lơ lửng trên góc ảnh */}
                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-[#726456] border border-[#EFEBE4] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
                  <Tag size={10} className="text-[#C49A6C]" />
                  {food.category ? (food.category.nameVi || food.category.name) : "N/A"}
                </span>

                {/* Khung trạng thái Ẩn/Hiện */}
                {!food.isAvailable && (
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center backdrop-blur-xs">
                    <span className="bg-white/90 text-rose-600 border border-rose-200 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg flex items-center gap-1">
                      <EyeOff size={12} /> Tạm dừng phục vụ
                    </span>
                  </div>
                )}
              </div>

              {/* Phần thân thông tin */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-medium text-[#1A130E] tracking-wide line-clamp-1">{food.nameVi}</h3>
                  <p className="text-xs text-[#C49A6C] font-semibold italic mt-0.5 tracking-wide">{food.nameEn}</p>
                  <p className="text-xs text-[#726456] font-medium mt-3 line-clamp-2 leading-relaxed bg-[#FAF8F5] p-3 rounded-xl border border-[#EFEBE4]/50">
                    {food.descriptionVi || "Không có mô tả chi tiết cho món ăn này."}
                  </p>
                </div>

                {/* Cụm thông tin giá cả đậm chất Bistro */}
                <div className="mt-5 pt-4 border-t border-[#FAF8F5] flex items-center justify-between">
                  <div>
                    {food.discount && parseFloat(food.discount) > 0 ? (
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-bold text-rose-500 uppercase tracking-wider bg-rose-50 border border-rose-100 px-1.5 py-0.5 rounded">Giảm ưu đãi</span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-extrabold text-[#E07A5F]">
                            {(Number(food.price) - Number(food.discount)).toLocaleString("vi-VN")}đ
                          </span>
                          <span className="text-xs text-[#A39688] line-through font-medium">
                            {Number(food.price).toLocaleString("vi-VN")}đ
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-bold text-[#A39688] uppercase tracking-wider block">Giá tiêu chuẩn</span>
                        <span className="text-lg font-extrabold text-[#1A130E]">
                          {food.price ? Number(food.price).toLocaleString("vi-VN") + "đ" : "-"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Cụm nút hành động tinh gọn dạng bo tròn tinh xảo */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleEdit(food)}
                      className="p-2.5 rounded-xl bg-[#FAF8F5] hover:bg-[#FCEEEB] text-[#726456] hover:text-[#E07A5F] border border-[#EFEBE4] hover:border-[#FADCD5] transition-all duration-300"
                      title="Sửa món ăn"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => toggleAvailable(food)}
                      className={`p-2.5 rounded-xl border transition-all duration-300
                        ${food.isAvailable 
                          ? 'bg-white border-[#E8E3DA] text-[#A39688] hover:bg-[#FEF6E5] hover:text-[#D4A359] hover:border-[#F5E0BA]' 
                          : 'bg-[#E6F4EA] border-[#A7F3D0] text-[#059669] hover:bg-[#059669] hover:text-white'}`}
                      title={food.isAvailable ? "Tạm ẩn món" : "Hiển thị món"}
                    >
                      {food.isAvailable ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                    <button
                      onClick={() => handleDelete(food.itemId)}
                      className="p-2.5 rounded-xl bg-white border border-transparent hover:border-rose-100 text-[#B5A89A] hover:text-rose-600 transition-all duration-300"
                      title="Xóa món ăn"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-20 bg-white border border-dashed border-[#ECE7E0] rounded-[32px] text-[#A39688] text-sm font-light">
            Không có dữ liệu thực đơn món ăn nào được tìm thấy.
          </div>
        )}
      </div>

      {/* --- PHẦN 3: MODAL LỚN FORM THÊM/SỬA SANG TRỌNG HOÀNG GIA --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-[#1A130E]/40 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
          
          <div className="relative bg-white rounded-[40px] shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[90vh] border border-[#ECE7E0] animate-modal-scale">
            
            {/* Header Modal */}
            <div className="flex justify-between items-center p-6 border-b border-[#EFEBE4] bg-white">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#E07A5F]" />
                <h2 className="text-xl font-medium text-[#1A130E] tracking-wide uppercase">
                  {editingId ? "Cấu trúc lại món ăn" : "Khởi tạo món ăn mới"}
                </h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#B5A89A] hover:text-[#1A130E] p-2 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-1 text-xs font-bold uppercase tracking-wider border border-[#EFEBE4]"
              >
                <X size={14} /> Đóng cửa sổ
              </button>
            </div>

            {/* Thân Form cuộn */}
            <div className="p-8 bg-[#FAF8F5]/60 grid grid-cols-1 lg:grid-cols-3 gap-8 overflow-y-auto custom-scrollbar">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white p-7 rounded-[28px] border border-[#EFEBE4] shadow-xs space-y-5 relative overflow-hidden">
                  
                  {/* Thanh Đa ngôn ngữ */}
                  <div className="flex bg-[#FAF8F5] p-1 rounded-2xl border border-[#EFEBE4] mb-4">
                    <button
                      onClick={() => setLangTab("vi")}
                      className={`flex-1 py-2 text-xs font-bold uppercase tracking-wide flex items-center justify-center gap-2 rounded-xl transition-all duration-300
                        ${langTab === "vi" ? "bg-white text-[#E07A5F] shadow-sm border border-[#FADCD5]" : "text-[#A39688] hover:text-[#1A130E]"}`}
                    >
                      <span>🇲🇳 Tiếng Việt</span>
                    </button>
                    <button
                      onClick={() => setLangTab("en")}
                      className={`flex-1 py-2 text-xs font-bold uppercase tracking-wide flex items-center justify-center gap-2 rounded-xl transition-all duration-300
                        ${langTab === "en" ? "bg-white text-[#E07A5F] shadow-sm border border-[#FADCD5]" : "text-[#A39688] hover:text-[#1A130E]"}`}
                    >
                      <span>🇬🇧 English</span>
                    </button>
                  </div>

                  {langTab === "vi" ? (
                    <>
                      <div>
                        <label className="block text-[10px] font-bold text-[#726456] mb-2 uppercase tracking-widest">
                          Tên món ăn (Tiếng Việt) <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.nameVi}
                          onChange={(e) => setFormData({ ...formData, nameVi: e.target.value })}
                          className="w-full bg-[#FAF8F5] border border-[#EFEBE4] rounded-2xl p-3.5 outline-none font-semibold text-sm text-[#1A130E] focus:bg-white focus:border-[#E07A5F] focus:ring-4 focus:ring-[#E07A5F]/5 transition-all"
                          placeholder="VD: Thăn Bò Mỹ Áp Chảo..."
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[#726456] mb-2 uppercase tracking-widest">Mô tả hương vị (Tiếng Việt)</label>
                        <textarea
                          rows="3"
                          value={formData.descriptionVi}
                          onChange={(e) => setFormData({ ...formData, descriptionVi: e.target.value })}
                          className="w-full bg-[#FAF8F5] border border-[#EFEBE4] rounded-2xl p-3.5 outline-none font-medium text-sm text-[#1A130E] focus:bg-white focus:border-[#E07A5F] focus:ring-4 focus:ring-[#E07A5F]/5 transition-all"
                          placeholder="Thành phần cốt lõi, nước sốt đi kèm..."
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block text-[10px] font-bold text-[#726456] mb-2 uppercase tracking-widest">
                          Item Name (English) <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.nameEn}
                          onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                          className="w-full bg-[#FAF8F5] border border-[#EFEBE4] rounded-2xl p-3.5 outline-none font-semibold text-sm text-[#1A130E] focus:bg-white focus:border-[#E07A5F] focus:ring-4 focus:ring-[#E07A5F]/5 transition-all"
                          placeholder="E.g: Pan-Seared Beef Tenderloin..."
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[#726456] mb-2 uppercase tracking-widest">Taste Profile Description (English)</label>
                        <textarea
                          rows="3"
                          value={formData.descriptionEn}
                          onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                          className="w-full bg-[#FAF8F5] border border-[#EFEBE4] rounded-2xl p-3.5 outline-none font-medium text-sm text-[#1A130E] focus:bg-white focus:border-[#E07A5F] focus:ring-4 focus:ring-[#E07A5F]/5 transition-all"
                          placeholder="Core ingredients, signature sauces..."
                        />
                      </div>
                    </>
                  )}

                  {/* Bản xem trước nhãn nhỏ */}
                  {(formData.nameVi || formData.nameEn) && (
                    <div className="flex flex-wrap gap-2 pt-1 text-[10px] font-bold uppercase tracking-wide">
                      {formData.nameVi && <span className="bg-[#FCEEEB] text-[#E07A5F] border border-[#F7D2C9] px-3 py-1 rounded-full">🇲🇳 {formData.nameVi}</span>}
                      {formData.nameEn && <span className="bg-[#FAF8F5] text-[#726456] border border-[#EFEBE4] px-3 py-1 rounded-full">🇬🇧 {formData.nameEn}</span>}
                    </div>
                  )}

                  {/* Trạng thái và Danh mục */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                    <div>
                      <label className="block text-[10px] font-bold text-[#726456] mb-2 uppercase tracking-widest">Điều hành phục vụ</label>
                      <select
                        value={formData.isAvailable ? "true" : "false"}
                        onChange={(e) => setFormData({ ...formData, isAvailable: e.target.value === "true" })}
                        className="w-full bg-[#FAF8F5] border border-[#EFEBE4] rounded-2xl p-3.5 outline-none font-semibold text-sm text-[#1A130E] focus:bg-white focus:border-[#E07A5F] cursor-pointer transition-all"
                      >
                        <option value="true">Hiển thị phục vụ ngay</option>
                        <option value="false">Tạm dừng ẩn món ăn</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#726456] mb-2 uppercase tracking-widest">Danh mục thực đơn</label>
                      <select
                        value={formData.category ? formData.category.categoryId : ""}
                        onChange={(e) => {
                          const cat = categories.find(c => String(c.categoryId) === e.target.value);
                          setFormData({ ...formData, category: cat || null });
                        }}
                        className="w-full bg-[#FAF8F5] border border-[#EFEBE4] rounded-2xl p-3.5 outline-none font-semibold text-sm text-[#1A130E] focus:bg-white focus:border-[#E07A5F] cursor-pointer transition-all"
                      >
                        <option value="">-- Chọn nhóm thực đơn --</option>
                        {categories.map(cat => (
                          <option key={cat.categoryId} value={cat.categoryId}>
                            {cat.nameVi || cat.name}{cat.nameEn ? ` / ${cat.nameEn}` : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <button onClick={handleSave} className="w-full lg:w-auto bg-gradient-to-r from-[#1A130E] to-[#332A21] text-white px-8 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-widest hover:opacity-95 shadow-md active:scale-95 transition-all">
                  {editingId ? "Cập nhật thực đơn" : "Đưa vào danh sách món ăn"}
                </button>
              </div>

              {/* Cột phải thông tin giá & hình ảnh */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-white p-7 rounded-[28px] border border-[#EFEBE4] shadow-xs">
                  <h3 className="text-xs font-bold text-[#A39688] mb-4 uppercase tracking-widest border-b border-[#EFEBE4] pb-2">Định giá tài chính</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-[#726456] mb-1.5 uppercase">Giá niêm yết (VNĐ) <span className="text-rose-500">*</span></label>
                      <input
                        type="number" min="0" onKeyDown={blockInvalidChar}
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full bg-[#FAF8F5] border border-[#EFEBE4] rounded-xl p-3 font-extrabold text-base text-[#1A130E] outline-none focus:bg-white focus:border-[#E07A5F] transition-all"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#E07A5F] mb-1.5 uppercase">Khấu trừ giảm giá (VNĐ)</label>
                      <input
                        type="number" min="0" onKeyDown={blockInvalidChar}
                        value={formData.discount}
                        onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                        className="w-full bg-[#FFF8F6] border border-[#FADCD5] rounded-xl p-3 font-extrabold text-base text-[#E07A5F] outline-none focus:bg-white focus:border-[#E07A5F] transition-all"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-7 rounded-[28px] border border-[#EFEBE4] shadow-xs relative overflow-hidden">
                  <h3 className="text-xs font-bold text-[#A39688] mb-4 uppercase tracking-widest border-b border-[#EFEBE4] pb-2">Tư liệu hình ảnh</h3>
                  <div 
                    className="border-2 border-dashed border-[#EFEBE4] hover:border-[#C49A6C] rounded-2xl p-6 text-center bg-[#FAF8F5] hover:bg-white cursor-pointer transition-all duration-300 flex flex-col items-center justify-center min-h-[140px]" 
                    onClick={() => fileInputRef.current.click()}
                  >
                    {formData.imageUrl ? (
                      <img src={formData.imageUrl} alt="Preview" className="w-full h-32 object-cover rounded-xl shadow-sm" />
                    ) : (
                      <div className="flex flex-col items-center gap-1.5 text-[#B5A89A]">
                        <Image size={24} className="stroke-1" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Tải tệp ảnh</span>
                      </div>
                    )}
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                  </div>
                  <div className="mt-4 pt-4 border-t border-[#EFEBE4]">
                    <label className="block text-[10px] font-bold text-[#726456] mb-1.5 uppercase">Hoặc liên kết URL hình ảnh</label>
                    <input
                      type="text"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      className="w-full bg-[#FAF8F5] border border-[#EFEBE4] rounded-xl p-2.5 text-xs outline-none focus:bg-white focus:border-[#E07A5F] transition-all"
                      placeholder="https://images.unsplash/..."
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}