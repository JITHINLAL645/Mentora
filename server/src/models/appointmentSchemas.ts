import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
  userId: mongoose.Types.ObjectId;
  mentorId: mongoose.Types.ObjectId;
  slotId: string;
  paymentIntentId: string;
  status: "pending" | "booked" | "failed";
  createdAt?: Date;
  updatedAt?: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    mentorId: { type: Schema.Types.ObjectId, ref: "Mentor", required: true },
    slotId: { type: String, required: true },
    paymentIntentId: { type: String, required: true },
    status: { type: String, enum: ["pending", "booked", "failed"], default: "booked" },
  },
  { timestamps: true }
);

export const Booking = mongoose.models.Booking || mongoose.model<IBooking>("Booking", bookingSchema);
