export interface IBookingRepository {
  findByUserIdPaginated(
    userId: string,
    page: number,
    limit: number
  ): Promise<{ data: any[]; total: number }>;

  findByIdAndUser(bookingId: string, userId: string): Promise<any>;

  updateSlotBooking(slotId: any, value: boolean): Promise<any>;

  updateSlotAvailability(slotId: any, isBooked: boolean, isAvailable: boolean): Promise<any>;

  updateStatus(bookingId: string, status: string): Promise<any>;
}