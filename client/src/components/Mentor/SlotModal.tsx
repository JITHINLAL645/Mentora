import React, { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { getSlotsByMentor } from "../../services/slotService";
import { toast } from "sonner";

// Slot Type
interface ISlot {
  _id?: string;
  mentorId: string;
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  isBooked: boolean;
}

// Props
interface SlotModalProps {
  slotModalVisible: boolean;
  setSlotModalVisible: (value: boolean) => void;
  selectedDate: string | null;
  setSelectedDate: (date: string) => void;
  handleAppointmentClick: (slot: ISlot) => Promise<boolean>;
  mentorId: string;
  removeSlot: (slotId: string) => void;  
    refreshSlots?: () => void; // new

}

// Date formatter (safe, no timezone issues)
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
  setSlotModalVisible,  // fixed
  selectedDate,
  setSelectedDate,
  handleAppointmentClick,
  mentorId,
  removeSlot,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [slots, setSlots] = useState<ISlot[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch ALL slots for the mentor (no pagination limit)
  const fetchAllSlots = async () => {
    if (!mentorId) return;

    try {
      setLoading(true);
      // We fetch up to 500 slots – more than enough for a mentor
      const res = await getSlotsByMentor(mentorId, 1, 500);
      return res.data?.slots || [];
    } catch (err) {
      console.error("Failed to load slots:", err);
      toast.error("Failed to load slots");
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Load slots whenever modal opens or selectedDate changes
  useEffect(() => {
    if (!slotModalVisible) return;

    const load = async () => {
      const allSlots = await fetchAllSlots();

      if (selectedDate) {
        const filtered = allSlots.filter((s: ISlot) => s.date === selectedDate);
        setSlots(filtered);
      } else {
        setSlots([]);
      }
    };

    load();
  }, [selectedDate, slotModalVisible, mentorId]);

  // Calendar logic (unchanged)
  const getCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    for (let i = 0; i < firstDay.getDay(); i++) {
      const d = new Date(year, month, i - firstDay.getDay() + 1);
      days.push({ date: d, isCurrentMonth: false, day: d.getDate(), isAvailable: false });
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

  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  if (!slotModalVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl flex flex-col md:flex-row w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* LEFT: SLOT LIST */}
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
              <p className="text-gray-600 mb-6">
                Available slots for <b>{new Date(selectedDate).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</b>
              </p>

              {loading ? (
                <div className="text-center py-6 text-gray-500">Loading slots...</div>
              ) : slots.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {slots.map((slot) => (
                    <button
                      key={slot._id}
                      className={`p-3 rounded-lg border transition-all ${
                        slot.isAvailable && !slot.isBooked
                          ? "bg-teal-50 border-teal-300 hover:bg-teal-100 text-teal-700 font-medium"
                          : "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed"
                      }`}
                      disabled={!slot.isAvailable || slot.isBooked}
                      onClick={async () => {
                        if (slot.isAvailable && !slot.isBooked) {
                          const success = await handleAppointmentClick(slot);
                          if (success) {
                            removeSlot(slot._id!);
                            setSlots((prev) => prev.filter((s) => s._id !== slot._id));
                          }
                        }
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

        {/* RIGHT: CALENDAR */}
        <div className="w-full md:w-80 border-l p-6 bg-gray-50">
          <h3 className="text-xl font-semibold mb-4">Select Date</h3>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-center mb-3">
              <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded-full">
                <FaChevronLeft />
              </button>
              <span className="font-medium">
                {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </span>
              <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded-full">
                <FaChevronRight />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-1 text-xs font-medium text-gray-500">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                <div key={d} className="text-center">{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {getCalendarDays().map((day, i) => {
                const dateStr = formatDate(day.date);
                const isSelected = selectedDate === dateStr;

                return (
                  <button
                    key={i}
                    disabled={!day.isAvailable || !day.isCurrentMonth}
                    onClick={() => setSelectedDate(dateStr)}
                    className={`h-8 w-8 rounded-full text-sm flex items-center justify-center 
                      ${!day.isCurrentMonth ? "text-gray-300" :
                        isSelected ? "bg-teal-600 text-white" :
                        day.isAvailable ? "hover:bg-gray-100 text-gray-800" :
                        "text-gray-400 cursor-not-allowed"
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