import React, { useState, useMemo } from "react";
import {
  DollarSign,
  ShoppingCart,
  CalendarDays,
  CreditCard,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Statistics({ invoices = [] }) {
  // STATE LƯU TRỮ NGÀY PHỤC VỤ CHO VIỆC CHUYỂN ĐỔI TUẦN (Mặc định là ngày hiện tại của máy)
  const [currentDate, setCurrentDate] = useState(new Date());

  // Hàm lùi lại 1 tuần
  const handlePrevWeek = () => {
    const prev = new Date(currentDate);
    prev.setDate(currentDate.getDate() - 7);
    setCurrentDate(prev);
  };

  // Hàm tiến lên 1 tuần
  const handleNextWeek = () => {
    const next = new Date(currentDate);
    next.setDate(currentDate.getDate() + 7);
    setCurrentDate(next);
  };

  // HÀM TÍNH TOÁN DỮ LIỆU THỐNG KÊ
  const stats = useMemo(() => {
    const now = new Date(); // Luôn lấy giờ thực tế máy tính cho ô thống kê Tổng Quan và Tháng
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Xác định Thứ 2 của tuần đang được lựa chọn (phụ thuộc vào currentDate)
    const dayOfWeek = currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1;
    const startOfWeek = new Date(currentDate);
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(currentDate.getDate() - dayOfWeek);

    // Tạo mẫu cấu trúc biểu đồ 7 ngày của tuần đang chọn
    const weeklyData = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      return {
        name: `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`,
        dateObj: d,
        revenue: 0,
      };
    });

    let todayOrders = 0;
    let todayRevenue = 0;
    let monthlyOrders = 0;
    let monthlyRevenue = 0;
    const dishMap = {};

    invoices.forEach((order) => {
      if (!order.orderDate) return;

      // Chấp nhận các trạng thái đã thanh toán thành công (Bảo toàn tiếng Anh lẫn tiếng Việt)
      const isPaid =
        order.status === "Paid" ||
        order.status === "Completed" ||
        order.status === "Đã thanh toán";
      if (!isPaid) return;

      let invoiceDate;
      if (Array.isArray(order.orderDate)) {
        const [year, month, day, hour = 0, minute = 0, second = 0] =
          order.orderDate;
        invoiceDate = new Date(year, month - 1, day, hour, minute, second);
      } else {
        invoiceDate = new Date(order.orderDate);
      }

      if (isNaN(invoiceDate.getTime())) return;

      const amount = Number(order.totalAmount) || 0;

      // 1. Tính toán số liệu Tổng Quan cố định theo giờ thực tế trên máy tính của bạn
      if (invoiceDate.toDateString() === now.toDateString()) {
        todayOrders++;
        todayRevenue += amount;
      }

      if (
        invoiceDate.getMonth() === currentMonth &&
        invoiceDate.getFullYear() === currentYear
      ) {
        monthlyOrders++;
        monthlyRevenue += amount;

        // 2. ĐÃ SỬA: Lấy chính xác tên món, số lượng và thành tiền từ Entity OrderItem gốc
        const items = order.orderItems || [];
        items.forEach((item) => {
          const dishName =
            item.menuItem?.name || item.name || "Món chưa rõ tên";
          if (!dishMap[dishName]) {
            dishMap[dishName] = { name: dishName, qty: 0, revenue: 0 };
          }
          // Ưu tiên đọc trường 'quantity' và trường 'subtotal' từ Java gửi sang
          const qty = Number(item.quantity) || Number(item.qty) || 0;
          const subtotal =
            Number(item.subtotal) ||
            (Number(item.menuItem?.price) || Number(item.price) || 0) * qty;

          dishMap[dishName].qty += qty;
          dishMap[dishName].revenue += subtotal;
        });
      }

      // 3. Tính doanh thu đổ vào 7 cột tuần đang chọn
      const dateOnly = new Date(invoiceDate);
      dateOnly.setHours(0, 0, 0, 0);

      const diffTime = dateOnly.getTime() - startOfWeek.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays >= 0 && diffDays < 7) {
        weeklyData[diffDays].revenue += amount;
      }
    });

    // Sắp xếp danh sách món ăn phổ biến theo số lượng bán ra giảm dần
    const topDishes = Object.values(dishMap)
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 10)
      .map((dish, index) => ({
        rank: index + 1,
        name: dish.name,
        qty: dish.qty,
        revenue: dish.revenue.toLocaleString(),
      }));

    while (topDishes.length < 10) {
      topDishes.push({
        rank: topDishes.length + 1,
        name: "-",
        qty: 0,
        revenue: "0",
      });
    }

    // Định dạng chuỗi hiển thị khoảng thời gian tuần (ví dụ: "18/05 - 24/05")
    const endOfWeekDate = new Date(startOfWeek);
    endOfWeekDate.setDate(startOfWeek.getDate() + 6);
    const weekLabel = `${String(startOfWeek.getDate()).padStart(2, "0")}/${String(startOfWeek.getMonth() + 1).padStart(2, "0")} - ${String(endOfWeekDate.getDate()).padStart(2, "0")}/${String(endOfWeekDate.getMonth() + 1).padStart(2, "0")}`;

    return {
      todayOrders,
      todayRevenue: todayRevenue.toLocaleString(),
      monthlyOrders,
      monthlyRevenue: monthlyRevenue.toLocaleString(),
      weeklyData: weeklyData.map((d) => ({ name: d.name, revenue: d.revenue })),
      topDishes,
      weekLabel,
    };
  }, [invoices, currentDate]); // Sẽ chạy lại tính toán khi danh sách hóa đơn hoặc ngày chọn thay đổi

  const renderRank = (rank) => {
    if (rank === 1) return "🥇 1";
    if (rank === 2) return "🥈 2";
    if (rank === 3) return "🥉 3";
    return <span className="pl-2 text-gray-500">{rank}</span>;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-100 shadow-lg rounded-lg">
          <p className="text-gray-500 text-xs mb-1">{label}</p>
          <p className="font-bold text-emerald-500">
            {payload[0].value.toLocaleString()} đ
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-full">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Tổng quan</h1>

      {/* === PHẦN 1: 4 Ô THỐNG KÊ === */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase">
              Doanh thu hôm nay
            </p>
            <p className="text-xl font-bold text-gray-800">
              {stats.todayRevenue} VNĐ
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <CreditCard size={24} />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase">
              Doanh thu tháng
            </p>
            <p className="text-xl font-bold text-gray-800">
              {stats.monthlyRevenue} VNĐ
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
            <ShoppingCart size={24} />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase">
              Hóa đơn hôm nay
            </p>
            <p className="text-xl font-bold text-gray-800">
              {stats.todayOrders}
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
            <CalendarDays size={24} />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase">
              Hóa đơn tháng
            </p>
            <p className="text-xl font-bold text-gray-800">
              {stats.monthlyOrders}
            </p>
          </div>
        </div>
      </div>

      {/* === PHẦN 2: BIỂU ĐỒ VÀ DANH SÁCH MÓN ĂN === */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CỘT TRÁI: BIỂU ĐỒ DOANH THU CÓ NÚT BẤM CHUYỂN TUẦN */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:col-span-2 flex flex-col h-[420px]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="font-bold text-gray-800">Doanh thu trong tuần</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Khoảng thời gian: {stats.weekLabel}
              </p>
            </div>

            {/* CỤM NÚT DI CHUYỂN QUA LẠI GIỮA CÁC TUẦN */}
            <div className="flex items-center gap-1.5 self-end sm:self-auto bg-gray-100 p-1 rounded-lg border border-gray-200 shadow-sm">
              <button
                onClick={handlePrevWeek}
                className="p-1.5 bg-white hover:bg-gray-50 rounded-md transition border border-gray-200 text-gray-600 hover:text-gray-900 shadow-sm"
                title="Tuần trước"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-2.5 py-1 text-xs font-semibold bg-white hover:bg-gray-50 border border-gray-200 rounded-md text-blue-600 shadow-sm transition"
              >
                Tuần này
              </button>
              <button
                onClick={handleNextWeek}
                className="p-1.5 bg-white hover:bg-gray-50 rounded-md transition border border-gray-200 text-gray-600 hover:text-gray-900 shadow-sm"
                title="Tuần sau"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats.weeklyData}
                margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f3f4f6"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "#f9fafb" }}
                />
                <Bar
                  dataKey="revenue"
                  fill="#4ade80"
                  radius={[4, 4, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CỘT PHẢI: BẢNG MÓN ĂN PHỔ BIẾN */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-[420px] overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-white">
            <h2 className="font-bold text-gray-800">
              Món ăn phổ biến theo tháng
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 bg-white shadow-sm z-10 text-gray-500">
                <tr>
                  <th className="p-3 font-medium border-b border-gray-100">
                    Hạng
                  </th>
                  <th className="p-3 font-medium border-b border-gray-100">
                    Tên món
                  </th>
                  <th className="p-3 font-medium text-center border-b border-gray-100">
                    SL
                  </th>
                  <th className="p-3 font-medium text-right border-b border-gray-100">
                    Doanh thu
                  </th>
                </tr>
              </thead>
              <tbody>
                {stats.topDishes.map((dish, i) => (
                  <tr
                    key={i}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-3 font-medium">{renderRank(dish.rank)}</td>
                    <td
                      className="p-3 text-gray-700 font-medium truncate max-w-[120px]"
                      title={dish.name}
                    >
                      {dish.name}
                    </td>
                    <td className="p-3 text-center text-gray-500">
                      {dish.qty}
                    </td>
                    <td className="p-3 text-right font-medium text-emerald-500">
                      {dish.revenue} đ
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
