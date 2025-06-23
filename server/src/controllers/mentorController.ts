import { Request, Response } from "express";
import { createMentor } from "../repositories/mentorRepository";
import { Mentor } from "../models/Mentor";

export const registerMentor = async (req: Request, res: Response) => {
  try {
    const { body, files } = req;

const profileImg = (files as any)?.profileImg?.[0]?.filename;
const kycCertificate = (files as any)?.kycCertificate?.[0]?.filename;


    const mentorData = {
      ...body,
      profileImg, 
      kycCertificate,
      experience: Number(body.experience),
      availableDays: Array.isArray(body.availableDays)
        ? body.availableDays
        : [body.availableDays],
    };

    const mentor = await createMentor(mentorData);
    res.status(201).json(mentor);
  } catch (err: any) {
    console.error("Mentor Registration Error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};


export const getAllMentors = async (req: Request, res: Response) => {
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch mentors." });
  }
};