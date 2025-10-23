import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs";
import { mentorRepository } from "../repositories/mentorRepository";
import { uploadToCloudinary } from "../utils/cloudinary";
import { IMentor } from "../interfaces/mentorInterface";

export class MentorService {
  async registerMentor(body: any, files: any) {
    const profileImgFile = files?.profileImg?.[0];
    const kycCertificateFile = files?.kycCertificate?.[0];

    if (!profileImgFile || !kycCertificateFile) {
      throw new Error("Profile and KYC images are required");
    }

    const profileImgUpload = await uploadToCloudinary(profileImgFile.path);
    const kycUpload = await uploadToCloudinary(kycCertificateFile.path);

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

    return await mentorRepository.create(mentorData);
  }

  async login(email: string, password: string) {
    const mentor = await mentorRepository.findOne({ email });
    if (!mentor) throw new Error("Invalid credentials");

    const isPasswordCorrect = await bcrypt.compare(password, mentor.password);
    if (!isPasswordCorrect) throw new Error("Invalid credentials");

    if (!mentor.isApproved) throw new Error("Mentor not approved");

    const token = jwt.sign(
      { id: mentor._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    return { mentor, token };
  }

  async getAllMentors() {
    return await mentorRepository.findAll();
  }

  async getApprovedMentors() {
    return await mentorRepository.findApprovedMentors();
  }

  async toggleApproval(id: string) {
    const updated = await mentorRepository.toggleApproval(id);
    if (!updated) throw new Error("Mentor not found");
    return updated;
  }

  async getMentorProfile(userId: string) {
    const mentor = await mentorRepository.findById(userId);
    if (!mentor) throw new Error("Mentor not found");
    return mentor;
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const mentor = await mentorRepository.findById(userId);
    if (!mentor) throw new Error("Mentor not found");

    const isPasswordValid = await bcrypt.compare(currentPassword, mentor.password);
    if (!isPasswordValid) throw new Error("Current password incorrect");

    mentor.password = await bcrypt.hash(newPassword, 10);
    await mentor.save();
  }

  async updateProfile(userId: string, data: Partial<IMentor>) {
    const updated = await mentorRepository.updateById(userId, data);
    if (!updated) throw new Error("Mentor not found");
    return updated;
  }
}

export const mentorService = new MentorService();
