import { Request, Response } from "express";
import { mentorService } from "../services/mentorService";
import { AuthenticatedRequest } from "../middlewares/auth";

export const registerMentorWithCloudinary = async (req: Request, res: Response) => {
  try {
    const mentor = await mentorService.registerMentor(req.body, req.files);
    res.status(201).json({ message: "Mentor registered successfully", mentor });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllMentors = async (_req: Request, res: Response) => {
  try {
    const mentors = await mentorService.getAllMentors();
    res.status(200).json({ data: mentors });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllApprovedMentors = async (_req: Request, res: Response) => {
  try {
    const mentors = await mentorService.getApprovedMentors();
    res.status(200).json({ data: mentors });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleMentorApproval = async (req: Request, res: Response) => {
  try {
    const mentor = await mentorService.toggleApproval(req.params.id);
    res.status(200).json({ message: "Approval status updated", data: mentor });
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

export const mentorLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await mentorService.login(email, password);
    res.status(200).json({ message: "Login successful", ...result });
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};

export const getMentorProfileController = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const mentor = await mentorService.getMentorProfile(req.userId!);
    res.status(200).json({ mentor });
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

export const changeMentorPassword = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    await mentorService.changePassword(req.userId!, currentPassword, newPassword);
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateMentorProfileController = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const mentor = await mentorService.updateProfile(req.userId!, req.body);
    res.status(200).json({ message: "Profile updated", mentor });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getMentorByIdController = async (req: Request, res: Response) => {
  try {
    const mentorId = req.params.id;
    const mentor = await mentorService.getMentorByIdService(mentorId);
    return res.status(200).json({
      success: true,
      data: mentor,
    });
  } catch (error: any) {
    return res.status(404).json({
      success: false,
      message: error.message || "Mentor not found",
    });
  }
};
