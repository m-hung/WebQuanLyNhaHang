import React, { useEffect, useMemo, useState } from "react";
import { Users, Clock, Plus, CheckSquare, XCircle, Utensils, Coffee, Wine, Sparkles, X } from "lucide-react";

export default function DashBoard({ invoices = [], onEditInvoice, onCreateNew, onCheckout }) {
  const [tables, setTables] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeInvoice, setActiveInvoice] = useState(null);
  const [activeTable, setActiveTable] = useState(null);
  const [activeReservation, setActiveReservation] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:8080/api/tables").then((res) => res.json()),
      fetch("http://localhost:8080/api/reservations").then((res) => res.json()),
    ])
      .then(([tablesData, reservationsData]) => {
        setTables(tablesData || []);
        setReservations(reservationsData || []);
      })
      .catch((err) => {
        console.error("Lỗi khi tải dữ liệu bàn/reservations:", err);
        setTables([]);
        setReservations([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const invoiceByTableId = invoices.reduce((map, invoice) => {
    if (invoice.tableId) map[invoice.tableId] = invoice;
    return map;
  }, {});

  const reservationsByTableId = useMemo(() => {
    return reservations.reduce((map, reservation) => {
      if (reservation.status === "CANCELLED" || reservation.status === "COMPLETED") return map;
      const tableId = reservation.table?.tableId;
      if (!tableId) return map;
      if (!map[tableId]) map[tableId] = [];
      map[tableId].push(reservation);
      return map;
    }, {});
  }, [reservations]);

  const getUpcomingReservation = (table) => {
    const now = new Date();
    const tableReservations = reservationsByTableId[table.tableId] || [];
    return tableReservations
      .map((reservation) => ({ ...reservation, reservationDate: new Date(reservation.reservationTime) }))
      .filter((item) => {
        const minutes = (item.reservationDate - now) / 60000;
        return minutes >= 0 && minutes <= 60;
      })
      .sort((a, b) => a.reservationDate - b.reservationDate)[0];
  };

  const getTodayReservationCount = (table) => {
    const today = new Date();
    const tableReservations = reservationsByTableId[table.tableId] || [];
    return tableReservations.filter((item) => {
      const reservationDate = new Date(item.reservationTime);
      return (
        reservationDate.getFullYear() === today.getFullYear() &&
        reservationDate.getMonth() === today.getMonth() &&
        reservationDate.getDate() === today.getDate()
      );
    }).length;
  };

  const handleCardClick = (table) => {
    const invoice = invoiceByTableId[table.tableId];
    const upcomingReservation = getUpcomingReservation(table);
    const isAvailable = table.status === "Available" && !invoice && !upcomingReservation;

    if (isAvailable) {
      onCreateNew(table.tableNumber);
      return;
    }

    setActiveTable(table);
    setActiveReservation(upcomingReservation || null);

    if (invoice) {
      setActiveInvoice(invoice);
      setModalOpen(true);
      return;
    }

    if (upcomingReservation) {
      setActiveInvoice(null);
      setModalOpen(true);
      return;
    }

    setActiveInvoice({ tableId: table.tableId, tableName: table.tableNumber });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setActiveInvoice(null);
    setActiveTable(null);
    setActiveReservation(null);
  };

  return (
    <div className="p-8 bg-[#FAF8F5] min-h-screen text-[#332A21] font-sans antialiased flex-1">
      
      {/* TÍCH HỢP CSS ANIMATION KHÔNG KHÍ NHÀ HÀNG ẤM CÚNG */}
      <style>{`
        @keyframes bistoFadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes glowGreen {
          0%, 100% { box-shadow: 0 0 8px rgba(16, 185, 129, 0.2), inset 0 0 4px rgba(16, 185, 129, 0.1); border-color: rgba(16, 185, 129, 0.4); }
          50% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.6), inset 0 0 8px rgba(16, 185, 129, 0.2); border-color: rgba(16, 185, 129, 0.8); }
        }
        @keyframes glowRed {
          0%, 100% { box-shadow: 0 0 8px rgba(224, 122, 95, 0.2), inset 0 0 4px rgba(224, 122, 95, 0.1); border-color: rgba(224, 122, 95, 0.4); }
          50% { box-shadow: 0 0 20px rgba(224, 122, 95, 0.6), inset 0 0 8px rgba(224, 122, 95, 0.2); border-color: rgba(224, 122, 95, 0.8); }
        }
        @keyframes glowCyan {
          0%, 100% { box-shadow: 0 0 8px rgba(6, 182, 212, 0.2), inset 0 0 4px rgba(6, 182, 212, 0.1); border-color: rgba(6, 182, 212, 0.4); }
          50% { box-shadow: 0 0 20px rgba(6, 182, 212, 0.6), inset 0 0 8px rgba(6, 182, 212, 0.2); border-color: rgba(6, 182, 212, 0.8); }
        }
        
        .animate-bistro-up {
          animation: bistoFadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .glow-circle-green { animation: glowGreen 2.5s ease-in-out infinite; }
        .glow-circle-red { animation: glowRed 2.5s ease-in-out infinite; }
        .glow-circle-cyan { animation: glowCyan 2.5s ease-in-out infinite; }

        .bistro-shadow {
          box-shadow: 0 16px 32px -12px rgba(84, 61, 39, 0.04);
        }
        .bistro-shadow:hover {
          box-shadow: 0 24px 48px -12px rgba(84, 61, 39, 0.08);
        }
      `}</style>

      {/* --- PHẦN 1: BANNER TIÊU ĐỀ (ĐÃ FIX PHÔNG) --- */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6 border-b border-[#EFEBE4]">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#C49A6C] flex items-center gap-1.5">
            <Sparkles size={12} className="text-[#C49A6C]" /> Sảnh tiệc & Phòng ăn chính
          </span>
          <h1 className="text-3xl font-medium text-[#1A130E] tracking-wide mt-1.5">Sơ đồ dịch vụ trực quan</h1>
        </div>

        {/* Legend chỉ số */}
        <div className="flex items-center gap-5 text-xs font-medium bg-white px-5 py-3 rounded-2xl border border-[#ECE7E0] bistro-shadow">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></span>
            <span className="text-[#726456]">Bàn trống</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E07A5F]"></span>
            <span className="text-[#1A130E] font-bold">Đang dùng bữa</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#06B6D4]"></span>
            <span className="text-[#1A130E] font-bold">Đã đặt hẹn</span>
          </div>
        </div>
      </div>

      {/* --- PHẦN 2: LƯỚI CARD BÀN (ĐÃ FIX PHÔNG THÀNH FONT-SANS CHỮ DÀY SANG TRỌNG) --- */}
      {loading ? (
        <div className="text-center py-24 flex flex-col items-center justify-center gap-2">
          <div className="w-6 h-6 border-2 border-[#C49A6C] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs tracking-wider uppercase font-bold text-[#A39688]">Đang bài trí bàn ăn...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tables.length > 0 ? (
            tables.map((table, index) => {
              const invoice = invoiceByTableId[table.tableId];
              const upcomingReservation = getUpcomingReservation(table);
              const todayReservationCount = getTodayReservationCount(table);
              const isReservedSoon = !invoice && table.status === "Available" && !!upcomingReservation;
              const isAvailable = table.status === "Available" && !invoice && !isReservedSoon;

              let cardBg = "bg-white border-[#EFEBE4]";
              let stateText = "Sẵn sàng đón khách";
              let stateBadge = "bg-[#F4FBF7] text-[#059669] border-[#D1FAE5]";
              let iconVisual = <Utensils size={18} className="text-[#10B981]" />;
              let centerCircleBg = "bg-[#F4FBF7] border-[#A7F3D0]";
              let glowClass = "glow-circle-green";

              if (invoice) {
                cardBg = "bg-gradient-to-br from-[#FFF8F6] to-white border-[#FADCD5]";
                stateText = "Đang phục vụ món";
                stateBadge = "bg-[#FCEEEB] text-[#E07A5F] border-[#F7D2C9]";
                iconVisual = <Wine size={18} className="text-[#E07A5F]" />;
                centerCircleBg = "bg-[#FCEEEB] border-[#F7D2C9]";
                glowClass = "glow-circle-red";
              } else if (isReservedSoon) {
                cardBg = "bg-gradient-to-br from-[#F0FDFA] to-white border-[#CCFBF1]";
                stateText = "Sắp đến giờ hẹn";
                stateBadge = "bg-[#E6FDF9] text-[#0891B2] border-[#99F6E4]";
                iconVisual = <Clock size={18} className="text-[#06B6D4]" />;
                centerCircleBg = "bg-[#E6FDF9] border-[#99F6E4]";
                glowClass = "glow-circle-cyan";
              }

              const minutesLeft = upcomingReservation
                ? Math.max(0, Math.ceil((new Date(upcomingReservation.reservationTime) - new Date()) / 60000))
                : null;

              return (
                <div
                  key={table.tableId}
                  onClick={() => handleCardClick(table)}
                  style={{ animationDelay: `${index * 40}ms` }}
                  className={`animate-bistro-up bistro-shadow rounded-[32px] border p-6 flex items-center justify-between transition-all duration-300 hover:-translate-y-1.5 cursor-pointer relative overflow-hidden group ${cardBg}`}
                >
                  <div className="flex flex-col justify-between h-full space-y-4">
                    <div>
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${stateBadge}`}>
                        {stateText}
                      </span>
                      {/* Đổi thành font-sans font-bold cực sắc nét */}
                      <h3 className="text-2xl font-bold text-[#1A130E] mt-3 tracking-tight">Bàn {table.tableNumber}</h3>
                      <p className="text-xs text-[#8C7E6E] flex items-center gap-1 mt-0.5 font-medium">
                        <Users size={12} className="text-[#C49A6C]" />
                        <span>Sức chứa {table.capacity || 4} chỗ</span>
                      </p>
                    </div>

                    <div className="pt-2">
                      {invoice ? (
                        <p className="text-lg font-extrabold text-[#E07A5F] tracking-tight">
                          {invoice.totalPrice.toLocaleString()} <span className="text-xs font-semibold text-[#8C7E6E]">VND</span>
                        </p>
                      ) : isReservedSoon ? (
                        <p className="text-xs font-bold text-[#0891B2] flex items-center gap-1">
                          Khách đến trong <span className="font-extrabold text-[#1A130E]">{minutesLeft}p</span>
                        </p>
                      ) : (
                        <p className="text-xs text-[#059669] font-bold italic">Đang trống lịch</p>
                      )}
                    </div>
                  </div>

                  <div className={`relative flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-tr from-[#FAF8F5] to-white border border-[#ECE7E0] shadow-sm flex-shrink-0 transition-all duration-300 ${glowClass}`}>
                    <div className={`w-12 h-12 rounded-full border flex items-center justify-center transition-transform duration-500 group-hover:scale-110 ${centerCircleBg}`}>
                      {iconVisual}
                    </div>

                    {todayReservationCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 bg-[#1A130E] text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow">
                        {todayReservationCount}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-16 bg-white border border-dashed border-[#ECE7E0] rounded-[32px] text-[#A39688] text-sm font-light">
              Chưa có cấu hình mặt bằng phòng bàn trong hôm nay.
            </div>
          )}
        </div>
      )}

      {/* --- PHẦN 3: MODAL THAO TÁC --- */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-[#1A130E]/40 backdrop-blur-md" onClick={closeModal}></div>
          
          <div className="relative bg-white rounded-[40px] w-full max-w-sm p-8 shadow-2xl border border-[#ECE7E0] text-center overflow-hidden">
            <button onClick={closeModal} className="absolute top-5 right-5 text-[#B5A89A] hover:text-[#1A130E] p-1.5 rounded-xl hover:bg-slate-50 transition-colors">
              <X size={18} />
            </button>

            <div className="w-14 h-14 bg-[#FAF8F5] border border-[#EFEBE4] rounded-full flex items-center justify-center mx-auto mb-4 text-[#C49A6C]">
              <Wine size={20} />
            </div>

            <h3 className="text-2xl font-bold text-[#1A130E] tracking-tight">
              Bàn số {activeTable?.tableNumber || activeInvoice?.tableName}
            </h3>
            <p className="text-xs text-[#8C7E6E] mb-6 mt-1 font-medium">Chọn lệnh phục vụ thực khách tiếp theo</p>

            {activeReservation && !activeInvoice ? (
              <div className="space-y-4">
                <div className="rounded-2xl bg-[#E6FDF9] border border-[#99F6E4] p-4 text-left">
                  <p className="font-extrabold text-[#0891B2] text-xs tracking-wider uppercase">Lịch hẹn khách dùng bữa</p>
                  <p className="text-xs text-[#726456] mt-1 leading-relaxed font-medium">
                    Khách hàng đã book bàn này. Thời gian dự kiến có mặt tại nhà hàng sau khoảng <span className="font-extrabold text-[#1A130E]">{Math.max(0, Math.ceil((new Date(activeReservation.reservationTime) - new Date()) / 60000))} phút</span> nữa.
                  </p>
                </div>
                <div className="flex gap-3 pt-1">
                  <button
                    className="flex-1 bg-[#1A130E] hover:bg-[#332A21] text-white py-3 rounded-2xl font-bold transition-all active:scale-95 text-xs tracking-wider uppercase shadow-md shadow-black/10"
                    onClick={() => {}}
                  >
                    Đón khách vào
                  </button>
                  <button
                    className="flex-1 bg-white hover:bg-[#FFF8F6] text-[#8C7E6E] hover:text-[#E07A5F] py-3 rounded-2xl font-bold border border-[#E8E3DA] hover:border-[#FADCD5] transition-all active:scale-95 text-xs tracking-wider uppercase"
                    onClick={() => {}}
                  >
                    Hủy đặt hẹn
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <button
                  className="w-full bg-gradient-to-r from-[#1A130E] to-[#332A21] text-white py-3.5 rounded-2xl font-bold text-xs tracking-wider uppercase shadow-lg shadow-black/10 transition-all active:scale-95 flex items-center justify-center gap-2"
                  onClick={() => { if (activeInvoice) onEditInvoice(activeInvoice); closeModal(); }}
                >
                  <Plus size={14} /> Ghi món / Thêm món ăn
                </button>
                <button
                  className="w-full bg-white border-2 border-[#E07A5F] text-[#E07A5F] hover:bg-[#FFF8F6] py-3 rounded-2xl font-black transition-all active:scale-95 text-xs tracking-wider uppercase flex items-center justify-center gap-2"
                  onClick={() => { if (activeInvoice) onCheckout(activeInvoice); closeModal(); }}
                >
                  <CheckSquare size={14} /> Tính tiền & Xuất hóa đơn
                </button>
              </div>
            )}

            <button
              className="mt-6 text-[10px] text-[#B5A89A] hover:text-[#1A130E] block w-full text-center tracking-widest font-black uppercase transition-colors"
              onClick={closeModal}
            >
              Quay lại sảnh chính
            </button>
          </div>
        </div>
      )}
    </div>
  );
}