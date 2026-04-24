import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import DashBoard from "./pages/Dashboard";
import Categories from "./pages/Categories";
import Reservations from "./pages/ReservationList";
import Pos from "./pages/Pos";
import Checkout from "./pages/Checkout";
import Statistics from "./pages/Statistics";
import InvoiceHistory from "./pages/InvoiceHistory";

export default function App() {
  const [page, setPage] = React.useState("main_dashboard");
  const [invoices, setInvoices] = useState([]);

  // Thêm state để biết mình đang "Sửa" hóa đơn nào (nếu null tức là tạo mới)
  const [editingInvoice, setEditingInvoice] = useState(null);

  // TẠO STATE LƯU HÓA ĐƠN ĐANG CHỜ THANH TOÁN
  const [checkoutInvoice, setCheckoutInvoice] = useState(null);

  const [toastMessage, setToastMessage] = useState(null);

  // Hàm lưu hóa đơn (Dùng chung cho cả Tạo mới và Cập nhật)
  const handleSaveInvoice = (invoiceData) => {
    if (editingInvoice) {
      // Nếu đang sửa: Tìm hóa đơn cũ theo ID và cập nhật nội dung mới
      setInvoices(
        invoices.map((inv) =>
          inv.id === editingInvoice.id ? invoiceData : inv,
        ),
      );
    } else {
      // Nếu tạo mới: Thêm vào mảng như bình thường
      setInvoices([...invoices, invoiceData]);
    }
    setEditingInvoice(null); // Lưu xong thì xóa trạng thái đang sửa
    setPage("main_dashboard");
  };

  // Hàm kích hoạt chế độ sửa khi bấm "Đổi bàn" hoặc "Thêm món"
  const handleEditInvoice = (invoice) => {
    setEditingInvoice(invoice);
    setPage("pos");
  };

  // Hàm kích hoạt chế độ tạo mới khi bấm dấu Cộng
  const handleCreateNew = () => {
    setEditingInvoice(null);
    setPage("pos");
  };

  // HÀM CHUYỂN SANG TRANG THANH TOÁN
  const handleCheckout = (invoice) => {
    setCheckoutInvoice(invoice);
    setPage("checkout");
  };

  // HÀM XỬ LÝ KHI THANH TOÁN THÀNH CÔNG
  const handlePaymentSuccess = (invoiceId) => {
    // Xóa hóa đơn vừa thanh toán khỏi danh sách
    setInvoices(invoices.filter((inv) => inv.id !== invoiceId));

    // Bật thông báo
    setToastMessage("Thanh toán thành công");

    // Chuyển về trang Dashboard
    setPage("main_dashboard");

    // Tự động tắt thông báo sau 3 giây (3000 milliseconds)
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
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
        // Truyền hàm handleAddInvoice xuống Pos
        return (
          <Pos
            setPage={setPage}
            onSaveInvoice={handleSaveInvoice}
            editingInvoice={editingInvoice}
          />
        );
      case "main_dashboard":
        // Truyền danh sách hóa đơn xuống DashBoard1 để hiển thị
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
        return <Statistics invoices={invoices} />;
      case "categories":
        return <Categories />;
      case "reservations":
        return <Reservations />;
      case "invoice_history":
        return <InvoiceHistory />;
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

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <Sidebar setPage={setPage} />
      {/* flex-1 giúp nội dung chính chiếm hết phần còn lại */}
      <main className="flex-1 p-4 md:p-8 overflow-auto">{renderPage()}</main>
      {/* 4. GIAO DIỆN THÔNG BÁO (NỔI Ở GÓC PHẢI TRÊN CÙNG) */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-[#63b365] text-white px-4 py-3 rounded shadow-lg flex items-center gap-3 animate-fade-in-down">
          {/* Icon dấu tích */}
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
            <p className="font-bold text-sm leading-tight">Thông báo</p>
            <p className="text-sm">{toastMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}
