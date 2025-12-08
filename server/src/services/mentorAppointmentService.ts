import { IBookingRepository } from "../interfaces/IBookingRepository";

export class MentorAppointmentService {
  private bookingRepo: IBookingRepository;

  constructor(bookingRepo: IBookingRepository) {
    this.bookingRepo = bookingRepo;
  }

  async getMentorAppointmentsPaginated(
    mentorId: string,
    page: number,
    limit: number
  ) {
    const { data, total } =
      await this.bookingRepo.findByMentorIdPaginated(mentorId, page, limit);

    const appointments = data.map((b: any) => ({
      _id: b._id,
      user: {
        name: b.userId?.name,
        profileImage: b.userId?.profileImage,
      },
      date: b.slotId?.date,
      startTime: b.slotId?.startTime,
      endTime: b.slotId?.endTime,
      status: b.status,
    }));

    return { appointments, total };
  }
}
