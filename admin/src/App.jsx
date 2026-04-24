import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import DashBoard from "./pages/Dashboard";
import Categories from "./pages/Categories";
import Reservations from "./pages/ReservationList";
import Foods from "./pages/Foods";
import Pos from "./pages/Pos";
import Checkout from "./pages/Checkout";
import Statistics from "./pages/Statistics";

export default function App() {
  const [page, setPage] = React.useState("main_dashboard");
  const [invoices, setInvoices] = useState([]);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [checkoutInvoice, setCheckoutInvoice] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const handleSaveInvoice = (invoiceData) => {
    if (editingInvoice) {
      setInvoices(invoices.map((inv) => inv.id === editingInvoice.id ? invoiceData : inv));
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

  const handleCreateNew = () => {
    setEditingInvoice(null);
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
        return <Checkout setPage={setPage} invoice={checkoutInvoice} onPaymentSuccess={handlePaymentSuccess} />;
      case "pos":
        return <Pos setPage={setPage} onSaveInvoice={handleSaveInvoice} editingInvoice={editingInvoice} />;
      case "main_dashboard":
        return <DashBoard setPage={setPage} invoices={invoices} onEditInvoice={handleEditInvoice} onCreateNew={handleCreateNew} onCheckout={handleCheckout} />;
      case "statistics":
        return <Statistics invoices={invoices} />;
      case "categories":
        return <Categories />;
      case "foods":
        return <Foods />;
      case "reservations":
        return <Reservations />;
      default:
        return <DashBoard setPage={setPage} invoices={invoices} onEditInvoice={handleEditInvoice} onCreateNew={handleCreateNew} onCheckout={handleCheckout} />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <Sidebar setPage={setPage} />
      <main className="flex-1 p-4 md:p-8 overflow-auto">{renderPage()}</main>
      
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-[#63b365] text-white px-4 py-3 rounded shadow-lg flex items-center gap-3 animate-fade-in-down">
          <div className="bg-white/20 rounded-full p-1">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
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