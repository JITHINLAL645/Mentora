import { BaseRepository } from "./baseRepository";
import { ISlot } from "../interfaces/ISlot";
import { Model } from "mongoose";

export class SlotRepository extends BaseRepository<ISlot> {
  constructor(model: Model<ISlot>) {
    super(model);
  }

  async findSlotsByMentor(mentorId: string) {
    return this.model.find({ mentorId }).sort({ date: 1, startTime: 1 });
  }

  async findSlotsByMentorAndDate(mentorId: string, date: string) {
    return this.model.find({ mentorId, date });
  }

  // New: paginated query
  async findSlotsByMentorPaginated(mentorId: string, skip: number, limit: number) {
    const [slots, total] = await Promise.all([
      this.model
        .find({ mentorId })
        .sort({ date: 1, startTime: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.model.countDocuments({ mentorId }),
    ]);
    return { slots, total };
  }
}