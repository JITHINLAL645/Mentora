import { ISlot } from "./ISlot";

export interface ISlotRepository {
  create(data: Partial<ISlot>): Promise<ISlot>;
  insertMany(items: Partial<ISlot>[]): Promise<ISlot[]>;
  findSlotsByMentor(mentorId: string): Promise<ISlot[]>;
  findSlotsByMentorAndDate(mentorId: string, date: string): Promise<ISlot[]>;
  findById(id: string): Promise<ISlot | null>;
  updateById(id: string, data: Partial<ISlot>): Promise<ISlot | null>;
}
