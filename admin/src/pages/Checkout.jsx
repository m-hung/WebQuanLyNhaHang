import React, {useState} from "react";

export default function Checkout({setPage, invoice, onPaymentSuccess}) {
    const [customerName, setCustomerName] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("Cash");

    const [showInvoice, setShowInvoice] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const [currentTime] = useState(() => {
        const now = new Date();
        return (now.toLocaleTimeString("vi-VN", {
            hour: "2-digit", minute: "2-digit"
        }) + " - " + now.toLocaleDateString("vi-VN"));
    });

    const isFormValid = customerName.trim() !== "" && customerPhone.trim() !== "";

    // TỰ ĐỘNG CHUẨN HÓA DỮ LIỆU MÓN ĂN
    const rawItems = invoice?.cart || invoice?.orderItems || [];

    const BANK_ID = "BIDV";
    const ACCOUNT_NO = "8876088284";
    const ACCOUNT_NAME = "NGUYEN KHANH HUNG";
    const amount = invoice?.totalPrice || 0;
    const description = `Thanh toan don hang ${invoice?.id || 'VN'}`;
    const qrUrl = `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(description)}&accountName=${encodeURIComponent(ACCOUNT_NAME)}`;

    const formatCurrency = (amount) => {
        if (amount == null) return "0 đ";
        return amount.toLocaleString("vi-VN") + " đ";
    };

    const handlePrint = () => {
        window.print();
    };

    const handleShowInvoice = () => {
        setSelectedOrder(invoice);
        setShowInvoice(true);
    };

    return (<>
            <div className="bg-white p-6 md:p-10 rounded shadow-md max-w-5xl mx-auto mt-4 print:hidden">
                <h2 className="text-xl font-bold text-blue-800 mb-6 border-b pb-4">
                    Thanh toán hóa đơn
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                    <div>
                        <h3 className="text-2xl font-medium text-gray-700 mb-2">
                            Mã hóa đơn: {invoice?.id || "N/A"}
                        </h3>
                        <p className="text-gray-500 mb-2">
                            Thời gian:{" "}
                            <span className="font-medium text-gray-700">{currentTime}</span>
                        </p>
                        <p className="text-gray-500">
                            Hóa đơn nhập bởi:{" "}
                            <span className="font-medium text-gray-700">
              {invoice?.cashierName || "Thu ngân"}
            </span>
                        </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded border border-gray-100">
                        <h3 className="text-lg font-medium text-gray-700 mb-3 border-b pb-2">
                            Thông tin khách hàng (Invoice to):
                        </h3>
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-2">
                                <label className="text-gray-500 w-24">Họ và tên:</label>
                                <input
                                    type="text"
                                    placeholder="Nhập tên khách hàng..."
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    className="flex-1 border border-gray-300 rounded px-3 py-1.5 outline-none focus:border-blue-500"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="text-gray-500 w-24">Số điện thoại:</label>
                                <input
                                    type="tel"
                                    placeholder="Nhập số điện thoại..."
                                    value={customerPhone}
                                    onChange={(e) => setCustomerPhone(e.target.value)}
                                    className="flex-1 border border-gray-300 rounded px-3 py-1.5 outline-none focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-8 border rounded overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-3 font-semibold text-gray-600">Tên sản phẩm</th>
                            <th className="p-3 font-semibold text-gray-600">Giá</th>
                            <th className="p-3 font-semibold text-gray-600 text-center">
                                Số lượng
                            </th>
                            <th className="p-3 font-semibold text-gray-600 text-right">
                                Tổng cộng
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {rawItems.length > 0 ? (rawItems.map((item, index) => {
                            const itemName = item.menuItem?.nameVi || item.menuItem?.name || item.nameVi || item.nameEn || item.name || "Tên món ăn";

                            const basePrice = item.menuItem?.price ?? item.price ?? 0;
                            const discount = item.menuItem?.discount ?? item.discount ?? 0;
                            const effectivePrice = Math.max(0, basePrice - discount);
                            const itemQty = item.quantity || item.qty || 1;
                            const itemTotal = item.subtotal !== undefined ? item.subtotal : effectivePrice * itemQty;

                            return (<tr
                                key={index}
                                className="border-b bg-white hover:bg-gray-50 transition"
                            >
                                <td className="p-3 text-gray-700 font-medium">
                                    {itemName}
                                </td>
                                <td className="p-3 text-gray-600">
                                    {effectivePrice.toLocaleString()} đ
                                </td>
                                <td className="p-3 text-gray-700 text-center font-semibold">
                                    {itemQty}
                                </td>
                                <td className="p-3 text-blue-600 font-bold text-right">
                                    {itemTotal.toLocaleString()} đ
                                </td>
                            </tr>);
                        })) : (<tr className="border-b bg-white">
                            <td colSpan="4" className="p-4 text-center text-gray-400">
                                Không có món ăn nào trong hóa đơn
                            </td>
                        </tr>)}

                        <tr className="bg-blue-50">
                            <td
                                colSpan="3"
                                className="p-4 text-right font-bold text-gray-700 border-r border-blue-100 uppercase"
                            >
                                Tổng tiền thanh toán:
                            </td>
                            <td className="p-4 font-bold text-xl text-blue-700 text-right">
                                {invoice?.totalPrice?.toLocaleString() || "0"} VNĐ
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                <div className="mb-8 bg-gray-50 p-4 rounded border border-gray-100">
                    <h3 className="text-lg font-medium text-gray-700 mb-4">
                        Hình thức thanh toán:
                    </h3>
                    <div className="flex flex-wrap items-center gap-8 text-gray-600">
                        <label className="flex items-center gap-2 cursor-pointer hover:text-emerald-600 transition">
                            <input
                                type="radio"
                                name="payment"
                                value="Cash"
                                checked={paymentMethod === "Cash"}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="form-radio w-4 h-4 text-emerald-500 focus:ring-emerald-500"
                            />
                            <span className="font-medium">💵 Tiền mặt</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition">
                            <input
                                type="radio"
                                name="payment"
                                value="VNPAY"
                                checked={paymentMethod === "VNPAY"}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="form-radio w-4 h-4 text-blue-500 focus:ring-blue-500"
                            />
                            <span className="font-medium">🔵 Chuyển khoản (Ví VNPAY)</span>
                        </label>
                    </div>

                    {/* MÃ QR ĐỘNG HIỂN THỊ KHI CHỌN CHUYỂN KHOẢN */}
                    {paymentMethod === "VNPAY" && (
                        <div className="mt-6 pt-6 border-t border-gray-200 animate-fade-in-down">
                            <div
                                className="flex flex-col items-center justify-center bg-white p-6 rounded-xl border-2 border-dashed border-blue-300 w-fit mx-auto shadow-sm">
                                <h4 className="text-md font-bold text-blue-800 mb-3">Quét mã để thanh toán nhanh</h4>
                                <img
                                    src={qrUrl}
                                    alt="Mã QR Thanh Toán"
                                    className="w-56 h-56 object-contain"
                                />
                                <p className="text-center text-sm text-gray-500 mt-3 max-w-xs">
                                    Sử dụng App ngân hàng để quét mã.
                                </p>
                            </div>
                        </div>)}
                </div>

                <div className="flex flex-wrap gap-4 justify-end print:hidden">
                    <button
                        className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-2.5 rounded font-medium shadow-sm transition"
                        onClick={() => setPage("main_dashboard")}
                    >
                        Trở lại
                    </button>

                    <button
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded font-medium shadow-sm transition"
                        onClick={handleShowInvoice}
                    >
                        Xem & In hóa đơn
                    </button>

                    <button
                        className={`px-8 py-2.5 rounded font-bold shadow-sm transition ${isFormValid ? "bg-emerald-500 hover:bg-emerald-600 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
                        disabled={!isFormValid}
                        onClick={() => {
                            const now = new Date();
                            const pad = (n) => String(n).padStart(2, "0");
                            const localDateTime = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

                            const paymentPayload = {
                                order: {orderId: invoice?.id},
                                amountPaid: invoice?.totalPrice,
                                paymentMethod: paymentMethod,
                                paymentTime: localDateTime,
                                customerName: customerName,
                                phone: customerPhone,
                            };

                            fetch("http://localhost:8080/api/payments", {
                                method: "POST",
                                headers: {"Content-Type": "application/json"},
                                body: JSON.stringify(paymentPayload),
                            })
                                .then(() => {
                                    return fetch(`http://localhost:8080/api/orders/${invoice?.id}/status`, {
                                        method: "PUT",
                                        headers: {"Content-Type": "application/json"},
                                        body: JSON.stringify({status: "Paid"}),
                                    },);
                                })
                                .then(() => {
                                    return fetch(`http://localhost:8080/api/tables/${invoice?.tableId}/status`, {
                                        method: "PUT",
                                        headers: {"Content-Type": "application/json"},
                                        body: JSON.stringify({status: "Available"}),
                                    },);
                                })
                                .then(() => {
                                    if (onPaymentSuccess) {
                                        onPaymentSuccess(invoice?.id);
                                    }
                                })
                                .catch((err) => {
                                    console.error("Lỗi khi thanh toán:", err);
                                    alert("Có lỗi xảy ra khi lưu thanh toán! Vui lòng kiểm tra F12.",);
                                });
                        }}
                        title={!isFormValid ? "Vui lòng nhập Họ tên và SĐT để thanh toán" : ""}
                    >
                        Xác nhận thanh toán
                    </button>
                </div>
            </div>

            {/* MODAL HÓA ĐƠN */}
            {showInvoice && selectedOrder && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 print:static print:bg-transparent print:p-0 print:block print:h-auto print:overflow-visible">
                    <div
                        className="bg-white shadow-2xl w-full max-w-xl flex flex-col max-h-[90vh] overflow-hidden font-mono border-4 border-gray-300 print:max-h-none print:h-auto print:block print:overflow-visible print:shadow-none print:border-0">

                        {/* HEADER */}
                        <div className="text-center border-b-2 border-dashed border-gray-400 px-6 py-5">
                            <h2 className="text-2xl font-bold uppercase tracking-wide">
                                CELESTÉ HOUSE
                            </h2>

                            <p className="text-sm text-gray-600 mt-1">
                                Lê Văn Việt, Quận 9, TP. Hồ Chí Minh
                            </p>

                            <p className="text-sm text-gray-600">
                                Hotline: +84 123 456 789
                            </p>

                            <h3 className="text-xl font-bold mt-4 uppercase">
                                Hóa đơn thanh toán
                            </h3>

                            <p className="text-sm mt-2">
                                Mã HĐ: HD-{selectedOrder.id}
                            </p>

                            <p className="text-sm">
                                {currentTime}
                            </p>
                        </div>

                        {/* BODY (Đã thêm print:overflow-visible print:h-auto print:block để phá thanh cuộn) */}
                        <div className="p-6 overflow-y-auto print:overflow-visible print:h-auto print:block">

                            <div className="text-sm border-b border-dashed border-black pb-4 mb-4 space-y-1">
                                <div className="flex justify-between">
                                    <span>Khách hàng:</span>
                                    <span>{customerName}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span>SĐT:</span>
                                    <span>{customerPhone}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span>Thanh toán:</span>
                                    <span>{paymentMethod}</span>
                                </div>
                            </div>

                            {/* DANH SÁCH MÓN */}
                            <h4 className="font-bold text-gray-800 mb-4">
                                Danh sách món ăn
                            </h4>

                            <div className="overflow-hidden mb-6">
                                <table className="w-full text-sm">
                                    <thead className="border-b border-black">
                                    <tr>
                                        <th className="px-2 py-3 text-center font-semibold">
                                            STT
                                        </th>

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
                                    {rawItems.map((item, idx) => {
                                        const itemName = item.menuItem?.nameVi || item.menuItem?.name || item.nameVi || item.name || "Tên món";

                                        const itemNameEn = item.menuItem?.nameEn || item.menuItem?.englishName || item.nameEn || item.englishName || "";

                                        const basePrice = item.menuItem?.price ?? item.price ?? 0;

                                        const discount = item.menuItem?.discount ?? item.discount ?? 0;

                                        const effectivePrice = Math.max(0, basePrice - discount);

                                        const itemQty = item.quantity || item.qty || 1;

                                        const itemTotal = item.subtotal ?? effectivePrice * itemQty;

                                        return (<tr
                                            key={idx}
                                            className="border-b border-dashed border-gray-300"
                                        >
                                            <td className="px-2 py-4 text-center">
                                                {idx + 1}
                                            </td>

                                            <td className="px-4 py-4 text-left">
                                                <p className="font-medium text-gray-800 line-clamp-1">
                                                    {itemName}
                                                </p>
                                                {itemNameEn && (
                                                    <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1 font-normal">
                                                        {itemNameEn}
                                                    </p>)}
                                            </td>

                                            <td className="px-4 py-4 text-center">
                                                {itemQty}
                                            </td>

                                            <td className="px-4 py-4 text-right">
                                                {formatCurrency(effectivePrice)}
                                            </td>

                                            <td className="px-4 py-4 text-right font-semibold">
                                                {formatCurrency(itemTotal)}
                                            </td>
                                        </tr>);
                                    })}
                                    </tbody>
                                </table>
                            </div>

                            {/* TỔNG */}
                            <div className="mt-6 border-t border-black pt-4 text-sm">
                                <div className="border-t mt-2 pt-3 flex justify-between items-center">
            <span className="text-lg font-bold text-gray-800">
                Tổng cộng
            </span>

                                    <span className="text-xl font-bold">
                {formatCurrency(invoice?.totalPrice || 0)}
            </span>
                                </div>

                                <div className="mt-6 text-center text-gray-500 text-xs italic">
                                    Cảm ơn quý khách và hẹn gặp lại!
                                </div>
                            </div>
                        </div>

                        {/* FOOTER */}
                        <div className="px-6 py-4 border-t flex justify-end gap-3 bg-gray-50 print:hidden">

                            <button
                                onClick={handlePrint}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl font-medium transition-colors"
                            >
                                In hóa đơn
                            </button>

                            <button
                                onClick={() => setShowInvoice(false)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-medium transition-colors"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>)
            }
        </>
    )
        ;
}