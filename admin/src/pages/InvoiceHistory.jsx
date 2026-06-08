import React, { useState, useEffect } from "react";
import {
  Search,
  X,
  Printer,
  Receipt,
  ChevronLeft,
  ChevronRight,
  Clock,
  Table2,
  CreditCard,
  Banknote,
  CheckCircle2,
  XCircle,
  Coffee,
  Loader2,
  RotateCcw,
  Sparkles,
  Hash,
} from "lucide-react";

export default function InvoiceHistory() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [PaymentLoading, setPaymentLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders");
        const data = await response.json();
        const sortedData = data.sort(
          (a, b) => new Date(b.orderDate) - new Date(a.orderDate),
        );
        setOrders(sortedData);
        setFilteredOrders(sortedData);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu hóa đơn:", error);
      }
    };
    fetchOrders().catch(console.error);
  }, []);

  const handleSearch = () => {
    const lowercasedTerm = searchTerm.toLowerCase();
    const filtered = orders.filter(
      (order) =>
        `hd-${order.orderId}`.toLowerCase().includes(lowercasedTerm) ||
        (order.table &&
          `bàn ${order.table.tableId}`.toLowerCase().includes(lowercasedTerm)),
    );
    setFilteredOrders(filtered);
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const formatCurrency = (amount) => {
    if (amount == null) return "0 đ";
    return amount.toLocaleString("vi-VN") + " đ";
  };

  const formatDateTime = (timeString) => {
    if (!timeString) return "Chưa thanh toán";
    const date = new Date(timeString);
    return new Intl.DateTimeFormat("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour12: false,
    }).format(date);
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setSelectedPayment(null);
    setShowModal(true);
    setPaymentLoading(true);
    fetch(`/api/payments/order/${order.orderId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setSelectedPayment(data))
      .catch((err) => console.error("Lỗi lấy payment:", err))
      .finally(() => setPaymentLoading(false));
  };

  const handlePrint = () => {
    window.print();
  };

  const statusConfig = {
    Paid: {
      label: "Đã thanh toán",
      icon: <CheckCircle2 size={11} />,
      dot: "bg-emerald-400",
      cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    Cancelled: {
      label: "Đã hủy",
      icon: <XCircle size={11} />,
      dot: "bg-rose-400",
      cls: "bg-rose-50 text-rose-600 border-rose-200",
    },
    default: {
      label: "Đang phục vụ",
      icon: <Coffee size={11} />,
      dot: "bg-amber-400",
      cls: "bg-amber-50 text-amber-700 border-amber-200",
    },
  };

  const getStatus = (status) => statusConfig[status] || statusConfig.default;

  return (
    <>
      <style>{`
                @keyframes cardSlideIn {
                    from { opacity: 0; transform: translateY(16px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes modalScale {
                    from { opacity: 0; transform: scale(0.97); filter: blur(4px); }
                    to { opacity: 1; transform: scale(1); filter: blur(0); }
                }
                .invoice-card {
                    animation: cardSlideIn 0.42s cubic-bezier(0.16, 1, 0.3, 1) both;
                }
                .invoice-card:nth-child(1) { animation-delay: 0.04s; }
                .invoice-card:nth-child(2) { animation-delay: 0.08s; }
                .invoice-card:nth-child(3) { animation-delay: 0.12s; }
                .invoice-card:nth-child(4) { animation-delay: 0.16s; }
                .invoice-card:nth-child(5) { animation-delay: 0.20s; }
                .invoice-card:nth-child(6) { animation-delay: 0.24s; }
                .invoice-card:nth-child(7) { animation-delay: 0.28s; }
                .invoice-card:nth-child(8) { animation-delay: 0.32s; }
                .animate-modal-scale {
                    animation: modalScale 0.28s cubic-bezier(0.34, 1.56, 0.64, 1) both;
                }
                .card-shadow {
                    box-shadow: 0 8px 24px -8px rgba(84, 61, 39, 0.08);
                }
                .card-shadow:hover {
                    box-shadow: 0 20px 40px -12px rgba(84, 61, 39, 0.14);
                }
                .modal-scroll::-webkit-scrollbar { width: 4px; }
                .modal-scroll::-webkit-scrollbar-thumb { background: rgba(196,154,108,0.2); border-radius: 4px; }            
            `}</style>

      {/* ── PAGE WRAPPER — màu kem đồng bộ với Foods & Dashboard ── */}
      <div className="p-6 md:p-8 bg-[#FAF8F5] min-h-screen text-[#332A21] font-sans antialiased">
        {/* ── HEADER ── */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 pb-6 border-b border-[#EFEBE4]">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#C49A6C] flex items-center gap-1.5">
              <Sparkles size={12} /> Celesté House · Restaurant
            </span>
            <h1 className="text-3xl font-medium text-[#1A130E] tracking-wide mt-1.5">
              Lịch sử hóa đơn
            </h1>
            <p className="text-xs text-[#A39688] mt-1 font-medium">
              {filteredOrders.length} giao dịch được tìm thấy
            </p>
          </div>

          {/* Search bar */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-80">
              <Search
                size={14}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C49A6C]"
              />
              <input
                type="text"
                placeholder="Tìm số hóa đơn, số bàn..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#EFEBE4] hover:border-[#C49A6C]/40 focus:border-[#C49A6C]/60 text-[#332A21] placeholder:text-[#C5BAB0] text-sm rounded-2xl outline-none transition-all duration-200 shadow-sm"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-4 py-2.5 bg-gradient-to-r from-[#1A130E] to-[#332A21] hover:from-[#332A21] hover:to-[#4A3E33] text-white text-sm font-bold rounded-2xl transition-all duration-200 active:scale-95 shadow-md shadow-black/10"
            >
              Tìm
            </button>
            <button
              onClick={() => {
                setSearchTerm("");
                setFilteredOrders(orders);
                setCurrentPage(1);
              }}
              title="Đặt lại"
              className="p-2.5 bg-white hover:bg-[#EFEBE4] border border-[#EFEBE4] text-[#A39688] hover:text-[#C49A6C] rounded-2xl transition-all duration-200 shadow-sm"
            >
              <RotateCcw size={15} />
            </button>
          </div>
        </div>

        {/* ── CARD GRID ── */}
        {currentOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-[#C5BAB0]">
            <Receipt
              size={40}
              strokeWidth={1}
              className="mb-3 text-[#D6CECC]"
            />
            <p className="text-sm font-medium text-[#A39688]">
              Không tìm thấy hóa đơn nào
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {currentOrders.map((item, index) => {
              const st = getStatus(item.status);
              return (
                <div
                  key={item.orderId || index}
                  className="invoice-card card-shadow bg-white rounded-[28px] border border-[#EFEBE4] overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1.5 cursor-pointer group"
                  onClick={() => handleViewDetails(item)}
                >
                  {/* Card top strip — accent gold */}
                  <div className="h-1.5 w-full bg-gradient-to-r from-[#C49A6C] to-[#E8C99A]" />

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col gap-4">
                    {/* Row 1 — ID + status badge */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-[#FAF8F5] border border-[#EFEBE4] flex items-center justify-center flex-shrink-0">
                          <Receipt size={15} className="text-[#C49A6C]" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-[#A39688]">
                            Mã hóa đơn
                          </p>
                          <p className="text-sm font-extrabold text-[#1A130E] tracking-wide">
                            HD-{item.orderId}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border flex-shrink-0 ${st.cls}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${st.dot}`}
                        ></span>
                        {st.label}
                      </span>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-[#F3EDE7]" />

                    {/* Row 2 — Table + Amount */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-[#726456]">
                        <Table2 size={13} className="text-[#C49A6C]" />
                        <span className="font-semibold">
                          {item.table ? `Bàn ${item.table.tableId}` : "Mang đi"}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] font-bold uppercase tracking-wider text-[#A39688]">
                          Tổng tiền
                        </p>
                        <p className="text-base font-extrabold text-[#1A130E]">
                          {formatCurrency(item.totalAmount)}
                        </p>
                      </div>
                    </div>

                    {/* Row 3 — Time */}
                    <div className="flex items-center gap-1.5 text-xs text-[#A39688] bg-[#FAF8F5] rounded-xl px-3 py-2 border border-[#EFEBE4]">
                      <Clock
                        size={11}
                        className="text-[#C49A6C] flex-shrink-0"
                      />
                      <span className="font-medium">
                        {formatDateTime(item.orderDate)}
                      </span>
                    </div>
                  </div>

                  {/* Card Footer — CTA */}
                  <div className="px-5 pb-5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(item);
                      }}
                      className="w-full py-2.5 bg-[#FAF8F5] hover:bg-gradient-to-r hover:from-[#1A130E] hover:to-[#332A21] border border-[#EFEBE4] group-hover:border-transparent text-[#726456] group-hover:text-white text-xs font-bold uppercase tracking-wider rounded-2xl transition-all duration-300"
                    >
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── PAGINATION ── */}
        {totalPages > 0 && (
          <div className="flex justify-between items-center mt-8 pt-5 border-t border-[#EFEBE4]">
            <p className="text-xs text-[#A39688]">
              Hiển thị{" "}
              <span className="font-bold text-[#332A21]">
                {indexOfFirstItem + 1}–
                {Math.min(indexOfLastItem, filteredOrders.length)}
              </span>{" "}
              trong{" "}
              <span className="font-bold text-[#332A21]">
                {filteredOrders.length}
              </span>{" "}
              hóa đơn
            </p>

            <div className="flex items-center gap-1.5">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className="w-8 h-8 rounded-xl flex items-center justify-center border border-[#EFEBE4] bg-white text-[#A39688] hover:text-[#C49A6C] hover:border-[#C49A6C]/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (num) => (
                  <button
                    key={num}
                    onClick={() => paginate(num)}
                    className={`w-8 h-8 rounded-xl text-xs font-bold transition-all shadow-sm ${
                      currentPage === num
                        ? "bg-gradient-to-r from-[#1A130E] to-[#332A21] text-white border-transparent"
                        : "border border-[#EFEBE4] bg-white text-[#A39688] hover:text-[#C49A6C] hover:border-[#C49A6C]/30"
                    }`}
                  >
                    {num}
                  </button>
                ),
              )}
              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className="w-8 h-8 rounded-xl flex items-center justify-center border border-[#EFEBE4] bg-white text-[#A39688] hover:text-[#C49A6C] hover:border-[#C49A6C]/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── MODAL ── */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4 print-hidden">
          <div className="animate-modal-scale bg-white border border-[#EFEBE4] rounded-[32px] w-full max-w-md shadow-2xl shadow-black/10 flex flex-col max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="relative px-7 pt-7 pb-5 border-b border-[#F3EDE7] text-center bg-[#FAF8F5]">
              <button
                onClick={() => setShowModal(false)}
                className="absolute right-4 top-4 w-8 h-8 rounded-xl bg-white border border-[#EFEBE4] flex items-center justify-center text-[#A39688] hover:text-rose-500 hover:border-rose-200 transition-all print-hidden shadow-sm"
              >
                <X size={13} />
              </button>

              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#C49A6C] to-[#9A7346] flex items-center justify-center mx-auto mb-3 shadow-lg shadow-[#C49A6C]/20">
                <Receipt size={18} className="text-white" />
              </div>
              <h2 className="font-medium text-xl text-[#1A130E] tracking-widest uppercase">
                Celesté House
              </h2>
              <p className="text-[10px] text-[#A39688] tracking-[0.15em] mt-0.5">
                Lê Văn Việt · Quận 9 · TP. Hồ Chí Minh
              </p>
              <p className="text-[10px] text-[#A39688] tracking-[0.12em]">
                Hotline: +84 123 456 789
              </p>

              <div className="mt-4 inline-flex items-center gap-1.5 px-4 py-1.5 border border-[#C49A6C]/30 rounded-full bg-[#C49A6C]/5">
                <Hash size={10} className="text-[#C49A6C]" />
                <span className="text-xs font-bold tracking-widest text-[#C49A6C] uppercase">
                  HD-{selectedOrder.orderId}
                </span>
              </div>
              <p className="text-[11px] text-[#A39688] mt-1.5">
                {formatDateTime(
                  selectedPayment?.paymentTime || selectedOrder.orderDate,
                )}
              </p>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto modal-scroll px-7 py-5 space-y-4">
              {/* Info Grid */}
              <div className="bg-[#FAF8F5] border border-[#EFEBE4] rounded-2xl p-4 space-y-2.5 text-sm">
                <InfoRow
                  label="Mã hóa đơn"
                  value={`HD-${selectedOrder.orderId}`}
                  gold
                />
                <InfoRow
                  label="Bàn"
                  value={
                    selectedOrder.table
                      ? `Bàn ${selectedOrder.table.tableNumber}`
                      : "Mang đi"
                  }
                  icon={<Table2 size={12} />}
                />
                {PaymentLoading ? (
                  <div className="flex items-center gap-2 text-[#A39688] pt-1">
                    <Loader2
                      size={12}
                      className="animate-spin text-[#C49A6C]"
                    />
                    <span className="text-xs">Đang tải...</span>
                  </div>
                ) : (
                  selectedPayment && (
                    <>
                      <InfoRow
                        label="Khách hàng"
                        value={selectedPayment.customerName}
                      />
                      <InfoRow label="SĐT" value={selectedPayment.phone} />
                      <InfoRow
                        label="Thanh toán"
                        value={
                          selectedPayment.paymentMethod === "Cash"
                            ? "Tiền mặt"
                            : "VNPay"
                        }
                        icon={
                          selectedPayment.paymentMethod === "Cash" ? (
                            <Banknote size={12} />
                          ) : (
                            <CreditCard size={12} />
                          )
                        }
                      />
                    </>
                  )
                )}
              </div>

              {/* Items */}
              <div>
                <p className="text-[9px] font-black tracking-[0.2em] uppercase text-[#A39688] mb-3">
                  Danh sách món ăn
                </p>
                <div className="space-y-0.5">
                  {selectedOrder.orderItems &&
                  selectedOrder.orderItems.length > 0 ? (
                    selectedOrder.orderItems.map((item, idx) => {
                      const nameVi =
                        item.menuItem?.nameVi ||
                        item.menuItem?.name ||
                        "Tên món";
                      const nameEn =
                        item.menuItem?.nameEn ||
                        item.menuItem?.englishName ||
                        "";
                      const subtotal =
                        item.subtotal || item.menuItem?.price * item.quantity;
                      return (
                        <div
                          key={idx}
                          className="flex items-start justify-between gap-3 py-2.5 border-b border-[#F3EDE7] last:border-0"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-[#1A130E] truncate">
                              {nameVi}
                            </p>
                            {nameEn && (
                              <p className="text-[10px] text-[#A39688] mt-0.5 truncate italic">
                                {nameEn}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-4 flex-shrink-0">
                            <span className="text-xs text-[#A39688] w-14 text-right">
                              {item.quantity} ×{" "}
                              {formatCurrency(item.menuItem?.price)}
                            </span>
                            <span className="text-sm font-extrabold text-[#C49A6C] w-24 text-right">
                              {formatCurrency(subtotal)}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-center py-6 text-[#C5BAB0] text-sm">
                      Không có dữ liệu món ăn
                    </p>
                  )}
                </div>
              </div>

              {/* Total */}
              <div className="bg-gradient-to-r from-[#FAF8F5] to-[#F3EDE7] border border-[#EFEBE4] rounded-2xl px-5 py-4 flex justify-between items-center">
                <span className="text-sm font-bold text-[#A39688] uppercase tracking-wider">
                  Tổng cộng
                </span>
                <span className="text-xl font-extrabold text-[#1A130E]">
                  {formatCurrency(selectedOrder?.totalAmount)}
                </span>
              </div>

              <p className="text-center text-[11px] text-[#C5BAB0] italic py-1">
                Cảm ơn quý khách · Hẹn gặp lại
              </p>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-[#F3EDE7] bg-[#FAF8F5] flex gap-2.5 print-hidden">
              <button
                onClick={handlePrint}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white hover:bg-[#EFEBE4] border border-[#EFEBE4] text-[#726456] text-xs font-bold uppercase tracking-wider rounded-2xl transition-all shadow-sm"
              >
                <Printer size={13} />
                In hóa đơn
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 bg-gradient-to-r from-[#1A130E] to-[#332A21] hover:from-[#332A21] hover:to-[#4A3E33] text-white text-xs font-bold uppercase tracking-wider rounded-2xl transition-all active:scale-95 shadow-md shadow-black/10"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ── In modal ── */}
      {showModal && selectedOrder && (
        <div className="print-area" style={{ display: "none" }}>
          <div
            style={{
              textAlign: "center",
              padding: "28px 28px 20px",
              borderBottom: "1px dashed #CCC5BA",
            }}
          >
            <p
              style={{
                fontSize: 10,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#C49A6C",
                fontWeight: 700,
                margin: "0 0 6px",
              }}
            >
              ✦ Nhà hàng ✦
            </p>
            <h2
              style={{
                fontFamily: "serif",
                fontSize: 22,
                fontWeight: 600,
                color: "#1A130E",
                margin: "0 0 4px",
              }}
            >
              CELESTÉ HOUSE
            </h2>
            <p style={{ fontSize: 12, color: "#A39688", margin: "0 0 2px" }}>
              Lê Văn Việt · Quận 9 · TP. Hồ Chí Minh
            </p>
            <p style={{ fontSize: 12, color: "#A39688", margin: 0 }}>
              Hotline: +84 123 456 789
            </p>
            <h3
              style={{
                fontSize: 14,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                margin: "16px 0 6px",
                color: "#2A1F15",
              }}
            >
              Hóa đơn thanh toán
            </h3>
            <p style={{ fontSize: 12, color: "#7A6A5A", margin: "0 0 2px" }}>
              Mã HĐ: HD-{selectedOrder.orderId}
            </p>
            <p style={{ fontSize: 12, color: "#7A6A5A", margin: 0 }}>
              {formatDateTime(
                selectedPayment?.paymentTime || selectedOrder.orderDate,
              )}
            </p>
          </div>

          <div
            style={{
              padding: "16px 28px",
              borderBottom: "1px dashed #CCC5BA",
              display: "flex",
              flexDirection: "column",
              gap: 6,
              fontSize: 13,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#A39688" }}>Mã hóa đơn</span>
              <span style={{ fontWeight: 600, color: "#C49A6C" }}>
                HD-{selectedOrder.orderId}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#A39688" }}>Bàn</span>
              <span style={{ fontWeight: 600, color: "#2A1F15" }}>
                {selectedOrder.table
                  ? `Bàn ${selectedOrder.table.tableNumber}`
                  : "Mang đi"}
              </span>
            </div>
            {selectedPayment && (
              <>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ color: "#A39688" }}>Khách hàng</span>
                  <span style={{ fontWeight: 600, color: "#2A1F15" }}>
                    {selectedPayment.customerName}
                  </span>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ color: "#A39688" }}>SĐT</span>
                  <span style={{ fontWeight: 600, color: "#2A1F15" }}>
                    {selectedPayment.phone}
                  </span>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ color: "#A39688" }}>Thanh toán</span>
                  <span style={{ fontWeight: 600, color: "#2A1F15" }}>
                    {selectedPayment.paymentMethod === "Cash"
                      ? "Tiền mặt"
                      : "VNPay"}
                  </span>
                </div>
              </>
            )}
          </div>

          <div style={{ padding: "16px 28px" }}>
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#A39688",
                margin: "0 0 10px",
              }}
            >
              Danh sách món ăn
            </p>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 13,
              }}
            >
              <thead>
                <tr style={{ borderBottom: "1px solid #2A1F15" }}>
                  {["#", "Món ăn", "SL", "Đơn giá", "T. tiền"].map((h, i) => (
                    <th
                      key={h}
                      style={{
                        padding: "6px 4px",
                        textAlign:
                          i === 0
                            ? "center"
                            : i < 2
                              ? "left"
                              : i === 2
                                ? "center"
                                : "right",
                        fontWeight: 700,
                        fontSize: 12,
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {selectedOrder.orderItems?.map((item, idx) => {
                  const nameVi =
                    item.menuItem?.nameVi || item.menuItem?.name || "Tên món";
                  const nameEn =
                    item.menuItem?.nameEn || item.menuItem?.englishName || "";
                  const subtotal =
                    item.subtotal || item.menuItem?.price * item.quantity;
                  return (
                    <tr
                      key={idx}
                      style={{ borderBottom: "1px dashed #DDD5C8" }}
                    >
                      <td
                        style={{
                          padding: "10px 4px",
                          textAlign: "center",
                          color: "#A39688",
                        }}
                      >
                        {idx + 1}
                      </td>
                      <td style={{ padding: "10px 4px" }}>
                        <p
                          style={{
                            fontWeight: 500,
                            margin: 0,
                            color: "#1A130E",
                          }}
                        >
                          {nameVi}
                        </p>
                        {nameEn && (
                          <p
                            style={{
                              fontSize: 11,
                              color: "#A39688",
                              margin: 0,
                            }}
                          >
                            {nameEn}
                          </p>
                        )}
                      </td>
                      <td style={{ padding: "10px 4px", textAlign: "center" }}>
                        {item.quantity}
                      </td>
                      <td
                        style={{
                          padding: "10px 4px",
                          textAlign: "right",
                          color: "#7A6A5A",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {formatCurrency(item.menuItem?.price)}
                      </td>
                      <td
                        style={{
                          padding: "10px 4px",
                          textAlign: "right",
                          fontWeight: 700,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {formatCurrency(subtotal)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div
              style={{
                borderTop: "1px solid #2A1F15",
                marginTop: 12,
                paddingTop: 12,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontWeight: 700, fontSize: 14 }}>Tổng cộng</span>
              <span style={{ fontWeight: 700, fontSize: 22, color: "#A07842" }}>
                {formatCurrency(selectedOrder?.totalAmount)}
              </span>
            </div>
            <p
              style={{
                textAlign: "center",
                fontSize: 12,
                color: "#A39688",
                fontStyle: "italic",
                marginTop: 20,
              }}
            >
              Cảm ơn quý khách · Hẹn gặp lại ✦
            </p>
          </div>
        </div>
      )}
    </>
  );
}

function InfoRow({ label, value, gold, icon }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-[#A39688] text-xs">{label}</span>
      <span
        className={`text-xs font-semibold flex items-center gap-1 ${gold ? "text-[#C49A6C]" : "text-[#332A21]"}`}
      >
        {icon && <span className="text-[#A39688]">{icon}</span>}
        {value}
      </span>
    </div>
  );
}
