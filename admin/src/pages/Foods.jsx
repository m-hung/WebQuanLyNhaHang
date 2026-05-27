import React, { useState, useRef, useEffect } from "react";

const API_URL = "http://localhost:8080/api/menu-items";
const CAT_URL = "http://localhost:8080/api/categories";

const emptyForm = {
  name: "", isAvailable: true, category: null,
  description: "", price: "", discount: "", imageUrl: ""
};

export default function Foods() {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
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
    setIsModalOpen(true);
  };

  const handleEdit = (food) => {
    setFormData({
      name: food.name || "",
      isAvailable: food.isAvailable !== false,
      category: food.category || null,
      description: food.description || "",
      price: food.price ? String(food.price) : "",
      discount: food.discount ? String(food.discount) : "",
      imageUrl: food.imageUrl || ""
    });
    setEditingId(food.itemId);
    setIsModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData({ ...formData, imageUrl });
    }
  };

  // Hàm chặn phím âm (-) và ký tự đặc biệt trong input number
  const blockInvalidChar = (e) => ['e', 'E', '-', '+'].includes(e.key) && e.preventDefault();

  const handleSave = async () => {
    if (!formData.name || !formData.price) {
      alert("Vui lòng nhập tên và giá món ăn");
      return;
    }

    // Kiểm tra tên không chứa số trước khi lưu
    if (/\d/.test(formData.name)) {
      alert("Tên món ăn không được chứa ký tự số!");
      return;
    }

    const priceNum = parseFloat(formData.price) || 0;
    const discountNum = parseFloat(formData.discount) || 0;

    if (priceNum < 0 || discountNum < 0) {
      alert("Giá tiền không được để số âm!");
      return;
    }

    // Ràng buộc: Giá giảm không được lớn hơn giá gốc
    if (discountNum > priceNum) {
      alert("Giá giảm không được lớn hơn giá niêm yết!");
      return;
    }

    const payload = {
      name: formData.name.trim(),
      description: formData.description,
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
        if (res.ok) {
          fetchFoods();
        } else {
          alert("Xóa thất bại! Status: " + res.status);
        }
      } catch (e) {
        console.error("Lỗi xóa:", e);
      }
    }
  };

  const toggleAvailable = async (food) => {
    const payload = {
      name: food.name,
      description: food.description,
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
    <div className="p-6 bg-gray-50 min-h-screen font-sans text-gray-800">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Quản lý món ăn</h1>
        <button onClick={handleOpenModal} className="bg-blue-600 text-white px-5 py-2.5 rounded-lg shadow-md hover:bg-blue-700 transition-all flex items-center gap-2 font-semibold">
          <span className="text-xl">+</span> Thêm món ăn
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b text-xs uppercase text-gray-500 font-bold tracking-wider">
              <th className="p-4">Món ăn</th>
              <th className="p-4">Danh mục</th>
              <th className="p-4 text-center">Giá gốc</th>
              <th className="p-4 text-center">Giảm giá</th>
              <th className="p-4 text-center">Tùy chọn</th>
            </tr>
          </thead>
          <tbody>
            {foods.map((food) => (
              <tr key={food.itemId} className={`border-b last:border-0 hover:bg-gray-50/50 transition-colors ${!food.isAvailable ? 'opacity-50 grayscale' : ''}`}>
                <td className="p-4 flex items-center gap-4">
                  <div className="w-14 h-14 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                    {food.imageUrl
                      ? <img src={food.imageUrl} alt={food.name} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-gray-300 text-2xl">?</div>
                    }
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{food.name}</div>
                    <div className="text-xs text-gray-500 truncate max-w-[200px]">{food.description}</div>
                  </div>
                </td>
                <td className="p-4 text-sm text-gray-600 font-medium">{food.category ? food.category.name : "N/A"}</td>
                <td className="p-4 text-center font-medium text-gray-700">{food.price ? Number(food.price).toLocaleString("vi-VN") + " VND" : "-"}</td>
                <td className="p-4 text-center font-bold text-green-600">{food.discount ? Number(food.discount).toLocaleString("vi-VN") + " VND" : "Không có"}</td>
                <td className="p-4">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => handleEdit(food)} className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-lg text-sm font-bold border border-blue-100 hover:bg-blue-600 hover:text-white transition-all shadow-sm">Sửa</button>
                    <button
                      onClick={() => toggleAvailable(food)}
                      className={`${food.isAvailable ? 'bg-orange-50 text-orange-600 border-orange-100 hover:bg-orange-600' : 'bg-green-50 text-green-600 border-green-100 hover:bg-green-600'} px-4 py-1.5 rounded-lg text-sm font-bold border transition-all hover:text-white shadow-sm`}
                    >
                      {food.isAvailable ? "Ẩn" : "Hiện"}
                    </button>
                    <button onClick={() => handleDelete(food.itemId)} className="bg-red-50 text-red-500 px-4 py-1.5 rounded-lg text-sm font-bold border border-red-100 hover:bg-red-500 hover:text-white transition-all shadow-sm">Xóa</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b bg-white">
              <div className="flex items-center gap-3">
                <div className="w-2 h-8 bg-red-600 rounded-full"></div>
                <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">{editingId ? "Sửa món ăn" : "Thêm món ăn mới"}</h2>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="bg-gray-100 text-gray-500 px-4 py-2 rounded-xl text-sm font-bold hover:bg-red-50 hover:text-red-600 transition-all flex items-center gap-2 border border-transparent hover:border-red-100">✕ Đóng</button>
            </div>

            <div className="p-8 bg-gray-50/50 grid grid-cols-1 lg:grid-cols-3 gap-8 overflow-y-auto">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white p-7 rounded-2xl border border-gray-100 shadow-sm grid grid-cols-2 gap-6 relative overflow-hidden group">
                  <div className="col-span-1 relative">
                    <label className="block text-xs font-black text-blue-600 mb-2 uppercase tracking-widest">Tên món ăn <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      value={formData.name} 
                      onChange={(e) => setFormData({...formData, name: e.target.value.replace(/\d/g, "")})} 
                      className="w-full border border-gray-200 rounded-xl p-3 bg-white outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all" 
                      placeholder="Nhập tên (không chứa số)..." 
                    />
                  </div>

                  <div className="col-span-1">
                    <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Trạng thái hiển thị</label>
                    <select value={formData.isAvailable ? "true" : "false"} onChange={(e) => setFormData({...formData, isAvailable: e.target.value === "true"})} className="w-full border border-gray-200 rounded-xl p-3 outline-none bg-white font-medium cursor-pointer">
                      <option value="true">Hiển thị ngay</option>
                      <option value="false">Tạm thời ẩn</option>
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Danh mục thực đơn</label>
                    <select
                      value={formData.category ? formData.category.categoryId : ""}
                      onChange={(e) => {
                        const cat = categories.find(c => String(c.categoryId) === e.target.value);
                        setFormData({...formData, category: cat || null});
                      }}
                      className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-blue-500 bg-white font-medium cursor-pointer"
                    >
                      <option value="">-- Chọn danh mục phù hợp --</option>
                      {categories.map(cat => (
                        <option key={cat.categoryId} value={cat.categoryId}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Mô tả món ăn</label>
                    <textarea rows="4" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:ring-4 focus:ring-gray-100 bg-white transition-all" placeholder="Thành phần chính, hương vị..."></textarea>
                  </div>
                </div>

                <button onClick={handleSave} className="w-full lg:w-auto bg-blue-600 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg active:scale-95 transition-all">
                  {editingId ? "Cập nhật món ăn +" : "Thêm món ăn vào hệ thống +"}
                </button>
              </div>

              <div className="lg:col-span-1 space-y-6">
                <div className="bg-white p-7 rounded-2xl border border-gray-100 shadow-sm">
                  <h3 className="text-xs font-black text-gray-400 mb-4 uppercase tracking-widest border-b pb-2 flex items-center gap-2">Thông tin giá</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Giá niêm yết (VNĐ) <span className="text-red-500">*</span></label>
                      <input 
                        type="number" 
                        min="0"
                        onKeyDown={blockInvalidChar} 
                        value={formData.price} 
                        onChange={(e) => setFormData({...formData, price: e.target.value})} 
                        className="w-full border border-gray-200 rounded-xl p-3 font-black text-lg focus:ring-4 focus:ring-green-50/50 outline-none" 
                        placeholder="0" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-green-600 mb-1 uppercase">Giảm giá (Nếu có)</label>
                      <input 
                        type="number" 
                        min="0"
                        onKeyDown={blockInvalidChar} 
                        value={formData.discount} 
                        onChange={(e) => setFormData({...formData, discount: e.target.value})} 
                        className="w-full border border-green-100 bg-green-50/20 rounded-xl p-3 font-black text-lg text-green-600 outline-none focus:ring-4 focus:ring-green-100" 
                        placeholder="0" 
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-7 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
                  <h3 className="text-xs font-black text-red-600 mb-4 uppercase tracking-widest border-b pb-2 flex items-center gap-2">Hình ảnh hiển thị</h3>
                  <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:bg-blue-50 cursor-pointer group" onClick={() => fileInputRef.current.click()}>
                    {formData.imageUrl ? (
                      <img src={formData.imageUrl} alt="Preview" className="w-full h-32 object-cover rounded-xl shadow-md" />
                    ) : (
                      <div className="flex flex-col items-center py-4 text-gray-400 text-xs">Tải ảnh lên</div>
                    )}
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                  </div>
                  
                  {/* PHẦN LINK ẢNH CỦA BẠN Ở ĐÂY */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Hoặc dán URL hình ảnh</label>
                    <input
                      type="text"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                      className="w-full border border-gray-200 rounded-xl p-2 text-xs outline-none focus:ring-2 focus:ring-blue-100"
                      placeholder="https://..."
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