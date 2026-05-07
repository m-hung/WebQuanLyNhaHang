import React, { useState, useEffect } from "react";
import { Search, Plus, Minus, Trash2, AlertCircle } from "lucide-react";

export default function Pos({ setPage, onSaveInvoice, editingInvoice }) {
  const cashiers = [
    "Nguyễn Thanh Huy",
    "Nguyễn Thành Huy",
    "Bùi Hữu Hùng",
    "Trần Minh Huấn",
  ];

  const [selectedCashier, setSelectedCashier] = useState(cashiers[0]);

  const [availableTables, setAvailableTables] = useState([]);

  const [selectedTable, setSelectedTable] = useState(
    editingInvoice ? editingInvoice.tableName : "",
  );

  const [cart, setCart] = useState(editingInvoice?.cart || []);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");

  // ==============================================================
  // GỌI API LẤY DỮ LIỆU TỪ SPRING BOOT
  // ==============================================================
  useEffect(() => {
    fetch("http://localhost:8080/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Lỗi lấy danh mục:", err));

    fetch("http://localhost:8080/api/menu-items/available")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Lỗi lấy món ăn:", err));

    // LẤY DANH SÁCH BÀN VÀ LỌC BÀN "TRỐNG"
    fetch("http://localhost:8080/api/tables")
      .then((res) => res.json())
      .then((data) => {
        // Đã sửa cho khớp với Entity Java: dùng trường status === 'Trống'
        const freeTables = data.filter((table) => table.status === "Available");
        setAvailableTables(freeTables);

        if (freeTables.length > 0 && !editingInvoice) {
          // Đã sửa: dùng tableNumber thay vì name
          setSelectedTable(freeTables[0].tableNumber);
        }
      })
      .catch((err) => console.error("Lỗi lấy bàn:", err));
  }, [editingInvoice]);

  // HÀM LỌC SẢN PHẨM (TÌM KIẾM + DANH MỤC)
  const filteredProducts = products.filter((product) => {
    // 1. Lọc theo chữ gõ trong ô tìm kiếm (Không phân biệt hoa/thường)
    const matchSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    // 2. Lọc theo nút Danh mục
    const matchCategory =
      selectedCategory === "Tất cả" ||
      (product.category && product.category.name === selectedCategory);

    return matchSearch && matchCategory;
  });

  // ==============================================================
  // CÁC HÀM XỬ LÝ GIỎ HÀNG
  // ==============================================================
  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.name === product.name);
      if (existingItem) {
        return prevCart.map((item) =>
          item.name === product.name ? { ...item, qty: item.qty + 1 } : item,
        );
      } else {
        return [...prevCart, { ...product, qty: 1 }];
      }
    });
  };

  const handleUpdateQty = (itemName, delta) => {
    setCart((prevCart) => {
      return prevCart.map((item) => {
        if (item.name === itemName) {
          const newQty = item.qty + delta;
          return { ...item, qty: newQty > 0 ? newQty : 1 };
        }
        return item;
      });
    });
  };

  const handleRemoveFromCart = (itemName) => {
    setCart((prevCart) => prevCart.filter((item) => item.name !== itemName));
  };

  const calculatedTotal = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0,
  );

  const isCartEmpty = cart.length === 0;
  const isTableFull = availableTables.length === 0 && !editingInvoice;
  const isDisablePay = isCartEmpty || isTableFull;

  return (
    <div className="bg-white p-4 min-h-full rounded-lg shadow flex flex-col">
      <h2 className="text-xl font-bold text-blue-800 mb-4 flex items-center justify-between">
        {editingInvoice ? "Cập nhật Hóa Đơn" : "Pos"}
        {isTableFull && (
          <span className="text-sm bg-red-100 text-red-600 px-3 py-1 rounded-full flex items-center gap-1">
            <AlertCircle size={16} /> Quán đang full bàn, không thể tạo mới!
          </span>
        )}
      </h2>

      <div className="flex flex-col lg:flex-row gap-6 flex-1">
        {/* === CỘT TRÁI: DANH SÁCH MÓN ĂN === */}
        <div className="lg:w-2/3 flex flex-col h-full">
          <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
            <div className="flex gap-2 flex-wrap">
              <button
                className={`px-4 py-2 rounded shadow-sm transition ${
                  selectedCategory === "Tất cả"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-blue-500 hover:text-white"
                }`}
                onClick={() => setSelectedCategory("Tất cả")}
              >
                Tất cả
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`px-4 py-2 rounded transition ${
                    selectedCategory === category.name
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-blue-500 hover:text-white"
                  }`}
                  onClick={() => setSelectedCategory(category.name)}
                >
                  {category.name}
                </button>
              ))}
            </div>
            <div className="flex w-full sm:w-auto">
              <input
                type="text"
                placeholder="Tìm kiếm món ăn..."
                value={searchTerm} // <--- Gắn biến lưu từ khóa vào đây
                onChange={(e) => setSearchTerm(e.target.value)} // <--- Cập nhật khi gõ phím
                className="w-full sm:w-64 border border-gray-300 px-3 py-2 rounded-l outline-none focus:border-blue-500"
              />
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-r transition">
                <Search size={20} />
              </button>
            </div>
          </div>

          <div className="flex-1 bg-gray-50/50 p-4 rounded shadow-inner border border-gray-100 overflow-y-auto max-h-[calc(100vh-220px)] custom-scrollbar">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleAddToCart(product)}
                    className="bg-white border border-gray-200 p-2 rounded-lg text-center cursor-pointer hover:shadow-lg hover:border-blue-400 hover:-translate-y-1 transition duration-200 flex flex-col"
                  >
                    <div className="h-28 bg-gray-100 rounded mb-3 flex items-center justify-center text-gray-400 text-sm overflow-hidden">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>Chưa có ảnh</span>
                      )}
                    </div>
                    <p
                      className="font-bold text-gray-700 text-sm line-clamp-2 leading-snug h-10"
                      title={product.name}
                    >
                      {product.name}
                    </p>
                    <p className="text-blue-600 text-sm font-bold mt-auto">
                      {product.price ? product.price.toLocaleString() : 0} đ
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <p className="text-lg font-medium text-gray-500 mb-1">
                  Chưa có dữ liệu
                </p>
              </div>
            )}
          </div>
        </div>

        {/* === CỘT PHẢI: HÓA ĐƠN TẠM TÍNH === */}
        <div className="lg:w-1/3 border-t lg:border-t-0 lg:border-l lg:pl-6 pt-4 lg:pt-0 flex flex-col h-full">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Hóa đơn tạm tính
          </h3>

          <div className="flex-1 border border-gray-200 rounded-lg mb-4 flex flex-col overflow-hidden bg-white shadow-sm max-h-[calc(100vh-400px)]">
            <div className="overflow-y-auto custom-scrollbar flex-1">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-100 sticky top-0 z-10 shadow-sm">
                  <tr>
                    <th className="p-3 font-semibold text-gray-600 w-2/5">
                      Tên món
                    </th>
                    <th className="p-3 font-semibold text-gray-600 text-center">
                      SL
                    </th>
                    <th className="p-3 font-semibold text-gray-600 text-right">
                      Tổng
                    </th>
                    <th className="p-3 font-semibold text-gray-600 text-center w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {cart.length > 0 ? (
                    cart.map((item, index) => (
                      <tr
                        key={item.name || index}
                        className="hover:bg-blue-50/30 transition group"
                      >
                        <td className="p-3">
                          <p className="font-medium text-gray-700 line-clamp-2">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {item.price.toLocaleString()}đ
                          </p>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleUpdateQty(item.name, -1)}
                              className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="font-semibold w-4 text-center">
                              {item.qty}
                            </span>
                            <button
                              onClick={() => handleUpdateQty(item.name, 1)}
                              className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 hover:bg-blue-200"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </td>
                        <td className="p-3 text-right font-bold text-blue-600">
                          {(item.price * item.qty).toLocaleString()}đ
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => handleRemoveFromCart(item.name)}
                            className="text-gray-300 hover:text-red-500 transition"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="py-12 text-center text-gray-400"
                      >
                        <div className="flex flex-col items-center justify-center">
                          <p className="font-medium">Chưa có món nào</p>
                          <p className="text-xs mt-1">
                            Vui lòng chọn món ở bên trái
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-between items-end mb-4 bg-blue-50 p-4 rounded-lg">
            <span className="text-gray-600 font-semibold">TỔNG CỘNG:</span>
            <span className="text-2xl font-bold text-blue-700">
              {calculatedTotal.toLocaleString()} VNĐ
            </span>
          </div>

          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
                Thu ngân
              </label>
              <select
                className="w-full border border-gray-300 p-2.5 rounded-lg outline-none bg-white focus:border-blue-500 text-sm font-medium"
                value={selectedCashier}
                onChange={(e) => setSelectedCashier(e.target.value)}
              >
                {cashiers.map((name, index) => (
                  <option key={index} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-1/3">
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
                Bàn
              </label>
              <select
                className={`w-full border p-2.5 rounded-lg outline-none text-sm font-medium ${isTableFull ? "bg-red-50 border-red-300 text-red-500" : "bg-white border-gray-300 focus:border-blue-500"}`}
                value={selectedTable}
                onChange={(e) => setSelectedTable(e.target.value)}
                disabled={isTableFull}
              >
                {/* 1. Luôn hiển thị bàn hiện tại trên cùng (nếu đang sửa) */}
                {editingInvoice && (
                  <option value={editingInvoice.tableName}>
                    {editingInvoice.tableName} (Bàn hiện tại)
                  </option>
                )}

                {/* 2. Đổ thêm danh sách các bàn trống ở dưới để có thể chọn đổi */}
                {availableTables.map((table) => (
                  <option key={table.tableId} value={table.tableNumber}>
                    {table.tableNumber}
                  </option>
                ))}

                {/* 3. Nếu hết bàn trống và không phải đang sửa */}
                {availableTables.length === 0 && !editingInvoice && (
                  <option value="">Hết bàn trống</option>
                )}
              </select>
            </div>
          </div>

          <div className="flex gap-3 mt-auto">
            <button
              className={`flex-1 py-3.5 rounded-lg font-bold transition shadow-sm ${
                !isDisablePay
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              disabled={isDisablePay}
              onClick={() => {
                const selectedTableObj = availableTables.find(
                  (t) => t.tableNumber === selectedTable,
                );

                if (selectedTableObj && !editingInvoice) {
                  // ==========================================================
                  // TẠO MỚI HÓA ĐƠN
                  // ==========================================================
                  fetch(
                    `http://localhost:8080/api/tables/${selectedTableObj.tableId}/status`,
                    {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ status: "Occupied" }),
                    },
                  )
                    .then(() => {
                      const orderPayload = {
                        table: { tableId: selectedTableObj.tableId },
                        orderDate: new Date().toISOString(),
                        totalAmount: calculatedTotal,
                        status: "Serving",
                      };

                      return fetch("http://localhost:8080/api/orders", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(orderPayload),
                      }).then((res) => res.json());
                    })
                    .then((savedOrder) => {
                      // Đã gom chung .then này lại để biến savedOrder không bị mất tích
                      const itemPromises = cart.map((item) => {
                        const orderItemPayload = {
                          order: { orderId: savedOrder.orderId },
                          menuItem: { id: item.id },
                          quantity: item.qty,
                          subtotal: item.price * item.qty,
                          note: "",
                        };

                        return fetch("http://localhost:8080/api/order-items", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify(orderItemPayload),
                        });
                      });

                      // Đợi lưu xong món ăn thì mới gọi onSaveInvoice
                      return Promise.all(itemPromises).then(() => {
                        if (onSaveInvoice) {
                          onSaveInvoice({
                            id: savedOrder.orderId,
                            tableId: selectedTableObj.tableId,
                            tableName: selectedTable,
                            totalPrice: calculatedTotal,
                            cart: cart,
                            cashierName: selectedCashier, // Đã có tên thu ngân
                          });
                        }
                      });
                    })
                    .catch((err) => {
                      console.error("Lỗi khi lưu Database:", err);
                      alert(
                        "Có lỗi xảy ra khi lưu vào Database, vui lòng kiểm tra Console (F12)",
                      );
                    });
                } else {
                  // ==========================================================
                  // CẬP NHẬT HÓA ĐƠN CŨ (Kèm logic dọn bàn cũ, khóa bàn mới)
                  // ==========================================================
                  if (onSaveInvoice) {
                    // Lấy ID bàn cũ
                    const oldTableId =
                      editingInvoice.tableId || editingInvoice.table?.tableId;

                    // Tìm ID bàn mới (nếu có chọn)
                    const newTableObj = availableTables.find(
                      (t) => t.tableNumber === selectedTable,
                    );
                    const finalTableId = newTableObj
                      ? newTableObj.tableId
                      : oldTableId;

                    // NẾU CÓ ĐỔI BÀN MỚI
                    if (oldTableId !== finalTableId && newTableObj) {
                      // Bước 1: Nhả bàn cũ về Trống (Available)
                      fetch(
                        `http://localhost:8080/api/tables/${oldTableId}/status`,
                        {
                          method: "PUT",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ status: "Available" }),
                        },
                      )
                        .then(() => {
                          // Bước 2: Khóa bàn mới (Occupied)
                          return fetch(
                            `http://localhost:8080/api/tables/${finalTableId}/status`,
                            {
                              method: "PUT",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ status: "Occupied" }),
                            },
                          );
                        })
                        .then(() => {
                          // Bước 3: Cập nhật giao diện React
                          onSaveInvoice({
                            id: editingInvoice.id,
                            tableId: finalTableId,
                            tableName: selectedTable,
                            totalPrice: calculatedTotal,
                            cart: cart,
                            cashierName: selectedCashier,
                          });
                        })
                        .catch((err) => {
                          console.error("Lỗi khi chuyển bàn:", err);
                        });
                    }
                    // NẾU KHÔNG ĐỔI BÀN (Chỉ thêm bớt món ăn)
                    else {
                      onSaveInvoice({
                        id: editingInvoice.id,
                        tableId: finalTableId,
                        tableName: selectedTable,
                        totalPrice: calculatedTotal,
                        cart: cart,
                        cashierName: selectedCashier,
                      });
                    }
                  }
                }
              }}
            >
              Lưu
            </button>
            <button
              className="flex-1 bg-gray-800 hover:bg-gray-900 text-white py-3.5 rounded-lg font-bold transition shadow-sm"
              onClick={() => setPage("main_dashboard")}
            >
              Thoát
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
