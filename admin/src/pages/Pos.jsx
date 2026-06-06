import React, { useState, useEffect, useRef } from "react";
import { Search, Plus, Minus, Trash2, AlertCircle, ChefHat, ShoppingBag, ArrowLeft, Utensils, Tag, CheckCircle2, Edit3 } from "lucide-react";
 
/* ─── Shared CSS injected once ────────────────────────────────────── */
const GLOBAL_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
 
  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }
  @keyframes cartPop {
    0%   { transform: scale(1); }
    40%  { transform: scale(1.18); }
    70%  { transform: scale(0.94); }
    100% { transform: scale(1); }
  }
  @keyframes toastIn {
    from { opacity: 0; transform: translateY(-12px) scale(0.96); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes slideInRight {
    from { opacity: 0; transform: translateX(24px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes pulse-gold {
    0%, 100% { box-shadow: 0 0 0 0 rgba(196,154,108,0.35); }
    50%       { box-shadow: 0 0 0 8px rgba(196,154,108,0); }
  }
 
  .pos-root *, .pos-root *::before, .pos-root *::after { box-sizing: border-box; }
  .pos-root { font-family: 'DM Sans', sans-serif; }
  .pos-root h1, .pos-root h2, .pos-root h3, .pos-root .serif {
    font-family: 'Cormorant Garamond', serif;
  }
 
  .pos-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
  .pos-scrollbar::-webkit-scrollbar-track { background: transparent; }
  .pos-scrollbar::-webkit-scrollbar-thumb { background: rgba(196,154,108,0.25); border-radius: 4px; }
  .pos-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(196,154,108,0.5); }
 
  .product-card { animation: fadeSlideUp 0.35s ease both; }
  .product-card:nth-child(1)  { animation-delay: 0.02s }
  .product-card:nth-child(2)  { animation-delay: 0.05s }
  .product-card:nth-child(3)  { animation-delay: 0.08s }
  .product-card:nth-child(4)  { animation-delay: 0.11s }
  .product-card:nth-child(5)  { animation-delay: 0.14s }
  .product-card:nth-child(6)  { animation-delay: 0.17s }
  .product-card:nth-child(7)  { animation-delay: 0.20s }
  .product-card:nth-child(8)  { animation-delay: 0.23s }
  .product-card:nth-child(n+9){ animation-delay: 0.26s }
 
  .shimmer-bg {
    background: linear-gradient(90deg, #F5EFE6 25%, #EDE3D5 50%, #F5EFE6 75%);
    background-size: 800px 100%;
    animation: shimmer 1.4s infinite linear;
  }
 
  .cat-pill-active {
    background: linear-gradient(135deg, #C49A6C, #A07848);
    color: #1A130E;
    box-shadow: 0 4px 14px rgba(196,154,108,0.35);
  }
  .cat-pill {
    background: rgba(196,154,108,0.08);
    color: #7A6655;
    border: 1px solid rgba(196,154,108,0.18);
    transition: all 0.2s;
  }
  .cat-pill:hover {
    background: rgba(196,154,108,0.18);
    color: #5A3E28;
    border-color: rgba(196,154,108,0.4);
  }
 
  .cart-row-enter { animation: slideInRight 0.28s ease both; }
  .cart-badge-pop { animation: cartPop 0.4s ease; }
 
  .save-btn:not(:disabled):hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(196,154,108,0.4); }
  .save-btn { transition: all 0.25s; }
 
  .toast-msg { animation: toastIn 0.3s ease; }
 
  .gold-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(196,154,108,0.4), transparent);
  }
`;
 
/* ─── Toast component ──────────────────────────────────────────────── */
function Toast({ message, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2200);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className="toast-msg" style={{
      position: "fixed", top: 24, right: 24, zIndex: 9999,
      background: "linear-gradient(135deg, #2C1E14, #1A130E)",
      border: "1px solid rgba(196,154,108,0.35)",
      borderRadius: 14, padding: "12px 20px",
      display: "flex", alignItems: "center", gap: 10,
      color: "#ECE7E0", fontSize: 13, fontWeight: 500,
      boxShadow: "0 16px 40px rgba(0,0,0,0.4)"
    }}>
      <CheckCircle2 size={16} color="#C49A6C" />
      {message}
    </div>
  );
}
 
/* ─── Product Card ─────────────────────────────────────────────────── */
function ProductCard({ product, onAdd, getEffectivePrice, cartQty }) {
  const [pressed, setPressed] = useState(false);
  const effectivePrice = getEffectivePrice(product);
  const hasDiscount = product.discount > 0;
 
  const handleClick = () => {
    setPressed(true);
    onAdd(product);
    setTimeout(() => setPressed(false), 320);
  };
 
  return (
    <div
      className="product-card"
      onClick={handleClick}
      style={{
        background: pressed ? "rgba(196,154,108,0.12)" : "#FFFDF9",
        border: cartQty > 0 ? "1.5px solid rgba(196,154,108,0.55)" : "1.5px solid rgba(196,154,108,0.12)",
        borderRadius: 16,
        overflow: "hidden",
        cursor: "pointer",
        transition: "all 0.22s cubic-bezier(.4,0,.2,1)",
        transform: pressed ? "scale(0.96)" : "scale(1)",
        boxShadow: cartQty > 0
          ? "0 4px 20px rgba(196,154,108,0.18)"
          : "0 2px 8px rgba(90,62,40,0.06)",
        position: "relative",
      }}
    >
      {/* Cart badge */}
      {cartQty > 0 && (
        <div className={cartQty > 0 ? "cart-badge-pop" : ""} style={{
          position: "absolute", top: 8, right: 8, zIndex: 2,
          width: 22, height: 22, borderRadius: "50%",
          background: "linear-gradient(135deg,#C49A6C,#A07848)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 11, fontWeight: 700, color: "#1A130E"
        }}>
          {cartQty}
        </div>
      )}
 
      {/* Discount badge */}
      {hasDiscount && (
        <div style={{
          position: "absolute", top: 8, left: 8, zIndex: 2,
          background: "#E8514A", color: "#fff",
          fontSize: 9, fontWeight: 700, padding: "2px 7px",
          borderRadius: 20, letterSpacing: "0.05em"
        }}>
          -{Math.round((product.discount / product.price) * 100)}%
        </div>
      )}
 
      {/* Image */}
      <div style={{ height: 110, background: "#F0E8DC", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {product.imageUrl
          ? <img src={product.imageUrl} alt={product.nameVi || product.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s", }} onMouseEnter={e => e.target.style.transform = "scale(1.06)"} onMouseLeave={e => e.target.style.transform = "scale(1)"} />
          : <ChefHat size={28} color="rgba(196,154,108,0.4)" />
        }
      </div>
 
      {/* Info */}
      <div style={{ padding: "10px 12px 12px" }}>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 13, color: "#2C1E14", lineHeight: 1.3, marginBottom: 2, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical" }}>
          {product.nameVi || product.name}
        </p>
        <p style={{ fontSize: 10, color: "#A08870", marginBottom: 8, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical" }}>
          {product.nameEn || product.englishName || ""}
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            {hasDiscount && (
              <p style={{ fontSize: 10, color: "#C0A080", textDecoration: "line-through", lineHeight: 1 }}>
                {(product.price || 0).toLocaleString()}đ
              </p>
            )}
            <p style={{ fontSize: 13, fontWeight: 700, color: hasDiscount ? "#E8514A" : "#C49A6C" }}>
              {effectivePrice.toLocaleString()}đ
            </p>
          </div>
          <div style={{
            width: 26, height: 26, borderRadius: "50%",
            background: "linear-gradient(135deg,#C49A6C,#A07848)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 8px rgba(196,154,108,0.3)"
          }}>
            <Plus size={14} color="#fff" strokeWidth={2.5} />
          </div>
        </div>
      </div>
    </div>
  );
}
 
/* ─── Cart Row ─────────────────────────────────────────────────────── */
function CartRow({ item, onUpdate, onRemove, getEffectivePrice, index }) {
  const effectivePrice = getEffectivePrice(item);
  return (
    <div className="cart-row-enter" style={{
      animationDelay: `${index * 0.04}s`,
      display: "flex", alignItems: "center", gap: 10,
      padding: "10px 0",
      borderBottom: "1px solid rgba(196,154,108,0.1)",
    }}>
      {/* Name */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: "#2C1E14", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical" }}>
          {item.nameVi}
        </p>
        <p style={{ fontSize: 10, color: "#C49A6C", fontWeight: 600 }}>
          {effectivePrice.toLocaleString()}đ / phần
        </p>
      </div>
 
      {/* Qty controls */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
        <button
          onClick={() => onUpdate(item.itemId, -1)}
          style={{
            width: 24, height: 24, borderRadius: "50%", border: "1px solid rgba(196,154,108,0.3)",
            background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            color: "#A08870", transition: "all 0.18s"
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(196,154,108,0.15)"; e.currentTarget.style.color = "#2C1E14"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#A08870"; }}
        >
          <Minus size={11} />
        </button>
        <span style={{ width: 20, textAlign: "center", fontWeight: 700, fontSize: 14, color: "#2C1E14" }}>{item.qty}</span>
        <button
          onClick={() => onUpdate(item.itemId, 1)}
          style={{
            width: 24, height: 24, borderRadius: "50%",
            background: "linear-gradient(135deg,#C49A6C,#A07848)", border: "none",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", transition: "all 0.18s"
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
          onMouseLeave={e => e.currentTarget.style.opacity = "1"}
        >
          <Plus size={11} />
        </button>
      </div>
 
      {/* Subtotal */}
      <div style={{ width: 72, textAlign: "right", flexShrink: 0 }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#5A3E28" }}>
          {(effectivePrice * item.qty).toLocaleString()}đ
        </p>
      </div>
 
      {/* Remove */}
      <button
        onClick={() => onRemove(item.itemId)}
        style={{ background: "none", border: "none", cursor: "pointer", color: "#D0C0B0", padding: "0 2px", transition: "color 0.18s" }}
        onMouseEnter={e => e.currentTarget.style.color = "#E8514A"}
        onMouseLeave={e => e.currentTarget.style.color = "#D0C0B0"}
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}
 
/* ═══════════════════════════════════════════════════════════════════ */
/*  MAIN POS COMPONENT                                                 */
/* ═══════════════════════════════════════════════════════════════════ */
export default function Pos({ setPage, onSaveInvoice, editingInvoice, initialTableNumber }) {
  const getCurrentUserName = () =>
    sessionStorage.getItem("fullName") || sessionStorage.getItem("username") || "Thu ngân";
 
  const [selectedCashier, setSelectedCashier] = useState(getCurrentUserName());
  const [cashiers, setCashiers] = useState([]);
  const [saveError, setSaveError] = useState("");
  const [availableTables, setAvailableTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(
    editingInvoice ? editingInvoice.tableName : initialTableNumber || ""
  );
  const [toast, setToast] = useState("");
 
  const normalizeCartItem = (item) => ({
    itemId: item.itemId,
    nameVi: item.nameVi || "Unknown",
    nameEn: item.nameEn || "",
    price: item.price || 0,
    discount: item.discount || 0,
    imageUrl: item.imageUrl || "",
    qty: item.qty || 1,
  });
 
  const getInitialCart = () => {
    if (!editingInvoice || !editingInvoice.cart) return [];
    const rawCart = editingInvoice.cart.map(normalizeCartItem);
    const mergedCartMap = {};
    rawCart.forEach((item) => {
      if (mergedCartMap[item.itemId]) mergedCartMap[item.itemId].qty += item.qty;
      else mergedCartMap[item.itemId] = { ...item };
    });
    return Object.values(mergedCartMap);
  };
 
  const [cart, setCart] = useState(getInitialCart());
  const [lastSavedCart, setLastSavedCart] = useState(getInitialCart());
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [loading, setLoading] = useState(true);
 
  const getEffectivePrice = (item) => Math.max(0, (item.price || 0) - (item.discount || 0));
 
  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch("http://localhost:8080/api/categories").then(r => r.json()).catch(() => []),
      fetch("http://localhost:8080/api/menu-items/available").then(r => r.json()).catch(() => []),
      fetch("http://localhost:8080/api/tables").then(r => r.json()).catch(() => []),
      fetch("http://localhost:8080/api/users").then(r => r.json()).catch(() => []),
    ]).then(([cats, prods, tables, users]) => {
      setCategories(cats);
      setProducts(prods);
      const freeTables = tables.filter(t => t.status === "Available");
      setAvailableTables(freeTables);
      if (freeTables.length > 0 && !editingInvoice && !initialTableNumber)
        setSelectedTable(freeTables[0].tableNumber);
      const cashierList = users
        .filter(u => u.role === "CASHIER" && u.status === "ACTIVE")
        .map(u => u.fullName);
      setCashiers(cashierList);
      if (editingInvoice?.cashierName) setSelectedCashier(editingInvoice.cashierName);
      setLoading(false);
    });
  }, [editingInvoice, initialTableNumber]);
 
  const filteredProducts = products.filter((product) => {
    const name = String(product?.nameVi || product?.name || "").toLowerCase();
    const matchSearch = name.includes(searchTerm.toLowerCase());
    const productCatName = product?.category?.nameVi || product?.category?.name;
    const matchCategory =
      selectedCategory === "Tất cả" ||
      (product?.category && productCatName === selectedCategory);
    return matchSearch && matchCategory;
  });
 
  const handleAddToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find(i => i.itemId === product.itemId);
      if (existing) return prev.map(i => i.itemId === product.itemId ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, nameVi: product.nameVi || product.name || "", nameEn: product.nameEn || product.englishName || "", qty: 1 }];
    });
    setToast(`Đã thêm ${product.nameVi || product.name}`);
  };
 
  const handleUpdateQty = (itemId, delta) => {
    setCart(prev => prev.map(item =>
      item.itemId === itemId ? { ...item, qty: Math.max(1, item.qty + delta) } : item
    ));
  };
 
  const handleRemoveFromCart = (itemId) => {
    setCart(prev => prev.filter(i => i.itemId !== itemId));
  };
 
  const getCartChanges = () => {
    if (!editingInvoice) return [];
    const originalMap = {};
    lastSavedCart.forEach(i => originalMap[i.itemId] = i);
    const currentMap = {};
    cart.forEach(i => currentMap[i.itemId] = i);
    const allIds = new Set([...Object.keys(originalMap), ...Object.keys(currentMap)]);
    const changes = [];
    allIds.forEach(id => {
      const origQty = originalMap[id]?.qty || 0;
      const currQty = currentMap[id]?.qty || 0;
      const changeQty = currQty - origQty;
      if (changeQty !== 0) {
        const effectivePrice = getEffectivePrice(currentMap[id] || originalMap[id]);
        changes.push({
          itemId: id,
          nameVi: currentMap[id]?.nameVi || originalMap[id]?.nameVi || "Unknown",
          nameEn: currentMap[id]?.nameEn || originalMap[id]?.nameEn || "",
          changeQty,
          price: effectivePrice,
        });
      }
    });
    return changes;
  };
 
  const cartChanges = getCartChanges();
  const totalChangeAmount = cartChanges.reduce((s, c) => s + c.changeQty * c.price, 0);
  const calculatedTotal = cart.reduce((s, i) => s + getEffectivePrice(i) * i.qty, 0);
  const isCartEmpty = cart.length === 0;
  const isTableFull = availableTables.length === 0 && !editingInvoice;
  const isDisablePay = isCartEmpty || isTableFull;
 
  /* Cart qty map for badges */
  const cartQtyMap = {};
  cart.forEach(i => cartQtyMap[i.itemId] = i.qty);
 
  /* ─── Save handler (unchanged logic) ──────────────────────────── */
  const handleSave = () => {
    if (!selectedCashier) { setSaveError("Vui lòng chọn Thu ngân!"); return; }
    const selectedTableObj = availableTables.find(t => t.tableNumber === selectedTable);
 
    if (selectedTableObj && !editingInvoice) {
      fetch(`http://localhost:8080/api/tables/${selectedTableObj.tableId}/status`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Occupied" })
      }).then(() => {
        const now = new Date();
        const pad = n => String(n).padStart(2, "0");
        const localDateTime = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
        const orderPayload = {
          table: { tableId: selectedTableObj.tableId },
          orderDate: localDateTime,
          totalAmount: calculatedTotal,
          status: "Serving",
          cashierName: selectedCashier,
        };
        return fetch("http://localhost:8080/api/orders", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderPayload)
        }).then(r => r.json());
      }).then(savedOrder => {
        const itemPromises = cart.map(item => {
          return fetch("http://localhost:8080/api/order-items", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ order: { orderId: savedOrder.orderId }, menuItem: { itemId: item.itemId }, quantity: item.qty, subtotal: getEffectivePrice(item) * item.qty, note: "" })
          });
        });
        return Promise.all(itemPromises).then(() => {
          if (onSaveInvoice) onSaveInvoice({ id: savedOrder.orderId, tableId: selectedTableObj.tableId, tableName: selectedTable, totalPrice: calculatedTotal, cart, cashierName: selectedCashier });
          setLastSavedCart(cart.map(i => ({ ...i })));
        });
      }).catch(err => { console.error(err); setSaveError("Lỗi kết nối CSDL. Vui lòng thử lại!"); });
    } else {
      if (onSaveInvoice) {
        const oldTableId = editingInvoice.tableId || editingInvoice.table?.tableId;
        const newTableObj = availableTables.find(t => t.tableNumber === selectedTable);
        const finalTableId = newTableObj ? newTableObj.tableId : oldTableId;
        const updateOrderPayload = { table: { tableId: finalTableId }, totalAmount: calculatedTotal, cashierName: selectedCashier };
 
        const syncCartItems = () =>
          fetch(`http://localhost:8080/api/order-items/order/${editingInvoice.id}`, { method: "DELETE" })
          .then(() => Promise.all(cart.map(item =>
            fetch("http://localhost:8080/api/order-items", {
              method: "POST", headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ order: { orderId: editingInvoice.id }, menuItem: { itemId: item.itemId }, quantity: item.qty, subtotal: getEffectivePrice(item) * item.qty, note: "" })
            })
          )));
 
        const doUpdate = () =>
          fetch(`http://localhost:8080/api/orders/${editingInvoice.id}`, {
            method: "PUT", headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updateOrderPayload)
          }).then(() => syncCartItems()).then(() => {
            onSaveInvoice({ id: editingInvoice.id, tableId: finalTableId, tableName: selectedTable, totalPrice: calculatedTotal, cart, cashierName: selectedCashier });
            setLastSavedCart(cart.map(i => ({ ...i })));
          });
 
        if (oldTableId !== finalTableId && newTableObj) {
          fetch(`http://localhost:8080/api/tables/${oldTableId}/status`, {
            method: "PUT", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "Available" })
          }).then(() =>
            fetch(`http://localhost:8080/api/tables/${finalTableId}/status`, {
              method: "PUT", headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ status: "Occupied" })
            })
          ).then(doUpdate).catch(err => { console.error(err); setSaveError("Lỗi chuyển bàn. Vui lòng thử lại!"); });
        } else {
          doUpdate().catch(err => { console.error(err); setSaveError("Lỗi cập nhật hóa đơn. Vui lòng thử lại!"); });
        }
      }
    }
  };
 
  /* ─── Render ───────────────────────────────────────────────────── */
  return (
    <div className="pos-root" style={{ minHeight: "100vh", background: "#F8F2EA", display: "flex", flexDirection: "column", overflow: "auto" }}>
      <style>{GLOBAL_STYLE}</style>
      {toast && <Toast message={toast} onDone={() => setToast("")} />}
 
      {/* ── Top Bar ─────────────────────────────────────────────── */}
      <div style={{
        background: "linear-gradient(135deg, #1A130E 0%, #2C1E14 100%)",
        borderBottom: "1px solid rgba(196,154,108,0.2)",
        padding: "0 28px",
        height: 60,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexShrink: 0,
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button
            onClick={() => setPage("main_dashboard")}
            style={{
              background: "rgba(196,154,108,0.1)", border: "1px solid rgba(196,154,108,0.25)",
              borderRadius: 10, padding: "6px 10px", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 6,
              color: "#C49A6C", fontSize: 12, fontWeight: 600,
              transition: "all 0.2s"
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(196,154,108,0.2)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(196,154,108,0.1)"}
          >
            <ArrowLeft size={14} /> Quay lại
          </button>
 
          <div style={{ width: 1, height: 28, background: "rgba(196,154,108,0.2)" }} />
 
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "linear-gradient(135deg,#C49A6C,#9A7346)",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <Utensils size={16} color="#1A130E" />
            </div>
            <div>
              <h1 className="serif" style={{ color: "#ECE7E0", fontSize: 18, fontWeight: 700, lineHeight: 1, letterSpacing: "0.04em" }}>
                {editingInvoice ? "Cập nhật hóa đơn" : "Point of Sale"}
              </h1>
              <p style={{ color: "#C49A6C", fontSize: 10, letterSpacing: "0.15em", fontWeight: 600, textTransform: "uppercase", marginTop: 2 }}>
                CELESTÉ HOUSE — Restaurant
              </p>
            </div>
          </div>
        </div>
 
        {isTableFull && (
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "rgba(232,81,74,0.12)", border: "1px solid rgba(232,81,74,0.25)",
            borderRadius: 10, padding: "6px 14px",
            color: "#FF7A74", fontSize: 12, fontWeight: 600
          }}>
            <AlertCircle size={14} /> Quán đang full bàn
          </div>
        )}
      </div>
 
      {/* ── Main Content ─────────────────────────────────────────── */}
      <div style={{ display: "flex", flex: 1, alignItems: "flex-start", gap: 0 }}>
 
        {/* ═══ LEFT PANEL — Menu ═══════════════════════════════════ */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, padding: "20px 16px 20px 20px" }}>
 
          {/* Category pills */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
            <button
              className={selectedCategory === "Tất cả" ? "cat-pill-active" : "cat-pill"}
              onClick={() => setSelectedCategory("Tất cả")}
              style={{ padding: "7px 16px", borderRadius: 100, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "none" }}
            >
              Tất cả
            </button>
            {categories.map(cat => {
              const nameVi = cat.nameVi || cat.name || "Danh mục";
              const active = selectedCategory === nameVi;
              return (
                <button
                  key={cat.categoryId}
                  className={active ? "cat-pill-active" : "cat-pill"}
                  onClick={() => setSelectedCategory(nameVi)}
                  style={{ padding: "7px 16px", borderRadius: 100, fontSize: 12, fontWeight: 600, cursor: "pointer", border: active ? "none" : "1px solid rgba(196,154,108,0.18)" }}
                >
                  {nameVi}
                </button>
              );
            })}
          </div>
 
          {/* Search */}
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            background: "#FFFDF9", border: "1.5px solid rgba(196,154,108,0.2)",
            borderRadius: 12, padding: "0 14px",
            marginBottom: 16,
            boxShadow: "0 2px 8px rgba(90,62,40,0.05)"
          }}>
            <Search size={15} color="#C49A6C" />
            <input
              type="text"
              placeholder="Tìm kiếm món ăn..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{
                flex: 1, border: "none", outline: "none",
                background: "transparent", padding: "10px 0",
                fontSize: 13, color: "#2C1E14",
                fontFamily: "'DM Sans', sans-serif"
              }}
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm("")} style={{ background: "none", border: "none", color: "#A08870", cursor: "pointer", fontSize: 16, lineHeight: 1 }}>×</button>
            )}
          </div>
 
          {/* Product grid */}
          <div style={{ paddingRight: 4, paddingBottom: 24 }}>
            {loading ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 12 }}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="shimmer-bg" style={{ borderRadius: 16, height: 200 }} />
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 12 }}>
                {filteredProducts.map(product => (
                  <ProductCard
                    key={product.itemId}
                    product={product}
                    onAdd={handleAddToCart}
                    getEffectivePrice={getEffectivePrice}
                    cartQty={cartQtyMap[product.itemId] || 0}
                  />
                ))}
              </div>
            ) : (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: 60, gap: 12 }}>
                <ChefHat size={40} color="rgba(196,154,108,0.3)" />
                <p style={{ color: "#B0A090", fontSize: 14, fontWeight: 500 }}>Không tìm thấy món</p>
              </div>
            )}
          </div>
        </div>
 
        {/* ═══ RIGHT PANEL — Cart & Checkout ═══════════════════════ */}
        <div style={{
          width: 360,
          flexShrink: 0,
          background: "#FFFDF9",
          borderLeft: "1px solid rgba(196,154,108,0.18)",
          display: "flex",
          flexDirection: "column",
          boxShadow: "-4px 0 24px rgba(90,62,40,0.06)",
          position: "sticky",
          top: 0,
          height: "100vh",
          overflowY: "auto",
        }}>
          {/* Panel header */}
          <div style={{ padding: "18px 20px 14px", borderBottom: "1px solid rgba(196,154,108,0.12)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <ShoppingBag size={16} color="#C49A6C" />
                <h2 className="serif" style={{ color: "#2C1E14", fontSize: 18, fontWeight: 700 }}>
                  Hóa đơn
                </h2>
              </div>
              {cart.length > 0 && (
                <span style={{
                  background: "linear-gradient(135deg,#C49A6C,#A07848)",
                  color: "#fff", fontSize: 11, fontWeight: 700,
                  padding: "2px 10px", borderRadius: 20
                }}>
                  {cart.reduce((s, i) => s + i.qty, 0)} món
                </span>
              )}
            </div>
 
            {/* Table & Cashier selectors */}
            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 9, fontWeight: 700, color: "#A08870", textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: 5 }}>
                  Bàn / Table
                </label>
                <select
                  value={selectedTable}
                  onChange={e => setSelectedTable(e.target.value)}
                  style={{
                    width: "100%", border: "1.5px solid rgba(196,154,108,0.25)",
                    borderRadius: 10, padding: "8px 10px",
                    background: "#FBF7F2", fontSize: 12, fontWeight: 600,
                    color: "#2C1E14", outline: "none", cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif"
                  }}
                >
                  {availableTables.map(t => (
                    <option key={t.tableId} value={t.tableNumber}>{t.tableNumber}</option>
                  ))}
                  {availableTables.length === 0 && !editingInvoice && (
                    <option value="">Hết bàn trống</option>
                  )}
                </select>
              </div>
 
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 9, fontWeight: 700, color: "#A08870", textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: 5 }}>
                  Thu ngân
                </label>
                <div style={{
                  border: "1.5px solid rgba(196,154,108,0.25)", borderRadius: 10,
                  padding: "8px 10px", background: "#FBF7F2",
                  fontSize: 12, fontWeight: 600, color: "#2C1E14",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
                }}>
                  {selectedCashier || "—"}
                </div>
              </div>
            </div>
          </div>
 
          {/* Cart items */}
          <div style={{ flex: 1, padding: "4px 20px" }}>
            {cart.length > 0 ? (
              cart.map((item, i) => (
                <CartRow
                  key={item.itemId}
                  item={item}
                  index={i}
                  onUpdate={handleUpdateQty}
                  onRemove={handleRemoveFromCart}
                  getEffectivePrice={getEffectivePrice}
                />
              ))
            ) : (
              <div style={{ padding: "40px 0", textAlign: "center" }}>
                <ShoppingBag size={36} color="rgba(196,154,108,0.2)" style={{ marginBottom: 12 }} />
                <p style={{ color: "#C0A880", fontSize: 13, fontWeight: 500 }}>Chưa có món nào</p>
                <p style={{ color: "#D0C8B8", fontSize: 11, marginTop: 4 }}>Chọn món từ thực đơn bên trái</p>
              </div>
            )}
 
            {/* Changes table if editing */}
            {editingInvoice && cartChanges.length > 0 && (
              <div style={{
                marginTop: 12, border: "1.5px solid rgba(196,154,108,0.25)",
                borderRadius: 12, overflow: "hidden",
                animation: "fadeSlideUp 0.3s ease"
              }}>
                <div style={{
                  background: "rgba(196,154,108,0.1)", padding: "8px 14px",
                  display: "flex", alignItems: "center", justifyContent: "space-between"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Edit3 size={12} color="#C49A6C" />
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#7A5430", textTransform: "uppercase", letterSpacing: "0.08em" }}>Thay đổi</span>
                  </div>
                  <span style={{ fontSize: 10, background: "rgba(196,154,108,0.2)", color: "#7A5430", padding: "1px 8px", borderRadius: 20, fontWeight: 700 }}>
                    {cartChanges.length} mục
                  </span>
                </div>
                {cartChanges.map(change => (
                  <div key={change.itemId} style={{
                    padding: "8px 14px", borderTop: "1px solid rgba(196,154,108,0.1)",
                    display: "flex", alignItems: "center", gap: 8
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 12, fontWeight: 600, color: "#2C1E14", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{change.nameVi}</p>
                    </div>
                    <span style={{
                      fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 6,
                      background: change.changeQty > 0 ? "rgba(72,187,120,0.12)" : "rgba(232,81,74,0.1)",
                      color: change.changeQty > 0 ? "#27855A" : "#E8514A"
                    }}>
                      {change.changeQty > 0 ? `+${change.changeQty}` : change.changeQty}
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: change.changeQty > 0 ? "#27855A" : "#E8514A", whiteSpace: "nowrap" }}>
                      {change.changeQty > 0 ? "+" : ""}{(change.changeQty * change.price).toLocaleString()}đ
                    </span>
                  </div>
                ))}
                <div style={{ padding: "8px 14px", background: "rgba(196,154,108,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(196,154,108,0.1)" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#7A5430" }}>Tổng đổi:</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: totalChangeAmount >= 0 ? "#27855A" : "#E8514A" }}>
                    {totalChangeAmount > 0 ? "+" : ""}{totalChangeAmount.toLocaleString()} VNĐ
                  </span>
                </div>
              </div>
            )}
          </div>
 
          {/* Footer */}
          <div style={{ padding: "16px 20px 20px", borderTop: "1px solid rgba(196,154,108,0.12)" }}>
            {/* Total */}
            <div style={{
              background: "linear-gradient(135deg, #2C1E14, #1A130E)",
              borderRadius: 14, padding: "14px 18px",
              display: "flex", justifyContent: "space-between", alignItems: "center",
              marginBottom: 14
            }}>
              <span style={{ color: "#C49A6C", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>Tổng cộng</span>
              <span style={{ color: "#ECE7E0", fontSize: 22, fontWeight: 700, letterSpacing: "0", fontFamily: "'DM Sans', sans-serif", fontVariantNumeric: "tabular-nums" }}>
                {calculatedTotal.toLocaleString("vi-VN")} <span style={{ fontSize: 13, color: "#C49A6C", fontWeight: 600 }}>VNĐ</span>
              </span>
            </div>
 
            {/* Error */}
            {saveError && (
              <div style={{
                display: "flex", alignItems: "center", gap: 6,
                color: "#E8514A", fontSize: 12, fontWeight: 600, marginBottom: 10,
                background: "rgba(232,81,74,0.08)", borderRadius: 8, padding: "8px 12px",
                border: "1px solid rgba(232,81,74,0.2)"
              }}>
                <AlertCircle size={14} /> {saveError}
              </div>
            )}
 
            {/* Buttons */}
            <div style={{ display: "flex", gap: 10 }}>
              <button
                className="save-btn"
                onClick={handleSave}
                disabled={isDisablePay}
                style={{
                  flex: 2,
                  background: isDisablePay
                    ? "rgba(196,154,108,0.15)"
                    : "linear-gradient(135deg, #C49A6C, #A07848)",
                  border: "none",
                  borderRadius: 12, padding: "13px 0",
                  color: isDisablePay ? "rgba(196,154,108,0.4)" : "#1A130E",
                  fontSize: 13, fontWeight: 700,
                  cursor: isDisablePay ? "not-allowed" : "pointer",
                  letterSpacing: "0.04em",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6
                }}
              >
                <CheckCircle2 size={15} />
                {editingInvoice ? "Cập nhật" : "Lưu hóa đơn"}
              </button>
 
              <button
                onClick={() => setPage("main_dashboard")}
                style={{
                  flex: 1,
                  background: "rgba(196,154,108,0.08)",
                  border: "1.5px solid rgba(196,154,108,0.2)",
                  borderRadius: 12, padding: "13px 0",
                  color: "#7A5430", fontSize: 13, fontWeight: 700,
                  cursor: "pointer", transition: "all 0.2s"
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(196,154,108,0.15)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(196,154,108,0.08)"}
              >
                Thoát
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}