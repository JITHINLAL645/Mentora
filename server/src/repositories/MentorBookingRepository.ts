import { Model, Types } from "mongoose";
import { IBooking, Booking } from "../models/appointmentSchemas";

export class MentorBookingRepository {
  constructor(private bookingModel: Model<IBooking> = Booking) {}

  async findByMentorIdPaginated(
    mentorId: string,
    page: number,
    limit: number
  ): Promise<{ data: IBooking[]; total: number }> {
    const mid = Types.ObjectId.isValid(mentorId)
      ? new Types.ObjectId(mentorId)
      : mentorId;

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.bookingModel
        .find({ mentorId: mid })
        .populate({
          path: "userId",
          select: "name profileImage email",
        })
        .populate({
          path: "slotId",
          select: "date startTime endTime",
        })
        .skip(skip)
        .limit(limit)
        .lean(),

      this.bookingModel.countDocuments({ mentorId: mid }),
    ]);

    return { data, total };
  }
}
