export default function Statistics() {
  return (
    <div>
      <h1 className="text-xl md:text-2xl font-bold mb-4">Thống kê</h1>
      {/* 1 cột trên mobile, 3 cột trên desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          Doanh thu: 10,000,000đ
        </div>
        <div className="bg-white p-4 rounded shadow">Số đơn: 120</div>
        <div className="bg-white p-4 rounded shadow">Khách: 300</div>
      </div>
    </div>
  );
}
