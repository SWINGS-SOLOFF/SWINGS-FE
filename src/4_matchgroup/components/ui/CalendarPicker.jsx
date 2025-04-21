import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

export default function CalendarPicker({ selectedDate, onConfirm }) {
    const [tempDate, setTempDate] = useState(selectedDate || new Date());

    return (
        <div className="calendar-wrapper bg-white rounded-xl px-4 py-5 shadow-md w-full max-w-[260px] mx-auto text-center">
            {/* ✅ 달력 크기 & 스타일 조절용 style */}
            <style>
                {`
          .calendar-wrapper .rdp {
            --rdp-cell-size: 1.95rem; /* 셀 사이즈 살짝 줄이기 */
            font-size: 13px;
            width: 100%;
            max-width: 100%;
            padding: 0;
          }

          .calendar-wrapper .rdp-months {
            justify-content: center;
          }

          .calendar-wrapper .rdp-caption {
            padding: 0.25rem 0;
          }

          .calendar-wrapper .rdp-head_cell,
          .calendar-wrapper .rdp-cell {
            padding: 0.2rem !important;
          }

          /* ✅ 선택된 날짜 */
          .calendar-wrapper .rdp-day_selected {
            background-color: #fbbf24 !important; /* yellow-400 */
            color: white !important;
            border-radius: 9999px !important;
          }

          /* ✅ 오늘 날짜 */
          .calendar-wrapper .rdp-day_today:not(.rdp-day_selected) {
            border: 1px solid #fbbf24 !important;
            color: #fbbf24 !important;
            font-weight: bold !important;
            border-radius: 9999px !important;
          }
        `}
            </style>

            <DayPicker
                mode="single"
                selected={tempDate}
                onSelect={setTempDate}
                defaultMonth={tempDate}
                showOutsideDays
            />

            <button
                onClick={() => onConfirm(tempDate)}
                className="mt-4 w-full py-2 bg-yellow-400 text-white font-semibold rounded-lg hover:bg-yellow-500"
            >
                Confirm
            </button>
        </div>
    );
}
