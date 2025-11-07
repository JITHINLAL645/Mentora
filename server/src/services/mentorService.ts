import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs";
import { uploadToCloudinary } from "../utils/cloudinary";
import { IMentor } from "../interfaces/mentorInterface";
import { IMentorRepository } from "../interfaces/IMentorRepository";

export class MentorService {
  private mentorRepository: IMentorRepository;

  constructor(mentorRepository: IMentorRepository) {
    this.mentorRepository = mentorRepository;
  }

  /** REGISTER MENTOR WITH CLOUDINARY */
  async registerMentor(body: any, files: any) {
    try {
      const profileImgFile = files?.profileImg?.[0];
      const kycCertificateFile = files?.kycCertificate?.[0];

      if (!profileImgFile || !kycCertificateFile) {
        throw new Error("Profile and KYC images are required");
      }

      // Upload both images
      const profileImgUpload = await uploadToCloudinary(profileImgFile.path);
      const kycUpload = await uploadToCloudinary(kycCertificateFile.path);

      // Remove temp files after upload
      fs.unlinkSync(profileImgFile.path);
      fs.unlinkSync(kycCertificateFile.path);

      const hashedPassword = await bcrypt.hash(body.password, 10);

      const mentorData: Partial<IMentor> = {
        ...body,
        password: hashedPassword,
        profileImg: profileImgUpload.url,
        kycCertificate: kycUpload.url,
        experience: Number(body.experience),
        availableDays: Array.isArray(body.availableDays)
          ? body.availableDays
          : [body.availableDays],
      };

      return await this.mentorRepository.create(mentorData);
    } catch (error: any) {
      throw new Error(error.message || "Error registering mentor");
    }
  }

  /** LOGIN MENTOR */
  async login(email: string, password: string) {
    const mentor = await this.mentorRepository.findOne({ email });
    if (!mentor) throw new Error("Invalid credentials");

    const isPasswordCorrect = await bcrypt.compare(password, mentor.password);
    if (!isPasswordCorrect) throw new Error("Invalid credentials");

    if (!mentor.isApproved) throw new Error("Mentor not approved by admin");

    const token = jwt.sign(
      { id: mentor._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    const { password: _, ...mentorData } = mentor.toObject();
    return { mentor: mentorData, token };
  }

  /** GET ALL MENTORS (WITH PAGINATION) */
  async getAllMentors(page: number = 1, limit: number = 5) {
    console.log(`📄 Fetching mentors - Page: ${page}, Limit: ${limit}`);
    
    const { mentors, total } = await this.mentorRepository.findAllPaginated(page, limit);
    const totalPages = Math.ceil(total / limit);

    console.log(`✅ Found ${mentors.length} mentors out of ${total} total`);

    return {
      success: true,
      message: "Mentors fetched successfully",
      data: {
        mentors,
        total,
        currentPage: page,
        totalPages,
      },
    };
  }

  /** GET ALL APPROVED MENTORS */
  async getApprovedMentors() {
    return await this.mentorRepository.findApprovedMentors();
  }

  /** TOGGLE APPROVAL STATUS */
  async toggleApproval(id: string) {
    const updated = await this.mentorRepository.toggleApproval(id);
    if (!updated) throw new Error("Mentor not found");
    return updated;
  }

  /** GET MENTOR PROFILE BY USER ID */
  async getMentorProfile(userId: string) {
    const mentor = await this.mentorRepository.findById(userId);
    if (!mentor) throw new Error("Mentor not found");
    return mentor;
  }

  /** CHANGE PASSWORD */
  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const mentor = await this.mentorRepository.findById(userId);
    if (!mentor) throw new Error("Mentor not found");

    const isPasswordValid = await bcrypt.compare(currentPassword, mentor.password);
    if (!isPasswordValid) throw new Error("Current password is incorrect");

    mentor.password = await bcrypt.hash(newPassword, 10);
    await mentor.save();

    return { message: "Password updated successfully" };
  }

  /** UPDATE MENTOR PROFILE */
  async updateProfile(userId: string, data: Partial<IMentor>) {
    const updated = await this.mentorRepository.updateById(userId, data);
    if (!updated) throw new Error("Mentor not found");
    return updated;
  }

  /** GET MENTOR BY ID */
  async getMentorById(id: string) {
    const mentor = await this.mentorRepository.findMentorById(id);
    if (!mentor) throw new Error("Mentor not found");
    return mentor;
  }
}