import React, { useEffect, useMemo, useState } from "react";
import { Users } from "lucide-react"; // Import icon Users từ lucide-react

export default function DashBoard({
  invoices = [],
  onEditInvoice,
  onCreateNew,
  onCheckout,
}) {
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
    if (invoice.tableId) {
      map[invoice.tableId] = invoice;
    }
    return map;
  }, {});

  const reservationsByTableId = useMemo(() => {
    return reservations.reduce((map, reservation) => {
      if (
        reservation.status === "CANCELLED" ||
        reservation.status === "COMPLETED"
      )
        return map;

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
      .map((reservation) => ({
        ...reservation,
        reservationDate: new Date(reservation.reservationTime),
      }))
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
    const isAvailable =
      table.status === "Available" && !invoice && !upcomingReservation;

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

    setActiveInvoice({
      tableId: table.tableId,
      tableName: table.tableNumber,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setActiveInvoice(null);
    setActiveTable(null);
    setActiveReservation(null);
  };

  const onChooseAddDish = () => {
    if (activeInvoice) onEditInvoice(activeInvoice);
    closeModal();
  };

  const onChooseCheckout = () => {
    if (activeInvoice) onCheckout(activeInvoice);
    closeModal();
  };

  const onChooseArrived = async () => {
    if (activeReservation) {
      try {
        const response = await fetch(
          `http://localhost:8080/api/reservations/${activeReservation.reservationId}/complete`,
          {
            method: "PUT",
          },
        );
        const updatedRes = await response.json();

        // Cập nhật lại UI để ẩn cái mác Đặt bàn đi
        setReservations((prev) =>
          prev.map((item) =>
            item.reservationId === updatedRes.reservationId ? updatedRes : item,
          ),
        );
      } catch (err) {
        console.error("Lỗi khi xác nhận khách đến:", err);
      }
    }
    if (activeTable) {
      onCreateNew(activeTable.tableNumber);
    }
    closeModal();
  };

  const handleCancelReservation = async () => {
    if (!activeReservation) return;

    const confirmCancel = window.confirm(
      "Bạn có chắc chắn muốn hủy đặt bàn này không?",
    );
    if (!confirmCancel) return;

    try {
      const response = await fetch(
        `http://localhost:8080/api/reservations/${activeReservation.reservationId}/cancel`,
        {
          method: "PUT",
        },
      );
      const updated = await response.json();
      setReservations((prev) =>
        prev.map((item) =>
          item.reservationId === updated.reservationId ? updated : item,
        ),
      );
      closeModal();
    } catch (err) {
      console.error("Lỗi hủy đặt bàn:", err);
      alert("Hủy đặt bàn thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Quản lý bàn</h2>
          <p className="text-sm text-slate-500">
            Chọn bàn để mở order hoặc quản lý bàn đang phục vụ.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="rounded-xl bg-white p-8 shadow-sm text-center text-slate-500">
          Đang tải dữ liệu bàn...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {tables.length > 0 ? (
            tables.map((table) => {
              const invoice = invoiceByTableId[table.tableId];
              const upcomingReservation = getUpcomingReservation(table);
              const todayReservationCount = getTodayReservationCount(table);
              const isReservedSoon =
                !invoice &&
                table.status === "Available" &&
                !!upcomingReservation;
              const isAvailable =
                table.status === "Available" && !invoice && !isReservedSoon;
              const statusLabel = invoice
                ? "Đang phục vụ"
                : isReservedSoon
                  ? "Đã đặt trước"
                  : isAvailable
                    ? "Trống"
                    : table.status;

              const cardClass = invoice
                ? "border-red-300 bg-red-100"
                : isReservedSoon
                  ? "border-yellow-300 bg-yellow-100"
                  : isAvailable
                    ? "border-emerald-300 bg-emerald-100"
                    : "border-gray-300 bg-gray-100";

              const minutesLeft = upcomingReservation
                ? Math.max(
                    0,
                    Math.ceil(
                      (new Date(upcomingReservation.reservationTime) -
                        new Date()) /
                        60000,
                    ),
                  )
                : null;

              return (
                <button
                  key={table.tableId}
                  onClick={() => handleCardClick(table)}
                  className={`text-left rounded-3xl border-2 ${cardClass} shadow-sm p-5 transition hover:shadow-lg focus:outline-none h-36 flex flex-col`}
                >
                  {/* Tiêu đề Bàn và Capacity */}
                  <div className="flex items-center justify-between w-full mb-2">
                    <span className="text-lg font-bold text-slate-900">
                      Bàn {table.tableNumber}
                    </span>

                    {/* Hiển thị Capacity */}
                    {table.capacity && (
                      <div className="flex items-center gap-1 text-slate-600 bg-white/50 px-2 py-1 rounded-full text-xs font-semibold shadow-sm">
                        <Users size={14} />
                        <span>{table.capacity}</span>
                      </div>
                    )}
                  </div>

                  {isAvailable ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center -mt-2">
                      <span className="inline-block rounded-full bg-emerald-200 text-emerald-800 px-3 py-1 text-xs font-semibold">
                        {statusLabel}
                      </span>
                      {todayReservationCount > 0 && (
                        <p className="mt-2 text-xs text-slate-600">
                          Hôm nay: {todayReservationCount} lượt đặt
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col flex-1 justify-between">
                      <div>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] inline-block ${invoice ? "bg-red-200 text-red-800" : "bg-yellow-200 text-yellow-800"}`}
                        >
                          {statusLabel}
                        </span>
                      </div>

                      <div className="text-sm text-slate-700 mt-2">
                        {invoice ? (
                          <p className="font-semibold">
                            Tổng: {invoice.totalPrice.toLocaleString()} VNĐ
                          </p>
                        ) : isReservedSoon ? (
                          <p className="font-semibold">
                            Còn {minutesLeft} phút tới giờ đặt
                          </p>
                        ) : null}
                        {todayReservationCount > 0 && (
                          <p className="mt-1 text-xs text-slate-600">
                            Hôm nay: {todayReservationCount} lượt đặt
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </button>
              );
            })
          ) : (
            <div className="rounded-xl bg-white p-8 shadow-sm text-center text-slate-500 col-span-full">
              Không có dữ liệu bàn.
            </div>
          )}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={closeModal}
          ></div>
          <div className="relative bg-white rounded-xl shadow-lg w-[420px] p-6 z-10">
            <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
              Bàn {activeTable?.tableNumber || activeInvoice?.tableName}
              {activeTable?.capacity && (
                <span className="text-sm font-normal text-slate-500 flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-full">
                  <Users size={14} /> {activeTable.capacity} người
                </span>
              )}
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              {activeReservation && !activeInvoice
                ? "Bàn đã đặt trước. Chọn hành động phù hợp."
                : "Chọn hành động cho bàn này."}
            </p>

            {activeReservation && !activeInvoice ? (
              <div className="space-y-3">
                <div className="rounded-2xl bg-yellow-50 p-4 text-sm text-slate-700">
                  <p className="font-semibold">Đã đặt trước</p>
                  <p>
                    Còn{" "}
                    {Math.max(
                      0,
                      Math.ceil(
                        (new Date(activeReservation.reservationTime) -
                          new Date()) /
                          60000,
                      ),
                    )}{" "}
                    phút tới giờ đặt.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
                    onClick={onChooseArrived}
                  >
                    Khách đã đến
                  </button>
                  <button
                    className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700"
                    onClick={handleCancelReservation}
                  >
                    Hủy đặt bàn
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-3">
                <button
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
                  onClick={onChooseAddDish}
                >
                  Thêm món
                </button>
                <button
                  className="flex-1 bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700"
                  onClick={onChooseCheckout}
                >
                  Thanh toán
                </button>
              </div>
            )}

            <button
              className="mt-4 text-sm text-slate-500 underline block w-full text-center hover:text-slate-700"
              onClick={closeModal}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
