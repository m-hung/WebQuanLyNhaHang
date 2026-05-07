import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CalendarView({ onBack, reservations = [] }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  // 1. State để quản lý chế độ xem: 'month', 'week', 'day'
  const [viewMode, setViewMode] = useState('month');

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // 2. Logic chuyển tới/lui dựa theo chế độ xem
  const handlePrev = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    } else if (viewMode === 'week') {
      setCurrentDate(new Date(currentYear, currentMonth, currentDate.getDate() - 7));
    } else {
      setCurrentDate(new Date(currentYear, currentMonth, currentDate.getDate() - 1));
    }
  };

  const handleNext = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
    } else if (viewMode === 'week') {
      setCurrentDate(new Date(currentYear, currentMonth, currentDate.getDate() + 7));
    } else {
      setCurrentDate(new Date(currentYear, currentMonth, currentDate.getDate() + 1));
    }
  };

  // 3. Hiển thị tiêu đề
  let headerTitle ;
  if (viewMode === 'month') {
    headerTitle = currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  } else if (viewMode === 'week') {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    headerTitle = `${startOfWeek.getDate()}/${startOfWeek.getMonth() + 1} - ${endOfWeek.getDate()}/${endOfWeek.getMonth() + 1}, ${currentYear}`;
  } else {
    const dayName = currentDate.toLocaleString('en-US', { weekday: 'long' });
    headerTitle = `${dayName}, ${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
  }

  // Hàm xử lý dữ liệu
  const formatTime = (timeString) => {
    if (!timeString) return "";
    const date = new Date(timeString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // Hàm lấy sự kiện theo ngày chính xác
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
          const table = res.table ? `Bàn ${res.table.tableId}` : 'Chưa xếp';
          return `${time} ${table}`;
        });
  };

  const renderMonthDays = () => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();
    const days = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ day: daysInPrevMonth - firstDayOfMonth + i + 1, isCurrentMonth: false, date: new Date(currentYear, currentMonth - 1, daysInPrevMonth - firstDayOfMonth + i + 1) });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, isCurrentMonth: true, date: new Date(currentYear, currentMonth, i) });
    }
    const totalCellsNeeded = Math.ceil((firstDayOfMonth + daysInMonth) / 7) * 7;
    const remainingCells = totalCellsNeeded - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      days.push({ day: i, isCurrentMonth: false, date: new Date(currentYear, currentMonth + 1, i) });
    }

    return (
        <div className="flex-1 grid grid-cols-7 text-sm">
          {days.map((item, index) => {
            const dayEvents = getEventsForSpecificDate(item.date);
            return (
                <div key={index} className={`border-r border-b border-gray-200 p-1 flex flex-col transition-colors hover:bg-gray-50 min-h-30 ${item.isCurrentMonth ? 'text-gray-600 font-medium' : 'text-gray-400'}`}>
                  <span className="text-right p-1">{item.day}</span>
                  <div className="flex flex-col gap-1 mt-1 overflow-y-auto">
                    {dayEvents.map((evt, idx) => (
                        <div key={idx} className="bg-blue-600 shadow-sm text-white text-xs px-2 py-1 rounded truncate cursor-pointer hover:bg-blue-700">{evt}</div>
                    ))}
                  </div>
                </div>
            );
          })}
        </div>
    );
  };

  const renderWeekDays = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    const days = [];

    for(let i=0; i<7; i++) {
      const dayDate = new Date(startOfWeek);
      dayDate.setDate(startOfWeek.getDate() + i);
      days.push(dayDate);
    }

    return (
        <div className="flex-1 grid grid-cols-7 text-sm">
          {days.map((dateObj, index) => {
            const dayEvents = getEventsForSpecificDate(dateObj);
            return (
                <div key={index} className="border-r border-b border-gray-200 p-2 flex flex-col transition-colors hover:bg-gray-50 text-gray-600 font-medium min-h-75">
                  <span className="text-center p-2 border-b bg-gray-50 mb-2">{dateObj.getDate()}/{dateObj.getMonth() + 1}</span>
                  <div className="flex flex-col gap-1 overflow-y-auto">
                    {dayEvents.map((evt, idx) => (
                        <div key={idx} className="bg-blue-600 shadow-sm text-white text-sm px-2 py-1.5 rounded truncate cursor-pointer hover:bg-blue-700">{evt}</div>
                    ))}
                  </div>
                </div>
            );
          })}
        </div>
    );
  };

  const renderDayView = () => {
    const dayEvents = getEventsForSpecificDate(currentDate);
    return (
        <div className="flex-1 flex flex-col p-4">
          <div className="text-lg font-bold text-gray-700 mb-4 border-b pb-2">
            Lịch trình ngày: {currentDate.getDate()}/{currentDate.getMonth() + 1}/{currentDate.getFullYear()}
          </div>
          {dayEvents.length === 0 ? (
              <div className="text-center text-gray-400 py-10">Không có lịch đặt bàn nào trong ngày hôm nay.</div>
          ) : (
              <div className="flex flex-col gap-2">
                {dayEvents.map((evt, idx) => (
                    <div key={idx} className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded shadow-sm text-blue-800 font-medium flex justify-between items-center cursor-pointer hover:bg-blue-100 transition-colors">
                      <span>{evt}</span>
                    </div>
                ))}
              </div>
          )}
        </div>
    );
  };

  return (
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-md w-full min-h-150 flex flex-col">
        <div className="mb-6 p-4 bg-linear-to-r from-blue-50/50 to-transparent rounded-lg shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-gray-200">
          <h2 className="text-xl font-bold text-blue-800">Liệt kê lịch đặt bàn</h2>
        </div>

        {/* Thanh điều hướng */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="flex border rounded">
              <button onClick={handlePrev} className="px-3 py-1 border-r hover:bg-gray-100 transition-colors cursor-pointer"><ChevronLeft size={18} /></button>
              <button onClick={handleNext} className="px-3 py-1 hover:bg-gray-100 transition-colors cursor-pointer"><ChevronRight size={18} /></button>
            </div>
            <button
                onClick={() => setCurrentDate(new Date())}
                className="px-4 py-1 bg-gray-100 border rounded hover:bg-gray-200 cursor-pointer"
            >
              today
            </button>
          </div>

          <h3 className="text-2xl text-gray-600 font-light">{headerTitle}</h3>

          <div className="flex border rounded bg-gray-100">
            <button
                onClick={() => setViewMode('month')}
                className={`px-4 py-1 border-r cursor-pointer transition-colors ${viewMode === 'month' ? 'bg-gray-300 shadow-inner' : 'hover:bg-gray-200'}`}
            >month</button>
            <button
                onClick={() => setViewMode('week')}
                className={`px-4 py-1 border-r cursor-pointer transition-colors ${viewMode === 'week' ? 'bg-gray-300 shadow-inner' : 'hover:bg-gray-200'}`}
            >week</button>
            <button
                onClick={() => setViewMode('day')}
                className={`px-4 py-1 cursor-pointer transition-colors ${viewMode === 'day' ? 'bg-gray-300 shadow-inner' : 'hover:bg-gray-200'}`}
            >day</button>
          </div>
        </div>

        {/* Khung lịch hiển thị động dựa theo viewMode */}
        <div className="flex-1 border-l border-t border-gray-200 flex flex-col bg-white">
          {/* Tên các thứ (Chỉ hiện khi ở chế độ Tháng hoặc Tuần) */}
          {(viewMode === 'month' || viewMode === 'week') && (
              <div className="grid grid-cols-7 text-center font-medium text-gray-500 bg-gray-50/50">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="py-3 border-r border-b border-gray-200">{day}</div>
                ))}
              </div>
          )}

          {/* Lưới Lịch */}
          {viewMode === 'month' && renderMonthDays()}
          {viewMode === 'week' && renderWeekDays()}
          {viewMode === 'day' && renderDayView()}
        </div>

        {/* Nút trở lại */}
        <div className="flex justify-end mt-6">
          <button
              onClick={onBack}
              className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded transition-colors shadow-sm cursor-pointer"
          >
            Trở lại
          </button>
        </div>
      </div>
  );
}