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
      userId: s.userId,
      mentor: s.mentorId
        ? {
            _id: s.mentorId._id,
            fullName: s.mentorId.fullName,
            profileImg: s.mentorId.profileImg,
            specialization: s.mentorId.specialization,
            email: s.mentorId.email,
          }
        : null,
      mentorId: s.mentorId?._id,
      date: s.slotId?.date,
      startTime: s.slotId?.startTime,
      endTime: s.slotId?.endTime,
      amount: s.amount,
      paymentStatus: s.paymentStatus,
      status: s.status,
      paymentIntentId: s.paymentIntentId,
      bookedAt: s.createdAt,
      slotId: s.slotId?._id,
    }));

    return { sessions, total };
  }

  async cancelSession(bookingId: string, userId: string) {
    const booking = await this.bookingRepo.findByIdAndUser(bookingId, userId);

    if (!booking) {
      throw new Error("Session not found");
    }

    if (booking.status === "Cancelled") {
      throw new Error("Session already cancelled");
    }

    await this.bookingRepo.updateSlotAvailability(
      booking.slotId,
      false,
      true
    );

    return this.bookingRepo.updateStatus(bookingId, "Cancelled");
  }

  // ================================
  // MENTOR → BOOKED MENTEES (CHAT)
  // ================================
  async getBookedMenteesForMentor(mentorId: string) {
    const bookings = await this.bookingRepo.findBookedMenteesByMentor(mentorId);

    const menteeMap = new Map<string, any>();

    for (const booking of bookings) {
      if (booking.userId && booking.userId._id) {
        menteeMap.set(
          booking.userId._id.toString(),
          booking.userId
        );
      }
    }

    return Array.from(menteeMap.values());
  }
}
