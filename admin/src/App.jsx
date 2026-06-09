import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import DashBoard from "./pages/Dashboard";
import Categories from "./pages/Categories";
import Reservations from "./pages/Reservations";
import Foods from "./pages/Foods";
import ArticleList from "./pages/ArticleList";
import Pos from "./pages/Pos";
import Checkout from "./pages/Checkout";
import Statistics from "./pages/Statistics";
import InvoiceHistory from "./pages/InvoiceHistory";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import UserManagement from "./pages/UserManagement";
import ResetPassword from "./pages/ResetPassword";

export default function App() {
  const [page, setPage] = React.useState("main_dashboard");
  const [invoices, setInvoices] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [checkoutInvoice, setCheckoutInvoice] = useState(null);
  const [selectedTableToCreate, setSelectedTableToCreate] = useState("");
  const [toastMessage, setToastMessage] = useState(null);

  // Tự động tải hóa đơn "Đang phục vụ" khi mở web hoặc F5
  useEffect(() => {
    fetch("http://localhost:8080/api/orders")
      .then((res) => res.json())
      .then((data) => {
        setAllOrders(data);
        // Lọc ra những hóa đơn chưa thanh toán (Đang phục vụ)
        const activeOrders = data.filter((order) => order.status === "Serving");

        // Format lại dữ liệu cho khớp với những gì file DashBoard.jsx đang cần
        const formattedInvoices = activeOrders.map((order) => ({
          id: order.orderId,
          tableId: order.table?.tableId,
          tableName: order.table?.tableNumber,
          totalPrice: order.totalAmount,
          cashierName: order.cashierName || "Thu ngân",
          cart: (order.orderItems || []).map((item) => {
            // Lấy thẳng menuItem từ DB
            const menuItem = item.menuItem || {};
            return {
              itemId: menuItem.itemId || item.itemId,
              // KHÓA MỤC TIÊU: Chỉ lấy trực tiếp từ menuItem, loại bỏ nhiễu
              nameVi: menuItem.nameVi || menuItem.name || "",
              nameEn: menuItem.nameEn || menuItem.englishName || "",
              price: menuItem.price || 0,
              discount: menuItem.discount || 0,
              imageUrl: menuItem.imageUrl || "",
              qty: item.quantity || 1,
            };
          }),
        }));

        setInvoices(formattedInvoices);
      })
      .catch((err) => console.error("Lỗi khi tải hóa đơn:", err));
  }, [page]);
  // =========================================================================

  const handleSaveInvoice = (invoiceData) => {
    if (editingInvoice) {
      setInvoices(
        invoices.map((inv) =>
          inv.id === editingInvoice.id ? invoiceData : inv,
        ),
      );
    } else {
      setInvoices([...invoices, invoiceData]);
    }
    setEditingInvoice(null);
    setPage("main_dashboard");
  };

  const handleEditInvoice = (invoice) => {
    setEditingInvoice(invoice);
    setPage("pos");
  };

  const handleCreateNew = (tableNumber) => {
    setEditingInvoice(null);
    setSelectedTableToCreate(tableNumber || "");
    setPage("pos");
  };

  const handleCheckout = (invoice) => {
    setCheckoutInvoice(invoice);
    setPage("checkout");
  };

  const handlePaymentSuccess = (invoiceId) => {
    setInvoices(invoices.filter((inv) => inv.id !== invoiceId));
    setToastMessage("Thanh toán thành công");
    setPage("main_dashboard");
    setTimeout(() => setToastMessage(null), 3000);
  };

  const renderPage = () => {
    switch (page) {
      case "checkout":
        return (
          <Checkout
            setPage={setPage}
            invoice={checkoutInvoice}
            onPaymentSuccess={handlePaymentSuccess}
          />
        );
      case "pos":
        return (
          <Pos
            setPage={setPage}
            onSaveInvoice={handleSaveInvoice}
            editingInvoice={editingInvoice}
            initialTableNumber={selectedTableToCreate}
          />
        );
      case "main_dashboard":
        return (
          <DashBoard
            setPage={setPage}
            invoices={invoices}
            onEditInvoice={handleEditInvoice}
            onCreateNew={handleCreateNew}
            onCheckout={handleCheckout}
          />
        );
      case "statistics":
        return <Statistics invoices={allOrders} />;
      case "categories":
        return <Categories />;
      case "foods":
        return <Foods />;
      case "articles":
        return <ArticleList />;
      case "reservations":
        return <Reservations />;
      case "invoice_history":
        return <InvoiceHistory />;
      case "users":
        return <UserManagement />;
      default:
        return (
          <DashBoard
            setPage={setPage}
            invoices={invoices}
            onEditInvoice={handleEditInvoice}
            onCreateNew={handleCreateNew}
            onCheckout={handleCheckout}
          />
        );
    }
  };

  // ... (giữ nguyên phần khai báo state và useEffect ở trên của bạn)

  return (
    <BrowserRouter>
      <Routes>
        {/* Route đăng nhập không cần bảo vệ */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Mọi route khác (/*) sẽ được bọc bởi ProtectedRoute */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              {/* Bê nguyên khối giao diện cũ của bạn vào đây */}
              <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
                <Sidebar setPage={setPage} />
                <main className="flex-1 p-4 md:p-8 overflow-auto">
                  {renderPage()}
                </main>

                {/* Thông báo Toast */}
                {toastMessage && (
                  <div className="fixed top-4 right-4 z-50 bg-[#63b365] text-white px-4 py-3 rounded shadow-lg flex items-center gap-3 animate-fade-in-down">
                    <div className="bg-white/20 rounded-full p-1">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="3"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-sm leading-tight">
                        Thông báo
                      </p>
                      <p className="text-sm">{toastMessage}</p>
                    </div>
                  </div>
                )}
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
