import React, { useState, useEffect, useMemo, useRef } from "react";
import { Calendar, Plus, RotateCcw, X, Search, ChevronLeft, ChevronRight, Users, Clock, Phone, Mail, UtensilsCrossed, Sparkles } from "lucide-react";
import CalendarView from "./CalendarView";
 
// ─── STYLE INJECTION ────────────────────────────────────────────────────────
const injectStyles = () => `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
 
  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes shimmerGold {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  @keyframes pulseRing {
    0%   { box-shadow: 0 0 0 0 rgba(196,154,108,0.25); }
    70%  { box-shadow: 0 0 0 8px rgba(196,154,108,0); }
    100% { box-shadow: 0 0 0 0 rgba(196,154,108,0); }
  }
  @keyframes rowReveal {
    from { opacity: 0; transform: translateX(-6px); }
    to   { opacity: 1; transform: translateX(0); }
  }
 
  .res-page * { font-family: 'DM Sans', sans-serif; box-sizing: border-box; }
  .res-page h1, .res-page h2, .res-page .serif { font-family: 'Cormorant Garamond', serif; }
 
  .res-fade-in  { animation: fadeSlideIn 0.45s ease both; }
  .res-row-anim { animation: rowReveal 0.3s ease both; }
 
  .res-card {
    background: linear-gradient(145deg, #FEFCF8 0%, #FAF6EE 100%);
    border: 1px solid rgba(196,154,108,0.18);
    border-radius: 20px;
    box-shadow: 0 2px 24px rgba(160,120,70,0.06), 0 1px 4px rgba(160,120,70,0.04);
  }
 
  .res-input {
    width: 100%;
    background: #FEFCF9;
    border: 1.5px solid rgba(196,154,108,0.25);
    border-radius: 12px;
    padding: 11px 14px;
    color: #3D2E1E;
    font-size: 13px;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    font-family: 'DM Sans', sans-serif;
  }
  .res-input::placeholder { color: #B5A090; }
  .res-input:focus {
    border-color: rgba(196,154,108,0.7);
    box-shadow: 0 0 0 3px rgba(196,154,108,0.1);
  }
  .res-input.error {
    border-color: rgba(220,80,60,0.5);
    box-shadow: 0 0 0 3px rgba(220,80,60,0.07);
  }
 
  .res-select {
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23C49A6C' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    padding-right: 36px !important;
  }
 
  .res-btn-gold {
    background: linear-gradient(135deg, #C49A6C 0%, #A87B4A 100%);
    color: #FEF8EF;
    border: none;
    border-radius: 12px;
    padding: 10px 20px;
    font-size: 12.5px;
    font-weight: 600;
    letter-spacing: 0.04em;
    cursor: pointer;
    display: flex; align-items: center; gap: 7px;
    transition: all 0.2s;
    box-shadow: 0 4px 14px rgba(196,154,108,0.3);
    font-family: 'DM Sans', sans-serif;
  }
  .res-btn-gold:hover {
    background: linear-gradient(135deg, #D4AA7C 0%, #B88B5A 100%);
    box-shadow: 0 6px 20px rgba(196,154,108,0.4);
    transform: translateY(-1px);
  }
  .res-btn-gold:active { transform: translateY(0); }
 
  .res-btn-outline {
    background: transparent;
    color: #7A6048;
    border: 1.5px solid rgba(196,154,108,0.35);
    border-radius: 12px;
    padding: 10px 20px;
    font-size: 12.5px;
    font-weight: 500;
    cursor: pointer;
    display: flex; align-items: center; gap: 7px;
    transition: all 0.2s;
    font-family: 'DM Sans', sans-serif;
  }
  .res-btn-outline:hover {
    background: rgba(196,154,108,0.07);
    border-color: rgba(196,154,108,0.55);
    color: #5A4030;
  }
 
  .res-btn-ghost {
    background: rgba(196,154,108,0.06);
    color: #7A6048;
    border: 1.5px solid rgba(196,154,108,0.15);
    border-radius: 10px;
    padding: 9px 16px;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    display: flex; align-items: center; gap: 6px;
    transition: all 0.2s;
    font-family: 'DM Sans', sans-serif;
  }
  .res-btn-ghost:hover {
    background: rgba(196,154,108,0.12);
    border-color: rgba(196,154,108,0.3);
  }
 
  .res-table-wrap { border-radius: 20px; overflow: hidden; }
  .res-table { width: 100%; border-collapse: collapse; }
  .res-table thead tr {
    background: linear-gradient(90deg, #F5EFE4 0%, #EDE5D8 100%);
  }
  .res-table th {
    padding: 14px 18px;
    font-size: 10.5px;
    font-weight: 700;
    letter-spacing: 0.12em;
    color: #8A7060;
    text-transform: uppercase;
    white-space: nowrap;
    border-bottom: 1px solid rgba(196,154,108,0.15);
  }
  .res-table tbody tr {
    border-bottom: 1px solid rgba(196,154,108,0.08);
    transition: background 0.15s;
  }
  .res-table tbody tr:hover { background: rgba(196,154,108,0.04); }
  .res-table tbody tr.row-cancelled { background: rgba(220,60,60,0.02); }
  .res-table tbody tr.row-completed { background: rgba(60,180,100,0.025); }
  .res-table td {
    padding: 15px 18px;
    font-size: 13px;
    color: #3D2E1E;
    vertical-align: middle;
  }
 
  .badge {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 10.5px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
  .badge-active   { background: rgba(196,154,108,0.12); color: #9A6B30; border: 1px solid rgba(196,154,108,0.25); }
  .badge-cancelled{ background: rgba(220,60,60,0.08);  color: #C03030; border: 1px solid rgba(220,60,60,0.2); }
  .badge-completed{ background: rgba(40,160,80,0.08);  color: #1A8040; border: 1px solid rgba(40,160,80,0.2); }
 
  .table-badge {
    display: inline-block;
    background: linear-gradient(135deg, rgba(196,154,108,0.12), rgba(196,154,108,0.06));
    border: 1px solid rgba(196,154,108,0.3);
    color: #7A5A2A;
    padding: 4px 12px;
    border-radius: 8px;
    font-size: 11.5px;
    font-weight: 600;
  }
 
  .action-btn-cancel {
    padding: 6px 16px;
    border-radius: 9px;
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    background: rgba(220,60,60,0.06);
    color: #C03030;
    border: 1px solid rgba(220,60,60,0.2);
    font-family: 'DM Sans', sans-serif;
  }
  .action-btn-cancel:hover { background: rgba(220,60,60,0.12); }
 
  .action-btn-restore {
    padding: 6px 16px;
    border-radius: 9px;
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    background: rgba(40,160,80,0.07);
    color: #1A8040;
    border: 1px solid rgba(40,160,80,0.2);
    font-family: 'DM Sans', sans-serif;
  }
  .action-btn-restore:hover { background: rgba(40,160,80,0.13); }
 
  .action-btn-done {
    padding: 6px 16px;
    border-radius: 9px;
    font-size: 11px;
    font-weight: 600;
    background: rgba(40,160,80,0.06);
    color: #1A8040;
    border: 1px solid rgba(40,160,80,0.15);
    cursor: default;
    font-family: 'DM Sans', sans-serif;
  }
 
  .res-page-btn {
    width: 34px; height: 34px;
    border-radius: 9px;
    border: 1.5px solid rgba(196,154,108,0.2);
    background: #FEFCF9;
    color: #7A6048;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;
    display: flex; align-items: center; justify-content: center;
    font-family: 'DM Sans', sans-serif;
  }
  .res-page-btn:hover:not(:disabled) {
    background: rgba(196,154,108,0.1);
    border-color: rgba(196,154,108,0.4);
    color: #5A4030;
  }
  .res-page-btn.active {
    background: linear-gradient(135deg, #C49A6C, #A87B4A);
    border-color: transparent;
    color: #FEF8EF;
    box-shadow: 0 3px 10px rgba(196,154,108,0.35);
  }
  .res-page-btn:disabled { opacity: 0.35; cursor: not-allowed; }
 
  /* Modal */
  .res-modal-overlay {
    position: fixed; inset: 0;
    background: rgba(26,14,6,0.55);
    backdrop-filter: blur(4px);
    display: flex; align-items: center; justify-content: center;
    z-index: 100; padding: 16px;
  }
  .res-modal {
    background: linear-gradient(160deg, #FEFCF8 0%, #F8F2E8 100%);
    border: 1px solid rgba(196,154,108,0.25);
    border-radius: 24px;
    width: 100%; max-width: 540px;
    max-height: 90vh;
    overflow: hidden;
    display: flex; flex-direction: column;
    box-shadow: 0 30px 80px rgba(60,30,10,0.25);
    animation: fadeSlideIn 0.3s ease;
  }
  .res-modal-header {
    padding: 24px 28px 20px;
    border-bottom: 1px solid rgba(196,154,108,0.15);
    display: flex; align-items: center; justify-content: space-between;
    background: linear-gradient(90deg, rgba(196,154,108,0.06) 0%, transparent 100%);
  }
  .res-modal-body {
    padding: 24px 28px;
    overflow-y: auto;
    display: flex; flex-direction: column; gap: 16px;
  }
  .res-modal-body::-webkit-scrollbar { width: 4px; }
  .res-modal-body::-webkit-scrollbar-thumb {
    background: rgba(196,154,108,0.2); border-radius: 4px;
  }
  .res-modal-footer {
    padding: 16px 28px 24px;
    border-top: 1px solid rgba(196,154,108,0.12);
    display: flex; justify-content: flex-end; gap: 10px;
    background: rgba(196,154,108,0.03);
  }
 
  .res-label {
    display: block;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #8A7060;
    margin-bottom: 6px;
    font-family: 'DM Sans', sans-serif;
  }
  .res-error { font-size: 11px; color: #C03030; margin-top: 4px; }
 
  .divider-gold {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(196,154,108,0.3), transparent);
    margin: 2px 0;
  }
 
  .close-btn {
    width: 32px; height: 32px;
    border-radius: 9px;
    background: rgba(196,154,108,0.08);
    border: 1px solid rgba(196,154,108,0.2);
    color: #8A7060;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.15s;
  }
  .close-btn:hover { background: rgba(220,60,60,0.08); border-color: rgba(220,60,60,0.2); color: #C03030; }
 
  .confirm-modal {
    background: linear-gradient(160deg, #FEFCF8 0%, #F8F2E8 100%);
    border: 1px solid rgba(196,154,108,0.25);
    border-radius: 20px;
    width: 100%; max-width: 360px;
    padding: 32px 28px;
    text-align: center;
    box-shadow: 0 30px 80px rgba(60,30,10,0.25);
    animation: fadeSlideIn 0.3s ease;
  }
 
  .stat-chip {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    background: rgba(196,154,108,0.08);
    color: #7A5A2A;
    border: 1px solid rgba(196,154,108,0.2);
  }
 
  .search-wrap { position: relative; }
  .search-wrap .search-icon {
    position: absolute; left: 13px; top: 50%; transform: translateY(-50%);
    color: #B5A090; pointer-events: none;
  }
  .search-wrap .res-input { padding-left: 38px; }
 
  /* ── RESPONSIVE ─────────────────────────────────────────────────────── */

  /* Ẩn cột Liên hệ & Số khách trên mobile */
  @media (max-width: 640px) {
    .res-table th:nth-child(2),
    .res-table td:nth-child(2),
    .res-table th:nth-child(3),
    .res-table td:nth-child(3),
    .res-table th:nth-child(5),
    .res-table td:nth-child(5) { display: none; }

    .res-table th,
    .res-table td { padding: 10px 10px; font-size: 11.5px; }

    .res-modal { border-radius: 24px 24px 0 0; max-height: 95vh; margin-top: auto; }
    .res-modal-header { padding: 18px 18px 14px; }
    .res-modal-body { padding: 16px 18px; }
    .res-modal-footer { padding: 12px 18px 20px; flex-direction: column-reverse; }
    .res-modal-footer button { width: 100%; justify-content: center; }

    .confirm-modal { border-radius: 20px; padding: 24px 18px; }
  }

  /* Ẩn cột Liên hệ trên tablet nhỏ */
  @media (max-width: 768px) {
    .res-table th:nth-child(3),
    .res-table td:nth-child(3) { display: none; }
  }

  /* Overlay căn bottom trên mobile */
  @media (max-width: 640px) {
    .res-modal-overlay { align-items: flex-end; padding: 0; }
  }
`;
 
export default function Reservations() {
  const [showCalendar, setShowCalendar] = useState(false);
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [showAddModal, setShowAddModal] = useState(false);
 
  const initialForm = {
    customerName: "", phone: "", email: "",
    bookDate: "", bookTime: "", guestCount: "", tableId: "",
  };
 
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const isComposing = useRef(false);
 
  const [confirmModal, setConfirmModal] = useState({ open: false, id: null, type: null });
 
  // ── FETCH ──────────────────────────────────────────────────────────────────
  useEffect(() => { fetchReservations().catch(console.error); }, []);
 
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
 
  // ── FILTER + SEARCH ────────────────────────────────────────────────────────
  const filteredReservations = useMemo(() => {
    return reservations
      .filter((item) => {
        const keyword = searchTerm.toLowerCase();
        const matchSearch =
          item.customerName?.toLowerCase().includes(keyword) ||
          item.phone?.toLowerCase().includes(keyword);
        if (!item.reservationTime) return false;
        const reservationDate = new Date(item.reservationTime);
        reservationDate.setHours(0, 0, 0, 0);
        let validStart = true, validEnd = true;
        if (startDate) { const s = new Date(startDate); s.setHours(0,0,0,0); validStart = reservationDate >= s; }
        if (endDate)   { const e = new Date(endDate);   e.setHours(0,0,0,0); validEnd   = reservationDate <= e; }
        return matchSearch && validStart && validEnd;
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [reservations, searchTerm, startDate, endDate]);
 
  const totalPages = Math.ceil(filteredReservations.length / itemsPerPage);
  const currentReservations = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredReservations.slice(start, start + itemsPerPage);
  }, [filteredReservations, currentPage]);
 
  useEffect(() => { setCurrentPage(1); }, [searchTerm, startDate, endDate]);
 
  const formatDateTime = (dateString) => {
    if (!dateString) return "—";
    return new Intl.DateTimeFormat("vi-VN", {
      hour: "2-digit", minute: "2-digit",
      day: "2-digit", month: "2-digit", year: "numeric",
    }).format(new Date(dateString));
  };
 
  const handleReset = () => { setSearchTerm(""); setStartDate(""); setEndDate(""); };
 
  const handleOpenAddModal = () => { setFormData(initialForm); setErrors({}); setShowAddModal(true); };
 
  useEffect(() => {
    const fetchAvailableTables = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/tables");
        const data = await response.json();
        if (!formData.guestCount) { setTables(data.filter((t) => t.status === "Available")); return; }
        const filteredTables = data.filter((t) => t.status === "Available" && t.capacity >= parseInt(formData.guestCount));
        setTables(filteredTables);
        const selectedTableStillValid = filteredTables.some((t) => t.tableId === parseInt(formData.tableId));
        if (!selectedTableStillValid) setFormData((prev) => ({ ...prev, tableId: "" }));
      } catch (error) { console.error("Lỗi lấy bàn:", error); }
    };
    if (showAddModal) fetchAvailableTables().catch(console.error);
  }, [formData.guestCount, formData.tableId, showAddModal]);
 
  // ── SUBMIT ─────────────────────────────────────────────────────────────────
  const handleSubmitReservation = async () => {
    const newErrors = {};
    if (!formData.customerName.trim()) newErrors.customerName = "Vui lòng nhập tên khách hàng!";
    if (!formData.phone.trim()) newErrors.phone = "Vui lòng nhập số điện thoại!";
    else if (!/^\d{8,15}$/.test(formData.phone)) newErrors.phone = "Số điện thoại phải từ 8 - 15 số!";
    if (!formData.email.trim()) newErrors.email = "Vui lòng nhập email!";
    else if (!/^[A-Za-z0-9._%+-]+@gmail\.com$/.test(formData.email)) newErrors.email = "Email phải đúng định dạng @gmail.com!";
    if (!formData.bookDate) newErrors.bookDate = "Vui lòng chọn ngày đặt!";
    if (!formData.bookTime) newErrors.bookTime = "Vui lòng chọn giờ đặt!";
    if (formData.bookDate && formData.bookTime) {
      const selectedDateTime = new Date(`${formData.bookDate}T${formData.bookTime}`);
      if (selectedDateTime.getTime() < new Date().getTime()) newErrors.bookTime = "Không thể chọn giờ trong quá khứ!";
    }
    if (!formData.guestCount) newErrors.guestCount = "Vui lòng chọn số người!";
    if (!formData.tableId) newErrors.tableId = "Vui lòng chọn bàn!";
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
 
    try {
      setErrors({});
      setSubmitting(true);
      const payload = {
        customerName: formData.customerName, phone: formData.phone, email: formData.email,
        reservationTime: `${formData.bookDate}T${formData.bookTime}:00`,
        guestCount: parseInt(formData.guestCount),
        table: { tableId: parseInt(formData.tableId) },
        isPaid: false,
      };
      const response = await fetch("http://localhost:8080/api/reservations", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const newReservation = await response.json();
      const selectedTable = tables.find((t) => t.tableId === parseInt(formData.tableId));
      const enriched = { ...newReservation, table: selectedTable ?? newReservation.table };
      setReservations((prev) => [enriched, ...prev]);
      setShowAddModal(false);
      setFormData(initialForm);
    } catch (error) { console.error("Lỗi tạo reservation:", error); }
    finally { setSubmitting(false); }
  };
 
  // ── CONFIRM ACTION ─────────────────────────────────────────────────────────
  const openConfirmModal = (id, type) => setConfirmModal({ open: true, id, type });
 
  const handleConfirmAction = async () => {
    const { id, type } = confirmModal;
    try {
      let url = type === "cancel"
        ? `http://localhost:8080/api/reservations/${id}/cancel`
        : `http://localhost:8080/api/reservations/${id}/restore`;
      const response = await fetch(url, { method: "PUT" });
      if (!response.ok) throw new Error("Request failed");
      const updated = await response.json();
      setReservations((prev) => prev.map((item) => (item.reservationId === id ? updated : item)));
    } catch (error) { console.error("Lỗi:", error); }
    finally { setConfirmModal({ open: false, id: null, type: null }); }
  };
 
  const getMinTime = () => {
    if (!formData.bookDate) return "";
    const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split("T")[0];
    if (formData.bookDate !== today) return "";
    const now = new Date();
    return `${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;
  };
 
  if (showCalendar) {
    return <CalendarView onBack={() => setShowCalendar(false)} reservations={reservations} />;
  }
 
  // ── STATS ──────────────────────────────────────────────────────────────────
  const totalActive    = reservations.filter(r => r.status === "ACTIVE").length;
  const totalCompleted = reservations.filter(r => r.status === "COMPLETED").length;
  const totalCancelled = reservations.filter(r => r.status === "CANCELLED").length;
 
  return (
    <div className="res-page" style={{ minHeight: "100vh", background: "linear-gradient(160deg, #FDFAF4 0%, #F5EDDF 100%)", padding: "clamp(14px, 3vw, 28px) clamp(12px, 3vw, 24px)" }}>
      <style>{injectStyles()}</style>
 
      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <div className="res-fade-in" style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <Sparkles size={13} style={{ color: "#C49A6C" }} />
              <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#B5A080" }}>
                CELESTÉ HOUSE
              </span>
            </div>
            <h1 className="serif" style={{ fontSize: "clamp(22px, 5vw, 30px)", fontWeight: 600, color: "#2C1C0E", margin: 0, lineHeight: 1.1 }}>
              Lịch Đặt Bàn
            </h1>
            <p style={{ fontSize: 12.5, color: "#9A8068", marginTop: 5 }}>
              Quản lý và theo dõi toàn bộ lịch đặt bàn của nhà hàng
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className="res-btn-outline" onClick={() => setShowCalendar(true)}>
              <Calendar size={15} /> Xem lịch
            </button>
            <button className="res-btn-gold" onClick={handleOpenAddModal} style={{ animation: "pulseRing 2.5s infinite" }}>
              <Plus size={15} /> Thêm đặt bàn
            </button>
          </div>
        </div>
 
        {/* Stats chips */}
        <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
          <span className="stat-chip"><span style={{ width: 7, height: 7, borderRadius: "50%", background: "#C49A6C", display: "inline-block" }}></span>{totalActive} đang chờ</span>
          <span className="stat-chip" style={{ background: "rgba(40,160,80,0.07)", color: "#1A8040", borderColor: "rgba(40,160,80,0.2)" }}><span style={{ width: 7, height: 7, borderRadius: "50%", background: "#28A050", display: "inline-block" }}></span>{totalCompleted} hoàn thành</span>
          <span className="stat-chip" style={{ background: "rgba(220,60,60,0.06)", color: "#C03030", borderColor: "rgba(220,60,60,0.2)" }}><span style={{ width: 7, height: 7, borderRadius: "50%", background: "#DC3C3C", display: "inline-block" }}></span>{totalCancelled} đã hủy</span>
        </div>
      </div>
 
      {/* ── FILTER BAR ─────────────────────────────────────────────────────── */}
      <div className="res-card res-fade-in" style={{ padding: "18px 20px", marginBottom: 20, animationDelay: "0.05s" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10, alignItems: "center" }}>
          <div className="search-wrap">
            <Search size={15} className="search-icon" />
            <input
              className="res-input"
              type="text"
              placeholder="Tìm tên khách hoặc số điện thoại..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div style={{ position: "relative" }}>
            <input
              className="res-input"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              title="Từ ngày"
            />
          </div>
          <div style={{ position: "relative" }}>
            <input
              className="res-input"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              title="Đến ngày"
            />
          </div>
          <button className="res-btn-ghost" onClick={handleReset}>
            <RotateCcw size={13} /> Đặt lại
          </button>
        </div>
      </div>
 
      {/* ── TABLE ──────────────────────────────────────────────────────────── */}
      <div className="res-card res-fade-in" style={{ animationDelay: "0.1s", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table className="res-table">
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>Khách hàng</th>
                <th style={{ textAlign: "left" }}>Liên hệ</th>
                <th style={{ textAlign: "center" }}>Thời gian đặt</th>
                <th style={{ textAlign: "center" }}>Bàn</th>
                <th style={{ textAlign: "center" }}>Số khách</th>
                <th style={{ textAlign: "center" }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "48px 0", color: "#B5A080" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", border: "2.5px solid rgba(196,154,108,0.3)", borderTopColor: "#C49A6C", animation: "spin 0.9s linear infinite" }}></div>
                      <span style={{ fontSize: 13 }}>Đang tải dữ liệu...</span>
                    </div>
                  </td>
                </tr>
              ) : currentReservations.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "60px 0", color: "#B5A080" }}>
                    <UtensilsCrossed size={32} style={{ margin: "0 auto 12px", opacity: 0.3 }} />
                    <p style={{ fontSize: 13.5, fontWeight: 500 }}>Không tìm thấy lịch đặt bàn nào</p>
                    <p style={{ fontSize: 12, marginTop: 4, opacity: 0.7 }}>Thử thay đổi bộ lọc hoặc thêm mới</p>
                  </td>
                </tr>
              ) : (
                currentReservations.map((item, idx) => (
                  <tr
                    key={item.reservationId}
                    className={`res-row-anim ${item.status === "CANCELLED" ? "row-cancelled" : item.status === "COMPLETED" ? "row-completed" : ""}`}
                    style={{ animationDelay: `${idx * 0.04}s` }}
                  >
                    {/* Khách hàng */}
                    <td>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                          <span style={{ fontWeight: 600, color: "#2C1C0E", fontSize: 13.5 }}>{item.customerName}</span>
                          {item.status === "CANCELLED"  && <span className="badge badge-cancelled">Đã hủy</span>}
                          {item.status === "COMPLETED"  && <span className="badge badge-completed">Hoàn thành</span>}
                          {item.status === "ACTIVE"     && <span className="badge badge-active">Đang chờ</span>}
                        </div>
                        <span style={{ fontSize: 11, color: "#B5A080" }}>Đặt lúc {formatDateTime(item.createdAt)}</span>
                      </div>
                    </td>
 
                    {/* Liên hệ */}
                    <td>
                      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12.5, color: "#4A3220" }}>
                          <Phone size={11} style={{ color: "#C49A6C" }} />{item.phone}
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11.5, color: "#9A8068" }}>
                          <Mail size={10} style={{ color: "#C49A6C", opacity: 0.6 }} />{item.email || "—"}
                        </span>
                      </div>
                    </td>
 
                    {/* Thời gian */}
                    <td style={{ textAlign: "center" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12.5, color: "#4A3220", fontWeight: 500 }}>
                          <Clock size={12} style={{ color: "#C49A6C" }} />
                          {formatDateTime(item.reservationTime)}
                        </span>
                      </div>
                    </td>
 
                    {/* Bàn */}
                    <td style={{ textAlign: "center" }}>
                      <span className="table-badge">
                        {item.table ? `Bàn ${item.table.tableNumber}` : "Chưa xếp"}
                      </span>
                    </td>
 
                    {/* Số khách */}
                    <td style={{ textAlign: "center" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontWeight: 600, fontSize: 13, color: "#5A3E20" }}>
                        <Users size={13} style={{ color: "#C49A6C" }} />{item.guestCount}
                      </span>
                    </td>
 
                    {/* Thao tác */}
                    <td style={{ textAlign: "center" }}>
                      {item.status === "CANCELLED" ? (
                        <button className="action-btn-restore" onClick={() => openConfirmModal(item.reservationId, "restore")}>Khôi phục</button>
                      ) : item.status === "COMPLETED" ? (
                        <span className="action-btn-done">Hoàn thành</span>
                      ) : (
                        <button className="action-btn-cancel" onClick={() => openConfirmModal(item.reservationId, "cancel")}>Hủy đặt</button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
 
        {/* Pagination */}
        {totalPages > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderTop: "1px solid rgba(196,154,108,0.1)", background: "rgba(196,154,108,0.02)", flexWrap: "wrap", gap: 8 }}>
            <span style={{ fontSize: 12, color: "#9A8068" }}>
              Hiển thị <strong style={{ color: "#5A3E20" }}>{(currentPage - 1) * itemsPerPage + 1}</strong> – <strong style={{ color: "#5A3E20" }}>{Math.min(currentPage * itemsPerPage, filteredReservations.length)}</strong> / <strong style={{ color: "#5A3E20" }}>{filteredReservations.length}</strong> lịch đặt
            </span>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <button className="res-page-btn" disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}>
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button key={page} className={`res-page-btn ${currentPage === page ? "active" : ""}`} onClick={() => setCurrentPage(page)}>
                  {page}
                </button>
              ))}
              <button className="res-page-btn" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
 
      {/* ── ADD MODAL ──────────────────────────────────────────────────────── */}
      {showAddModal && (
        <div className="res-modal-overlay">
          <div className="res-modal">
            <div className="res-modal-header">
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#B5A080", marginBottom: 3 }}>CELESTÉ HOUSE</p>
                <h2 className="serif" style={{ fontSize: 22, fontWeight: 600, color: "#2C1C0E", margin: 0 }}>Thêm lịch đặt bàn</h2>
              </div>
              <button className="close-btn" onClick={() => { setShowAddModal(false); setFormData(initialForm); setErrors({}); }}>
                <X size={15} />
              </button>
            </div>
 
            <div className="res-modal-body">
              {/* Tên khách */}
              <div>
                <label className="res-label">Tên khách hàng <span style={{ color: "#C49A6C" }}>*</span></label>
                <input
                  className={`res-input ${errors.customerName ? "error" : ""}`}
                  type="text"
                  placeholder="Nguyễn Văn A"
                  value={formData.customerName}
                  onCompositionStart={() => { isComposing.current = true; }}
                  onCompositionEnd={(e) => {
                    isComposing.current = false;
                    const cleaned = e.target.value.replace(/[^A-Za-zÀ-ỹ\s]/g, "");
                    setFormData({ ...formData, customerName: cleaned });
                  }}
                  onChange={(e) => {
                    if (isComposing.current) { setFormData({ ...formData, customerName: e.target.value }); return; }
                    const cleaned = e.target.value.replace(/[^A-Za-zÀ-ỹ\s]/g, "");
                    setFormData({ ...formData, customerName: cleaned });
                    setErrors(prev => ({ ...prev, customerName: "" }));
                  }}
                  onPaste={(e) => {
                    e.preventDefault();
                    const paste = e.clipboardData.getData("text");
                    const cleaned = paste.replace(/[^A-Za-zÀ-ỹ\s]/g, "");
                    setFormData({ ...formData, customerName: cleaned });
                  }}
                  maxLength={50}
                />
                {errors.customerName && <p className="res-error">{errors.customerName}</p>}
              </div>
 
              {/* Phone + Email */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
                <div>
                  <label className="res-label">Số điện thoại <span style={{ color: "#C49A6C" }}>*</span></label>
                  <input
                    className={`res-input ${errors.phone ? "error" : ""}`}
                    type="tel" placeholder="090..."
                    value={formData.phone}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, "");
                      if (value.length <= 15) setFormData({ ...formData, phone: value });
                      setErrors(prev => ({ ...prev, phone: "" }));
                    }}
                    onBlur={() => {
                      if (formData.phone && !/^\d{8,15}$/.test(formData.phone))
                        setErrors(prev => ({ ...prev, phone: "Số điện thoại phải từ 8 - 15 số!" }));
                      else setErrors(prev => ({ ...prev, phone: "" }));
                    }}
                    maxLength={15}
                  />
                  {errors.phone && <p className="res-error">{errors.phone}</p>}
                </div>
                <div>
                  <label className="res-label">Email <span style={{ color: "#C49A6C" }}>*</span></label>
                  <input
                    className={`res-input ${errors.email ? "error" : ""}`}
                    type="email" placeholder="example@gmail.com"
                    value={formData.email}
                    onChange={(e) => { setFormData({ ...formData, email: e.target.value }); setErrors(prev => ({ ...prev, email: "" })); }}
                    onBlur={() => {
                      if (formData.email && !/^[A-Za-z0-9._%+-]+@gmail\.com$/.test(formData.email))
                        setErrors(prev => ({ ...prev, email: "Email phải đúng định dạng @gmail.com!" }));
                    }}
                  />
                  {errors.email && <p className="res-error">{errors.email}</p>}
                </div>
              </div>
 
              <div className="divider-gold"></div>
 
              {/* Ngày + Giờ */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
                <div>
                  <label className="res-label">Ngày đặt <span style={{ color: "#C49A6C" }}>*</span></label>
                  <input
                    className={`res-input ${errors.bookDate ? "error" : ""}`}
                    type="date"
                    min={new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split("T")[0]}
                    value={formData.bookDate}
                    onChange={(e) => {
                      const selectedDate = e.target.value;
                      let updatedTime = formData.bookTime;
                      const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split("T")[0];
                      if (selectedDate === today && formData.bookTime) {
                        const now = new Date();
                        const selectedDateTime = new Date(`${selectedDate}T${formData.bookTime}`);
                        if (selectedDateTime.getTime() < now.getTime()) {
                          updatedTime = "";
                          setErrors(prev => ({ ...prev, bookTime: "Giờ đã chọn không hợp lệ!" }));
                        }
                      }
                      setFormData({ ...formData, bookDate: selectedDate, bookTime: updatedTime });
                      setErrors(prev => ({ ...prev, bookDate: "" }));
                      if (selectedDate !== today) setErrors(prev => ({ ...prev, bookTime: "" }));
                    }}
                  />
                  {errors.bookDate && <p className="res-error">{errors.bookDate}</p>}
                </div>
                <div>
                  <label className="res-label">Giờ đặt <span style={{ color: "#C49A6C" }}>*</span></label>
                  <input
                    className={`res-input ${errors.bookTime ? "error" : ""}`}
                    type="time" min={getMinTime()}
                    value={formData.bookTime}
                    onChange={(e) => {
                      const selectedTime = e.target.value;
                      const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split("T")[0];
                      let error = "";
                      if (formData.bookDate === today) {
                        const now = new Date();
                        const currentTime = `${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;
                        if (selectedTime < currentTime) error = "Giờ không hợp lệ!";
                      }
                      setErrors(prev => ({ ...prev, bookTime: error }));
                      setFormData({ ...formData, bookTime: selectedTime });
                    }}
                  />
                  {errors.bookTime && <p className="res-error">{errors.bookTime}</p>}
                </div>
              </div>
 
              {/* Số người + Bàn */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
                <div>
                  <label className="res-label">Số người <span style={{ color: "#C49A6C" }}>*</span></label>
                  <select
                    className={`res-input res-select ${errors.guestCount ? "error" : ""}`}
                    value={formData.guestCount}
                    onChange={(e) => { setFormData({ ...formData, guestCount: e.target.value }); setErrors(prev => ({ ...prev, guestCount: "" })); }}
                  >
                    <option value="">Chọn số người</option>
                    <option value="2">2 người</option>
                    <option value="4">4 người</option>
                    <option value="6">6+ người</option>
                  </select>
                  {errors.guestCount && <p className="res-error">{errors.guestCount}</p>}
                </div>
                <div>
                  <label className="res-label">Chọn bàn <span style={{ color: "#C49A6C" }}>*</span></label>
                  <select
                    className={`res-input res-select ${errors.tableId ? "error" : ""}`}
                    value={formData.tableId}
                    onChange={(e) => { setFormData({ ...formData, tableId: e.target.value }); setErrors(prev => ({ ...prev, tableId: "" })); }}
                  >
                    <option value="">Chọn bàn trống</option>
                    {tables.map((t) => (
                      <option key={t.tableId} value={t.tableId}>Bàn {t.tableNumber} ({t.capacity} người)</option>
                    ))}
                  </select>
                  {errors.tableId && <p className="res-error">{errors.tableId}</p>}
                  {tables.length === 0 && formData.guestCount && (
                    <p className="res-error">Không còn bàn phù hợp</p>
                  )}
                </div>
              </div>
            </div>
 
            <div className="res-modal-footer">
              <button className="res-btn-outline" onClick={() => { setShowAddModal(false); setFormData(initialForm); setErrors({}); }}>
                Hủy bỏ
              </button>
              <button className="res-btn-gold" onClick={handleSubmitReservation} disabled={submitting} style={{ opacity: submitting ? 0.6 : 1 }}>
                {submitting ? "Đang lưu..." : "Xác nhận đặt bàn"}
              </button>
            </div>
          </div>
        </div>
      )}
 
      {/* ── CONFIRM MODAL ──────────────────────────────────────────────────── */}
      {confirmModal.open && (
        <div className="res-modal-overlay">
          <div className="confirm-modal">
            <div style={{
              width: 56, height: 56,
              borderRadius: "50%",
              background: confirmModal.type === "cancel" ? "rgba(220,60,60,0.08)" : "rgba(40,160,80,0.08)",
              border: `1px solid ${confirmModal.type === "cancel" ? "rgba(220,60,60,0.2)" : "rgba(40,160,80,0.2)"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px", fontSize: 22
            }}>
              {confirmModal.type === "cancel" ? "🚫" : "♻️"}
            </div>
            <h3 className="serif" style={{ fontSize: 20, fontWeight: 600, color: "#2C1C0E", marginBottom: 8 }}>Xác nhận thao tác</h3>
            <p style={{ fontSize: 13, color: "#7A6048", marginBottom: 24, lineHeight: 1.6 }}>
              {confirmModal.type === "cancel"
                ? "Bạn có chắc muốn hủy lịch đặt bàn này không?"
                : "Bạn có chắc muốn khôi phục lịch đặt bàn này không?"}
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
              <button className="res-btn-outline" onClick={() => setConfirmModal({ open: false, id: null, type: null })}>
                Quay lại
              </button>
              <button
                onClick={handleConfirmAction}
                style={{
                  padding: "10px 22px", borderRadius: 12, border: "none",
                  background: confirmModal.type === "cancel"
                    ? "linear-gradient(135deg, #DC3C3C, #B02020)"
                    : "linear-gradient(135deg, #28A050, #1A7A38)",
                  color: "#fff", fontWeight: 600, fontSize: 12.5,
                  cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                  boxShadow: confirmModal.type === "cancel"
                    ? "0 4px 14px rgba(220,60,60,0.3)"
                    : "0 4px 14px rgba(40,160,80,0.3)",
                  transition: "all 0.2s",
                }}
              >
                {confirmModal.type === "cancel" ? "Xác nhận hủy" : "Khôi phục"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}