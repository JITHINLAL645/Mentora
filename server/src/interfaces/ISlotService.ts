import { ISlot } from "./ISlot";

export interface ISlotService {
  createSlots(mentorId: string, date: string, slots: Array<{ startTime: string; endTime: string }>): Promise<{ created: boolean; message: string }>;
  getSlotsByMentor(mentorId: string): Promise<ISlot[]>;
  bookSlot(slotId: string): Promise<{ success: boolean; message: string }>;
}
