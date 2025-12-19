// src/repositories/slotRepository.ts
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

  /** NEW — deletes expired slots */
  async deleteExpiredSlots(mentorId: string) {
    const now = new Date();

    const slots = await this.model.find({ mentorId });

    for (const s of slots) {
      const slotDateTime = new Date(`${s.date} ${s.startTime}`);

      if (slotDateTime < now && !s.isBooked) {
        await this.model.findByIdAndDelete(s._id);
      }
    }
  }

  /** NEW — auto-delete expired slots + paginated results */
  async findSlotsByMentorPaginated(mentorId: string, skip: number, limit: number) {
    await this.deleteExpiredSlots(mentorId); // auto deletion

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
