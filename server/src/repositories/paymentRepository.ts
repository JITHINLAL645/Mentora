import { Booking } from "../models/appointmentSchemas";

export class PaymentRepository {
  async markSlotBooked({
    mentorId,
    slotId,
    userId,
    paymentIntentId,
  }: {
    mentorId: string;
    slotId: string;
    userId?: string;
    paymentIntentId: string;
  }) {
    try {
      console.log("🧾 Saving booking to DB:", { mentorId, slotId, userId, paymentIntentId });

      const booking = await Booking.create({
        mentorId,
        slotId,
        userId,
        paymentIntentId,
        status: "booked",
      });

      console.log(" Booking created:", booking);
      return booking;
    } catch (err) {
      console.error(" Error saving booking:", err);
      throw err;
    }
  }
}
