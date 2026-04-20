import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CalendarView({ onBack }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const events = [];

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const monthYearTitle = currentDate.toLocaleString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });

  const generateCalendarDays = () => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    const days = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ day: daysInPrevMonth - firstDayOfMonth + i + 1, isCurrentMonth: false });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, isCurrentMonth: true });
    }

    const totalCellsNeeded = Math.ceil((firstDayOfMonth + daysInMonth) / 7) * 7;
    const remainingCells = totalCellsNeeded - days.length;
    
    for (let i = 1; i <= remainingCells; i++) {
      days.push({ day: i, isCurrentMonth: false });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  const getEventsForDay = (day, isCurrentMonth) => {
    if (!isCurrentMonth) return []; 
    const eventObj = events.find(e => e.day === day);
    return eventObj ? eventObj.items : [];
  };

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-md w-full min-h-[600px] flex flex-col">
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50/50 to-transparent rounded-lg shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-gray-200">
        <h2 className="text-xl font-bold text-blue-800">
          Liệt kê lịch đặt bàn
        </h2>
      </div>

      {/* Thanh điều hướng */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div className="flex border rounded">
          <button onClick={handlePrevMonth} className="px-3 py-1 border-r hover:bg-gray-100 transition-colors"><ChevronLeft size={18} /></button>
          <button onClick={handleNextMonth} className="px-3 py-1 hover:bg-gray-100 transition-colors"><ChevronRight size={18} /></button>
        </div>
          <button 
            onClick={() => setCurrentDate(new Date())} 
            className="px-4 py-1 bg-gray-100 border rounded hover:bg-gray-200"
          >
            today
          </button>
        </div>
        
        <h3 className="text-2xl text-gray-600 font-light">{monthYearTitle}</h3>

        <div className="flex border rounded bg-gray-100">
          <button className="px-4 py-1 bg-gray-300 shadow-inner border-r">month</button>
          <button className="px-4 py-1 border-r hover:bg-gray-200">week</button>
          <button className="px-4 py-1 hover:bg-gray-200">day</button>
        </div>
      </div>

      {/* Khung lịch */}
      <div className="flex-1 border-l border-t border-gray-200 flex flex-col">

        <div className="grid grid-cols-7 text-center font-medium text-gray-500 bg-gray-50/50">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="py-3 border-r border-b border-gray-200">
              {day}
            </div>
          ))}
        </div>

        <div className="flex-1 grid grid-cols-7 text-sm">
          {calendarDays.map((item, index) => {
            const dayEvents = getEventsForDay(item.day, item.isCurrentMonth);
            
            return (
              <div 
                key={index} 
                className={`border-r border-b border-gray-200 p-1 flex flex-col transition-colors hover:bg-gray-50 min-h-[120px] 
                  ${item.isCurrentMonth ? 'text-gray-600 font-medium' : 'text-gray-400'}
                `}
              >
                <span className="text-right p-1">{item.day}</span>
                <div className="flex flex-col gap-1 mt-1 overflow-y-auto">
                  {dayEvents.map((evt, idx) => (
                    <div key={idx} className="bg-blue-600 shadow-sm text-white text-xs px-2 py-1 rounded truncate">
                      {evt}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Nút trở lại */}
      <div className="flex justify-end mt-6">
        <button 
          onClick={onBack}
          className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded transition-colors shadow-sm"
        >
          Trở lại
        </button>
      </div>
    </div>
  );
}