import React, { useState, useEffect } from "react";
import {
  DollarSign,
  ShoppingCart,
  CalendarDays,
  CreditCard,
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

export default function Statistics() {
  const [stats, setStats] = useState({
    todayOrders: 0,
    todayRevenue: 0,
    monthlyOrders: 0,
    monthlyRevenue: 0,
    weeklyData: [],
    topDishes: [],
  });

  useEffect(() => {
    fetch("http://localhost:8080/api/statistics")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.topDishes) {
          const formattedDishes = data.topDishes.map((dish, index) => ({
            ...dish,
            rank: index + 1,
          }));
          setStats({ ...data, topDishes: formattedDishes });
        }
      })
      .catch((err) => console.error("Lỗi lấy dữ liệu thống kê:", err));
  }, []);

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
              {stats.todayRevenue?.toLocaleString() || 0} VNĐ
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
              {stats.monthlyRevenue?.toLocaleString() || 0} VNĐ
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
        {/* CỘT TRÁI: BIỂU ĐỒ CỘT DOANH THU */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:col-span-2 flex flex-col h-[420px]">
          <h2 className="font-bold text-gray-800 mb-6">
            Doanh thu 7 ngày gần nhất
          </h2>
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

        {/* CỘT PHẢI: DANH SÁCH MÓN ĂN */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-[420px] overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-white">
            <h2 className="font-bold text-gray-800">
              Món ăn phổ biến tháng này
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
                {stats.topDishes.map((dish, index) => (
                  <tr
                    key={dish.rank || index}
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
                      {dish.revenue?.toLocaleString()} đ
                    </td>
                  </tr>
                ))}
                {stats.topDishes.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center p-6 text-gray-400">
                      Chưa có món nào được bán!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
