import { BaseRepository } from "./baseRepository";
import { Mentor, IMentor } from "../models/Mentor";

export class MentorRepository extends BaseRepository<IMentor> {
  constructor() {
    super(Mentor);
  }

  async findApprovedMentors(): Promise<IMentor[]> {
    return await this.model.find({ isApproved: true }).select("-password");
  }

  async toggleApproval(id: string): Promise<IMentor | null> {
    const mentor = await this.model.findById(id);
    if (!mentor) return null;
    mentor.isApproved = !mentor.isApproved;
    await mentor.save();
    return mentor;
  }

  async findMentorById(id: string): Promise<IMentor | null> {
    return await this.model.findById(id).select("-password");
  }

  async findAllPaginated(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const total = await this.model.countDocuments();
    const mentors = await this.model
      .find()
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return { mentors, total };
  }
}

export const mentorRepository = new MentorRepository();
