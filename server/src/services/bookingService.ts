import { IBookingRepository } from "../interfaces/IBookingRepository";

export class BookingService {
  constructor(private bookingRepo: IBookingRepository) {}

  async getMySessions(userId: string, page: number, limit: number) {
    const { data, total } = await this.bookingRepo.findByUserIdPaginated(
      userId,
      page,
      limit
    );

    const sessions = data.map((s) => ({
      _id: s._id,
      mentor: {
        fullName: s.mentorId?.fullName,
        profileImg: s.mentorId?.profileImg,
        specialization: s.mentorId?.specialization,
      },
      date: s.slotId?.date,
      startTime: s.slotId?.startTime,
      endTime: s.slotId?.endTime,
      amount: s.amount,
      paymentStatus: s.paymentStatus,
      status: s.status,
      paymentIntentId: s.paymentIntentId,
      bookedAt: s.createdAt,
      slotId: s.slotId?._id, // Added to pass slotId to frontend
    }));

    return { sessions, total };
  }

  async cancelSession(bookingId: string, userId: string) {
    const booking = await this.bookingRepo.findByIdAndUser(
      bookingId,
      userId
    );

    if (!booking) {
      throw new Error("Session not found");
    }

    if (booking.status === "Cancelled") {
      throw new Error("Session already cancelled");
    }

    // Update slot to make it available again
    // Set isBooked to false AND isAvailable to true
    await this.bookingRepo.updateSlotAvailability(booking.slotId, false, true);

    const updated = await this.bookingRepo.updateStatus(bookingId, "Cancelled");

    return updated;
  }
}