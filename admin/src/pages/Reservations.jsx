import React, {useState, useEffect, useMemo, useRef} from "react";
import {Calendar, Plus, RotateCcw, X, Search} from "lucide-react";
import CalendarView from "./CalendarView";

export default function Reservations() {
    const [showCalendar, setShowCalendar] = useState(false);
    // DATA
    const [reservations, setReservations] = useState([]);
    const [tables, setTables] = useState([]);
    // LOADING
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    // FILTER
    const [searchTerm, setSearchTerm] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    // PAGINATION
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    // MODAL
    const [showAddModal, setShowAddModal] = useState(false);
    // FORM
    const initialForm = {
        customerName: "", phone: "", email: "", bookDate: "", bookTime: "", guestCount: "", tableId: "",
    };

    const [formData, setFormData] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const isComposing = useRef(false);

    const [confirmModal, setConfirmModal] = useState({
        open: false, id: null, type: null
    });

    // FETCH DATA
    useEffect(() => {
        fetchReservations().catch(console.error);
    }, []);

    const fetchReservations = async () => {
        try {
            setLoading(true);
            const response = await fetch("http://localhost:8080/api/reservations");

            const data = await response.json();
            setReservations(data);
        } catch (error) {
            console.error("Lỗi lấy reservations:", error);
        } finally {
            setLoading(false);
        }
    };

    // FILTER + SEARCH
    const filteredReservations = useMemo(() => {
        return reservations.filter((item) => {
            // SEARCH
            const keyword = searchTerm.toLowerCase();

            const matchSearch = item.customerName?.toLowerCase().includes(keyword) || item.phone?.toLowerCase().includes(keyword);

            // DATE FILTER
            if (!item.reservationTime) return false;

            const reservationDate = new Date(item.reservationTime);
            reservationDate.setHours(0, 0, 0, 0);

            let validStart = true;
            let validEnd = true;

            if (startDate) {
                const start = new Date(startDate);
                start.setHours(0, 0, 0, 0);
                validStart = reservationDate >= start;
            }

            if (endDate) {
                const end = new Date(endDate);
                end.setHours(0, 0, 0, 0);
                validEnd = reservationDate <= end;
            }

            return matchSearch && validStart && validEnd;
        })
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }, [reservations, searchTerm, startDate, endDate]);

    // PAGINATION
    const totalPages = Math.ceil(filteredReservations.length / itemsPerPage);

    const currentReservations = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;

        return filteredReservations.slice(start, end);
    }, [filteredReservations, currentPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, startDate, endDate]);

    // FORMAT TIME
    const formatDateTime = (dateString) => {
        if (!dateString) return "";
        return new Intl.DateTimeFormat("vi-VN", {
            hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit", year: "numeric",
        }).format(new Date(dateString));
    };

    // RESET FILTER
    const handleReset = () => {
        setSearchTerm("");
        setStartDate("");
        setEndDate("");
    };

    // OPEN MODAL
    const handleOpenAddModal = () => {
        setFormData(initialForm);
        setErrors({});
        setShowAddModal(true);
    };

    useEffect(() => {
        const fetchAvailableTables = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/tables");

                const data = await response.json();
                if (!formData.guestCount) {
                    setTables(data.filter((t) => t.status === "Available"));
                    return;
                }

                // Lọc bàn đủ chỗ
                const filteredTables = data.filter((t) => t.status === "Available" && t.capacity >= parseInt(formData.guestCount));

                setTables(filteredTables);

                // Nếu bàn đã chọn không còn hợp lệ -> reset
                const selectedTableStillValid = filteredTables.some((t) => t.tableId === parseInt(formData.tableId));

                if (!selectedTableStillValid) {
                    setFormData((prev) => ({
                        ...prev, tableId: "",
                    }));
                }

            } catch (error) {
                console.error("Lỗi lấy bàn:", error);
            }
        };

        if (showAddModal) {
            fetchAvailableTables().catch(console.error);
        }
    }, [formData.guestCount, formData.tableId, showAddModal]);

    // SUBMIT RESERVATION
    const handleSubmitReservation = async () => {
        try {
            if (!formData.customerName || !formData.phone || !formData.bookDate || !formData.bookTime || !formData.guestCount || !formData.tableId) {
                alert("Vui lòng nhập đầy đủ thông tin!");
                return;
            }

            if (errors.phone || errors.email || errors.bookTime) {
                return;
            }

            setErrors({});
            setSubmitting(true);

            const payload = {
                customerName: formData.customerName,
                phone: formData.phone,
                email: formData.email,
                reservationTime: `${formData.bookDate}T${formData.bookTime}:00`,
                guestCount: parseInt(formData.guestCount),
                table: {
                    tableId: parseInt(formData.tableId),
                },
                isPaid: false,
            };

            const response = await fetch("http://localhost:8080/api/reservations", {
                method: "POST", headers: {
                    "Content-Type": "application/json",
                }, body: JSON.stringify(payload),
            });

            const newReservation = await response.json();

            const selectedTable = tables.find((t) => t.tableId === parseInt(formData.tableId));

            const enriched = {
                ...newReservation, table: selectedTable ?? newReservation.table,
            };

            setReservations((prev) => [enriched, ...prev]);
            setShowAddModal(false);
            setFormData(initialForm);
        } catch (error) {
            console.error("Lỗi tạo reservation:", error);
        } finally {
            setSubmitting(false);
        }
    };

    // DELETE
    const openConfirmModal = (id, type) => {
        setConfirmModal({
            open: true, id, type
        });
    };

    const handleConfirmAction = async () => {
        const {id, type} = confirmModal;

        try {
            let url = "";

            if (type === "cancel") {
                url = `http://localhost:8080/api/reservations/${id}/cancel`;
            } else if (type === "restore") {
                url = `http://localhost:8080/api/reservations/${id}/restore`;
            }

            const response = await fetch(url, {method: "PUT"});

            if (!response.ok) {
                throw new Error("Request failed");
            }

            const updated = await response.json();

            setReservations((prev) => prev.map((item) => item.reservationId === id ? updated : item));

        } catch (error) {
            console.error("Lỗi:", error);
        } finally {
            setConfirmModal({
                open: false, id: null, type: null
            });
        }
    };

    if (showCalendar) {
        return (<CalendarView
            onBack={() => setShowCalendar(false)}
            reservations={reservations}
        />);
    }

    const getMinTime = () => {
        if (!formData.bookDate) return "";

        const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
            .toISOString()
            .split("T")[0];

        if (formData.bookDate !== today) {
            return "";
        }

        const now = new Date();

        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");

        return `${hours}:${minutes}`;
    };

    return (<div className="bg-gray-50 min-h-screen p-6 rounded-2xl">
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
                <h2 className="text-3xl font-bold text-gray-800">
                    Quản lý đặt bàn
                </h2>
            </div>
            <div className="flex gap-3">
                <button
                    onClick={() => setShowCalendar(true)}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-3 rounded-xl flex items-center gap-2 transition cursor-pointer"
                >
                    <Calendar size={18}/>
                    Xem lịch
                </button>
                <button
                    onClick={handleOpenAddModal}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl flex items-center gap-2 transition cursor-pointer"
                >
                    <Plus size={18}/>
                    Thêm đặt bàn
                </button>
            </div>
        </div>

        {/* FILTER */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <div className="relative">
                    <Search
                        size={18}
                        className="absolute left-3 top-3.5 text-gray-400"
                    />
                    <input
                        type="text"
                        placeholder="Tên khách, SĐT"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-blue-500"
                    />
                </div>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
                />
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
                />
                <button
                    onClick={handleReset}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl px-4 py-3 flex items-center justify-center gap-2 transition cursor-pointer"
                >
                    <RotateCcw size={18}/> Reset
                </button>
            </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                    <tr className="text-gray-600">
                        <th className="px-5 py-4 text-left font-semibold"> Khách hàng</th>
                        <th className="px-5 py-4 text-left font-semibold"> Liên hệ</th>
                        <th className="px-5 py-4 text-center font-semibold"> Thời gian</th>
                        <th className="px-5 py-4 text-center font-semibold"> Bàn</th>
                        <th className="px-5 py-4 text-center font-semibold"> Số người</th>
                        <th className="px-5 py-4 text-center font-semibold"> Hành động</th>
                    </tr>
                    </thead>

                    <tbody>
                    {loading ? (<tr>
                        <td colSpan="6" className="text-center py-10 text-gray-400">
                            Đang tải dữ liệu...
                        </td>
                    </tr>) : currentReservations.length === 0 ? (<tr>
                        <td colSpan="6" className="text-center py-10 text-gray-400">
                            Không có dữ liệu
                        </td>
                    </tr>) : (currentReservations.map((item) => (<tr
                        key={item.reservationId}
                        className={`border-b border-gray-100 transition ${item.status === "CANCELLED" ? "bg-red-100" : "hover:bg-gray-50"}`}
                    >
                        <td className="px-5 py-4">
                            <div>
                                <div className="flex items-center gap-2">
                                    <p className="font-semibold text-gray-800">
                                        {item.customerName}
                                    </p>

                                    {item.status === "CANCELLED" && (<span
                                        className="text-xs font-semibold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
                                                        Đã hủy
                                                    </span>)}
                                </div>
                                <p className="text-xs text-gray-400 mt-1">
                                    Đặt lúc {formatDateTime(item.createdAt)}
                                </p>
                            </div>
                        </td>

                        <td className="px-5 py-4">
                            <div>
                                <p className="text-gray-700">
                                    {item.phone}
                                </p>
                                <p className="text-gray-500 text-xs mt-1">
                                    {item.email || "Không có email"}
                                </p>
                            </div>
                        </td>
                        <td className="px-5 py-4 text-center text-gray-700">
                            {formatDateTime(item.reservationTime)}
                        </td>
                        <td className="px-5 py-4 text-center">
                                        <span
                                            className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                                            {item.table ? `Bàn ${item.table.tableNumber}` : "Chưa xếp"}
                                        </span>
                        </td>
                        <td className="px-5 py-4 text-center font-semibold text-gray-700">
                            {item.guestCount}
                        </td>
                        <td className="px-5 py-4">
                            <div className="flex justify-center">
                                {item.status === "CANCELLED" ? (<button
                                    onClick={() => openConfirmModal(item.reservationId, "restore")}
                                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm transition cursor-pointer"
                                >
                                    Khôi phục
                                </button>) : (<button
                                    onClick={() => openConfirmModal(item.reservationId, "cancel")}
                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition cursor-pointer"
                                >
                                    Hủy
                                </button>)}
                            </div>
                        </td>
                    </tr>)))}
                    </tbody>
                </table>
            </div>

            {/* PAGINATION  */}
            {totalPages > 0 && (<div className="flex justify-between items-center px-6 py-4 border-t bg-gray-50">

        <span className="text-sm text-gray-500">
            Hiển thị
            <span className="font-medium">
                {" "}{(currentPage - 1) * itemsPerPage + 1}
            </span>
            {" "}đến{" "}
            <span className="font-medium">
                {Math.min(currentPage * itemsPerPage, filteredReservations.length)}
            </span>
            {" "}trên tổng{" "}
            <span className="font-medium">
                {filteredReservations.length}
            </span>
            {" "}lịch đặt bàn
        </span>

                <div className="flex items-center gap-2">

                    {/* Prev */}
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className={`w-9 h-9 rounded-lg border transition ${currentPage === 1 ? "bg-gray-100 text-gray-300 cursor-not-allowed" : "bg-white hover:bg-gray-100"}`}
                    >
                        &lt;
                    </button>

                    {/* Page numbers */}
                    {Array.from({length: totalPages}, (_, i) => i + 1).map((page) => (<button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-9 h-9 rounded-lg text-sm font-medium transition ${currentPage === page ? "bg-blue-600 text-white" : "bg-white border hover:bg-gray-100"}`}
                    >
                        {page}
                    </button>))}

                    {/* Next */}
                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className={`w-9 h-9 rounded-lg border transition ${currentPage === totalPages ? "bg-gray-100 text-gray-300 cursor-not-allowed" : "bg-white hover:bg-gray-100"}`}
                    >
                        &gt;
                    </button>

                </div>
            </div>)}
        </div>
        {/* ADD MODAL */}
        {showAddModal && (<div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b bg-blue-50">
                    <h3 className="text-xl font-bold text-blue-800">Thêm lịch đặt bàn</h3>
                    <button onClick={() => {
                        setShowAddModal(false);
                        setFormData(initialForm);
                        setErrors({});
                    }} className="text-gray-400 hover:text-red-500">
                        <X/>
                    </button>
                </div>
                {/* Body */}
                <div className="p-6 overflow-y-auto space-y-4">

                    <input
                        type="text"
                        placeholder="Nhập tên khách hàng"
                        value={formData.customerName}

                        // Bắt đầu gõ tiếng Việt (đang ghép dấu) -> Bật cờ
                        onCompositionStart={() => {
                            isComposing.current = true;
                        }}

                        // Kết thúc ghép dấu (ấn dấu cách hoặc gõ xong chữ) -> Tắt cờ và làm sạch dữ liệu
                        onCompositionEnd={(e) => {
                            isComposing.current = false;
                            const cleanedValue = e.target.value.replace(/[^A-Za-zÀ-ỹ\s]/g, "");
                            setFormData({
                                ...formData, customerName: cleanedValue
                            });
                        }}

                        onChange={(e) => {
                            // Nếu bộ gõ đang "lắp ráp" chữ (isComposing = true) -> Để yên cho nó gõ, không dùng replace
                            if (isComposing.current) {
                                setFormData({
                                    ...formData, customerName: e.target.value
                                });
                                return;
                            }

                            // Nếu gõ bình thường hoặc đã ghép dấu xong -> Lọc kí tự ngay lập tức
                            const cleanedValue = e.target.value.replace(/[^A-Za-zÀ-ỹ\s]/g, "");
                            setFormData({
                                ...formData, customerName: cleanedValue
                            });

                            setErrors((prev) => ({
                                ...prev, customerName: ""
                            }));
                        }}

                        onPaste={(e) => {
                            e.preventDefault();
                            const paste = e.clipboardData.getData("text");
                            const cleaned = paste.replace(/[^A-Za-zÀ-ỹ\s]/g, "");
                            setFormData({
                                ...formData, customerName: cleaned
                            });
                        }}
                        maxLength={50}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 text-sm"
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Số điện
                                thoại <span className="text-red-500">*</span></label>
                            <input
                                type="tel"
                                placeholder="090..."
                                value={formData.phone}
                                onChange={(e) => {
                                    let value = e.target.value;
                                    value = value.replace(/\D/g, "");
                                    if (value.length <= 15) {
                                        setFormData({
                                            ...formData, phone: value
                                        });
                                    }
                                }}

                                onBlur={() => {
                                    if (formData.phone && !/^\d{8,15}$/.test(formData.phone)) {
                                        setErrors((prev) => ({
                                            ...prev, phone: "Số điện thoại phải từ 8 - 15 số!"
                                        }));
                                    } else {
                                        setErrors((prev) => ({
                                            ...prev, phone: ""
                                        }));
                                    }
                                }}
                                maxLength={15}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 text-sm"
                            />
                            {errors.phone && (<p className="text-red-500 text-xs mt-1">
                                {errors.phone}
                            </p>)}
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                placeholder="example@gmail.com"
                                value={formData.email}
                                onChange={(e) => {
                                    setFormData({
                                        ...formData, email: e.target.value
                                    });
                                }}

                                onBlur={() => {
                                    if (formData.email && !/^[A-Za-z0-9._%+-]+@gmail\.com$/.test(formData.email)) {
                                        setErrors((prev) => ({
                                            ...prev, email: "Email phải đúng định dạng @gmail.com!"
                                        }));
                                    } else {
                                        setErrors((prev) => ({
                                            ...prev, email: ""
                                        }));
                                    }
                                }}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 text-sm"
                            />
                            {errors.email && (<p className="text-red-500 text-xs mt-1">
                                {errors.email}
                            </p>)}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Ngày đặt <span
                                className="text-red-500">*</span></label>
                            <input
                                type="date"
                                min={new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
                                    .toISOString()
                                    .split("T")[0]}
                                value={formData.bookDate}
                                onChange={(e) => {
                                    const selectedDate = e.target.value;

                                    let updatedTime = formData.bookTime;

                                    const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
                                        .toISOString()
                                        .split("T")[0];

                                    if (selectedDate === today && formData.bookTime) {

                                        const now = new Date();

                                        const currentTime = String(now.getHours()).padStart(2, "0") + ":" + String(now.getMinutes()).padStart(2, "0");

                                        if (formData.bookTime < currentTime) {

                                            updatedTime = "";

                                            alert("Giờ đã chọn không hợp lệ cho ngày hôm nay!");
                                        }
                                    }

                                    setFormData({
                                        ...formData, bookDate: selectedDate, bookTime: updatedTime
                                    });
                                }}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Giờ đặt <span
                                className="text-red-500">*</span></label>
                            <input
                                type="time"
                                min={getMinTime()}
                                value={formData.bookTime}
                                onChange={(e) => {

                                    const selectedTime = e.target.value;

                                    const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
                                        .toISOString()
                                        .split("T")[0];

                                    let error = "";

                                    if (formData.bookDate === today) {

                                        const now = new Date();

                                        const currentTime = String(now.getHours()).padStart(2, "0") + ":" + String(now.getMinutes()).padStart(2, "0");

                                        if (selectedTime < currentTime) {
                                            error = "Giờ không hợp lệ!";
                                        }
                                    }

                                    setErrors((prev) => ({
                                        ...prev, bookTime: error
                                    }));

                                    setFormData({
                                        ...formData, bookTime: selectedTime
                                    });
                                }}
                                className={`w-full border rounded-lg px-3 py-2 outline-none text-sm ${errors.bookTime ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-blue-500"}`}
                            />
                            {errors.bookTime && (<p className="text-red-500 text-xs mt-1">
                                {errors.bookTime}
                            </p>)}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Số người <span
                                className="text-red-500">*</span></label>
                            <select value={formData.guestCount}
                                    onChange={(e) => setFormData({...formData, guestCount: e.target.value})}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 text-sm bg-white"
                            >
                                <option value="">Chọn số người</option>
                                <option value="2">2 người</option>
                                <option value="4">4 người</option>
                                <option value="6">6+ người</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Chọn bàn <span
                                className="text-red-500">*</span></label>
                            <select value={formData.tableId}
                                    onChange={(e) => setFormData({...formData, tableId: e.target.value})}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 text-sm bg-white"
                            >
                                <option value="">Chọn bàn trống</option>
                                {tables.map((t) => (<option key={t.tableId} value={t.tableId}>
                                    Bàn {t.tableNumber} ({t.capacity} người)
                                </option>))}
                            </select>
                            {tables.length === 0 && (<p className="text-sm text-red-500 mt-2">
                                Không còn bàn phù hợp
                            </p>)}
                        </div>
                    </div>
                </div>
                {/* Footer */}
                <div className="px-6 py-4 border-t flex justify-end gap-3 bg-gray-50">
                    <button onClick={() => setShowAddModal(false)}
                            className="px-5 py-2 border rounded-lg text-gray-600 hover:bg-gray-100 text-sm font-medium">
                        Hủy
                    </button>
                    <button onClick={handleSubmitReservation} disabled={submitting}
                            className={`px-5 py-2 rounded-lg text-white text-sm font-medium transition ${submitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}>
                        {submitting ? "Đang lưu..." : "Xác nhận đặt bàn"}
                    </button>
                </div>
            </div>
        </div>)}
        {confirmModal.open && (<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl w-full max-w-sm p-6">

                <h2 className="text-lg font-bold mb-2">
                    Xác nhận thao tác
                </h2>

                <p className="text-gray-600 mb-5">
                    {confirmModal.type === "cancel" ? "Bạn có chắc muốn HỦY đặt bàn này?" : "Bạn có chắc muốn KHÔI PHỤC đặt bàn này?"}
                </p>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={() => setConfirmModal({
                            open: false, id: null, type: null
                        })}
                        className="px-4 py-2 rounded-lg bg-gray-200"
                    >
                        Hủy
                    </button>

                    <button
                        onClick={handleConfirmAction}
                        className={`px-4 py-2 rounded-lg text-white ${confirmModal.type === "cancel" ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}`}
                    >
                        Xác nhận
                    </button>
                </div>

            </div>
        </div>)}
    </div>);
}