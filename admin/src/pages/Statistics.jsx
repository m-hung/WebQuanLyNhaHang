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
  const [currentDate, setCurrentDate] = useState(new Date());

  const handlePrevWeek = () => {
    const prev = new Date(currentDate);
    prev.setDate(currentDate.getDate() - 7);
    setCurrentDate(prev);
  };

  const handleNextWeek = () => {
    const next = new Date(currentDate);
    next.setDate(currentDate.getDate() + 7);
    setCurrentDate(next);
  };

  const stats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Xác định Tháng và Năm của "tuần đang xem" để lấy mốc doanh thu cao nhất
    const viewedMonth = currentDate.getMonth();
    const viewedYear = currentDate.getFullYear();

    const dayOfWeek = currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1;
    const startOfWeek = new Date(currentDate);
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(currentDate.getDate() - dayOfWeek);

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
    const monthlyDailyRevenues = {}; // Dùng để gom doanh thu tất cả các ngày trong THÁNG ĐANG XEM

    invoices.forEach((order) => {
      if (!order.orderDate) return;

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

      // ---- TÍNH DOANH THU MỖI NGÀY TRONG THÁNG ĐANG XEM ----
      if (
        invoiceDate.getMonth() === viewedMonth &&
        invoiceDate.getFullYear() === viewedYear
      ) {
        const dayKey = invoiceDate.getDate(); // Lấy ngày từ 1-31
        if (!monthlyDailyRevenues[dayKey]) monthlyDailyRevenues[dayKey] = 0;
        monthlyDailyRevenues[dayKey] += amount;
      }

      // ---- Tổng quan (Giờ thực tế) ----
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

        const items = order.orderItems || [];
        items.forEach((item) => {
          const dishName =
            item.menuItem?.name || item.name || "Món chưa rõ tên";
          if (!dishMap[dishName]) {
            dishMap[dishName] = { name: dishName, qty: 0, revenue: 0 };
          }
          const qty = Number(item.quantity) || Number(item.qty) || 0;
          const subtotal =
            Number(item.subtotal) ||
            (Number(item.menuItem?.price) || Number(item.price) || 0) * qty;

          dishMap[dishName].qty += qty;
          dishMap[dishName].revenue += subtotal;
        });
      }

      // ---- Doanh thu Tuần ----
      const dateOnly = new Date(invoiceDate);
      dateOnly.setHours(0, 0, 0, 0);

      const diffTime = dateOnly.getTime() - startOfWeek.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays >= 0 && diffDays < 7) {
        weeklyData[diffDays].revenue += amount;
      }
    });

    // ---- LỌC MỐC TRỤC Y: Lấy ngày có doanh thu cao nhất của tháng ----
    const maxDailyRevenue =
      Object.values(monthlyDailyRevenues).length > 0
        ? Math.max(...Object.values(monthlyDailyRevenues))
        : 0;

    // Tăng mốc max lên 10% để cột không đụng nóc biểu đồ. Nếu tháng chưa có doanh thu thì ép mốc 100k
    const yAxisMax =
      maxDailyRevenue > 0 ? Math.ceil(maxDailyRevenue * 1.1) : 100000;

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
      yAxisMax, // Trả về mốc cao nhất để truyền xuống biểu đồ
    };
  }, [invoices, currentDate]);

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:col-span-2 flex flex-col h-[420px]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="font-bold text-gray-800">Doanh thu trong tuần</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Khoảng thời gian: {stats.weekLabel}
              </p>
            </div>

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

                {/* ÉP MỐC TRỤC Y VÀO ĐÂY BẰNG THUỘC TÍNH DOMAIN */}
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                  domain={[0, stats.yAxisMax]}
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

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-[420px] overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-white">
            <h2 className="font-bold text-gray-800">
              Món ăn phổ biến (Tháng này)
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
