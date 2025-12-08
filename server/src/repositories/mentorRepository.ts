import { BaseRepository } from "./baseRepository";
import { IMentor } from "../models/Mentor";
import { IMentorModel } from "../interfaces/IMentorModel";

export class MentorRepository extends BaseRepository<IMentor> {
  private readonly mentorModel: IMentorModel;

  constructor(mentorModel: IMentorModel) {
    super(mentorModel as any);
    this.mentorModel = mentorModel;
  }

  async findApprovedMentors(): Promise<IMentor[]> {
    return await this.mentorModel
      .find({ isApproved: true })
      .select("-password");
  }

  async toggleApproval(id: string): Promise<IMentor | null> {
    const mentor = await this.mentorModel.findById(id);
    if (!mentor) return null;
    mentor.isApproved = !mentor.isApproved;
    await mentor.save();
    return mentor;
  }

  async findMentorById(id: string): Promise<IMentor | null> {
    return await this.mentorModel.findById(id).select("-password");
  }

  async findAllPaginated(page: number, limit: number): Promise<{ mentors: IMentor[]; total: number }> {
    const skip = (page - 1) * limit;
    const total = await this.mentorModel.countDocuments();
    const mentors = await this.mentorModel
      .find()
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return { mentors, total };
  }

 
  async getFilteredMentors(filters: any) {
    const {
      search,
      specialization,
      gender,
      experience,
      page = 1,
      limit = 10,
      sort, 
    } = filters;

    const query: any = { isApproved: true };

    // Filtering
    if (search) query.fullName = { $regex: search, $options: "i" };
    if (specialization) query.specialization = specialization;
    if (gender) query.gender = gender;
    if (experience) query.experience = { $gte: experience };

    let sortObj: any = {};

    switch (sort) {
      case "experience_asc":
        sortObj.experience = 1;
        break;
      case "experience_desc":
        sortObj.experience = -1;
        break;
      case "rating_asc":
        sortObj.rating = 1;
        break;
      case "rating_desc":
        sortObj.rating = -1;
        break;
      case "name_asc":
        sortObj.fullName = 1;
        break;
      case "name_desc":
        sortObj.fullName = -1;
        break;
      default:
        sortObj = { createdAt: -1 }; 
    }

    const skip = (page - 1) * limit;

    const mentors = await this.mentorModel
      .find(query)
      .select("-password")
      .sort(sortObj)
      .skip(skip)
      .limit(limit);

    const total = await this.mentorModel.countDocuments(query);

    return {
      mentors,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };
  }
}
