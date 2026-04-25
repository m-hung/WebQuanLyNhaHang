import React, { useState, useRef } from "react";

export default function Foods() {
  // 1. Dữ liệu mẫu ban đầu
  const [foods, setFoods] = useState([
    { 
      id: 1, 
      name: "Panacotta", 
      price: "80.000 VNĐ", 
      discount: "Không có", 
      category: "Món tráng miệng", 
      status: "Hiện",
      description: "Món khai vị đặc trưng với hương vị bao ngậy.",
      image: "https://insanelygoodrecipes.com/wp-content/uploads/2024/11/Homemade-Panna-Cotta.jpg", 
      hidden: false 
    },
    { 
      id: 2, 
      name: "Steak Thắt Lưng Bò", 
      price: "500.000 VNĐ", 
      discount: "100.000 VNĐ", 
      category: "Món chính", 
      status: "Hiện",
      description: "Bò Mỹ thượng hạng kèm sốt rượu vang đỏ và khoai tây nghiền.",
      image: "https://tse3.mm.bing.net/th/id/OIP.-1UxAcSinkpxo1JxS0jTQAHaLH?rs=1&pid=ImgDetMain&o=7&rm=3",
      hidden: false 
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "", status: "Hiện", category: "", description: "", price: "", discount: "", image: null
  });

  const fileInputRef = useRef(null);

  const handleOpenModal = () => {
    setFormData({ name: "", status: "Hiện", category: "", description: "", price: "", discount: "", image: null });
    setIsModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData({ ...formData, image: imageUrl });
    }
  };

  const handleSave = () => {
    if (!formData.name || !formData.price) {
      alert("Vui lòng nhập tên và giá món ăn");
      return;
    }
    const newFood = { ...formData, id: Date.now(), hidden: formData.status === "Ẩn" };
    setFoods([...foods, newFood]);
    setIsModalOpen(false);
  };

  const toggleHide = (id) => {
    setFoods(foods.map(f => f.id === id ? { ...f, hidden: !f.hidden } : f));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans text-gray-800">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Quản lý món ăn</h1>
        <button onClick={handleOpenModal} className="bg-blue-600 text-white px-5 py-2.5 rounded-lg shadow-md hover:bg-blue-700 transition-all flex items-center gap-2 font-semibold">
          <span className="text-xl">+</span> Thêm món ăn
        </button>
      </div>

      {/* Bảng danh sách món ăn */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b text-xs uppercase text-gray-500 font-bold tracking-wider">
              <th className="p-4">Món ăn</th>
              <th className="p-4">Danh mục</th>
              <th className="p-4 text-center">Giá gốc</th>
              <th className="p-4 text-center">Giá giảm</th>
              <th className="p-4 text-center">Tùy chọn</th>
            </tr>
          </thead>
          <tbody>
            {foods.map((food) => (
              <tr key={food.id} className={`border-b last:border-0 hover:bg-gray-50/50 transition-colors ${food.hidden ? 'opacity-50 grayscale' : ''}`}>
                <td className="p-4 flex items-center gap-4">
                  <div className="w-14 h-14 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                    <img src={food.image} alt={food.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{food.name}</div>
                    <div className="text-xs text-gray-500 truncate max-w-[200px]">{food.description}</div>
                  </div>
                </td>
                <td className="p-4 text-sm text-gray-600 font-medium">{food.category || "N/A"}</td>
                <td className="p-4 text-center font-medium text-gray-700">{food.price}</td>
                <td className="p-4 text-center font-bold text-green-600">{food.discount}</td>
                
                <td className="p-4">
                  <div className="flex items-center justify-center gap-2">
                    <button className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-lg text-sm font-bold border border-blue-100 hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                      Sửa
                    </button>
                    <button 
                      onClick={() => toggleHide(food.id)}
                      className={`${
                        food.hidden 
                        ? 'bg-green-50 text-green-600 border-green-100 hover:bg-green-600' 
                        : 'bg-orange-50 text-orange-600 border-orange-100 hover:bg-orange-600'
                      } px-4 py-1.5 rounded-lg text-sm font-bold border transition-all hover:text-white shadow-sm`}
                    >
                      {food.hidden ? "Hiện" : "Ẩn"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal - Trang trí lại phần này */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in duration-300">
            
            {/* Modal Header nổi bật hơn */}
            <div className="flex justify-between items-center p-6 border-b bg-white">
              <div className="flex items-center gap-3">
                <div className="w-2 h-8 bg-red-600 rounded-full"></div>
                <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Thêm món ăn mới</h2>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="bg-gray-100 text-gray-500 px-4 py-2 rounded-xl text-sm font-bold hover:bg-red-50 hover:text-red-600 transition-all flex items-center gap-2 border border-transparent hover:border-red-100">
                <span>✕</span> Đóng
              </button>
            </div>

            <div className="p-8 bg-gray-50/50 grid grid-cols-1 lg:grid-cols-3 gap-8 overflow-y-auto">
              
              {/* Cột trái - Thông tin chi tiết */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white p-7 rounded-2xl border border-gray-100 shadow-sm grid grid-cols-2 gap-6 relative overflow-hidden group">
                  {/* Trang trí góc thẻ */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-12 -mt-12 transition-all group-hover:bg-blue-100"></div>
                  
                  <div className="col-span-1 relative">
                    <label className="block text-xs font-black text-blue-600 mb-2 uppercase tracking-widest">Tên món ăn <span className="text-red-500">*</span></label>
                    <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full border border-gray-200 rounded-xl p-3 bg-white outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all placeholder:text-gray-300" placeholder="Nhập tên món ăn..." />
                  </div>

                  <div className="col-span-1">
                    <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Trạng thái hiển thị</label>
                    <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:ring-4 focus:ring-gray-100 bg-white font-medium cursor-pointer">
                      <option value="Hiện">🟢 Hiển thị ngay</option>
                      <option value="Ẩn">🔴 Tạm thời ẩn</option>
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Danh mục thực đơn</label>
                    <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-blue-500 bg-white font-medium cursor-pointer">
                      <option value="">-- Chọn danh mục phù hợp --</option>
                      <option value="Món chính">Món chính</option>
                      <option value="Panchan">Panchan</option>
                      <option value="Món tráng miệng">Món tráng miệng</option>
                      <option value="Đồ uống">Đồ uống</option>
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Mô tả món ăn</label>
                    <textarea rows="4" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:ring-4 focus:ring-gray-100 bg-white transition-all" placeholder="Thành phần chính, hương vị, cách chế biến..."></textarea>
                  </div>
                </div>

                <button onClick={handleSave} className="w-full lg:w-auto bg-blue-600 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-200 active:scale-95 hover:-translate-y-0.5 transition-all">
                  Thêm món ăn vào hệ thống +
                </button>
              </div>

              {/* Cột phải - Giá & Ảnh */}
              <div className="lg:col-span-1 space-y-6">
                
                {/* Section Giá */}
                <div className="bg-white p-7 rounded-2xl border border-gray-100 shadow-sm">
                  <h3 className="text-xs font-black text-gray-400 mb-4 uppercase tracking-widest border-b pb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span> Thông tin giá
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Giá niêm yết (VNĐ)</label>
                      <input type="text" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full border border-gray-200 rounded-xl p-3 font-black text-lg focus:ring-4 focus:ring-green-50/50 outline-none transition-all" placeholder="0" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-green-600 mb-1 uppercase">Giá khuyến mãi (Nếu có)</label>
                      <input type="text" value={formData.discount} onChange={(e) => setFormData({...formData, discount: e.target.value})} className="w-full border border-green-100 bg-green-50/20 rounded-xl p-3 font-black text-lg text-green-600 outline-none focus:ring-4 focus:ring-green-100 transition-all" placeholder="Không có" />
                    </div>
                  </div>
                </div>

                {/* Section Ảnh */}
                <div className="bg-white p-7 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
                  <h3 className="text-xs font-black text-red-600 mb-4 uppercase tracking-widest border-b pb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span> Hình ảnh hiển thị
                  </h3>
                  <div 
                    className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:bg-blue-50 hover:border-blue-300 transition-all cursor-pointer group"
                    onClick={() => fileInputRef.current.click()}
                  >
                    {formData.image ? (
                      <div className="relative group">
                        <img src={formData.image} alt="Preview" className="w-full h-32 object-cover rounded-xl mb-2 shadow-md transition-all group-hover:brightness-90" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="bg-white/90 text-blue-600 px-3 py-1 rounded-full text-xs font-bold shadow-sm">Đổi ảnh</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center py-4 transition-transform group-hover:scale-105">
                        <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-3 shadow-inner">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </div>
                        <span className="bg-gray-900 text-white px-5 py-2 rounded-xl text-xs font-bold mb-1 shadow-md hover:bg-blue-600 transition-colors">Tải ảnh lên</span>
                        <p className="text-[10px] text-gray-400 font-medium italic mt-2">Định dạng JPG, PNG (Max 5MB)</p>
                      </div>
                    )}
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
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