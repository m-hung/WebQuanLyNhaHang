import React from "react";

export default function Categories() {
  const [categories, setCategories] = React.useState(["Món chính", "Đồ uống"]);
  const [input, setInput] = React.useState("");

  const addCategory = () => {
    if (!input) return;
    setCategories([...categories, input]);
    setInput("");
  };

  return (
    <div className="max-w-2xl mx-auto md:mx-0"> {/* Giới hạn độ rộng trên màn hình lớn để dễ nhìn */}
      <h1 className="text-xl md:text-2xl font-bold mb-4">Quản lý danh mục</h1>
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border p-3 flex-1 rounded"
          placeholder="Tên danh mục..."
        />
        <button 
          onClick={addCategory} 
          className="bg-blue-500 text-white px-6 py-3 sm:py-2 rounded active:bg-blue-600"
        >
          Thêm
        </button>
      </div>
      <ul className="bg-white p-4 rounded shadow">
        {categories.map((c, i) => (
          <li key={i} className="border-b last:border-0 py-3">{c}</li>
        ))}
      </ul>
    </div>
  );
}