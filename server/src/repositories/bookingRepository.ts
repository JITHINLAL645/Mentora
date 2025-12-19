import { Model, Types } from "mongoose";
import { IBookingRepository } from "../interfaces/IBookingRepository";
import { BookingDocument } from "../models/appointmentSchemas";
import SlotModel from "../models/slotModel";

export class BookingRepository implements IBookingRepository {
  constructor(private bookingModel: Model<BookingDocument>) {}

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
          select: "fullName profileImg specialization",
        })
        .populate({
          path: "slotId",
          select: "date startTime endTime",
        })
        .sort({ createdAt: -1 }) // Show newest bookings first
        .skip(skip)
        .limit(limit)
        .lean(),

      this.bookingModel.countDocuments({ userId: uid }),
    ]);

    return { data, total };
  }

  async findByIdAndUser(bookingId: string, userId: string) {
    return this.bookingModel.findOne({
      _id: bookingId,
      userId,
    });
  }

  // OLD METHOD - keeping for backward compatibility but deprecated
  async updateSlotBooking(slotId: any, value: boolean) {
    return SlotModel.findByIdAndUpdate(slotId, { isBooked: value });
  }

  // NEW METHOD - updates both isBooked and isAvailable
  async updateSlotAvailability(slotId: any, isBooked: boolean, isAvailable: boolean) {
    return SlotModel.findByIdAndUpdate(
      slotId,
      { 
        isBooked: isBooked,
        isAvailable: isAvailable 
      },
      { new: true }
    );
  }

  async updateStatus(bookingId: string, status: string) {
    return this.bookingModel.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true }
    );
  }
}