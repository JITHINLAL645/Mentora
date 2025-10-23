import { BaseRepository } from "./baseRepository";
import { Mentor, IMentor } from "../models/Mentor";

export class MentorRepository extends BaseRepository<IMentor> {
  constructor() {
    super(Mentor);
  }

  async findApprovedMentors(): Promise<IMentor[]> {
    return await this.model.find({ isApproved: true });
  }

  async toggleApproval(id: string): Promise<IMentor | null> {
    const mentor = await this.model.findById(id);
    if (!mentor) return null;

    mentor.isApproved = !mentor.isApproved;
    await mentor.save();
    return mentor;
  }
}

export const mentorRepository = new MentorRepository();
