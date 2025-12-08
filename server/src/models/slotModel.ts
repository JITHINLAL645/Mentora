import mongoose from "mongoose";

const slotSchema = new mongoose.Schema({
  mentorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Mentor",
    required: true,
  },
  date: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  isAvailable: { type: Boolean, default: true },
  isBooked: { type: Boolean, default: false },
});

const Slot = mongoose.model("Slot", slotSchema);
export default Slot;
