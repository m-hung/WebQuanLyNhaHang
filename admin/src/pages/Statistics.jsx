import React from "react";
import {
  DollarSign,
  ShoppingCart,
  CalendarDays,
  CreditCard,
} from "lucide-react";
// Import các thành phần vẽ biểu đồ từ Recharts
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
  // 1. ĐƯA TOÀN BỘ DỮ LIỆU VỀ 0 NHƯ YÊU CẦU
  const todayOrders = 0;
  const todayRevenue = 0;
  const monthlyOrders = 0;
  const monthlyRevenue = 0;

  // 2. Dữ liệu cho biểu đồ cột (Tuần này) - Tất cả đều là 0
  const weeklyData = [
    { name: "10/09", revenue: 0 },
    { name: "11/09", revenue: 0 },
    { name: "12/09", revenue: 0 },
    { name: "13/09", revenue: 0 },
    { name: "14/09", revenue: 0 },
    { name: "15/09", revenue: 0 },
    { name: "16/09", revenue: 0 },
  ];

  // 3. Danh sách món ăn - Dữ liệu cũng về 0
  const topDishes = [
    { rank: 1, name: "Gà rán giòn", qty: 0, revenue: "0" },
    { rank: 2, name: "Trà sữa trân châu", qty: 0, revenue: "0" },
    { rank: 3, name: "Bún bò Huế", qty: 0, revenue: "0" },
    { rank: 4, name: "Cơm chiên hải sản", qty: 0, revenue: "0" },
    { rank: 5, name: "Pizza hải sản", qty: 0, revenue: "0" },
    { rank: 6, name: "Mì xào bò", qty: 0, revenue: "0" },
    { rank: 7, name: "Trà đào cam sả", qty: 0, revenue: "0" },
    { rank: 8, name: "Lẩu thái", qty: 0, revenue: "0" },
    { rank: 9, name: "Hamburger", qty: 0, revenue: "0" },
    { rank: 10, name: "Khoai tây chiên", qty: 0, revenue: "0" },
  ];

  // Hàm render huy chương
  const renderRank = (rank) => {
    if (rank === 1) return "🥇 1";
    if (rank === 2) return "🥈 2";
    if (rank === 3) return "🥉 3";
    return <span className="pl-2 text-gray-500">{rank}</span>;
  };

  // Custom giao diện cho cái hộp thông tin khi rê chuột vào biểu đồ (Tooltip)
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
              {todayRevenue} VNĐ
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
              {monthlyRevenue} VNĐ
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
            <p className="text-xl font-bold text-gray-800">{todayOrders}</p>
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
            <p className="text-xl font-bold text-gray-800">{monthlyOrders}</p>
          </div>
        </div>
      </div>

      {/* === PHẦN 2: BIỂU ĐỒ VÀ DANH SÁCH MÓN ĂN === */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CỘT TRÁI: BIỂU ĐỒ CỘT DOANH THU */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:col-span-2 flex flex-col h-[420px]">
          <h2 className="font-bold text-gray-800 mb-6">Doanh thu trong tuần</h2>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={weeklyData}
                margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
              >
                {/* Lưới kẻ ngang mờ */}
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f3f4f6"
                />
                {/* Trục X (Ngày) */}
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                  dy={10}
                />
                {/* Trục Y (Tiền) */}
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                />
                {/* Khung thông tin khi rê chuột */}
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "#f9fafb" }}
                />
                {/* Cột dữ liệu màu xanh lá */}
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

        {/* CỘT PHẢI: DANH SÁCH MÓN ĂN (GIAO DIỆN SÁNG MÀU TONE-SUR-TONE) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-[420px] overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-white">
            <h2 className="font-bold text-gray-800">Món ăn phổ biến</h2>
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
                {topDishes.map((dish) => (
                  <tr
                    key={dish.rank}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-3 font-medium">{renderRank(dish.rank)}</td>
                    <td className="p-3 text-gray-700 font-medium">
                      {dish.name}
                    </td>
                    <td className="p-3 text-center text-gray-500">
                      {dish.qty}
                    </td>
                    <td className="p-3 text-right font-medium text-emerald-500">
                      {dish.revenue}
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
