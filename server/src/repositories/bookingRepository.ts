import { Model, Types } from "mongoose";
import { IBookingRepository } from "../interfaces/IBookingRepository";
import { BookingDocument } from "../models/appointmentSchemas";
import SlotModel from "../models/slotModel";

export class BookingRepository implements IBookingRepository {
  constructor(private bookingModel: Model<BookingDocument>) {}

  // ================================
  // USER BOOKINGS (PAGINATED)
  // ================================
  async findByUserIdPaginated(
    userId: string,
    page: number,
    limit: number
  ) {
    const uid = Types.ObjectId.isValid(userId)
      ? new Types.ObjectId(userId)
      : userId;

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.bookingModel
        .find({ userId: uid })
        .populate({
          path: "mentorId",
          select: "fullName profileImg specialization email",
        })
        .populate({
          path: "slotId",
          select: "date startTime endTime",
        })
        .populate({
          path: "userId",
          select: "name email fullName profileImg",
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      this.bookingModel.countDocuments({ userId: uid }),
    ]);

    return { data, total };
  }

  // ================================
  // FIND SINGLE BOOKING
  // ================================
  async findByIdAndUser(bookingId: string, userId: string) {
    return this.bookingModel.findOne({
      _id: bookingId,
      userId,
    });
  }

  // ================================
  // MENTOR → BOOKED MENTEES (CHAT)
  // ================================
  async findBookedMenteesByMentor(mentorId: string) {
    const mid = Types.ObjectId.isValid(mentorId)
      ? new Types.ObjectId(mentorId)
      : mentorId;

    return this.bookingModel
      .find({ mentorId: mid })
      .populate({
        path: "userId",
        select: "name email profileImg",
      })
      .select("userId")
      .lean();
  }

  // ================================
  // SLOT UPDATES (OLD - DEPRECATED)
  // ================================
  async updateSlotBooking(slotId: any, value: boolean) {
    return SlotModel.findByIdAndUpdate(slotId, { isBooked: value });
  }

  // ================================
  // SLOT AVAILABILITY (NEW)
  // ================================
  async updateSlotAvailability(
    slotId: any,
    isBooked: boolean,
    isAvailable: boolean
  ) {
    return SlotModel.findByIdAndUpdate(
      slotId,
      {
        isBooked,
        isAvailable,
      },
      { new: true }
    );
  }

  // ================================
  // BOOKING STATUS UPDATE
  // ================================
  async updateStatus(bookingId: string, status: string) {
    return this.bookingModel.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true }
    );
  }
}
