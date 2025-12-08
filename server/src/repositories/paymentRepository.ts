import { Booking } from "../models/appointmentSchemas";

export class PaymentRepository {
  async markSlotBooked({
    mentorId,
    slotId,
    userId,
    paymentIntentId,
    amount,
  }: {
    mentorId: string;
    slotId: string;
    userId?: string;
    paymentIntentId: string;
    amount: number;
  }) {
    try {
      console.log(" Saving booking to DB:", { 
        mentorId, 
        slotId, 
        userId, 
        paymentIntentId,
        amount  
      });

      const booking = await Booking.create({
        mentorId,
        slotId,
        userId,
        paymentIntentId,
        amount,   
        status: "booked",
        paymentStatus: "paid",
      });

      console.log(" Booking created:", booking);
      return booking;
    } catch (err) {
      console.error(" Error saving booking:", err);
      throw err;
    }
  }
}
