import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function InvoiceHistory() {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    // State cho Modal Xem chi tiết
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [paymentLoading, setPaymentLoading] = useState(false);

    // Logic phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Lấy dữ liệu từ backend
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                // Lưu ý: Sửa lại đường dẫn API này cho đúng với Controller của bạn bên Java
                const response = await fetch("http://localhost:8080/api/orders");
                const data = await response.json();

                setOrders(data);
                setFilteredOrders(data);
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu hóa đơn:", error);
            }
        };

        fetchOrders().catch(console.error);
    }, []);

    // Logic tìm kiếm
    const handleSearch = () => {
        const lowercasedTerm = searchTerm.toLowerCase();

        const filtered = orders.filter(
            (order) =>
                (`hd-${order.orderId}`).toLowerCase().includes(lowercasedTerm) ||
                (order.table &&
                    `bàn ${order.table.tableId}`
                        .toLowerCase()
                        .includes(lowercasedTerm))
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
    const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

    // Hàm format tiền tệ và thời gian
    const formatCurrency = (amount) => {
        if (!amount) return "0 đ";
        return amount.toLocaleString("vi-VN") + " đ";
    };

    const formatDateTime = (timeString) => {
        if (!timeString) return "Chưa thanh toán";

        const date = new Date(timeString);

        return new Intl.DateTimeFormat("vi-VN", {
            timeZone: "Asia/Ho_Chi_Minh",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour12: false,
        }).format(date);
    };

    // Hàm mở model
    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setSelectedPayment(null);
        setShowModal(true);
        setPaymentLoading(true);
        fetch(`http://localhost:8080/api/payments/order/${order.orderId}`)
            .then((res) => res.ok ? res.json() : null)
            .then((data) => setSelectedPayment(data))
            .catch((err) => console.error("Lỗi lấy payment:", err))
            .finally(() => setPaymentLoading(false));
    };

    return (
        <div className="bg-gray-50 p-6 rounded-2xl w-full min-h-screen flex flex-col relative">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Lịch sử hóa đơn</h2>
                </div>
                {/* Thanh tìm kiếm */}
                <div className="flex w-full md:w-110 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    <input type="text" placeholder="Tìm kiếm theo Số hóa đơn, Số bàn..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()} className="flex-1 px-4 py-3 outline-none text-sm text-gray-700"/>
                    <button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700 text-white px-6 transition-colors cursor-pointer">Tìm</button>
                    <button onClick={() => {setSearchTerm("");setFilteredOrders(orders);setCurrentPage(1);}} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 text-sm transition-colors cursor-pointer">Reset</button>
                </div>
            </div>
            {/* Bảng danh sách Hóa đơn */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100">
                        <tr className="text-gray-600">
                            <th className="px-5 py-4 text-left font-semibold">Mã HĐ</th>
                            <th className="px-5 py-4 text-center font-semibold">Bàn</th>
                            <th className="px-5 py-4 text-right font-semibold">Tổng tiền</th>
                            <th className="px-5 py-4 text-center font-semibold">Trạng thái</th>
                            <th className="px-5 py-4 text-center font-semibold">Thời gian</th>
                            <th className="px-5 py-4 text-center font-semibold">Hành động</th>
                        </tr>
                        </thead>
                        <tbody>
                        {currentOrders.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="text-center py-10 text-gray-500">
                                    Không tìm thấy hóa đơn nào.
                                </td>
                            </tr>
                        ) : (
                            currentOrders.map((item, index) => (
                                <tr key={item.orderId || index} className="border-b border-gray-100 hover:bg-gray-50 transition">
                                    <td className="px-5 py-4 font-semibold text-gray-800">HD-{item.orderId}</td>
                                    <td className="px-5 py-4 text-center text-gray-700">{item.table ? `Bàn ${item.table.tableId}` : "Mang đi"}</td>
                                    <td className="px-5 py-4 text-right font-bold text-gray-800">{formatCurrency(item.totalAmount)}</td>
                                    <td className="px-5 py-4 text-center">
                                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                                item.status === "Paid" ? "bg-emerald-100 text-emerald-700" : item.status === "Cancelled" ? "bg-rose-100 text-rose-700"  : "bg-sky-100 text-sky-700"}`}>{item.status === "Paid" ? "Đã thanh toán" : item.status === "Cancelled" ? "Đã hủy" : "Đang phục vụ"}
                                            </span>
                                    </td>
                                    <td className="px-5 py-4 text-center text-gray-500">
                                        {formatDateTime(item.orderDate)}                                        </td>
                                    <td className="px-5 py-4 text-center">
                                        <button onClick={() => handleViewDetails(item)} className="text-blue-600 hover:text-blue-800 hover:underline transition-colors cursor-pointer font-medium">
                                            Xem chi tiết
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>

                {/* Giao diện phân trang */}
                {totalPages > 0 && (
                    <div className="flex justify-between items-center px-6 py-4 border-t bg-gray-50">
                            <span className="text-sm text-gray-500">Hiển thị <span className="font-medium">{indexOfFirstItem + 1}</span> đến{" "}
                                <span className="font-medium">
                                    {Math.min(indexOfLastItem, filteredOrders.length)}
                                </span>{" "}
                                trên tổng <span className="font-medium">{filteredOrders.length}</span> hóa đơn
                            </span>

                        <div className="flex items-center gap-2">
                            <button onClick={prevPage} disabled={currentPage === 1} className={`w-9 h-9 rounded-lg border transition ${currentPage === 1 ? "bg-gray-100 text-gray-300 cursor-not-allowed" : "bg-white hover:bg-gray-100"}`}>
                                &lt;
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                                <button key={number} onClick={() => paginate(number)} className={`w-9 h-9 rounded-lg text-sm font-medium transition ${currentPage === number ? "bg-blue-600 text-white" : "bg-white border hover:bg-gray-100"}`}>
                                    {number}
                                </button>
                            ))}

                            <button onClick={nextPage} disabled={currentPage === totalPages} className={`w-9 h-9 rounded-lg border transition ${currentPage === totalPages ? "bg-gray-100 text-gray-300 cursor-not-allowed" : "bg-white hover:bg-gray-100"}`}>
                                &gt;
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal xem chi tiết hóa đơn */}
            {showModal && selectedOrder && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">

                        {/* Header Modal */}
                        <div className="flex justify-between items-center px-6 py-5 border-b bg-white">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-800">
                                    Hóa đơn HD-{selectedOrder.orderId}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    {formatDateTime(
                                        selectedPayment?.paymentTime ||
                                        selectedOrder.orderDate
                                    )}
                                </p>
                            </div>

                            <div className="flex items-center gap-4">
                                    <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${selectedOrder.status === "Paid" ? "bg-emerald-100 text-emerald-700" : selectedOrder.status === "Cancelled" ? "bg-rose-100 text-rose-700" : "bg-sky-100 text-sky-700"}`}>
                                        {selectedOrder.status === "Paid" ? "Đã thanh toán" : selectedOrder.status === "Cancelled" ? "Đã hủy" : "Đang phục vụ"}
                                    </span>

                                <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-red-500 cursor-pointer">
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        {/* Body Modal */}
                        <div className="p-6 overflow-y-auto">

                            {/* Thông tin chung */}
                            <div className="flex gap-4 mb-6">

                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 w-48">
                                    <p className="text-sm text-gray-500 mb-1">
                                        Bàn
                                    </p>

                                    <p className="font-semibold text-gray-800">
                                        {selectedOrder.table
                                            ? `Bàn ${selectedOrder.table.tableId}`
                                            : "Mang đi"}
                                    </p>
                                </div>

                                {paymentLoading ? (
                                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-gray-400 text-sm">Đang tải...</div>
                                ) : selectedPayment ? (
                                    <>
                                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 w-56">
                                            <p className="text-sm text-gray-500 mb-1">Khách hàng</p>
                                            <p className="font-semibold text-gray-800">{selectedPayment.customerName}</p>
                                        </div>
                                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 w-56">
                                            <p className="text-sm text-gray-500 mb-1">Số điện thoại</p>
                                            <p className="font-semibold text-gray-800">{selectedPayment.phone}</p>
                                        </div>
                                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 w-56">
                                            <p className="text-sm text-gray-500 mb-1">Phương thức TT</p>
                                            <p className="font-semibold text-emerald-600">
                                                {selectedPayment.paymentMethod === "Cash" ? "Tiền mặt"
                                                    : selectedPayment.paymentMethod === "VNPAY" ? "Chuyển khoản"
                                                        : selectedPayment.paymentMethod}
                                            </p>
                                        </div>
                                    </>
                                ) : null}
                            </div>

                            {/* Bảng chi tiết các món (Order Items) */}
                            <h4 className="font-bold text-gray-800 mb-4">
                                Danh sách món ăn
                            </h4>

                            <div className="border border-gray-100 rounded-xl overflow-hidden mb-6">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-4 py-3 text-left font-semibold">
                                            Món ăn
                                        </th>
                                        <th className="px-4 py-3 text-center font-semibold">
                                            SL
                                        </th>
                                        <th className="px-4 py-3 text-right font-semibold">
                                            Đơn giá
                                        </th>
                                        <th className="px-4 py-3 text-right font-semibold">
                                            Thành tiền
                                        </th>
                                    </tr>
                                    </thead>

                                    <tbody>
                                    {selectedOrder.orderItems &&
                                    selectedOrder.orderItems.length > 0 ? (
                                        selectedOrder.orderItems.map((item, idx) => (
                                            <tr key={idx} className="border-b border-gray-100 last:border-0">
                                                <td className="px-4 py-4 font-medium text-gray-800">
                                                    {item.menuItem
                                                        ? item.menuItem.name
                                                        : "Món đã xóa"}
                                                </td>
                                                <td className="px-4 py-4 text-center">
                                                    {item.quantity}
                                                </td>
                                                <td className="px-4 py-4 text-right">
                                                    {formatCurrency(item.menuItem?.price)}
                                                </td>
                                                <td className="px-4 py-4 text-right font-semibold">
                                                    {formatCurrency(
                                                        item.subtotal || item.menuItem?.price * item.quantity
                                                    )}
                                                </td>
                                            </tr>
                                        ))) : (
                                        <tr>
                                            <td colSpan="4" className="text-center py-6 text-gray-500">
                                                Không có dữ liệu món ăn
                                            </td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Tổng kết */}
                            <div className="flex justify-end mt-8">
                                <div className="w-80 bg-gray-50 rounded-xl p-5 border border-gray-100">
                                    <div className="flex justify-between mb-3 text-sm">
                                            <span className="text-gray-500">
                                                Tạm tính
                                            </span>
                                        <span>
                                                {formatCurrency(selectedOrder.totalAmount)}
                                            </span>
                                    </div>

                                    <div className="flex justify-between mb-4 text-sm">
                                            <span className="text-gray-500">
                                                Giảm giá
                                            </span>
                                        <span>0 đ</span>
                                    </div>

                                    <div className="border-t pt-4 flex justify-between items-center">
                                            <span className="text-lg font-bold text-gray-800">
                                                Tổng cộng
                                            </span>
                                        <span className="text-2xl font-bold text-blue-600">
                                                {formatCurrency(selectedOrder.totalAmount)}
                                            </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Modal */}
                        <div className="px-6 py-4 border-t flex justify-end gap-3 bg-gray-50">
                            <button onClick={() => setShowModal(false)} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-medium transition-colors cursor-pointer">
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}