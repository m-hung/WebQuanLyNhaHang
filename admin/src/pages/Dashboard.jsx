import React, { useEffect, useState } from "react";

export default function DashBoard({
  invoices = [],
  onEditInvoice,
  onCreateNew,
  onCheckout,
}) {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeInvoice, setActiveInvoice] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/tables")
      .then((res) => res.json())
      .then((data) => setTables(data))
      .catch((err) => {
        console.error("Lỗi khi tải bàn:", err);
        setTables([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const invoiceByTableId = invoices.reduce((map, invoice) => {
    if (invoice.tableId) {
      map[invoice.tableId] = invoice;
    }
    return map;
  }, {});

  const handleCardClick = (table) => {
    const invoice = invoiceByTableId[table.tableId];
    const isAvailable = table.status === "Available" && !invoice;
    if (isAvailable) {
      onCreateNew(table.tableNumber);
      return;
    }

    // Bàn có khách => hiển thị modal với 2 lựa chọn
    if (invoice) {
      setActiveInvoice(invoice);
      setModalOpen(true);
    } else {
      // Nếu không có invoice nhưng trạng thái không Available, vẫn mở modal để xử lý
      setActiveInvoice({
        tableId: table.tableId,
        tableName: table.tableNumber,
      });
      setModalOpen(true);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setActiveInvoice(null);
  };

  const onChooseAddDish = () => {
    if (activeInvoice) onEditInvoice(activeInvoice);
    closeModal();
  };

  const onChooseCheckout = () => {
    if (activeInvoice) onCheckout(activeInvoice);
    closeModal();
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
              const isAvailable = table.status === "Available" && !invoice;
              const statusLabel = isAvailable
                ? "Trống"
                : invoice
                  ? "Đang phục vụ"
                  : table.status;

              const cardClass = isAvailable
                ? "border-emerald-300 bg-emerald-100"
                : table.status === "Occupied"
                  ? "border-red-300 bg-red-100"
                  : "border-yellow-300 bg-yellow-100";

              // Entire card is a button
              return (
                <button
                  key={table.tableId}
                  onClick={() => handleCardClick(table)}
                  className={`text-left rounded-3xl border-2 ${cardClass} shadow-sm p-5 transition hover:shadow-lg focus:outline-none h-36`}
                >
                  {isAvailable ? (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                      <span className="text-2xl font-extrabold text-slate-900">
                        Bàn {table.tableNumber}
                      </span>
                      <span className="mt-3 inline-block rounded-full bg-emerald-200 text-emerald-800 px-3 py-1 text-xs font-semibold">
                        {statusLabel}
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col h-full justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-lg font-bold text-slate-900">
                            Bàn {table.tableNumber}
                          </span>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] ${table.status === "Occupied" ? "bg-red-200 text-red-800" : "bg-yellow-200 text-yellow-800"}`}
                          >
                            {statusLabel}
                          </span>
                        </div>
                      </div>

                      <div className="text-sm text-slate-700">
                        {invoice ? (
                          <p className="font-semibold">
                            Tổng: {invoice.totalPrice.toLocaleString()} VNĐ
                          </p>
                        ) : null}
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
            <h3 className="text-lg font-bold mb-2">
              Bàn {activeInvoice?.tableName}
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              Chọn hành động cho bàn này
            </p>

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

            <button
              className="mt-4 text-sm text-slate-500 underline"
              onClick={closeModal}
            >
              Hủy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
