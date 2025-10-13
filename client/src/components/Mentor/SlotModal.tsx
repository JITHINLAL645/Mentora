import React, { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface ISlot {
  _id: string;
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  isBooked: boolean;
}

interface SlotModalProps {
  slotModalVisible: boolean;
  setSlotModalVisible: (value: boolean) => void;
  selectedDate: string | null;
  setSelectedDate: (date: string) => void;
  handleAppointmentClick: (slot: ISlot) => void;
}

const SlotModal: React.FC<SlotModalProps> = ({
  slotModalVisible,
  setSlotModalVisible,
  selectedDate,
  setSelectedDate,
  handleAppointmentClick,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [slots, setSlots] = useState<ISlot[]>([]);

  // Generate slots for the selected date
  useEffect(() => {
    if (selectedDate) {
      const generatedSlots: ISlot[] = [];
      for (let hour = 9; hour < 17; hour++) {
        if (hour === 13) continue; 
        generatedSlots.push({
          _id: `${selectedDate}-${hour}`,
          date: selectedDate,
          startTime: `${hour}:00`,
          endTime: `${hour + 1}:00`,
          isAvailable: true,
          isBooked: false,
        });
      }
      setSlots(generatedSlots);
    }
  }, [selectedDate]);

  if (!slotModalVisible) return null;

  const getCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const days: {
      date: Date;
      isCurrentMonth: boolean;
      isAvailable: boolean;
      day: number;
    }[] = [];

    // Previous month's filler days
    for (let i = 0; i < firstDayOfMonth.getDay(); i++) {
      days.push({
        date: new Date(year, month, i - firstDayOfMonth.getDay() + 1),
        isCurrentMonth: false,
        isAvailable: false,
        day: new Date(year, month, i - firstDayOfMonth.getDay() + 1).getDate(),
      });
    }

    // Current month days
    for (let d = 1; d <= lastDayOfMonth.getDate(); d++) {
      const dateObj = new Date(year, month, d);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const isSunday = dateObj.getDay() === 0; // Sunday holiday
      const isPast = dateObj < today;

      days.push({
        date: dateObj,
        isCurrentMonth: true,
        isAvailable: !isSunday && !isPast, // Disable Sundays & past days
        day: d,
      });
    }

    return days;
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  return (
<div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl flex flex-col md:flex-row w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Slots Section */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Available Time Slots</h3>
            <button
              onClick={() => setSlotModalVisible(false)}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
          {selectedDate ? (
            <>
              <p className="text-gray-600 mb-6">Available slots for {selectedDate}</p>
              {slots.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {slots.map((slot) => (
                    <button
                      key={slot._id}
                      className={`p-3 rounded-lg border transition-all flex flex-col items-center ${
                        slot.isAvailable && !slot.isBooked
                          ? "bg-teal-50 border-teal-200 hover:bg-teal-100 text-teal-800"
                          : "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                      onClick={() =>
                        slot.isAvailable &&
                        !slot.isBooked &&
                        handleAppointmentClick(slot)
                      }
                      disabled={!slot.isAvailable || slot.isBooked}
                    >
                      <span className="font-medium text-sm">
                        {slot.startTime} - {slot.endTime}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No available slots for the selected date
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Please select a date to view available slots
            </div>
          )}
        </div>

        {/* Calendar Section */}
        <div className="w-full md:w-80 border-l p-6 bg-gray-50">
          <h3 className="text-xl font-semibold mb-4">Select Date</h3>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex justify-between items-center mb-4">
              <button onClick={prevMonth} className="p-1 rounded-full hover:bg-gray-100">
                <FaChevronLeft />
              </button>
              <span className="font-medium">
                {currentMonth.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <button onClick={nextMonth} className="p-1 rounded-full hover:bg-gray-100">
                <FaChevronRight />
              </button>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                <div key={d} className="text-center text-xs font-medium text-gray-500">
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {getCalendarDays().map((dayObj, index) => {
                const dateStr = dayObj.date.toLocaleDateString("en-CA"); // ✅ Local fix
                const isSelected = selectedDate === dateStr;
                return (
                  <button
                    key={index}
                    className={`h-8 w-8 rounded-full text-sm flex items-center justify-center ${
                      !dayObj.isCurrentMonth
                        ? "text-gray-300"
                        : isSelected
                        ? "bg-teal-600 text-white"
                        : dayObj.isAvailable
                        ? "hover:bg-gray-100 text-gray-800"
                        : "text-gray-400 cursor-not-allowed"
                    }`}
                    disabled={!dayObj.isAvailable || !dayObj.isCurrentMonth}
                    onClick={() => {
                      if (dayObj.isAvailable && dayObj.isCurrentMonth) {
                        setSelectedDate(dateStr);
                      }
                    }}
                  >
                    {dayObj.day}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlotModal;
