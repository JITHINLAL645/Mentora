import React, { useState } from "react";
import { createSlots } from "../../services/slotService";
import { toast } from "sonner";
import MentorSidebar from "../../components/Mentor/MentorSidebar";

const MentorSlotManager: React.FC = () => {
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState<{ startTime: string; endTime: string }[]>([
    { startTime: "", endTime: "" },
  ]);

  const handleAddSlot = () => {
    setSlots([...slots, { startTime: "", endTime: "" }]);
  };

  const handleSlotChange = (index: number, field: "startTime" | "endTime", value: string) => {
    const updated = [...slots];
    updated[index][field] = value;
    setSlots(updated);
  };

  const handleSubmit = async () => {
    const mentorId = sessionStorage.getItem("mentorId");

    if (!mentorId) {
      toast.error("Mentor ID not found!");
      return;
    }

    if (!date) {
      toast.error("Please select a date");
      return;
    }

    // ⭐ FILTER EMPTY SLOTS
    const validSlots = slots.filter(
      (s) => s.startTime.trim() !== "" && s.endTime.trim() !== ""
    );

    if (validSlots.length === 0) {
      toast.error("Please add at least one valid slot");
      return;
    }

    const payload = {
      mentorId,
      date,
      slots: validSlots,
    };

    try {
      console.log("📤 Sending payload:", payload);
      await createSlots(payload);

      toast.success("Slots created successfully!");

      setDate("");
      setSlots([{ startTime: "", endTime: "" }]);
    } catch (error) {
      console.error("❌ Error creating slots:", error);
      toast.error("Failed to create slots");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-64 bg-white border-r shadow-md">
        <MentorSidebar />
      </div>

      <div className="flex-1 flex justify-center items-center py-10">
        <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-lg">
          <h2 className="text-2xl font-semibold mb-6 text-center text-teal-700">
            Create Available Slots
          </h2>

          {/* Date Picker */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-600">
              Select Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Slots */}
          {slots.map((slot, index) => (
            <div key={index} className="flex gap-2 mb-3">
              <input
                type="time"
                value={slot.startTime}
                onChange={(e) => handleSlotChange(index, "startTime", e.target.value)}
                className="border p-2 rounded w-1/2"
              />

              <input
                type="time"
                value={slot.endTime}
                onChange={(e) => handleSlotChange(index, "endTime", e.target.value)}
                className="border p-2 rounded w-1/2"
              />
            </div>
          ))}

          <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6">
            <button
              onClick={handleAddSlot}
              className="w-full sm:w-auto bg-gray-200 py-2 px-4 rounded hover:bg-gray-300"
            >
              + Add Another Slot
            </button>

            <button
              onClick={handleSubmit}
              className="w-full sm:w-auto bg-teal-600 text-white py-2 px-6 rounded hover:bg-teal-700"
            >
              Save Slots
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorSlotManager;
