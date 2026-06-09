import React, { useState, useEffect, useMemo, useRef } from "react";
import { fetch } from "../services/api";
import {
  Calendar,
  Plus,
  RotateCcw,
  X,
  Search,
  ChevronLeft,
  ChevronRight,
  Users,
  Clock,
  Phone,
  Mail,
  UtensilsCrossed,
  Sparkles,
} from "lucide-react";
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
 
  /* ── GUEST COUNT CARD SELECTOR ──────────────────────────────────────── */
  .guest-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }
  .guest-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    padding: 12px 8px;
    border-radius: 12px;
    border: 1.5px solid rgba(196,154,108,0.2);
    background: #FEFCF9;
    cursor: pointer;
    transition: all 0.18s;
    font-family: 'DM Sans', sans-serif;
    min-height: 64px;
  }
  .guest-card:hover {
    border-color: rgba(196,154,108,0.5);
    background: rgba(196,154,108,0.06);
  }
  .guest-card.selected {
    border-color: #C49A6C;
    background: linear-gradient(135deg, rgba(196,154,108,0.14), rgba(196,154,108,0.06));
    box-shadow: 0 2px 10px rgba(196,154,108,0.2);
  }
  .guest-card.selected .guest-num {
    color: #7A4A10;
  }
  .guest-card.error-border {
    border-color: rgba(220,80,60,0.4);
  }
  .guest-num {
    font-size: 17px;
    font-weight: 700;
    color: #4A3220;
    line-height: 1;
  }
  .guest-label {
    font-size: 10px;
    color: #9A8068;
    font-weight: 500;
    letter-spacing: 0.03em;
  }
 
  /* ── TABLE CARD SELECTOR ─────────────────────────────────────────────── */
  .table-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
    gap: 8px;
    max-height: 200px;
    overflow-y: auto;
    padding-right: 2px;
  }
  .table-grid::-webkit-scrollbar { width: 3px; }
  .table-grid::-webkit-scrollbar-thumb { background: rgba(196,154,108,0.25); border-radius: 4px; }
  .table-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3px;
    padding: 10px 6px;
    border-radius: 12px;
    border: 1.5px solid rgba(196,154,108,0.2);
    background: #FEFCF9;
    cursor: pointer;
    transition: all 0.18s;
    font-family: 'DM Sans', sans-serif;
    min-height: 68px;
    text-align: center;
  }
  .table-card:hover {
    border-color: rgba(196,154,108,0.5);
    background: rgba(196,154,108,0.06);
    transform: translateY(-1px);
  }
  .table-card.selected {
    border-color: #C49A6C;
    background: linear-gradient(135deg, rgba(196,154,108,0.14), rgba(196,154,108,0.06));
    box-shadow: 0 3px 12px rgba(196,154,108,0.25);
  }
  .table-card.selected .table-num-label {
    color: #7A4A10;
  }
  .table-card.error-border {
    border-color: rgba(220,80,60,0.4);
  }
  .table-num-label {
    font-size: 14px;
    font-weight: 700;
    color: #4A3220;
    line-height: 1.1;
  }
  .table-cap-label {
    font-size: 10px;
    color: #9A8068;
    font-weight: 500;
  }
  .table-empty-state {
    grid-column: 1 / -1;
    text-align: center;
    padding: 24px 0;
    color: #B5A080;
    font-size: 12.5px;
  }
 
  .res-input[type="date"] {
    min-width: 0;
    width: 100%;
  }
 
  /* ── MOBILE RESERVATION CARDS ────────────────────────────────────────── */
  @media (max-width: 640px) {
    .res-table-desktop { display: none; }
    .res-mobile-list { display: flex; flex-direction: column; gap: 0; }
  }
  @media (min-width: 641px) {
    .res-table-desktop { display: block; }
    .res-mobile-list { display: none; }
  }
 
  .res-mobile-card {
    padding: 14px 16px;
    border-bottom: 1px solid rgba(196,154,108,0.1);
    display: flex;
    flex-direction: column;
    gap: 8px;
    animation: rowReveal 0.3s ease both;
  }
  .res-mobile-card:last-child { border-bottom: none; }
  .res-mobile-card-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 10px;
  }
  .res-mobile-card-name {
    font-weight: 600;
    color: #2C1C0E;
    font-size: 13.5px;
  }
  .res-mobile-card-meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
    font-size: 11.5px;
    color: #7A6048;
  }
  .res-mobile-card-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }
 
  /* ── RESPONSIVE ─────────────────────────────────────────────────────── */
 
  @media (max-width: 640px) {
    .res-modal {
      border-radius: 20px 20px 0 0;
      max-height: 96vh;
      margin-top: auto;
      width: 100%;
      max-width: 100%;
    }
    .res-modal-header { padding: 16px 16px 13px; }
    .res-modal-body { padding: 14px 16px; gap: 13px; }
    .res-modal-footer { padding: 10px 16px 20px; flex-direction: column-reverse; gap: 8px; }
    .res-modal-footer button { width: 100%; justify-content: center; }
 
    .guest-grid { grid-template-columns: repeat(3, 1fr); gap: 6px; }
    .guest-card { padding: 10px 4px; min-height: 56px; }
    .guest-num { font-size: 15px; }
 
    .table-grid { grid-template-columns: repeat(auto-fill, minmax(76px, 1fr)); gap: 6px; max-height: 170px; }
    .table-card { min-height: 60px; padding: 8px 4px; }
 
    .confirm-modal { border-radius: 20px; padding: 24px 16px; max-width: calc(100vw - 32px); }
  }
 
  /* Overlay căn bottom trên mobile */
  @media (max-width: 640px) {
    .res-modal-overlay { align-items: flex-end; padding: 0; }
  }
 
  .res-input, .res-select {
    max-width: 100%;
    min-width: 0;
  }
 
  /* Tablet: 2 cột modal form */
  @media (min-width: 641px) and (max-width: 900px) {
    .res-modal { max-width: 95vw; }
    .table-grid { grid-template-columns: repeat(auto-fill, minmax(85px, 1fr)); }
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
    customerName: "",
    phone: "",
    email: "",
    bookDate: "",
    bookTime: "",
    guestCount: "",
    tableId: "",
  };
 
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const isComposing = useRef(false);
 
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    id: null,
    type: null,
  });
 
  // ── FETCH ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    fetchReservations().catch(console.error);
  }, []);
 
  const fetchReservations = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/reservations");
      const data = await response.json();
      const updatedData = await autoCompleteWithData(data);
      setReservations(updatedData);
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
        let validStart = true,
          validEnd = true;
        if (startDate) {
          const s = new Date(startDate);
          s.setHours(0, 0, 0, 0);
          validStart = reservationDate >= s;
        }
        if (endDate) {
          const e = new Date(endDate);
          e.setHours(0, 0, 0, 0);
          validEnd = reservationDate <= e;
        }
        return matchSearch && validStart && validEnd;
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [reservations, searchTerm, startDate, endDate]);
 
  const totalPages = Math.ceil(filteredReservations.length / itemsPerPage);
  const currentReservations = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredReservations.slice(start, start + itemsPerPage);
  }, [filteredReservations, currentPage]);
 
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, startDate, endDate]);
 
  const formatDateTime = (dateString) => {
    if (!dateString) return "—";
    return new Intl.DateTimeFormat("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(dateString));
  };
 
  const handleReset = () => {
    setSearchTerm("");
    setStartDate("");
    setEndDate("");
  };
 
  const handleOpenAddModal = () => {
    setFormData(initialForm);
    setErrors({});
    setShowAddModal(true);
  };
 
  useEffect(() => {
    const fetchAvailableTables = async () => {
      try {
        const response = await fetch("/api/tables");
        const data = await response.json();
        if (!formData.guestCount) {
          setTables(data.filter((t) => t.status === "Available"));
          return;
        }
        const guestNum = parseInt(formData.guestCount);
        let filteredTables;
        if (guestNum === 2) {
          filteredTables = data.filter(
            (t) => t.status === "Available" && t.capacity === 2,
          );
        } else if (guestNum === 4) {
          filteredTables = data.filter(
            (t) => t.status === "Available" && t.capacity === 4,
          );
        } else {
          // 6+ người: hiển thị bàn sức chứa 10
          filteredTables = data.filter(
            (t) => t.status === "Available" && t.capacity === 10,
          );
        }
        setTables(filteredTables);
        const selectedTableStillValid = filteredTables.some(
          (t) => t.tableId === parseInt(formData.tableId),
        );
        if (!selectedTableStillValid)
          setFormData((prev) => ({ ...prev, tableId: "" }));
      } catch (error) {
        console.error("Lỗi lấy bàn:", error);
      }
    };
    if (showAddModal) fetchAvailableTables().catch(console.error);
  }, [formData.guestCount, formData.tableId, showAddModal]);
 
  // ── SUBMIT ─────────────────────────────────────────────────────────────────
  const handleSubmitReservation = async () => {
    const newErrors = {};
    if (!formData.customerName.trim())
      newErrors.customerName = "Vui lòng nhập tên khách hàng!";
    if (!formData.phone.trim())
      newErrors.phone = "Vui lòng nhập số điện thoại!";
    else if (!/^\d{8,15}$/.test(formData.phone))
      newErrors.phone = "Số điện thoại phải từ 8 - 15 số!";
    if (!formData.email.trim()) newErrors.email = "Vui lòng nhập email!";
    else if (!/^[A-Za-z0-9._%+-]+@gmail\.com$/.test(formData.email))
      newErrors.email = "Email phải đúng định dạng @gmail.com!";
    if (!formData.bookDate) newErrors.bookDate = "Vui lòng chọn ngày đặt!";
    if (!formData.bookTime) newErrors.bookTime = "Vui lòng chọn giờ đặt!";
    if (formData.bookDate && formData.bookTime) {
      const selectedDateTime = new Date(
        `${formData.bookDate}T${formData.bookTime}`,
      );
      if (selectedDateTime.getTime() < new Date().getTime())
        newErrors.bookTime = "Không thể chọn giờ trong quá khứ!";
    }
    if (!formData.guestCount) newErrors.guestCount = "Vui lòng chọn số người!";
    if (!formData.tableId) newErrors.tableId = "Vui lòng chọn bàn!";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
 
    try {
      setErrors({});
      setSubmitting(true);
      const payload = {
        customerName: formData.customerName,
        phone: formData.phone,
        email: formData.email,
        reservationTime: `${formData.bookDate}T${formData.bookTime}:00`,
        guestCount: parseInt(formData.guestCount) || 1,
        table: { tableId: parseInt(formData.tableId) },
        isPaid: false,
      };
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const newReservation = await response.json();
      const selectedTable = tables.find(
        (t) => t.tableId === parseInt(formData.tableId),
      );
      const enriched = {
        ...newReservation,
        table: selectedTable ?? newReservation.table,
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
 
  // ── AUTO-COMPLETE: tự động hoàn thành khi đến giờ hẹn ────────────────────
  const autoCompleteWithData = async (data) => {
    const now = new Date();
    const overdueActives = data.filter(
      (r) =>
        (r.status === "ACTIVE" || r.status === "PENDING") &&
        r.reservationTime &&
        new Date(r.reservationTime) <= now,
    );
    if (overdueActives.length === 0) return data;
 
    const results = await Promise.allSettled(
      overdueActives.map((r) =>
        fetch(`/api/reservations/${r.reservationId}/complete`, {
          method: "PUT",
        }).then((res) => (res.ok ? res.json() : null)),
      ),
    );
 
    const completed = results
      .filter((r) => r.status === "fulfilled" && r.value)
      .map((r) => r.value);
 
    if (completed.length === 0) return data;
 
    return data.map((r) => {
      const updated = completed.find((c) => c.reservationId === r.reservationId);
      return updated ? updated : r;
    });
  };
 
  // ── CONFIRM ACTION ─────────────────────────────────────────────────────────
  const openConfirmModal = (id, type) =>
    setConfirmModal({ open: true, id, type });
 
  const handleConfirmAction = async () => {
    const { id, type } = confirmModal;
    try {
      let url =
        type === "cancel"
          ? `/api/reservations/${id}/cancel`
          : `/api/reservations/${id}/restore`;
      const response = await fetch(url, { method: "PUT" });
      if (!response.ok) throw new Error("Request failed");
      const updated = await response.json();
      setReservations((prev) =>
        prev.map((item) => (item.reservationId === id ? updated : item)),
      );
    } catch (error) {
      console.error("Lỗi:", error);
    } finally {
      setConfirmModal({ open: false, id: null, type: null });
    }
  };
 
  if (showCalendar) {
    return (
      <CalendarView
        onBack={() => setShowCalendar(false)}
        reservations={reservations}
      />
    );
  }
 
  // ── STATS ──────────────────────────────────────────────────────────────────
  const now = new Date();
  const totalActive = reservations.filter(
    (r) =>
      (r.status === "ACTIVE" || r.status === "PENDING") &&
      new Date(r.reservationTime) > now,
  ).length;
  const totalCompleted = reservations.filter(
    (r) =>
      r.status === "COMPLETED" ||
      ((r.status === "ACTIVE" || r.status === "PENDING") &&
        new Date(r.reservationTime) <= now),
  ).length;
  const totalCancelled = reservations.filter(
    (r) => r.status === "CANCELLED",
  ).length;
 
  return (
    <div
      className="res-page"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #FDFAF4 0%, #F5EDDF 100%)",
        padding: "clamp(14px, 3vw, 28px) clamp(12px, 3vw, 24px)",
      }}
    >
      <style>{injectStyles()}</style>
 
      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <div className="res-fade-in" style={{ marginBottom: 28 }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 4,
              }}
            >
              <Sparkles size={13} style={{ color: "#C49A6C" }} />
              <span
                style={{
                  fontSize: 10.5,
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#B5A080",
                }}
              >
                CELESTÉ HOUSE
              </span>
            </div>
            <h1
              className="serif"
              style={{
                fontSize: "clamp(22px, 5vw, 30px)",
                fontWeight: 600,
                color: "#2C1C0E",
                margin: 0,
                lineHeight: 1.1,
              }}
            >
              Lịch Đặt Bàn
            </h1>
            <p style={{ fontSize: 12.5, color: "#9A8068", marginTop: 5 }}>
              Quản lý và theo dõi toàn bộ lịch đặt bàn của nhà hàng
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              className="res-btn-outline"
              onClick={() => setShowCalendar(true)}
            >
              <Calendar size={15} /> Xem lịch
            </button>
            <button
              className="res-btn-gold"
              onClick={handleOpenAddModal}
              style={{ animation: "pulseRing 2.5s infinite" }}
            >
              <Plus size={15} /> Thêm đặt bàn
            </button>
          </div>
        </div>
 
      </div>
 
      {/* ── FILTER BAR ─────────────────────────────────────────────────────── */}
      <div
        className="res-card res-fade-in"
        style={{
          padding: "18px 20px",
          marginBottom: 20,
          animationDelay: "0.05s",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: 10,
            alignItems: "center",
          }}
        >
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
      <div
        className="res-card res-fade-in"
        style={{ animationDelay: "0.1s", overflow: "hidden" }}
      >
        {/* Desktop table */}
        <div className="res-table-desktop" style={{ overflowX: "auto" }}>
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
                  <td
                    colSpan="6"
                    style={{
                      textAlign: "center",
                      padding: "48px 0",
                      color: "#B5A080",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          border: "2.5px solid rgba(196,154,108,0.3)",
                          borderTopColor: "#C49A6C",
                          animation: "spin 0.9s linear infinite",
                        }}
                      ></div>
                      <span style={{ fontSize: 13 }}>Đang tải dữ liệu...</span>
                    </div>
                  </td>
                </tr>
              ) : currentReservations.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    style={{
                      textAlign: "center",
                      padding: "60px 0",
                      color: "#B5A080",
                    }}
                  >
                    <UtensilsCrossed
                      size={32}
                      style={{ margin: "0 auto 12px", opacity: 0.3 }}
                    />
                    <p style={{ fontSize: 13.5, fontWeight: 500 }}>
                      Không tìm thấy lịch đặt bàn nào
                    </p>
                    <p style={{ fontSize: 12, marginTop: 4, opacity: 0.7 }}>
                      Thử thay đổi bộ lọc hoặc thêm mới
                    </p>
                  </td>
                </tr>
              ) : (
                currentReservations.map((item, idx) => (
                  <tr
                    key={item.reservationId}
                    className={`res-row-anim ${item.status === "CANCELLED" ? "row-cancelled" : item.status === "COMPLETED" ? "row-completed" : ""}`}
                    style={{ animationDelay: `${idx * 0.04}s` }}
                  >
                    <td>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 4,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            flexWrap: "wrap",
                          }}
                        >
                          <span
                            style={{
                              fontWeight: 600,
                              color: "#2C1C0E",
                              fontSize: 13.5,
                            }}
                          >
                            {item.customerName}
                          </span>
                          {item.status === "CANCELLED" && (
                            <span className="badge badge-cancelled">
                              Đã hủy
                            </span>
                          )}
                          {item.status === "ACTIVE" && (
                            <span className="badge badge-active">Đang chờ</span>
                          )}
                        </div>
                        <span style={{ fontSize: 11, color: "#B5A080" }}>
                          Đặt lúc {formatDateTime(item.createdAt)}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 3,
                        }}
                      >
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 5,
                            fontSize: 12.5,
                            color: "#4A3220",
                          }}
                        >
                          <Phone size={11} style={{ color: "#C49A6C" }} />
                          {item.phone}
                        </span>
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 5,
                            fontSize: 11.5,
                            color: "#9A8068",
                          }}
                        >
                          <Mail
                            size={10}
                            style={{ color: "#C49A6C", opacity: 0.6 }}
                          />
                          {item.email || "—"}
                        </span>
                      </div>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 5,
                          fontSize: 12.5,
                          color: "#4A3220",
                          fontWeight: 500,
                        }}
                      >
                        <Clock size={12} style={{ color: "#C49A6C" }} />
                        {formatDateTime(item.reservationTime)}
                      </span>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <span className="table-badge">
                        {item.table
                          ? `Bàn ${item.table.tableNumber}`
                          : "Chưa xếp"}
                      </span>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 5,
                          fontWeight: 600,
                          fontSize: 13,
                          color: "#5A3E20",
                        }}
                      >
                        <Users size={13} style={{ color: "#C49A6C" }} />
                        {item.guestCount}
                      </span>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {item.status === "CANCELLED" ? (
                        <button
                          className="action-btn-restore"
                          onClick={() =>
                            openConfirmModal(item.reservationId, "restore")
                          }
                        >
                          Khôi phục
                        </button>
                      ) : item.status === "COMPLETED" ? (
                        <span className="action-btn-done">Hoàn thành</span>
                      ) : new Date(item.reservationTime) <= new Date() ? (
                        <span className="action-btn-done">Hoàn thành</span>
                      ) : (
                        <button
                          className="action-btn-cancel"
                          onClick={() =>
                            openConfirmModal(item.reservationId, "cancel")
                          }
                        >
                          Hủy đặt
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
 
        {/* Mobile card list */}
        <div className="res-mobile-list">
          {loading ? (
            <div
              style={{
                textAlign: "center",
                padding: "48px 0",
                color: "#B5A080",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  border: "2.5px solid rgba(196,154,108,0.3)",
                  borderTopColor: "#C49A6C",
                  animation: "spin 0.9s linear infinite",
                }}
              ></div>
              <span style={{ fontSize: 13 }}>Đang tải dữ liệu...</span>
            </div>
          ) : currentReservations.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "48px 16px",
                color: "#B5A080",
              }}
            >
              <UtensilsCrossed
                size={28}
                style={{ margin: "0 auto 10px", opacity: 0.3 }}
              />
              <p style={{ fontSize: 13, fontWeight: 500 }}>
                Không tìm thấy lịch đặt bàn nào
              </p>
            </div>
          ) : (
            currentReservations.map((item, idx) => (
              <div
                key={item.reservationId}
                className="res-mobile-card"
                style={{
                  animationDelay: `${idx * 0.04}s`,
                  background:
                    item.status === "CANCELLED"
                      ? "rgba(220,60,60,0.02)"
                      : item.status === "COMPLETED"
                        ? "rgba(40,160,80,0.02)"
                        : "transparent",
                }}
              >
                <div className="res-mobile-card-top">
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 3 }}
                  >
                    <span className="res-mobile-card-name">
                      {item.customerName}
                    </span>
                    <span style={{ fontSize: 11, color: "#B5A080" }}>
                      Đặt lúc {formatDateTime(item.createdAt)}
                    </span>
                  </div>
                  <div style={{ flexShrink: 0 }}>
                    {item.status === "CANCELLED" && (
                      <span className="badge badge-cancelled">Đã hủy</span>
                    )}
                    {item.status === "ACTIVE" && (
                      <span className="badge badge-active">Đang chờ</span>
                    )}
                  </div>
                </div>
                <div className="res-mobile-card-meta">
                  <span
                    style={{ display: "flex", alignItems: "center", gap: 4 }}
                  >
                    <Clock size={11} style={{ color: "#C49A6C" }} />
                    {formatDateTime(item.reservationTime)}
                  </span>
                  <span style={{ color: "rgba(196,154,108,0.4)" }}>·</span>
                  <span
                    className="table-badge"
                    style={{ fontSize: 10.5, padding: "2px 8px" }}
                  >
                    {item.table ? `Bàn ${item.table.tableNumber}` : "Chưa xếp"}
                  </span>
                  <span style={{ color: "rgba(196,154,108,0.4)" }}>·</span>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 3,
                      fontWeight: 600,
                      color: "#5A3E20",
                    }}
                  >
                    <Users size={11} style={{ color: "#C49A6C" }} />
                    {item.guestCount} người
                  </span>
                </div>
                <div className="res-mobile-card-bottom">
                  <span
                    style={{
                      fontSize: 11.5,
                      color: "#7A6048",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <Phone size={10} style={{ color: "#C49A6C" }} />
                    {item.phone}
                  </span>
                  <div>
                    {item.status === "CANCELLED" ? (
                      <button
                        className="action-btn-restore"
                        onClick={() =>
                          openConfirmModal(item.reservationId, "restore")
                        }
                      >
                        Khôi phục
                      </button>
                    ) : item.status === "COMPLETED" ? null : new Date(
                        item.reservationTime,
                      ) <= new Date() ? (
                      <span className="action-btn-done">Hoàn thành</span>
                    ) : (
                      <button
                        className="action-btn-cancel"
                        onClick={() =>
                          openConfirmModal(item.reservationId, "cancel")
                        }
                      >
                        Hủy đặt
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
 
        {/* Pagination */}
        {totalPages > 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 16px",
              borderTop: "1px solid rgba(196,154,108,0.1)",
              background: "rgba(196,154,108,0.02)",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            <span style={{ fontSize: 12, color: "#9A8068" }}>
              Hiển thị{" "}
              <strong style={{ color: "#5A3E20" }}>
                {(currentPage - 1) * itemsPerPage + 1}
              </strong>{" "}
              –{" "}
              <strong style={{ color: "#5A3E20" }}>
                {Math.min(
                  currentPage * itemsPerPage,
                  filteredReservations.length,
                )}
              </strong>{" "}
              /{" "}
              <strong style={{ color: "#5A3E20" }}>
                {filteredReservations.length}
              </strong>{" "}
              lịch đặt
            </span>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <button
                className="res-page-btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              >
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    className={`res-page-btn ${currentPage === page ? "active" : ""}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ),
              )}
              <button
                className="res-page-btn"
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
              >
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
                <p
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "#B5A080",
                    marginBottom: 3,
                  }}
                >
                  CELESTÉ HOUSE
                </p>
                <h2
                  className="serif"
                  style={{
                    fontSize: 22,
                    fontWeight: 600,
                    color: "#2C1C0E",
                    margin: 0,
                  }}
                >
                  Thêm lịch đặt bàn
                </h2>
              </div>
              <button
                className="close-btn"
                onClick={() => {
                  setShowAddModal(false);
                  setFormData(initialForm);
                  setErrors({});
                }}
              >
                <X size={15} />
              </button>
            </div>
 
            <div className="res-modal-body">
              {/* Tên khách */}
              <div>
                <label className="res-label">
                  Tên khách hàng <span style={{ color: "#C49A6C" }}>*</span>
                </label>
                <input
                  className={`res-input ${errors.customerName ? "error" : ""}`}
                  type="text"
                  placeholder="Nguyễn Văn A"
                  value={formData.customerName}
                  onCompositionStart={() => {
                    isComposing.current = true;
                  }}
                  onCompositionEnd={(e) => {
                    isComposing.current = false;
                    const cleaned = e.target.value.replace(
                      /[^A-Za-zÀ-ỹ\s]/g,
                      "",
                    );
                    setFormData({ ...formData, customerName: cleaned });
                  }}
                  onChange={(e) => {
                    if (isComposing.current) {
                      setFormData({
                        ...formData,
                        customerName: e.target.value,
                      });
                      return;
                    }
                    const cleaned = e.target.value.replace(
                      /[^A-Za-zÀ-ỹ\s]/g,
                      "",
                    );
                    setFormData({ ...formData, customerName: cleaned });
                    setErrors((prev) => ({ ...prev, customerName: "" }));
                  }}
                  onPaste={(e) => {
                    e.preventDefault();
                    const paste = e.clipboardData.getData("text");
                    const cleaned = paste.replace(/[^A-Za-zÀ-ỹ\s]/g, "");
                    setFormData({ ...formData, customerName: cleaned });
                  }}
                  maxLength={50}
                />
                {errors.customerName && (
                  <p className="res-error">{errors.customerName}</p>
                )}
              </div>
 
              {/* Phone + Email */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                }}
              >
                <div>
                  <label className="res-label">
                    Số điện thoại <span style={{ color: "#C49A6C" }}>*</span>
                  </label>
                  <input
                    className={`res-input ${errors.phone ? "error" : ""}`}
                    type="tel"
                    placeholder="090..."
                    value={formData.phone}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, "");
                      if (value.length <= 15)
                        setFormData({ ...formData, phone: value });
                      setErrors((prev) => ({ ...prev, phone: "" }));
                    }}
                    onBlur={() => {
                      if (formData.phone && !/^\d{8,15}$/.test(formData.phone))
                        setErrors((prev) => ({
                          ...prev,
                          phone: "Số điện thoại phải từ 8 - 15 số!",
                        }));
                      else setErrors((prev) => ({ ...prev, phone: "" }));
                    }}
                    maxLength={15}
                  />
                  {errors.phone && <p className="res-error">{errors.phone}</p>}
                </div>
                <div>
                  <label className="res-label">
                    Email <span style={{ color: "#C49A6C" }}>*</span>
                  </label>
                  <input
                    className={`res-input ${errors.email ? "error" : ""}`}
                    type="email"
                    placeholder="example@gmail.com"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      setErrors((prev) => ({ ...prev, email: "" }));
                    }}
                    onBlur={() => {
                      if (
                        formData.email &&
                        !/^[A-Za-z0-9._%+-]+@gmail\.com$/.test(formData.email)
                      )
                        setErrors((prev) => ({
                          ...prev,
                          email: "Email phải đúng định dạng @gmail.com!",
                        }));
                    }}
                  />
                  {errors.email && <p className="res-error">{errors.email}</p>}
                </div>
              </div>
 
              <div className="divider-gold"></div>
 
              {/* Ngày + Giờ */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                }}
              >
                <div>
                  <label className="res-label">
                    Ngày đặt <span style={{ color: "#C49A6C" }}>*</span>
                  </label>
                  <input
                    className={`res-input ${errors.bookDate ? "error" : ""}`}
                    type="date"
                    min={
                      new Date(
                        Date.now() - new Date().getTimezoneOffset() * 60000,
                      )
                        .toISOString()
                        .split("T")[0]
                    }
                    value={formData.bookDate}
                    onChange={(e) => {
                      const selectedDate = e.target.value;
                      const today = new Date(
                        Date.now() - new Date().getTimezoneOffset() * 60000,
                      )
                        .toISOString()
                        .split("T")[0];
                      // reset giờ nếu ngày thay đổi để tránh chọn giờ quá khứ
                      let updatedTime = formData.bookTime;
                      if (selectedDate === today && formData.bookTime) {
                        const now = new Date();
                        const nowMins = now.getHours() * 60 + now.getMinutes();
                        const [h] = formData.bookTime.split(":").map(Number);
                        if (h * 60 <= nowMins) updatedTime = "";
                      }
                      setFormData({
                        ...formData,
                        bookDate: selectedDate,
                        bookTime: updatedTime,
                      });
                      setErrors((prev) => ({
                        ...prev,
                        bookDate: "",
                        bookTime: "",
                      }));
                    }}
                  />
                  {errors.bookDate && (
                    <p className="res-error">{errors.bookDate}</p>
                  )}
                </div>
                <div>
                  <label className="res-label">
                    Giờ đặt <span style={{ color: "#C49A6C" }}>*</span>
                  </label>
                  {(() => {
                    const today = new Date(
                      Date.now() - new Date().getTimezoneOffset() * 60000,
                    )
                      .toISOString()
                      .split("T")[0];
                    const now = new Date();
                    const nowMins = now.getHours() * 60 + now.getMinutes();
                    const slots = [
                      "09:00",
                      "10:00",
                      "11:00",
                      "12:00",
                      "13:00",
                      "14:00",
                      "15:00",
                      "16:00",
                      "17:00",
                      "18:00",
                      "19:00",
                      "20:00",
                      "21:00",
                    ];
                    const available = slots.filter((t) => {
                      if (!formData.bookDate || formData.bookDate !== today)
                        return true;
                      const [h, m] = t.split(":").map(Number);
                      return h * 60 + m > nowMins;
                    });
                    return (
                      <select
                        className={`res-input res-select ${errors.bookTime ? "error" : ""}`}
                        value={formData.bookTime}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            bookTime: e.target.value,
                          });
                          setErrors((prev) => ({ ...prev, bookTime: "" }));
                        }}
                      >
                        <option value="">-- Chọn giờ --</option>
                        {available.length === 0 ? (
                          <option disabled>Không còn khung giờ hôm nay</option>
                        ) : (
                          available.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))
                        )}
                      </select>
                    );
                  })()}
                  {errors.bookTime && (
                    <p className="res-error">{errors.bookTime}</p>
                  )}
                </div>
              </div>
 
              {/* Số người */}
              <div>
                <label className="res-label">
                  Số người <span style={{ color: "#C49A6C" }}>*</span>
                </label>
                <div
                  className={`guest-grid${errors.guestCount ? " error-border" : ""}`}
                >
                  {[
                    { value: "2", label: "2 người" },
                    { value: "4", label: "4 người" },
                    { value: "6", label: "6+ người" },
                  ].map((opt) => (
                    <div
                      key={opt.value}
                      className={`guest-card${formData.guestCount === opt.value ? " selected" : ""}${errors.guestCount ? " error-border" : ""}`}
                      onClick={() => {
                        setFormData({ ...formData, guestCount: opt.value });
                        setErrors((prev) => ({ ...prev, guestCount: "" }));
                      }}
                    >
                      <span className="guest-num">
                        {opt.value === "6" ? "6+" : opt.value}
                      </span>
                      <span className="guest-label">người</span>
                    </div>
                  ))}
                </div>
                {errors.guestCount && (
                  <p className="res-error" style={{ marginTop: 6 }}>
                    {errors.guestCount}
                  </p>
                )}
              </div>
 
              {/* Chọn bàn */}
              <div>
                <label className="res-label">
                  Chọn bàn <span style={{ color: "#C49A6C" }}>*</span>
                  {formData.guestCount && (
                    <span
                      style={{
                        fontWeight: 400,
                        textTransform: "none",
                        letterSpacing: 0,
                        color: "#B5A080",
                        marginLeft: 6,
                        fontSize: 10.5,
                      }}
                    >
                      — phù hợp {formData.guestCount}+ người
                    </span>
                  )}
                </label>
                {!formData.guestCount ? (
                  <div
                    style={{
                      padding: "18px 16px",
                      borderRadius: 12,
                      border: "1.5px dashed rgba(196,154,108,0.25)",
                      background: "rgba(196,154,108,0.03)",
                      textAlign: "center",
                      color: "#B5A090",
                      fontSize: 12.5,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 7,
                    }}
                  >
                    <span style={{ fontSize: 16 }}>👆</span> Vui lòng chọn số
                    người trước
                  </div>
                ) : tables.length === 0 ? (
                  <div
                    style={{
                      padding: "18px 16px",
                      borderRadius: 12,
                      border: "1.5px dashed rgba(220,80,60,0.25)",
                      background: "rgba(220,80,60,0.03)",
                      textAlign: "center",
                      color: "#C03030",
                      fontSize: 12.5,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 7,
                    }}
                  >
                    <span style={{ fontSize: 16 }}>😔</span> Không còn bàn phù
                    hợp cho {formData.guestCount} người
                  </div>
                ) : (
                  <>
                    <div className={`table-grid`}>
                      {tables.map((t) => (
                        <div
                          key={t.tableId}
                          className={`table-card${formData.tableId === String(t.tableId) ? " selected" : ""}${errors.tableId ? " error-border" : ""}`}
                          onClick={() => {
                            setFormData({
                              ...formData,
                              tableId: String(t.tableId),
                            });
                            setErrors((prev) => ({ ...prev, tableId: "" }));
                          }}
                        >
                          <span className="table-num-label">
                            Bàn {t.tableNumber}
                          </span>
                          <span className="table-cap-label">
                            {t.capacity} người
                          </span>
                        </div>
                      ))}
                    </div>
                    {errors.tableId && (
                      <p className="res-error" style={{ marginTop: 6 }}>
                        {errors.tableId}
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
 
            <div className="res-modal-footer">
              <button
                className="res-btn-outline"
                onClick={() => {
                  setShowAddModal(false);
                  setFormData(initialForm);
                  setErrors({});
                }}
              >
                Hủy bỏ
              </button>
              <button
                className="res-btn-gold"
                onClick={handleSubmitReservation}
                disabled={submitting}
                style={{ opacity: submitting ? 0.6 : 1 }}
              >
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
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background:
                  confirmModal.type === "cancel"
                    ? "rgba(220,60,60,0.08)"
                    : "rgba(40,160,80,0.08)",
                border: `1px solid ${confirmModal.type === "cancel" ? "rgba(220,60,60,0.2)" : "rgba(40,160,80,0.2)"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
                fontSize: 22,
              }}
            >
              {confirmModal.type === "cancel" ? "🚫" : "♻️"}
            </div>
            <h3
              className="serif"
              style={{
                fontSize: 20,
                fontWeight: 600,
                color: "#2C1C0E",
                marginBottom: 8,
              }}
            >
              Xác nhận thao tác
            </h3>
            <p
              style={{
                fontSize: 13,
                color: "#7A6048",
                marginBottom: 24,
                lineHeight: 1.6,
              }}
            >
              {confirmModal.type === "cancel"
                ? "Bạn có chắc muốn hủy lịch đặt bàn này không?"
                : "Bạn có chắc muốn khôi phục lịch đặt bàn này không?"}
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              <button
                className="res-btn-outline"
                onClick={() =>
                  setConfirmModal({ open: false, id: null, type: null })
                }
              >
                Quay lại
              </button>
              <button
                onClick={handleConfirmAction}
                style={{
                  padding: "10px 22px",
                  borderRadius: 12,
                  border: "none",
                  background:
                    confirmModal.type === "cancel"
                      ? "linear-gradient(135deg, #DC3C3C, #B02020)"
                      : "linear-gradient(135deg, #28A050, #1A7A38)",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: 12.5,
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  boxShadow:
                    confirmModal.type === "cancel"
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