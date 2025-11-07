import { Request, Response } from "express";
import { IMentorService } from "../interfaces/IMentorService";
import { AuthenticatedRequest } from "../middlewares/auth";
import { HttpStatus } from "../constants/httpStatus";
import { Messages } from "../constants/messages";


export class MentorController {
  private mentorService: IMentorService;

  constructor(mentorService: IMentorService) {
    this.mentorService = mentorService;
  }

  public registerMentorWithCloudinary = async (req: Request, res: Response) => {
    try {
      const mentor = await this.mentorService.registerMentor(req.body, req.files);
      res.status(HttpStatus.CREATED).json({
        message: Messages.MENTOR_REGISTER_SUCCESS,
        data: mentor,
      });
    } catch (error: any) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  };


public getAllMentors = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;

    const result = await this.mentorService.getAllMentors(page, limit);

    //  FIX: Send response with consistent structure
    res.status(HttpStatus.OK).json({
      success: true,
      message: "Mentors fetched successfully",
      data: result.data 
    });
  } catch (error: any) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ 
      success: false,
      message: error.message 
    });
  }
};


  public getAllApprovedMentors = async (_req: Request, res: Response) => {
    try {
      const mentors = await this.mentorService.getApprovedMentors();
      res.status(HttpStatus.OK).json({
        message: Messages.MENTOR_FETCH_SUCCESS,
        data: mentors,
      });
    } catch (error: any) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  };

  public toggleMentorApproval = async (req: Request, res: Response) => {
    try {
      const mentor = await this.mentorService.toggleApproval(req.params.id);
      res.status(HttpStatus.OK).json({
        message: Messages.MENTOR_TOGGLE_SUCCESS,
        data: mentor,
      });
    } catch (error: any) {
      res.status(HttpStatus.NOT_FOUND).json({ message: error.message });
    }
  };

  public mentorLogin = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const result = await this.mentorService.login(email, password);
      res.status(HttpStatus.OK).json({
        message: Messages.LOGIN_SUCCESS,
        ...result,
      });
    } catch (error: any) {
      res.status(HttpStatus.UNAUTHORIZED).json({ message: error.message });
    }
  };

  public getMentorProfileController = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const mentor = await this.mentorService.getMentorProfile(req.userId!);
      res.status(HttpStatus.OK).json({ mentor });
    } catch (error: any) {
      res.status(HttpStatus.NOT_FOUND).json({ message: error.message });
    }
  };

  public changeMentorPassword = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { currentPassword, newPassword } = req.body;
      await this.mentorService.changePassword(req.userId!, currentPassword, newPassword);
      res.status(HttpStatus.OK).json({ message: Messages.PASSWORD_CHANGE_SUCCESS });
    } catch (error: any) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  };

  public updateMentorProfileController = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const mentor = await this.mentorService.updateProfile(req.userId!, req.body);
      res.status(HttpStatus.OK).json({
        message: Messages.PROFILE_UPDATE_SUCCESS,
        mentor,
      });
    } catch (error: any) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  };

  public getMentorByIdController = async (req: Request, res: Response) => {
    try {
      const mentor = await this.mentorService.getMentorById(req.params.id);
      res.status(HttpStatus.OK).json({
        success: true,
        data: mentor,
      });
    } catch (error: any) {
      res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: error.message || Messages.MENTOR_NOT_FOUND,
      });
    }
  };
}
