import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { fetch } from "../services/api";
 
export default function CalendarView({ onBack, reservations = [] }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("month");
 
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
 
  // ── NAVIGATION ──
  const handlePrev = () => {
    if (viewMode === "month") setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    else if (viewMode === "week") setCurrentDate(new Date(currentYear, currentMonth, currentDate.getDate() - 7));
    else setCurrentDate(new Date(currentYear, currentMonth, currentDate.getDate() - 1));
  };
 
  const handleNext = () => {
    if (viewMode === "month") setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
    else if (viewMode === "week") setCurrentDate(new Date(currentYear, currentMonth, currentDate.getDate() + 7));
    else setCurrentDate(new Date(currentYear, currentMonth, currentDate.getDate() + 1));
  };
 
  // ── HEADER TITLE ──
  let headerTitle;
  if (viewMode === "month") {
    headerTitle = currentDate.toLocaleString("vi-VN", { month: "long", year: "numeric" });
  } else if (viewMode === "week") {
    const s = new Date(currentDate);
    s.setDate(currentDate.getDate() - currentDate.getDay());
    const e = new Date(s);
    e.setDate(s.getDate() + 6);
    headerTitle = `${s.getDate()}/${s.getMonth() + 1} – ${e.getDate()}/${e.getMonth() + 1}, ${currentYear}`;
  } else {
    const dayName = currentDate.toLocaleString("vi-VN", { weekday: "long" });
    headerTitle = `${dayName}, ${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
  }
 
  // ── UTILS ──
  const formatTime = (timeString) => {
    if (!timeString) return "";
    const date = new Date(timeString);
    return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
  };
 
  const getEventsForSpecificDate = (targetDate) => {
    return reservations
      .filter((res) => {
        if (!res.reservationTime) return false;
        const resDate = new Date(res.reservationTime);
        return (
          resDate.getFullYear() === targetDate.getFullYear() &&
          resDate.getMonth() === targetDate.getMonth() &&
          resDate.getDate() === targetDate.getDate()
        );
      })
      .map((res) => {
        const time = formatTime(res.reservationTime);
        const table = res.table ? `Bàn ${res.table.tableId}` : "Chưa xếp";
        return { label: `${time} · ${table}`, raw: res };
      });
  };
 
  const today = new Date();
  const isToday = (d) =>
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate();
 
  // ── RENDER MONTH ──
  const renderMonthDays = () => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrev = new Date(currentYear, currentMonth, 0).getDate();
    const days = [];
 
    for (let i = 0; i < firstDay; i++)
      days.push({ day: daysInPrev - firstDay + i + 1, current: false, date: new Date(currentYear, currentMonth - 1, daysInPrev - firstDay + i + 1) });
    for (let i = 1; i <= daysInMonth; i++)
      days.push({ day: i, current: true, date: new Date(currentYear, currentMonth, i) });
    const total = Math.ceil((firstDay + daysInMonth) / 7) * 7;
    for (let i = 1; i <= total - days.length; i++)
      days.push({ day: i, current: false, date: new Date(currentYear, currentMonth + 1, i) });
 
    return (
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
        {days.map((item, index) => {
          const events = getEventsForSpecificDate(item.date);
          const todayCell = isToday(item.date);
          return (
            <div key={index} className="clv-month-cell" style={{
              borderRight: "1px solid #EDE7DD",
              borderBottom: "1px solid #EDE7DD",
              padding: "6px",
              display: "flex",
              flexDirection: "column",
              minHeight: 100,
              background: todayCell ? "#FDF6EE" : "transparent",
              transition: "background .15s",
              cursor: "default",
            }}
              onMouseEnter={e => { if (!todayCell) e.currentTarget.style.background = "#FAF6F1"; }}
              onMouseLeave={e => { if (!todayCell) e.currentTarget.style.background = "transparent"; }}
            >
              <span style={{
                fontSize: 12,
                fontWeight: todayCell ? 800 : 500,
                color: todayCell ? "#A07842" : item.current ? "#2A1F15" : "#C0B4A4",
                textAlign: "right",
                display: "block",
                padding: "2px 4px",
                ...(todayCell ? {
                  background: "#C49A6C",
                  color: "white",
                  borderRadius: "50%",
                  width: 24, height: 24,
                  lineHeight: "24px",
                  textAlign: "center",
                  marginLeft: "auto",
                  padding: 0,
                } : {}),
              }}>{item.day}</span>
              <div style={{ display: "flex", flexDirection: "column", gap: 3, marginTop: 4, overflow: "hidden" }}>
                {events.slice(0, 3).map((evt, idx) => (
                  <div key={idx} className="clv-event-pill" style={{
                    background: "linear-gradient(90deg,#C49A6C,#A07842)",
                    color: "white",
                    fontSize: 10,
                    fontWeight: 600,
                    padding: "2px 7px",
                    borderRadius: 6,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    cursor: "pointer",
                    letterSpacing: "0.02em",
                  }}>{evt.label}</div>
                ))}
                {events.length > 3 && (
                  <div style={{ fontSize: 10, color: "#A39688", paddingLeft: 4 }}>+{events.length - 3} thêm</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };
 
  // ── RENDER WEEK ──
  const renderWeekDays = () => {
    const s = new Date(currentDate);
    s.setDate(currentDate.getDate() - currentDate.getDay());
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(s);
      d.setDate(s.getDate() + i);
      return d;
    });
 
    return (
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
        {days.map((dateObj, index) => {
          const events = getEventsForSpecificDate(dateObj);
          const todayCell = isToday(dateObj);
          return (
            <div key={index} className="clv-week-cell" style={{
              borderRight: "1px solid #EDE7DD",
              borderBottom: "1px solid #EDE7DD",
              display: "flex",
              flexDirection: "column",
              minHeight: 220,
              background: todayCell ? "#FDF6EE" : "transparent",
            }}>
              <div style={{
                textAlign: "center",
                padding: "10px 6px 8px",
                borderBottom: "1px solid #EDE7DD",
                background: todayCell ? "#FDF6EE" : "#FAF8F5",
                fontSize: 12,
                fontWeight: 700,
                color: todayCell ? "#A07842" : "#7A6A5A",
                letterSpacing: "0.04em",
              }}>
                {dateObj.getDate()}/{dateObj.getMonth() + 1}
              </div>
              <div style={{ padding: "8px 6px", display: "flex", flexDirection: "column", gap: 5, flex: 1, overflowY: "auto" }}>
                {events.map((evt, idx) => (
                  <div key={idx} className="clv-week-event" style={{
                    background: "linear-gradient(90deg,#C49A6C,#A07842)",
                    color: "white",
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "5px 9px",
                    borderRadius: 8,
                    cursor: "pointer",
                    letterSpacing: "0.02em",
                    boxShadow: "0 2px 6px -2px rgba(160,120,66,0.35)",
                  }}>{evt.label}</div>
                ))}
                {events.length === 0 && (
                  <div style={{ fontSize: 11, color: "#C0B4A4", textAlign: "center", marginTop: 12 }}>—</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };
 
  // ── RENDER DAY ──
  const renderDayView = () => {
    const events = getEventsForSpecificDate(currentDate);
    return (
      <div style={{ flex: 1, padding: "28px 32px" }} className="clv-day-view">
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#C49A6C", marginBottom: 18 }}>
          ✦ Lịch trình trong ngày
        </p>
        {events.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "48px 24px",
            border: "1.5px dashed #DDD5C8", borderRadius: 16,
            color: "#A39688", fontSize: 14,
          }}>
            Không có lịch đặt bàn nào trong ngày hôm nay.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {events.map((evt, idx) => (
              <div key={idx} style={{
                display: "flex", alignItems: "center", gap: 16,
                background: "white",
                border: "1px solid #EDE7DD",
                borderLeft: "4px solid #C49A6C",
                borderRadius: "0 12px 12px 0",
                padding: "14px 20px",
                cursor: "pointer",
                boxShadow: "0 2px 12px -4px rgba(80,55,30,0.08)",
                transition: "box-shadow .2s, transform .2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 6px 20px -4px rgba(196,154,108,0.25)"; e.currentTarget.style.transform = "translateX(3px)"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 2px 12px -4px rgba(80,55,30,0.08)"; e.currentTarget.style.transform = "translateX(0)"; }}
              >
                <div style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: "linear-gradient(135deg,#C49A6C,#A07842)",
                  flexShrink: 0,
                }}></div>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#2A1F15" }}>{evt.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };
 
  const DAY_LABELS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  const VIEW_LABELS = { month: "Tháng", week: "Tuần", day: "Ngày" };
 
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=DM+Sans:wght@300;400;500;600&display=swap');
        .clv-root { font-family: 'DM Sans', sans-serif; background: #FAF8F5; min-height: 100vh; color: #2A1F15; }
        .clv-serif { font-family: 'Playfair Display', serif; }
 
        @keyframes clvUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .clv-a1 { animation: clvUp .5s cubic-bezier(.16,1,.3,1) both; }
        .clv-a2 { animation: clvUp .5s .07s cubic-bezier(.16,1,.3,1) both; }
        .clv-a3 { animation: clvUp .5s .14s cubic-bezier(.16,1,.3,1) both; }
 
        .clv-card {
          background: white;
          border: 1px solid #EDE7DD;
          border-radius: 20px;
          box-shadow: 0 4px 24px -8px rgba(80,55,30,0.07);
        }
 
        .clv-nav-btn {
          width: 34px; height: 34px;
          border: 1.5px solid #DDD5C8;
          background: white;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          color: #7A6A5A;
          transition: all .2s;
        }
        .clv-nav-btn:hover { border-color: #C49A6C; color: #A07842; background: #FDF6EE; }
 
        .clv-today-btn {
          border: 1.5px solid #DDD5C8;
          background: white;
          border-radius: 10px;
          padding: 0 14px;
          height: 34px;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #7A6A5A;
          cursor: pointer;
          transition: all .2s;
        }
        .clv-today-btn:hover { border-color: #C49A6C; color: #A07842; background: #FDF6EE; }
 
        .clv-view-btn {
          padding: 6px 16px;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.06em;
          border: none;
          background: transparent;
          color: #7A6A5A;
          cursor: pointer;
          transition: all .2s;
          border-radius: 8px;
        }
        .clv-view-btn:hover { color: #A07842; background: #FDF6EE; }
        .clv-view-btn.active {
          background: linear-gradient(135deg,#C49A6C,#A07842);
          color: white;
          box-shadow: 0 3px 10px -3px rgba(160,120,66,0.45);
        }
 
        .clv-back-btn {
          border: 1.5px solid #DDD5C8;
          background: white;
          border-radius: 12px;
          padding: 9px 22px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: #7A6A5A;
          cursor: pointer;
          transition: all .2s;
        }
        .clv-back-btn:hover { border-color: #C49A6C; color: #A07842; background: #FDF6EE; }

        /* ── RESPONSIVE ── */
        @media (max-width: 640px) {
          .clv-root { padding: 16px 12px !important; }
          .clv-toolbar { flex-direction: column; align-items: flex-start !important; gap: 10px !important; }
          .clv-toolbar-title { font-size: 13px !important; }
          .clv-month-cell { min-height: 56px !important; padding: 3px 2px !important; }
          .clv-event-pill { font-size: 8px !important; padding: 1px 3px !important; border-radius: 4px !important; letter-spacing: 0 !important; }
          .clv-day-label { font-size: 9px !important; padding: 7px 2px !important; letter-spacing: 0 !important; }
          .clv-week-cell { min-height: 100px !important; }
          .clv-week-event { font-size: 8px !important; padding: 3px 4px !important; }
          .clv-footer { flex-direction: column; gap: 10px; align-items: flex-start !important; }
          .clv-today-btn { font-size: 11px !important; padding: 0 10px !important; }
          .clv-view-btn { padding: 5px 10px !important; font-size: 11px !important; }
          .clv-day-view { padding: 16px 12px !important; }
        }
      `}</style>
 
      <div className="clv-root" style={{ padding: "28px 32px", boxSizing: "border-box" }}>
 
        {/* ── HEADER ── */}
        <div className="clv-a1" style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#C49A6C", marginBottom: 6 }}>
            ✦ Quản lý đặt bàn
          </p>
          <h1 className="clv-serif" style={{ fontSize: 30, fontWeight: 500, color: "#1A130E", margin: 0, lineHeight: 1.2 }}>
            Lịch đặt bàn
          </h1>
        </div>
 
        {/* ── TOOLBAR ── */}
        <div className="clv-a2 clv-toolbar" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
 
          {/* Điều hướng trái */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button className="clv-nav-btn" onClick={handlePrev}><ChevronLeft size={16} /></button>
            <button className="clv-nav-btn" onClick={handleNext}><ChevronRight size={16} /></button>
            <button className="clv-today-btn" onClick={() => setCurrentDate(new Date())}>Hôm nay</button>
          </div>
 
          {/* Tiêu đề tháng/tuần/ngày */}
          <h2 className="clv-toolbar-title" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 18, fontWeight: 500, color: "#2A1F15", margin: 0, letterSpacing: "0.01em" }}>
            {headerTitle}
          </h2>
 
          {/* Nút chọn chế độ */}
          <div style={{
            display: "flex", gap: 4, padding: "4px",
            background: "#F5EFE7", borderRadius: 12,
            border: "1px solid #EDE7DD",
          }}>
            {["month", "week", "day"].map((mode) => (
              <button
                key={mode}
                className={`clv-view-btn ${viewMode === mode ? "active" : ""}`}
                onClick={() => setViewMode(mode)}
              >
                {VIEW_LABELS[mode]}
              </button>
            ))}
          </div>
        </div>
 
        {/* ── CALENDAR BODY ── */}
        <div className="clv-card clv-a3" style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>
 
          {/* Day-of-week header */}
          {(viewMode === "month" || viewMode === "week") && (
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(7,1fr)",
              borderBottom: "1px solid #EDE7DD",
              background: "#FAF8F5",
            }}>
              {DAY_LABELS.map((d, i) => (
                <div key={d} className="clv-day-label" style={{
                  padding: "12px 6px",
                  textAlign: "center",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: i === 0 || i === 6 ? "#C49A6C" : "#A39688",
                  borderRight: i < 6 ? "1px solid #EDE7DD" : "none",
                }}>
                  {d}
                </div>
              ))}
            </div>
          )}
 
          {/* Grid content */}
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            {viewMode === "month" && renderMonthDays()}
            {viewMode === "week" && renderWeekDays()}
            {viewMode === "day" && renderDayView()}
          </div>
        </div>
 
        {/* ── FOOTER ── */}
        <div className="clv-footer" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 12, color: "#A39688" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, background: "linear-gradient(135deg,#C49A6C,#A07842)" }}></div>
              <span>Lịch đặt bàn</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#C49A6C" }}></div>
              <span>Hôm nay</span>
            </div>
          </div>
          <button className="clv-back-btn" onClick={onBack}>← Trở lại</button>
        </div>
      </div>
    </>
  );
}