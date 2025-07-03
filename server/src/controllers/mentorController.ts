import { Request, Response } from "express";
import { createMentor } from "../repositories/mentorRepository";
import { Mentor } from "../models/Mentor";
import { uploadToCloudinary } from "../utils/cloudinary";
import fs from "fs";
import { IMentor } from "../interfaces/mentorInterface";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerMentorWithCloudinary = async (req: Request, res: Response) => {
  try {
    const { body, files } = req;

    const profileImgFile = (files as any)?.profileImg?.[0];
    const kycCertificateFile = (files as any)?.kycCertificate?.[0];

    if (!profileImgFile || !kycCertificateFile) {
      return res.status(400).json({ message: "Profile and KYC images are required" });
    }

    const profileImgUpload = await uploadToCloudinary(profileImgFile.path);
    const kycUpload = await uploadToCloudinary(kycCertificateFile.path);

    fs.unlinkSync(profileImgFile.path);
    fs.unlinkSync(kycCertificateFile.path);

    const hashedPassword = await bcrypt.hash(body.password, 10);

    const mentorData:Partial<IMentor> = {
      ...body,
      password: hashedPassword,
      profileImg: profileImgUpload.url,
      kycCertificate: kycUpload.url,
      experience: Number(body.experience),
      availableDays: Array.isArray(body.availableDays)
        ? body.availableDays
        : [body.availableDays],
    };

    const mentor = await createMentor(mentorData);

    res.status(201).json({
      message: "Mentor registered successfully",
      mentor,
    });
  } catch (error: any) {
    console.error("Mentor Registration (Cloudinary) Error:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

export const getAllMentors = async (_req: Request, res: Response) => {
  try {
    const mentors = await Mentor.find();
    res.status(200).json({ message: "Mentors fetched successfully", data: mentors });
  } catch (error: any) {
    console.error("Get Mentors Error:", error);
    res.status(500).json({ message: error.message || "Failed to fetch mentors" });
  }
};

export const toggleMentorApproval = async (req: Request, res: Response) => {
  try {
    const mentor = await Mentor.findById(req.params.id);
    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }

    mentor.isApproved = !mentor.isApproved;
    await mentor.save();

    res.status(200).json({ message: "Approval status updated", data: mentor });
  } catch (error: any) {
    console.error("Toggle Approval Error:", error);
    res.status(500).json({ message: error.message || "Failed to toggle approval status" });
  }
};

export const getAllApprovedMentors = async (_req: Request, res: Response) => {
  try {
    const mentors = await Mentor.find({ isApproved: true });
    res.json({ data: mentors });
  } catch (error: any) {
    console.error("Get Approved Mentors Error:", error);
    res.status(500).json({ message: "Failed to fetch approved mentors." });
  }
};








export const mentorLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    console.log("Login attempt:", email, password);

    const mentor = await Mentor.findOne({ email });

    if (!mentor) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log("Mentor found:", mentor);

    const isPasswordCorrect = await bcrypt.compare(password, mentor.password); 

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!mentor.isApproved) {
      return res.status(403).json({ message: "Mentor not approved" });
    }

    const token = jwt.sign({ id: mentor._id }, process.env.JWT_SECRET as string, {
      expiresIn: "7d",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      mentor,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const getMentorProfileController = async (req: Request, res: Response) => {
  const mentor = await Mentor.findById(req.userId); // assuming userId is set in middleware
  if (!mentor) {
    return res.status(404).json({ message: "Mentor not found" });
  }
  res.status(200).json({ mentor });
};


interface AuthRequest extends Request {
  userId?: string;
}


export const changeMentorPassword = async (req: Request, res: Response) => {
  try {
    
    const { currentPassword, newPassword } = req.body;
    const mentorId = (req as any).userId;
    console.log("Received currentPassword:", currentPassword);

    const mentor = await Mentor.findById(mentorId);
    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, mentor.password);
    console.log("Mentor.password (hashed):", mentor.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    mentor.password = hashedPassword;
    await mentor.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Password update error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


export const updateMentorProfileController = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const mentorId = req.userId;
    const { fullName, education, about, experience } = req.body;

    const updatedMentor = await Mentor.findByIdAndUpdate(
      mentorId,
      { fullName, education, about, experience },
      { new: true }
    );

    if (!updatedMentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }

    res.status(200).json({ message: "Profile updated", mentor: updatedMentor });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

