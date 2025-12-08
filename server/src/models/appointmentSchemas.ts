import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
  userId: mongoose.Types.ObjectId;
  mentorId: mongoose.Types.ObjectId;
  slotId: mongoose.Types.ObjectId;
  paymentIntentId: string;
  status: "pending" | "booked" | "completed" | "cancelled" | "failed";
  paymentStatus: "paid" | "unpaid";
  amount?: number;
  sessionLink?: string;
  reviewId?: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    mentorId: { type: Schema.Types.ObjectId, ref: "Mentor", required: true },
    slotId: { type: Schema.Types.ObjectId, ref: "Slot", required: true },

    paymentIntentId: { type: String, required: true },

    status: {
      type: String,
      enum: ["pending", "booked", "completed", "cancelled", "failed"],
      default: "pending", 
    },

    paymentStatus: {
      type: String,
      enum: ["paid", "unpaid"],
      default: "unpaid",
    },

    amount: {
      type: Number,
      default: 0,
    },

    sessionLink: { type: String },

    reviewId: {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  },
  { timestamps: true }
);

export const Booking =
  mongoose.models.Booking || mongoose.model<IBooking>("Booking", bookingSchema);
