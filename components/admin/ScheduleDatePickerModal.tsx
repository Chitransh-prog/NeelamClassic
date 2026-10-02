"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Edit3, Calendar } from "lucide-react";

interface ScheduleDatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

export default function ScheduleDatePickerModal({
  isOpen,
  onClose,
  selectedDate,
  onSelectDate,
}: ScheduleDatePickerModalProps) {
  const [viewYear, setViewYear] = useState<number>(selectedDate.getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(selectedDate.getMonth());
  const [tempDate, setTempDate] = useState<Date>(new Date(selectedDate));
  const [manualInputMode, setManualInputMode] = useState<boolean>(false);
  const [manualDateString, setManualDateString] = useState<string>("");

  useEffect(() => {
    setViewYear(selectedDate.getFullYear());
    setViewMonth(selectedDate.getMonth());
    setTempDate(new Date(selectedDate));
    setManualDateString(selectedDate.toISOString().split("T")[0]);
  }, [selectedDate, isOpen]);

  if (!isOpen) return null;

  const formattedHeader = tempDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((prev) => prev - 1);
    } else {
      setViewMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((prev) => prev + 1);
    } else {
      setViewMonth((prev) => prev + 1);
    }
  };

  const handleDayClick = (day: number) => {
    const newDate = new Date(viewYear, viewMonth, day);
    setTempDate(newDate);
    setManualDateString(newDate.toISOString().split("T")[0]);
  };

  const handleConfirm = () => {
    onSelectDate(tempDate);
    onClose();
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = new Date(manualDateString);
    if (!isNaN(parsed.getTime())) {
      setTempDate(parsed);
      setViewYear(parsed.getFullYear());
      setViewMonth(parsed.getMonth());
      setManualInputMode(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Luxury Light Theme Calendar Card */}
      <div className="relative z-10 w-full max-w-[340px] sm:max-w-[360px] bg-white border border-[#C9A66B]/40 rounded-3xl p-5 sm:p-6 shadow-2xl text-[#2B1B24] select-none overflow-hidden">
        {/* Decorative subtle ambient backdrop rings */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#B76E79]/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#C9A66B]/10 rounded-full blur-2xl pointer-events-none" />

        {/* 1. Header Section in Brand Plum */}
        <div className="bg-gradient-to-r from-[#4A1330] to-[#2F001B] text-[#FFF9F5] rounded-2xl p-4 mb-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C9A66B]">
              Appointment Date
            </span>
            <button
              onClick={() => setManualInputMode((prev) => !prev)}
              className="p-1 rounded-lg text-[#F8E8EC]/80 hover:text-white hover:bg-white/10 transition"
              title="Manual date edit"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#FFF9F5] mt-1">
            {formattedHeader}
          </h3>
        </div>

        {/* Manual Date Input Mode */}
        {manualInputMode ? (
          <form onSubmit={handleManualSubmit} className="py-4 space-y-3">
            <div>
              <label className="block text-xs font-semibold text-[#7A6470] mb-1">
                Enter Date (YYYY-MM-DD)
              </label>
              <input
                type="date"
                value={manualDateString}
                onChange={(e) => setManualDateString(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#FFF9F5] border border-[#F8E8EC] text-[#2B1B24] focus:border-[#B76E79] outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 rounded-xl bg-[#4A1330] text-[#FFF9F5] font-semibold text-xs hover:opacity-90 transition"
            >
              Update Calendar
            </button>
          </form>
        ) : (
          <>
            {/* 2. Month & Year Controls */}
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-sm font-bold text-[#4A1330]">
                {MONTH_NAMES[viewMonth]} {viewYear}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="p-1.5 rounded-lg text-[#7A6470] hover:text-[#4A1330] hover:bg-[#F8E8EC] transition"
                  aria-label="Previous month"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="p-1.5 rounded-lg text-[#7A6470] hover:text-[#4A1330] hover:bg-[#F8E8EC] transition"
                  aria-label="Next month"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 3. Days of Week */}
            <div className="grid grid-cols-7 gap-1 text-center mb-1">
              {DAY_LABELS.map((label, idx) => (
                <div
                  key={idx}
                  className="text-xs font-bold text-[#7A6470]/60 h-7 flex items-center justify-center"
                >
                  {label}
                </div>
              ))}
            </div>

            {/* 4. Days Grid */}
            <div className="grid grid-cols-7 gap-1 text-center">
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} className="h-8 w-8" />
              ))}

              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const isSelected =
                  tempDate.getFullYear() === viewYear &&
                  tempDate.getMonth() === viewMonth &&
                  tempDate.getDate() === day;

                const isToday =
                  new Date().getFullYear() === viewYear &&
                  new Date().getMonth() === viewMonth &&
                  new Date().getDate() === day;

                return (
                  <button
                    key={`day-${day}`}
                    type="button"
                    onClick={() => handleDayClick(day)}
                    className={`h-8 w-8 mx-auto rounded-full flex items-center justify-center text-xs font-medium transition ${
                      isSelected
                        ? "bg-[#4A1330] text-[#FFF9F5] font-bold shadow-md shadow-[#4A1330]/20 scale-105"
                        : isToday
                        ? "border border-[#C9A66B] text-[#4A1330] font-bold hover:bg-[#F8E8EC]"
                        : "text-[#2B1B24] hover:bg-[#F8E8EC]"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* 5. Action Buttons */}
        <div className="flex items-center justify-end gap-2 mt-5 pt-3 border-t border-[#F8E8EC]">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-semibold text-[#7A6470] hover:text-[#4A1330] transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-4 py-1.5 text-xs font-semibold rounded-xl bg-[#4A1330] text-[#FFF9F5] hover:opacity-90 transition shadow-xs"
          >
            Confirm Date
          </button>
        </div>
      </div>
    </div>
  );
}
