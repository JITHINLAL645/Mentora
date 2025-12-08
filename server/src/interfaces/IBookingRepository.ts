import { BookingDocument } from "../models/appointmentSchemas";

export interface IBookingRepository {
  findByUserIdPaginated(
    userId: string,
    page: number,
    limit: number
  ): Promise<{ data: BookingDocument[]; total: number }>;

  findByIdAndUser(
    bookingId: string,
    userId: string
  ): Promise<BookingDocument | null>;

  updateSlotBooking(
    slotId: string,
    value: boolean
  ): Promise<any>;

  updateStatus(
    bookingId: string,
    status: string
  ): Promise<BookingDocument | null>;
}
