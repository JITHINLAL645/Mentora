export interface ISlot {
  _id?: string;
  mentorId: string;
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  isBooked: boolean;
}
