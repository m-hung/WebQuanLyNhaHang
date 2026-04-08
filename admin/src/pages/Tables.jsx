import React from "react";

export default function Tables() {
  const [tables, setTables] = React.useState([
    { id: 1, status: "Trống" },
    { id: 2, status: "Đang dùng" },
  ]);

  const toggleStatus = (id) => {
    setTables(
      tables.map((t) =>
        t.id === id
          ? { ...t, status: t.status === "Trống" ? "Đang dùng" : "Trống" }
          : t
      )
    );
  };

  return (
    <div>
      <h1 className="text-xl md:text-2xl font-bold mb-4">Quản lý bàn</h1>
      {/* Tự động điều chỉnh số cột theo độ rộng màn hình */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
        {tables.map((t) => (
          <div
            key={t.id}
            onClick={() => toggleStatus(t.id)}
            className="bg-white p-3 md:p-4 rounded shadow cursor-pointer text-center"
          >
            <p className="font-medium">Bàn {t.id}</p>
            <p className={`text-sm ${t.status === 'Trống' ? 'text-green-500' : 'text-red-500'}`}>
              {t.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}