import React, { useState, useEffect } from "react";
import { Search, Plus, Minus, Trash2, AlertCircle } from "lucide-react";

export default function Pos({
  setPage,
  onSaveInvoice,
  editingInvoice,
  initialTableNumber,
}) {
  const getCurrentUserName = () =>
    sessionStorage.getItem("fullName") ||
    sessionStorage.getItem("username") ||
    "Thu ngân";

  const [selectedCashier, setSelectedCashier] = useState(getCurrentUserName());
  const [cashiers, setCashiers] = useState([]); // Sửa lỗi thiếu state cashiers
  const [saveError, setSaveError] = useState(""); // Sửa lỗi thiếu state saveError
  const [availableTables, setAvailableTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(
    editingInvoice ? editingInvoice.tableName : initialTableNumber || ""
  );

  const normalizeCartItem = (item) => {
    return {
      itemId: item.itemId,
      nameVi: item.nameVi || "Unknown",
      nameEn: item.nameEn || "",
      price: item.price || 0,
      discount: item.discount || 0,
      imageUrl: item.imageUrl || "",
      qty: item.qty || 1,
    };
  }; // SỬA: Đóng hàm normalizeCartItem hợp lý ở đây

  const getInitialCart = () => {
    if (!editingInvoice || !editingInvoice.cart) return [];

    const rawCart = editingInvoice.cart.map(normalizeCartItem);
    const mergedCartMap = {};

    rawCart.forEach((item) => {
      if (mergedCartMap[item.itemId]) {
        mergedCartMap[item.itemId].qty += item.qty;
      } else {
        mergedCartMap[item.itemId] = { ...item };
      }
    });

    return Object.values(mergedCartMap);
  };

  const [cart, setCart] = useState(getInitialCart());
  const [lastSavedCart, setLastSavedCart] = useState(getInitialCart());

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");

  const getEffectivePrice = (item) => {
    const basePrice = item.price || 0;
    const discountAmount = item.discount || 0;
    return Math.max(0, basePrice - discountAmount);
  };

  useEffect(() => {
    // Gọi API lấy danh mục
    fetch("http://localhost:8080/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Lỗi lấy danh mục:", err));

    // Gọi API lấy món ăn
    fetch("http://localhost:8080/api/menu-items/available")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Lỗi lấy món ăn:", err));

    // Gọi API lấy bàn
    fetch("http://localhost:8080/api/tables")
      .then((res) => res.json())
      .then((data) => {
        const freeTables = data.filter((table) => table.status === "Available");
        setAvailableTables(freeTables);

        if (freeTables.length > 0 && !editingInvoice && !initialTableNumber) {
          setSelectedTable(freeTables[0].tableNumber);
        }
      })
      .catch((err) => console.error("Lỗi lấy bàn:", err));

    // Gọi API lấy danh sách thu ngân
    fetch("http://localhost:8080/api/users")
      .then((res) => res.json())
      .then((data) => {
        const cashierList = data
          .filter((user) => user.role === "CASHIER" && user.status === "ACTIVE")
          .map((user) => user.fullName);

        setCashiers(cashierList);

        if (editingInvoice && editingInvoice.cashierName) {
          setSelectedCashier(editingInvoice.cashierName);
        }
      })
      .catch((err) => console.error("Lỗi lấy danh sách thu ngân:", err));
  }, [editingInvoice, initialTableNumber]);

  const filteredProducts = products.filter((product) => {
    const productName = String(
      product?.nameVi || product?.name || ""
    ).toLowerCase();
    const matchSearch = productName.includes(searchTerm.toLowerCase());

    const productCatName = product?.category?.nameVi || product?.category?.name;
    const matchCategory =
      selectedCategory === "Tất cả" ||
      (product?.category && productCatName === selectedCategory);

    return matchSearch && matchCategory;
  });

  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.itemId === product.itemId);
      if (existingItem) {
        return prevCart.map((item) =>
          item.itemId === product.itemId ? { ...item, qty: item.qty + 1 } : item
        );
      } else {
        return [
          ...prevCart,
          {
            ...product,
            nameVi: product.nameVi || product.name || "",
            nameEn: product.nameEn || product.englishName || "",
            qty: 1,
          },
        ];
      }
    });
  };

  const handleUpdateQty = (itemId, delta) => {
    setCart((prevCart) => {
      return prevCart.map((item) => {
        if (item.itemId === itemId) {
          const newQty = item.qty + delta;
          return { ...item, qty: newQty > 0 ? newQty : 1 };
        }
        return item;
      });
    });
  };

  const handleRemoveFromCart = (itemId) => {
    setCart((prevCart) => prevCart.filter((item) => item.itemId !== itemId));
  };

  const getCartChanges = () => {
    if (!editingInvoice) return [];

    const changes = [];
    const originalMap = {};
    lastSavedCart.forEach((item) => {
      originalMap[item.itemId] = item;
    });

    const currentMap = {};
    cart.forEach((item) => {
      currentMap[item.itemId] = item;
    });

    const allItemIds = new Set([
      ...Object.keys(originalMap),
      ...Object.keys(currentMap),
    ]);

    allItemIds.forEach((itemId) => {
      const origQty = originalMap[itemId]?.qty || 0;
      const currQty = currentMap[itemId]?.qty || 0;
      const changeQty = currQty - origQty;

      const effectivePrice = getEffectivePrice(
        currentMap[itemId] || originalMap[itemId]
      );

      if (changeQty !== 0) {
        changes.push({
          itemId: itemId,
          nameVi:
            currentMap[itemId]?.nameVi || originalMap[itemId]?.nameVi || "Unknown",
          nameEn: currentMap[itemId]?.nameEn || originalMap[itemId]?.nameEn || "",
          changeQty: changeQty,
          price: effectivePrice,
        });
      }
    });

    return changes;
  };

  const cartChanges = getCartChanges();
  const totalChangeAmount = cartChanges.reduce(
    (sum, change) => sum + change.changeQty * change.price,
    0
  );

  const calculatedTotal = cart.reduce(
    (sum, item) => sum + getEffectivePrice(item) * item.qty,
    0
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
                className={`px-4 py-2 rounded shadow-sm transition whitespace-nowrap ${
                  selectedCategory === "Tất cả"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-blue-500 hover:text-white"
                }`}
                onClick={() => setSelectedCategory("Tất cả")}
              >
                Tất cả / All
              </button>
              {categories.map((category) => {
                const catNameVi = category.nameVi || category.name || "Danh mục";
                const catNameEn = category.nameEn || category.englishName || "";

                return (
                  <button
                    key={category.categoryId}
                    className={`px-4 py-2 rounded transition whitespace-nowrap flex gap-1 ${
                      selectedCategory === catNameVi
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-blue-500 hover:text-white"
                    }`}
                    onClick={() => setSelectedCategory(catNameVi)}
                  >
                    <span>{catNameVi}</span>
                    {catNameEn && (
                      <span
                        className={
                          selectedCategory === catNameVi
                            ? "text-blue-200"
                            : "text-gray-400"
                        }
                      >
                        / {catNameEn}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="flex w-full sm:w-auto">
              <input
                type="text"
                placeholder="Tìm kiếm món ăn..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
                    key={product.itemId}
                    onClick={() => handleAddToCart(product)}
                    className="bg-white border border-gray-200 p-2 rounded-lg text-center cursor-pointer hover:shadow-lg hover:border-blue-400 hover:-translate-y-1 transition duration-200 flex flex-col"
                  >
                    <div className="h-28 bg-gray-100 rounded mb-3 flex items-center justify-center text-gray-400 text-sm overflow-hidden">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.nameVi || product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>Chưa có ảnh</span>
                      )}
                    </div>

                    <div className="flex flex-col items-center justify-start h-12 w-full mb-1">
                      <p
                        className="font-bold text-gray-700 text-sm line-clamp-1 leading-snug w-full"
                        title={product.nameVi || product.name}
                      >
                        {product.nameVi || product.name}
                      </p>
                      <p
                        className="text-[11px] text-gray-400 line-clamp-1 w-full mt-0.5"
                        title={product.nameEn || product.englishName}
                      >
                        {product.nameEn || product.englishName}
                      </p>
                    </div>

                    <div className="flex flex-col items-center mt-auto">
                      {product.discount > 0 ? (
                        <>
                          <p className="text-gray-400 text-[10px] line-through">
                            {product.price ? product.price.toLocaleString() : 0} đ
                          </p>
                          <p className="text-red-600 text-sm font-bold">
                            {getEffectivePrice(product).toLocaleString()} đ
                          </p>
                        </>
                      ) : (
                        <p className="text-blue-600 text-sm font-bold mt-3">
                          {product.price ? product.price.toLocaleString() : 0} đ
                        </p>
                      )}
                    </div>
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
          <h3 className="text-lg font-bold text-gray-800 mb-4">Hóa đơn tạm tính</h3>

          <div className="flex-1 flex flex-col gap-4 min-h-0 mb-4">
            {/* BẢNG GIỎ HÀNG CHÍNH */}
            <div className="flex-1 border border-gray-200 rounded-lg flex flex-col overflow-hidden bg-white shadow-sm min-h-[200px]">
              <div className="overflow-y-auto custom-scrollbar flex-1">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-100 sticky top-0 z-10 shadow-sm">
                    <tr>
                      <th className="p-3 font-semibold text-gray-600 w-2/5">Tên món</th>
                      <th className="p-3 font-semibold text-gray-600 text-center">SL</th>
                      <th className="p-3 font-semibold text-gray-600 text-right">Tổng</th>
                      <th className="p-3 font-semibold text-gray-600 text-center w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {cart.length > 0 ? (
                      cart.map((item, index) => (
                        <tr
                          key={item.itemId || index}
                          className="hover:bg-blue-50/30 transition group"
                        >
                          <td className="p-3">
                            <p
                              className="font-medium text-gray-700 line-clamp-1"
                              title={item.nameVi}
                            >
                              {item.nameVi}
                            </p>
                            <p
                              className="text-[11px] text-gray-400 line-clamp-1 mt-0.5"
                              title={item.nameEn}
                            >
                              {item.nameEn}
                            </p>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => handleUpdateQty(item.itemId, -1)}
                                className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="font-semibold w-5 text-center">
                                {item.qty}
                              </span>
                              <button
                                onClick={() => handleUpdateQty(item.itemId, 1)}
                                className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 hover:bg-blue-200"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                          </td>
                          <td className="p-3 text-right font-bold text-blue-600 whitespace-nowrap">
                            {(getEffectivePrice(item) * item.qty).toLocaleString()} đ
                          </td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => handleRemoveFromCart(item.itemId)}
                              className="text-gray-300 hover:text-red-500 transition"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="py-12 text-center text-gray-400">
                          <div className="flex flex-col items-center justify-center">
                            <p className="font-medium">Chưa có món nào</p>
                            <p className="text-xs mt-1">Vui lòng chọn món ở bên trái</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* BẢNG THAY ĐỔI HÓA ĐƠN */}
            {editingInvoice && cartChanges.length > 0 && (
              <div className="border border-orange-200 rounded-lg flex flex-col overflow-hidden bg-white shadow-sm max-h-56 shrink-0">
                <div className="bg-orange-100 px-3 py-2 text-sm font-bold text-orange-800 border-b border-orange-200 flex justify-between items-center">
                  <span>THAY ĐỔI HÓA ĐƠN</span>
                  <span className="text-xs bg-orange-200 px-2 py-0.5 rounded-full text-orange-700">
                    {cartChanges.length} mục
                  </span>
                </div>
                <div className="overflow-y-auto custom-scrollbar flex-1">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 sticky top-0 z-10 text-xs">
                      <tr>
                        <th className="p-2 font-semibold text-gray-600 pl-3">Tên món</th>
                        <th className="p-2 font-semibold text-gray-600 text-center w-16">
                          SL đổi
                        </th>
                        <th className="p-2 font-semibold text-gray-600 text-right pr-3 w-24">
                          Tiền đổi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {cartChanges.map((change) => (
                        <tr
                          key={change.itemId}
                          className="hover:bg-orange-50/50 transition"
                        >
                          <td className="p-2 pl-3">
                            <p
                              className="font-medium text-gray-700 line-clamp-1"
                              title={change.nameVi}
                            >
                              {change.nameVi}
                            </p>
                            <p
                              className="text-[11px] text-gray-400 line-clamp-1 mt-0.5"
                              title={change.nameEn}
                            >
                              {change.nameEn}
                            </p>
                          </td>
                          <td className="p-2 text-center font-bold">
                            <span
                              className={`inline-block w-10 py-0.5 rounded text-xs ${
                                change.changeQty > 0
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {change.changeQty > 0
                                ? `+${change.changeQty}`
                                : change.changeQty}
                            </span>
                          </td>
                          <td
                            className={`p-2 text-right pr-3 font-bold whitespace-nowrap text-xs ${
                              change.changeQty > 0 ? "text-green-600" : "text-red-500"
                            }`}
                          >
                            {change.changeQty > 0 ? "+" : ""}
                            {(change.changeQty * change.price).toLocaleString()} đ
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="bg-orange-50 px-3 py-2 text-sm font-bold border-t border-orange-200 flex justify-between items-center">
                  <span className="text-orange-800">TỔNG TIỀN ĐỔI:</span>
                  <span
                    className={
                      totalChangeAmount >= 0 ? "text-green-600" : "text-red-500"
                    }
                  >
                    {totalChangeAmount > 0 ? "+" : ""}
                    {totalChangeAmount.toLocaleString()} VNĐ
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between items-end mb-4 bg-blue-50 p-4 rounded-lg shrink-0">
            <span className="text-gray-600 font-semibold">TỔNG CỘNG:</span>
            <span className="text-2xl font-bold text-blue-700">
              {calculatedTotal.toLocaleString()} VNĐ
            </span>
          </div>

          {/* SỬA LẠI KHU VỰC THU NGÂN VÀ CHỌN BÀN CHUẨN ĐÓNG MỞ THẺ */}
          <div className="flex gap-4 mb-4 shrink-0">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
                Thu ngân
              </label>
              <div className="w-full border border-gray-300 p-2.5 rounded-lg bg-gray-50 text-sm font-medium text-gray-900">
                {selectedCashier}
              </div>
            </div>

            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
                Bàn / Table
              </label>
              <select
                value={selectedTable}
                onChange={(e) => setSelectedTable(e.target.value)}
                className="w-full border border-gray-300 p-2.5 rounded-lg bg-white text-sm font-medium text-gray-900 focus:border-blue-500 focus:outline-none"
              >
                {availableTables.map((table) => (
                  <option key={table.tableId} value={table.tableNumber}>
                    {table.tableNumber}
                  </option>
                ))}
                {availableTables.length === 0 && !editingInvoice && (
                  <option value="">Hết bàn trống</option>
                )}
              </select>
            </div>
          </div>

          {/* Hiển thị câu báo lỗi nếu có lỗi từ hệ thống */}
          {saveError && (
            <div className="text-red-500 text-sm font-bold mb-2 flex items-center gap-1">
              <AlertCircle size={16} /> {saveError}
            </div>
          )}

          <div className="flex gap-3 mt-auto shrink-0">
            <button
              className={`flex-1 py-3.5 rounded-lg font-bold transition shadow-sm ${
                !isDisablePay
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              disabled={isDisablePay}
              onClick={() => {
                if (!selectedCashier) {
                  setSaveError("Vui lòng chọn Thu ngân!");
                  return;
                }

                const selectedTableObj = availableTables.find(
                  (t) => t.tableNumber === selectedTable
                );

                if (selectedTableObj && !editingInvoice) {
                  fetch(
                    `http://localhost:8080/api/tables/${selectedTableObj.tableId}/status`,
                    {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ status: "Occupied" }),
                    }
                  )
                    .then(() => {
                      const now = new Date();
                      const pad = (n) => String(n).padStart(2, "0");
                      const localDateTime = `${now.getFullYear()}-${pad(
                        now.getMonth() + 1
                      )}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(
                        now.getMinutes()
                      )}:${pad(now.getSeconds())}`;

                      const orderPayload = {
                        table: { tableId: selectedTableObj.tableId },
                        orderDate: localDateTime,
                        totalAmount: calculatedTotal,
                        status: "Serving",
                        cashierName: selectedCashier,
                      };

                      return fetch("http://localhost:8080/api/orders", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(orderPayload),
                      }).then((res) => res.json());
                    })
                    .then((savedOrder) => {
                      const itemPromises = cart.map((item) => {
                        const orderItemPayload = {
                          order: { orderId: savedOrder.orderId },
                          menuItem: { itemId: item.itemId },
                          quantity: item.qty,
                          subtotal: getEffectivePrice(item) * item.qty,
                          note: "",
                        };

                        return fetch("http://localhost:8080/api/order-items", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify(orderItemPayload),
                        });
                      });

                      return Promise.all(itemPromises).then(() => {
                        if (onSaveInvoice) {
                          onSaveInvoice({
                            id: savedOrder.orderId,
                            tableId: selectedTableObj.tableId,
                            tableName: selectedTable,
                            totalPrice: calculatedTotal,
                            cart: cart,
                            cashierName: selectedCashier,
                          });
                        }
                        setLastSavedCart(cart.map((item) => ({ ...item })));
                      });
                    })
                    .catch((err) => {
                      console.error("Lỗi khi lưu Database:", err);
                      setSaveError("Lỗi kết nối CSDL. Vui lòng thử lại!");
                    });
                } else {
                  if (onSaveInvoice) {
                    const oldTableId =
                      editingInvoice.tableId || editingInvoice.table?.tableId;

                    const newTableObj = availableTables.find(
                      (t) => t.tableNumber === selectedTable
                    );
                    const finalTableId = newTableObj ? newTableObj.tableId : oldTableId;

                    const updateOrderPayload = {
                      table: { tableId: finalTableId },
                      totalAmount: calculatedTotal,
                      cashierName: selectedCashier,
                    };

                    const syncCartItems = () => {
                      return fetch(
                        `http://localhost:8080/api/order-items/order/${editingInvoice.id}`,
                        {
                          method: "DELETE",
                        }
                      ).then(() => {
                        const itemPromises = cart.map((item) => {
                          const orderItemPayload = {
                            order: { orderId: editingInvoice.id },
                            menuItem: { itemId: item.itemId },
                            quantity: item.qty,
                            subtotal: getEffectivePrice(item) * item.qty,
                            note: "",
                          };
                          return fetch("http://localhost:8080/api/order-items", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(orderItemPayload),
                          });
                        });
                        return Promise.all(itemPromises);
                      });
                    };

                    if (oldTableId !== finalTableId && newTableObj) {
                      fetch(
                        `http://localhost:8080/api/tables/${oldTableId}/status`,
                        {
                          method: "PUT",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ status: "Available" }),
                        }
                      )
                        .then(() => {
                          return fetch(
                            `http://localhost:8080/api/tables/${finalTableId}/status`,
                            {
                              method: "PUT",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ status: "Occupied" }),
                            }
                          );
                        })
                        .then(() => {
                          return fetch(
                            `http://localhost:8080/api/orders/${editingInvoice.id}`,
                            {
                              method: "PUT",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify(updateOrderPayload),
                            }
                          );
                        })
                        .then(() => syncCartItems())
                        .then(() => {
                          onSaveInvoice({
                            id: editingInvoice.id,
                            tableId: finalTableId,
                            tableName: selectedTable,
                            totalPrice: calculatedTotal,
                            cart: cart,
                            cashierName: selectedCashier,
                          });
                          setLastSavedCart(cart.map((item) => ({ ...item })));
                        })
                        .catch((err) => {
                          console.error("Lỗi khi chuyển bàn:", err);
                          setSaveError("Lỗi chuyển bàn. Vui lòng thử lại!");
                        });
                    } else {
                      fetch(
                        `http://localhost:8080/api/orders/${editingInvoice.id}`,
                        {
                          method: "PUT",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify(updateOrderPayload),
                        }
                      )
                        .then(() => syncCartItems())
                        .then(() => {
                          onSaveInvoice({
                            id: editingInvoice.id,
                            tableId: finalTableId,
                            tableName: selectedTable,
                            totalPrice: calculatedTotal,
                            cart: cart,
                            cashierName: selectedCashier,
                          });
                          setLastSavedCart(cart.map((item) => ({ ...item })));
                        })
                        .catch((err) => {
                          console.error("Lỗi cập nhật hóa đơn:", err);
                          setSaveError("Lỗi cập nhật hóa đơn. Vui lòng thử lại!");
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