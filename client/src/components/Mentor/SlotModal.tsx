// src/components/SlotModal/SlotModal.tsx
import React, { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { getSlotsByMentor } from "../../services/slotService";
import { toast } from "sonner";

interface ISlot {
  _id?: string;
  mentorId: string;
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
  handleAppointmentClick: (slot: ISlot) => Promise<boolean>;
  mentorId: string;
  removeSlot: (slotId: string) => void;
}

const formatDate = (date: Date) => {
  return (
    date.getFullYear() +
    "-" +
    String(date.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(date.getDate()).padStart(2, "0")
  );
};

const SlotModal: React.FC<SlotModalProps> = ({
  slotModalVisible,
  setSlotModalVisible,
  selectedDate,
  setSelectedDate,
  handleAppointmentClick,
  mentorId,
  removeSlot,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [slots, setSlots] = useState<ISlot[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSlots = async () => {
    try {
      if (!mentorId || !selectedDate) return;

      setLoading(true);
      const res = await getSlotsByMentor(mentorId, 1, 200);
      const allSlots = res.data?.slots || [];

      setSlots(allSlots.filter((s: ISlot) => s.date === selectedDate));
    } catch (err) {
      toast.error("Failed to load slots");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slotModalVisible) fetchSlots();
  }, [selectedDate, slotModalVisible]);

  // Calendar Rendering -------------------
  const getCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const days = [];
    for (let i = 0; i < firstDay.getDay(); i++) {
      const d = new Date(year, month, i - firstDay.getDay() + 1);
      days.push({
        date: d,
        isCurrentMonth: false,
        day: d.getDate(),
        isAvailable: false,
      });
    }

    for (let d = 1; d <= lastDay.getDate(); d++) {
      const dt = new Date(year, month, d);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const isPast = dt < today;
      const isSunday = dt.getDay() === 0;

      days.push({
        date: dt,
        isCurrentMonth: true,
        isAvailable: !isPast && !isSunday,
        day: d,
      });
    }
    return days;
  };

  const prevMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );

  const nextMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );

  if (!slotModalVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl flex flex-col md:flex-row w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* LEFT */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Available Time Slots</h3>
            <button onClick={() => setSlotModalVisible(false)}>×</button>
          </div>

          {selectedDate ? (
            <>
              {loading ? (
                <div className="text-center py-6 text-gray-500">
                  Loading slots...
                </div>
              ) : slots.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {slots.map((slot) => (
                    <button
                      key={slot._id}
                      className={`p-3 rounded-lg border transition-all ${
                        slot.isAvailable && !slot.isBooked
                          ? "bg-teal-50 border-teal-300 hover:bg-teal-100"
                          : "bg-gray-100 border-gray-300 text-gray-400"
                      }`}
                      disabled={!slot.isAvailable || slot.isBooked}
                      onClick={async () => {
                        const success = await handleAppointmentClick(slot);
                        if (success) removeSlot(slot._id!);
                      }}
                    >
                      {slot.startTime} - {slot.endTime}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  No available slots on this date
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-6 text-gray-500">
              Please select a date from the calendar
            </div>
          )}
        </div>

        {/* RIGHT — CALENDAR */}
        <div className="w-full md:w-80 border-l p-6 bg-gray-50">
          <h3 className="text-xl font-semibold mb-4">Select Date</h3>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-center mb-3">
              <button onClick={prevMonth}>
                <FaChevronLeft />
              </button>

              <span>
                {currentMonth.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </span>

              <button onClick={nextMonth}>
                <FaChevronRight />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-1 text-xs font-medium text-gray-500">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                <div key={d}>{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {getCalendarDays().map((day, i) => {
                const dateStr = formatDate(day.date);
                return (
                  <button
                    key={i}
                    disabled={!day.isAvailable || !day.isCurrentMonth}
                    onClick={() => setSelectedDate(dateStr)}
                    className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      selectedDate === dateStr
                        ? "bg-teal-600 text-white"
                        : day.isAvailable
                        ? "hover:bg-gray-100"
                        : "text-gray-400"
                    }`}
                  >
                    {day.day}
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
